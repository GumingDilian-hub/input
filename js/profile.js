/* ========== 独立个人中心模块 ========== */
const PROFILE_API = 'https://woxiangcaoni.2167964516.workers.dev'; // 替换为你的 Worker 地址

let profileUser = null;

// ========== 工具 ==========
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function profileFetch(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`Fetch Error [${url}]:`, error);
        return null;
    }
}

// ========== 初始化 ==========
function initProfile() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) {
        try { profileUser = JSON.parse(saved); } catch(e) { localStorage.removeItem('iwp-user'); }
    }
    updateProfileButton();
}

// ========== 工具栏按钮更新 ==========
function updateProfileButton() {
    const btn = document.getElementById('btn-profile');
    if (!btn) return;
    if (profileUser) {
        btn.textContent = `👤 ${profileUser.username}`;
        btn.style.display = 'inline-block';
    } else {
        btn.textContent = '登录';
        btn.style.display = 'inline-block';
    }
}

// ========== 打开/关闭个人中心 ==========
function openProfile() {
    const panel = document.getElementById('profile-panel');
    if (!panel) return;
    panel.style.display = 'block';
    renderProfile();
}

function closeProfile() {
    const panel = document.getElementById('profile-panel');
    if (panel) panel.style.display = 'none';
}

// ========== 渲染个人中心内容 ==========
async function renderProfile() {
    const container = document.getElementById('profile-content');
    if (!container) return;

    if (!profileUser) {
        container.innerHTML = `
            <div style="text-align:center; padding:1rem 0;">
                <p style="color:#aaa; font-size:1.1rem;">请先登录</p>
                <div style="margin-top:1.5rem;">
                    <input type="text" id="profile-login-user" placeholder="用户名" style="width:80%; padding:10px; margin-bottom:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px;">
                    <input type="password" id="profile-login-pass" placeholder="密码" style="width:80%; padding:10px; margin-bottom:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px;">
                    <button onclick="profileDoLogin()" style="background:#000; color:#fff; border:1px solid #333; padding:10px 30px; border-radius:4px; cursor:pointer; font-size:1rem;">登录</button>
                    <button onclick="profileShowRegister()" style="background:transparent; color:#88b4e6; border:none; cursor:pointer; margin-left:10px; font-size:0.9rem;">注册</button>
                </div>
            </div>
        `;
        return;
    }

    // 已登录：获取用户信息
    const data = await profileFetch(`${PROFILE_API}/users/me`, {
        headers: { 'Authorization': `Bearer ${profileUser.token}` }
    });
    if (!data || !data.user) {
        container.innerHTML = '<div style="color:#888; text-align:center; padding:2rem 0;">获取信息失败</div>';
        return;
    }
    const u = data.user;

    container.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
            <img src="${u.avatar || 'images/0721.png'}" style="width:80px; height:80px; border-radius:50%; border:2px solid #555; object-fit:cover;" onerror="this.src='images/0721.png'">
            <h2 style="color:#eee; margin:0.5rem 0 0.2rem;">${escapeHtml(u.username)}</h2>
            <div style="color:#aaa; font-size:0.9rem;">${escapeHtml(u.honor_year || '')} ${escapeHtml(u.honor_rank || '')}</div>
            <div style="color:#888; font-size:0.9rem;">${escapeHtml(u.school || '')}</div>
        </div>
        <div style="margin-top:1rem;">
            <div style="display:flex; align-items:center; border-bottom:1px solid #333; padding:8px 0;">
                <span style="color:#888; width:80px;">头像</span>
                <input type="text" id="profile-edit-avatar" value="${escapeHtml(u.avatar || '')}" placeholder="图片链接" style="flex:1; margin-left:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px; padding:6px 10px;">
            </div>
            <div style="display:flex; align-items:center; border-bottom:1px solid #333; padding:8px 0;">
                <span style="color:#888; width:80px;">用户名</span>
                <input type="text" id="profile-edit-username" value="${escapeHtml(u.username)}" style="flex:1; margin-left:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px; padding:6px 10px;">
            </div>
            <div style="display:flex; align-items:center; border-bottom:1px solid #333; padding:8px 0;">
                <span style="color:#888; width:80px;">新密码</span>
                <input type="password" id="profile-edit-password" placeholder="留空不修改" style="flex:1; margin-left:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px; padding:6px 10px;">
            </div>
            <div style="display:flex; align-items:center; border-bottom:1px solid #333; padding:8px 0;">
                <span style="color:#888; width:80px;">学校</span>
                <input type="text" id="profile-edit-school" value="${escapeHtml(u.school || '')}" style="flex:1; margin-left:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px; padding:6px 10px;">
            </div>
            <div style="display:flex; align-items:center; border-bottom:1px solid #333; padding:8px 0;">
                <span style="color:#888; width:80px;">荣誉年份</span>
                <input type="text" id="profile-edit-year" value="${escapeHtml(u.honor_year || '')}" style="flex:1; margin-left:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px; padding:6px 10px;">
            </div>
            <div style="display:flex; align-items:center; border-bottom:1px solid #333; padding:8px 0;">
                <span style="color:#888; width:80px;">荣誉等级</span>
                <input type="text" id="profile-edit-rank" value="${escapeHtml(u.honor_rank || '')}" style="flex:1; margin-left:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px; padding:6px 10px;">
            </div>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:1.5rem; gap:10px;">
            <button onclick="profileSave()" style="background:#000; color:#fff; border:1px solid #333; padding:8px 20px; border-radius:4px; cursor:pointer;">保存修改</button>
            <button onclick="profileLogout()" style="background:#333; color:#fff; border:1px solid #555; padding:8px 20px; border-radius:4px; cursor:pointer;">退出登录</button>
        </div>
    `;
}

// ========== 登录 ==========
async function profileDoLogin() {
    const u = document.getElementById('profile-login-user')?.value.trim();
    const p = document.getElementById('profile-login-pass')?.value;
    if (!u || !p) return alert('请填写完整');

    const data = await profileFetch(`${PROFILE_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });

    if (data && data.token) {
        profileUser = { username: u, token: data.token };
        localStorage.setItem('iwp-user', JSON.stringify(profileUser));
        renderProfile();
        updateProfileButton();
        // 触发自定义事件，通知其他模块（如评论区）更新
        document.dispatchEvent(new CustomEvent('profile-login', { detail: profileUser }));
        alert('登录成功');
    } else {
        alert('登录失败');
    }
}

// ========== 显示注册界面 ==========
function profileShowRegister() {
    const container = document.getElementById('profile-content');
    container.innerHTML = `
        <div style="text-align:center; padding:1rem 0;">
            <p style="color:#aaa; font-size:1.1rem;">注册新账号</p>
            <div style="margin-top:1.5rem;">
                <input type="text" id="profile-reg-user" placeholder="用户名" style="width:80%; padding:10px; margin-bottom:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px;">
                <input type="password" id="profile-reg-pass" placeholder="密码" style="width:80%; padding:10px; margin-bottom:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px;">
                <input type="password" id="profile-reg-pass2" placeholder="确认密码" style="width:80%; padding:10px; margin-bottom:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px;">
                <input type="text" id="profile-reg-school" placeholder="学校（可选）" style="width:80%; padding:10px; margin-bottom:10px; background:#111; color:#ddd; border:1px solid #444; border-radius:4px;">
                <button onclick="profileDoRegister()" style="background:#000; color:#fff; border:1px solid #333; padding:10px 30px; border-radius:4px; cursor:pointer; font-size:1rem;">注册</button>
                <button onclick="renderProfile()" style="background:transparent; color:#88b4e6; border:none; cursor:pointer; margin-left:10px;">返回登录</button>
            </div>
        </div>
    `;
}

// ========== 注册 ==========
async function profileDoRegister() {
    const u = document.getElementById('profile-reg-user')?.value.trim();
    const p = document.getElementById('profile-reg-pass')?.value;
    const p2 = document.getElementById('profile-reg-pass2')?.value;
    const school = document.getElementById('profile-reg-school')?.value.trim();
    if (!u || !p) return alert('请填写用户名和密码');
    if (p !== p2) return alert('两次密码不一致');

    const data = await profileFetch(`${PROFILE_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p, school })
    });

    if (data && data.token) {
        profileUser = { username: u, token: data.token };
        localStorage.setItem('iwp-user', JSON.stringify(profileUser));
        renderProfile();
        updateProfileButton();
        document.dispatchEvent(new CustomEvent('profile-login', { detail: profileUser }));
        alert('注册成功！');
    } else {
        alert('注册失败，可能用户名已存在');
    }
}

// ========== 保存修改 ==========
async function profileSave() {
    if (!profileUser) return alert('请先登录');
    const avatar = document.getElementById('profile-edit-avatar')?.value.trim();
    const username = document.getElementById('profile-edit-username')?.value.trim();
    const password = document.getElementById('profile-edit-password')?.value.trim();
    const school = document.getElementById('profile-edit-school')?.value.trim();
    const honor_year = document.getElementById('profile-edit-year')?.value.trim();
    const honor_rank = document.getElementById('profile-edit-rank')?.value.trim();

    const payload = {};
    if (avatar) payload.avatar = avatar;
    if (username && username !== profileUser.username) payload.username = username;
    if (password) payload.password = password;
    if (school) payload.school = school;
    if (honor_year) payload.honor_year = honor_year;
    if (honor_rank) payload.honor_rank = honor_rank;

    if (Object.keys(payload).length === 0) {
        alert('没有修改任何内容');
        return;
    }

    const data = await profileFetch(`${PROFILE_API}/users/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${profileUser.token}`
        },
        body: JSON.stringify(payload)
    });

    if (data && data.user) {
        if (data.user.username && data.user.username !== profileUser.username) {
            profileUser.username = data.user.username;
            localStorage.setItem('iwp-user', JSON.stringify(profileUser));
        }
        alert('修改成功！');
        renderProfile();
        updateProfileButton();
    } else {
        alert('修改失败');
    }
}

// ========== 退出登录 ==========
function profileLogout() {
    profileUser = null;
    localStorage.removeItem('iwp-user');
    renderProfile();
    updateProfileButton();
    document.dispatchEvent(new CustomEvent('profile-logout'));
    closeProfile();
}

// ========== 获取当前用户（供其他模块使用） ==========
function getProfileUser() {
    return profileUser;
}

// ========== 暴露全局 ==========
window.profileUser = profileUser;
window.initProfile = initProfile;
window.openProfile = openProfile;
window.closeProfile = closeProfile;
window.renderProfile = renderProfile;
window.profileDoLogin = profileDoLogin;
window.profileDoRegister = profileDoRegister;
window.profileShowRegister = profileShowRegister;
window.profileSave = profileSave;
window.profileLogout = profileLogout;
window.getProfileUser = getProfileUser;
window.updateProfileButton = updateProfileButton;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initProfile);
