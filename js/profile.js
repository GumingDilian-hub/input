/* ========== profile.js (编辑按钮终极修复) ========== */
/* 依赖：reader.js 或 blog.js 已提供 $, CONFIG, state, escapeHtml, safeFetch, doLogin, doRegister, doLogout */

function openProfile() {
  const panel = $('#profile-panel');
  if (!panel) return;
  panel.style.display = 'block';
  renderProfileContent();
}

function closeProfile() {
  const panel = $('#profile-panel');
  if (!panel) return;
  panel.style.display = 'none';
}

async function renderProfileContent() {
  const container = $('#profile-content');
  if (!container) return;
  container.innerHTML = '<div style="color:#888;text-align:center;padding:2rem;">加载中...</div>';

  if (!state.user) {
    renderLoginForm(container);
    return;
  }

  let fullUser = null;
  try {
    const res = await safeFetch(`${CONFIG.COMMENT_API}/users/me`, {
      headers: { 'Authorization': `Bearer ${state.user.token}` }
    });
    if (res && res.user) fullUser = res.user;
  } catch (e) {
    console.warn('获取用户信息失败', e);
  }

  const user = { ...state.user, ...(fullUser || {}) };
  console.log('[个人中心] 当前用户:', user);

  // 注册强推编辑
  if (sessionStorage.getItem('just_registered') === '1') {
    sessionStorage.removeItem('just_registered');
    showEditForm(container, user);
    return;
  }

  container.innerHTML = '';

  // --- 头像与基本信息 ---
  const top = document.createElement('div');
  top.style.textAlign = 'center';

  const avatar = document.createElement('img');
  avatar.src = user.avatar || CONFIG.DEFAULT_AVATAR;
  avatar.style.cssText = 'width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #555;';
  avatar.onerror = () => { avatar.src = CONFIG.DEFAULT_AVATAR; };

  const nameEl = document.createElement('div');
  nameEl.style.cssText = 'margin-top:0.6rem;font-size:1.4rem;font-weight:600;color:#fff;';
  nameEl.textContent = user.username || '匿名';

  top.appendChild(avatar);
  top.appendChild(nameEl);

  if (user.school) {
    const schoolEl = document.createElement('div');
    schoolEl.style.cssText = 'margin-top:0.3rem;color:#aaa;font-size:0.9rem;';
    schoolEl.textContent = '[学校] ' + escapeHtml(user.school);
    top.appendChild(schoolEl);
  }

  if (user.honor_year || user.honor_rank) {
    const honorDiv = document.createElement('div');
    honorDiv.style.cssText = 'display:flex;justify-content:center;gap:8px;margin-top:0.5rem;';
    if (user.honor_year) {
      const badge = document.createElement('span');
      badge.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem;';
      badge.textContent = '[年份] ' + escapeHtml(user.honor_year);
      honorDiv.appendChild(badge);
    }
    if (user.honor_rank) {
      const badge = document.createElement('span');
      badge.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem;';
      badge.textContent = '[等级] ' + escapeHtml(user.honor_rank);
      honorDiv.appendChild(badge);
    }
    top.appendChild(honorDiv);
  }

  container.appendChild(top);

  // --- 操作按钮 ---
  const btnBar = document.createElement('div');
  btnBar.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:1.2rem;';

  const moreBtn = document.createElement('button');
  moreBtn.textContent = '查看公开资料';
  moreBtn.addEventListener('click', () => {
    window.open(`more.html?user=${encodeURIComponent(user.username || '')}`, '_blank');
  });

  const editBtn = document.createElement('button');
  editBtn.textContent = '编辑资料';
  editBtn.id = 'profile-edit-btn'; // 便于调试
  editBtn.addEventListener('click', () => {
    console.log('[编辑按钮] 被点击');
    showEditForm(container, user);
  });

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = '退出登录';
  logoutBtn.addEventListener('click', () => {
    if (typeof doLogout === 'function') doLogout();
    renderProfileContent();
  });

  btnBar.appendChild(moreBtn);
  btnBar.appendChild(editBtn);
  btnBar.appendChild(logoutBtn);
  container.appendChild(btnBar);

  // 静态信息卡片
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'margin-top:1.5rem;padding:1rem;background:#2a2a2a;border-radius:8px;color:#ccc;';
  infoDiv.innerHTML = `
    <div style="margin-bottom:0.5rem;"><strong>用户名：</strong>${escapeHtml(user.username || '')}</div>
    ${user.email ? `<div style="margin-bottom:0.5rem;"><strong>邮箱：</strong>${escapeHtml(user.email)}</div>` : ''}
    ${user.school ? `<div><strong>学校：</strong>${escapeHtml(user.school)}</div>` : ''}
  `;
  container.appendChild(infoDiv);
}

function renderLoginForm(container) {
  container.innerHTML = '';

  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.placeholder = '用户名';
  userInput.id = 'profile-login-user';

  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.placeholder = '密码';
  passInput.id = 'profile-login-pass';

  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:10px;';

  const loginBtn = document.createElement('button');
  loginBtn.textContent = '登录';
  loginBtn.addEventListener('click', () => {
    userInput.id = 'login-user-profile';
    passInput.id = 'login-pass-profile';
    if (typeof doLogin === 'function') {
      doLogin('profile');
      setTimeout(renderProfileContent, 500);
    } else alert('登录模块缺失');
  });

  const regBtn = document.createElement('button');
  regBtn.textContent = '注册';
  regBtn.addEventListener('click', () => {
    userInput.id = 'reg-user-profile';
    passInput.id = 'reg-pass-profile';
    if (typeof doRegister === 'function') {
      sessionStorage.setItem('just_registered', '1');
      doRegister('profile');
      setTimeout(renderProfileContent, 500);
    } else alert('注册模块缺失');
  });

  btnGroup.appendChild(loginBtn);
  btnGroup.appendChild(regBtn);

  container.appendChild(userInput);
  container.appendChild(passInput);
  container.appendChild(btnGroup);

  const hint = document.createElement('div');
  hint.style.cssText = 'margin-top:1rem;color:#888;font-size:0.9rem;';
  hint.textContent = '登录后可编辑荣誉、学校等信息。';
  container.appendChild(hint);
}

// ---------- 编辑表单（彻底重写） ----------
function showEditForm(container, user) {
  console.log('[编辑表单] 开始构建');

  container.innerHTML = '';

  const title = document.createElement('h3');
  title.style.cssText = 'color:#fff;margin-bottom:1rem;';
  title.textContent = '编辑资料';
  container.appendChild(title);

  // 直接用 getElementById 获取输入值，不再依赖闭包对象
  const formHtml = `
    <div style="margin-bottom:10px;">
      <label style="color:#ccc;display:block;margin-bottom:4px;">头像 URL</label>
      <input id="edit-avatar" type="text" value="${escapeHtml(user.avatar || '')}" style="width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="color:#ccc;display:block;margin-bottom:4px;">学校</label>
      <input id="edit-school" type="text" value="${escapeHtml(user.school || '')}" style="width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="color:#ccc;display:block;margin-bottom:4px;">荣誉年份 (如 2025)</label>
      <input id="edit-honor-year" type="text" value="${escapeHtml(user.honor_year || '')}" style="width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="color:#ccc;display:block;margin-bottom:4px;">荣誉等级 (如 省一)</label>
      <input id="edit-honor-rank" type="text" value="${escapeHtml(user.honor_rank || '')}" style="width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="border-top:1px solid #444;padding-top:1rem;margin-top:0.5rem;">
      <label style="color:#ccc;display:block;margin-bottom:4px;">当前密码（如需改密码必填）</label>
      <input id="edit-old-pwd" type="password" style="width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;">
      <label style="color:#ccc;display:block;margin-bottom:4px;margin-top:10px;">新密码</label>
      <input id="edit-new-pwd" type="password" style="width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:1rem;">
      <button id="edit-cancel-btn" style="background:#555;">取消</button>
      <button id="edit-save-btn" style="background:#d9534f;">保存</button>
    </div>
  `;
  container.innerHTML += formHtml;

  // 绑定事件（用 getElementById 保证找到）
  const cancelBtn = document.getElementById('edit-cancel-btn');
  const saveBtn = document.getElementById('edit-save-btn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      console.log('[编辑表单] 取消编辑');
      renderProfileContent();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      console.log('[编辑表单] 保存按钮点击');

      const avatar = document.getElementById('edit-avatar')?.value.trim() || '';
      const school = document.getElementById('edit-school')?.value.trim() || '';
      const honor_year = document.getElementById('edit-honor-year')?.value.trim() || '';
      const honor_rank = document.getElementById('edit-honor-rank')?.value.trim() || '';
      const oldPwd = document.getElementById('edit-old-pwd')?.value || '';
      const newPwd = document.getElementById('edit-new-pwd')?.value || '';

      const payload = { avatar, school, honor_year, honor_rank };
      if (newPwd) {
        if (!oldPwd) {
          alert('请输入当前密码才能修改密码');
          return;
        }
        payload.old_password = oldPwd;
        payload.password = newPwd;
      }

      console.log('[编辑表单] 提交数据:', payload);

      try {
        const res = await safeFetch(`${CONFIG.COMMENT_API}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res) throw new Error('请求失败，可能是网络或 CORS 问题');
        if (res.error) throw new Error(res.error);

        state.user = { ...state.user, ...(res.user || {}) };
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        alert('资料更新成功！');
        renderProfileContent();
      } catch (err) {
        console.error('[编辑表单] 保存失败:', err);
        alert('保存失败：' + err.message);
      }
    });
  } else {
    console.error('[编辑表单] 找不到保存按钮');
  }
}

// ---------- 事件同步 ----------
document.addEventListener('profile-login', (e) => {
  try { state.user = e.detail; } catch (err) {}
  if ($('#profile-panel')?.style.display === 'block') renderProfileContent();
});

document.addEventListener('profile-logout', () => {
  state.user = null;
  if ($('#profile-panel')?.style.display === 'block') renderProfileContent();
});

window.addEventListener('storage', (e) => {
  if (e.key === 'iwp-user') {
    try { state.user = e.newValue ? JSON.parse(e.newValue) : null; } catch (err) { state.user = null; }
    if ($('#profile-panel')?.style.display === 'block') renderProfileContent();
  }
});

document.addEventListener('click', (e) => {
  const panel = $('#profile-panel');
  const btn = $('#btn-profile');
  if (!panel || !btn) return;
  if (panel.style.display === 'none') return;
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = 'none';
  }
});
