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
    setupSidebarResize();
    setupAuthorPanel();
    setupChapterSelect();
    setupSearch();
    setupScrollSpy();
    restoreProgress();
    setupProgressSaving();
});

// ========== 核心加载 ==========
async function loadAndRenderAll() {
    const body = document.getElementById('article-body');
    let fullMarkdown = '', versionMeta = null;

    for (let mdPath of CHAPTERS) {
        try {
            const resp = await fetch(mdPath);
            if (!resp.ok) continue;
            let md = await resp.text();

            const fmResult = extractAndRemoveFrontMatter(md);
            if (fmResult.meta && !versionMeta && fmResult.meta.title) versionMeta = fmResult.meta;
            md = fmResult.content;

            const chapterNum = mdPath.split('/')[1];
            // 图片路径补全（两种语法）
            md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
                if (!src.startsWith('http') && !src.startsWith('/')) return `![${alt}](images/${chapterNum}/${src})`;
                return m;
            });
            md = md.replace(/(:::image\s+\S+\s+)([^\s]+)(\s*.*?:::)/g, (m, prefix, filename, suffix) => {
                if (!filename.startsWith('http') && !filename.startsWith('/')) return prefix + 'images/' + chapterNum + '/' + filename + suffix;
                return m;
            });

            fullMarkdown += md + '\n\n';
        } catch (e) { console.warn('加载失败:', mdPath, e); }
    }

    const versionDiv = document.getElementById('version-info');
    if (versionMeta) {
        versionDiv.innerHTML = `<strong>${versionMeta.title||''}</strong> ${versionMeta.date?'· 更新:'+versionMeta.date:''} ${versionMeta.version?'· v'+versionMeta.version:''} ${versionMeta.tags?'· 标签:'+(Array.isArray(versionMeta.tags)?versionMeta.tags.join(', '):versionMeta.tags):''}`;
        versionDiv.style.display = 'block';
    }

    let html = marked.parse(fullMarkdown);
    body.innerHTML = html;
    postProcessImages(body);
    postProcessFigure(body);
    highlightCode();
    renderMath();
    buildHeadingStructure(body);
    // 底部透明占位符，防止遮挡
    const spacer = document.createElement('div');
    spacer.style.height = '25vh'; spacer.style.width = '100%'; spacer.style.clear = 'both';
    body.appendChild(spacer);
    buildTOC();
    insertClearfix(body);
}

// ========== 工具函数 ==========
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
            if (key === 'tags') val = val.replace(/[\[\]]/g, '').split(',').map(t=>t.trim());
            meta[key] = val;
        }
    });
    let content = lines.slice(end+1).join('\n').replace(/^\n+/, '');
    return { content, meta };
}

function postProcessImages(body) {
    body.querySelectorAll('img').forEach(img => {
        const alt = img.alt || '';
        const match = alt.match(/\{(left|right|around)\s*(width=(\d+))?\}/);
        if (match) {
            const pos = match[1], width = match[3];
            if (width) img.style.width = width+'px';
            img.classList.add('iwp-img-'+pos);
            img.alt = alt.replace(match[0], '').trim();
        } else {
            img.classList.add('iwp-img-center');
        }
    });
}

function postProcessFigure(body) {
    const regex = /:::image\s+(left|right|center)?\s*([^\s]+)\s*(.*?)\s*:::/g;
    body.innerHTML = body.innerHTML.replace(regex, (m, pos, filename, caption) => {
        pos = pos || 'center';
        return `<div class="figure-container figure-${pos}"><img src="${filename}" alt="${caption}" class="iwp-img-${pos}"><div class="figure-caption">${caption}</div></div>`;
    });
    body.querySelectorAll('img').forEach(img => {
        if (img.parentElement.classList.contains('figure-container')) return;
        if (!img.className.includes('iwp-img-')) img.classList.add('iwp-img-center');
    });
}

function highlightCode() { document.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b)); }
function renderMath() { renderMathInElement(document.getElementById('article-body'), { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError: false }); }

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

    allSections = []; chapterHeadings = [];
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
        const d = document.createElement('div'); d.style.clear='both'; w.appendChild(d);
    });
}

// ========== 目录与折叠 ==========
function buildTOC() {
    const toc = document.getElementById('toc-tree'); toc.innerHTML = '';
    const headings = document.querySelectorAll('#article-body h1, #article-body h2, #article-body h3');
    let lastH1=null, lastH2=null;
    headings.forEach((h, idx) => {
        if (!h.id) h.id = 'h-'+idx;
        const level = parseInt(h.tagName.charAt(1));
        const text = h.textContent.trim();
        const item = document.createElement('div');
        item.className = `toc-item toc-h${level}`;
        item.setAttribute('data-target', h.id);

        if (level===1) { lastH1=h.id; lastH2=null; }
        else if (level===2) { lastH2=h.id; item.setAttribute('data-parent', lastH1); }
        else if (level===3) { item.setAttribute('data-parent', lastH2||lastH1); }

        if (level<=2) {
            const toggle = document.createElement('span');
            toggle.className='toc-toggle'; toggle.textContent='▼';
            toggle.addEventListener('click', e => { e.stopPropagation(); toggleSectionVisibility(h.id, toggle); });
            item.appendChild(toggle);
        } else {
            const spacer = document.createElement('span');
            spacer.style.display='inline-block'; spacer.style.width='1rem';
            item.appendChild(spacer);
        }
        const span = document.createElement('span'); span.textContent=text;
        item.appendChild(span);
        item.addEventListener('click', () => { document.getElementById(h.id)?.scrollIntoView({behavior:'smooth',block:'start'}); });
        toc.appendChild(item);
    });
}

function toggleSectionVisibility(headingId, toggleEl) {
    const target = document.getElementById(headingId);
    if (!target) return;
    const wrapper = target.closest('.section-wrapper');
    if (!wrapper) return;
    const visible = wrapper.style.display !== 'none';
    if (visible) {
        wrapper.style.display = 'none'; toggleEl.textContent = '▶';
        hideTOCChildren(headingId);
    } else {
        wrapper.style.display = ''; toggleEl.textContent = '▼';
        showTOCChildren(headingId);
    }
}

function hideTOCChildren(parentId) {
    document.querySelectorAll(`.toc-item[data-parent="${parentId}"]`).forEach(c => c.style.display='none');
}
function showTOCChildren(parentId) {
    document.querySelectorAll(`.toc-item[data-parent="${parentId}"]`).forEach(c => {
        if (isParentVisible(c)) c.style.display='';
    });
}
function isParentVisible(child) {
    const pid = child.getAttribute('data-parent');
    if (!pid) return true;
    const p = document.getElementById(pid);
    if (!p) return true;
    const pw = p.closest('.section-wrapper');
    return !(pw && pw.style.display==='none');
}

function expandAll() {
    document.querySelectorAll('.section-wrapper').forEach(w => w.style.display='');
    document.querySelectorAll('.toc-toggle').forEach(t => t.textContent='▼');
    document.querySelectorAll('.toc-item[data-parent]').forEach(i => i.style.display='');
}
function collapseAll() {
    document.querySelectorAll('.section-wrapper').forEach(w => w.style.display='none');
    document.querySelectorAll('.toc-toggle').forEach(t => t.textContent='▶');
    document.querySelectorAll('.toc-item[data-parent]').forEach(i => i.style.display='none');
}
window.expandAll = expandAll;
window.collapseAll = collapseAll;

// ========== 侧栏拖动 ==========
function setupSidebarResize() {
    const sidebar = document.getElementById('sidebar'), resizer = document.getElementById('resizer');
    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing=true; document.body.style.cursor='col-resize'; document.body.style.userSelect='none'; });
    document.addEventListener('mousemove', e => { if(!isResizing) return; let w=e.clientX; if(w>180&&w<500) sidebar.style.width=w+'px'; });
    document.addEventListener('mouseup', () => { isResizing=false; document.body.style.cursor=''; document.body.style.userSelect=''; });
}

// ========== 作者面板 ==========
function setupAuthorPanel() {
    const btn = document.getElementById('btn-author'); if(!btn) return;
    const panel = document.getElementById('author-panel'), close = document.getElementById('close-author');
    btn.addEventListener('click', async () => {
        panel.classList.add('panel-visible');
        try {
            const resp = await fetch(AUTHOR_MD);
            if(resp.ok) {
                const md = await resp.text();
                const fm = extractAndRemoveFrontMatter(md).meta || {};
                let name=fm.name||'未署名', bio=fm.bio||'暂无简介', avatar=fm.avatar||'';
                if(avatar&&!avatar.startsWith('http')) avatar='images/000/'+avatar;
                document.getElementById('author-info').innerHTML = `${avatar?`<img src="${avatar}" style="width:80px;border-radius:50%;margin-bottom:1rem;">`:''}<h2>${name}</h2><p>${bio}</p>`;
            }
        } catch(e){}
    });
    close.addEventListener('click', ()=> panel.classList.remove('panel-visible'));
}

// ========== 搜索（基于h3索引） ==========
function setupSearch() {
    const input = document.getElementById('search-input'), results = document.getElementById('search-results');
    function buildIndex() {
        const h3s = document.querySelectorAll('#article-body h3');
        searchIndex = [];
        h3s.forEach((h3, i) => {
            if(!h3.id) h3.id = 'h3-'+i;
            const title = h3.textContent.trim();
            let ctx='', node=h3.nextElementSibling;
            while(node && !['H1','H2','H3'].includes(node.tagName)) {
                if(node.textContent.trim()) ctx += node.textContent.trim()+' ';
                node = node.nextElementSibling;
                if(ctx.length>80) break;
            }
            searchIndex.push({ title, context: ctx.slice(0,80).trim(), id: h3.id });
        });
    }
    buildIndex();
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        results.innerHTML = '';
        if(!q) return;
        searchIndex.filter(i=>i.title.includes(q)||i.context.includes(q)).forEach(i=>{
            const div = document.createElement('div');
            div.className='search-result-item';
            div.innerHTML = `<div class="title">${i.title}</div><div class="context">${i.context}</div>`;
            div.addEventListener('click', ()=>{
                document.getElementById(i.id)?.scrollIntoView({behavior:'smooth',block:'start'});
                document.getElementById('search-panel').classList.remove('panel-visible');
            });
            results.appendChild(div);
        });
    });
}

// ========== 章节跳转 ==========
function setupChapterSelect() {
    const select = document.getElementById('chapter-select');
    select.innerHTML = '<option value="">— 快速跳转章节 —</option>';
    chapterHeadings.forEach(ch => { const opt = document.createElement('option'); opt.value=ch.id; opt.textContent=ch.text; select.appendChild(opt); });
    select.addEventListener('change', ()=>{ const el=document.getElementById(select.value); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); });
}

// ========== 滚动监听 + 多级高亮 + 自动跟随 ==========
function setupScrollSpy() {
    const content = document.getElementById('content');
    const tocItems = document.querySelectorAll('.toc-item');
    const autoCheckbox = document.getElementById('auto-scroll-checkbox');

    const headingToToc = new Map();
    tocItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        if(targetId) { const h = document.getElementById(targetId); if(h) headingToToc.set(h, item); }
    });
    const allHeadings = [...headingToToc.keys()].sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);

    function onScroll() {
        const scrollTop = content.scrollTop + 60;
        let activeHeading = null;
        for(let i=allHeadings.length-1; i>=0; i--) {
            if(allHeadings[i].offsetTop <= scrollTop) { activeHeading = allHeadings[i]; break; }
        }
        tocItems.forEach(i => i.classList.remove('active'));
        if(!activeHeading) return;

        let currentItem = headingToToc.get(activeHeading);
        while(currentItem) {
            currentItem.classList.add('active');
            const parentId = currentItem.getAttribute('data-parent');
            if(parentId) {
                currentItem = document.querySelector(`.toc-item[data-target="${parentId}"]`);
            } else break;
        }

        if(autoCheckbox.checked && activeHeading) {
            const targetItem = headingToToc.get(activeHeading);
            if(targetItem) targetItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
    content.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ========== 进度记忆 ==========
function restoreProgress() { const s=localStorage.getItem('iwp-progress'); if(s) document.getElementById('content').scrollTop=parseInt(s)||0; }
function setupProgressSaving() { const c=document.getElementById('content'); let t; c.addEventListener('scroll', ()=>{ clearTimeout(t); t=setTimeout(()=>localStorage.setItem('iwp-progress',c.scrollTop),300); }); }
