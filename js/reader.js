const CHAPTERS = [
    'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
    'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
    'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
    'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
    'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
];
const AUTHOR_MD = 'notes/000/index.md';
let allSections = [], searchIndex = [], chapterHeadings = [];
let currentUser = null;   // { username, token }

// ========== Cloudflare Worker API 地址（请换成你自己的） ==========
const COMMENT_API = 'https://woxiangcaoni.2167964516.workers.dev';

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
    // 初始化用户状态（从 localStorage 恢复）
    setupUserState();
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
                console.warn(`我输了: ${path}`, err);
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
        versionDiv.innerHTML =
            `<strong>${escapeHtml(versionMeta.title || '')}</strong>` +
            (versionMeta.date ? ` · 更新: ${escapeHtml(versionMeta.date)}` : '') +
            (versionMeta.version ? ` · v${escapeHtml(versionMeta.version)}` : '') +
            (versionMeta.tags ? ` · 标签: ${escapeHtml(Array.isArray(versionMeta.tags) ? versionMeta.tags.join(', ') : versionMeta.tags)}` : '');
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

    // ===== 为每个二级标题插入评论区 =====
    injectCommentSections(body);

    const spacer = document.createElement('div');
    spacer.style.height = '25vh';
    spacer.style.width = '100%';
    spacer.style.clear = 'both';
    body.appendChild(spacer);
}

// ========== 为每个 ## 标题添加评论区 ==========
function injectCommentSections(body) {
    const h2s = body.querySelectorAll('h2');
    h2s.forEach((h2, index) => {
        if (!h2.id) h2.id = 'h2-' + index;
        const sectionId = h2.id;

        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.setAttribute('data-section-id', sectionId);
        commentSection.innerHTML = `
            <div class="comment-toggle" onclick="toggleCommentSection(this, '${sectionId}')">
                来喵两句～ <span class="comment-count-badge" id="comment-count-${sectionId}"></span>
            </div>
            <div class="comment-body" id="comment-body-${sectionId}" style="display:none;">
                <div class="comment-list" id="comment-list-${sectionId}"></div>
                <div class="comment-pagination" id="comment-pagination-${sectionId}"></div>
                <div class="comment-form" id="comment-form-${sectionId}">
                    <div class="auth-panel" id="auth-panel-${sectionId}"></div>
                    <div class="input-area" id="input-area-${sectionId}" style="display:none;">
                        <textarea id="comment-input-${sectionId}" placeholder="良言一句我就热，恶语伤人我就冷..." rows="3"></textarea>
                        <button onclick="submitComment('${sectionId}')">说话！</button>
                        <span class="quote-hint">选中文字后点击“引用”可快速引用原文</span>
                    </div>
                </div>
            </div>
        `;
        h2.parentNode.insertBefore(commentSection, h2.nextSibling);
    });
}

// ==================== 评论系统前端逻辑 ====================

// ---------- 用户状态 ----------
function setupUserState() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) currentUser = JSON.parse(saved);
    document.querySelectorAll('.comment-section').forEach(sec => {
        updateAuthUI(sec.getAttribute('data-section-id'));
    });
}

async function login(username, password) {
    const res = await fetch(`${COMMENT_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const data = await res.json();
    currentUser = { username, token: data.token };
    localStorage.setItem('iwp-user', JSON.stringify(currentUser));
    document.querySelectorAll('.comment-section').forEach(sec => {
        updateAuthUI(sec.getAttribute('data-section-id'));
    });
}

async function register(username, password) {
    const res = await fetch(`${COMMENT_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    const data = await res.json();
    currentUser = { username, token: data.token };
    localStorage.setItem('iwp-user', JSON.stringify(currentUser));
    document.querySelectorAll('.comment-section').forEach(sec => {
        updateAuthUI(sec.getAttribute('data-section-id'));
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('iwp-user');
    document.querySelectorAll('.comment-section').forEach(sec => {
        const sectionId = sec.getAttribute('data-section-id');
        updateAuthUI(sectionId);
        document.getElementById('comment-list-' + sectionId).innerHTML = '';
        document.getElementById('comment-count-' + sectionId).textContent = '';
    });
}

function updateAuthUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    const inputArea = document.getElementById('input-area-' + sectionId);
    if (currentUser) {
        if (panel) panel.innerHTML = `<span>H ${currentUser.username}</span> <button onclick="logout()">退出</button>`;
        if (inputArea) inputArea.style.display = 'block';
    } else {
        if (panel) panel.innerHTML = `
            <button onclick="showLogin('${sectionId}')">登录</button>
            <button onclick="showRegister('${sectionId}')">注册</button>
        `;
        if (inputArea) inputArea.style.display = 'none';
    }
}

function showLogin(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    panel.innerHTML = `
        <input type="text" id="login-username-${sectionId}" placeholder="用户名">
        <input type="password" id="login-password-${sectionId}" placeholder="密码">
        <button onclick="doLogin('${sectionId}')">登录</button>
    `;
}

function showRegister(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    panel.innerHTML = `
        <input type="text" id="reg-username-${sectionId}" placeholder="用户名">
        <input type="password" id="reg-password-${sectionId}" placeholder="密码">
        <button onclick="doRegister('${sectionId}')">注册</button>
    `;
}

async function doLogin(sectionId) {
    const username = document.getElementById('login-username-' + sectionId).value.trim();
    const password = document.getElementById('login-password-' + sectionId).value;
    if (!username || !password) return alert('还想蒙混过关？！');
    try {
        await login(username, password);
        updateAuthUI(sectionId);
        loadComments(sectionId, 1);
    } catch (e) { alert('还想偷渡？！: ' + e.message); }
}

async function doRegister(sectionId) {
    const username = document.getElementById('reg-username-' + sectionId).value.trim();
    const password = document.getElementById('reg-password-' + sectionId).value;
    if (!username || !password) return alert('还想蒙混过关？！');
    try {
        await register(username, password);
        updateAuthUI(sectionId);
        loadComments(sectionId, 1);
    } catch (e) { alert('你失败了！: ' + e.message); }
}

// ---------- 评论加载与分页 ----------
let currentPage = {};

async function loadComments(sectionId, page = 1) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    const countBadge = document.getElementById('comment-count-' + sectionId);
    const paginationEl = document.getElementById('comment-pagination-' + sectionId);
    if (!listEl) return;
    listEl.innerHTML = '少女祈祷中...';

    try {
        const res = await fetch(`${COMMENT_API}/comments?section=${sectionId}&page=${page}&limit=10`);
        const data = await res.json();
        renderComments(listEl, data.comments);
        countBadge.textContent = `(${data.total})`;
        currentPage[sectionId] = page;

        const totalPages = Math.ceil(data.total / 10);
        let pagHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            pagHTML += `<button onclick="loadComments('${sectionId}', ${i})" ${i === page ? 'class="active"' : ''}>${i}</button>`;
        }
        paginationEl.innerHTML = pagHTML;
    } catch (e) {
        listEl.innerHTML = '少女折寿中';
    }
}

function renderComments(listEl, comments) {
    listEl.innerHTML = '';
    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <div class="comment-avatar"><img src="${c.avatar || 'images/0721.png'}" width="30" height="30"></div>
            <div class="comment-content">
                <span class="comment-user">${escapeHtml(c.username)}</span>
                <span class="comment-time">${c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
                <p>${escapeHtml(c.content)}</p>
                <div class="comment-actions">
                    <button onclick="likeComment('${c.id}', '${c.section}')">❤️ ${c.likes || 0}</button>
                    <button onclick="quoteComment('${escapeHtml(c.content)}', '${c.section}')">引用</button>
                </div>
            </div>
        `;
        listEl.appendChild(div);
    });
}

// ---------- 发表评论 ----------
async function submitComment(sectionId) {
    if (!currentUser) { alert('登录再喵～'); return; }
    const input = document.getElementById('comment-input-' + sectionId);
    if (!input) return;
    const content = input.value.trim();
    if (!content) return;

    try {
        const res = await fetch(`${COMMENT_API}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({ section: sectionId, content, username: currentUser.username })
        });
        if (!res.ok) throw new Error((await res.json()).error);
        input.value = '';
        loadComments(sectionId, currentPage[sectionId] || 1);
    } catch (e) {
        alert('欲言又止: ' + e.message);
    }
}

// ---------- 点赞 ----------
async function likeComment(commentId, sectionId) {
    try {
        const res = await fetch(`${COMMENT_API}/comments/${commentId}/like`, { method: 'POST' });
        if (!res.ok) throw new Error((await res.json()).error);
        loadComments(sectionId, currentPage[sectionId] || 1);
    } catch (e) {
        alert('你不能喜欢别人: ' + e.message);
    }
}

// ---------- 引用原文 ----------
function quoteComment(text, sectionId) {
    const input = document.getElementById('comment-input-' + sectionId);
    if (input) {
        input.value += `> ${text}\n`;
        input.focus();
    }
}

// ---------- 评论区折叠 ----------
function toggleCommentSection(toggleEl, sectionId) {
    const body = document.getElementById('comment-body-' + sectionId);
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
        if (currentPage[sectionId] === undefined) {
            loadComments(sectionId, 1);
        } else {
            loadComments(sectionId, currentPage[sectionId]);
        }
    } else {
        body.style.display = 'none';
    }
}

// ========== Front Matter 提取 ==========
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

// ========== 阅读进度记忆 ==========
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

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
}
