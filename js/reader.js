/* ========== reader.js (优化版：中心向外渐进渲染) ========== */

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
    DEFAULT_AVATAR: 'images/0721.png',
    INITIAL_RADIUS: 2,          // 初始渲染半径（前后各2章）
    LAZY_LOAD_COUNT: 3          // 每次懒加载的章节数
};

let state = {
    user: null,
    comments: {},
    scrollSpyActive: false,
    likedComments: new Set()
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

/* ========== 全局状态 ========== */
let fullChapterData = [];          // 存储所有章节的元数据 + 原始内容（未解析）
let loadedIndices = new Set();     // 已渲染的章节索引
let chapterPositions = [];         // 缓存各章节的 offsetTop（用于定位）
let headingMap = {};              // 标题文本 → 章节索引

/* ========== 初始化入口 ========== */
document.addEventListener('DOMContentLoaded', async () => {
    const overlay = $('#loading-overlay');
    // 1. 预加载所有章节（仅 fetch 原始文本）
    await preloadAllChapters();
    // 2. 构建标题映射（用于搜索和跳转）
    buildHeadingMapFromData();
    // 3. 确定目标章节索引
    const targetIndex = determineTargetIndex();
    // 4. 计算初始渲染范围
    const range = getInitialRange(targetIndex);
    // 5. 渲染首批章节
    await renderChapters(range);
    // 6. 恢复滚动位置
    restoreScrollPosition();
    // 7. 隐藏加载遮罩
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 500);
    }
    // 8. 初始化其余 UI 组件
    initSidebar();
    initSearch();          // 基于预解析索引
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
    initMobileSidebar();
    const closeSearch = document.getElementById('close-search');
    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            clearHighlight();
            const results = $('#search-results');
            if (results) results.innerHTML = '';
        });
    }
    // 9. 设置懒加载哨兵
    setupLazyLoading();
    // 10. 处理 URL hash 跳转（如果目标未包含在初始范围，则滚动到最近已渲染的）
    handleHashJump();
});

/* ========== 1. 预加载所有章节 ========== */
async function preloadAllChapters() {
    const fetchPromises = CONFIG.CHAPTERS.map(path =>
        fetch(path)
            .then(resp => resp.ok ? resp.text() : '')
            .catch(() => '')
    );
    const rawTexts = await Promise.all(fetchPromises);
    fullChapterData = rawTexts.map((text, i) => {
        const { meta, content } = extractAndRemoveFrontMatter(text);
        const chapterNum = CONFIG.CHAPTERS[i].split('/')[1] || '000';
        const headings = extractHeadings(content);
        return {
            meta,
            content,        // 原始内容（未解析）
            chapterNum,
            headings,       // [{level, text}]
            rendered: false
        };
    });
    // 读取缓存的章节位置（如果有）
    try {
        const cached = localStorage.getItem('iwp-chapter-positions');
        if (cached) chapterPositions = JSON.parse(cached);
        else chapterPositions = [];
    } catch(e) { chapterPositions = []; }
}

function extractHeadings(markdown) {
    const headingRegex = /^(#{1,3})\s+(.*)$/gm;
    const headings = [];
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
        headings.push({ level: match[1].length, text: match[2].trim() });
    }
    return headings;
}

/* ========== 2. 构建标题映射 ========== */
function buildHeadingMapFromData() {
    headingMap = {};
    fullChapterData.forEach((data, idx) => {
        // 从 meta 中获取标题
        if (data.meta && data.meta.title) {
            headingMap[data.meta.title] = idx;
        }
        // 从一级标题中提取
        data.headings.forEach(h => {
            if (h.level === 1) {
                headingMap[h.text] = idx;
            }
        });
    });
}

/* ========== 3. 确定目标章节 ========== */
function determineTargetIndex() {
    // 优先：URL hash 中的标题文本
    const hash = window.location.hash;
    if (hash) {
        const id = decodeURIComponent(hash.replace('#', ''));
        if (headingMap[id] !== undefined) {
            return headingMap[id];
        }
        // 如果 hash 是 #h-xxx 形式，尝试匹配章节内标题的 id（但尚未渲染，我们只能依靠标题文本映射）
        // 更精确的做法：解析 hash 中的数字，但这里简化
    }
    // 其次：localStorage 滚动位置
    const savedScrollTop = parseInt(localStorage.getItem('iwp-progress')) || 0;
    if (savedScrollTop > 0 && chapterPositions.length === fullChapterData.length) {
        for (let i = 0; i < chapterPositions.length; i++) {
            if (chapterPositions[i] > savedScrollTop) {
                return Math.max(0, i - 1);
            }
        }
        return chapterPositions.length - 1;
    }
    return 0; // 默认第一章
}

/* ========== 4. 计算初始渲染范围 ========== */
function getInitialRange(target) {
    const total = fullChapterData.length;
    const start = Math.max(0, target - CONFIG.INITIAL_RADIUS);
    const end = Math.min(total - 1, target + CONFIG.INITIAL_RADIUS);
    return { start, end };
}

/* ========== 5. 渲染指定范围的章节 ========== */
async function renderChapters({ start, end }) {
    const body = $('#article-body');
    if (!body) return;
    // 如果 body 为空，清空；否则追加
    if (loadedIndices.size === 0) {
        body.innerHTML = '';
    }
    // 按顺序渲染
    for (let i = start; i <= end; i++) {
        if (!loadedIndices.has(i)) {
            await renderSingleChapter(i);
        }
    }
    // 重新构建 TOC（基于当前渲染的标题）
    buildTOC();
    // 渲染数学公式（整个 body）
    renderMath();
    // 保存章节位置映射（如果全部渲染完则保存完整，否则后续会更新）
    if (loadedIndices.size === fullChapterData.length) {
        saveChapterPositions();
    }
}

function renderSingleChapter(index) {
    return new Promise((resolve) => {
        const data = fullChapterData[index];
        if (!data || !data.content) { resolve(); return; }
        // 解析 Markdown（只解析这一次）
        const processed = processMarkdown(data.content, `notes/${data.chapterNum}/index.md`);
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-wrapper clearfix';
        sectionDiv.setAttribute('data-chapter', data.chapterNum);
        try {
            sectionDiv.innerHTML = marked.parse(processed.content);
        } catch(e) {
            sectionDiv.innerHTML = `<p>[少女折寿中]</p>`;
        }
        postProcessImages(sectionDiv, data.chapterNum);
        postProcessFigure(sectionDiv);
        // 代码高亮延迟（使用 requestIdleCallback 或 setTimeout）
        const codeBlocks = sectionDiv.querySelectorAll('pre code');
        if (codeBlocks.length > 0) {
            requestIdleCallback ? requestIdleCallback(() => {
                codeBlocks.forEach(b => { try { hljs.highlightElement(b); } catch(e) {} });
            }) : setTimeout(() => {
                codeBlocks.forEach(b => { try { hljs.highlightElement(b); } catch(e) {} });
            }, 50);
        }
        // 插入到正确的位置（按章节顺序）
        const body = $('#article-body');
        // 找到第一个未渲染的后续章节，在其前面插入
        let insertBefore = null;
        for (let i = index + 1; i < fullChapterData.length; i++) {
            if (loadedIndices.has(i)) {
                // 找到已渲染的后续章节的 DOM 元素
                const existing = body.querySelector(`.section-wrapper[data-chapter="${fullChapterData[i].chapterNum}"]`);
                if (existing) { insertBefore = existing; break; }
            }
        }
        if (insertBefore) {
            body.insertBefore(sectionDiv, insertBefore);
        } else {
            body.appendChild(sectionDiv);
        }
        loadedIndices.add(index);
        data.rendered = true;
        // 为标题生成 id（便于锚点跳转）
        sectionDiv.querySelectorAll('h1, h2, h3').forEach(h => {
            if (!h.id) {
                const text = h.textContent.trim();
                h.id = 'h-' + text.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
            }
        });
        // 延迟一点点让浏览器渲染
        setTimeout(resolve, 10);
    });
}

/* ========== 6. 保存章节位置映射 ========== */
function saveChapterPositions() {
    const wrappers = $$('#article-body .section-wrapper');
    if (wrappers.length === fullChapterData.length) {
        const positions = wrappers.map(w => w.offsetTop);
        localStorage.setItem('iwp-chapter-positions', JSON.stringify(positions));
        chapterPositions = positions;
    }
}

/* ========== 7. 恢复滚动位置 ========== */
function restoreScrollPosition() {
    const content = $('#content');
    if (!content) return;
    const hash = window.location.hash;
    if (hash) {
        const targetEl = document.getElementById(hash.replace('#', ''));
        if (targetEl) {
            setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
            return;
        }
    }
    const savedScrollTop = parseInt(localStorage.getItem('iwp-progress')) || 0;
    if (savedScrollTop > 0) {
        content.scrollTop = savedScrollTop;
    }
}

/* ========== 8. 懒加载设置 ========== */
function setupLazyLoading() {
    const body = $('#article-body');
    if (!body) return;
    const total = fullChapterData.length;
    // 如果全部已加载，则无需哨兵
    if (loadedIndices.size === total) return;
    // 移除旧的哨兵
    document.querySelectorAll('.lazy-sentinel').forEach(el => el.remove());
    // 计算已渲染的最小和最大索引
    const sorted = Array.from(loadedIndices).sort((a,b) => a-b);
    const minLoaded = sorted[0];
    const maxLoaded = sorted[sorted.length - 1];
    // 上方哨兵（向前加载）
    if (minLoaded > 0) {
        const topSentinel = document.createElement('div');
        topSentinel.className = 'lazy-sentinel top-sentinel';
        topSentinel.style.height = '1px';
        topSentinel.style.visibility = 'hidden';
        body.prepend(topSentinel);
        observeSentinel(topSentinel, 'up');
    }
    // 下方哨兵（向后加载）
    if (maxLoaded < total - 1) {
        const bottomSentinel = document.createElement('div');
        bottomSentinel.className = 'lazy-sentinel bottom-sentinel';
        bottomSentinel.style.height = '1px';
        bottomSentinel.style.visibility = 'hidden';
        body.appendChild(bottomSentinel);
        observeSentinel(bottomSentinel, 'down');
    }
}

function observeSentinel(sentinel, direction) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const total = fullChapterData.length;
            const sorted = Array.from(loadedIndices).sort((a,b) => a-b);
            let minLoaded = sorted[0];
            let maxLoaded = sorted[sorted.length - 1];
            let newStart, newEnd;
            if (direction === 'down') {
                newStart = maxLoaded + 1;
                newEnd = Math.min(total - 1, maxLoaded + CONFIG.LAZY_LOAD_COUNT);
            } else {
                newStart = Math.max(0, minLoaded - CONFIG.LAZY_LOAD_COUNT);
                newEnd = minLoaded - 1;
            }
            if (newStart <= newEnd) {
                renderChapters({ start: newStart, end: newEnd }).then(() => {
                    // 重新设置哨兵
                    sentinel.remove();
                    setupLazyLoading();
                    // 如果全部加载完成，更新章节位置缓存
                    if (loadedIndices.size === total) {
                        saveChapterPositions();
                    }
                });
            } else {
                observer.disconnect();
                sentinel.remove();
            }
        }
    }, { root: $('#content'), rootMargin: '200px' }); // 提前触发
    observer.observe(sentinel);
}

/* ========== 9. 处理 URL hash 跳转 ========== */
function handleHashJump() {
    const hash = window.location.hash;
    if (hash) {
        const targetId = hash.replace('#', '');
        // 尝试直接滚动到已渲染的元素
        const el = document.getElementById(targetId);
        if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        } else {
            // 如果未渲染，可能是标题文本，尝试查找映射
            const decoded = decodeURIComponent(targetId);
            if (headingMap[decoded] !== undefined) {
                const idx = headingMap[decoded];
                if (!loadedIndices.has(idx)) {
                    // 渲染该章节及其周围
                    const range = getInitialRange(idx);
                    renderChapters(range).then(() => {
                        setupLazyLoading();
                        // 再次尝试滚动
                        const newEl = document.getElementById(targetId);
                        if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                }
            }
        }
    }
}

/* ========== 以下为原有函数，基本保持不变 ========== */

/* ---------- Markdown 预处理 ---------- */
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

/* ---------- 图片与图表后处理 ---------- */
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

/* ---------- 渲染数学公式 ---------- */
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

/* ---------- 版本信息 ---------- */
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

/* ---------- UI 功能、TOC、搜索、ScrollSpy 等 ---------- */
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
        $$('.toc-toggle').forEach(t => t.textContent = '▼');
        $$('.toc-item[data-parent]').forEach(i => i.style.display = '');
        $$('.toc-item.toc-h1, .toc-item.toc-h2').forEach(i => {
            const toggle = i.querySelector('.toc-toggle');
            if (toggle) toggle.textContent = '▼';
        });
    };
    window.collapseAll = () => {
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
            toggle.addEventListener('click', e => { 
                e.stopPropagation(); 
                toggleTOCChildren(h.id, toggle); 
            });
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

function toggleTOCChildren(headingId, toggleEl) {
    const children = $$(`.toc-item[data-parent="${headingId}"]`);
    if (children.length === 0) return;
    const isCollapsed = children[0].style.display === 'none';
    const newDisplay = isCollapsed ? '' : 'none';
    children.forEach(child => {
        child.style.display = newDisplay;
        if (newDisplay === 'none') {
            const subChildren = $$(`.toc-item[data-parent="${child.getAttribute('data-target')}"]`);
            subChildren.forEach(sub => sub.style.display = 'none');
            const subToggle = child.querySelector('.toc-toggle');
            if (subToggle) subToggle.textContent = '▶';
        } else {
            const subChildren = $$(`.toc-item[data-parent="${child.getAttribute('data-target')}"]`);
            subChildren.forEach(sub => sub.style.display = 'none');
            const subToggle = child.querySelector('.toc-toggle');
            if (subToggle) subToggle.textContent = '▶';
        }
    });
    if (toggleEl) {
        toggleEl.textContent = isCollapsed ? '▼' : '▶';
    }
}

/* ---------- 搜索功能（基于预解析全文索引） ---------- */
function initSearch() {
    const input = $('#search-input');
    const results = $('#search-results');
    if (!input || !results) return;
    // 构建全文索引（从 fullChapterData 中提取）
    let searchIndex = [];
    fullChapterData.forEach((data, idx) => {
        const text = data.content; // 原始 Markdown
        const heading = data.meta?.title || data.headings.find(h => h.level === 1)?.text || `第${idx+1}章`;
        searchIndex.push({
            index: idx,
            heading: heading,
            content: text,
        });
    });

    function performSearch(term) {
        results.innerHTML = '';
        if (!term.trim()) {
            clearHighlight();
            return;
        }
        const regex = new RegExp(escapeRegExp(term.trim()), 'gi');
        const matches = [];
        searchIndex.forEach(item => {
            const content = item.content;
            let match;
            while ((match = regex.exec(content)) !== null) {
                matches.push({
                    index: item.index,
                    heading: item.heading,
                    start: match.index,
                    end: regex.lastIndex,
                    matchText: match[0],
                    context: extractContext(content, match.index, regex.lastIndex, 10)
                });
            }
        });
        if (matches.length === 0) {
            results.innerHTML = '<div style="color:#999;">没有找到匹配内容</div>';
            return;
        }
        // 按章节分组显示
        const grouped = {};
        matches.forEach(m => {
            if (!grouped[m.index]) grouped[m.index] = [];
            grouped[m.index].push(m);
        });
        for (const [idx, ms] of Object.entries(grouped)) {
            const heading = ms[0].heading;
            const div = document.createElement('div');
            div.className = 'search-result-item';
            const headingDiv = document.createElement('div');
            headingDiv.className = 'result-heading';
            headingDiv.textContent = '# ' + heading;
            headingDiv.style.fontWeight = 'bold';
            headingDiv.style.color = '#88b4e6';
            headingDiv.style.fontSize = '0.85rem';
            headingDiv.style.marginBottom = '2px';
            div.appendChild(headingDiv);
            // 显示前两个匹配上下文
            ms.slice(0, 2).forEach(m => {
                const ctxDiv = document.createElement('div');
                ctxDiv.className = 'result-context';
                ctxDiv.style.fontSize = '0.85rem';
                ctxDiv.style.color = '#ccc';
                const ctx = m.context;
                ctxDiv.innerHTML = escapeHtml(ctx.prefix) + '<strong>' + escapeHtml(ctx.match) + '</strong>' + escapeHtml(ctx.suffix);
                div.appendChild(ctxDiv);
            });
            div.addEventListener('click', () => {
                jumpToChapter(parseInt(idx), term);
            });
            results.appendChild(div);
        }
    }

    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const q = input.value.trim();
        debounceTimer = setTimeout(() => {
            performSearch(q);
        }, 300);
    });
    // 暴露重建映射（其实没必要）
    window.rebuildHeadingMap = () => {};
}

function jumpToChapter(index, term) {
    // 如果章节未渲染，先渲染它及其周围
    if (!loadedIndices.has(index)) {
        const range = getInitialRange(index);
        renderChapters(range).then(() => {
            setupLazyLoading();
            highlightAndScroll(index, term);
        });
    } else {
        highlightAndScroll(index, term);
    }
}

function highlightAndScroll(index, term) {
    // 找到对应章节的 DOM
    const wrappers = $$('#article-body .section-wrapper');
    const targetWrapper = wrappers[index]; // 假设顺序一致
    if (!targetWrapper) return;
    clearHighlight();
    const walker = document.createTreeWalker(
        targetWrapper,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (node.parentElement.closest('style, script, .search-highlight')) 
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    const regex = new RegExp(escapeRegExp(term.trim()), 'gi');
    let textNode;
    const highlights = [];
    while ((textNode = walker.nextNode())) {
        const text = textNode.textContent;
        if (!regex.test(text)) continue;
        regex.lastIndex = 0;
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
            highlights.push(span);
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
    }
    if (highlights.length > 0) {
        highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function extractContext(text, start, end, maxLen = 10) {
    const fullLen = text.length;
    let ctxStart = Math.max(0, start - maxLen);
    let ctxEnd = Math.min(fullLen, end + maxLen);
    if (ctxStart > 0) {
        const spaceBefore = text.lastIndexOf(' ', start);
        if (spaceBefore > 0 && start - spaceBefore < maxLen) {
            ctxStart = spaceBefore + 1;
        }
    }
    if (ctxEnd < fullLen) {
        const spaceAfter = text.indexOf(' ', end);
        if (spaceAfter > 0 && spaceAfter - end < maxLen) {
            ctxEnd = spaceAfter;
        }
    }
    let prefix = text.slice(ctxStart, start);
    let match = text.slice(start, end);
    let suffix = text.slice(end, ctxEnd);
    if (ctxStart > 0) prefix = '…' + prefix;
    if (ctxEnd < fullLen) suffix = suffix + '…';
    return { prefix, match, suffix };
}

function toggleSearchPanel() {
    const panel = $('#search-panel');
    if (panel) panel.classList.toggle('panel-visible');
    if (!panel.classList.contains('panel-visible')) {
        clearHighlight();
        const results = $('#search-results');
        if (results) results.innerHTML = '';
    }
}

/* ---------- 搜索高亮工具 ---------- */
let currentHighlights = [];

function clearHighlight() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });
    currentHighlights = [];
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchTerm(term, targetIndex = 0) {
    // 原有逻辑保留，但 jumpToChapter 中已使用自定义高亮，此处保持兼容
    if (!term || !term.trim()) { clearHighlight(); return; }
    clearHighlight();
    const body = document.getElementById('article-body');
    if (!body) return;
    const walker = document.createTreeWalker(
        body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (node.parentElement.closest('style, script, .search-highlight')) 
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    const regex = new RegExp(escapeRegExp(term.trim()), 'gi');
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
    const highlights = [];
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (!regex.test(text)) return;
        regex.lastIndex = 0;
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
            highlights.push(span);
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        textNode.parentNode.replaceChild(frag, textNode);
    });
    currentHighlights = highlights;
    if (targetIndex >= 0 && targetIndex < highlights.length) {
        highlights[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (highlights.length > 0) {
        highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/* ---------- 滚动追踪 ---------- */
function initScrollSpy() {
    const tocItems = $$('.toc-item');
    const autoCheckbox = $('#auto-scroll-checkbox');
    const rootEl = $('#content');
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
    // 清空原有选项
    select.innerHTML = '';
    // 从 fullChapterData 中获取所有一级标题
    fullChapterData.forEach((data, idx) => {
        const heading = data.headings.find(h => h.level === 1)?.text || data.meta?.title || `第${idx+1}章`;
        const opt = document.createElement('option');
        opt.value = idx; // 使用索引
        opt.textContent = heading;
        select.appendChild(opt);
    });
    select.addEventListener('change', () => {
        const idx = parseInt(select.value);
        if (!isNaN(idx)) {
            jumpToChapter(idx, ''); // 跳转并确保渲染
        }
    });
}

/* ---------- 评论区系统（保持不变） ---------- */
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

/* ---------- 登录、注册、回复、点赞 ---------- */
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
        state.likedComments.clear();
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

/* ---------- 绑定与同步 ---------- */
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

/* ---------- 移动端侧边栏 ---------- */
function initMobileSidebar() {
    const content = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');
    const app = document.getElementById('app');
    if (content) {
        content.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && sidebar && sidebar.classList.contains('sidebar-open')) {
                if (!sidebar.contains(e.target) && !e.target.closest('#toolbar')) {
                    sidebar.classList.remove('sidebar-open');
                    if (app) app.classList.remove('sidebar-active');
                }
            }
        });
    }
    function handleResize() {
        if (!sidebar || !app) return;
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('sidebar-open');
            app.classList.remove('sidebar-active');
        }
    }
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });
    handleResize();
}

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const app = document.getElementById('app');
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar-open');
    if (app) app.classList.toggle('sidebar-active');
};

window.clearHighlight = clearHighlight;
