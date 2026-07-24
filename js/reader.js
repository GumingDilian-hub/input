const CHAPTERS = [
    'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
    'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
    'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
    'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
    'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
];
const AUTHOR_MD = 'notes/000/index.md';
let allSections = [], searchIndex = [], chapterHeadings = [];

// ========== GitHub 配置 ==========
const GH_TOKEN = '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';
const REPO_OWNER = 'GumingDilian-hub';
const REPO_NAME = 'input';

// 三个独立的 Label
const COMMENT_LABEL = 'comment';           // 评论 Issue 标签
const USER_LABEL = 'users';               // 用户数据 Issue 标签
const CHAPTER_LIKE_LABEL = 'chapter-like'; // 文章点赞 Issue 标签

// 特殊账号
const SPECIAL_USER = 'loading';
const SPECIAL_PASS = '10000';
const SPECIAL_TAG = '始作俑者';

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

// ========== 并行下载 + 分批渲染（无变化） ==========
async function loadAndRenderAll() {
    const body = document.getElementById('article-body');
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
                return { meta: fmResult.meta, content };
            })
            .catch(err => {
                console.warn(`是的，你网卡了: ${path}`, err);
                return { meta: null, content: '' };
            })
    );

    const results = await Promise.all(fetchPromises);

    let versionMeta = null;
    for (const r of results) {
        if (r.meta && r.meta.title) { versionMeta = r.meta; break; }
    }
    const versionDiv = document.getElementById('version-info');
    if (versionMeta) {
        versionDiv.innerHTML = `<strong>${versionMeta.title||''}</strong> ${versionMeta.date?'· 更新:'+versionMeta.date:''} ${versionMeta.version?'· v'+versionMeta.version:''} ${versionMeta.tags?'· 标签:'+(Array.isArray(versionMeta.tags)?versionMeta.tags.join(', '):versionMeta.tags):''}`;
        versionDiv.style.display = 'block';
    }

    if (progressText) progressText.textContent = '少女折寿中...';
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

    renderMath();
    buildHeadingStructure(body);
    buildTOC();
    insertClearfix(body);

    const spacer = document.createElement('div');
    spacer.style.height = '25vh'; spacer.style.width = '100%'; spacer.style.clear='both';
    body.appendChild(spacer);
}

// ========== 辅助函数（保留所有原版） ==========
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
        return `<div class="figure-container figure-${pos}"><img src="${filename}" alt="${caption}" class="iwp-img-${pos}"><div class="figure-caption">${caption}</div></div>`;
    });
    container.querySelectorAll('img').forEach(img => {
        if (img.parentElement.classList.contains('figure-container')) return;
        if (!img.className.includes('iwp-img-')) img.classList.add('iwp-img-center');
    });
}

function renderMath() {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.getElementById('article-body'), {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

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
        const d = document.createElement('div'); d.style.clear='both'; w.appendChild(d);
    });
}

function buildTOC() {
    const toc = document.getElementById('toc-tree');
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

function setupSidebarResize() {
    const sidebar = document.getElementById('sidebar'), resizer = document.getElementById('resizer');
    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing=true; document.body.style.cursor='col-resize'; document.body.style.userSelect='none'; });
    document.addEventListener('mousemove', e => { if(!isResizing) return; let w=e.clientX; if(w>180&&w<500) sidebar.style.width=w+'px'; });
    document.addEventListener('mouseup', () => { isResizing=false; document.body.style.cursor=''; document.body.style.userSelect=''; });
}

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

// 搜索（带防抖）
function setupSearch() {
    const input = document.getElementById('search-input'), results = document.getElementById('search-results');
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
            searchIndex.push({ title, context: ctx.slice(0,80).trim(), id: h3.id });
        });
    }
    buildIndex();
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
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
        }, 300);
    });
}

function setupChapterSelect() {
    const select = document.getElementById('chapter-select');
    select.innerHTML = '<option value="">— 火速前往 —</option>';
    chapterHeadings.forEach(ch => { const opt = document.createElement('option'); opt.value=ch.id; opt.textContent=ch.text; select.appendChild(opt); });
    select.addEventListener('change', ()=>{ const el=document.getElementById(select.value); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); });
}

// IntersectionObserver 滚动监听
function setupScrollSpy() {
    const tocItems = document.querySelectorAll('.toc-item');
    const autoCheckbox = document.getElementById('auto-scroll-checkbox');

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
        if (!autoCheckbox.checked) return;
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
        root: document.getElementById('content'),
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0
    });

    document.querySelectorAll('#article-body h1, #article-body h2, #article-body h3').forEach(h => observer.observe(h));
}

function restoreProgress() {
    const saved = localStorage.getItem('iwp-progress');
    if (saved) document.getElementById('content').scrollTop = parseInt(saved) || 0;
}
function setupProgressSaving() {
    const content = document.getElementById('content');
    let timer;
    content.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => localStorage.setItem('iwp-progress', content.scrollTop), 300);
    });
}

// ==================== 通用：带错误详情的 ghFetch ====================
async function ghFetch(url, options = {}) {
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: 'application/vnd.github+json'
    };
    const resp = await fetch(url, { ...options, headers });
    if (!resp.ok) {
        let detailText = '';
        try {
            const errJson = await resp.json();
            detailText = errJson.message || JSON.stringify(errJson);
        } catch {
            detailText = await resp.text();
        }
        const msg = `GitHub API 请求失败 (${resp.status})：${detailText}`;
        console.error('[ghFetch]', url, resp.status, detailText);
        const err = new Error(msg);
        err.status = resp.status;
        err.body = detailText;
        throw err;
    }
    return resp;
}

// ==================== 用户系统 ====================
function setupUserSystem() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) currentUser = JSON.parse(saved);
}

async function getUserIssueNumber() {
    const searchUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${USER_LABEL}&state=open&per_page=100`;
    const searchResp = await ghFetch(searchUrl);
    const issues = await searchResp.json();
    let issue = issues.find(i => i.title === 'users');
    if (issue) return issue.number;

    const createUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
    const createResp = await ghFetch(createUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'users', labels: [USER_LABEL] })
    });
    const newIssue = await createResp.json();
    if (typeof newIssue.number !== 'number') {
        throw new Error('创建 Issue 返回数据异常：缺少 number');
    }
    return newIssue.number;
}

async function getAllUsers() {
    try {
        const issueNumber = await getUserIssueNumber();
        const commentsUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments?per_page=100`;
        const resp = await ghFetch(commentsUrl);
        const comments = await resp.json();
        const users = [];
        comments.forEach(c => {
            try {
                const u = JSON.parse(c.body);
                if (u.username && u.password) users.push(u);
            } catch (e) {}
        });
        return users;
    } catch (e) {
        console.error('获取用户列表失败', e);
        return [];
    }
}

async function register(username, password) {
    if (username === SPECIAL_USER) throw new Error('此用户名不可用');
    const users = await getAllUsers();
    if (users.find(u => u.username === username)) throw new Error('用户名已存在');

    const issueNumber = await getUserIssueNumber();
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/comments`;
    const resp = await ghFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: JSON.stringify({ username, password }) })
    });
    // 写入成功
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
        authSection.style.display = 'none';
        loggedInSection.style.display = 'flex';
        document.getElementById('current-user').textContent = currentUser.username;
    } else {
        authSection.style.display = 'block';
        loggedInSection.style.display = 'none';
        document.getElementById('auth-login').style.display = 'block';
        document.getElementById('auth-register').style.display = 'none';
    }
}

function openCommentPanel() {
    updateAuthUI();
    if (currentUser) {
        loadCurrentChapterComments();
        loadChapterLikes();
    } else {
        document.getElementById('comments-list').innerHTML = '<p style="color:#999;">请登录后查看评论</p>';
        document.getElementById('comment-count').textContent = '';
        document.getElementById('chapter-like-count').textContent = '0';
    }
}

// ==================== 评论核心 ====================
function getCurrentChapterId() {
    const h1s = document.querySelectorAll('#article-body h1');
    const scrollTop = document.getElementById('content').scrollTop + 80;
    let currentId = '000';
    for (let i = h1s.length - 1; i >= 0; i--) {
        if (h1s[i].offsetTop <= scrollTop) {
            const id = h1s[i].id.replace(/^h-/, '');
            if (/^\d+$/.test(id)) currentId = id.padStart(3, '0');
            break;
        }
    }
    return currentId;
}

function getCurrentChapterTitle() {
    const h1s = document.querySelectorAll('#article-body h1');
    const scrollTop = document.getElementById('content').scrollTop + 80;
    for (let i = h1s.length - 1; i >= 0; i--) {
        if (h1s[i].offsetTop <= scrollTop) return h1s[i].textContent.trim();
    }
    return '序言';
}

// 根据 Label 获取或创建 Issue（通用函数，用于评论和点赞）
async function getIssueByLabel(title, label) {
    const searchUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${label}&state=open&per_page=100`;
    const searchResp = await ghFetch(searchUrl);
    const issues = await searchResp.json();
    let issue = issues.find(i => i.title === title);
    if (issue) return issue;

    const createUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
    const createResp = await ghFetch(createUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, labels: [label] })
    });
    const created = await createResp.json();
    if (typeof created.number !== 'number') {
        throw new Error('创建 Issue 返回异常：缺少 number');
    }
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
    list.innerHTML = '<p style="color:#999;">加载中...</p>';
    document.getElementById('comment-chapter-title').textContent = getCurrentChapterTitle();
    try {
        const issue = await getChapterIssue(chapterId);
        const commentsUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments?per_page=100`;
        const resp = await ghFetch(commentsUrl);
        const comments = await resp.json();
        renderComments(comments);
        document.getElementById('comment-count').textContent = `(${comments.length})`;
    } catch (e) {
        console.error('加载评论失败', e);
        list.innerHTML = `<p style="color:#e74c3c;">加载失败：${e.message}</p>`;
        document.getElementById('comment-count').textContent = '';
    }
}

function renderComments(comments) {
    const list = document.getElementById('comments-list');
    if (!comments.length) {
        list.innerHTML = '<p style="color:#999;">暂无评论，来抢沙发吧~</p>';
        return;
    }
    list.innerHTML = comments.map(c => {
        let body = c.body.trim();
        const prefixMatch = body.match(/^\[(.*?)\]\s*/);
        let displayName = c.user.login;
        if (prefixMatch) {
            displayName = prefixMatch[1];
            body = body.slice(prefixMatch[0].length);
        }
        return `
        <div style="margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid #444;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
                <img src="${c.user.avatar_url}" style="width:22px; height:22px; border-radius:50%;">
                <strong style="font-size:0.85rem; color:#ddd;">${escapeHtml(displayName)}</strong>
                <span style="font-size:0.7rem; color:#888; margin-left:auto;">${new Date(c.created_at).toLocaleDateString('zh-CN')}</span>
            </div>
            <p style="font-size:0.85rem; color:#ccc; margin:0; white-space:pre-wrap;">${escapeHtml(body)}</p>
        </div>`;
    }).join('');
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
}

async function postComment() {
    if (!currentUser) { alert('请先登录'); return; }
    const input = document.getElementById('comment-input');
    const body = input.value.trim();
    if (!body) return;

    const chapterId = getCurrentChapterId();
    try {
        const issue = await getChapterIssue(chapterId);
        let commentBody = body;
        if (currentUser.username === SPECIAL_USER) {
            commentBody = `[${SPECIAL_TAG}] ${commentBody}`;
        } else {
            commentBody = `[${currentUser.username}] ${commentBody}`;
        }
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}/comments`;
        await ghFetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: commentBody })
        });
        input.value = '';
        loadComments(chapterId);
    } catch (e) {
        console.error('发送评论失败', e);
        alert('评论失败：' + e.message);
    }
}

function loadCurrentChapterComments() {
    if (!currentUser) {
        document.getElementById('comments-list').innerHTML = '<p style="color:#999;">请登录后查看评论</p>';
        document.getElementById('comment-count').textContent = '';
        return;
    }
    loadComments(getCurrentChapterId());
}

// ==================== 文章点赞（独立 Label） ====================
async function loadChapterLikes() {
    try {
        const chapterId = getCurrentChapterId();
        const issue = await getChapterLikeIssue(chapterId);
        const bodyStr = issue.body || '';
        const match = bodyStr.match(/<!--likes:(\d+)-->/);
        const likes = match ? parseInt(match[1], 10) : 0;
        document.getElementById('chapter-like-count').textContent = likes;
        document.getElementById('chapter-like-btn').setAttribute('data-likes', String(likes));
    } catch (e) {
        console.error('加载点赞数失败', e);
        document.getElementById('chapter-like-count').textContent = '0';
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.id === 'chapter-like-btn') {
        const btn = e.target;
        const likes = parseInt(btn.getAttribute('data-likes'), 10) || 0;
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
            document.getElementById('chapter-like-count').textContent = String(newLikes);
        } catch (err) {
            console.error('点赞失败', err);
            alert('点赞失败：' + err.message);
        }
    }
});

// ==================== 初始化绑定 ====================
function setupComments() {
    document.getElementById('btn-to-register').addEventListener('click', () => {
        document.getElementById('auth-login').style.display = 'none';
        document.getElementById('auth-register').style.display = 'block';
    });
    document.getElementById('btn-to-login').addEventListener('click', () => {
        document.getElementById('auth-register').style.display = 'none';
        document.getElementById('auth-login').style.display = 'block';
    });
    document.getElementById('btn-login').addEventListener('click', async () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        if (!username || !password) return alert('请填写用户名和密码');
        try {
            await login(username, password);
            updateAuthUI();
            loadCurrentChapterComments();
            loadChapterLikes();
        } catch (e) {
            console.error('登录失败', e);
            alert('登录失败：' + e.message);
        }
    });
    document.getElementById('btn-register').addEventListener('click', async () => {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        if (!username || !password) return alert('请填写用户名和密码');
        try {
            await register(username, password);
            updateAuthUI();
            loadCurrentChapterComments();
            loadChapterLikes();
        } catch (e) {
            console.error('注册失败', e);
            alert('注册失败：' + e.message);
        }
    });
    document.getElementById('btn-logout').addEventListener('click', () => {
        logout();
        loadCurrentChapterComments();
    });
    document.getElementById('comment-submit').addEventListener('click', postComment);
    document.getElementById('comment-input').addEventListener('keypress', e => {
        if (e.key === 'Enter') postComment();
    });
}

// ==================== 检测函数（快速排查） ====================
async function detectGitHubApi() {
    const report = {
        tokenValid: false,
        repoAccessible: false,
        issuesEnabled: false,
        errors: []
    };
    try {
        // 1) 验证 token
        const userResp = await ghFetch('https://api.github.com/user');
        if (userResp.ok) {
            report.tokenValid = true;
        }
    } catch (e) {
        report.errors.push('Token 验证失败：' + e.message);
    }

    try {
        // 2) 仓库是否存在（尝试读取 issues 列表）
        const issuesUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?per_page=1`;
        await ghFetch(issuesUrl);
        report.repoAccessible = true;
    } catch (e) {
        report.errors.push('仓库访问失败（可能不存在或无权限）：' + e.message);
    }

    try {
        // 3) 尝试列出带指定 label 的 issues（如果 Issues 被关闭通常会 404/410）
        const searchUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=${USER_LABEL}&state=open&per_page=1`;
        await ghFetch(searchUrl);
        report.issuesEnabled = true;
    } catch (e) {
        if (e.status === 404 || e.status === 410) {
            report.errors.push('仓库的 Issues 功能可能已关闭：' + e.message);
        } else {
            report.errors.push('检测 Issues 功能失败：' + e.message);
        }
    }

    console.log('[detectGitHubApi] 检测结果：', report);
    return report;
}

// 暴露到全局以便在控制台调用 detectGitHubApi()
window.detectGitHubApi = detectGitHubApi;
// ========== 专为平板/手机准备的检测代码 ==========
async function debugForTablet() {
    let report = "📱 平板检测报告\n----------------\n";

    // 1. Token 基础检查
    if (!GH_TOKEN) {
        report += "❌ 错误：找不到 GH_TOKEN 变量！\n请检查是不是代码没保存成功，或者变量名写错了。";
        alert(report);
        return;
    }
    report += "1. Token 长度: " + GH_TOKEN.length + " (正常应该 > 80)\n";
    report += "2. Token 开头: " + GH_TOKEN.substring(0, 15) + "...\n\n";

    try {
        // 2. 测试 Token 有效性 (看看是不是过期了)
        const userResp = await fetch('https://api.github.com/user', {
            headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Accept': 'application/vnd.github+json' }
        });

        if (userResp.status === 401) {
            report += "❌ 3. Token 身份验证失败 (401)\n\n原因：\nToken 可能已过期、复制不完整，或者被撤销了。\n\n解决办法：\n请去 GitHub 重新生成一个新的 Token，并完整复制粘贴替换掉旧的。";
        } else if (userResp.ok) {
            report += "✅ 3. Token 本身有效！登录成功。\n\n";

            // 3. 测试仓库权限 (看看能不能访问你的仓库)
            const repoUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?per_page=1`;
            const repoResp = await fetch(repoUrl, {
                headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Accept': 'application/vnd.github+json' }
            });

            if (repoResp.status === 403) {
                report += "❌ 4. 仓库访问被拒绝 (403)\n\n原因：\nToken 没有权限访问这个仓库。\n\n解决办法：\n去 GitHub Token 设置页面，检查 'Repository access'，务必勾选 'GumingDilian-hub/input' 这个仓库。";
            } else if (repoResp.status === 404) {
                report += "❌ 4. 仓库未找到 (404)\n\n原因：\n代码里的仓库名字 (REPO_OWNER 或 REPO_NAME) 可能写错了，或者这个仓库根本不存在。";
            } else if (repoResp.ok) {
                report += "✅ 4. 仓库访问成功！\n\n结论：\n权限完全没问题。如果还是报错，请尝试清除浏览器缓存，或者强制刷新页面。";
            } else {
                report += "⚠️ 4. 仓库访问状态异常: " + repoResp.status;
            }
        } else {
            report += "⚠️ 3. Token 未知错误: " + userResp.status;
        }

    } catch (e) {
        report += "⚠️ 网络连接错误: " + e.message + "\n请检查平板是否联网。";
    }

    alert(report);
}

// 运行检测
debugForTablet();
