const CHAPTERS = [
    'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
    'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
    'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
    'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
    'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
];
const AUTHOR_MD = 'notes/000/index.md';
let allSections = [], searchIndex = [], chapterHeadings = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderAll();
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 500);
    }
    setupSidebarResize();
    setupAuthorPanel();
    setupChapterSelect();
    setupSearch();
    setupScrollSpy();
    restoreProgress();
    setupProgressSaving();
});

// ========== 并行下载 + 分批渲染 ==========
async function loadAndRenderAll() {
    const body = document.getElementById('article-body');
    const progressText = document.getElementById('progress-text');
    const total = CHAPTERS.length;

    // 1. 并行下载所有章节
    const fetchPromises = CHAPTERS.map((path, i) =>
        fetch(path)
            .then(resp => resp.ok ? resp.text() : Promise.reject(`HTTP ${resp.status}`))
            .then(md => {
                if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${total}`;
                const fmResult = extractAndRemoveFrontMatter(md);
                let content = fmResult.content;
                const chapterNum = path.split('/')[1];
                // 图片路径补全
                content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
                    if (!src.startsWith('http') && !src.startsWith('/')) return `![${alt}](images/${chapterNum}/${src})`;
                    return m;
                });
                content = content.replace(/(:::image\s+\S+\s+)([^\s]+)(\s*.*?:::)/g, (m, prefix, filename, suffix) => {
                    if (!filename.startsWith('http') && !filename.startsWith('/')) return prefix + 'images/' + chapterNum + '/' + filename + suffix;
                    return m;
                });
                return { meta: fmResult.meta, content };
            })
            .catch(err => {
                console.warn(`加载失败: ${path}`, err);
                return { meta: null, content: '' };
            })
    );

    const results = await Promise.all(fetchPromises);

    // 2. 提取版本信息
    let versionMeta = null;
    for (const r of results) {
        if (r.meta && r.meta.title) { versionMeta = r.meta; break; }
    }
    const versionDiv = document.getElementById('version-info');
    if (versionMeta) {
        versionDiv.innerHTML = `<strong>${versionMeta.title||''}</strong> ${versionMeta.date?'· 更新:'+versionMeta.date:''} ${versionMeta.version?'· v'+versionMeta.version:''} ${versionMeta.tags?'· 标签:'+(Array.isArray(versionMeta.tags)?versionMeta.tags.join(', '):versionMeta.tags):''}`;
        versionDiv.style.display = 'block';
    }

    // 3. 分批渲染，每 3 章暂停让浏览器喘气
    if (progressText) progressText.textContent = '正在排版渲染...';
    body.innerHTML = '';

    for (let i = 0; i < results.length; i++) {
        const chunk = results[i].content;
        if (!chunk) continue;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-chunk';
        const html = marked.parse(chunk);
        sectionDiv.innerHTML = html;

        postProcessImages(sectionDiv);
        postProcessFigure(sectionDiv);
        sectionDiv.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));

        body.appendChild(sectionDiv);

        if (i % 3 === 2 || i === results.length - 1) {
            if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${results.length}`;
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }

    // 4. 全局后处理
    renderMath();
    buildHeadingStructure(body);
    buildTOC();
    insertClearfix(body);

    const spacer = document.createElement('div');
    spacer.style.height = '25vh'; spacer.style.width = '100%'; spacer.style.clear = 'both';
    body.appendChild(spacer);
}

// ========== 以下所有辅助函数与之前优化版完全相同（为节省篇幅，仅列出签名，请直接复制之前的完整版本） ==========
function extractAndRemoveFrontMatter(md) { /* ... */ }
function postProcessImages(container) { /* ... */ }
function postProcessFigure(container) { /* ... */ }
function highlightCode() { }
function renderMath() { }
function buildHeadingStructure(body) { /* ... */ }
function insertClearfix(body) { /* ... */ }
function buildTOC() { /* ... */ }
function toggleSectionVisibility(headingId, toggleEl) { /* ... */ }
function hideTOCChildren(parentId) { /* ... */ }
function showTOCChildren(parentId) { /* ... */ }
function isParentVisible(child) { /* ... */ }
function expandAll() { /* ... */ }
function collapseAll() { /* ... */ }
function setupSidebarResize() { /* ... */ }
function setupAuthorPanel() { /* ... */ }
function setupSearch() { /* 内含防抖 */ }
function setupChapterSelect() { /* ... */ }
function setupScrollSpy() { /* IntersectionObserver 版本 */ }
function restoreProgress() { /* ... */ }
function setupProgressSaving() { /* ... */ }
