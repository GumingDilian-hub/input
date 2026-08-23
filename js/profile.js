/* IWP Profile — same profile-panel UI, unified directly with the Worker. */
(function () {
    'use strict';
    const API = 'https://copilot.2167964516.workers.dev';
    const KEY = 'iwp-user';
    const DEFAULT_AVATAR = 'images/0721.png';

    function getUser() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } }
    function setUser(user) {
        if (user) localStorage.setItem(KEY, JSON.stringify(user)); else localStorage.removeItem(KEY);
        try { if (typeof state !== 'undefined') state.user = user || null; } catch (_) {}
        window.profileUser = user || null;
        window.dispatchEvent(new CustomEvent('iwp-auth-changed', { detail: user || null }));
        document.dispatchEvent(new CustomEvent(user ? 'profile-login' : 'profile-logout', { detail: user || null }));
    }
    function token() { return getUser()?.token || null; }
    async function request(path, options = {}) {
        const headers = Object.assign({}, options.headers || {}), t = token();
        if (t) headers.Authorization = 'Bearer ' + t;
        if (options.body && typeof options.body !== 'string') { headers['Content-Type'] = 'application/json'; options = Object.assign({}, options, { body: JSON.stringify(options.body) }); }
        const res = await fetch(API + path, Object.assign({}, options, { headers }));
        const text = await res.text(); let data = {};
        try { data = JSON.parse(text); } catch (_) {}
        if (!res.ok) { if (res.status === 401) setUser(null); const e = new Error(data.error || ('HTTP ' + res.status)); e.status = res.status; e.data = data; throw e; }
        return data;
    }
    function escape(value) { const node = document.createElement('div'); node.textContent = value == null ? '' : String(value); return node.innerHTML; }
    function input(label, value, type = 'text') {
        const wrap = document.createElement('div'); wrap.style.marginBottom = '8px';
        const labelNode = document.createElement('label'); labelNode.textContent = label; labelNode.style.cssText = 'display:block;color:#ccc;margin-bottom:4px;font-size:.9rem;';
        const field = document.createElement('input'); field.type = type; field.value = value || ''; field.style.cssText = 'width:100%;padding:8px;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;box-sizing:border-box;';
        wrap.append(labelNode, field); return { wrap, field };
    }
    window.openProfile = function () { const panel = document.getElementById('profile-panel'); if (!panel) return; panel.style.display = 'block'; render(); };
    window.closeProfile = function () { const panel = document.getElementById('profile-panel'); if (panel) panel.style.display = 'none'; };

    async function render() {
        const box = document.getElementById('profile-content'); if (!box) return;
        box.innerHTML = '<div style="color:#888;text-align:center;padding:2rem;">加载中...</div>';
        let user = getUser();
        if (!user?.token) return renderLogin(box);
        try {
            const data = await request('/users/me'); user = Object.assign({}, user, data.user || {}); if (data.token) user.token = data.token; setUser(user);
        } catch (e) {
            if (e.status === 401) return renderLogin(box);
            box.innerHTML = '<div style="color:#888;text-align:center;padding:2rem;">加载失败：' + escape(e.message) + '</div>'; return;
        }
        if (sessionStorage.getItem('just_registered') === '1') { sessionStorage.removeItem('just_registered'); return renderEdit(box, user); }
        box.innerHTML = '';
        const top = document.createElement('div'); top.style.textAlign = 'center';
        const avatar = document.createElement('img'); avatar.src = user.avatar || DEFAULT_AVATAR; avatar.onerror = () => { avatar.src = DEFAULT_AVATAR; }; avatar.style.cssText = 'width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #555;';
        const name = document.createElement('div'); name.textContent = user.username || '匿名'; name.style.cssText = 'margin-top:.6rem;font-size:1.4rem;font-weight:600;color:#fff;'; top.append(avatar, name);
        if (user.school) { const school = document.createElement('div'); school.textContent = '[学校] ' + user.school; school.style.cssText = 'margin-top:.3rem;color:#aaa;font-size:.9rem;'; top.appendChild(school); }
        if (user.honor_year || user.honor_rank) { const honors = document.createElement('div'); honors.style.cssText = 'display:flex;justify-content:center;gap:8px;margin-top:.5rem;'; if (user.honor_year) honors.appendChild(badge('[年份] ' + user.honor_year)); if (user.honor_rank) honors.appendChild(badge('[等级] ' + user.honor_rank)); top.appendChild(honors); }
        box.appendChild(top);
        const actions = document.createElement('div'); actions.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:1.2rem;';
        const publicButton = document.createElement('button'); publicButton.textContent = '查看公开资料'; publicButton.onclick = () => { location.href = 'more.html?user=' + encodeURIComponent(user.username || ''); };
        const editButton = document.createElement('button'); editButton.textContent = '编辑资料'; editButton.onclick = () => renderEdit(box, user);
        const logoutButton = document.createElement('button'); logoutButton.textContent = '退出登录'; logoutButton.onclick = () => { if (typeof window.doLogout === 'function') window.doLogout(); else setUser(null); render(); };
        actions.append(publicButton, editButton, logoutButton); box.appendChild(actions);
        const info = document.createElement('div'); info.style.cssText = 'margin-top:1.5rem;padding:1rem;background:#2a2a2a;border-radius:8px;color:#ccc;';
        info.innerHTML = '<div style="margin-bottom:.5rem;"><strong>用户名：</strong>' + escape(user.username) + '</div>' + (user.school ? '<div style="margin-bottom:.5rem;"><strong>学校：</strong>' + escape(user.school) + '</div>' : '') + (user.honor_year ? '<div style="margin-bottom:.5rem;"><strong>年份：</strong>' + escape(user.honor_year) + '</div>' : '') + (user.honor_rank ? '<div><strong>等级：</strong>' + escape(user.honor_rank) + '</div>' : '');
        box.appendChild(info);
    }
    function badge(text) { const node = document.createElement('span'); node.textContent = text; node.style.cssText = 'background:#d9534f;color:#fff;padding:2px 8px;border-radius:4px;font-size:.8rem;'; return node; }

    function renderLogin(box) {
        box.innerHTML = ''; const username = input('用户名', ''), password = input('密码', '', 'password'), actions = document.createElement('div'); actions.style.cssText = 'display:flex;gap:10px;';
        const login = document.createElement('button'); login.textContent = '登录';
        login.onclick = async () => { if (!username.field.value.trim() || !password.field.value) return alert('请填写完整'); try { const data = await request('/login', { method: 'POST', body: { username: username.field.value.trim(), password: password.field.value } }); setUser({ username: data.username || username.field.value.trim(), token: data.token }); render(); } catch (e) { alert('登录失败：' + e.message); } };
        const register = document.createElement('button'); register.textContent = '注册'; register.onclick = () => renderRegister(box, username.field.value.trim(), password.field.value); actions.append(login, register); box.append(username.wrap, password.wrap, actions);
    }
    function renderRegister(box, usernameValue, passwordValue) {
        box.innerHTML = ''; const username = input('用户名', usernameValue), password = input('密码', passwordValue, 'password'), school = input('学校（可选）', ''), year = input('年份（可选）', ''), rank = input('等级（可选）', '');
        const actions = document.createElement('div'); actions.style.cssText = 'display:flex;gap:10px;margin-top:.5rem;';
        const back = document.createElement('button'); back.textContent = '← 返回登录'; back.style.background = '#555'; back.onclick = () => renderLogin(box);
        const submit = document.createElement('button'); submit.textContent = '注册'; submit.style.background = '#d9534f';
        submit.onclick = async () => { if (!username.field.value.trim() || !password.field.value) return alert('请填写用户名和密码'); try { const data = await request('/register', { method:'POST', body:{ username:username.field.value.trim(), password:password.field.value, school:school.field.value.trim()||null, honor_year:year.field.value.trim()||null, honor_rank:rank.field.value.trim()||null } }); setUser({ username:data.username||username.field.value.trim(), token:data.token }); sessionStorage.setItem('just_registered','1'); render(); } catch(e) { alert('注册失败：' + e.message); } };
        actions.append(back, submit); box.append(username.wrap, password.wrap, school.wrap, year.wrap, rank.wrap, actions);
    }
    function renderEdit(box, user) {
        box.innerHTML = ''; const wrap = document.createElement('div'); wrap.onclick = e => e.stopPropagation();
        const title = document.createElement('h3'); title.textContent = '编辑资料'; title.style.cssText = 'color:#fff;margin-bottom:1rem;'; wrap.appendChild(title);
        const avatar=input('头像 URL',user.avatar||''),school=input('学校',user.school||''),year=input('年份',user.honor_year||''),rank=input('等级',user.honor_rank||''),oldPassword=input('当前密码（修改密码时必填）','','password'),newPassword=input('新密码','','password');
        const passwordBlock=document.createElement('div'); passwordBlock.style.cssText='border-top:1px solid #444;padding-top:1rem;margin-top:.5rem;'; passwordBlock.append(oldPassword.wrap,newPassword.wrap);
        const actions=document.createElement('div'); actions.style.cssText='display:flex;gap:10px;justify-content:flex-end;margin-top:1rem;';
        const cancel=document.createElement('button'); cancel.textContent='取消'; cancel.style.background='#555'; cancel.onclick=()=>render();
        const save=document.createElement('button'); save.textContent='保存'; save.style.background='#d9534f';
        save.onclick=async()=>{const payload={avatar:avatar.field.value.trim()||null,school:school.field.value.trim()||null,honor_year:year.field.value.trim()||null,honor_rank:rank.field.value.trim()||null};if(newPassword.field.value){if(!oldPassword.field.value)return alert('请输入当前密码才能修改密码');payload.old_password=oldPassword.field.value;payload.password=newPassword.field.value;}try{const data=await request('/users/me',{method:'PUT',body:payload});setUser(Object.assign({},getUser(),data.user||{},data.token?{token:data.token}:{}));alert('资料更新成功！');render();}catch(e){alert('保存失败：'+e.message);}};
        actions.append(cancel,save); wrap.append(avatar.wrap,school.wrap,year.wrap,rank.wrap,passwordBlock,actions); box.appendChild(wrap);
    }

    window.addEventListener('iwp-auth-changed', () => { const panel=document.getElementById('profile-panel'); if(panel?.style.display==='block') render(); });
    document.addEventListener('profile-login', () => { const panel=document.getElementById('profile-panel'); if(panel?.style.display==='block') render(); });
    document.addEventListener('profile-logout', () => { const panel=document.getElementById('profile-panel'); if(panel?.style.display==='block') render(); });
    window.addEventListener('storage', e => { if(e.key!==KEY)return; const panel=document.getElementById('profile-panel'); if(panel?.style.display==='block')render(); });
    document.addEventListener('click', e => { const panel=document.getElementById('profile-panel'); if(panel?.style.display==='block'&&!panel.contains(e.target)&&!e.target.closest('#btn-profile'))window.closeProfile(); });
})();
