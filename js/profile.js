/* IWP profile - UI preserved, authentication moved to SiteAuth. */
(function () {
  'use strict';
  const fallbackAvatar = () => (window.CONFIG && CONFIG.DEFAULT_AVATAR) || 'images/0721.png';
  const auth = () => window.SiteAuth;
  const esc = (v) => { const d = document.createElement('div'); d.textContent = v == null ? '' : String(v); return d.innerHTML; };

  window.openProfile = function () { const panel = document.getElementById('profile-panel'); if (!panel) return; panel.style.display = 'block'; renderProfileContent(); };
  window.closeProfile = function () { const panel = document.getElementById('profile-panel'); if (panel) panel.style.display = 'none'; };

  async function renderProfileContent() {
    const box = document.getElementById('profile-content'); if (!box) return;
    box.innerHTML = '<div style="color:#888;text-align:center;padding:2rem;">加载中...</div>';
    const A = auth(); if (!A) { box.innerHTML = '<div style="color:#888;text-align:center;padding:2rem;">登录模块加载失败</div>'; return; }
    const u = A.getUser(); if (!u) return renderLoginForm(box);
    let user = u;
    try { const data = await A.request('/users/me'); user = Object.assign({}, u, data.user || {}); A.setUser(user); } catch (_) {}
    if (sessionStorage.getItem('just_registered') === '1') { sessionStorage.removeItem('just_registered'); return showEditForm(box, user); }

    box.innerHTML = '';
    const top = document.createElement('div'); top.style.textAlign = 'center';
    const avatar = document.createElement('img'); avatar.src = user.avatar || fallbackAvatar(); avatar.onerror = () => avatar.src = fallbackAvatar(); avatar.style.cssText = 'width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #555;';
    const name = document.createElement('div'); name.style.cssText = 'margin-top:0.6rem;font-size:1.4rem;font-weight:600;color:#fff;'; name.textContent = user.username || '匿名'; top.append(avatar, name);
    if (user.school) { const x = document.createElement('div'); x.style.cssText = 'margin-top:0.3rem;color:#aaa;font-size:0.9rem;'; x.textContent = '[学校] ' + user.school; top.appendChild(x); }
    if (user.honor_year || user.honor_rank) { const h = document.createElement('div'); h.style.cssText = 'display:flex;justify-content:center;gap:8px;margin-top:0.5rem;'; if (user.honor_year) { const b = document.createElement('span'); b.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem;'; b.textContent = '[年份] ' + user.honor_year; h.appendChild(b); } if (user.honor_rank) { const b = document.createElement('span'); b.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.8rem;'; b.textContent = '[等级] ' + user.honor_rank; h.appendChild(b); } top.appendChild(h); }
    box.appendChild(top);
    const bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:1.2rem;';
    const more = document.createElement('button'); more.textContent = '查看公开资料'; more.onclick = () => window.open('more.html?user=' + encodeURIComponent(user.username || ''), '_blank');
    const edit = document.createElement('button'); edit.textContent = '编辑资料'; edit.onclick = e => { e.stopPropagation(); showEditForm(box, user); };
    const logout = document.createElement('button'); logout.textContent = '退出登录'; logout.onclick = () => { A.logout(); renderProfileContent(); };
    bar.append(more, edit, logout); box.appendChild(bar);
    const info = document.createElement('div'); info.style.cssText = 'margin-top:1.5rem;padding:1rem;background:#2a2a2a;border-radius:8px;color:#ccc;'; info.innerHTML = '<div style="margin-bottom:0.5rem;"><strong>用户名：</strong>' + esc(user.username) + '</div>' + (user.email ? '<div style="margin-bottom:0.5rem;"><strong>邮箱：</strong>' + esc(user.email) + '</div>' : '') + (user.school ? '<div><strong>学校：</strong>' + esc(user.school) + '</div>' : ''); box.appendChild(info);
  }

  function renderLoginForm(box) {
    box.innerHTML = ''; const u = input('用户名', 'profile-login-user'), p = input('密码', 'profile-login-pass', 'password'); const bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:10px;';
    const login = document.createElement('button'); login.textContent = '登录'; login.onclick = async () => { if (!u.value.trim() || !p.value) return alert('请填写完整'); try { await auth().login(u.value.trim(), p.value); renderProfileContent(); } catch (e) { alert('登录失败：' + e.message); } };
    const reg = document.createElement('button'); reg.textContent = '注册'; reg.onclick = () => showRegisterForm(box, u.value.trim(), p.value); bar.append(login, reg); box.append(u.el, p.el, bar);
    const hint = document.createElement('div'); hint.style.cssText = 'margin-top:1rem;color:#888;font-size:0.9rem;'; hint.textContent = '登录后你会由一个人变成一个人'; box.appendChild(hint);
  }

  function showRegisterForm(box, username, password) {
    box.innerHTML = ''; const u = input('用户名', 'profile-reg-user'); u.value = username || ''; const p = input('密码', 'profile-reg-pass', 'password'); p.value = password || ''; const school = input('学校（可选）', 'profile-reg-school'); const year = input('年份（可选）', 'profile-reg-year'); const rank = input('等级（可选）', 'profile-reg-rank');
    const bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:10px;margin-top:0.5rem;'; const back = document.createElement('button'); back.textContent = '← 返回登录'; back.style.background = '#555'; back.onclick = () => renderLoginForm(box);
    const submit = document.createElement('button'); submit.textContent = '注册'; submit.style.background = '#d9534f'; submit.onclick = async () => { if (!u.value.trim() || !p.value) return alert('请填写用户名和密码'); try { await auth().register({ username:u.value.trim(), password:p.value, school:school.value.trim()||null, honor_year:year.value.trim()||null, honor_rank:rank.value.trim()||null }); sessionStorage.setItem('just_registered','1'); renderProfileContent(); } catch(e) { alert('注册失败：' + e.message); } };
    bar.append(back, submit); box.append(u.el,p.el,school.el,year.el,rank.el,bar);
  }

  function showEditForm(box, user) {
    box.innerHTML = ''; const wrap = document.createElement('div'); wrap.dataset.keepOpen = 'true'; wrap.onclick = e => e.stopPropagation(); const title = document.createElement('h3'); title.style.cssText = 'color:#fff;margin-bottom:1rem;'; title.textContent = '编辑资料'; wrap.appendChild(title);
    const avatar = input('头像 URL', user.avatar || ''), school = input('学校', user.school || ''), year = input('年份 (如 2025)', user.honor_year || ''), rank = input('等级 (如 省一)', user.honor_rank || ''); const oldPwd = input('当前密码（如需改密码必填）', '', 'password'), newPwd = input('新密码', '', 'password'); const pwd = document.createElement('div'); pwd.style.cssText = 'border-top:1px solid #444;padding-top:1rem;margin-top:0.5rem;'; pwd.append(oldPwd.el,newPwd.el);
    const bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;margin-top:1rem;'; const cancel = document.createElement('button'); cancel.textContent = '取消'; cancel.style.background='#555'; cancel.onclick = () => renderProfileContent(); const save = document.createElement('button'); save.textContent = '保存'; save.style.background='#d9534f';
    save.onclick = async () => { const payload={avatar:avatar.value.trim(),school:school.value.trim(),honor_year:year.value.trim(),honor_rank:rank.value.trim()}; if(newPwd.value){if(!oldPwd.value)return alert('请输入当前密码才能修改密码'); payload.old_password=oldPwd.value; payload.password=newPwd.value;} try{await auth().update(payload); alert('资料更新成功！'); renderProfileContent();}catch(e){alert('保存失败：'+e.message);} };
    bar.append(cancel,save); wrap.append(avatar.el,school.el,year.el,rank.el,pwd,bar); box.appendChild(wrap);
  }

  function input(labelText, id, type='text') { const el=document.createElement('div'); el.style.marginBottom='8px'; const label=document.createElement('label'); label.style.cssText='display:block;color:#ccc;margin-bottom:4px;font-size:0.9rem;'; label.textContent=labelText; const x=document.createElement('input'); x.type=type; x.id=id; x.style.cssText='width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;'; el.append(label,x); return {el,value:x}; }
  window.doLogout = function () { if (auth()) auth().logout(); };
  window.addEventListener('iwp-auth-changed', () => { const panel=document.getElementById('profile-panel'); if(panel && panel.style.display==='block') renderProfileContent(); });
  window.addEventListener('storage', e => { if(e.key==='iwp-user'){ const panel=document.getElementById('profile-panel'); if(panel && panel.style.display==='block') renderProfileContent(); } });
  document.addEventListener('click', function(e) { const panel=document.getElementById('profile-panel'); if(panel && panel.style.display==='block' && !panel.contains(e.target) && !e.target.closest('#btn-profile')) closeProfile(); });
})();
