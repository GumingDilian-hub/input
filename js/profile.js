/* ========== profile.js (最终稳定版) ========== */
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

// ========== 主渲染 ==========
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
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();          // 阻止冒泡
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

// ========== 登录/注册表单 ==========
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
      sessionStorage.setItem('pending_registration', '1');
      doRegister('profile');
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

// ========== 编辑资料表单（强化防关闭） ==========
function showEditForm(container, user) {
  // 先清空，再包裹一个阻止冒泡的容器
  container.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-keep-open', 'true');   // 标记，全局关闭检查会放过
  wrapper.addEventListener('click', (e) => e.stopPropagation()); // 整个编辑区域阻止冒泡

  const title = document.createElement('h3');
  title.style.cssText = 'color:#fff;margin-bottom:1rem;';
  title.textContent = '编辑资料';
  wrapper.appendChild(title);

  // 输入框
  const avatarInput = createInput('头像 URL', user.avatar || '');
  const schoolInput = createInput('学校', user.school || '');
  const honorYearInput = createInput('荣誉年份 (如 2025)', user.honor_year || '');
  const honorRankInput = createInput('荣誉等级 (如 省一)', user.honor_rank || '');

  // 密码修改区
  const pwdDiv = document.createElement('div');
  pwdDiv.style.cssText = 'border-top:1px solid #444;padding-top:1rem;margin-top:0.5rem;';
  const oldPwdInput = createInput('当前密码（如需修改密码必填）', '', 'password');
  const newPwdInput = createInput('新密码', '', 'password');
  pwdDiv.appendChild(oldPwdInput.wrapper);
  pwdDiv.appendChild(newPwdInput.wrapper);

  // 按钮区
  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;margin-top:1rem;';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '取消';
  cancelBtn.style.background = '#555';
  cancelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderProfileContent();
  });

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '保存';
  saveBtn.style.background = '#d9534f';
  saveBtn.addEventListener('click', async (e) => {
    e.stopPropagation();

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
  wrapper.appendChild(avatarInput.wrapper);
  wrapper.appendChild(schoolInput.wrapper);
  wrapper.appendChild(honorYearInput.wrapper);
  wrapper.appendChild(honorRankInput.wrapper);
  wrapper.appendChild(pwdDiv);
  wrapper.appendChild(btnGroup);

  container.appendChild(wrapper);
}

// 辅助函数
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
  // 输入框点击也不关闭面板
  wrapper.addEventListener('click', (e) => e.stopPropagation());
  return { wrapper, input };
}

// ========== 事件同步 ==========
document.addEventListener('profile-login', (e) => {
  try { state.user = e.detail; } catch (err) {}

  if (sessionStorage.getItem('pending_registration') === '1') {
    sessionStorage.removeItem('pending_registration');
    sessionStorage.setItem('just_registered', '1');
  }

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

// ========== 智能关闭：仅点击面板外部（且不触碰内部元素）才关闭 ==========
document.addEventListener('click', function (e) {
  const panel = document.getElementById('profile-panel');
  const btn = document.getElementById('btn-profile');
  if (!panel || !btn) return;
  if (panel.style.display === 'none') return;

  // 如果点击目标在面板内部，或点击了个人中心按钮，则不关闭
  if (panel.contains(e.target) || btn.contains(e.target)) {
    return;
  }
  // 如果点击目标或其祖先包含 data-keep-open 属性（编辑表单已加），也不关闭
  if (e.target.closest('[data-keep-open]')) {
    return;
  }
  // 其他情况：关闭面板
  panel.style.display = 'none';
});
