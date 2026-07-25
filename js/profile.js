/* ========== profile.js (完整个人中心) ========== */
/* 依赖：reader.js 或 blog.js 已定义 CONFIG, state, $, $$, escapeHtml, safeFetch 等 */

// ========== 面板控制 ==========
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

// ========== 主渲染 ==========
async function renderProfileContent() {
  const container = $('#profile-content');
  if (!container) return;
  container.innerHTML = '<div style="color:#888;text-align:center;padding:2rem 0;">加载中...</div>';

  if (!state.user) {
    // 未登录：显示登录/注册表单
    renderLoginForm(container);
    return;
  }

  // 已登录：从 API 拉取完整用户信息（补全头像、学校等）
  let fullUser = null;
  try {
    const data = await safeFetch(`${CONFIG.COMMENT_API}/users/me`, {
      headers: { 'Authorization': `Bearer ${state.user.token}` }
    });
    if (data && data.user) fullUser = data.user;
  } catch (e) { /* 忽略 */ }

  // 合并信息
  const user = { ...state.user, ...fullUser };
  container.innerHTML = '';

  // --- 顶部信息 ---
  const top = document.createElement('div');
  top.style.textAlign = 'center';

  const avatar = document.createElement('img');
  avatar.src = user.avatar || CONFIG.DEFAULT_AVATAR;
  avatar.style.width = '90px';
  avatar.style.height = '90px';
  avatar.style.borderRadius = '50%';
  avatar.style.objectFit = 'cover';
  avatar.style.border = '3px solid #555';
  avatar.onerror = () => { avatar.src = CONFIG.DEFAULT_AVATAR; };

  const nameEl = document.createElement('div');
  nameEl.style.marginTop = '0.6rem';
  nameEl.style.fontSize = '1.4rem';
  nameEl.style.fontWeight = '600';
  nameEl.style.color = '#fff';
  nameEl.textContent = user.username || '匿名';

  top.appendChild(avatar);
  top.appendChild(nameEl);

  // 荣誉标签
  if (user.honor_year || user.honor_rank) {
    const honorDiv = document.createElement('div');
    honorDiv.style.marginTop = '0.5rem';
    honorDiv.style.display = 'flex';
    honorDiv.style.justifyContent = 'center';
    honorDiv.style.gap = '6px';
    if (user.honor_year) {
      const badge = document.createElement('span');
      badge.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem;';
      badge.textContent = user.honor_year;
      honorDiv.appendChild(badge);
    }
    if (user.honor_rank) {
      const badge = document.createElement('span');
      badge.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem;';
      badge.textContent = user.honor_rank;
      honorDiv.appendChild(badge);
    }
    top.appendChild(honorDiv);
  }

  if (user.school) {
    const schoolEl = document.createElement('div');
    schoolEl.style.marginTop = '0.3rem';
    schoolEl.style.color = '#aaa';
    schoolEl.style.fontSize = '0.9rem';
    schoolEl.textContent = user.school;
    top.appendChild(schoolEl);
  }

  container.appendChild(top);

  // --- 操作按钮 ---
  const btnBar = document.createElement('div');
  btnBar.style.display = 'flex';
  btnBar.style.gap = '10px';
  btnBar.style.justifyContent = 'center';
  btnBar.style.marginTop = '1.2rem';

  const moreBtn = document.createElement('button');
  moreBtn.textContent = '查看公开资料';
  moreBtn.addEventListener('click', () => {
    window.open(`more.html?user=${encodeURIComponent(user.username || '')}`, '_blank');
  });

  const editBtn = document.createElement('button');
  editBtn.textContent = '编辑资料';
  editBtn.addEventListener('click', () => showEditForm(container, user));

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

  // --- 基础信息 ---
  const infoDiv = document.createElement('div');
  infoDiv.style.marginTop = '1.5rem';
  infoDiv.style.padding = '1rem';
  infoDiv.style.background = '#2a2a2a';
  infoDiv.style.borderRadius = '8px';
  infoDiv.style.color = '#ccc';
  infoDiv.innerHTML = `
    <div style="margin-bottom:0.5rem;"><strong>用户名：</strong>${escapeHtml(user.username || '')}</div>
    ${user.email ? `<div style="margin-bottom:0.5rem;"><strong>邮箱：</strong>${escapeHtml(user.email)}</div>` : ''}
    ${user.school ? `<div><strong>学校：</strong>${escapeHtml(user.school)}</div>` : ''}
  `;
  container.appendChild(infoDiv);
}

// ========== 登录/注册表单（未登录时） ==========
function renderLoginForm(container) {
  container.innerHTML = '';

  const form = document.createElement('div');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '10px';

  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.placeholder = '用户名';
  userInput.id = 'profile-login-user';

  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.placeholder = '密码';
  passInput.id = 'profile-login-pass';

  const btnGroup = document.createElement('div');
  btnGroup.style.display = 'flex';
  btnGroup.style.gap = '10px';

  const loginBtn = document.createElement('button');
  loginBtn.textContent = '登录';
  loginBtn.addEventListener('click', () => {
    // 复用已有 doLogin 函数，它需要特定 ID 的输入框
    userInput.id = 'login-user-profile';
    passInput.id = 'login-pass-profile';
    if (typeof doLogin === 'function') {
      doLogin('profile');
    } else {
      alert('登录功能不可用');
    }
    setTimeout(renderProfileContent, 500);
  });

  const regBtn = document.createElement('button');
  regBtn.textContent = '注册';
  regBtn.addEventListener('click', () => {
    userInput.id = 'reg-user-profile';
    passInput.id = 'reg-pass-profile';
    if (typeof doRegister === 'function') {
      doRegister('profile');
    } else {
      alert('注册功能不可用');
    }
    setTimeout(renderProfileContent, 500);
  });

  btnGroup.appendChild(loginBtn);
  btnGroup.appendChild(regBtn);

  form.appendChild(userInput);
  form.appendChild(passInput);
  form.appendChild(btnGroup);

  container.appendChild(form);

  const hint = document.createElement('div');
  hint.style.marginTop = '1rem';
  hint.style.color = '#888';
  hint.style.fontSize = '0.9rem';
  hint.textContent = '登录后可评论、点赞，并展示你的荣誉与学校信息。';
  container.appendChild(hint);
}

// ========== 编辑资料表单 ==========
function showEditForm(container, user) {
  container.innerHTML = '';

  const title = document.createElement('h3');
  title.style.color = '#fff';
  title.style.marginBottom = '1rem';
  title.textContent = '编辑资料';
  container.appendChild(title);

  const form = document.createElement('div');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '10px';

  // 头像 (URL)
  const avatarLabel = document.createElement('label');
  avatarLabel.style.color = '#ccc';
  avatarLabel.textContent = '头像链接';
  const avatarInput = document.createElement('input');
  avatarInput.type = 'text';
  avatarInput.value = user.avatar || '';
  avatarInput.placeholder = 'https://... 或留空';

  // 学校
  const schoolLabel = document.createElement('label');
  schoolLabel.style.color = '#ccc';
  schoolLabel.textContent = '学校';
  const schoolInput = document.createElement('input');
  schoolInput.type = 'text';
  schoolInput.value = user.school || '';

  // 荣誉年份
  const honorYearLabel = document.createElement('label');
  honorYearLabel.style.color = '#ccc';
  honorYearLabel.textContent = '荣誉年份';
  const honorYearInput = document.createElement('input');
  honorYearInput.type = 'text';
  honorYearInput.value = user.honor_year || '';

  // 荣誉等级
  const honorRankLabel = document.createElement('label');
  honorRankLabel.style.color = '#ccc';
  honorRankLabel.textContent = '荣誉等级';
  const honorRankInput = document.createElement('input');
  honorRankInput.type = 'text';
  honorRankInput.value = user.honor_rank || '';

  // 修改密码（可选）
  const pwdSection = document.createElement('div');
  pwdSection.style.borderTop = '1px solid #444';
  pwdSection.style.paddingTop = '1rem';
  pwdSection.style.marginTop = '0.5rem';

  const pwdLabel = document.createElement('div');
  pwdLabel.style.color = '#ccc';
  pwdLabel.style.marginBottom = '0.5rem';
  pwdLabel.textContent = '修改密码（留空则不修改）';
  const oldPwdInput = document.createElement('input');
  oldPwdInput.type = 'password';
  oldPwdInput.placeholder = '当前密码';
  oldPwdInput.id = 'edit-old-password';
  const newPwdInput = document.createElement('input');
  newPwdInput.type = 'password';
  newPwdInput.placeholder = '新密码';
  newPwdInput.id = 'edit-new-password';

  pwdSection.appendChild(oldPwdInput);
  pwdSection.appendChild(newPwdInput);

  // 按钮
  const btnGroup = document.createElement('div');
  btnGroup.style.display = 'flex';
  btnGroup.style.gap = '10px';
  btnGroup.style.justifyContent = 'flex-end';
  btnGroup.style.marginTop = '1rem';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '取消';
  cancelBtn.style.background = '#444';
  cancelBtn.addEventListener('click', renderProfileContent);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '保存';
  saveBtn.style.background = '#d9534f';
  saveBtn.addEventListener('click', async () => {
    const payload = {};
    payload.avatar = avatarInput.value.trim();
    payload.school = schoolInput.value.trim();
    payload.honor_year = honorYearInput.value.trim();
    payload.honor_rank = honorRankInput.value.trim();

    // 如果填写了新密码
    const newPwd = newPwdInput.value.trim();
    if (newPwd) {
      payload.password = newPwd;
      // 注意：后端 PUT /users/me 如果要求旧密码验证，这里只是示例，实际可额外发送
    }

    const res = await safeFetch(`${CONFIG.COMMENT_API}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
      },
      body: JSON.stringify(payload)
    });

    if (res && res.user) {
      // 更新本地 state
      state.user.username = res.user.username || state.user.username;
      state.user.avatar = res.user.avatar;
      state.user.school = res.user.school;
      state.user.honor_year = res.user.honor_year;
      state.user.honor_rank = res.user.honor_rank;
      localStorage.setItem('iwp-user', JSON.stringify(state.user));
      alert('资料已更新');
      renderProfileContent();
    } else {
      alert('更新失败，请检查输入');
    }
  });

  btnGroup.appendChild(cancelBtn);
  btnGroup.appendChild(saveBtn);

  // 组装
  form.appendChild(avatarLabel);
  form.appendChild(avatarInput);
  form.appendChild(schoolLabel);
  form.appendChild(schoolInput);
  form.appendChild(honorYearLabel);
  form.appendChild(honorYearInput);
  form.appendChild(honorRankLabel);
  form.appendChild(honorRankInput);
  form.appendChild(pwdSection);
  form.appendChild(btnGroup);

  container.appendChild(form);
}

// ========== 事件同步 ==========
document.addEventListener('profile-login', (e) => {
  try { state.user = e.detail; } catch (err) { /* ignore */ }
  if (document.getElementById('profile-panel')?.style.display === 'block') {
    renderProfileContent();
  }
});

document.addEventListener('profile-logout', () => {
  state.user = null;
  if (document.getElementById('profile-panel')?.style.display === 'block') {
    renderProfileContent();
  }
});

window.addEventListener('storage', (e) => {
  if (e.key === 'iwp-user') {
    try { state.user = e.newValue ? JSON.parse(e.newValue) : null; } catch (err) { state.user = null; }
    if (document.getElementById('profile-panel')?.style.display === 'block') {
      renderProfileContent();
    }
  }
});

// 点击面板外关闭
document.addEventListener('click', (e) => {
  const panel = document.getElementById('profile-panel');
  const btn = document.getElementById('btn-profile');
  if (!panel || !btn) return;
  if (panel.style.display === 'none' || panel.style.display === '') return;
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = 'none';
  }
});
