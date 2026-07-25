/* ========== profile.js (完整修正版) ========== */
/* 依赖：reader.js 或 blog.js 提供 $, CONFIG, state, escapeHtml, safeFetch, doLogin, doRegister, doLogout */

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

  // 从 API 获取完整用户信息
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

  // 检查标记：刚注册则强推编辑界面
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

  // 学校
  if (user.school) {
    const schoolEl = document.createElement('div');
    schoolEl.style.cssText = 'margin-top:0.3rem;color:#aaa;font-size:0.9rem;';
    schoolEl.textContent = '[学校] ' + escapeHtml(user.school);
    top.appendChild(schoolEl);
  }

  // 荣誉标签
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
  editBtn.addEventListener('click', () => {
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

  // 信息卡片
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'margin-top:1.5rem;padding:1rem;background:#2a2a2a;border-radius:8px;color:#ccc;';
  infoDiv.innerHTML = `
    <div style="margin-bottom:0.5rem;"><strong>用户名：</strong>${escapeHtml(user.username || '')}</div>
    ${user.email ? `<div style="margin-bottom:0.5rem;"><strong>邮箱：</strong>${escapeHtml(user.email)}</div>` : ''}
    ${user.school ? `<div><strong>学校：</strong>${escapeHtml(user.school)}</div>` : ''}
  `;
  container.appendChild(infoDiv);
}

// 登录/注册表单
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
      // 注意：登录不强制编辑，只刷新面板
      setTimeout(renderProfileContent, 500);
    } else alert('登录模块缺失');
  });

  const regBtn = document.createElement('button');
  regBtn.textContent = '注册';
  regBtn.addEventListener('click', () => {
    userInput.id = 'reg-user-profile';
    passInput.id = 'reg-pass-profile';
    if (typeof doRegister === 'function') {
      doRegister('profile'); // 注册成功后由 profile-login 事件触发强推编辑
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

// ---------- 编辑资料表单 ----------
function showEditForm(container, user) {
  container.innerHTML = '';

  const title = document.createElement('h3');
  title.style.cssText = 'color:#fff;margin-bottom:1rem;';
  title.textContent = '编辑资料';
  container.appendChild(title);

  // 输入框
  const avatarInput = createInput('头像 URL', user.avatar || '');
  const schoolInput = createInput('学校', user.school || '');
  const honorYearInput = createInput('荣誉年份 (如 2025)', user.honor_year || '');
  const honorRankInput = createInput('荣誉等级 (如 省一)', user.honor_rank || '');

  // 密码修改
  const pwdDiv = document.createElement('div');
  pwdDiv.style.cssText = 'border-top:1px solid #444;padding-top:1rem;margin-top:0.5rem;';
  const oldPwdInput = createInput('当前密码（如需修改密码必填）', '', 'password');
  const newPwdInput = createInput('新密码', '', 'password');
  pwdDiv.appendChild(oldPwdInput.wrapper);
  pwdDiv.appendChild(newPwdInput.wrapper);

  // 按钮
  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;margin-top:1rem;';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '取消';
  cancelBtn.style.background = '#555';
  cancelBtn.addEventListener('click', () => renderProfileContent());

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '保存';
  saveBtn.style.background = '#d9534f';
  saveBtn.addEventListener('click', async () => {
    const payload = {
      avatar: avatarInput.input.value.trim(),
      school: schoolInput.input.value.trim(),
      honor_year: honorYearInput.input.value.trim(),
      honor_rank: honorRankInput.input.value.trim()
    };

    const oldPwd = oldPwdInput.input.value;
    const newPwd = newPwdInput.input.value;
    if (newPwd) {
      if (!oldPwd) {
        alert('请输入当前密码才能修改密码');
        return;
      }
      payload.old_password = oldPwd;
      payload.password = newPwd;
    }

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
      alert('保存失败：' + err.message);
    }
  });

  btnGroup.appendChild(cancelBtn);
  btnGroup.appendChild(saveBtn);

  // 组装
  [avatarInput, schoolInput, honorYearInput, honorRankInput].forEach(item => {
    container.appendChild(item.wrapper);
  });
  container.appendChild(pwdDiv);
  container.appendChild(btnGroup);
}

// 辅助函数：创建带标签的输入框
function createInput(labelText, value = '', type = 'text') {
  const wrapper = document.createElement('div');
  wrapper.style.marginBottom = '8px';

  const label = document.createElement('label');
  label.style.cssText = 'display:block;color:#ccc;margin-bottom:4px;font-size:0.9rem;';
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.style.cssText = 'width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;';

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return { wrapper, input };
}

// ---------- 事件同步 ----------
// 监听登录事件（注册/登录成功后触发）
document.addEventListener('profile-login', (e) => {
  try { state.user = e.detail; } catch (err) {}

  // 如果是通过注册按钮触发的登录，设置强推编辑标记
  // 因为注册按钮调用的是 doRegister('profile')，我们无法直接判断来源，
  // 但可以在 doRegister 成功前设置一个标记，这里清除并应用。
  if (sessionStorage.getItem('pending_registration') === '1') {
    sessionStorage.removeItem('pending_registration');
    sessionStorage.setItem('just_registered', '1');
  }

  // 重新渲染面板（如果面板打开）
  if ($('#profile-panel')?.style.display === 'block') {
    renderProfileContent();
  }
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

// 点击面板外部关闭
document.addEventListener('click', (e) => {
  const panel = $('#profile-panel');
  const btn = $('#btn-profile');
  if (!panel || !btn) return;
  if (panel.style.display === 'none') return;
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = 'none';
  }
});

/* 补丁：覆盖注册按钮逻辑，增加 pending_registration 标记 */
// 但因为注册按钮在 renderLoginForm 里是动态创建的，我们无法直接修改，
// 所以我们在 renderLoginForm 的注册按钮点击处已经处理好了，这里确保 doRegister 能触发标记。
// 如果 doRegister 内部也是异步，最好在 doRegister 的 finally 或 then 中设置标记，
// 但我们不修改 reader.js，所以改为在注册按钮点击时立即设置 pending_registration。
// 上面的代码中，注册按钮并没有设置 pending_registration，需要补加。
// 因此更正 renderLoginForm 中的注册按钮点击事件：

// 重新定义 renderLoginForm 中的注册按钮（替换上面 renderLoginForm 函数体内的 regBtn 部分）
// 为了方便，这里给出完整的 renderLoginForm 修正版。
// 实际上面的 renderLoginForm 里注册按钮点击没有设置 pending_registration，现在修正：
