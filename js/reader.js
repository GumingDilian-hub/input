const CHAPTERS = [
    'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
    'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
    'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
    'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
    'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
];
const AUTHOR_MD = 'notes/000/index.md';
let allSections = [], searchIndex = [], chapterHeadings = [];

// ========== Cloudflare Worker API 配置 ==========
const COMMENT_API = 'https://你的worker名称.你的子域名.workers.dev';  // 替换为你的 Worker URL

// ========== 全局用户状态 ==========
let currentUser = null;   // { username, token }

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
        versionDiv.innerHTML =
            `<strong>${escapeHtml(versionMeta.title || '')}</strong>` +
            (versionMeta.date ? ` · 更新: ${escapeHtml(versionMeta.date)}` : '') +
            (versionMeta.version ? ` · v${escapeHtml(versionMeta.version)}` : '') +
            (versionMeta.tags ? ` · 标签: ${escapeHtml(Array.isArray(versionMeta.tags) ? versionMeta.tags.join(', ') : versionMeta.tags)}` : '');
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
        // 确保 h2 有 id
        if (!h2.id) h2.id = 'h2-' + index;
        const sectionId = h2.id;

        // 创建评论区容器
        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.setAttribute('data-section-id', sectionId);
        commentSection.innerHTML = `
            <div class="comment-toggle" onclick="toggleCommentSection(this, '${sectionId}')">
                💬 评论 <span class="comment-count-badge" id="comment-count-${sectionId}"></span>
            </div>
            <div class="comment-body" id="comment-body-${sectionId}" style="display:none;">
                <div class="comment-list" id="comment-list-${sectionId}"></div>
                <div class="comment-pagination" id="comment-pagination-${sectionId}"></div>
                <div class="comment-form" id="comment-form-${sectionId}">
                    <div class="auth-panel" id="auth-panel-${sectionId}"></div>
                    <div class="input-area" id="input-area-${sectionId}" style="display:none;">
                        <textarea id="comment-input-${sectionId}" placeholder="写下你的评论..." rows="3"></textarea>
                        <button onclick="submitComment('${sectionId}')">发表</button>
                        <span class="quote-hint">选中文字后点击“引用”可快速引用原文</span>
                    </div>
                </div>
            </div>
        `;
        // 插入到 h2 后面
        h2.parentNode.insertBefore(commentSection, h2.nextSibling);
    });
}

// ==================== 评论系统前端逻辑 ====================

// ---------- 用户状态 ----------
function setupUserState() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) currentUser = JSON.parse(saved);
    // 在每个评论区初始化时更新 UI
    document.querySelectorAll('.comment-section').forEach(sec => {
        const sectionId = sec.getAttribute('data-section-id');
        updateAuthUI(sectionId);
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
    // 更新所有评论区 UI
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
        updateAuthUI(sec.getAttribute('data-section-id'));
        // 清空该小节的评论列表
        const sectionId = sec.getAttribute('data-section-id');
        document.getElementById('comment-list-' + sectionId).innerHTML = '';
        document.getElementById('comment-count-' + sectionId).textContent = '';
    });
}

// ---------- UI 更新 ----------
function updateAuthUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    const inputArea = document.getElementById('input-area-' + sectionId);
    if (currentUser) {
        if (panel) panel.innerHTML = `<span>👤 ${currentUser.username}</span> <button onclick="logout()">退出</button>`;
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
    if (!username || !password) return alert('请填写完整');
    try {
        await login(username, password);
        updateAuthUI(sectionId);
        loadComments(sectionId, 1);
    } catch (e) { alert('登录失败: ' + e.message); }
}

async function doRegister(sectionId) {
    const username = document.getElementById('reg-username-' + sectionId).value.trim();
    const password = document.getElementById('reg-password-' + sectionId).value;
    if (!username || !password) return alert('请填写完整');
    try {
        await register(username, password);
        updateAuthUI(sectionId);
        loadComments(sectionId, 1);
    } catch (e) { alert('注册失败: ' + e.message); }
}

// ---------- 评论加载与分页 ----------
let currentPage = {};  // 记录每个 section 的当前页

async function loadComments(sectionId, page = 1) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    const countBadge = document.getElementById('comment-count-' + sectionId);
    const paginationEl = document.getElementById('comment-pagination-' + sectionId);
    if (!listEl) return;
    listEl.innerHTML = '加载中...';

    try {
        const res = await fetch(`${COMMENT_API}/comments?section=${sectionId}&page=${page}&limit=10`);
        const data = await res.json();
        renderComments(listEl, data.comments);
        countBadge.textContent = `(${data.total})`;
        currentPage[sectionId] = page;

        // 分页按钮
        const totalPages = Math.ceil(data.total / 10);
        let pagHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            pagHTML += `<button onclick="loadComments('${sectionId}', ${i})" ${i === page ? 'class="active"' : ''}>${i}</button>`;
        }
        paginationEl.innerHTML = pagHTML;
    } catch (e) {
        listEl.innerHTML = '评论加载失败';
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
    if (!currentUser) {
        alert('请先登录');
        return;
    }
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
        alert('发表失败: ' + e.message);
    }
}

// ---------- 点赞 ----------
async function likeComment(commentId, sectionId) {
    try {
        const res = await fetch(`${COMMENT_API}/comments/${commentId}/like`, { method: 'POST' });
        if (!res.ok) throw new Error((await res.json()).error);
        loadComments(sectionId, currentPage[sectionId] || 1);
    } catch (e) {
        alert('点赞失败: ' + e.message);
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

// ========== 原有函数保持不变，下面省略（请从之前的干净版复制完整） ==========
// ... 需包含 extractAndRemoveFrontMatter, postProcessImages, postProcessFigure, renderMath, buildHeadingStructure, insertClearfix, buildTOC, toggleSectionVisibility, hideTOCChildren, showTOCChildren, isParentVisible, expandAll, collapseAll, setupSidebarResize, setupAuthorPanel, setupSearch, setupChapterSelect, setupScrollSpy, restoreProgress, setupProgressSaving, escapeHtml ...
