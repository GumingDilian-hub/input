const COMMENT_API = 'https://woxiangcaoni.2167964516.workers.dev';
const ADMIN_USERNAME = 'loading';

let currentPostId = null;
let filterMasterOnly = false;

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function safeFetch(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`Fetch Error [${url}]:`, error);
        return null;
    }
}

// ===== 从 profile.js 获取用户 =====
function getCurrentUser() {
    // 优先使用 profile.js 暴露的 getter
    try {
        if (typeof getProfileUser === 'function') {
            const u = getProfileUser();
            if (u) return u;
        }
    } catch (e) {}
    // 回退到 localStorage
    try {
        const s = localStorage.getItem('iwp-user');
        if (s) return JSON.parse(s);
    } catch (e) {}
    // 最后回退到 window.profileUser（老的兼容）
    return window.profileUser || null;
}

const blogApp = {
    init: async () => {
        const params = new URLSearchParams(location.search);
        const postId = params.get('post');
        if (postId) {
            await blogApp.loadPost(postId);
        } else {
            await blogApp.fetchPosts();
        }
        blogApp.setupSearch();
        // 监听 profile.js 的登录/登出事件
        document.addEventListener('profile-login', () => {
            blogApp.updateAuthUI();
        });
        document.addEventListener('profile-logout', () => {
            blogApp.updateAuthUI();
        });
        // 初始化评论区登录状态
        blogApp.updateAuthUI();
        window.blogApp = blogApp;
    },

    setupSearch: () => {
        const input = document.getElementById('blog-search');
        if (!input) return;
        let timer;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => blogApp.fetchPosts(), 400);
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { clearTimeout(timer); blogApp.fetchPosts(); }
        });
    },

    fetchPosts: async () => {
        const keyword = document.getElementById('blog-search')?.value.trim() || '';
        const container = document.getElementById('posts-container');
        if (!container) return;
        container.innerHTML = '<div style="padding:2rem; text-align:center; color:#888;">加载中...</div>';

        const data = await safeFetch(`${COMMENT_API}/posts?search=${encodeURIComponent(keyword)}`);
        if (!data) {
            container.innerHTML = '<div style="padding:2rem; text-align:center; color:#888;">加载失败，请刷新重试</div>';
            return;
        }

        let posts = data.posts || [];
        if (filterMasterOnly) {
            posts = posts.filter(p => p.author === ADMIN_USERNAME);
        }

        container.innerHTML = '';
        if (posts.length === 0) {
            container.innerHTML = '<div style="padding:2rem; text-align:center; color:#888;">暂无文章</div>';
            return;
        }

        posts.forEach(post => {
            const heat = Math.floor(post.heat_score || 0);
            const div = document.createElement('div');
            div.style.cssText = "padding: 1.5rem; border-bottom: 1px solid #333; cursor: pointer; transition: background 0.2s;";
            div.onmouseover = () => div.style.background = "#2a2a2a";
            div.onmouseout = () => div.style.background = "transparent";
            const authorLink = `<a href="more.html?user=${encodeURIComponent(post.author)}" style="color: #88b4e6; text-decoration: none; font-weight:bold;" onclick="event.stopPropagation();">${escapeHtml(post.author)}</a>`;
            div.innerHTML = `
                <h2 style="margin:0 0 0.5rem; color:#eee;">${escapeHtml(post.title)}</h2>
                <div style="color:#aaa; font-size:0.9rem;">
                    <span>${authorLink}</span> · 热度 ${heat}
                </div>
            `;
            div.onclick = () => {
                history.pushState(null, '', `blog.html?post=${post.id}`);
                blogApp.loadPost(post.id);
            };
            container.appendChild(div);
        });
    },

    toggleFilterMaster: () => {
        filterMasterOnly = document.getElementById('filter-master').checked;
        blogApp.fetchPosts();
    },

    backToList: () => {
        document.getElementById('blog-list-view').style.display = 'block';
        document.getElementById('blog-read-view').style.display = 'none';
        history.pushState(null, '', 'blog.html');
        blogApp.fetchPosts();
    },

    loadPost: async (id) => {
        currentPostId = id;
        document.getElementById('blog-list-view').style.display = 'none';
        document.getElementById('blog-read-view').style.display = 'block';
        const container = document.getElementById('article-container');
        if (!container) return;
        container.innerHTML = '<div style="padding:2rem; text-align:center; color:#888;">加载中...</div>';

        const data = await safeFetch(`${COMMENT_API}/posts/${id}`);
        if (!data || !data.post) {
            container.innerHTML = '<div style="padding:2rem; text-align:center; color:#888;">文章加载失败，请返回重试</div>';
            return;
        }

        const post = data.post;
        const author = post.author_info || {};

        let html = '';
        try {
            // marked.parse 解析 markdown，内容安全建议用 DOMPurify 在 parse 后过滤（此处保持原有逻辑）
            html = marked.parse(post.content_md || '');
        } catch (e) {
            html = '<p style="color:#f88;">内容解析错误</p>';
        }

        const authorLink = `<a href="more.html?user=${encodeURIComponent(post.author)}" style="color: #88b4e6; text-decoration: none; font-weight:bold;">${escapeHtml(post.author)}</a>`;

        container.innerHTML = `
            <div style="margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid #444;">
                <h1 style="font-size:2.5rem; margin-bottom:0.5rem; color:#eee;">${escapeHtml(post.title)}</h1>
                <div style="display:flex; align-items:center; color:#aaa;">
                    <img src="${escapeHtml(author.avatar || 'images/0721.png')}" style="width:40px; height:40px; border-radius:50%; margin-right:10px;" onerror="this.src='images/0721.png'">
                    <div>
                        <div style="font-weight:bold; color:#ddd;">${authorLink}</div>
                        <div style="font-size:0.85rem; color:#888;">${escapeHtml((author.honor_year||'') + ' ' + (author.honor_rank||'') + ' ' + (author.school||''))}</div>
                    </div>
                </div>
            </div>
            <div class="article-body">${html}</div>
        `;

        if (typeof renderMathInElement === 'function') {
            try {
                renderMathInElement(container, {
                    delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]
                });
            } catch (e) {}
        }
        container.querySelectorAll('pre code').forEach(b => {
            try { hljs.highlightElement(b); } catch (e) {}
        });

        document.getElementById('post-stats').innerText = `查看 ${post.views || 0} · 评论 ${post.comments_count || 0}`;

        const nextBtn = document.getElementById('btn-next-post');
        if (data.next_id) {
            nextBtn.style.display = 'block';
            nextBtn.onclick = () => blogApp.loadPost(data.next_id);
        } else {
            nextBtn.style.display = 'none';
        }

        const area = document.getElementById('blog-comments-area');
        if (area) area.style.display = 'block';
        await blogApp.loadComments();
        blogApp.updateAuthUI();
    },

    // ---------- 编辑器 ----------
    openEditor: () => {
        const user = getCurrentUser();
        if (!user) return alert('请先登录（在个人中心）');
        const panel = document.getElementById('editor-panel');
        if (panel) panel.style.display = 'block';
    },
    closeEditor: () => {
        const panel = document.getElementById('editor-panel');
        if (panel) panel.style.display = 'none';
        document.getElementById('editor-title').value = '';
        document.getElementById('editor-content').value = '';
    },
    submitPost: async () => {
        const user = getCurrentUser();
        const title = document.getElementById('editor-title').value.trim();
        const content = document.getElementById('editor-content').value.trim();
        if (!title || !content) return alert('请填写标题和内容');
        if (!user) return alert('请先登录');

        const data = await safeFetch(`${COMMENT_API}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ title, content_md: content })
        });

        if (data) {
            alert('发布成功！');
            blogApp.closeEditor();
            blogApp.fetchPosts();
        } else {
            alert('发布失败，请稍后重试');
        }
    },

    // ---------- 评论区 ----------
    loadComments: async () => {
        const list = document.getElementById('blog-comment-list');
        const countEl = document.getElementById('blog-comment-count');
        if (!list) return;
        list.innerHTML = '加载中...';

        const data = await safeFetch(`${COMMENT_API}/comments?section=blog-${currentPostId}`);
        if (!data) {
            list.innerHTML = '<div style="padding:1rem; color:#888;">评论加载失败</div>';
            return;
        }

        const flat = data.comments || [];
        const total = data.total !== undefined ? data.total : flat.length;
        if (countEl) countEl.innerText = `(${total})`;

        const tree = blogApp.buildTree(flat);
        list.innerHTML = '';
        if (tree.length === 0) {
            list.innerHTML = '<div style="padding:1rem; color:#888;">暂无评论，来抢沙发吧～</div>';
        } else {
            list.appendChild(blogApp.renderComments(tree));
        }
    },

    buildTree: (flat) => {
        const map = {}, roots = [];
        flat.forEach(c => { c.children = []; map[c.id] = c; });
        flat.forEach(c => {
            if (c.parent_id && map[c.parent_id]) {
                map[c.parent_id].children.push(c);
            } else {
                roots.push(c);
            }
        });
        roots.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        return roots;
    },

    renderComments: (nodes) => {
        const fragment = document.createDocumentFragment();
        nodes.forEach(node => {
            const div = document.createElement('div');
            div.style.marginLeft = node.parent_id ? '24px' : '0';
            div.style.borderLeft = node.parent_id ? '2px solid #333' : 'none';
            div.style.padding = '10px 0';
            div.style.borderBottom = '1px solid #2a2a2a';

            const isMaster = (node.username === ADMIN_USERNAME);
            const masterTag = isMaster ? '<span style="background:#d9534f; color:#fff; font-size:10px; padding:2px 6px; border-radius:2px; margin-left:5px;">始作俑者</span>' : '';

            const safeUsername = escapeHtml(node.username);
            const safeContent = escapeHtml(node.content);
            const avatar = escapeHtml(node.avatar || 'images/0721.png');
            const userLink = `<a href="more.html?user=${encodeURIComponent(node.username)}" style="color: #88b4e6; text-decoration: none; font-weight:bold;">${safeUsername}</a>`;

            div.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; margin-right:8px;" onerror="this.src='images/0721.png'">
                    <strong style="color:#ddd;">${userLink}</strong>
                    ${masterTag}
                    <span style="font-size:0.7rem; color:#666; margin-left:8px;">${node.created_at ? new Date(node.created_at).toLocaleString() : ''}</span>
                </div>
                <div style="margin:5px 0; color:#ccc;">${safeContent}</div>
                <div>
                    <button onclick="blogApp.replyBox(${node.id})" style="background:none; border:none; color:#88b4e6; cursor:pointer; font-size:0.8rem;">回复</button>
                    <button onclick="blogApp.likeComment(${node.id})" style="background:none; border:none; color:#aaa; cursor:pointer; font-size:0.8rem; margin-left:10px;">赞 <span id="like-count-${node.id}">${node.likes || 0}</span></button>
                </div>
                <div id="reply-area-${node.id}" style="margin-top:5px; display:none;"></div>
            `;

            if (node.children && node.children.length > 0) {
                const childContainer = document.createElement('div');
                childContainer.style.marginTop = '8px';
                childContainer.appendChild(blogApp.renderComments(node.children));
                div.appendChild(childContainer);
            }
            fragment.appendChild(div);
        });
        return fragment;
    },

    replyBox: (parentId) => {
        const user = getCurrentUser();
        if (!user) { alert('请先登录'); return; }
        const area = document.getElementById(`reply-area-${parentId}`);
        if (!area) return;
        if (area.style.display === 'none' || area.style.display === '') {
            area.style.display = 'block';
            if (!area.dataset.initialized) {
                area.dataset.initialized = 'true';
                area.innerHTML = `
                    <textarea id="reply-input-${parentId}" rows="2" style="width:100%; border:1px solid #444; border-radius:4px; padding:5px; background:#111; color:#ddd;"></textarea>
                    <div style="margin-top:4px;">
                        <button onclick="blogApp.doReply(${parentId})">发送</button>
                        <button onclick="blogApp.closeReplyBox(${parentId})" style="background:transparent; border:1px solid #555; color:#aaa;">取消</button>
                    </div>
                `;
            }
        } else {
            area.style.display = 'none';
        }
    },

    closeReplyBox: (parentId) => {
        const area = document.getElementById(`reply-area-${parentId}`);
        if (area) area.style.display = 'none';
    },

    doReply: async (parentId) => {
        const user = getCurrentUser();
        if (!user) return alert('请先登录');
        const input = document.getElementById(`reply-input-${parentId}`);
        const content = input?.value.trim();
        if (!content) return;

        const data = await safeFetch(`${COMMENT_API}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ section: `blog-${currentPostId}`, content, parent_id: parentId })
        });

        if (data) {
            input.value = '';
            blogApp.closeReplyBox(parentId);
            blogApp.loadComments();
        } else {
            alert('回复失败，请重试');
        }
    },

    likeComment: async (id) => {
        const data = await safeFetch(`${COMMENT_API}/comments/${id}/like`, { method: 'POST' });
        if (data && data.likes !== undefined) {
            const span = document.getElementById(`like-count-${id}`);
            if (span) span.innerText = data.likes;
        }
    },

    // ---------- 认证UI（使用 profile.js 共享状态） ----------
    updateAuthUI: () => {
        const user = getCurrentUser();
        const authPanel = document.getElementById('blog-auth-panel');
        const inputArea = document.getElementById('blog-input-area');
        if (!authPanel) return;
        if (user) {
            authPanel.innerHTML = `<span style="color:#ddd;">${escapeHtml(user.username)}</span> <button onclick="profileLogout(); blogApp.updateAuthUI();">退出</button>`;
            if (inputArea) inputArea.style.display = 'block';
        } else {
            authPanel.innerHTML = `
                <button onclick="openProfile()">登录</button>
                <button onclick="openProfile()">注册</button>
            `;
            if (inputArea) inputArea.style.display = 'none';
        }
    },

    submitComment: async () => {
        const user = getCurrentUser();
        if (!user) return alert('请先登录');
        const input = document.getElementById('blog-comment-input');
        const content = input?.value.trim();
        if (!content) return;

        const data = await safeFetch(`${COMMENT_API}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ section: `blog-${currentPostId}`, content })
        });

        if (data) {
            input.value = '';
            blogApp.loadComments();
        } else {
            alert('发表失败，请重试');
        }
    }
};

document.addEventListener('DOMContentLoaded', blogApp.init);
