const CHAPTERS = [
    'notes/000/index.md',
    'notes/001/index.md',
    'notes/002/index.md',
    'notes/003/index.md',
    'notes/004/index.md',
    'notes/005/index.md',
    'notes/006/index.md',
    'notes/007/index.md',
    'notes/008/index.md',
    'notes/009/index.md',
    'notes/010/index.md',
    'notes/011/index.md',
    'notes/012/index.md',
    'notes/013/index.md',
    'notes/014/index.md',
    'notes/015/index.md',
    'notes/016/index.md',
    'notes/017/index.md',
    'notes/018/index.md',
    'notes/019/index.md'
];

const AUTHOR_MD = 'notes/000/index.md';
let allSections = [];
let searchIndex = [];
let chapterHeadings = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderAll();
    setupSidebarResize();
    setupAuthorPanel();
    setupChapterSelect();
    setupSearch();
    setupScrollSpy();      // 滚动监听与自动跟随
    restoreProgress();
    setupProgressSaving();
});

// ========== 加载所有章节并渲染 ==========
async function loadAndRenderAll() {
    const body = document.getElementById('article-body');
    let fullMarkdown = '';
    let versionMeta = null;

    for (let mdPath of CHAPTERS) {
        try {
            const resp = await fetch(mdPath);
            if (!resp.ok) continue;
            let md = await resp.text();

            const fmResult = extractAndRemoveFrontMatter(md);
            if (fmResult.meta) {
                if (!versionMeta && fmResult.meta.title) versionMeta = fmResult.meta;
            }
            md = fmResult.content;

            const chapterNum = mdPath.split('/')[1];
            md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
                if (!src.startsWith('http') && !src.startsWith('/')) return `![${alt}](images/${chapterNum}/${src})`;
                return match;
            });
            md = md.replace(/(:::image\s+\S+\s+)([^\s]+)(\s*.*?:::)/g, (match, prefix, filename, suffix) => {
                if (!filename.startsWith('http') && !filename.startsWith('/')) return prefix + 'images/' + chapterNum + '/' + filename + suffix;
                return match;
            });

            fullMarkdown += md + '\n\n';
        } catch (e) { console.warn(`加载失败: ${mdPath}`, e); }
    }

    const versionDiv = document.getElementById('version-info');
    if (versionMeta) {
        versionDiv.innerHTML = `
            <strong>${versionMeta.title || ''}</strong> 
            ${versionMeta.date ? '· 更新: ' + versionMeta.date : ''}
            ${versionMeta.version ? '· v' + versionMeta.version : ''}
            ${versionMeta.tags ? '· 标签: ' + (Array.isArray(versionMeta.tags) ? versionMeta.tags.join(', ') : versionMeta.tags) : ''}
        `;
        versionDiv.style.display = 'block';
    }

    let html = marked.parse(fullMarkdown);
    body.innerHTML = html;
    postProcessImages(body);
    postProcessFigure(body);
    highlightCode();
    renderMath();
    buildHeadingStructure(body);
    // 在文章末尾插入透明占位符，确保底部不被遮挡
    const spacer = document.createElement('div');
    spacer.style.height = '25vh';
    spacer.style.width = '100%';
    spacer.style.clear = 'both';
    body.appendChild(spacer);
    buildTOC();
    insertClearfix(body);
}

// ========== Front Matter 解析 ==========
function extractAndRemoveFrontMatter(md) {
    const lines = md.split(/\r?\n/);
    if (lines[0].trim() !== '---') return { content: md, meta: null };
    let end = lines.indexOf('---', 1);
    if (end === -1) return { content: md, meta: null };
    const fmLines = lines.slice(1, end);
    const meta = {};
    fmLines.forEach(line => {
        const m = line.match(/^(\w+):\s*(.*)/);
        if (m) {
            let key = m[1], val = m[2].trim();
            if (key === 'tags') val = val.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
            meta[key] = val;
        }
    });
    let content = lines.slice(end + 1).join('\n').replace(/^\n+/, '');
    return { content, meta };
}

function postProcessImages(body) { /* 与之前相同，略 */ }
function postProcessFigure(body) { /* 与之前相同，略 */ }
function highlightCode() { document.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b)); }
function renderMath() { renderMathInElement(document.getElementById('article-body'), { delimiters: [{left:'$$', right:'$$', display:true},{left:'$', right:'$', display:false}], throwOnError: false }); }

// ========== 章节包裹（保持顺序） ==========
function buildHeadingStructure(body) {
    const h1s = body.querySelectorAll('h1');
    if (!h1s.length) return;
    const fragment = document.createDocumentFragment();
    let currentWrapper = null;

    Array.from(body.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.tagName === 'H1') {
            if (currentWrapper) fragment.appendChild(currentWrapper);
            currentWrapper = document.createElement('div');
            currentWrapper.className = 'section-wrapper clearfix';
            currentWrapper.appendChild(node);
        } else if (currentWrapper) {
            currentWrapper.appendChild(node);
        } else {
            fragment.appendChild(node);
        }
    });
    if (currentWrapper) fragment.appendChild(currentWrapper);

    body.innerHTML = '';
    body.appendChild(fragment);

    allSections = [];
    chapterHeadings = [];
    body.querySelectorAll('.section-wrapper').forEach(w => {
        const h1 = w.querySelector('h1');
        if (h1) {
            if (!h1.id) h1.id = 'h-' + Math.random().toString(36).substr(2,8);
            allSections.push({ type:'h1', id:h1.id, wrapper:w });
            chapterHeadings.push({ id:h1.id, text:h1.textContent.trim() });
        }
    });
}

function insertClearfix(body) {
    body.querySelectorAll('.section-wrapper').forEach(w => {
        const div = document.createElement('div'); div.style.clear='both'; w.appendChild(div);
    });
}

// ========== 目录生成 + 折叠逻辑 ==========
function buildTOC() {
    const toc = document.getElementById('toc-tree');
    toc.innerHTML = '';
    const headings = document.querySelectorAll('#article-body h1, #article-body h2, #article-body h3');
    let lastH1 = null, lastH2 = null;

    headings.forEach((h, idx) => {
        if (!h.id) h.id = 'h-' + idx;
        const level = parseInt(h.tagName.charAt(1));
        const text = h.textContent.trim();
        const item = document.createElement('div');
        item.className = `toc-item toc-h${level}`;
        item.setAttribute('data-target', h.id);

        if (level === 1) {
            lastH1 = h.id;
            lastH2 = null;
        } else if (level === 2) {
            lastH2 = h.id;
            item.setAttribute('data-parent', lastH1);
        } else if (level === 3) {
            item.setAttribute('data-parent', lastH2 || lastH1);
        }

        // 折叠按钮（h1 和 h2 可折叠）
        if (level <= 2) {
            const toggle = document.createElement('span');
            toggle.className = 'toc-toggle';
            toggle.textContent = '▼';
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSectionVisibility(h.id, toggle);
            });
            item.appendChild(toggle);
        } else {
            const spacer = document.createElement('span');
            spacer.style.display = 'inline-block';
            spacer.style.width = '1rem';
            item.appendChild(spacer);
        }

        const span = document.createElement('span');
        span.textContent = text;
        item.appendChild(span);
        item.addEventListener('click', () => {
            document.getElementById(h.id)?.scrollIntoView({ behavior:'smooth', block:'start' });
        });

        toc.appendChild(item);
    });
}

function toggleSectionVisibility(headingId, toggleEl) {
    const targetHeading = document.getElementById(headingId);
    if (!targetHeading) return;
    const wrapper = targetHeading.closest('.section-wrapper');
    if (!wrapper) return;

    const isVisible = wrapper.style.display !== 'none';
    if (isVisible) {
        wrapper.style.display = 'none';
        toggleEl.textContent = '▶';
        hideTOCChildren(headingId);
    } else {
        wrapper.style.display = '';
        toggleEl.textContent = '▼';
        showTOCChildren(headingId);
    }
}

function hideTOCChildren(parentId) {
    document.querySelectorAll(`.toc-item[data-parent="${parentId}"]`).forEach(c => c.style.display = 'none');
}
function showTOCChildren(parentId) {
    document.querySelectorAll(`.toc-item[data-parent="${parentId}"]`).forEach(c => {
        if (isParentVisible(c)) c.style.display = '';
    });
}
function isParentVisible(child) {
    const parentId = child.getAttribute('data-parent');
    if (!parentId) return true;
    const parentHeading = document.getElementById(parentId);
    if (!parentHeading) return true;
    const parentWrapper = parentHeading.closest('.section-wrapper');
    return !(parentWrapper && parentWrapper.style.display === 'none');
}

// 全局展开/折叠
function expandAll() {
    document.querySelectorAll('.section-wrapper').forEach(w => w.style.display = '');
    document.querySelectorAll('.toc-toggle').forEach(t => t.textContent = '▼');
    document.querySelectorAll('.toc-item[data-parent]').forEach(item => item.style.display = '');
}
function collapseAll() {
    document.querySelectorAll('.section-wrapper').forEach(w => w.style.display = 'none');
    document.querySelectorAll('.toc-toggle').forEach(t => t.textContent = '▶');
    document.querySelectorAll('.toc-item[data-parent]').forEach(item => item.style.display = 'none');
}
window.expandAll = expandAll;
window.collapseAll = collapseAll;

// ========== 侧栏拖动 ==========
function setupSidebarResize() { /* 保持不变 */ }

// ========== 作者面板 ==========
function setupAuthorPanel() { /* 保持不变 */ }

// ========== 搜索功能 ==========
function setupSearch() { /* 保持不变，基于 h3 索引 */ }

// ========== 章节下拉跳转 ==========
function setupChapterSelect() { /* 保持不变 */ }

// ========== 滚动监听 + 自动跟随 + 多级高亮 ==========
function setupScrollSpy() {
    const content = document.getElementById('content');
    const tocItems = document.querySelectorAll('.toc-item');
    const autoCheckbox = document.getElementById('auto-scroll-checkbox');

    // 建立所有标题元素与其目录项的映射
    const headingToToc = new Map();
    tocItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        if (targetId) {
            const heading = document.getElementById(targetId);
            if (heading) headingToToc.set(heading, item);
        }
    });

    // 获取所有标题（按 DOM 顺序）
    const allHeadings = [...headingToToc.keys()].sort((a,b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

    function onScroll() {
        const scrollTop = content.scrollTop + 60; // 偏移量，使高亮更自然
        let activeHeading = null;

        // 从下往上找第一个在滚动位置附近的标题
        for (let i = allHeadings.length - 1; i >= 0; i--) {
            const heading = allHeadings[i];
            if (heading.offsetTop <= scrollTop) {
                activeHeading = heading;
                break;
            }
        }

        // 移除所有高亮
        tocItems.forEach(item => item.classList.remove('active'));

        if (!activeHeading) return;

        // 高亮当前标题及其所有父级（向上追溯 data-parent 链）
        let currentItem = headingToToc.get(activeHeading);
        while (currentItem) {
            currentItem.classList.add('active');
            const parentId = currentItem.getAttribute('data-parent');
            if (parentId) {
                const parentItem = document.querySelector(`.toc-item[data-target="${parentId}"]`);
                currentItem = parentItem;
            } else {
                break;
            }
        }

        // 自动跟随开关
        if (autoCheckbox.checked && currentItem) {
            // 将最初激活的那个条目（而不是父级）滚动到侧栏可见区域
            const targetItem = headingToToc.get(activeHeading);
            if (targetItem) {
                targetItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }

    content.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始化
}

// ========== 进度记忆 ==========
function restoreProgress() { /* 保持不变 */ }
function setupProgressSaving() { /* 保持不变 */ }
