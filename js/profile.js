/* ========== profile.js (稳定版：单一状态源) ========== */
/* 依赖：reader.js 提供 $, CONFIG, state, escapeHtml, safeFetch, doLogin, doRegister, doLogout */

const PROFILE_API = 'https://copilot.2167964516.workers.dev';

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

  // 直接从 state.user 读取，不再调用任何外部函数
  if (!state.user) {
    renderLoginForm(container);
    return;
  }

  let fullUser = null;
  try {
    const res = await safeFetch(`${PROFILE_API}/users/me`, {
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
    e.stopPropagation();
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
  loginBtn.addEventListener('click', async () => {
    const u = document.getElementById('profile-login-user')?.value.trim();
    const p = document.getElementById('profile-login-pass')?.value;
    if (!u || !p) return alert('请填写完整');
    const data = await safeFetch(`${PROFILE_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    });
    if (data && data.token) {
      state.user = { username: u, token: data.token };
      localStorage.setItem('iwp-user', JSON.stringify(state.user));
      try { window.profileUser = state.user; } catch (e) {}
      document.dispatchEvent(new CustomEvent('profile-login', { detail: state.user }));
      renderProfileContent();
    } else {
      alert('登录失败：' + (data?.error || '未知错误'));
    }
  });

  const regBtn = document.createElement('button');
  regBtn.textContent = '注册';
  regBtn.addEventListener('click', () => {
    const u = document.getElementById('profile-login-user')?.value.trim();
    const p = document.getElementById('profile-login-pass')?.value;
    if (!u || !p) return alert('请填写完整');
    // 切换到注册模式
    showRegisterForm(container, u, p);
  });

  btnGroup.appendChild(loginBtn);
  btnGroup.appendChild(regBtn);

  container.appendChild(userInput);
  container.appendChild(passInput);
  container.appendChild(btnGroup);

  const hint = document.createElement('div');
  hint.style.cssText = 'margin-top:1rem;color:#888;font-size:0.9rem;';
  hint.textContent = '登录后你会由一个人变成一个人';
  container.appendChild(hint);
}

function showRegisterForm(container, username, password) {
  container.innerHTML = '';

  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.placeholder = '用户名';
  userInput.id = 'profile-reg-user';
  userInput.value = username || '';

  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.placeholder = '密码';
  passInput.id = 'profile-reg-pass';
  passInput.value = password || '';

  const schoolInput = document.createElement('input');
  schoolInput.type = 'text';
  schoolInput.placeholder = '学校（可选）';
  schoolInput.id = 'profile-reg-school';

  const honorYearInput = document.createElement('input');
  honorYearInput.type = 'text';
  honorYearInput.placeholder = '年份（可选）';
  honorYearInput.id = 'profile-reg-year';

  const honorRankInput = document.createElement('input');
  honorRankInput.type = 'text';
  honorRankInput.placeholder = '等级（可选）';
  honorRankInput.id = 'profile-reg-rank';

  const btnGroup = document.createElement('div');
  btnGroup.style.cssText = 'display:flex;gap:10px;margin-top:0.5rem;';

  const backBtn = document.createElement('button');
  backBtn.textContent = '← 返回登录';
  backBtn.style.background = '#555';
  backBtn.addEventListener('click', () => renderLoginForm(container));

  const regBtn = document.createElement('button');
  regBtn.textContent = '注册';
  regBtn.style.background = '#d9534f';
  regBtn.addEventListener('click', async () => {
    const u = document.getElementById('profile-reg-user')?.value.trim();
    const p = document.getElementById('profile-reg-pass')?.value;
    const school = document.getElementById('profile-reg-school')?.value.trim() || null;
    const honor_year = document.getElementById('profile-reg-year')?.value.trim() || null;
    const honor_rank = document.getElementById('profile-reg-rank')?.value.trim() || null;
    if (!u || !p) return alert('请填写用户名和密码');
    const data = await safeFetch(`${PROFILE_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p, school, honor_year, honor_rank })
    });
    if (data && data.token) {
      state.user = { username: u, token: data.token };
      localStorage.setItem('iwp-user', JSON.stringify(state.user));
      try { window.profileUser = state.user; } catch (e) {}
      sessionStorage.setItem('just_registered', '1');
      document.dispatchEvent(new CustomEvent('profile-login', { detail: state.user }));
      renderProfileContent();
    } else {
      alert('注册失败：' + (data?.error || '未知错误'));
    }
  });

  btnGroup.appendChild(backBtn);
  btnGroup.appendChild(regBtn);

  container.appendChild(userInput);
  container.appendChild(passInput);
  container.appendChild(schoolInput);
  container.appendChild(honorYearInput);
  container.appendChild(honorRankInput);
  container.appendChild(btnGroup);
}

// ========== 编辑资料表单 ==========
function showEditForm(container, user) {
  container.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-keep-open', 'true');
  wrapper.addEventListener('click', (e) => e.stopPropagation());

  const title = document.createElement('h3');
  title.style.cssText = 'color:#fff;margin-bottom:1rem;';
  title.textContent = '编辑资料';
  wrapper.appendChild(title);

  const avatarInput = createInput('头像 URL', user.avatar || '');
  const schoolInput = createInput('学校', user.school || '');
  const honorYearInput = createInput('年份 (如 2025)', user.honor_year || '');
  const honorRankInput = createInput('等级 (如 省一)', user.honor_rank || '');

  const pwdDiv = document.createElement('div');
  pwdDiv.style.cssText = 'border-top:1px solid #444;padding-top:1rem;margin-top:0.5rem;';
  const oldPwdInput = createInput('当前密码（如需改密码必填）', '', 'password');
  const newPwdInput = createInput('新密码', '', 'password');
  pwdDiv.appendChild(oldPwdInput.wrapper);
  pwdDiv.appendChild(newPwdInput.wrapper);

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
      const res = await safeFetch(`${PROFILE_API}/users/me`, {
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

  wrapper.appendChild(avatarInput.wrapper);
  wrapper.appendChild(schoolInput.wrapper);
  wrapper.appendChild(honorYearInput.wrapper);
  wrapper.appendChild(honorRankInput.wrapper);
  wrapper.appendChild(pwdDiv);
  wrapper.appendChild(btnGroup);

  container.appendChild(wrapper);
}

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
  wrapper.addEventListener('click', (e) => e.stopPropagation());
  return { wrapper, input };
}

// ========== 事件同步 ==========
// 登录/登出事件只用于通知其他模块，profile.js 自身不再做状态覆盖
document.addEventListener('profile-login', (e) => {
  // Copilot 或其他模块监听此事件更新 UI
  // profile.js 自身不再重新读取状态
});

document.addEventListener('profile-logout', () => {
  // Copilot 或其他模块监听此事件更新 UI
  // profile.js 自身不再重新读取状态
});

window.addEventListener('storage', (e) => {
  if (e.key === 'iwp-user') {
    try { state.user = e.newValue ? JSON.parse(e.newValue) : null; } catch (err) { state.user = null; }
    if ($('#profile-panel')?.style.display === 'block') renderProfileContent();
  }
});

// ========== 面板关闭逻辑 ==========
document.addEventListener('click', function(e) {
  const panel = document.getElementById('profile-panel');
  const btn = document.getElementById('btn-profile');
  if (!panel || !btn) return;
  if (panel.style.display === 'none') return;
  if (panel.contains(e.target) || btn.contains(e.target)) return;
  if (e.target.closest('[data-keep-open]')) return;
  panel.style.display = 'none';
});
