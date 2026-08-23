/* IWP Auth - independent auth/session bridge. Keeps existing UI state compatible. */
(function () {
  'use strict';
  const API = 'https://copilot.2167964516.workers.dev';
  const KEY = 'iwp-user';
  let user = null;

  function read() {
    try { user = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { user = null; }
    return user;
  }
  function write(next) {
    user = next || null;
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
    try { if (typeof state !== 'undefined') state.user = user; } catch (_) {}
    window.dispatchEvent(new CustomEvent('iwp-auth-changed', { detail: user }));
    document.dispatchEvent(new CustomEvent(user ? 'profile-login' : 'profile-logout', { detail: user }));
  }
  async function request(path, options) {
    const opts = Object.assign({}, options || {}, { headers: Object.assign({}, (options && options.headers) || {}) });
    const token = getToken();
    if (token) opts.headers.Authorization = 'Bearer ' + token;
    if (opts.body && typeof opts.body !== 'string') {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(API + path, opts);
    let data = null;
    try { data = await res.json(); } catch (_) { data = {}; }
    if (res.status === 401) write(null);
    if (!res.ok) { const e = new Error(data.error || ('HTTP ' + res.status)); e.status = res.status; e.data = data; throw e; }
    return data;
  }
  function getToken() { const u = user || read(); return u && u.token || null; }
  async function validate() {
    read();
    if (!user || !user.token) return null;
    try {
      const data = await request('/users/me', { method: 'GET' });
      if (data.user) write(Object.assign({}, user, data.user));
      return user;
    } catch (_) { return null; }
  }
  async function login(username, password) {
    const data = await request('/login', { method: 'POST', body: { username, password } });
    write({ username: data.username || username, token: data.token });
    await validate();
    return user;
  }
  async function register(payload) {
    const data = await request('/register', { method: 'POST', body: payload });
    write({ username: data.username || payload.username, token: data.token });
    await validate();
    return user;
  }
  async function update(payload) {
    const data = await request('/users/me', { method: 'PUT', body: payload });
    write(Object.assign({}, user, data.user || {}, data.token ? { token: data.token } : {}));
    return data;
  }
  function logout() { write(null); }
  window.SiteAuth = { API, read, getUser: () => user || read(), getToken, request, validate, login, register, update, logout, setUser: write };
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) {
      read();
      try { if (typeof state !== 'undefined') state.user = user; } catch (_) {}
      window.dispatchEvent(new CustomEvent('iwp-auth-changed', { detail: user }));
    }
  });
  read();
  try { if (typeof state !== 'undefined') state.user = user; } catch (_) {}
})();
