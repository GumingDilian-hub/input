/* ========== blog.js (完整修复版) ========== */
const CONFIG = {
  COMMENT_API: 'https://woxiangcaoni.2167964516.workers.dev',
  DEFAULT_AVATAR: 'images/0721.png'
};

let state = {
  user: null,
  currentPostId: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

function restoreUserSession() {
  const saved = localStorage.getItem('iwp-user');
  if (saved) {
    try { state.user = JSON.parse(saved); } catch (e) { state.user = null; }
  } else {
    state.user = null;
  }
}
restoreUserSession();

window.addEventListener('storage', (e) => {
  if (e.key === 'iwp-user') restoreUserSession();
});

/* ========== blogApp ========== */
const blogApp = {
  // ---------- 文章列表（首页） ----------
  async fetchPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    container.innerHTML = '<p style="color:#999;">正在加载文章列表...</p>';

    try {
      const res = await fetch(`${CONFIG.COMMENT_API}/posts`);
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      const posts = data.posts || [];

      container.innerHTML = '';
      if (posts.length === 0) {
        container.innerHTML = '<p style="color:#999;">没有找到文章。</p>';
        return;
      }

      posts.forEach(p => {
        const heat = (p.views || 0) + (p.likes || 0) * 5 + (p.comments_count || 0) * 10;
        const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString() : '未知日期';
        const author = p.author || '匿名';

        const el = document.createElement('div');
        el.className = 'post-item';
        el.style.cssText = 'padding:0.8rem 1rem;border-bottom:1px solid #333;cursor:pointer;transition:background 0.2s;';
        el.addEventListener('mouseenter', () => el.style.background = '#2a2a2a');
        el.addEventListener('mouseleave', () => el.style.background = '');
        el.addEventListener('click', () => this.openPost(p.id));

        const title = document.createElement('div');
        title.style.cssText = 'font-size:1.1rem;font-weight:bold;color:#88b4e6;margin-bottom:0.3rem;';
        title.textContent = p.title;

        const meta = document.createElement('div');
        meta.style.cssText = 'font-size:0.85rem;color:#999;display:flex;gap:1rem;flex-wrap:wrap;';
        meta.innerHTML = `
          <span>[作者] ${escapeHtml(author)}</span>
          <span>[日期] ${dateStr}</span>
          <span>[热度] ${heat}</span>
          <span>[浏览] ${p.views || 0}</span>
          <span>[点赞] ${p.likes || 0}</span>
          <span>[评论] ${p.comments_count || 0}</span>
        `;

        el.appendChild(title);
        el.appendChild(meta);
        container.appendChild(el);
      });
    } catch (e) {
      container.innerHTML = '<p style="color:red;">加载失败：' + e.message + '</p>';
    }
  },

  // ---------- 打开文章 ----------
  async openPost(id) {
    const listView = document.getElementById('blog-list-view');
    const readView = document.getElementById('blog-read-view');
    const article = document.getElementById('article-container');
    const commentsArea = document.getElementById('blog-comments-area');
    if (!listView || !readView || !article) return;

    listView.style.display = 'none';
    readView.style.display = '';
    article.innerHTML = '<p style="color:#999;">正在加载文章...</p>';

    try {
      const res = await fetch(`${CONFIG.COMMENT_API}/posts/${id}`);
      if (!res.ok) throw new Error('文章不存在');
      const data = await res.json();
      const post = data.post;
      state.currentPostId = id;

      const html = (typeof marked !== 'undefined') ? marked.parse(post.content_md) : post.content_md;
      article.innerHTML = html;

      // 统计信息
      document.getElementById('post-stats').textContent =
        `浏览: ${post.views} · 点赞: ${post.likes || 0} · 评论: ${post.comments_count || 0} · 热度: ${(post.views||0) + (post.likes||0)*5 + (post.comments_count||0)*10}`;

      // 点赞按钮（局部更新，不刷新页面）
      const likeBtn = document.getElementById('btn-like-post');
      likeBtn.onclick = async () => {
        if (!state.user) { alert('请先登录'); return; }
        const likeRes = await safeFetch(`${CONFIG.COMMENT_API}/posts/${id}/like`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${state.user.token}` }
        });
        if (likeRes) {
          // 直接更新本地统计，不重新拉取整个页面
          const newLikes = likeRes.action === 'liked' ? (post.likes || 0) + 1 : Math.max((post.likes || 0) - 1, 0);
          post.likes = newLikes;
          document.getElementById('post-stats').textContent =
            `浏览: ${post.views} · 点赞: ${post.likes} · 评论: ${post.comments_count || 0} · 热度: ${(post.views||0) + (post.likes||0)*5 + (post.comments_count||0)*10}`;
          likeBtn.textContent = likeRes.action === 'liked' ? '已点赞' : '点赞';
        }
      };
      // 初始状态：由于 API 没有返回当前用户是否已点赞，保持“点赞”文字，点击后根据返回切换
      likeBtn.textContent = '点赞';

      // 下一篇
      const nextBtn = document.getElementById('btn-next-post');
      if (data.next_id) {
        nextBtn.style.display = '';
        nextBtn.onclick = () => this.openPost(data.next_id);
      } else {
        nextBtn.style.display = 'none';
      }

      // 显示评论区并加载评论
      if (commentsArea) {
        commentsArea.style.display = '';
        this.loadComments();
      }
    } catch (e) {
      article.innerHTML = '<p style="color:red;">加载失败：' + e.message + '</p>';
    }
  },

  // ---------- 返回列表 ----------
  backToList() {
    document.getElementById('blog-list-view').style.display = '';
    document.getElementById('blog-read-view').style.display = 'none';
    const commentsArea = document.getElementById('blog-comments-area');
    if (commentsArea) commentsArea.style.display = 'none';
  },

  // ---------- 编辑器 ----------
  openEditor() {
    document.getElementById('editor-panel').style.display = 'block';
  },
  closeEditor() {
    document.getElementById('editor-panel').style.display = 'none';
  },

  // ---------- 发文 ----------
  async submitPost() {
    if (!state.user || !state.user.token) {
      alert('请先登录再发布文章');
      return;
    }
    const title = document.getElementById('editor-title')?.value.trim();
    const content_md = document.getElementById('editor-content')?.value.trim();
    if (!title || !content_md) {
      alert('标题和内容不能为空');
      return;
    }
    try {
      const res = await fetch(`${CONFIG.COMMENT_API}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`
        },
        body: JSON.stringify({ title, content_md })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      alert('文章发布成功！');
      this.closeEditor();
      this.fetchPosts();
    } catch (err) {
      console.error('发布失败:', err);
      alert('发布失败：' + err.message);
    }
  },

  // ---------- 评论 ----------
  async loadComments() {
    const section = 'blog-' + state.currentPostId;
    const list = document.getElementById('blog-comment-list');
    const countSpan = document.getElementById('blog-comment-count');
    if (!list) return;
    list.innerHTML = '加载中...';

    const data = await safeFetch(`${CONFIG.COMMENT_API}/comments?section=${encodeURIComponent(section)}&limit=50`);
    if (!data) {
      list.innerHTML = '加载失败';
      return;
    }
    const comments = data.comments || [];
    list.innerHTML = comments.length === 0 ? '<p style="color:#999;">暂无评论，快来抢沙发</p>' : '';

    comments.forEach(c => {
      const div = document.createElement('div');
      div.style.cssText = 'border-bottom:1px solid #333;padding:0.5rem 0;';
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <img src="${escapeHtml(c.avatar || CONFIG.DEFAULT_AVATAR)}" style="width:24px;height:24px;border-radius:50%;">
          <strong style="color:#eee;">${escapeHtml(c.username || '匿名')}</strong>
          <span style="color:#888;font-size:0.8rem;">${c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
        </div>
        <p style="margin:0.3rem 0 0 0;color:#ccc;">${escapeHtml(c.content)}</p>
      `;
      list.appendChild(div);
    });

    if (countSpan) countSpan.textContent = `(${comments.length})`;

    // 评论表单的登录状态处理
    const authPanel = document.getElementById('blog-auth-panel');
    const inputArea = document.getElementById('blog-input-area');
    if (authPanel) {
      if (state.user) {
        authPanel.innerHTML = `<span style="color:#eee;">Hi ${escapeHtml(state.user.username)}</span> <button onclick="blogApp.logout()">退出</button>`;
        if (inputArea) inputArea.style.display = 'block';
      } else {
        authPanel.innerHTML = `<button onclick="blogApp.showLogin()">登录</button> <button onclick="blogApp.showRegister()">注册</button>`;
        if (inputArea) inputArea.style.display = 'none';
      }
    }
  },

  async submitComment() {
    if (!state.user) { alert('请先登录'); return; }
    const input = document.getElementById('blog-comment-input');
    const content = input?.value.trim();
    if (!content) return;
    const section = 'blog-' + state.currentPostId;
    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
      },
      body: JSON.stringify({ section, content })
    });
    if (res) {
      input.value = '';
      this.loadComments();
    } else {
      alert('发送失败');
    }
  },

  // 快速登录/注册（弹窗方式或用评论区已有的）
  showLogin() {
    const authPanel = document.getElementById('blog-auth-panel');
    if (!authPanel) return;
    authPanel.innerHTML = `
      <input id="blog-login-user" type="text" placeholder="用户名" style="width:100px;">
      <input id="blog-login-pass" type="password" placeholder="密码" style="width:100px;">
      <button onclick="blogApp.doLogin()">Go</button>
    `;
  },
  showRegister() {
    const authPanel = document.getElementById('blog-auth-panel');
    if (!authPanel) return;
    authPanel.innerHTML = `
      <input id="blog-reg-user" type="text" placeholder="用户名" style="width:100px;">
      <input id="blog-reg-pass" type="password" placeholder="密码" style="width:100px;">
      <button onclick="blogApp.doRegister()">Go</button>
    `;
  },
  async doLogin() {
    const u = document.getElementById('blog-login-user')?.value.trim();
    const p = document.getElementById('blog-login-pass')?.value;
    if (!u || !p) return alert('请填写完整');
    const data = await safeFetch(`${CONFIG.COMMENT_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    if (data && data.token) {
      state.user = { username: u, token: data.token };
      localStorage.setItem('iwp-user', JSON.stringify(state.user));
      document.dispatchEvent(new CustomEvent('profile-login', { detail: state.user }));
      this.loadComments();
    } else {
      alert('登录失败');
    }
  },
  async doRegister() {
    const u = document.getElementById('blog-reg-user')?.value.trim();
    const p = document.getElementById('blog-reg-pass')?.value;
    if (!u || !p) return alert('请填写完整');
    const data = await safeFetch(`${CONFIG.COMMENT_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    if (data && data.token) {
      state.user = { username: u, token: data.token };
      localStorage.setItem('iwp-user', JSON.stringify(state.user));
      document.dispatchEvent(new CustomEvent('profile-login', { detail: state.user }));
      this.loadComments();
    } else {
      alert('注册失败');
    }
  },
  logout() {
    state.user = null;
    localStorage.removeItem('iwp-user');
    document.dispatchEvent(new CustomEvent('profile-logout'));
    this.loadComments();
  }
};

// 初始化
window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('#blog-search + button');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => blogApp.fetchPosts());
  }
  blogApp.fetchPosts();
});

window.blogApp = blogApp;
