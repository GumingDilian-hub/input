export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
        if (request.method === 'OPTIONS') return new Response(null, { headers });

        const path = url.pathname;
        const method = request.method;

        // 注册
        if (path === '/register' && method === 'POST') {
            const { username, password } = await request.json();
            if (!username || !password) return json({ error: 'Missing fields' }, 400);
            const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
            if (existing) return json({ error: '用户名已存在' }, 409);
            const hash = await sha256(password);
            await env.DB.prepare('INSERT INTO users (username, password) VALUES (?, ?)').bind(username, hash).run();
            const token = btoa(username + ':' + Date.now());
            await env.DB.prepare('UPDATE users SET token = ? WHERE username = ?').bind(token, username).run();
            return json({ token, username });
        }

        // 登录
        if (path === '/login' && method === 'POST') {
            const { username, password } = await request.json();
            const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
            if (!user || user.password !== await sha256(password)) return json({ error: '用户名或密码错误' }, 401);
            const token = btoa(username + ':' + Date.now());
            await env.DB.prepare('UPDATE users SET token = ? WHERE username = ?').bind(token, username).run();
            return json({ token, username });
        }

        // 发表评论
        if (path === '/comments' && method === 'POST') {
            const auth = request.headers.get('Authorization') || '';
            const token = auth.replace('Bearer ', '');
            const user = await env.DB.prepare('SELECT * FROM users WHERE token = ?').bind(token).first();
            if (!user) return json({ error: '未登录' }, 401);
            const { section, content } = await request.json();
            if (!section || !content) return json({ error: 'Missing fields' }, 400);
            await env.DB.prepare('INSERT INTO comments (section, username, content) VALUES (?, ?, ?)').bind(section, user.username, content).run();
            return json({ success: true });
        }

        // 获取评论（分页）
        if (path === '/comments' && method === 'GET') {
            const section = url.searchParams.get('section');
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 10;
            const offset = (page - 1) * limit;
            const total = (await env.DB.prepare('SELECT COUNT(*) as count FROM comments WHERE section = ?').bind(section).first()).count;
            const comments = await env.DB.prepare('SELECT id, section, username, content, likes, created_at FROM comments WHERE section = ? ORDER BY created_at ASC LIMIT ? OFFSET ?').bind(section, limit, offset).all();
            const avatars = {};
            for (const c of comments.results) {
                if (!avatars[c.username]) {
                    const u = await env.DB.prepare('SELECT avatar FROM users WHERE username = ?').bind(c.username).first();
                    avatars[c.username] = u ? u.avatar : 'images/0721.png';
                }
                c.avatar = avatars[c.username];
            }
            return json({ comments: comments.results, total, page, limit });
        }

        // 点赞
        if (path.match(/^\/comments\/(\d+)\/like$/) && method === 'POST') {
            const commentId = parseInt(path.split('/')[2]);
            await env.DB.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').bind(commentId).run();
            return json({ success: true });
        }

        return new Response('Not found', { status: 404, headers });
    }
};

function json(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
