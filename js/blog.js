/* ========== blog.js (完整版：文章、评论树、点赞、删除) ========== */

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

          errText =
            j.error ||
            j.message ||
            JSON.stringify(j);
        } else {
          const t = await res.text();

          if (t) errText = t;
        }
      } catch (e) {}

      throw new Error(errText);
    }

    const ct = res.headers.get('content-type') || '';

    if (ct.includes('application/json')) {
      return await res.json();
    }

    if (ct.includes('text/') || ct === '') {
      return await res.text();
    }

    return res;

  } catch (error) {
    console.error(`Fetch Error [${url}]:`, error);
    return null;
  }
}

function restoreUserSession() {
  const saved = localStorage.getItem('iwp-user');

  if (saved) {
    try {
      state.user = JSON.parse(saved);
    } catch (e) {
      state.user = null;
      localStorage.removeItem('iwp-user');
    }
  } else {
    state.user = null;
  }
}

function clearInvalidSession() {
  state.user = null;
  localStorage.removeItem('iwp-user');
}

function canDeletePost(post) {
  if (!state.user || !state.user.username) {
    return false;
  }

  return post?.author === state.user.username;
}

function canDeleteComment(comment) {
  if (!state.user || !state.user.username) {
    return false;
  }

  return comment?.username === state.user.username;
}

restoreUserSession();

window.addEventListener('storage', (e) => {
  if (e.key === 'iwp-user') {
    restoreUserSession();
  }
});

/* ========== blogApp ========== */

const blogApp = {

  // ---------- 文章列表（首页） ----------
  async fetchPosts() {
    const container = document.getElementById('posts-container');

    if (!container) return;

    container.innerHTML =
      '<p style="color:#999;">少女祈祷中...</p>';

    try {
      const res = await fetch(
        `${CONFIG.COMMENT_API}/posts`
      );

      if (!res.ok) {
        throw new Error('啊我死了');
      }

      const data = await res.json();
      const posts = data.posts || [];

      container.innerHTML = '';

      if (posts.length === 0) {
        container.innerHTML =
          '<p style="color:#999;">没有找到文章QWQ。</p>';

        return;
      }

      posts.forEach(p => {
        const heat =
          (p.views || 0) +
          (p.likes || 0) * 5 +
          (p.comments_count || 0) * 10;

        const dateStr = p.created_at
          ? new Date(p.created_at).toLocaleDateString()
          : '未知日期';

        const author = p.author || '匿名';

        const el = document.createElement('div');

        el.className = 'post-item';

        el.style.cssText =
          'padding:0.8rem 1rem;border-bottom:1px solid #333;cursor:pointer;transition:background 0.2s;';

        el.addEventListener(
          'mouseenter',
          () => el.style.background = '#2a2a2a'
        );

        el.addEventListener(
          'mouseleave',
          () => el.style.background = ''
        );

        el.addEventListener(
          'click',
          () => this.openPost(p.id)
        );

        const title = document.createElement('div');

        title.style.cssText =
          'font-size:1.1rem;font-weight:bold;color:#88b4e6;margin-bottom:0.3rem;';

        title.textContent = p.title;

        const meta = document.createElement('div');

        meta.style.cssText =
          'font-size:0.85rem;color:#999;display:flex;gap:1rem;flex-wrap:wrap;';

        meta.innerHTML = `
          <span>[作者] ${escapeHtml(author)}</span>
          <span>[日期] ${escapeHtml(dateStr)}</span>
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
      container.innerHTML =
        '<p style="color:red;">加载失败：' +
        escapeHtml(e.message) +
        '</p>';
    }
  },

  // ---------- 打开文章 ----------
  async openPost(id) {
    const listView =
      document.getElementById('blog-list-view');

    const readView =
      document.getElementById('blog-read-view');

    const article =
      document.getElementById('article-container');

    const commentsArea =
      document.getElementById('blog-comments-area');

    if (!listView || !readView || !article) {
      return;
    }

    listView.style.display = 'none';
    readView.style.display = '';

    article.innerHTML =
      '<p style="color:#999;">少女祈祷中...</p>';

    try {
      const res = await fetch(
        `${CONFIG.COMMENT_API}/posts/${id}`
      );

      if (!res.ok) {
        throw new Error('文章不存在');
      }

      const data = await res.json();
      const post = data.post;

      state.currentPostId = id;

      // 保持原来的文章主体渲染逻辑
      const html =
        (typeof marked !== 'undefined')
          ? marked.parse(post.content_md)
          : post.content_md;

      article.innerHTML = html;

      // 统计信息
      document.getElementById('post-stats').textContent =
        `浏览: ${post.views} · 点赞: ${post.likes || 0} · 评论: ${post.comments_count || 0} · 热度: ${(post.views || 0) + (post.likes || 0) * 5 + (post.comments_count || 0) * 10}`;

      // 点赞按钮（局部更新）
      const likeBtn =
        document.getElementById('btn-like-post');

      if (likeBtn) {
        likeBtn.onclick = async () => {
          if (!state.user) {
            alert('请先登录');
            return;
          }

          const likeRes = await safeFetch(
            `${CONFIG.COMMENT_API}/posts/${id}/like`,
            {
              method: 'POST',
              headers: {
                'Authorization':
                  `Bearer ${state.user.token}`
              }
            }
          );

          if (likeRes) {
            const newLikes =
              likeRes.action === 'liked'
                ? (post.likes || 0) + 1
                : Math.max(
                    (post.likes || 0) - 1,
                    0
                  );

            post.likes = newLikes;

            document.getElementById(
              'post-stats'
            ).textContent =
              `浏览: ${post.views} · 点赞: ${post.likes} · 评论: ${post.comments_count || 0} · 热度: ${(post.views || 0) + (post.likes || 0) * 5 + (post.comments_count || 0) * 10}`;

            likeBtn.textContent =
              likeRes.action === 'liked'
                ? '已点赞'
                : '点赞';
          }
        };

        likeBtn.textContent = '点赞';
      }

      // ---------- 删除文章 ----------
      const deletePostBtn =
        document.getElementById('btn-delete-post');

      if (deletePostBtn) {
        if (canDeletePost(post)) {
          deletePostBtn.style.display = '';

          deletePostBtn.onclick = async () => {
            const ok = confirm(
              `确定要删除文章《${post.title}》吗？\n\n这篇文章的评论也会一起删除。`
            );

            if (!ok) return;

            deletePostBtn.disabled = true;
            deletePostBtn.textContent = '删除中...';

            const result = await safeFetch(
              `${CONFIG.COMMENT_API}/posts/${id}`,
              {
                method: 'DELETE',
                headers: {
                  'Authorization':
                    `Bearer ${state.user.token}`
                }
              }
            );

            if (!result) {
              alert('删除失败');

              deletePostBtn.disabled = false;
              deletePostBtn.textContent = '删除文章';

              return;
            }

            if (result.error) {
              alert(
                '删除失败：' +
                result.error
              );

              deletePostBtn.disabled = false;
              deletePostBtn.textContent = '删除文章';

              return;
            }

            alert('文章已删除');

            state.currentPostId = null;

            this.backToList();
            await this.fetchPosts();
          };

        } else {
          deletePostBtn.style.display = 'none';
        }
      }

      // ---------- 下一篇 ----------
      const nextBtn =
        document.getElementById('btn-next-post');

      if (nextBtn) {
        if (data.next_id) {
          nextBtn.style.display = '';

          nextBtn.onclick =
            () => this.openPost(data.next_id);

        } else {
          nextBtn.style.display = 'none';
        }
      }

      // 显示评论区
      if (commentsArea) {
        commentsArea.style.display = '';
        this.loadComments();
      }

    } catch (e) {
      article.innerHTML =
        '<p style="color:red;">啊我死了：' +
        escapeHtml(e.message) +
        '</p>';
    }
  },

  // ---------- 返回列表 ----------
  backToList() {
    document.getElementById(
      'blog-list-view'
    ).style.display = '';

    document.getElementById(
      'blog-read-view'
    ).style.display = 'none';

    const commentsArea =
      document.getElementById(
        'blog-comments-area'
      );

    if (commentsArea) {
      commentsArea.style.display = 'none';
    }
  },

  // ---------- 编辑器 ----------
  openEditor() {
    document.getElementById(
      'editor-panel'
    ).style.display = 'block';
  },

  closeEditor() {
    document.getElementById(
      'editor-panel'
    ).style.display = 'none';
  },

  // ---------- 发文 ----------
  async submitPost() {
    if (!state.user || !state.user.token) {
      alert('请先登录再发布文章');
      return;
    }

    const title =
      document.getElementById(
        'editor-title'
      )?.value.trim();

    const content_md =
      document.getElementById(
        'editor-content'
      )?.value.trim();

    if (!title || !content_md) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      const res = await fetch(
        `${CONFIG.COMMENT_API}/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            'Authorization':
              `Bearer ${state.user.token}`
          },
          body: JSON.stringify({
            title,
            content_md
          })
        }
      );

      if (!res.ok) {
        const err =
          await res.json().catch(() => ({}));

        throw new Error(
          err.error ||
          err.message ||
          `HTTP ${res.status}`
        );
      }

      alert(
        '你亲手证明了自己不是机器人，恭喜！'
      );

      this.closeEditor();
      this.fetchPosts();

    } catch (err) {
      console.error(
        '发布失败:',
        err
      );

      alert(
        '发布失败：' +
        err.message
      );
    }
  },

  // ========== 评论系统（树状回复+点赞+删除） ==========

  async loadComments() {
    const section =
      'blog-' + state.currentPostId;

    const list =
      document.getElementById(
        'blog-comment-list'
      );

    const countSpan =
      document.getElementById(
        'blog-comment-count'
      );

    if (!list) return;

    list.innerHTML =
      '少女祈祷中...';

    const data = await safeFetch(
      `${CONFIG.COMMENT_API}/comments?section=${encodeURIComponent(section)}&limit=100`
    );

    if (!data) {
      list.innerHTML = '加载失败';
      return;
    }

    const flat = data.comments || [];

    const tree =
      this._buildTree(flat);

    list.innerHTML = '';

    if (flat.length === 0) {
      list.innerHTML =
        '<p style="color:#999;">这里是天堂吗</p>';

    } else {
      this._renderTree(
        list,
        tree,
        section
      );
    }

    if (countSpan) {
      countSpan.textContent =
        `(${flat.length})`;
    }

    // 更新评论表单登录状态
    const authPanel =
      document.getElementById(
        'blog-auth-panel'
      );

    const inputArea =
      document.getElementById(
        'blog-input-area'
      );

    if (authPanel) {
      if (state.user) {
        authPanel.innerHTML = `
          <span style="color:#eee;">
            Hi ${escapeHtml(state.user.username)}
          </span>
          <button onclick="blogApp.logout()">
            退出
          </button>
        `;

        if (inputArea) {
          inputArea.style.display =
            'block';
        }

      } else {
        authPanel.innerHTML = `
          <button onclick="blogApp.showLogin()">
            登录
          </button>
          <button onclick="blogApp.showRegister()">
            注册
          </button>
        `;

        if (inputArea) {
          inputArea.style.display =
            'none';
        }
      }
    }
  },

  // ---------- 构建评论树 ----------
  _buildTree(flatList) {
    const map = {};
    const roots = [];

    flatList.forEach(c => {
      c.children = [];
      map[c.id] = c;
    });

    flatList.forEach(c => {
      if (
        c.parent_id &&
        map[c.parent_id]
      ) {
        map[c.parent_id]
          .children
          .push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  },

  // ---------- 递归渲染树 ----------
  _renderTree(
    container,
    nodes,
    section
  ) {
    nodes.forEach(node => {
      const wrapper =
        document.createElement('div');

      const isChild =
        !!node.parent_id;

      wrapper.style.marginLeft =
        isChild ? '24px' : '';

      wrapper.style.paddingLeft =
        isChild ? '12px' : '';

      wrapper.style.borderLeft =
        isChild
          ? '2px solid #444'
          : '';

      const item =
        document.createElement('div');

      item.style.cssText =
        'border-bottom:1px solid #333;padding:0.5rem 0;';

      // 头像+用户名+时间
      const header =
        document.createElement('div');

      header.style.cssText =
        'display:flex;align-items:center;gap:0.5rem;';

      const avatar =
        document.createElement('img');

      avatar.src =
        node.avatar ||
        CONFIG.DEFAULT_AVATAR;

      avatar.alt = '';

      avatar.style.cssText =
        'width:24px;height:24px;border-radius:50%;';

      const username =
        document.createElement('strong');

      username.style.color = '#eee';

      username.textContent =
        node.username || '匿名';

      const time =
        document.createElement('span');

      time.style.cssText =
        'color:#888;font-size:0.8rem;';

      time.textContent =
        node.created_at
          ? new Date(
              node.created_at
            ).toLocaleString()
          : '';

      header.appendChild(avatar);
      header.appendChild(username);
      header.appendChild(time);

      const content =
        document.createElement('p');

      content.style.cssText =
        'margin:0.3rem 0 0;color:#ccc;';

      content.textContent =
        node.content || '';

      // 操作按钮
      const actions =
        document.createElement('div');

      actions.style.cssText =
        'margin-top:0.3rem;display:flex;gap:0.5rem;';

      const replyBtn =
        document.createElement('button');

      replyBtn.textContent = '回复';

      replyBtn.style.cssText =
        'background:none;border:none;color:#88b4e6;cursor:pointer;font-size:0.85rem;';

      replyBtn.onclick =
        () => this._showReplyBox(
          node.id,
          section
        );

      const likeBtn =
        document.createElement('button');

      likeBtn.textContent =
        `点赞 ${node.likes || 0}`;

      likeBtn.style.cssText =
        'background:none;border:none;color:#88b4e6;cursor:pointer;font-size:0.85rem;';

      likeBtn.onclick = async () => {
        if (!state.user) {
          alert('请先登录');
          return;
        }

        const result =
          await safeFetch(
            `${CONFIG.COMMENT_API}/comments/${node.id}/like`,
            {
              method: 'POST',
              headers: {
                'Authorization':
                  `Bearer ${state.user.token}`
              }
            }
          );

        if (result) {
          this.loadComments();
        }
      };

      actions.appendChild(
        replyBtn
      );

      actions.appendChild(
        likeBtn
      );

      // ---------- 删除评论 ----------
      if (canDeleteComment(node)) {
        const deleteBtn =
          document.createElement('button');

        deleteBtn.textContent =
          '删除';

        deleteBtn.style.cssText =
          'background:none;border:none;color:#d66;cursor:pointer;font-size:0.85rem;';

        deleteBtn.onclick =
          async () => {
            const ok = confirm(
              '确定要删除这条评论吗？'
            );

            if (!ok) return;

            deleteBtn.disabled = true;
            deleteBtn.textContent =
              '删除中...';

            const result =
              await safeFetch(
                `${CONFIG.COMMENT_API}/comments/${node.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Authorization':
                      `Bearer ${state.user.token}`
                  }
                }
              );

            if (!result) {
              alert('删除失败');

              deleteBtn.disabled =
                false;

              deleteBtn.textContent =
                '删除';

              return;
            }

            if (result.error) {
              alert(
                '删除失败：' +
                result.error
              );

              deleteBtn.disabled =
                false;

              deleteBtn.textContent =
                '删除';

              return;
            }

            await this.loadComments();
          };

        actions.appendChild(
          deleteBtn
        );
      }

      item.appendChild(header);
      item.appendChild(content);
      item.appendChild(actions);

      // 回复框（初始隐藏）
      const replyBox =
        document.createElement('div');

      replyBox.id =
        `reply-box-${node.id}`;

      replyBox.style.cssText =
        'display:none;margin:0.5rem 0 0 2rem;';

      item.appendChild(
        replyBox
      );

      wrapper.appendChild(item);

      container.appendChild(
        wrapper
      );

      // 递归渲染子评论
      if (
        node.children &&
        node.children.length > 0
      ) {
        const childrenContainer =
          document.createElement('div');

        wrapper.appendChild(
          childrenContainer
        );

        this._renderTree(
          childrenContainer,
          node.children,
          section
        );
      }
    });
  },

  // ---------- 显示回复输入框 ----------
  _showReplyBox(
    parentId,
    section
  ) {
    if (!state.user) {
      alert('请先登录');
      return;
    }

    const box =
      document.getElementById(
        `reply-box-${parentId}`
      );

    if (!box) return;

    if (
      box.style.display === 'none' ||
      box.style.display === ''
    ) {
      box.style.display =
        'block';

      box.innerHTML = `
        <textarea
          id="reply-input-${parentId}"
          rows="2"
          maxlength="5000"
          style="width:100%;background:#111;color:#ddd;border:1px solid #444;padding:5px;border-radius:4px;"
          placeholder="写下你的回复..."
        ></textarea>

        <div style="margin-top:5px;display:flex;gap:5px;">
          <button
            onclick="blogApp._doReply(${parentId}, '${escapeHtml(section)}')"
            style="background:#333;color:#fff;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;"
          >
            发送
          </button>

          <button
            onclick="document.getElementById('reply-box-${parentId}').style.display='none'"
            style="background:none;border:none;color:#888;cursor:pointer;"
          >
            取消
          </button>
        </div>
      `;

    } else {
      box.style.display = 'none';
    }
  },

  // ---------- 提交回复 ----------
  async _doReply(
    parentId,
    section
  ) {
    if (!state.user) {
      alert('请先登录');
      return;
    }

    const input =
      document.getElementById(
        `reply-input-${parentId}`
      );

    const content =
      input?.value.trim();

    if (!content) return;

    const res =
      await safeFetch(
        `${CONFIG.COMMENT_API}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            'Authorization':
              `Bearer ${state.user.token}`
          },
          body: JSON.stringify({
            section,
            content,
            parent_id: parentId
          })
        }
      );

    if (res) {
      this.loadComments();
    } else {
      alert('发送失败');
    }
  },

  // ---------- 顶级评论提交 ----------
  async submitComment() {
    if (!state.user) {
      alert('请先登录');
      return;
    }

    const input =
      document.getElementById(
        'blog-comment-input'
      );

    const content =
      input?.value.trim();

    if (!content) return;

    const section =
      'blog-' + state.currentPostId;

    const res =
      await safeFetch(
        `${CONFIG.COMMENT_API}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            'Authorization':
              `Bearer ${state.user.token}`
          },
          body: JSON.stringify({
            section,
            content
          })
        }
      );

    if (res) {
      input.value = '';
      this.loadComments();
    } else {
      alert('发送失败');
    }
  },

  // ---------- 快捷登录/注册 ----------
  showLogin() {
    const authPanel =
      document.getElementById(
        'blog-auth-panel'
      );

    if (!authPanel) return;

    authPanel.innerHTML = `
      <input
        id="blog-login-user"
        type="text"
        maxlength="32"
        placeholder="用户名"
        style="width:100px;"
      >

      <input
        id="blog-login-pass"
        type="password"
        maxlength="128"
        placeholder="密码"
        style="width:100px;"
      >

      <button onclick="blogApp.doLogin()">
        Go
      </button>
    `;
  },

  showRegister() {
    const authPanel =
      document.getElementById(
        'blog-auth-panel'
      );

    if (!authPanel) return;

    authPanel.innerHTML = `
      <input
        id="blog-reg-user"
        type="text"
        maxlength="32"
        placeholder="用户名"
        style="width:100px;"
      >

      <input
        id="blog-reg-pass"
        type="password"
        maxlength="128"
        placeholder="密码"
        style="width:100px;"
      >

      <button onclick="blogApp.doRegister()">
        Go
      </button>
    `;
  },

  // ---------- 登录 ----------
  async doLogin() {
    const u =
      document.getElementById(
        'blog-login-user'
      )?.value.trim();

    const p =
      document.getElementById(
        'blog-login-pass'
      )?.value;

    if (!u || !p) {
      return alert('请填写完整');
    }

    const data =
      await safeFetch(
        `${CONFIG.COMMENT_API}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            username: u,
            password: p
          })
        }
      );

    if (data && data.token) {
      state.user = {
        username: u,
        token: data.token
      };

      localStorage.setItem(
        'iwp-user',
        JSON.stringify(state.user)
      );

      document.dispatchEvent(
        new CustomEvent(
          'profile-login',
          {
            detail: state.user
          }
        )
      );

      this.loadComments();

    } else {
      alert(
        data?.error ||
        '登录失败'
      );
    }
  },

  // ---------- 注册 ----------
  async doRegister() {
    const u =
      document.getElementById(
        'blog-reg-user'
      )?.value.trim();

    const p =
      document.getElementById(
        'blog-reg-pass'
      )?.value;

    if (!u || !p) {
      return alert('请填写完整');
    }

    const data =
      await safeFetch(
        `${CONFIG.COMMENT_API}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            username: u,
            password: p
          })
        }
      );

    if (data && data.token) {
      state.user = {
        username: u,
        token: data.token
      };

      localStorage.setItem(
        'iwp-user',
        JSON.stringify(state.user)
      );

      document.dispatchEvent(
        new CustomEvent(
          'profile-login',
          {
            detail: state.user
          }
        )
      );

      this.loadComments();

    } else {
      alert(
        data?.error ||
        '注册失败'
      );
    }
  },

  // ---------- 退出 ----------
  logout() {
    state.user = null;

    localStorage.removeItem(
      'iwp-user'
    );

    document.dispatchEvent(
      new CustomEvent(
        'profile-logout'
      )
    );

    this.loadComments();
  }
};

// ---------- 初始化 ----------
window.addEventListener(
  'DOMContentLoaded',
  () => {
    const searchBtn =
      document.querySelector(
        '#blog-search + button'
      );

    if (searchBtn) {
      searchBtn.addEventListener(
        'click',
        () => blogApp.fetchPosts()
      );
    }

    blogApp.fetchPosts();
  }
);

window.blogApp = blogApp;
