/* ========== reader.js (完整版：点赞防抖 + 单账号一次点赞 + 移动端适配 + 搜索高亮) ========== */
const CONFIG = {
    COMMENT_API: 'https://woxiangcaoni.2167964516.workers.dev',
    ADMIN_USERNAME: 'loading',
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

let state = {
    user: null,
    comments: {},
    scrollSpyActive: false,
    likedComments: new Set()       // 记录已点赞的评论 ID
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

async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
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
        return res;
    } catch (error) {
        console.error(`Fetch Error [${url}]:`, error);
        return null;
    }
}

/* ========== 初始化入口 ========== */
document.addEventListener('DOMContentLoaded', async () => {
    const overlay = $('#loading-overlay');
    await loadAllContent();
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 500);
    }
    try {
        initSidebar();
        initSearch();
        initScrollSpy();
        initProgress();
        initAuthorPanel();
        initChapterSelect();
        restoreUserSession();
        const body = $('#article-body');
        if (body) {
            injectCommentSections(body);
            setupGlobalCommentListeners();
        }
        // ⭐ 新增：移动端侧边栏初始化
        initMobileSidebar();
        // ⭐ 新增：搜索高亮清除（监听关闭按钮）
        const closeSearch = document.getElementById('close-search');
        if (closeSearch) {
            closeSearch.addEventListener('click', () => {
                clearHighlight();
            });
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
    const settled = await Promise.allSettled(fetchPromises);
    const results = settled.map((s, i) => {
        if (s.status === 'fulfilled') return s.value;
        return { meta: null, content: '', chapterNum: CONFIG.CHAPTERS[i].split('/')[1] || 'unknown' };
    });
    renderVersionInfo(results);
    if (progressText) progressText.textContent = '少女祈祷中...';
    body.innerHTML = '';
    for (let i = 0; i < results.length; i++) {
        const chunk = results[i].content;
        if (!chunk) continue;
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-wrapper clearfix';
        try {
            sectionDiv.innerHTML = marked.parse(chunk);
        } catch (e) {
            sectionDiv.innerHTML = `<p>[少女折寿中]</p>`;
        }
        postProcessImages(sectionDiv, results[i].chapterNum);
        postProcessFigure(sectionDiv);
        sectionDiv.querySelectorAll('pre code').forEach(b => {
            try { hljs.highlightElement(b); } catch (e) { }
        });
        body.appendChild(sectionDiv);
        if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${total}`;
        if (i % 3 === 2) await new Promise(r => requestAnimationFrame(r));
    }
    renderMath();
    buildTOC();
    if (progressText) progressText.parentElement.classList.add('hidden');
}

/* ========== Markdown 预处理 ========== */
function processMarkdown(md, path) {
    const { meta, content } = extractAndRemoveFrontMatter(md);
    const chapterNum = path.split('/')[1] || '000';
    let processedContent = content
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
            src = src.trim();
            if (!/^(https?:|\/|data:)/i.test(src)) {
                src = src.replace(/^\.\/+/, '').replace(/^\.\.\//, '');
                return `![${alt}](images/${chapterNum}/${src})`;
            }
            return m;
        })
        .replace(/:::image\s+([^\s]+)?\s*([^\s]+)\s*(.*?)\s*:::/g, (m, pos, filename, caption) => {
            pos = pos || 'center';
            if (!/^(https?:|\/|data:)/i.test(filename)) {
                filename = `images/${chapterNum}/${filename}`;
            }
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
        img.onerror = function () {
            this.src = CONFIG.DEFAULT_AVATAR;
        };
        const alt = img.alt || '';
        const match = alt.match(/\{(left|right|around|center)\s*(?:width=(\d+))?\}/);
        if (match) {
            const pos = match[1], width = match[2];
            if (width) img.style.width = width + 'px';
            img.classList.add('iwp-img-' + pos);
            img.alt = alt.replace(match[0], '').trim();
        } else {
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

/* ========== UI 功能、TOC、搜索、ScrollSpy 等 ========== */
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
    let wrapper = target.closest('.section-wrapper');
    if (!wrapper) {
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
function showTOCChildren(parentId) { $$('.toc-item').forEach(c => { if (c.getAttribute('data-parent') === parentId) { if (isParentVisible(c)) c.style.display = ''; }}); }
function isParentVisible(child) {
    const pid = child.getAttribute('data-parent');
    if (!pid) return true;
    const p = document.getElementById(pid);
    if (!p) return true;
    const pw = p.closest('.section-wrapper');
    return !(pw && pw.style.display === 'none');
}

/* ========== 搜索功能（含高亮） ========== */
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
    setTimeout(buildIndex, 1000);
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const q = input.value.trim().toLowerCase();
            results.innerHTML = '';
            // 清空搜索框时清除高亮
            if (!q) {
                clearHighlight();
                return;
            }
            // 输入新词时清除旧高亮（避免混乱）
            clearHighlight();
            searchIndex.filter(i => i.titleLower.includes(q) || i.context.toLowerCase().includes(q)).forEach(i => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                const title = document.createElement('div'); title.className = 'title'; title.textContent = i.title;
                const ctx = document.createElement('div'); ctx.className = 'context'; ctx.textContent = i.context;
                div.appendChild(title); div.appendChild(ctx);
                // ⭐ 点击结果：跳转并高亮关键词
                div.addEventListener('click', () => {
                    const el = document.getElementById(i.id);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // 延迟执行高亮，等待滚动完成后突出显示
                        setTimeout(() => {
                            highlightSearchTerm(input.value.trim());
                        }, 300);
                        // 可选：点击后自动关闭搜索面板（取消注释即可启用）
                        // toggleSearchPanel();
                    }
                });
                results.appendChild(div);
            });
        }, 300);
    });
}

function toggleSearchPanel() {
    const panel = $('#search-panel');
    if (panel) panel.classList.toggle('panel-visible');
    // 如果面板关闭，清除高亮
    if (!panel.classList.contains('panel-visible')) {
        clearHighlight();
    }
}

/* ========== 搜索高亮（黑底白字，圆角） ========== */
function clearHighlight() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize(); // 合并相邻文本节点
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchTerm(term) {
    if (!term || !term.trim()) {
        clearHighlight();
        return;
    }
    clearHighlight();
    const body = document.getElementById('article-body');
    if (!body) return;
    const walker = document.createTreeWalker(
        body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                // 跳过 style、script、已高亮区域
                if (node.parentElement.closest('style, script, .search-highlight')) 
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
    const regex = new RegExp(escapeRegExp(term.trim()), 'gi');
    let firstMatch = null;
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (!regex.test(text)) return;
        regex.lastIndex = 0; // 重置
        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const before = text.slice(lastIndex, match.index);
            if (before) frag.appendChild(document.createTextNode(before));
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.textContent = match[0];
            frag.appendChild(span);
            lastIndex = regex.lastIndex;
            if (!firstMatch) firstMatch = span;
        }
        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
    });
    // 滚动到第一个高亮位置（居中）
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/* ========== 滚动追踪 ========== */
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
    const saved = localStorage.getItem('iwp-progress');
    if (saved) content.scrollTop = parseInt(saved) || 0;
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

/* ========== 评论区系统 ========== */
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
        textarea.placeholder = '良言一句没头脑，恶语伤人不高兴...';
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
        updateAuthUI(sectionId);
    });
}

function toggleCommentSection(sectionId) {
    const body = document.getElementById('comment-body-' + sectionId);
    if (!body) return;
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
        if (!state.comments[sectionId]) {
            fetchCommentsForSection(sectionId);
        } else {
            renderCommentsForSection(sectionId);
        }
    } else {
        body.style.display = 'none';
    }
}

async function fetchCommentsForSection(sectionId) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    const countBadge = document.getElementById('comment-count-' + sectionId);
    if (!listEl) return;
    listEl.innerHTML = '少女祈祷中...';
    const data = await safeFetch(`${CONFIG.COMMENT_API}/comments?section=${encodeURIComponent(sectionId)}&limit=100`);
    if (data) {
        const flat = Array.isArray(data) ? data : (data.comments || []);
        state.comments[sectionId] = flat;
        if (countBadge) countBadge.textContent = `(${(data.total || flat.length || 0)})`;
        renderCommentsForSection(sectionId);
        updateAuthUI(sectionId);
    } else {
        listEl.innerHTML = '加载失败，请稍后再试';
    }
}

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
            if (c.parent_id && !map[c.parent_id]) c.orphan = true;
            roots.push(c);
        }
    });
    return roots;
}

function renderCommentsForSection(sectionId) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    if (!listEl) return;
    const flat = state.comments[sectionId] || [];
    const tree = buildCommentTree(flat);
    listEl.innerHTML = '';
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
        wrapper.className = isChild ? 'comment-node-child' : 'comment-node-root';
        wrapper.style.marginLeft = isChild ? '24px' : '';
        wrapper.style.paddingLeft = isChild ? '12px' : '';
        wrapper.style.borderLeft = isChild ? '2px solid #eee' : '';
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
            masterTag.textContent = '未来的我';
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
        const replyBox = document.createElement('div');
        replyBox.id = `reply-box-${node.id}`;
        replyBox.style.display = 'none';
        replyBox.style.margin = '8px 0 8px 42px';
        wrapper.appendChild(replyBox);
        container.appendChild(wrapper);
        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            container.appendChild(childrenContainer);
            renderCommentNodeRecursive(childrenContainer, node.children, sectionId);
        }
    });
}

/* ========== 登录、注册、回复、点赞 ========== */
function restoreUserSession() {
    try {
        if (typeof getProfileUser === 'function') {
            const pu = getProfileUser();
            if (pu) {
                state.user = pu;
            } else {
                const saved = localStorage.getItem('iwp-user');
                if (saved) {
                    try { state.user = JSON.parse(saved); } catch (e) { state.user = null; }
                } else {
                    state.user = null;
                }
            }
        } else if (typeof window.profileUser !== 'undefined' && window.profileUser) {
            state.user = window.profileUser;
        } else {
            const saved = localStorage.getItem('iwp-user');
            if (saved) {
                try { state.user = JSON.parse(saved); } catch (e) { state.user = null; }
            } else {
                state.user = null;
            }
        }
    } catch (e) {
        console.error('restoreUserSession error', e);
        state.user = null;
    }
    $$('.comment-section').forEach(sec => {
        const sectionId = sec.getAttribute('data-section-id');
        updateAuthUI(sectionId);
    });
}

function updateAuthUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    const inputArea = document.getElementById('input-area-' + sectionId);
    if (!panel) return;
    panel.innerHTML = '';
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
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        try { window.profileUser = state.user; } catch (e) {}
        updateAuthUI(sectionId);
        fetchCommentsForSection(sectionId);
        state.likedComments.clear();   // 清空点赞记录
        document.dispatchEvent(new CustomEvent('profile-login', { detail: state.user }));
    } else {
        alert('啊我死了');
    }
}

async function doRegister(sectionId) {
    const u = document.getElementById(`reg-user-${sectionId}`)?.value.trim();
    const p = document.getElementById(`reg-pass-${sectionId}`)?.value;
    if (!u || !p) return alert('别骗我');
    const data = await safeFetch(`${CONFIG.COMMENT_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });
    if (data && data.token) {
        state.user = { username: u, token: data.token };
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        try { window.profileUser = state.user; } catch (e) {}
        updateAuthUI(sectionId);
        fetchCommentsForSection(sectionId);
        state.likedComments.clear();
        document.dispatchEvent(new CustomEvent('profile-login', { detail: state.user }));
    } else {
        alert('啊我死了');
    }
}

function doLogout() {
    state.user = null;
    localStorage.removeItem('iwp-user');
    try { window.profileUser = null; } catch (e) {}
    state.likedComments.clear();
    $$('.auth-panel').forEach(p => {
        const sec = p.closest('.comment-section');
        if (sec) updateAuthUI(sec.getAttribute('data-section-id'));
    });
    document.dispatchEvent(new CustomEvent('profile-logout'));
}

/* ========== 评论发送/回复/点赞 ========== */
async function submitComment(sectionId) {
    if (!state.user) return alert('别骗我');
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
        alert('啊我死了');
    }
}

function showReplyBox(parentId, sectionId) {
    const box = document.getElementById(`reply-box-${parentId}`);
    if (!box) return;
    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        box.innerHTML = '';
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
        sendBtn.textContent = 'GO!';
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

async function doReply(parentId, sectionId) {
    if (!state.user) return alert('别骗我');
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
        alert('啊我死了');
    }
}

// 点赞防抖 + 单账号一次点赞
const likeDebounceMap = new Map();
async function likeComment(commentId, sectionId) {
    if (!state.user) {
        alert('请先登录');
        return;
    }
    const now = Date.now();
    const lastTime = likeDebounceMap.get(commentId) || 0;
    if (now - lastTime < 800) return;
    likeDebounceMap.set(commentId, now);
    if (state.likedComments.has(commentId)) {
        alert('你已经点过赞了');
        return;
    }
    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments/${encodeURIComponent(commentId)}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${state.user.token}` }
    });
    if (res) {
        state.likedComments.add(commentId);
        fetchCommentsForSection(sectionId);
    } else {
        alert('点赞失败，请稍后再试');
    }
}

/* ========== 绑定与同步 ========== */
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

document.addEventListener('profile-login', () => { try { restoreUserSession(); } catch (e) { console.error(e); } });
document.addEventListener('profile-logout', () => { try { restoreUserSession(); } catch (e) { console.error(e); } });
window.addEventListener('storage', (e) => { if (e.key === 'iwp-user') { try { restoreUserSession(); } catch (err) { console.error(err); } } });

/* ========== ⭐ 新增：移动端侧边栏适配 ========== */
function initMobileSidebar() {
    // 点击内容区域关闭侧边栏（移动端）
    const content = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');
    const app = document.getElementById('app');
    
    if (content) {
        content.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && sidebar && sidebar.classList.contains('sidebar-open')) {
                // 如果点击的是侧边栏内部或工具栏，不关闭
                if (!sidebar.contains(e.target) && !e.target.closest('#toolbar')) {
                    sidebar.classList.remove('sidebar-open');
                    if (app) app.classList.remove('sidebar-active');
                }
            }
        });
    }
    
    // 窗口尺寸变化时自动处理侧边栏状态
    function handleResize() {
        if (!sidebar || !app) return;
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('sidebar-open');
            app.classList.remove('sidebar-active');
        }
    }
    
    // 监听 resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });
    
    // 初始化时执行一次
    handleResize();
}

// ⭐ 暴露 toggleSidebar 给全局（供 HTML 中的 onclick 调用）
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const app = document.getElementById('app');
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar-open');
    if (app) app.classList.toggle('sidebar-active');
};

// ⭐ 暴露清除高亮给全局（便于 HTML 中调用）
window.clearHighlight = clearHighlight;
