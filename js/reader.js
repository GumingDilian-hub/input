/* ========== 配置与常量 ========== */
const CONFIG = {
    COMMENT_API: 'https://woxiangcaoni.2167964516.workers.dev', // 请确保这是你的 Worker 地址
    ADMIN_USERNAME: 'loading', // 站主账号
    CHAPTERS: [
        'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
        'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
        'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
        'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
        'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
    ],
    AUTHOR_MD: 'notes/000/index.md',
    DEFAULT_AVATAR: 'images/0721.png'
};

/* ========== 全局状态 ========== */
let state = {
    user: null, // { username, token }
    comments: {}, // 缓存评论数据 { sectionId: { comments: [], page: 1 } } 或直接数组
    scrollSpyActive: false
};

/* ========== 工具函数 ========== */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// 更健壮的 safeFetch：根据 content-type 解析，处理 204/非 JSON
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            // 返回结构中可能包含错误信息，先尝试解析 text/json
            let errText = res.statusText || `HTTP ${res.status}`;
            try {
                const ct = res.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    const j = await res.json();
                    errText = j.message || JSON.stringify(j);
                } else {
                    const t = await res.text();
                    if (t) errText = t;
                }
            } catch (e) {}
            throw new Error(errText);
        }
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) return await res.json();
        if (ct.includes('text/') || ct === '') return await res.text();
        // 对于无返回体或其他类型，返回原 response 以供上层处理
        return res;
    } catch (error) {
        console.error(`Fetch Error [${url}]:`, error);
        return null;
    }
}

/* ========== 初始化入口 ========== */
document.addEventListener('DOMContentLoaded', async () => {
    const overlay = $('#loading-overlay');

    // 并行加载所有章节（改为 Promise.allSettled 并按原序处理）
    await loadAllContent();

    // 移除 Loading
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 500);
    }

    // 初始化 UI 组件
    try {
        initSidebar();
        initSearch();
        initScrollSpy();
        initProgress();
        initAuthorPanel();
        initChapterSelect();

        // 恢复用户登录状态
        restoreUserSession();

        // 渲染所有评论区结构（使用 DOM API，避免内联 onclick）
        const body = $('#article-body');
        if (body) {
            injectCommentSections(body);
            setupGlobalCommentListeners();
        }
    } catch (e) {
        console.error("Init Error:", e);
    }
});

/* ========== 核心内容加载 ========== */
async function loadAllContent() {
    const body = $('#article-body');
    const progressText = $('#progress-text');
    if (!body) return;

    const total = CONFIG.CHAPTERS.length;
    const fetchPromises = CONFIG.CHAPTERS.map((path) =>
        fetch(path)
            .then(resp => resp.ok ? resp.text() : Promise.reject(new Error('404')))
            .then(text => processMarkdown(text, path))
            .catch(err => {
                console.warn(`Load failed: ${path}`, err);
                return { meta: null, content: '', chapterNum: 'unknown' };
            })
    );

    // 等待全部完成（不阻塞单个较慢项的进度更新）
    const settled = await Promise.allSettled(fetchPromises);

    const results = settled.map((s, i) => {
        if (s.status === 'fulfilled') return s.value;
        return { meta: null, content: '', chapterNum: CONFIG.CHAPTERS[i].split('/')[1] || 'unknown' };
    });

    // 渲染版本信息
    renderVersionInfo(results);

    // 分批渲染 DOM (避免主线程卡死)
    if (progressText) progressText.textContent = '正在渲染 DOM...';
    body.innerHTML = '';

    for (let i = 0; i < results.length; i++) {
        const chunk = results[i].content;
        if (!chunk) continue;

        // 使用统一 wrapper 类名：section-wrapper
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-wrapper clearfix';

        // 安全解析 Markdown
        try {
            sectionDiv.innerHTML = marked.parse(chunk);
        } catch (e) {
            sectionDiv.innerHTML = `<p>[解析错误]</p>`;
        }

        // 图片处理
        postProcessImages(sectionDiv, results[i].chapterNum);
        postProcessFigure(sectionDiv);
        sectionDiv.querySelectorAll('pre code').forEach(b => {
            try { hljs.highlightElement(b); } catch (e) { }
        });

        body.appendChild(sectionDiv);

        // 更新进度文本
        if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${total}`;

        // 每 3 章节让出主线程，保持 UI 响应
        if (i % 3 === 2) await new Promise(r => requestAnimationFrame(r));
    }

    // 后处理
    renderMath();
    buildTOC();

    // 如果进度条还在，隐藏它
    if (progressText) progressText.parentElement.classList.add('hidden');
}

/* ========== Markdown 预处理 ========== */
function processMarkdown(md, path) {
    const { meta, content } = extractAndRemoveFrontMatter(md);
    const chapterNum = path.split('/')[1] || '000';

    let processedContent = content
        // 图片路径修正：支持 http(s): / 开头、data:, ./ ../ 情况
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
            src = src.trim();
            if (!/^(https?:|\/|data:)/i.test(src)) {
                // 移除前导 ./ 或 ../
                src = src.replace(/^\.\/+/, '').replace(/^\.\.\//, '');
                return `![${alt}](images/${chapterNum}/${src})`;
            }
            return m;
        })
        // 特殊图片标签处理（:::image pos filename caption :::）
        .replace(/:::image\s+([^\s]+)?\s*([^\s]+)\s*(.*?)\s*:::/g, (m, pos, filename, caption) => {
            pos = pos || 'center';
            if (!/^(https?:|\/|data:)/i.test(filename)) {
                filename = `images/${chapterNum}/${filename}`;
            }
            // 转成标准 HTML，交由 postProcessFigure 进一步处理
            return `<div class="iwp-figure" data-pos="${pos}"><img src="${filename}" alt="${escapeHtml(caption || '')}"><div class="figure-caption">${escapeHtml(caption || '')}</div></div>`;
        });

    return { meta, content: processedContent, chapterNum };
}

function extractAndRemoveFrontMatter(md) {
    const lines = md.split(/\r?\n/);
    if (lines[0].trim() !== '---') return { content: md, meta: null };
    const end = lines.indexOf('---', 1);
    if (end === -1) return { content: md, meta: null };

    const fmLines = lines.slice(1, end);
    const meta = {};
    fmLines.forEach(line => {
        const m = line.match(/^([\w-]+):\s*(.*)/);
        if (m) {
            let key = m[1], val = m[2].trim();
            if (key === 'tags') {
                // 简单解析数组形式
                if (val.startsWith('[') && val.endsWith(']')) {
                    try {
                        meta[key] = val.slice(1, -1).split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
                    } catch (e) {
                        meta[key] = val;
                    }
                } else {
                    meta[key] = val.split(',').map(t => t.trim()).filter(Boolean);
                }
            } else {
                // 去掉两侧引号
                meta[key] = val.replace(/^['"]|['"]$/g, '');
            }
        }
    });

    let content = lines.slice(end + 1).join('\n').replace(/^\n+/, '');
    return { content, meta };
}

/* ========== 图片与图表后处理 ========== */
function postProcessImages(container, chapterNum) {
    container.querySelectorAll('img').forEach(img => {
        // 容错：添加加载失败处理
        img.onerror = function () {
            console.warn('Image broken:', this.src);
            this.src = CONFIG.DEFAULT_AVATAR; // 使用占位图（可替换）
        };

        const alt = img.alt || '';
        const match = alt.match(/\{(left|right|around|center)\s*(?:width=(\d+))?\}/);
        if (match) {
            const pos = match[1], width = match[2];
            if (width) img.style.width = width + 'px';
            img.classList.add('iwp-img-' + pos);
            img.alt = alt.replace(match[0], '').trim();
        } else {
            // 若父元素是 .iwp-figure 并带 data-pos，则使用该值
            const fig = img.closest('.iwp-figure');
            if (fig) {
                const pos = fig.getAttribute('data-pos') || 'center';
                img.classList.add('iwp-img-' + pos);
            } else {
                img.classList.add('iwp-img-center');
            }
        }
    });
}

function postProcessFigure(container) {
    // 将 .iwp-figure 结构规范化为 figure-container
    container.querySelectorAll('.iwp-figure').forEach(node => {
        const pos = node.getAttribute('data-pos') || 'center';
        const img = node.querySelector('img');
        const caption = node.querySelector('.figure-caption') ? node.querySelector('.figure-caption').textContent : '';
        const wrapper = document.createElement('div');
        wrapper.className = `figure-container figure-${pos}`;
        const imgEl = document.createElement('img');
        imgEl.src = img ? img.getAttribute('src') : '';
        imgEl.alt = caption ? escapeHtml(caption) : '';
        imgEl.className = `iwp-img-${pos}`;
        const cap = document.createElement('div');
        cap.className = 'figure-caption';
        cap.textContent = caption ? caption : '';
        wrapper.appendChild(imgEl);
        wrapper.appendChild(cap);
        node.parentNode.replaceChild(wrapper, node);
    });
}

/* ========== 渲染数学公式 ========== */
function renderMath() {
    const body = $('#article-body');
    if (body && typeof renderMathInElement === 'function') {
        renderMathInElement(body, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

/* ========== 版本信息渲染 ========== */
function renderVersionInfo(results) {
    let versionMeta = null;
    for (const r of results) {
        if (r.meta && r.meta.title) { versionMeta = r.meta; break; }
    }

    const versionDiv = $('#version-info');
    if (versionMeta && versionDiv) {
        versionDiv.innerHTML =
            `<strong>${escapeHtml(versionMeta.title || '')}</strong>` +
            (versionMeta.date ? ` · 更新: ${escapeHtml(versionMeta.date)}` : '') +
            (versionMeta.version ? ` · v${escapeHtml(versionMeta.version)}` : '') +
            (versionMeta.tags ? ` · 标签: ${escapeHtml(Array.isArray(versionMeta.tags) ? versionMeta.tags.join(', ') : versionMeta.tags)}` : '');
        versionDiv.style.display = 'block';
    }
}

/* ========== UI 功能：侧边栏、搜索、进度 ========== */
function initSidebar() {
    const resizer = $('#resizer');
    const sidebar = $('#sidebar');
    if (!resizer || !sidebar) return;

    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing = true; document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; });
    document.addEventListener('mousemove', e => {
        if (!isResizing) return;
        const w = e.clientX;
        if (w > 180 && w < 600) sidebar.style.width = w + 'px';
    });
    document.addEventListener('mouseup', () => { isResizing = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; });

    // 全局展开/折叠绑定
    window.expandAll = () => {
        $$('.section-wrapper').forEach(w => w.style.display = '');
        $$('.toc-toggle').forEach(t => t.textContent = '▼');
        $$('.toc-item[data-parent]').forEach(i => i.style.display = '');
    };
    window.collapseAll = () => {
        $$('.section-wrapper').forEach(w => w.style.display = 'none');
        $$('.toc-toggle').forEach(t => t.textContent = '▶');
        $$('.toc-item[data-parent]').forEach(i => i.style.display = 'none');
    };
}

function buildTOC() {
    const toc = $('#toc-tree');
    if (!toc) return;
    toc.innerHTML = '';
    const headings = $$('#article-body h1, #article-body h2, #article-body h3');
    let lastH1 = null, lastH2 = null;
    let headingIndex = 0;

    headings.forEach(h => {
        if (!h.id) h.id = 'h-' + (headingIndex++);
        const level = parseInt(h.tagName.charAt(1));
        const text = h.textContent.trim();
        const item = document.createElement('div');
        item.className = `toc-item toc-h${level}`;
        item.setAttribute('data-target', h.id);

        if (level === 1) { lastH1 = h.id; lastH2 = null; }
        else if (level === 2) { lastH2 = h.id; item.setAttribute('data-parent', lastH1); }
        else if (level === 3) { item.setAttribute('data-parent', lastH2 || lastH1); }

        if (level <= 2) {
            const toggle = document.createElement('span');
            toggle.className = 'toc-toggle'; toggle.textContent = '▼';
            toggle.addEventListener('click', e => { e.stopPropagation(); toggleSectionVisibility(h.id, toggle); });
            item.appendChild(toggle);
        } else {
            const spacer = document.createElement('span');
            spacer.style.display = 'inline-block'; spacer.style.width = '1rem';
            item.appendChild(spacer);
        }
        const span = document.createElement('span'); span.textContent = text;
        item.appendChild(span);
        item.addEventListener('click', () => {
            try { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
        });
        toc.appendChild(item);
    });
}

function toggleSectionVisibility(headingId, toggleEl) {
    const target = document.getElementById(headingId);
    if (!target) return;
    // 找到最近的 section-wrapper（我们在渲染时已把每章置为 section-wrapper）
    let wrapper = target.closest('.section-wrapper');
    if (!wrapper) {
        // 退而求其次：折叠从 heading 向后直到下一个同级 heading
        let node = target.nextElementSibling;
        const nodes = [];
        while (node && !/H1|H2|H3/.test(node.tagName)) {
            nodes.push(node);
            node = node.nextElementSibling;
        }
        const visible = nodes.length > 0 && nodes[0].style.display !== 'none';
        nodes.forEach(n => n.style.display = visible ? 'none' : '');
        if (toggleEl) toggleEl.textContent = visible ? '▶' : '▼';
        return;
    }
    const visible = wrapper.style.display !== 'none';
    if (visible) {
        wrapper.style.display = 'none'; if (toggleEl) toggleEl.textContent = '▶';
        hideTOCChildren(headingId);
    } else {
        wrapper.style.display = ''; if (toggleEl) toggleEl.textContent = '▼';
        showTOCChildren(headingId);
    }
}

function hideTOCChildren(parentId) { $$('.toc-item').forEach(c => { if (c.getAttribute('data-parent') === parentId) c.style.display = 'none'; }); }
function showTOCChildren(parentId) {
    $$('.toc-item').forEach(c => {
        if (c.getAttribute('data-parent') === parentId) {
            if (isParentVisible(c)) c.style.display = '';
        }
    });
}
function isParentVisible(child) {
    const pid = child.getAttribute('data-parent');
    if (!pid) return true;
    const p = document.getElementById(pid);
    if (!p) return true;
    const pw = p.closest('.section-wrapper');
    return !(pw && pw.style.display === 'none');
}

function initSearch() {
    const input = $('#search-input');
    const results = $('#search-results');
    if (!input || !results) return;

    let debounceTimer;
    let searchIndex = [];

    function buildIndex() {
        searchIndex = [];
        $$('#article-body h3').forEach((h3, i) => {
            if (!h3.id) h3.id = 'h3-' + i;
            const title = h3.textContent.trim();
            let ctx = '', node = h3.nextElementSibling;
            while (node && !['H1', 'H2', 'H3'].includes(node.tagName)) {
                if (node.textContent.trim()) ctx += node.textContent.trim() + ' ';
                node = node.nextElementSibling;
                if (ctx.length > 80) break;
            }
            searchIndex.push({ title, titleLower: title.toLowerCase(), context: ctx.slice(0, 80).trim(), id: h3.id });
        });
    }

    // 延迟构建索引，等待 DOM 渲染
    setTimeout(buildIndex, 1000);

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const q = input.value.trim().toLowerCase();
            results.innerHTML = '';
            if (!q) return;

            searchIndex.filter(i => i.titleLower.includes(q) || i.context.toLowerCase().includes(q)).forEach(i => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                const title = document.createElement('div'); title.className = 'title'; title.textContent = i.title;
                const ctx = document.createElement('div'); ctx.className = 'context'; ctx.textContent = i.context;
                div.appendChild(title); div.appendChild(ctx);
                div.addEventListener('click', () => {
                    const el = document.getElementById(i.id);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        toggleSearchPanel();
                    }
                });
                results.appendChild(div);
            });
        }, 300);
    });
}

function toggleSearchPanel() {
    const panel = $('#search-panel');
    if (panel) {
        panel.classList.toggle('panel-visible');
    }
}

function initScrollSpy() {
    const tocItems = $$('.toc-item');
    const autoCheckbox = $('#auto-scroll-checkbox');
    const rootEl = $('#content');

    const idToToc = new Map();
    tocItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        if (targetId) idToToc.set(targetId, item);
    });

    function highlightChain(targetId) {
        tocItems.forEach(i => i.classList.remove('active'));
        let current = $(`.toc-item[data-target="${targetId}"]`);
        while (current) {
            current.classList.add('active');
            const parentId = current.getAttribute('data-parent');
            if (parentId) {
                current = $(`.toc-item[data-target="${parentId}"]`);
            } else break;
        }
    }

    function scrollTocTo(targetId) {
        if (!autoCheckbox || !autoCheckbox.checked) return;
        const item = $(`.toc-item[data-target="${targetId}"]`);
        if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    const observer = new IntersectionObserver((entries) => {
        let topMostEntry = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!topMostEntry || entry.boundingClientRect.top < topMostEntry.boundingClientRect.top) {
                    topMostEntry = entry;
                }
            }
        });
        if (topMostEntry) {
            const id = topMostEntry.target.id;
            highlightChain(id);
            scrollTocTo(id);
        }
    }, {
        root: rootEl,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0
    });

    $$('#article-body h1, #article-body h2, #article-body h3').forEach(h => {
        try { observer.observe(h); } catch (e) { }
    });
}

function initProgress() {
    const content = $('#content');
    if (!content) return;

    // 恢复
    const saved = localStorage.getItem('iwp-progress');
    if (saved) content.scrollTop = parseInt(saved) || 0;

    // 保存
    let timer;
    content.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => localStorage.setItem('iwp-progress', content.scrollTop), 300);
    });
}

function initAuthorPanel() {
    const btn = $('#btn-author');
    const panel = $('#author-panel');
    const close = $('#close-author');
    if (!btn || !panel || !close) return;

    btn.addEventListener('click', async () => {
        panel.classList.add('panel-visible');
        const info = $('#author-info');
        if (panel.classList.contains('loaded') || !info) return;

        try {
            const resp = await fetch(CONFIG.AUTHOR_MD);
            if (resp.ok) {
                const md = await resp.text();
                const fm = extractAndRemoveFrontMatter(md).meta || {};
                let name = fm.name || '未署名', bio = fm.bio || '暂无简介', avatar = fm.avatar || '';
                if (avatar && !avatar.startsWith('http')) avatar = 'images/000/' + avatar;

                // ---- 改动点1：作者名字变成链接 ----
                const nameLink = document.createElement('a');
                nameLink.href = `more.html?user=${encodeURIComponent(name)}`;
                nameLink.style.color = '#88b4e6';
                nameLink.style.textDecoration = 'none';
                nameLink.textContent = escapeHtml(name);

                const nameHeading = document.createElement('h2');
                nameHeading.appendChild(nameLink);

                const bioPara = document.createElement('p');
                bioPara.textContent = escapeHtml(bio);

                info.innerHTML = '';
                if (avatar) {
                    const img = document.createElement('img');
                    img.src = avatar;
                    img.style.width = '80px';
                    img.style.borderRadius = '50%';
                    img.style.marginBottom = '1rem';
                    info.appendChild(img);
                }
                info.appendChild(nameHeading);
                info.appendChild(bioPara);
                panel.classList.add('loaded');
            }
        } catch (e) { }
    });

    close.addEventListener('click', () => panel.classList.remove('panel-visible'));
}

function initChapterSelect() {
    const select = $('#chapter-select');
    if (!select) return;
    // 简单获取所有 H1
    $$('#article-body h1').forEach(h1 => {
        if (!h1.id) h1.id = 'h-' + Math.random().toString(36).substr(2, 8);
        const opt = document.createElement('option');
        opt.value = h1.id;
        opt.textContent = h1.textContent.trim();
        select.appendChild(opt);
    });
    select.addEventListener('change', () => {
        const el = document.getElementById(select.value);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

/* ========== 评论区系统 (核心嵌套逻辑) ========== */

// 1. 为每个 H2 插入评论区容器（使用 DOM API，避免内联 onclick）
function injectCommentSections(body) {
    const h2s = body.querySelectorAll('h2');
    h2s.forEach((h2, index) => {
        if (!h2.id) h2.id = 'h2-' + index;
        const sectionId = h2.id;

        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.setAttribute('data-section-id', sectionId);

        const toggle = document.createElement('div');
        toggle.className = 'comment-toggle';
        toggle.textContent = '来喵两句～（点击展开评论区） ';
        const countBadge = document.createElement('span');
        countBadge.className = 'comment-count-badge';
        countBadge.id = 'comment-count-' + sectionId;
        toggle.appendChild(countBadge);
        toggle.addEventListener('click', () => toggleCommentSection(sectionId));

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'comment-body';
        bodyDiv.id = 'comment-body-' + sectionId;
        bodyDiv.style.display = 'none';

        const list = document.createElement('div');
        list.className = 'comment-list';
        list.id = 'comment-list-' + sectionId;

        const form = document.createElement('div');
        form.className = 'comment-form';
        form.id = 'comment-form-' + sectionId;

        const authPanel = document.createElement('div');
        authPanel.className = 'auth-panel';
        authPanel.id = 'auth-panel-' + sectionId;

        const inputArea = document.createElement('div');
        inputArea.className = 'input-area';
        inputArea.id = 'input-area-' + sectionId;
        inputArea.style.display = 'none';

        const textarea = document.createElement('textarea');
        textarea.id = `comment-input-${sectionId}`;
        textarea.placeholder = '良言一句我就热，恶语伤人我就冷...';
        textarea.rows = 3;

        const submitBtn = document.createElement('button');
        submitBtn.type = 'button';
        submitBtn.textContent = '说话！';
        submitBtn.addEventListener('click', () => submitComment(sectionId));

        inputArea.appendChild(textarea);
        inputArea.appendChild(submitBtn);

        form.appendChild(authPanel);
        form.appendChild(inputArea);

        bodyDiv.appendChild(list);
        bodyDiv.appendChild(form);

        commentSection.appendChild(toggle);
        commentSection.appendChild(bodyDiv);

        h2.parentNode.insertBefore(commentSection, h2.nextSibling);

        // 初始化 auth UI for this section
        updateAuthUI(sectionId);
    });
}

// 2. 切换评论区显示
function toggleCommentSection(sectionId) {
    const body = document.getElementById('comment-body-' + sectionId);
    if (!body) return;
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
        // 延迟加载，提升首屏性能
        if (!state.comments[sectionId]) {
            fetchCommentsForSection(sectionId);
        } else {
            renderCommentsForSection(sectionId);
        }
    } else {
        body.style.display = 'none';
    }
}

// 3. 获取评论数据
async function fetchCommentsForSection(sectionId) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    const countBadge = document.getElementById('comment-count-' + sectionId);
    if (!listEl) return;
    listEl.innerHTML = '少女祈祷中...';

    const data = await safeFetch(`${CONFIG.COMMENT_API}/comments?section=${encodeURIComponent(sectionId)}&limit=100`);

    if (data) {
        // 支持两种返回形式：{ comments: [...], total } 或直接 array
        const flat = Array.isArray(data) ? data : (data.comments || []);
        state.comments[sectionId] = flat;
        if (countBadge) countBadge.textContent = `(${(data.total || flat.length || 0)})`;
        renderCommentsForSection(sectionId);
        updateAuthUI(sectionId); // 更新登录状态显示
    } else {
        listEl.innerHTML = '加载失败，请稍后再试';
    }
}

// 4. 构建评论树 (健壮性：处理孤儿节点)
function buildCommentTree(flatComments) {
    const map = {};
    const roots = [];

    flatComments.forEach(c => {
        c.children = [];
        map[c.id] = c;
    });

    flatComments.forEach(c => {
        if (c.parent_id && map[c.parent_id]) {
            map[c.parent_id].children.push(c);
        } else {
            // 标记孤儿（便于 UI 提示）
            if (c.parent_id && !map[c.parent_id]) c.orphan = true;
            roots.push(c);
        }
    });
    return roots;
}

// 5. 渲染评论树 (改用 DOM API，避免内联事件与 XSS)
function renderCommentsForSection(sectionId) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    if (!listEl) return;

    const flat = state.comments[sectionId] || [];
    const tree = buildCommentTree(flat);
    listEl.innerHTML = ''; // 清空

    if (flat.length === 0) {
        listEl.innerHTML = '<p style="color:#999; font-size:0.9rem;">暂无评论，快来抢沙发～</p>';
        return;
    }

    renderCommentNodeRecursive(listEl, tree, sectionId);
}

function renderCommentNodeRecursive(container, nodes, sectionId) {
    nodes.forEach(node => {
        const wrapper = document.createElement('div');
        const isChild = !!node.parent_id;

        // 样式逻辑（使用类而不是直接内联样式）
        wrapper.className = isChild ? 'comment-node-child' : 'comment-node-root';
        wrapper.style.marginLeft = isChild ? '24px' : '';
        wrapper.style.paddingLeft = isChild ? '12px' : '';
        wrapper.style.borderLeft = isChild ? '2px solid #eee' : '';

        // comment-item
        const item = document.createElement('div');
        item.className = 'comment-item';

        const avatarWrap = document.createElement('div');
        avatarWrap.className = 'comment-avatar';
        const avatarImg = document.createElement('img');
        avatarImg.src = node.avatar || CONFIG.DEFAULT_AVATAR;
        avatarImg.width = 32; avatarImg.height = 32;
        avatarImg.onerror = function () { this.src = CONFIG.DEFAULT_AVATAR; };
        avatarWrap.appendChild(avatarImg);

        const contentWrap = document.createElement('div');
        contentWrap.className = 'comment-content';

        const header = document.createElement('div');

        // ---- 改动点2：用户名变成链接 ----
        const userLink = document.createElement('a');
        userLink.href = `more.html?user=${encodeURIComponent(node.username || '')}`;
        userLink.style.color = '#007bff';
        userLink.style.textDecoration = 'none';
        userLink.style.fontWeight = 'bold';
        userLink.textContent = node.username || '匿名';
        header.appendChild(userLink);

        if (node.username === CONFIG.ADMIN_USERNAME) {
            const masterTag = document.createElement('span');
            masterTag.style.cssText = "background:#d9534f; color:white; font-size:10px; padding:2px 6px; border-radius:3px; margin-left:6px; vertical-align:middle;";
            masterTag.textContent = '始作俑者';
            header.appendChild(masterTag);
        }

        const timeSpan = document.createElement('span');
        timeSpan.className = 'comment-time';
        timeSpan.style.marginLeft = '8px';
        timeSpan.textContent = node.created_at ? new Date(node.created_at).toLocaleString() : '';
        header.appendChild(timeSpan);

        const para = document.createElement('p');
        para.style.margin = '5px 0 0';
        para.style.color = '#444';
        para.style.lineHeight = '1.5';
        para.textContent = node.content || '';

        const actions = document.createElement('div');
        actions.className = 'comment-actions';
        actions.style.marginTop = '5px';

        const likeBtn = document.createElement('button');
        likeBtn.type = 'button';
        likeBtn.style.background = 'none';
        likeBtn.style.border = 'none';
        likeBtn.style.cursor = 'pointer';
        likeBtn.style.fontSize = '0.85rem';
        likeBtn.textContent = `❤️ ${node.likes || 0}`;
        likeBtn.addEventListener('click', () => likeComment(node.id, sectionId));

        const quoteBtn = document.createElement('button');
        quoteBtn.type = 'button';
        quoteBtn.style.background = 'none';
        quoteBtn.style.border = 'none';
        quoteBtn.style.cursor = 'pointer';
        quoteBtn.style.fontSize = '0.85rem';
        quoteBtn.textContent = '引用';
        quoteBtn.addEventListener('click', () => {
            const input = document.getElementById(`comment-input-${sectionId}`);
            if (input) {
                input.value += `> ${node.content}\n`;
                input.focus();
            }
        });

        const replyBtn = document.createElement('button');
        replyBtn.type = 'button';
        replyBtn.style.background = 'none';
        replyBtn.style.border = 'none';
        replyBtn.style.cursor = 'pointer';
        replyBtn.style.fontSize = '0.85rem';
        replyBtn.textContent = '回复';
        replyBtn.addEventListener('click', () => showReplyBox(node.id, sectionId));

        actions.appendChild(likeBtn);
        actions.appendChild(quoteBtn);
        actions.appendChild(replyBtn);

        contentWrap.appendChild(header);
        contentWrap.appendChild(para);
        contentWrap.appendChild(actions);

        item.appendChild(avatarWrap);
        item.appendChild(contentWrap);

        wrapper.appendChild(item);

        // 回复框容器
        const replyBox = document.createElement('div');
        replyBox.id = `reply-box-${node.id}`;
        replyBox.style.display = 'none';
        replyBox.style.margin = '8px 0 8px 42px';
        wrapper.appendChild(replyBox);

        container.appendChild(wrapper);

        // 递归
        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            container.appendChild(childrenContainer);
            renderCommentNodeRecursive(childrenContainer, node.children, sectionId);
        }
    });
}

/* ========== 交互逻辑：登录、回复、点赞 ========== */

function restoreUserSession() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) {
        try {
            state.user = JSON.parse(saved);
        } catch (e) { localStorage.removeItem('iwp-user'); }
    }
    // 更新所有可见的评论区 UI
    $$('.comment-section').forEach(sec => {
        const sectionId = sec.getAttribute('data-section-id');
        updateAuthUI(sectionId);
    });
}

function updateAuthUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    const inputArea = document.getElementById('input-area-' + sectionId);
    if (!panel) return;

    panel.innerHTML = ''; // 清空并用 DOM API 填充，避免内联事件

    if (state.user) {
        const span = document.createElement('span'); span.textContent = `Hi ${state.user.username}`;
        const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = '退出';
        btn.addEventListener('click', () => doLogout());
        panel.appendChild(span); panel.appendChild(document.createTextNode(' ')); panel.appendChild(btn);
        if (inputArea) inputArea.style.display = 'block';
    } else {
        const loginBtn = document.createElement('button'); loginBtn.type = 'button'; loginBtn.textContent = '登录';
        const regBtn = document.createElement('button'); regBtn.type = 'button'; regBtn.textContent = '注册';
        loginBtn.addEventListener('click', () => showLoginUI(sectionId));
        regBtn.addEventListener('click', () => showRegisterUI(sectionId));
        panel.appendChild(loginBtn); panel.appendChild(regBtn);
        if (inputArea) inputArea.style.display = 'none';
    }
}

function showLoginUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    if (!panel) return;
    panel.innerHTML = '';

    const userInput = document.createElement('input'); userInput.type = 'text'; userInput.placeholder = '用户名'; userInput.id = `login-user-${sectionId}`;
    const passInput = document.createElement('input'); passInput.type = 'password'; passInput.placeholder = '密码'; passInput.id = `login-pass-${sectionId}`;
    const goBtn = document.createElement('button'); goBtn.type = 'button'; goBtn.textContent = 'Go';
    goBtn.addEventListener('click', () => doLogin(sectionId));
    panel.appendChild(userInput); panel.appendChild(passInput); panel.appendChild(goBtn);
}

function showRegisterUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    if (!panel) return;
    panel.innerHTML = '';

    const userInput = document.createElement('input'); userInput.type = 'text'; userInput.placeholder = '用户名'; userInput.id = `reg-user-${sectionId}`;
    const passInput = document.createElement('input'); passInput.type = 'password'; passInput.placeholder = '密码'; passInput.id = `reg-pass-${sectionId}`;
    const goBtn = document.createElement('button'); goBtn.type = 'button'; goBtn.textContent = 'Go';
    goBtn.addEventListener('click', () => doRegister(sectionId));
    panel.appendChild(userInput); panel.appendChild(passInput); panel.appendChild(goBtn);
}

async function doLogin(sectionId) {
    const u = document.getElementById(`login-user-${sectionId}`)?.value.trim();
    const p = document.getElementById(`login-pass-${sectionId}`)?.value;
    if (!u || !p) return alert('请填写完整');

    const data = await safeFetch(`${CONFIG.COMMENT_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });

    if (data && data.token) {
        state.user = { username: u, token: data.token };
        // 注意安全性：token 存 localStorage 有被 XSS 窃取风险，部署时请考虑 HttpOnly cookie
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        updateAuthUI(sectionId);
        fetchCommentsForSection(sectionId); // 刷新评论
    } else {
        alert('登录失败');
    }
}

async function doRegister(sectionId) {
    const u = document.getElementById(`reg-user-${sectionId}`)?.value.trim();
    const p = document.getElementById(`reg-pass-${sectionId}`)?.value;
    if (!u || !p) return alert('请填写完整');

    const data = await safeFetch(`${CONFIG.COMMENT_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });

    if (data && data.token) {
        state.user = { username: u, token: data.token };
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        updateAuthUI(sectionId);
        fetchCommentsForSection(sectionId);
    } else {
        alert('注册失败，可能用户名已存在');
    }
}

function doLogout() {
    state.user = null;
    localStorage.removeItem('iwp-user');
    $$('.auth-panel').forEach(p => {
        const sec = p.closest('.comment-section');
        if (sec) updateAuthUI(sec.getAttribute('data-section-id'));
    });
}

// 顶层评论
async function submitComment(sectionId) {
    if (!state.user) return alert('请先登录');
    const input = document.getElementById(`comment-input-${sectionId}`);
    const content = input?.value.trim();
    if (!content) return;

    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.user.token}` },
        body: JSON.stringify({ section: sectionId, content })
    });

    if (res) {
        input.value = '';
        fetchCommentsForSection(sectionId);
    } else {
        alert('发送失败');
    }
}

// 显示回复框（动态生成并绑定发送事件）
function showReplyBox(parentId, sectionId) {
    const box = document.getElementById(`reply-box-${parentId}`);
    if (!box) return;
    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        box.innerHTML = ''; // 清空
        const textarea = document.createElement('textarea');
        textarea.id = `reply-input-${parentId}`;
        textarea.rows = 2;
        textarea.style.width = '100%';
        textarea.style.border = '1px solid #ddd';
        textarea.style.borderRadius = '4px';
        textarea.style.padding = '5px';
        textarea.placeholder = '回复...';

        const bar = document.createElement('div');
        bar.style.marginTop = '5px';

        const sendBtn = document.createElement('button');
        sendBtn.type = 'button';
        sendBtn.style.padding = '4px 10px';
        sendBtn.style.background = '#333';
        sendBtn.style.color = '#fff';
        sendBtn.style.border = 'none';
        sendBtn.style.borderRadius = '3px';
        sendBtn.style.cursor = 'pointer';
        sendBtn.textContent = '发送';
        sendBtn.addEventListener('click', () => doReply(parentId, sectionId));

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.style.padding = '4px 10px';
        cancelBtn.style.border = 'none';
        cancelBtn.style.background = 'none';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.textContent = '取消';
        cancelBtn.addEventListener('click', () => { box.style.display = 'none'; });

        bar.appendChild(sendBtn);
        bar.appendChild(cancelBtn);

        box.appendChild(textarea);
        box.appendChild(bar);
    } else {
        box.style.display = 'none';
    }
}

// 发送回复
async function doReply(parentId, sectionId) {
    if (!state.user) return alert('请先登录');
    const input = document.getElementById(`reply-input-${parentId}`);
    const content = input?.value.trim();
    if (!content) return;

    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.user.token}` },
        body: JSON.stringify({ section: sectionId, content, parent_id: parentId })
    });

    if (res) {
        fetchCommentsForSection(sectionId);
    } else {
        alert('发送失败');
    }
}

// 点赞
async function likeComment(commentId, sectionId) {
    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments/${encodeURIComponent(commentId)}/like`, { method: 'POST' });
    if (res) {
        fetchCommentsForSection(sectionId);
    }
}

/* ========== 绑定全局事件（供 HTML 内其他脚本调用） ========== */
function setupGlobalCommentListeners() {
    window.toggleCommentSection = toggleCommentSection;
    window.submitComment = submitComment;
    window.likeComment = likeComment;
    window.quoteComment = (text, sectionId) => {
        const input = document.getElementById(`comment-input-${sectionId}`);
        if (input) {
            input.value += `> ${text}\n`;
            input.focus();
        }
    };
    window.showReplyBox = showReplyBox;
    window.doReply = doReply;
    window.showLoginUI = showLoginUI;
    window.showRegisterUI = showRegisterUI;
    window.doLogin = doLogin;
    window.doRegister = doRegister;
    window.doLogout = doLogout;
}
