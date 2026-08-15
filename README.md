# IWP inputwenben please 请输入文本

[![Website](https://img.shields.io/badge/gumingdilian--hub.github.io%2Finput-F8B8C8?style=for-the-badge)](https://gumingdilian-hub.github.io/input/)

![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey)
![Status](https://img.shields.io/badge/status-updating-lightgrey)

作者 cz 河北廊坊生人，衡水二中熟人，2025 届生物竞赛省一。

本仓库收录了生物竞赛完整笔记，涵盖生物化学、细胞生物学、动物生理学、遗传学、进化生物学、生态行为、生物信息学等核心模块，以及高等数学、Linux 命令行等扩展内容。笔记质量介于神与屎之间，既有大量屎总结，也包含对你的喜爱❤️。

暂不考虑参加万国展览会，诺贝尔文学奖，诺贝尔生理学或医学奖

## 内容目录

- **生物化学** 
- **细胞生物学** 
- **动物生理学** 
- **遗传学** 
- **分子生物学** 
- **进化生物学**
- **生态行为** 
- **生物信息学** 
- **高等数学** 
- **微生物学**
- **免疫学** 

## 阅读须知

- 要是需要Word版，请访问，尽量使用金山文档，避免排版问题，无论如何也要使用金山系软件打开，edge，chorme，Firefox大概率有问题。更新不及时是必然的，想看什么私信我即可，这个网站大概率我会一直用到研究生毕业
- **金山文档**  [![WPS文档](https://img.shields.io/badge/📄-WPS云盘-F8B8C8?style=flat&logo=wps&logoColor=white)](https://www.kdocs.cn/l/cpfoz8aFZG1W)
- **微软云盘**  [![Word文档](https://img.shields.io/badge/📄-OneDrive-F8B8C8?style=flat&logo=microsoftword&logoColor=white)](https://1drv.ms/w/c/E80A9C3926A748E4/IQDY1QmwfksZTLGkeJNP5R2aAQp-wJraOPEXENFudMulza4)
- **百度网盘**  [![百度网盘](https://img.shields.io/badge/📄-百度网盘-F8B8C8?style=flat&logo=link&logoColor=white)](https://pan.baidu.com/s/1OkC4QJYL8HxJoa-0FbjfBw) 提取码:7i0f
- **夸克网盘**  [![夸克网盘](https://img.shields.io/badge/📄-夸克网盘-F8B8C8?style=flat&logo=link&logoColor=white)](https://pan.quark.cn/s/705378c1f4bf)
- 下下来尽量使用WPS**汉仪书宋二简**
- 电子版推荐字体：**Word版务必使用汉仪书宋二简**（打印务必切换，版权归北京汉仪科印信息技术有限公司所有）
- 本文档开源协议：**CC BY-NC-SA 4.0**,不遵守小心我拿神威无敌大将军炮轰似你

## 联系方式

- WeChat：15530600783
- Email：2167964516@qq.com
- Gmail：mahirooyama@gmail.com
- GitHub：[gumingdilian-hub](https://github.com/GumingDilian-hub)

## 主播主播，我也想用这个网站写笔记怎么办

- 有的兄弟有的，我们这个笔记和网站本体是全分离的
- 如果你一点信息技术也不会（毕竟是生物竞赛），按照以下教程
- 1，创建你的GitHub账号
- 2，把这个仓库fork到你自己的账号名下
- 3，你可以DIY的大概有两个文件夹，一个是images，其下0721.png决定网站图标，images/00x用于插入图片。一个是notes，其下00x存放笔记内容
- 4，notes采用markdown变种，没必要专门去学，把下面这个提示词复制给AI，再把你的笔记贴给AI，AI就可以帮你转化了

````markdown
你是一位文档格式转换专家，请将用户提供的原始笔记内容，按照以下 **IWP 项目规范** 进行转换。

## 转换规则

1. **添加 YAML Front Matter（元数据块）**
   - 在文档最顶部用 `---` 包裹以下字段：
     ```yaml
     ---
     title: 从原文提取的标题
     date: 当前日期（格式 YYYY-MM-DD）
     version: 1.0
     tags: [关键词1, 关键词2]
     ---
     ```

2. **图片处理（两种语法）**
   - **需要图注的图片** → 使用 `:::image` 块，格式为 `:::image 对齐方式 文件名 图注文字 :::`。
   - **不需要图注的图片** → 使用标准 `![]()` 并追加 `{对齐方式}` 修饰符，格式为 `![描述](文件名){对齐方式}`。
   - 对齐方式可选：`center`（居中）、`left`（左浮）、`right`（右浮）、`around`（四周环绕）。
   - **路径规则**：图片只写文件名（如 `flow.png`），不加 `images/` 前缀。

3. **章节结构**
   - 一级标题 `#` 对应章节，二级 `##`、三级 `###` 作为子标题。

---

## 转换示例（请严格模仿此示例的输出格式）

### 示例输入（用户原始笔记）
```text
# 细胞实验记录
今天做了 Western Blot，结果如下图。

[图片：wb_result.jpg]
图1：蛋白条带

还有一张对比图放在右侧比较好看。
[图片：control.jpg]

数据统计如下：
| 组别 | 表达量 |
|------|--------|
| 实验组 | 1.8 |
| 对照组 | 1.0 |
```

### 示例输出（转换后的 IWP 格式）
```markdown
---
title: 细胞实验记录
date: 2026-08-15
version: 1.0
tags: [Western Blot, 蛋白表达]
---

# 细胞实验记录

今天做了 Western Blot，结果如下图。

:::image center wb_result.jpg 图1：蛋白条带 :::

还有一张对比图放在右侧比较好看。

![对比图](control.jpg){right}

数据统计如下：

| 组别 | 表达量 |
|------|--------|
| 实验组 | 1.8 |
| 对照组 | 1.0 |
```

---

## 现在开始转换

请严格按照上述示例的输出格式，将用户下方提供的笔记内容转换为 IWP 格式。只输出转换后的 Markdown 源码，结果使用代码块包裹，不要添加额外解释。

用户笔记内容如下：
````
- 5 完事把转化完的贴到notes里即可，000代表序言的文本，你想插入什么图片，就直接按照转化完的md命名即可，比如说我的001.md里有个005.png想插进去，直接把图片上传到images/000/005.png即可
- 6 完事你写完了，就可以让网站上线了，先点setting－Pages，把那个d打头的改成main保存，然后去action，此时你应该会发现它在转圈圈，转完了点进去即可显示出你的网站
- 7实际上你什么不会都可以问AI，你可以把我的仓库链接贴给AI，哪里出问题都可以解决！
- - 你要是听不懂，或者极端情况下可以把这个文件发给AI   [![OneDrive文档](https://img.shields.io/badge/📄-技术文件-0078D4?style=flat&logo=microsoftword&logoColor=white)](https://1drv.ms/w/c/E80A9C3926A748E4/IQDFIssarrO3QYHFpVLauDVEAbLxCO8TRLcDMK5JKGl0R48)
  - 但是博客功能不可用，因为它需要另一个工具cloudflare，你要想研究就自己写worker好了，这里是worker代码
    ```javascript
export default {

async fetch(request, env) {

const url = new URL(request.url);

const method = request.method;

const path = url.pathname;


// ---------- CORS ----------

if (method === 'OPTIONS') {

return new Response(null, {

headers: {

'Access-Control-Allow-Origin': '*',

'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',

'Access-Control-Allow-Headers': 'Content-Type, Authorization',

},

});

}


const jsonRes = (data, status = 200) =>

new Response(JSON.stringify(data), {

status,

headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },

});


const getUser = async (token) => {

if (!token) return null;

return await env.DB.prepare('SELECT * FROM users WHERE token = ?').bind(token).first();

};


// ---------- 工具函数 ----------

async function sha256(message) {

const encoder = new TextEncoder();

const data = encoder.encode(message);

const hash = await crypto.subtle.digest('SHA-256', data);

return Array.from(new Uint8Array(hash))

.map((b) => b.toString(16).padStart(2, '0'))

.join('');

}


// ---------- 注册 ----------

if (path === '/register' && method === 'POST') {

try {

const { username, password, school, honor_year, honor_rank } = await request.json();

if (!username || !password) return jsonRes({ error: 'Missing fields' }, 400);


const exist = await env.DB.prepare('SELECT id FROM users WHERE username = ?')

.bind(username)

.first();

if (exist) return jsonRes({ error: '用户名已存在' }, 409);


const hash = await sha256(password);

const token = btoa(username + ':' + Date.now());


await env.DB.prepare(

'INSERT INTO users (username, password, token, school, honor_year, honor_rank) VALUES (?, ?, ?, ?, ?, ?)'

).bind(username, hash, token, school || null, honor_year || null, honor_rank || null).run();


return jsonRes({ token, username });

} catch (e) {

return jsonRes({ error: e.message }, 500);

}

}


// ---------- 登录 ----------

if (path === '/login' && method === 'POST') {

try {

const { username, password } = await request.json();

const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?')

.bind(username)

.first();

if (!user || user.password !== (await sha256(password)))

return jsonRes({ error: '账号或密码错误' }, 401);


const token = btoa(username + ':' + Date.now());

await env.DB.prepare('UPDATE users SET token = ? WHERE username = ?')

.bind(token, username)

.run();

return jsonRes({ token, username });

} catch (e) {

return jsonRes({ error: e.message }, 500);

}

}


// ---------- 获取当前用户信息 (GET /users/me) ----------

if (path === '/users/me' && method === 'GET') {

const token = request.headers.get('Authorization')?.replace('Bearer ', '');

const user = await getUser(token);

if (!user) return jsonRes({ error: '未登录' }, 401);

// 去掉敏感字段

const { password, token: tkn, ...safeUser } = user;

return jsonRes({ user: safeUser });

}


// ---------- 更新当前用户信息 (PUT /users/me) ----------

if (path === '/users/me' && method === 'PUT') {

const token = request.headers.get('Authorization')?.replace('Bearer ', '');

const user = await getUser(token);

if (!user) return jsonRes({ error: '未登录' }, 401);


try {

const { username, password, avatar, school, honor_year, honor_rank } = await request.json();

const updates = {};

if (username !== undefined) updates.username = username;

if (password) updates.password = await sha256(password);

if (avatar !== undefined) updates.avatar = avatar;

if (school !== undefined) updates.school = school;

if (honor_year !== undefined) updates.honor_year = honor_year;

if (honor_rank !== undefined) updates.honor_rank = honor_rank;


if (Object.keys(updates).length === 0) {

return jsonRes({ error: '没有提供修改字段' }, 400);

}


// 如果修改了用户名，检查新用户名是否已被占用（排除自己）

if (updates.username && updates.username !== user.username) {

const exist = await env.DB.prepare('SELECT id FROM users WHERE username = ? AND id != ?')

.bind(updates.username, user.id)

.first();

if (exist) return jsonRes({ error: '用户名已被占用' }, 409);

}


const setClause = Object.keys(updates)

.map((k) => `${k} = ?`)

.join(', ');

const values = Object.values(updates);

values.push(user.id);

await env.DB.prepare(`UPDATE users SET ${setClause} WHERE id = ?`)

.bind(...values)

.run();


// 重新获取更新后的用户

const updatedUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?')

.bind(user.id)

.first();

const { password: pwd, token: tkn, ...safeUser } = updatedUser;

return jsonRes({ user: safeUser });

} catch (e) {

return jsonRes({ error: e.message }, 500);

}

}


// ---------- 发布文章 ----------

if (path === '/posts' && method === 'POST') {

const user = await getUser(request.headers.get('Authorization')?.replace('Bearer ', ''));

if (!user) return jsonRes({ error: '未登录' }, 401);


const { title, content_md } = await request.json();

if (!title || !content_md) return jsonRes({ error: '标题或内容不能为空' }, 400);


await env.DB.prepare(

'INSERT INTO posts (title, content_md, author) VALUES (?, ?, ?)'

).bind(title, content_md, user.username).run();


return jsonRes({ success: true });

}


// ---------- 文章列表 (含搜索 & 热度) ----------

if (path === '/posts' && method === 'GET') {

const search = url.searchParams.get('search') || '';

const query = `

SELECT p.*,

u.avatar,

(p.views * 1 + p.likes * 5 + p.comments_count * 10) as heat_score

FROM posts p

LEFT JOIN users u ON p.author = u.username

WHERE p.title LIKE ?

ORDER BY heat_score DESC, p.created_at DESC

`;

const results = await env.DB.prepare(query).bind(`%${search}%`).all();

return jsonRes({ posts: results.results });

}


// ---------- 单篇文章 (含下一篇ID) ----------

const postMatch = path.match(/^\/posts\/(\d+)$/);

if (postMatch && method === 'GET') {

const id = parseInt(postMatch[1]);

// 增加浏览量

await env.DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();


const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();

if (!post) return jsonRes({ error: 'Not found' }, 404);


const author = await env.DB.prepare(

'SELECT avatar, school, honor_year, honor_rank FROM users WHERE username = ?'

).bind(post.author).first();

post.author_info = author || {};


// 下一篇：按热度降序，取比当前文章热度低的下一篇

const heat = post.views * 1 + post.likes * 5 + post.comments_count * 10;

const nextPost = await env.DB.prepare(`

SELECT id FROM posts

WHERE (views * 1 + likes * 5 + comments_count * 10) < ?

ORDER BY (views * 1 + likes * 5 + comments_count * 10) DESC

LIMIT 1

`).bind(heat).first();


return jsonRes({ post, next_id: nextPost ? nextPost.id : null });

}


// ---------- 点赞文章 ----------

const postLikeMatch = path.match(/^\/posts\/(\d+)\/like$/);

if (postLikeMatch && method === 'POST') {

const id = parseInt(postLikeMatch[1]);

const user = await getUser(request.headers.get('Authorization')?.replace('Bearer ', ''));

if (!user) return jsonRes({ error: '未登录' }, 401);


// 检查是否已点赞

const liked = await env.DB.prepare('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?')

.bind(user.username, id)

.first();

if (liked) {

// 已点赞则取消点赞（toggle）

await env.DB.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?')

.bind(user.username, id)

.run();

await env.DB.prepare('UPDATE posts SET likes = likes - 1 WHERE id = ?').bind(id).run();

return jsonRes({ success: true, action: 'unliked' });

} else {

await env.DB.prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)')

.bind(user.username, id)

.run();

await env.DB.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').bind(id).run();

return jsonRes({ success: true, action: 'liked' });

}

}


// ---------- 用户详情 (公开信息) ----------

if (path.startsWith('/users/') && method === 'GET') {

const username = path.split('/')[2];

if (username === 'me') {

// 已经被前面的 /users/me 拦截，这里不会执行

return jsonRes({ error: 'Not found' }, 404);

}

const user = await env.DB.prepare('SELECT username, avatar, school, honor_year, honor_rank FROM users WHERE username = ?')

.bind(username)

.first();

if (!user) return jsonRes({ error: 'User not found' }, 404);


const posts = await env.DB.prepare(

'SELECT id, title, views, likes, comments_count, created_at FROM posts WHERE author = ? ORDER BY created_at DESC'

).bind(username).all();


return jsonRes({ user, posts: posts.results });

}


// ---------- 用户热度榜 ----------

if (path === '/users/hot' && method === 'GET') {

const query = `

SELECT u.username, u.avatar, u.honor_year, u.honor_rank, u.school,

SUM(p.views * 1 + p.likes * 5 + p.comments_count * 10) as total_heat

FROM users u

JOIN posts p ON u.username = p.author

GROUP BY u.username

ORDER BY total_heat DESC

`;

const results = await env.DB.prepare(query).all();

return jsonRes({ users: results.results });

}


// ---------- 发表评论 (支持回复) ----------

if (path === '/comments' && method === 'POST') {

const user = await getUser(request.headers.get('Authorization')?.replace('Bearer ', ''));

if (!user) return jsonRes({ error: '未登录' }, 401);


const { section, content, parent_id } = await request.json();

if (!section || !content) return jsonRes({ error: 'Missing fields' }, 400);


await env.DB.prepare(

'INSERT INTO comments (section, username, content, parent_id) VALUES (?, ?, ?, ?)'

).bind(section, user.username, content, parent_id || null).run();


// 如果是博客评论，增加文章评论数

if (section.startsWith('blog-')) {

const postId = section.split('-')[1];

await env.DB.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?')

.bind(postId)

.run();

}

return jsonRes({ success: true });

}


// ---------- 获取评论列表 (含 total) ----------

if (path === '/comments' && method === 'GET') {

const section = url.searchParams.get('section');

if (!section) return jsonRes({ error: 'Missing section' }, 400);


// 获取总条数

const countResult = await env.DB.prepare('SELECT COUNT(*) as total FROM comments WHERE section = ?')

.bind(section)

.first();

const total = countResult ? countResult.total : 0;


// 获取所有评论（前端组装树）

const commentsResult = await env.DB.prepare(

'SELECT * FROM comments WHERE section = ? ORDER BY created_at ASC'

).bind(section).all();


const comments = commentsResult.results || [];

// 填充用户头像

for (const c of comments) {

const u = await env.DB.prepare('SELECT avatar FROM users WHERE username = ?')

.bind(c.username)

.first();

c.avatar = u?.avatar || 'images/0721.png';

}

return jsonRes({ comments, total });

}


// ---------- 评论点赞 ----------

const likeMatch = path.match(/^\/comments\/(\d+)\/like$/);

if (likeMatch && method === 'POST') {

const id = parseInt(likeMatch[1]);

// 简单递增，不限制每人多次点赞（可后续优化）

await env.DB.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').bind(id).run();

// 返回新的点赞数（可选）

const row = await env.DB.prepare('SELECT likes FROM comments WHERE id = ?').bind(id).first();

return jsonRes({ likes: row ? row.likes : 0 });

}


// ---------- 404 ----------

return new Response('Not found', { status: 404 });

},

};
```
---

*本站基于 神秘东方文字（其实就是HTML CSS JS）搭建*
