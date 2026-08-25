/* ========== blog.js (统一架构版 - 最终修正) ========== */
/* 
   依赖：
   - reader.js 提供 window.state, window.escapeHtml, window.safeFetch
   - window.doLogin(username, password) 
   - window.doRegister(username, password) 
   - window.doLogout()
   后端地址：https://api.inputwebplease.de5.net
*/

const BLOG_API = 'https://api.inputwebplease.de5.net';

let blogState = {
  currentPostId: null,
  commentsRequestId: 0,
  isSubmitting: false,
};

// ---------- 统一从 window.state 读取用户 ----------
function getUser() {
  return window.state?.user || null;
}

function getToken() {
  return getUser()?.token || null;
}

function getUsername() {
  return getUser()?.username || null;
}

function canDeletePost(post) {
  return post?.author === getUsername();
}

function canDeleteComment(comment) {
  return comment?.username === getUsername();
}

// ---------- 统一登录/登出（直接调用 reader.js 提供的全局函数） ----------
async function blogLogin(username, password) {
  if (typeof window.doLogin !== 'function') {
    console.error('[blog.js] window.doLogin 不可用，请确保 reader.js 已加载');
    alert('登录功能未初始化，请刷新页面重试');
    return;
  }
  await window.doLogin(username, password);
}

async function blogRegister(username, password) {
  if (typeof window.doRegister !== 'function') {
    console.error('[blog.js] window.doRegister 不可用，请确保 reader.js 已加载');
    alert('注册功能未初始化，请刷新页面重试');
    return;
  }
  await window.doRegister(username, password);
}

function blogLogout() {
  if (typeof window.doLogout !== 'function') {
    console.error('[blog.js] window.doLogout 不可用，请确保 reader.js 已加载');
    return;
  }
  window.doLogout();
}

/* ========== blogApp ========== */

const blogApp = {

  // ---------- 文章列表（首页） ----------
  async fetchPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    container.innerHTML = '<p style="color:#999;">少女祈祷中...</p>';

    try {
      const res = await window.safeFetch(`${BLOG_API}/posts`);
      if (!res) throw new Error('请求失败');
      const posts = res.posts || [];
      container.innerHTML = '';
      if (posts.length === 0) {
        container.innerHTML = '<p style="color:#999;">没有找到文章QWQ。</p>';
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
          <span>[作者] ${window.escapeHtml(author)}</span>
          <span>[日期] ${window.escapeHtml(dateStr)}</span>
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
      container.innerHTML = '<p style="color:red;">加载失败：' + window.escapeHtml(e.message) + '</p>';
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
    article.innerHTML = '<p style="color:#999;">少女祈祷中...</p>';

    try {
      const res = await window.safeFetch(`${BLOG_API}/posts/${id}`);
      if (!res) throw new Error('文章不存在');
      const post = res.post;
      blogState.currentPostId = id;

      // 如果项目中有 DOMPurify，应使用 sanitizer
      // article.innerHTML = DOMPurify.sanitize(marked.parse(post.content_md));
      // 如果没有，至少确保 marked 配置了 sanitize
      article.innerHTML = (typeof marked !== 'undefined') 
        ? marked.parse(post.content_md) 
        : post.content_md;

      // 更新统计信息
      const statsEl = document.getElementById('post-stats');
      if (statsEl) {
        statsEl.textContent =
          `浏览: ${post.views} · 点赞: ${post.likes || 0} · 评论: ${post.comments_count || 0} · 热度: ${(post.views || 0) + (post.likes || 0) * 5 + (post.comments_count || 0) * 10}`;
      }

      // ---------- 点赞按钮 ----------
      const likeBtn = document.getElementById('btn-like-post');
      if (likeBtn) {
        const initialLiked = res.liked || false;
        likeBtn.textContent = initialLiked ? '已点赞' : '点赞';
        likeBtn.disabled = false;
        likeBtn._isLiking = false;

        likeBtn.onclick = async () => {
          const user = getUser();
          if (!user) { alert('请先登录'); return; }
          if (likeBtn._isLiking) return;
          likeBtn._isLiking = true;
          likeBtn.disabled = true;
          likeBtn.textContent = '处理中...';
          try {
            const likeRes = await window.safeFetch(`${BLOG_API}/posts/${id}/like`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (likeRes) {
              post.likes = likeRes.action === 'liked' 
                ? (post.likes || 0) + 1 
                : Math.max((post.likes || 0) - 1, 0);
              if (statsEl) {
                statsEl.textContent =
                  `浏览: ${post.views} · 点赞: ${post.likes} · 评论: ${post.comments_count || 0} · 热度: ${(post.views || 0) + (post.likes || 0) * 5 + (post.comments_count || 0) * 10}`;
              }
              likeBtn.textContent = likeRes.action === 'liked' ? '已点赞' : '点赞';
            }
          } catch (e) {
            console.error('[blog.js] 点赞失败:', e);
          } finally {
            likeBtn._isLiking = false;
            likeBtn.disabled = false;
          }
        };
      }

      // ---------- 删除文章 ----------
      const deletePostBtn = document.getElementById('btn-delete-post');
      if (deletePostBtn) {
        if (canDeletePost(post)) {
          deletePostBtn.style.display = '';
          deletePostBtn._isDeleting = false;
          deletePostBtn.onclick = async () => {
            const user = getUser();
            if (!user) { alert('请先登录'); return; }
            if (deletePostBtn._isDeleting) return;
            const ok = confirm(`确定要删除文章《${post.title}》吗？\n\n这篇文章的评论也会一起删除。`);
            if (!ok) return;
            deletePostBtn._isDeleting = true;
            deletePostBtn.disabled = true;
            deletePostBtn.textContent = '删除中...';
            try {
              const result = await window.safeFetch(`${BLOG_API}/posts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
              });
              if (!result || result.error) {
                alert('删除失败：' + (result?.error || '未知错误'));
                deletePostBtn._isDeleting = false;
                deletePostBtn.disabled = false;
                deletePostBtn.textContent = '删除文章';
                return;
              }
              alert('文章已删除');
              blogState.currentPostId = null;
              this.backToList();
              await this.fetchPosts();
            } catch (e) {
              deletePostBtn._isDeleting = false;
              deletePostBtn.disabled = false;
              deletePostBtn.textContent = '删除文章';
              alert('删除失败：' + e.message);
            }
          };
        } else {
          deletePostBtn.style.display = 'none';
        }
      }

      // ---------- 下一篇 ----------
      const nextBtn = document.getElementById('btn-next-post');
      if (nextBtn) {
        if (res.next_id) {
          nextBtn.style.display = '';
          nextBtn.onclick = () => this.openPost(res.next_id);
        } else {
          nextBtn.style.display = 'none';
        }
      }

      // ---------- 评论区 ----------
      if (commentsArea) {
        commentsArea.style.display = '';
        await this.loadComments();
      }
    } catch (e) {
      article.innerHTML = '<p style="color:red;">啊我死了：' + window.escapeHtml(e.message) + '</p>';
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
    if (blogState.isSubmitting) return;
    const user = getUser();
    if (!user || !user.token) { alert('请先登录再发布文章'); return; }

    const title = document.getElementById('editor-title')?.value.trim();
    const content_md = document.getElementById('editor-content')?.value.trim();
    if (!title || !content_md) { alert('标题和内容不能为空'); return; }

    blogState.isSubmitting = true;
    const btn = document.getElementById('btn-submit-post');
    if (btn) { btn.disabled = true; btn.textContent = '发布中...'; }

    try {
      const res = await window.safeFetch(`${BLOG_API}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, content_md })
      });
      if (!res || res.error) {
        throw new Error(res?.error || '发布失败');
      }
      alert('你亲手证明了自己不是机器人，恭喜！');
      this.closeEditor();
      await this.fetchPosts();
    } catch (err) {
      console.error('[blog.js] 发布失败:', err);
      alert('发布失败：' + err.message);
    } finally {
      blogState.isSubmitting = false;
      if (btn) { btn.disabled = false; btn.textContent = '发布文章'; }
    }
  },

  // ========== 评论系统 ==========

  async loadComments() {
    const section = 'blog-' + blogState.currentPostId;
    const list = document.getElementById('blog-comment-list');
    const countSpan = document.getElementById('blog-comment-count');
    if (!list) return;

    const requestId = ++blogState.commentsRequestId;
    list.innerHTML = '少女祈祷中...';

    const data = await window.safeFetch(`${BLOG_API}/comments?section=${encodeURIComponent(section)}&limit=100`);
    if (requestId !== blogState.commentsRequestId) return;
    if (!data) { list.innerHTML = '加载失败'; return; }

    const flat = data.comments || [];
    const tree = this._buildTree(flat);
    list.innerHTML = '';
    if (flat.length === 0) {
      list.innerHTML = '<p style="color:#999;">这里是天堂吗</p>';
    } else {
      this._renderTree(list, tree, section, 0);
    }

    if (countSpan) countSpan.textContent = `(${flat.length})`;

    // 同步更新文章顶部的评论计数
    const statsEl = document.getElementById('post-stats');
    if (statsEl && blogState.currentPostId) {
      const postRes = await window.safeFetch(`${BLOG_API}/posts/${blogState.currentPostId}`);
      if (postRes && postRes.post) {
        const p = postRes.post;
        statsEl.textContent =
          `浏览: ${p.views} · 点赞: ${p.likes || 0} · 评论: ${p.comments_count || 0} · 热度: ${(p.views || 0) + (p.likes || 0) * 5 + (p.comments_count || 0) * 10}`;
      }
    }

    // 更新评论区的登录状态
    const authPanel = document.getElementById('blog-auth-panel');
    const inputArea = document.getElementById('blog-input-area');
    if (authPanel) {
      const user = getUser();
      if (user) {
        authPanel.innerHTML = `
          <span style="color:#eee;">Hi ${window.escapeHtml(user.username)}</span>
          <button onclick="blogApp.logout()">退出</button>
        `;
        if (inputArea) inputArea.style.display = 'block';
      } else {
        authPanel.innerHTML = `
          <button onclick="blogApp.showLogin()">登录</button>
          <button onclick="blogApp.showRegister()">注册</button>
        `;
        if (inputArea) inputArea.style.display = 'none';
      }
    }
  },

  _buildTree(flatList) {
    const map = {};
    const roots = [];
    flatList.forEach(c => {
      map[c.id] = { ...c, children: [] };
    });
    flatList.forEach(c => {
      const node = map[c.id];
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  },

  _renderTree(container, nodes, section, depth) {
    const MAX_DEPTH = 20;
    if (depth > MAX_DEPTH) {
      const warn = document.createElement('div');
      warn.style.cssText = 'color:#888;font-size:0.8rem;padding:4px 8px;';
      warn.textContent = '（评论嵌套过深，已截断）';
      container.appendChild(warn);
      return;
    }

    nodes.forEach(node => {
      const wrapper = document.createElement('div');
      const isChild = !!node.parent_id;
      wrapper.style.marginLeft = isChild ? '24px' : '';
      wrapper.style.paddingLeft = isChild ? '12px' : '';
      wrapper.style.borderLeft = isChild ? '2px solid #444' : '';

      const item = document.createElement('div');
      item.style.cssText = 'border-bottom:1px solid #333;padding:0.5rem 0;';

      // header: avatar + username + time
      const header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;gap:0.5rem;';

      const avatar = document.createElement('img');
      avatar.src = node.avatar || 'images/0721.png';
      avatar.alt = '';
      avatar.style.cssText = 'width:24px;height:24px;border-radius:50%;';

      const username = document.createElement('strong');
      username.style.color = '#eee';
      username.textContent = node.username || '匿名';

      const time = document.createElement('span');
      time.style.cssText = 'color:#888;font-size:0.8rem;';
      time.textContent = node.created_at ? new Date(node.created_at).toLocaleString() : '';

      header.appendChild(avatar);
      header.appendChild(username);
      header.appendChild(time);

      // content
      const content = document.createElement('p');
      content.style.cssText = 'margin:0.3rem 0 0;color:#ccc;';
      content.textContent = node.content || '';

      // actions
      const actions = document.createElement('div');
      actions.style.cssText = 'margin-top:0.3rem;display:flex;gap:0.5rem;';

      // Reply button
      const replyBtn = document.createElement('button');
      replyBtn.textContent = '回复';
      replyBtn.style.cssText = 'background:none;border:none;color:#88b4e6;cursor:pointer;font-size:0.85rem;';
      replyBtn.onclick = () => this._showReplyBox(node.id, section);

      // Like button
      const likeBtn = document.createElement('button');
      likeBtn.textContent = `点赞 ${node.likes || 0}`;
      likeBtn.style.cssText = 'background:none;border:none;color:#88b4e6;cursor:pointer;font-size:0.85rem;';
      likeBtn._isLiking = false;
      likeBtn.onclick = async () => {
        if (likeBtn._isLiking) return;
        const user = getUser();
        if (!user) { alert('请先登录'); return; }
        likeBtn._isLiking = true;
        likeBtn.disabled = true;
        likeBtn.textContent = '...';
        try {
          const result = await window.safeFetch(`${BLOG_API}/comments/${node.id}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (result) {
            await this.loadComments();
          }
        } finally {
          likeBtn._isLiking = false;
          likeBtn.disabled = false;
          likeBtn.textContent = `点赞 ${node.likes || 0}`;
        }
      };

      actions.appendChild(replyBtn);
      actions.appendChild(likeBtn);

      // Delete button (only for comment author)
      if (canDeleteComment(node)) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.style.cssText = 'background:none;border:none;color:#d66;cursor:pointer;font-size:0.85rem;';
        deleteBtn._isDeleting = false;
        deleteBtn.onclick = async () => {
          if (deleteBtn._isDeleting) return;
          const user = getUser();
          if (!user) { alert('请先登录'); return; }
          if (!confirm('确定要删除这条评论吗？')) return;
          deleteBtn._isDeleting = true;
          deleteBtn.disabled = true;
          deleteBtn.textContent = '删除中...';
          try {
            const result = await window.safeFetch(`${BLOG_API}/comments/${node.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!result || result.error) {
              alert('删除失败：' + (result?.error || '未知错误'));
              return;
            }
            await this.loadComments();
          } finally {
            deleteBtn._isDeleting = false;
            deleteBtn.disabled = false;
            deleteBtn.textContent = '删除';
          }
        };
        actions.appendChild(deleteBtn);
      }

      item.appendChild(header);
      item.appendChild(content);
      item.appendChild(actions);

      // Reply box (hidden initially)
      const replyBox = document.createElement('div');
      replyBox.id = `reply-box-${node.id}`;
      replyBox.style.cssText = 'display:none;margin:0.5rem 0 0 2rem;';
      item.appendChild(replyBox);

      wrapper.appendChild(item);
      container.appendChild(wrapper);

      // Recursively render children
      if (node.children && node.children.length > 0) {
        const childrenContainer = document.createElement('div');
        wrapper.appendChild(childrenContainer);
        this._renderTree(childrenContainer, node.children, section, depth + 1);
      }
    });
  },

  _showReplyBox(parentId, section) {
    if (!getUser()) { alert('请先登录'); return; }
    const box = document.getElementById(`reply-box-${parentId}`);
    if (!box) return;

    if (box.style.display === 'none' || box.style.display === '') {
      box.style.display = 'block';
      box.innerHTML = '';
      // 使用 DOM 创建，避免 inline onclick 的 XSS 风险
      const textarea = document.createElement('textarea');
      textarea.id = `reply-input-${parentId}`;
      textarea.rows = 2;
      textarea.maxLength = 5000;
      textarea.style.cssText = 'width:100%;background:#111;color:#ddd;border:1px solid #444;padding:5px;border-radius:4px;';
      textarea.placeholder = '写下你的回复...';

      const btnWrap = document.createElement('div');
      btnWrap.style.cssText = 'margin-top:5px;display:flex;gap:5px;';

      const sendBtn = document.createElement('button');
      sendBtn.id = `reply-send-${parentId}`;
      sendBtn.textContent = '发送';
      sendBtn.style.cssText = 'background:#333;color:#fff;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;';
      sendBtn.addEventListener('click', () => {
        this._doReply(parentId, section);
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '取消';
      cancelBtn.style.cssText = 'background:none;border:none;color:#888;cursor:pointer;';
      cancelBtn.addEventListener('click', () => {
        box.style.display = 'none';
      });

      btnWrap.appendChild(sendBtn);
      btnWrap.appendChild(cancelBtn);
      box.appendChild(textarea);
      box.appendChild(btnWrap);
    } else {
      box.style.display = 'none';
    }
  },

  async _doReply(parentId, section) {
    const user = getUser();
    if (!user) { alert('请先登录'); return; }
    const input = document.getElementById(`reply-input-${parentId}`);
    const content = input?.value.trim();
    if (!content) return;

    const btn = document.getElementById(`reply-send-${parentId}`);
    if (btn) { btn.disabled = true; btn.textContent = '发送中...'; }

    try {
      const res = await window.safeFetch(`${BLOG_API}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ section, content, parent_id: parentId })
      });
      if (res) {
        await this.loadComments();
      } else {
        alert('发送失败');
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '发送'; }
    }
  },

  async submitComment() {
    const user = getUser();
    if (!user) { alert('请先登录'); return; }
    const input = document.getElementById('blog-comment-input');
    const content = input?.value.trim();
    if (!content) return;

    const btn = document.getElementById('btn-submit-comment');
    if (btn) { btn.disabled = true; btn.textContent = '发送中...'; }

    try {
      const section = 'blog-' + blogState.currentPostId;
      const res = await window.safeFetch(`${BLOG_API}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ section, content })
      });
      if (res) {
        input.value = '';
        await this.loadComments();
      } else {
        alert('发送失败');
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '发送'; }
    }
  },

  // ---------- 快捷登录/注册 ----------
  showLogin() {
    const authPanel = document.getElementById('blog-auth-panel');
    if (!authPanel) return;
    authPanel.innerHTML = `
      <input id="blog-login-user" type="text" maxlength="32" placeholder="用户名" style="width:100px;">
      <input id="blog-login-pass" type="password" maxlength="128" placeholder="密码" style="width:100px;">
      <button id="blog-login-btn" onclick="blogApp.doLogin()">Go</button>
    `;
  },

  showRegister() {
    const authPanel = document.getElementById('blog-auth-panel');
    if (!authPanel) return;
    authPanel.innerHTML = `
      <input id="blog-reg-user" type="text" maxlength="32" placeholder="用户名" style="width:100px;">
      <input id="blog-reg-pass" type="password" maxlength="128" placeholder="密码" style="width:100px;">
      <button id="blog-reg-btn" onclick="blogApp.doRegister()">Go</button>
    `;
  },

  async doLogin() {
    const btn = document.getElementById('blog-login-btn');
    const u = document.getElementById('blog-login-user')?.value.trim();
    const p = document.getElementById('blog-login-pass')?.value;
    if (!u || !p) return alert('请填写完整');
    if (btn) { btn.disabled = true; btn.textContent = '登录中...'; }
    try {
      await blogLogin(u, p);
      await this.loadComments();
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Go'; }
    }
  },

  async doRegister() {
    const btn = document.getElementById('blog-reg-btn');
    const u = document.getElementById('blog-reg-user')?.value.trim();
    const p = document.getElementById('blog-reg-pass')?.value;
    if (!u || !p) return alert('请填写完整');
    if (btn) { btn.disabled = true; btn.textContent = '注册中...'; }
    try {
      await blogRegister(u, p);
      await this.loadComments();
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Go'; }
    }
  },

  logout() {
    blogLogout();
    this.loadComments();
  }
};

// ---------- 监听统一登录/登出事件 ----------
document.addEventListener('profile-login', () => {
  if (blogState.currentPostId) blogApp.loadComments();
});

document.addEventListener('profile-logout', () => {
  if (blogState.currentPostId) blogApp.loadComments();
});

// ---------- 初始化 ----------
window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('#blog-search + button');
  if (searchBtn) searchBtn.addEventListener('click', () => blogApp.fetchPosts());
  blogApp.fetchPosts();
});

window.blogApp = blogApp;
