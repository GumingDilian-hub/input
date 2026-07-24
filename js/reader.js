// ========== 请在这里填入你的新 GitHub Fine-grained Token（需有 Issues 读写权限） ==========
const GH_TOKEN = 'github_pat_11CCJOKZA05hSx9LAdJe94_qF5j2YnHlA7mlazPT1aioksB5Krsbr9hTkvcI1mFv3CEKH3XVnYGW7RoF';
// =====================================================================================

const REPO_OWNER = 'GumingDilian-hub';
const REPO_NAME = 'input';
const COMMENT_LABEL = 'comment';
const USER_LABEL = 'users';
const CHAPTER_LIKE_LABEL = 'chapter-like';
const SPECIAL_USER = 'loading';
const SPECIAL_PASS = '10000';
const SPECIAL_TAG = '始作俑者';

const CHAPTERS = [
    'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
    'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
    'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
    'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
    'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
];
const AUTHOR_MD = 'notes/000/index.md';
let allSections = [], searchIndex = [], chapterHeadings = [];
let currentUser = null;

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
    setupUserSystem();
    setupComments();
});

// ========== 并行下载 + 分批渲染 ==========
async function loadAndRenderAll() {
    const body = document.getElementById('article-body');
    if (!body) return;
    const progressText = document.getElementById('progress-text');
    const total = CHAPTERS.length;

    const fetchPromises = CHAPTERS.map((path, i) =>
        fetch(path)
            .then(resp => resp.ok ? resp.text() : Promise.reject(`HTTP ${resp.status}`))
            .then(md => {
                if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${total}`;
                const fmResult = extractAndRemoveFrontMatter(md);
                let content = fmResult.content;
                const chapterNum = path.split('/')[1];
                content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
                    if (!src.startsWith('http') && !src.startsWith('/')) return `![${alt}](images/${chapterNum}/${src})`;
                    return m;
                });
                content = content.replace(/(:::image\s+\S+\s+)([^\s]+)(\s*.*?:::)/g, (m, prefix, filename, suffix) => {
                    if (!filename.startsWith('http') && !filename.startsWith('/')) return prefix + 'images/' + chapterNum + '/' + filename + suffix;
                    return m;
                });
                return { meta: fmResult.meta, content, chapterNum };
            })
            .catch(err => {
                console.warn(`加载失败: ${path}`, err);
                return { meta: null, content: '', chapterNum: path.split('/')[1] };
            })
    );

    const results = await Promise.all(fetchPromises);

    let versionMeta = null;
    for (const r of results) {
        if (r.meta && r.meta.title) { versionMeta = r.meta; break; }
    }
    const versionDiv = document.getElementById('version-info');
    if (versionMeta && versionDiv) {
        versionDiv.innerHTML = `<strong>${escapeHtml(versionMeta.title||'')}</strong> ${versionMeta.date?'· 更新:'+escapeHtml(versionMeta.date):''} ${versionMeta.version?'· v'+escapeHtml(versionMeta.version):''} ${versionMeta.tags?'· 标签:'+escapeHtml(Array.isArray(versionMeta.tags)?versionMeta.tags.join(', '):versionMeta.tags):''}`;
        versionDiv.style.display = 'block';
    }

    if (progressText) progressText.textContent = '正在排版渲染...';
    body.innerHTML = '';

    for (let i = 0; i < results.length; i++) {
        const chunk = results[i].content;
        if (!chunk) continue;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-chunk';
        const html = marked.parse(chunk);
        sectionDiv.innerHTML = html;

        const chapterNum = results[i].chapterNum;
        const firstH1 = sectionDiv.querySelector('h1');
        if (firstH1 && chapterNum) {
            firstH1.dataset.chapter = chapterNum;
        } else if (sectionDiv.dataset) {
            sectionDiv.dataset.chapter = chapterNum;
        }

        postProcessImages(sectionDiv);
        postProcessFigure(sectionDiv);
        sectionDiv.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));

        body.appendChild(sectionDiv);

        if (i % 3 === 2 || i === results.length - 1) {
            if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${results.length}`;
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }

    renderMath();
    buildHeadingStructure(body);
    buildTOC();
    insertClearfix(body);

    const spacer = document.createElement('div');
    spacer.style.height = '25vh';
    spacer.style.width = '100%';
    spacer.style.clear = 'both';
    body.appendChild(spacer);
}

// ========== Front Matter ==========
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

// ========== 图片后处理 ==========
function postProcessImages(container) {
    container.querySelectorAll('img').forEach(img => {
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

function postProcessFigure(container) {
    const regex = /:::image\s+(left|right|center)?\s*([^\s]+)\s*(.*?)\s*:::/g;
    container.innerHTML = container.innerHTML.replace(regex, (m, pos, filename, caption) => {
        pos = pos || 'center';
        return `<div class="figure-container figure-${pos}"><img src="${filename}" alt="${escapeHtml(caption)}" class="iwp-img-${pos}"><div class="figure-caption">${escapeHtml(caption)}</div></div>`;
    });
    container.querySelectorAll('img').forEach(img => {
        if (img.parentElement.classList.contains('figure-container')) return;
        if (!img.className.includes('iwp-img-')) img.classList.add('iwp-img-center');
    });
}

function renderMath() {
    const ab = document.getElementById('article-body');
    if (ab && typeof renderMathInElement === 'function') {
        renderMathInElement(ab, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

// ========== 章节包裹 ==========
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
            if (h1.dataset && h1.dataset.chapter) {
                w.dataset.chapter = h1.dataset.chapter;
            }
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
    const toc = document.getElementById('toc-tree');
    if (!toc) return;
    toc.innerHTML = '';
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
    if (!sidebar || !resizer) return;
    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing=true; document.body.style.cursor='col-resize'; document.body.style.userSelect='none'; });
    document.addEventListener('mousemove', e => { if(!isResizing) return; let w=e.clientX; if(w>180&&w<500) sidebar.style.width=w+'px'; });
    document.addEventListener('mouseup', () => { isResizing=false; document.body.style.cursor=''; document.body.style.userSelect=''; });
}

// ========== 作者面板 ==========
function setupAuthorPanel() {
    const btn = document.getElementById('btn-author'); if(!btn) return;
    const panel = document.getElementById('author-panel'), close = document.getElementById('close-author');
    if (!panel || !close) return;
    btn.addEventListener('click', async () => {
        panel.classList.add('panel-visible');
        try {
            const resp = await fetch(AUTHOR_MD);
            if(resp.ok) {
                const md = await resp.text();
                const fm = extractAndRemoveFrontMatter(md).meta || {};
                let name=fm.name||'未署名', bio=fm.bio||'暂无简介', avatar=fm.avatar||'';
                if(avatar&&!avatar.startsWith('http')) avatar='images/000/'+avatar;
                const authorInfo = document.getElementById('author-info');
                if (authorInfo) {
                    authorInfo.innerHTML = `${avatar?`<img src="${avatar}" style="width:80px;border-radius:50%;margin-bottom:1rem;">`:''}<h2>${escapeHtml(name)}</h2><p>${escapeHtml(bio)}</p>`;
                }
            }
        } catch(e){}
    });
    close.addEventListener('click', ()=> panel.classList.remove('panel-visible'));
}

// ========== 搜索（带防抖 + 小写索引） ==========
function setupSearch() {
    const input = document.getElementById('search-input'), results = document.getElementById('search-results');
    if (!input || !results) return;
    let debounceTimer;
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
            const context = ctx.slice(0,80).trim();
            searchIndex.push({
                title,
                titleLower: title.toLowerCase(),
                context,
                contextLower: context.toLowerCase(),
                id: h3.id
            });
        });
    }
    buildIndex();
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const q = input.value.trim().toLowerCase();
            results.innerHTML = '';
            if(!q) return;
            searchIndex.filter(i => i.titleLower.includes(q) || i.contextLower.includes(q)).forEach(i=>{
                const div = document.createElement('div');
                div.className='search-result-item';
                const titleEl = document.createElement('div');
                titleEl.className = 'title';
                titleEl.textContent = i.title;
                const ctxEl = document.createElement('div');
                ctxEl.className = 'context';
                ctxEl.textContent = i.context;
                div.appendChild(titleEl);
                div.appendChild(ctxEl);
                div.addEventListener('click', ()=>{
                    document.getElementById(i.id)?.scrollIntoView({behavior:'smooth',block:'start'});
                    const sp = document.getElementById('search-panel');
                    if (sp) sp.classList.remove('panel-visible');
                });
                results.appendChild(div);
            });
        }, 300);
    });
}

// ========== 章节下拉跳转 ==========
function setupChapterSelect() {
    const select = document.getElementById('chapter-select');
    if (!select) return;
    select.innerHTML = '<option value="">— 快速跳转章节 —</option>';
    chapterHeadings.forEach(ch => { const opt = document.createElement('option'); opt.value=ch.id; opt.textContent=ch.text; select.appendChild(opt); });
    select.addEventListener('change', ()=>{ const el=document.getElementById(select.value); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); });
}

// ========== IntersectionObserver 滚动监听 ==========
function setupScrollSpy() {
    const tocItems = document.querySelectorAll('.toc-item');
    const autoCheckbox = document.getElementById('auto-scroll-checkbox');
    const rootEl = document.getElementById('content') || null;

    const idToToc = new Map();
    tocItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        if (targetId) idToToc.set(targetId, item);
    });

    function highlightChain(targetId) {
        tocItems.forEach(i => i.classList.remove('active'));
        let current = document.querySelector(`.toc-item[data-target="${targetId}"]`);
        while (current) {
            current.classList.add('active');
            const parentId = current.getAttribute('data-parent');
            if (parentId) {
                current = document.querySelector(`.toc-item[data-target="${parentId}"]`);
            } else break;
        }
    }

    function scrollTocTo(targetId) {
        if (!autoCheckbox || !autoCheckbox.checked) return;
        const item = document.querySelector(`.toc-item[data-target="${targetId}"]`);
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

    document.querySelectorAll('#article-body h1, #article-body h2, #article-body h3').forEach(h => {
        try { observer.observe(h); } catch (e) {}
    });
}

// ========== 阅读进度 ==========
function restoreProgress() {
    const saved = localStorage.getItem('iwp-progress');
    const contentEl = document.getElementById('content');
    if (saved && contentEl) contentEl.scrollTop = parseInt(saved) || 0;
}
function setupProgressSaving() {
    const content = document.getElementById('content');
    if (!content) return;
    let timer;
    content.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => localStorage.setItem('iwp-progress', content.scrollTop), 300);
    });
}

// ==================== 评论系统 ====================

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
}

async function ghFetch(url, options = {}) {
    const headers = {
        ...(options.headers || {}),
        Accept: 'application/vnd.github+json'
    };
    if (GH_TOKEN && GH_TOKEN !== 'YOUR_TOKEN_HERE') {
        headers.Authorization = `token ${GH_TOKEN}`;
    } else {
        const method = (options.method || 'GET').toUpperCase();
        if (method !== 'GET' && method !== 'HEAD') {
            throw new Error('未配置有效的 GH_TOKEN，写操作被禁止');
        }
    }
    const resp = await fetch(url, { ...options, headers });
    if (!resp.ok) {
        let detail = '';
        try { detail = (await resp.json()).message || ''; } catch { detail = await resp.text(); }
        console.error('GitHub 请求失败', resp.status, detail);
        throw new Error(`GitHub API 请求失败 (${resp.status})：${detail}`);
    }
    return resp;
}

// ---------- 用户系统 ----------
function setupUserSystem() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) currentUser = JSON.parse(saved);
}

async function getUserIssueNumber() {
    const searchUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${USER_LABEL}&state=open&per_page=100`;
    const issues = await (await ghFetch(searchUrl)).json();
    let issue = issues.find(i => i.title === 'users');
    if (issue) return issue.number;
    const createResp = await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'users', labels: [USER_LABEL] })
    });
    const newIssue = await createResp.json();
    if (typeof newIssue.number !== 'number') throw new Error('创建用户 Issue 失败');
    return newIssue.number;
}

async function getAllUsers() {
    try {
        const issueNumber = await getUserIssueNumber();
        const comments = await (await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments?per_page=100`)).json();
        const users = [];
        comments.forEach(c => {
            try { const u = JSON.parse(c.body); if (u.username && u.password) users.push(u); } catch(e) {}
        });
        return users;
    } catch(e) { return []; }
}

async function register(username, password) {
    if (username === SPECIAL_USER) throw new Error('此用户名不可用');
    const users = await getAllUsers();
    if (users.find(u => u.username === username)) throw new Error('用户名已存在');
    const issueNumber = await getUserIssueNumber();
    await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: JSON.stringify({ username, password }) })
    });
    currentUser = { username };
    localStorage.setItem('iwp-user', JSON.stringify(currentUser));
}

async function login(username, password) {
    if (username === SPECIAL_USER && password === SPECIAL_PASS) {
        currentUser = { username };
        localStorage.setItem('iwp-user', JSON.stringify(currentUser));
        return;
    }
    const users = await getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('用户名或密码错误');
    currentUser = { username };
    localStorage.setItem('iwp-user', JSON.stringify(currentUser));
}

function logout() {
    currentUser = null;
    localStorage.removeItem('iwp-user');
    updateAuthUI();
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const loggedInSection = document.getElementById('comment-logged-in');
    if (currentUser) {
        if (authSection) authSection.style.display = 'none';
        if (loggedInSection) loggedInSection.style.display = 'flex';
        const cu = document.getElementById('current-user');
        if (cu) cu.textContent = currentUser.username;
    } else {
        if (authSection) authSection.style.display = 'block';
        if (loggedInSection) loggedInSection.style.display = 'none';
        const al = document.getElementById('auth-login');
        const ar = document.getElementById('auth-register');
        if (al) al.style.display = 'block';
        if (ar) ar.style.display = 'none';
    }
}

function openCommentPanel() {
    updateAuthUI();
    if (currentUser) {
        loadCurrentChapterComments();
        loadChapterLikes();
    } else {
        const cl = document.getElementById('comments-list');
        if (cl) cl.innerHTML = '<p style="color:#999;">登录后可查看评论</p>';
        const cc = document.getElementById('comment-count');
        if (cc) cc.textContent = '';
        const clike = document.getElementById('chapter-like-count');
        if (clike) clike.textContent = '0';
    }
}

// ---------- 评论核心 ----------
function getCurrentChapterId() {
    const wrappers = document.querySelectorAll('.section-wrapper');
    const contentEl = document.getElementById('content');
    const scrollTop = (contentEl ? contentEl.scrollTop : (window.scrollY || 0)) + 80;
    for (let i = wrappers.length - 1; i >= 0; i--) {
        if (wrappers[i].offsetTop <= scrollTop) {
            if (wrappers[i].dataset && wrappers[i].dataset.chapter) {
                return String(wrappers[i].dataset.chapter).padStart(3, '0');
            }
        }
    }
    return '000';
}

function getCurrentChapterTitle() {
    const wrappers = document.querySelectorAll('.section-wrapper');
    const contentEl = document.getElementById('content');
    const scrollTop = (contentEl ? contentEl.scrollTop : (window.scrollY || 0)) + 80;
    for (let i = wrappers.length - 1; i >= 0; i--) {
        if (wrappers[i].offsetTop <= scrollTop) {
            const h1 = wrappers[i].querySelector('h1');
            if (h1) return h1.textContent.trim();
        }
    }
    return '序言';
}

async function getIssueByLabel(title, label) {
    const searchUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${label}&state=open&per_page=100`;
    const issues = await (await ghFetch(searchUrl)).json();
    let issue = issues.find(i => i.title === title);
    if (issue) return issue;
    const createResp = await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, labels: [label] })
    });
    const created = await createResp.json();
    if (typeof created.number !== 'number') throw new Error('创建 Issue 失败');
    return created;
}

async function getChapterIssue(chapterId) {
    return getIssueByLabel(`comments-${chapterId}`, COMMENT_LABEL);
}

async function getChapterLikeIssue(chapterId) {
    return getIssueByLabel(`chapter-like-${chapterId}`, CHAPTER_LIKE_LABEL);
}

async function loadComments(chapterId) {
    const list = document.getElementById('comments-list');
    if (list) list.innerHTML = '<p style="color:#999;">加载中...</p>';
    const titleEl = document.getElementById('comment-chapter-title');
    if (titleEl) titleEl.textContent = getCurrentChapterTitle();
    try {
        const issue = await getChapterIssue(chapterId);
        const comments = await (await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments?per_page=100`)).json();
        renderComments(comments);
        const countEl = document.getElementById('comment-count');
        if (countEl) countEl.textContent = `(${comments.length})`;
    } catch(e) {
        if (list) list.innerHTML = `<p style="color:#e74c3c;">加载失败：${escapeHtml(e.message)}</p>`;
    }
}

function renderComments(comments) {
    const list = document.getElementById('comments-list');
    if (!list) return;
    if (!comments || !comments.length) {
        list.innerHTML = '<p style="color:#999;">暂无评论，来抢沙发吧~</p>';
        return;
    }
    list.innerHTML = '';
    comments.forEach(c => {
        let body = (c.body || '').trim();
        const prefixMatch = body.match(/^\[(.*?)\]\s*/);
        let displayName = (c.user && c.user.login) ? c.user.login : '匿名';
        if (prefixMatch) { displayName = prefixMatch[1]; body = body.slice(prefixMatch[0].length); }

        const item = document.createElement('div');
        item.style.cssText = 'margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid #444;';

        const head = document.createElement('div');
        head.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;';
        const avatar = document.createElement('img');
        avatar.style.cssText = 'width:22px;height:22px;border-radius:50%;';
        if (c.user && c.user.avatar_url) avatar.src = c.user.avatar_url;
        head.appendChild(avatar);
        const strong = document.createElement('strong');
        strong.style.cssText = 'font-size:0.85rem;color:#ddd;';
        strong.textContent = displayName;
        head.appendChild(strong);
        const dateSpan = document.createElement('span');
        dateSpan.style.cssText = 'font-size:0.7rem;color:#888;margin-left:auto;';
        dateSpan.textContent = c.created_at ? new Date(c.created_at).toLocaleDateString('zh-CN') : '';
        head.appendChild(dateSpan);
        item.appendChild(head);

        const p = document.createElement('p');
        p.style.cssText = 'font-size:0.85rem;color:#ccc;margin:0;white-space:pre-wrap;';
        p.textContent = body;
        item.appendChild(p);
        list.appendChild(item);
    });
}

async function postComment() {
    if (!currentUser) { alert('请先登录'); return; }
    const input = document.getElementById('comment-input');
    if (!input) return;
    const body = input.value.trim();
    if (!body) return;
    const chapterId = getCurrentChapterId();
    try {
        const issue = await getChapterIssue(chapterId);
        let commentBody = (currentUser.username === SPECIAL_USER) ? `[${SPECIAL_TAG}] ${body}` : `[${currentUser.username}] ${body}`;
        await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: commentBody })
        });
        input.value = '';
        loadComments(chapterId);
    } catch(e) { alert('评论失败：' + e.message); }
}

function loadCurrentChapterComments() {
    if (!currentUser) {
        const cl = document.getElementById('comments-list');
        if (cl) cl.innerHTML = '<p style="color:#999;">请登录后查看评论</p>';
        return;
    }
    loadComments(getCurrentChapterId());
}

// ---------- 点赞 ----------
async function loadChapterLikes() {
    try {
        const chapterId = getCurrentChapterId();
        const issue = await getChapterLikeIssue(chapterId);
        const match = (issue.body || '').match(/<!--chapter-likes:(\d+)-->/);
        const likes = match ? parseInt(match[1],10) : 0;
        const countEl = document.getElementById('chapter-like-count');
        if (countEl) countEl.textContent = likes;
        const btn = document.getElementById('chapter-like-btn');
        if (btn) btn.setAttribute('data-likes', String(likes));
    } catch(e) {
        const countEl = document.getElementById('chapter-like-count');
        if (countEl) countEl.textContent = '0';
    }
}

document.addEventListener('click', async (e) => {
    const likeBtn = e.target.closest('#chapter-like-btn');
    if (!likeBtn) return;
    const btn = likeBtn;
    const likes = parseInt(btn.getAttribute('data-likes'),10) || 0;
    const newLikes = likes + 1;
    const chapterId = getCurrentChapterId();
    try {
        const issue = await getChapterLikeIssue(chapterId);
        const newBody = (issue.body || '').replace(/<!--chapter-likes:\d+-->/g, '') + `<!--chapter-likes:${newLikes}-->`;
        await ghFetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: newBody })
        });
        btn.setAttribute('data-likes', String(newLikes));
        const countEl = document.getElementById('chapter-like-count');
        if (countEl) countEl.textContent = String(newLikes);
    } catch(err) { alert('点赞失败：' + err.message); }
});

// ---------- 评论 UI 绑定 ----------
function setupComments() {
    const commentsPanel = document.getElementById('comments-panel');
    const btnComments = document.getElementById('btn-comments');
    if (btnComments) btnComments.addEventListener('click', () => {
        if (commentsPanel) commentsPanel.classList.add('panel-visible');
        openCommentPanel();
    });
    const closeBtn = commentsPanel ? commentsPanel.querySelector('.close-btn') : null;
    if (closeBtn) closeBtn.addEventListener('click', () => {
        if (commentsPanel) commentsPanel.classList.remove('panel-visible');
    });

    const btnToRegister = document.getElementById('btn-to-register');
    const btnToLogin = document.getElementById('btn-to-login');
    if (btnToRegister) btnToRegister.addEventListener('click', () => {
        const al = document.getElementById('auth-login'); if(al) al.style.display = 'none';
        const ar = document.getElementById('auth-register'); if(ar) ar.style.display = 'block';
    });
    if (btnToLogin) btnToLogin.addEventListener('click', () => {
        const ar = document.getElementById('auth-register'); if(ar) ar.style.display = 'none';
        const al = document.getElementById('auth-login'); if(al) al.style.display = 'block';
    });

    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) btnLogin.addEventListener('click', async () => {
        const username = document.getElementById('login-username')?.value?.trim?.() || '';
        const password = document.getElementById('login-password')?.value || '';
        if (!username || !password) return alert('请填写用户名和密码');
        try { await login(username, password); updateAuthUI(); loadCurrentChapterComments(); loadChapterLikes(); }
        catch(e) { alert('登录失败：' + e.message); }
    });

    const btnRegister = document.getElementById('btn-register');
    if (btnRegister) btnRegister.addEventListener('click', async () => {
        const username = document.getElementById('reg-username')?.value?.trim?.() || '';
        const password = document.getElementById('reg-password')?.value || '';
        if (!username || !password) return alert('请填写用户名和密码');
        try { await register(username, password); updateAuthUI(); loadCurrentChapterComments(); loadChapterLikes(); }
        catch(e) { alert('注册失败：' + e.message); }
    });

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => { logout(); loadCurrentChapterComments(); });

    const commentSubmit = document.getElementById('comment-submit');
    if (commentSubmit) commentSubmit.addEventListener('click', postComment);
    const commentInput = document.getElementById('comment-input');
    if (commentInput) commentInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(); }
    });
}
