const CHAPTERS = ['notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md'];
const AUTHOR_MD = 'notes/000/index.md';
let allSections = [];
let searchIndex = [];
let chapterHeadings = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadAndRenderAll();
    setupSidebarResize();
    setupAuthorPanel();
    setupSearchPanel();
    setupToolbarButtons();
    setupChapterSelect();
    restoreProgress();
    setupProgressSaving();
});

async function loadAndRenderAll() {
    const body = document.getElementById('article-body');
    let fullMarkdown = '';
    let versionMeta = null;

    for (let mdPath of CHAPTERS) {
        try {
            const resp = await fetch(mdPath);
            if (!resp.ok) continue;
            let md = await resp.text();
            const fm = parseFrontMatter(md);
            if (fm && !versionMeta && fm.title) versionMeta = fm;
            const chapterNum = mdPath.split('/')[1];

            // 补全 ![alt](src) 路径
            md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
                if (!src.startsWith('http') && !src.startsWith('/')) {
                    return `![${alt}](images/${chapterNum}/${src})`;
                }
                return match;
            });

            // 补全 :::image 路径
            md = md.replace(/(:::image\s+\S+\s+)([^\s]+)(\s*.*?:::)/g, (match, prefix, filename, suffix) => {
                if (!filename.startsWith('http') && !filename.startsWith('/')) {
                    return prefix + 'images/' + chapterNum + '/' + filename + suffix;
                }
                return match;
            });

            fullMarkdown += md + '\n\n';
        } catch (e) {
            console.warn(`加载失败: ${mdPath}`, e);
        }
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
    buildTOC();
    insertClearfix(body);
}

function parseFrontMatter(md) {
    const match = md.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return null;
    const lines = match[1].split('\n');
    const meta = {};
    lines.forEach(line => {
        const m = line.match(/^(\w+):\s*(.*)/);
        if (m) {
            let key = m[1], val = m[2].trim();
            if (key === 'tags') {
                val = val.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
            }
            meta[key] = val;
        }
    });
    return meta;
}

function postProcessImages(body) {
    const imgs = body.querySelectorAll('img');
    imgs.forEach(img => {
        const alt = img.alt || '';
        const match = alt.match(/\{(left|right|around)\s*(width=(\d+))?\}/);
        if (match) {
            const pos = match[1];
            const width = match[3];
            if (width) img.style.width = width + 'px';
            img.classList.add('iwp-img-' + pos);
            img.alt = alt.replace(match[0], '').trim();
        } else {
            img.classList.add('iwp-img-center');
        }
    });
}

function postProcessFigure(body) {
    const html = body.innerHTML;
    const regex = /:::image\s+(left|right|center)?\s*([^\s]+)\s*(.*?)\s*:::/g;
    body.innerHTML = html.replace(regex, (match, pos, filename, caption) => {
        pos = pos || 'center';
        return `<div class="figure-container figure-${pos}">
                    <img src="${filename}" alt="${caption}" class="iwp-img-${pos}">
                    <div class="figure-caption">${caption}</div>
                </div>`;
    });
    const allImgs = body.querySelectorAll('img');
    allImgs.forEach(img => {
        if (img.parentElement.classList.contains('figure-container')) return;
        if (!img.classList.contains('iwp-img-center') && !img.classList.contains('iwp-img-left') && !img.classList.contains('iwp-img-right') && !img.classList.contains('iwp-img-around')) {
            img.classList.add('iwp-img-center');
        }
    });
}

function highlightCode() {
    document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });
}

function renderMath() {
    renderMathInElement(document.getElementById('article-body'), {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
}

function buildHeadingStructure(body) {
    allSections = [];
    chapterHeadings = [];
    const headings = body.querySelectorAll('h1, h2, h3');
    headings.forEach((h, idx) => {
        if (!h.id) h.id = 'h-' + idx;
    });

    const topLevel = body.querySelectorAll('h1');
    topLevel.forEach(h1 => {
        let siblings = [];
        let node = h1;
        while (node) {
            siblings.push(node);
            node = node.nextElementSibling;
            if (node && node.tagName === 'H1') break;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'section-wrapper clearfix';
        siblings.forEach(n => wrapper.appendChild(n));
        body.appendChild(wrapper);
        allSections.push({ type: 'h1', id: h1.id, wrapper });
        chapterHeadings.push({ id: h1.id, text: h1.textContent.trim() });
    });
}

function insertClearfix(body) {
    const wrappers = body.querySelectorAll('.section-wrapper');
    wrappers.forEach(w => {
        const clearDiv = document.createElement('div');
        clearDiv.style.clear = 'both';
        w.appendChild(clearDiv);
    });
}

function buildTOC() {
    const tocContainer = document.getElementById('toc-tree');
    tocContainer.innerHTML = '';
    const body = document.getElementById('article-body');
    const headings = body.querySelectorAll('h1, h2, h3');
    headings.forEach((h, idx) => {
        const level = parseInt(h.tagName.charAt(1));
        const text = h.textContent.trim();
        const item = document.createElement('div');
        item.className = `toc-item toc-h${level}`;
        
        const toggle = document.createElement('span');
        toggle.className = 'toc-toggle';
        toggle.textContent = '▼';
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCollapse(h, toggle);
        });
        item.appendChild(toggle);
        
        const span = document.createElement('span');
        span.textContent = text;
        item.appendChild(span);
        
        item.addEventListener('click', () => {
            h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        
        tocContainer.appendChild(item);
    });
}

function toggleCollapse(heading, toggleEl) {
    const wrapper = heading.closest('.section-wrapper');
    if (!wrapper) return;
    if (wrapper.style.display === 'none') {
        wrapper.style.display = '';
        toggleEl.textContent = '▼';
    } else {
        wrapper.style.display = 'none';
        toggleEl.textContent = '▶';
    }
}

function expandAll() {
    document.querySelectorAll('.section-wrapper').forEach(w => w.style.display = '');
    document.querySelectorAll('.toc-toggle').forEach(t => t.textContent = '▼');
}
function collapseAll() {
    document.querySelectorAll('.section-wrapper').forEach(w => w.style.display = 'none');
    document.querySelectorAll('.toc-toggle').forEach(t => t.textContent = '▶');
}

function setupSidebarResize() {
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('resizer');
    let isResizing = false;
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX;
        if (newWidth > 180 && newWidth < 500) {
            sidebar.style.width = newWidth + 'px';
        }
    });
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    });
}

function setupAuthorPanel() {
    const btn = document.getElementById('btn-author');
    const panel = document.getElementById('author-panel');
    const closeBtn = document.getElementById('close-author');
    btn.addEventListener('click', async () => {
        panel.classList.add('panel-visible');
        try {
            const resp = await fetch(AUTHOR_MD);
            if (resp.ok) {
                const md = await resp.text();
                const fm = parseFrontMatter(md);
                let name = fm?.name || '未署名';
                let bio = fm?.bio || '暂无简介';
                let avatar = fm?.avatar || '';
                if (avatar && !avatar.startsWith('http')) avatar = 'images/000/' + avatar;
                document.getElementById('author-info').innerHTML = `
                    ${avatar ? `<img src="${avatar}" style="width:80px;border-radius:50%;margin-bottom:1rem;">` : ''}
                    <h2>${name}</h2>
                    <p>${bio}</p>
                `;
            } else {
                document.getElementById('author-info').innerHTML = '<p>作者信息未找到</p>';
            }
        } catch (e) {
            document.getElementById('author-info').innerHTML = '<p>加载失败</p>';
        }
    });
    closeBtn.addEventListener('click', () => panel.classList.remove('panel-visible'));
}

function setupSearchPanel() {
    const btn = document.getElementById('btn-search');
    const panel = document.getElementById('search-panel');
    const closeBtn = document.getElementById('close-search');
    const input = document.getElementById('search-input');
    const resultsDiv = document.getElementById('search-results');

    btn.addEventListener('click', () => panel.classList.add('panel-visible'));
    closeBtn.addEventListener('click', () => panel.classList.remove('panel-visible'));

    async function buildIndex() {
        const bodyText = document.getElementById('article-body').innerText;
        const sections = bodyText.split(/\n(?=#{1,3}\s)/);
        searchIndex = [];
        sections.forEach(sec => {
            const lines = sec.split('\n');
            const title = lines[0].replace(/^#+\s*/, '');
            const content = lines.slice(1).join(' ');
            searchIndex.push({ title, content, path: '' });
        });
    }
    buildIndex();

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        resultsDiv.innerHTML = '';
        if (!query) return;
        const matched = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
        );
        matched.forEach(m => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<div class="title">${m.title}</div><div class="excerpt">${m.content.slice(0, 100)}...</div>`;
            div.addEventListener('click', () => {
                const allH = document.querySelectorAll('#article-body h1, #article-body h2, #article-body h3');
                for (let h of allH) {
                    if (h.textContent.trim() === m.title) {
                        h.scrollIntoView({ behavior: 'smooth' });
                        panel.classList.remove('panel-visible');
                        break;
                    }
                }
            });
            resultsDiv.appendChild(div);
        });
    });
}

function setupChapterSelect() {
    const select = document.getElementById('chapter-select');
    select.innerHTML = '<option value="">— 快速跳转章节 —</option>';
    chapterHeadings.forEach(ch => {
        const option = document.createElement('option');
        option.value = ch.id;
        option.textContent = ch.text;
        select.appendChild(option);
    });
    select.addEventListener('change', () => {
        const targetId = select.value;
        if (!targetId) return;
        const targetElem = document.getElementById(targetId);
        if (targetElem) {
            targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

function restoreProgress() {
    const saved = localStorage.getItem('iwp-progress');
    if (saved) {
        const pos = parseInt(saved);
        const contentDiv = document.getElementById('content');
        if (!isNaN(pos)) {
            contentDiv.scrollTop = pos;
        }
    }
}
function setupProgressSaving() {
    const contentDiv = document.getElementById('content');
    let timer;
    contentDiv.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            localStorage.setItem('iwp-progress', contentDiv.scrollTop);
        }, 300);
    });
}

function setupToolbarButtons() {
    document.getElementById('expand-all').addEventListener('click', expandAll);
    document.getElementById('collapse-all').addEventListener('click', collapseAll);
}
