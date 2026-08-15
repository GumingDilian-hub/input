# IWP（Input wenben please）技术文档 / AI Fork Context

> **文档目的**
>
> 本文档面向需要理解、维护、重构或 Fork `GumingDilian-hub/input` 的人类开发者与 AI Agent。
> 文档以仓库 `main` 分支当前结构为基准，重点解释：
>
> - 静态站点架构
> - Markdown → HTML 的渲染链
> - IWP Markdown 变种语法
> - 图片路径与章节编号机制
> - 目录、搜索、滚动监听、响应式布局
> - 博客、账号、评论、点赞等 Cloudflare Worker 后端接口约定
> - GitHub Pages 部署方式
> - Fork 时哪些文件应该修改、哪些文件不应该碰
> - 已发现的实现细节与潜在 Bug
> - 给 AI 使用的完整 Fork 上下文与操作约束
>
> **明确排除项：** `notes/**` 是原始学习笔记内容，不属于网站程序本体；本技术文档不复制、解释或重述其中的学习笔记。`images/**` 为二进制素材，也不在本文中转储。

---

## 1. 项目定位

IWP 是一个纯前端、GitHub Pages 可部署的个人知识库 / Markdown 阅读器，同时包含一个可选的博客系统。

核心思想是：

```text
GitHub Repository
│
├── notes/              ← 内容数据（Markdown）
├── images/             ← 图片素材
│
├── index.html          ← 首页
├── reader.html         ← Markdown 知识库阅读器
├── blog.html           ← 博客前端
├── more.html           ← 用户资料 / 热度榜
│
├── js/
│   ├── reader.js       ← 阅读器核心
│   ├── blog.js         ← 博客核心
│   ├── profile.js      ← 用户中心
│   └── editor.js       ← Markdown 编辑器辅助
│
├── css/style.css       ← 阅读器公共样式
└── data/book.json      ← 额外数据文件
```

网站主体不依赖构建工具。页面直接由浏览器加载 HTML、CSS、JavaScript 和 Markdown 文件。

因此它的部署模型非常简单：

```text
Markdown / HTML / CSS / JS
          │
          ▼
      GitHub Pages
          │
          ▼
        Browser
```

博客功能则额外依赖一个 Cloudflare Worker + D1 数据库：

```text
Browser
   │
   ├── 静态内容 → GitHub Pages
   │
   └── API 请求 → Cloudflare Worker
                    │
                    ▼
                  D1 DB
```

---

# 2. 当前仓库结构

当前 `main` 分支的核心程序文件包括：

```text
.nojekyll

LICENSE
README.md

index.html
reader.html
blog.html
more.html

css/
└── style.css

js/
├── reader.js
├── blog.js
├── profile.js
└── editor.js

data/
└── book.json

images/
├── 000/
├── 001/
├── 0711.png
├── 0721.png
└── 122256.png

notes/
├── 000/
├── 001/
├── 002/
...
└── 019/
```

其中 `reader.js` 当前配置了 20 个章节：

```text
notes/000/index.md
notes/001/index.md
notes/002/index.md
...
notes/019/index.md
```

这意味着：

> **新增 `notes/020/index.md` 并不会自动进入阅读器。**

必须同步修改 `js/reader.js` 中的 `CONFIG.CHAPTERS`。

---

# 3. 文件职责

## 3.1 `index.html`

首页。

职责：

1. 展示 IWP 标题。
2. 展示封面。
3. 提供阅读器入口。
4. 提供博客入口。
5. 设置 favicon。
6. 提供简单的响应式布局。

它不负责 Markdown 渲染。

主要入口：

```text
index.html
├── reader.html
└── blog.html
```

---

## 3.2 `reader.html`

知识库阅读器 UI。

包含：

- 顶部工具栏
- 返回首页
- 搜索
- 个人中心
- 移动端汉堡菜单
- 左侧目录
- 章节选择器
- 内容区
- 加载遮罩
- 个人中心侧栏

核心 JavaScript：

```html
<script src="js/reader.js"></script>
<script src="js/profile.js"></script>
```

---

## 3.3 `reader.js`

这是整个项目最重要的前端文件。

主要职责：

```text
reader.js
│
├── 配置章节
├── 加载 Markdown
├── 解析 Front Matter
├── IWP Markdown 预处理
├── 图片路径转换
├── :::image 转换
├── Markdown → HTML
├── KaTeX 数学公式
├── Highlight.js 代码高亮
├── 自动生成 TOC
├── 侧边栏
├── 搜索
├── ScrollSpy
├── 章节选择
├── 评论系统
├── 用户登录状态
└── 移动端适配
```

---

## 3.4 `blog.html`

博客页面。

功能：

- 博客文章列表
- 搜索文章
- 阅读文章
- 点赞
- 评论
- 回复
- 登录 / 注册
- 发布文章
- 下一篇
- 用户中心

博客前端本身仍然是静态页面，真正的数据来自 Cloudflare Worker API。

---

## 3.5 `blog.js`

博客业务逻辑。

核心对象：

```javascript
const blogApp = {
    fetchPosts() {},
    openPost(id) {},
    backToList() {},
    openEditor() {},
    closeEditor() {},
    submitPost() {},
    loadComments() {}
};
```

评论采用树结构。

数据库返回扁平数组：

```text
A
B
C(parent=A)
D(parent=B)
E(parent=C)
```

前端转换为：

```text
A
└── C
    └── E

B
└── D
```

---

## 3.6 `profile.js`

负责个人中心。

依赖页面已经存在的全局变量 / 函数：

```text
$
CONFIG
state
escapeHtml
safeFetch
doLogin
doRegister
doLogout
```

因此：

> `profile.js` 不能被当作完全独立的模块使用。

---

## 3.7 `editor.js`

负责博客 Markdown 编辑器中的快捷操作。

当前功能：

- 加粗
- 斜体
- 表格
- 行内代码

核心接口：

```javascript
editor.insert(prefix, suffix)
editor.insertTable()
```

例如：

```javascript
editor.insert('**', '**')
```

会把选中文字变成：

```markdown
**选中文字**
```

---

## 3.8 `css/style.css`

阅读器公共样式。

主要覆盖：

- 深色侧边栏
- 白色正文
- 工具栏
- 搜索面板
- TOC
- 图片
- 图注
- 表格
- 评论
- 移动端
- 动画
- 代码块

---

# 4. 外部依赖

当前页面通过 CDN 使用：

## Marked

用于 Markdown → HTML。

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

---

## KaTeX

用于数学公式。

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">

<script defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>

<script defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
```

---

## Highlight.js

用于代码高亮。

当前版本：

```text
11.8.0
```

CDN：

```html
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js
```

---

# 5. Markdown 渲染流水线

IWP 并不是简单地：

```text
Markdown → marked.parse()
```

实际流程是：

```text
notes/xxx/index.md
        │
        ▼
     fetch()
        │
        ▼
extractAndRemoveFrontMatter()
        │
        ▼
    processMarkdown()
        │
        ├── 图片路径转换
        ├── :::image 转换
        │
        ▼
    marked.parse()
        │
        ▼
 postProcessImages()
        │
        ▼
 postProcessFigure()
        │
        ▼
 Highlight.js
        │
        ▼
    renderMath()
        │
        ▼
      TOC
        │
        ▼
      DOM
```

这个顺序非常重要。

---

# 6. IWP Markdown Front Matter

每个章节文件可以在最顶部写：

```yaml
---
title: 细胞实验记录
date: 2026-08-15
version: 1.0
tags: [Western Blot, 蛋白表达]
---
```

要求：

1. 第一行必须是 `---`
2. 后面必须存在第二个 `---`
3. Front Matter 位于文件开头
4. Front Matter 后面的正文才进入 Markdown 渲染

---

## 6.1 `title`

例如：

```yaml
title: 生物化学
```

阅读器会从所有章节的 metadata 中寻找第一个拥有 `title` 的章节，并用于版本信息区域。

---

## 6.2 `date`

例如：

```yaml
date: 2026-08-15
```

只是 metadata。

---

## 6.3 `version`

例如：

```yaml
version: 1.0
```

阅读器会显示：

```text
v1.0
```

---

## 6.4 `tags`

推荐：

```yaml
tags: [生物化学, 蛋白质, 酶]
```

解析后变成：

```javascript
[
    "生物化学",
    "蛋白质",
    "酶"
]
```

---

# 7. IWP Markdown 图片系统

这是 IWP 最重要的 Markdown 扩展。

存在两套语法：

```text
普通图片 + 对齐修饰
```

以及：

```text
:::image
```

---

# 8. 普通图片

标准 Markdown：

```markdown
![图片说明](flow.png)
```

在 IWP 中，如果路径不是绝对路径、URL 或 data URI：

```text
flow.png
```

会自动转换为：

```text
images/<当前章节编号>/flow.png
```

例如文件：

```text
notes/001/index.md
```

里面：

```markdown
![代谢途径](flow.png)
```

最终请求：

```text
images/001/flow.png
```

---

# 9. 图片路径规则

不要写：

```markdown
![图片](images/001/flow.png)
```

推荐写：

```markdown
![图片](flow.png)
```

因为 reader.js 会根据当前章节自动补：

```text
images/<chapterNum>/
```

---

# 10. 图片对齐语法

项目 README 定义了：

```text
center
left
right
around
```

理论写法：

```markdown
![图片](flow.png){center}
```

```markdown
![图片](flow.png){left}
```

```markdown
![图片](flow.png){right}
```

```markdown
![图片](flow.png){around}
```

CSS 对应：

```css
img.iwp-img-center
img.iwp-img-left
img.iwp-img-right
img.iwp-img-around
```

---

# 11. 一个重要的兼容性问题

当前 `reader.js` 的实际实现：

```javascript
const match = alt.match(/\{(left|right|around|center)\s*(?:width=(\d+))?\}/);
```

它是在：

```text
img.alt
```

里面寻找：

```text
{right}
```

而不是在：

```markdown
![图片](flow.png){right}
```

的 Markdown URL 后缀里寻找。

因此：

```markdown
![图片](flow.png){right}
```

与当前实现之间存在潜在解析不一致。

更可靠的兼容写法是把 modifier 放进 alt：

```markdown
![图片 {right}](flow.png)
```

带宽度：

```markdown
![图片 {right width=400}](flow.png)
```

如果要严格实现 README 中宣称的语法：

```markdown
![图片](flow.png){right}
```

应该修改 `processMarkdown()`，让正则同时捕获图片后的 `{...}`。

推荐修复方向：

```javascript
.replace(
    /!\[([^\]]*)\]\(([^)]+)\)\s*\{(left|right|around|center)(?:\s+width=(\d+))?\}/g,
    ...
)
```

不要在 Fork 时忽略这个差异。

---

# 12. `:::image` 语法

IWP 自定义图注语法：

```markdown
:::image center flow.png 图1：实验结果 :::
```

语法：

```text
:::image <position> <filename> <caption> :::
```

例如：

```markdown
:::image center western.png 图1：Western Blot 结果 :::
```

会先被转换为：

```html
<div class="iwp-figure" data-pos="center">
    <img src="images/001/western.png">
    <div class="figure-caption">
        图1：Western Blot 结果
    </div>
</div>
```

随后 `postProcessFigure()` 会把它转换成：

```html
<div class="figure-container figure-center">
    <img class="iwp-img-center">
    <div class="figure-caption">
        图1：Western Blot 结果
    </div>
</div>
```

---

# 13. `:::image` 支持的对齐

```text
center
left
right
around
```

例如：

```markdown
:::image left cell.png 图1：细胞结构 :::
```

```markdown
:::image right cell.png 图1：细胞结构 :::
```

---

# 14. `:::image` 的限制

当前实现使用单个正则：

```javascript
/:::image\s+([^\s]+)?\s*([^\s]+)\s*(.*?)\s*:::/g
```

因此：

- 它不是完整 Markdown parser。
- 语法主要适合单行。
- 文件名不能含空白。
- `position` 应该使用预定义值。
- caption 可以包含空格。

推荐：

```markdown
:::image center mitochondria.png 图1：线粒体结构 :::
```

不推荐把 caption 写成复杂多行 Markdown。

---

# 15. 图片宽度

当前代码支持：

```text
{right width=400}
```

对应：

```javascript
img.style.width = width + 'px';
```

因此可以使用：

```markdown
![图片 {right width=400}](flow.png)
```

注意：

> 这属于当前 JavaScript 的实际解析能力，不应仅根据普通 Markdown 语法推断。

---

# 16. 图片 fallback

所有图片都会安装：

```javascript
img.onerror = function () {
    this.src = CONFIG.DEFAULT_AVATAR;
};
```

默认：

```text
images/0721.png
```

因此图片路径错误时不会完全显示破图，而会显示默认图片。

如果你 Fork 后修改 favicon / 默认图片，应同时修改：

```javascript
CONFIG.DEFAULT_AVATAR
```

以及 HTML 中的 favicon。

---

# 17. Markdown 标准能力

IWP 使用 Marked，因此基本 Markdown 能力由 Marked 提供：

```markdown
# H1
## H2
### H3

**粗体**

*斜体*

`inline code`

```javascript
console.log("hello");
```

> 引用

- 列表
- 列表

1. 有序列表
2. 有序列表

[链接](https://example.com)
```

表格也可以：

```markdown
| 项目 | 数值 |
|---|---:|
| A | 1 |
| B | 2 |
```

---

# 18. 数学公式

KaTeX 使用：

行内：

```markdown
$E=mc^2$
```

块级：

```markdown
$$
E=mc^2
$$
```

reader.js 当前配置：

```javascript
delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false }
]
```

---

# 19. 代码块

例如：

````markdown
```python
print("Hello")
```
````

Marked 负责产生：

```html
<pre><code>
...
</code></pre>
```

之后 reader.js：

```javascript
sectionDiv.querySelectorAll('pre code').forEach(b => {
    hljs.highlightElement(b);
});
```

因此 Highlight.js 会进行二次处理。

---

# 20. TOC 自动生成

reader.js 查找：

```css
#article-body h1
#article-body h2
#article-body h3
```

然后自动生成：

```text
#toc-tree
```

每个标题都会得到一个自动 ID：

```text
h-0
h-1
h-2
...
```

因此不要依赖手写 anchor。

---

# 21. TOC 层级

```markdown
# 第一章
## 第一节
### 第一小节
### 第二小节
## 第二节
```

会生成：

```text
第一章
├── 第一节
│   ├── 第一小节
│   └── 第二小节
└── 第二节
```

---

# 22. 章节折叠

TOC 中：

```text
▼
```

代表展开。

```text
▶
```

代表折叠。

代码通过：

```javascript
toggleSectionVisibility()
```

控制章节 DOM 的 `display`。

---

# 23. 搜索

搜索面板：

```text
#search-panel
```

搜索结果：

```text
#search-results
```

输入：

```text
#search-input
```

搜索逻辑由 reader.js 初始化。

如果 Fork 时修改搜索行为，应优先修改：

```text
initSearch()
```

而不是 HTML。

---

# 24. ScrollSpy

reader.js 有滚动监听机制，用于：

```text
正文滚动
   ↓
计算当前标题
   ↓
TOC 对应项目 active
```

因此左侧目录可以随着正文阅读位置自动高亮。

---

# 25. 侧边栏拖拽

reader 页面有：

```html
<div id="resizer"></div>
```

默认：

```text
260px
```

拖动范围：

```text
180px ~ 600px
```

核心：

```javascript
const w = e.clientX;

if (w > 180 && w < 600) {
    sidebar.style.width = w + 'px';
}
```

---

# 26. 移动端

当：

```text
window.innerWidth < 768
```

显示：

```text
☰
```

汉堡按钮。

点击后：

```text
sidebar-open
sidebar-active
```

两个 class 会被切换。

桌面端重新变为：

```text
>= 768px
```

时，会自动关闭移动端侧栏状态。

---

# 27. GitHub Pages 部署

项目是静态站点，因此最简单部署：

```text
GitHub
  ↓
Settings
  ↓
Pages
  ↓
Deploy from branch
  ↓
main
  ↓
/
```

然后等待 GitHub Actions / Pages 构建完成。

仓库有：

```text
.nojekyll
```

用于避免 Jekyll 处理静态资源。

---

# 28. Fork 操作

推荐流程：

```text
Fork
 ↓
修改 notes/
 ↓
修改 images/
 ↓
必要时修改 reader.js
 ↓
GitHub Pages
 ↓
访问
```

---

# 29. 新增章节

例如增加：

```text
notes/020/index.md
```

同时增加：

```text
images/020/
```

然后修改：

```javascript
CONFIG.CHAPTERS
```

加入：

```javascript
'notes/020/index.md'
```

否则章节不会被读取。

---

# 30. 章节与图片必须一一对应

例如：

```text
notes/005/index.md
```

里面：

```markdown
![蛋白结构](005.png)
```

则图片应该放：

```text
images/005/005.png
```

完整映射：

```text
notes/005/index.md
        │
        └── 005.png
                │
                ▼
images/005/005.png
```

---

# 31. favicon

当前 HTML 使用：

```html
<link rel="icon"
      type="image/png"
      href="images/0721.png?v=1">
```

因此修改网站图标最简单的方式：

```text
替换 images/0721.png
```

或者修改所有 HTML 的 favicon 路径。

---

# 32. 博客系统架构

博客不是 GitHub Pages 自己提供数据库。

架构：

```text
blog.html
    │
    ▼
blog.js
    │
    ▼
Cloudflare Worker
    │
    ▼
Cloudflare D1
```

默认 API：

```text
https://woxiangcaoni.2167964516.workers.dev
```

前端代码通过：

```javascript
CONFIG.COMMENT_API
```

访问。

---

# 33. 博客 API

从前端代码可以确定的主要 API：

```text
POST /register
POST /login

GET  /users/me
PUT  /users/me

GET  /users/<username>
GET  /users/hot

GET  /posts
GET  /posts/<id>
POST /posts

POST /posts/<id>/like

GET  /comments?section=<section>&limit=100
POST /comments/<id>/like
```

评论发布、回复、登录等接口还依赖 Worker 的完整实现。

如果要彻底 Fork 博客系统：

> 必须同时 Fork / 重写 Worker，而不能只 Fork GitHub Pages。

---

# 34. 用户登录状态

前端使用：

```text
localStorage
```

键名：

```text
iwp-user
```

典型结构：

```javascript
{
    username: "...",
    token: "..."
}
```

登录后：

```javascript
localStorage.setItem(
    'iwp-user',
    JSON.stringify(state.user)
);
```

刷新页面时：

```javascript
restoreUserSession()
```

恢复。

---

# 35. Token

前端请求 API 时：

```http
Authorization: Bearer <token>
```

例如：

```javascript
headers: {
    'Authorization': `Bearer ${state.user.token}`
}
```

Worker 通过 Authorization header 读取 token。

---

# 36. Worker 的安全注意事项

当前 Worker 中存在：

```javascript
const token = btoa(username + ':' + Date.now());
```

这不是密码学意义上的安全 token。

Base64 并不等于加密。

如果 Fork 后准备公开部署博客，建议改为：

```text
crypto.randomUUID()
```

或使用：

```text
crypto.getRandomValues()
```

生成随机 token。

同时建议：

- 设置 token 过期时间
- 增加 refresh token 或 session
- 不在 URL 中传递 token
- 限制 CORS origin
- 对登录 / 注册增加 rate limit
- 对评论增加 spam 防护
- 对文章内容做长度限制
- 对用户名做字符集限制

---

# 37. CORS

Worker 当前使用：

```http
Access-Control-Allow-Origin: *
```

这意味着任意来源都可以访问 API。

开发阶段方便。

生产环境更推荐：

```text
Access-Control-Allow-Origin:
https://你的用户名.github.io
```

而不是：

```text
*
```

---

# 38. 博客热度

blog.js 中的热度公式：

```javascript
views
+ likes * 5
+ comments_count * 10
```

因此：

```text
浏览 = 1 分
点赞 = 5 分
评论 = 10 分
```

例如：

```text
100 浏览
20 点赞
3 评论
```

热度：

```text
100 + 20×5 + 3×10
= 230
```

---

# 39. 用户热度榜

`more.html?type=hot`

调用：

```text
GET /users/hot
```

返回用户列表后前端按 API 返回顺序展示：

```text
#1
#2
#3
...
```

并显示：

```text
用户名
荣誉年份
荣誉等级
热度
```

---

# 40. 用户资料页

访问：

```text
more.html?user=<username>
```

调用：

```text
GET /users/<username>
```

展示：

- avatar
- username
- school
- honor_year
- honor_rank
- posts

文章点击后：

```text
blog.html?post=<id>
```

---

# 41. 评论系统

评论采用：

```text
parent_id
```

实现树结构。

根评论：

```text
parent_id = null
```

回复：

```text
parent_id = 父评论 ID
```

前端 `_buildTree()`：

```javascript
const map = {};
const roots = [];

flatList.forEach(c => {
    c.children = [];
    map[c.id] = c;
});

flatList.forEach(c => {
    if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].children.push(c);
    } else {
        roots.push(c);
    }
});
```

---

# 42. AI Fork 时的关键理解

如果让 AI 重建这个项目，不要让 AI 把它误判成：

```text
React
Vue
Next.js
Vite
Webpack
Node.js
```

它实际上是：

```text
Vanilla HTML
+
Vanilla CSS
+
Vanilla JavaScript
+
Marked
+
KaTeX
+
Highlight.js
+
GitHub Pages
+
可选 Cloudflare Worker / D1
```

没有必要引入大型前端框架。

---

# 43. AI Fork 的正确实施顺序

推荐：

```text
1. 建立目录结构
2. 建立 index.html
3. 建立 reader.html
4. 建立 style.css
5. 建立 reader.js
6. 建立 notes/
7. 建立 images/
8. 测试 Markdown
9. 测试图片
10. 测试 KaTeX
11. 测试 TOC
12. 测试移动端
13. 再接入博客
14. 最后部署 Pages
```

不要一开始就开发博客。

因为博客不是知识库阅读器的必要依赖。

---

# 44. 最小可运行版本

如果只需要个人笔记网站，最小系统：

```text
index.html
reader.html
css/style.css
js/reader.js
notes/
images/
.nojekyll
```

可以完全不使用：

```text
blog.html
more.html
js/blog.js
js/profile.js
js/editor.js
Cloudflare Worker
D1
```

---

# 45. 推荐的 Fork 改造

如果目标只是“用这个网站记录自己的笔记”，建议只修改：

```text
notes/
images/
js/reader.js
```

其中：

### `notes/`

自己的 Markdown。

### `images/`

自己的图片。

### `reader.js`

修改：

```javascript
CONFIG.CHAPTERS
```

### `images/0721.png`

自己的 favicon / 默认头像。

---

# 46. 不推荐修改的部分

除非明确知道自己在做什么，否则不要随便修改：

```text
processMarkdown()
extractAndRemoveFrontMatter()
postProcessImages()
postProcessFigure()
renderMath()
buildTOC()
```

这些函数构成 IWP Markdown 方言的解析链。

修改其中任何一个，都可能导致已有笔记无法正确显示。

---

# 47. AI 修改代码时的原则

AI 必须遵守：

1. 不删除已有 Markdown 兼容能力。
2. 不改变 `notes/<chapter>/index.md` 的路径约定，除非用户明确要求。
3. 不自动移动图片。
4. 不把 `images/<chapter>/` 硬编码进笔记正文。
5. 不把笔记内容当成程序源码。
6. 不修改 `notes/**` 中的学习内容。
7. 不把用户笔记摘要写进技术代码。
8. 修改 reader.js 时保持 Front Matter 兼容。
9. 修改图片处理时同时测试：
   - 普通图片
   - center
   - left
   - right
   - around
   - width
   - `:::image`
10. 修改 TOC 时测试 H1/H2/H3。
11. 修改博客时同时检查 Worker API。
12. 不把 Cloudflare API key、数据库密钥或其他 secret 写入静态仓库。

---

# 48. AI Fork Prompt

下面这段可以直接发送给 AI：

```text
你现在负责维护一个名为 IWP（Input wenben please）的静态知识库网站。

原始仓库：
https://github.com/GumingDilian-hub/input

这是一个 Vanilla HTML/CSS/JavaScript 项目，不是 React/Vue/Next/Vite 项目。

请先理解仓库结构，再执行任何修改。

核心架构：

- index.html：首页
- reader.html：知识库阅读器
- blog.html：博客前端
- more.html：用户资料 / 热度榜
- css/style.css：公共阅读器样式
- js/reader.js：Markdown 阅读器核心
- js/blog.js：博客核心
- js/profile.js：用户中心
- js/editor.js：博客 Markdown 编辑器
- notes/**：Markdown 内容
- images/**：图片资源
- data/book.json：数据文件
- Cloudflare Worker：博客 API 后端

特别重要：

1. 不要读取、总结、重写或泄露 notes/** 中的学习笔记内容。
2. notes/** 只是内容数据，不是网站程序。
3. images/** 主要是二进制资源，不要把图片内容当成代码。
4. 不要擅自把项目迁移到 React/Vue/Next/Vite。
5. 保持 Vanilla HTML/CSS/JS 架构，除非明确要求重构。
6. reader.js 当前明确依赖 notes/000/index.md 到 notes/019/index.md。
7. 新增章节必须同步修改 CONFIG.CHAPTERS。
8. 普通相对图片路径会根据章节编号映射到 images/<chapter>/。
9. IWP 支持 YAML Front Matter：
   ---
   title: ...
   date: ...
   version: ...
   tags: [...]
   ---
10. IWP 支持自定义：
   :::image center filename.png caption :::
11. reader.js 使用 Marked、KaTeX、Highlight.js。
12. Front Matter 会在 Markdown 解析前被移除。
13. TOC 根据 H1/H2/H3 自动生成。
14. 图片有 center/left/right/around 等布局。
15. 当前 README 宣称的 `![x](a.png){right}` 与 reader.js 的实际解析实现存在兼容性问题；如果修复，必须保持旧内容兼容。
16. 博客 API 默认指向 Cloudflare Worker，不要把它误认为 GitHub Pages 本身提供的服务。
17. 不要把任何 secret 放进静态前端。
18. 修改后优先检查：
   - Markdown 是否还能加载
   - Front Matter 是否还能解析
   - 图片路径是否正确
   - 数学公式是否正常
   - 代码高亮是否正常
   - TOC 是否正常
   - 移动端是否正常
   - GitHub Pages 是否能直接部署

如果用户要求 Fork：

第一步先读取仓库结构；
第二步确认目标分支；
第三步只修改必要文件；
第四步保持现有文件命名和相对路径约定；
第五步给出修改文件清单；
第六步检查是否存在 broken links / 404 / JS runtime error；
第七步再给出部署步骤。

如果用户只想建立自己的笔记网站，优先保留：

index.html
reader.html
css/style.css
js/reader.js
notes/
images/

博客相关文件可以暂时不启用。
```

---

# 49. 源码索引

以下是当前程序源码的权威位置。

## HTML

```text
index.html
reader.html
blog.html
more.html
```

## CSS

```text
css/style.css
```

## JavaScript

```text
js/reader.js
js/blog.js
js/profile.js
js/editor.js
```

## 数据

```text
data/book.json
```

## 静态资源

```text
images/**
```

## 内容

```text
notes/**
```

---

# 50. 当前源码的重要实现事实

### reader.js

当前配置：

```javascript
COMMENT_API:
'https://woxiangcaoni.2167964516.workers.dev'
```

章节：

```javascript
notes/000/index.md
...
notes/019/index.md
```

默认头像：

```javascript
images/0721.png
```

---

### editor.js

当前源码为：

```javascript
const editor = {
    insert: (prefix, suffix) => {
        const ta = document.getElementById('editor-content');
        if (!ta) return;

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const text = ta.value;

        ta.value =
            text.substring(0, start) +
            prefix +
            text.substring(start, end) +
            suffix +
            text.substring(end);

        ta.focus();

        ta.selectionStart = start + prefix.length;
        ta.selectionEnd = end + prefix.length;
    },

    insertTable: () => {
        const ta = document.getElementById('editor-content');
        if (!ta) return;

        const table = [
            '| 请输入文本 | 请输入文本 |',
            '| --- | --- |',
            '| 请输入文本 | 请输入文本 |',
            ''
        ].join('\n');

        ta.value += '\n' + table;
    }
};
```

---

# 51. 生产环境建议

如果只是个人知识库：

```text
GitHub Pages + CDN
```

已经足够。

如果启用博客，建议至少：

```text
GitHub Pages
+
Cloudflare Worker
+
Cloudflare D1
```

并进一步加入：

```text
CORS 白名单
Rate Limit
随机 Session Token
Token 过期
输入长度限制
XSS 防护
评论 spam 防护
日志
错误监控
```

尤其是博客文章由用户提交 Markdown 时，不应只依赖：

```javascript
marked.parse()
```

就认为内容天然安全。

---

# 52. XSS 注意事项

reader.js 中大量使用：

```javascript
innerHTML
```

博客文章也通过：

```javascript
marked.parse(post.content_md)
```

得到 HTML。

如果博客允许陌生用户发布文章，建议增加：

```text
DOMPurify
```

或者服务器端 HTML sanitization。

否则恶意 Markdown / HTML 可能成为 XSS 攻击入口。

---

# 53. CORS 与 GitHub Pages

如果 Fork 到：

```text
https://username.github.io/input/
```

Worker 不应该无限制地：

```text
Access-Control-Allow-Origin: *
```

推荐改成对应 Pages origin。

例如：

```text
https://example.github.io
```

注意路径通常不应作为 Origin 的一部分。

---

# 54. 相对路径问题

GitHub Pages 项目站点一般是：

```text
https://username.github.io/input/
```

因此当前项目大量使用相对路径是正确方向：

```text
reader.html
css/style.css
js/reader.js
notes/000/index.md
images/000/a.png
```

不要随意改成：

```text
/notes/000/index.md
```

因为这会从域名根目录寻找：

```text
https://username.github.io/notes/...
```

而不是：

```text
https://username.github.io/input/notes/...
```

---

# 55. 最终 Fork 验收清单

```text
[ ] index.html 可以打开
[ ] reader.html 可以打开
[ ] notes/000/index.md 可以加载
[ ] 所有配置章节可以加载
[ ] Front Matter 可以正常解析
[ ] H1/H2/H3 可以进入 TOC
[ ] TOC 点击可以跳转
[ ] 普通图片可以加载
[ ] chapter-relative 图片可以加载
[ ] :::image 可以加载
[ ] 图注可以显示
[ ] 图片对齐正常
[ ] 数学公式正常
[ ] 代码高亮正常
[ ] 表格正常
[ ] 搜索正常
[ ] 自动滚动正常
[ ] 侧边栏拖动正常
[ ] 移动端汉堡菜单正常
[ ] favicon 正常
[ ] GitHub Pages 正常
[ ] 浏览器 Console 没有致命错误
[ ] 不存在错误的绝对路径
[ ] 不存在泄露的 secret
```

博客如果启用，再增加：

```text
[ ] Worker 可访问
[ ] CORS 正常
[ ] 注册正常
[ ] 登录正常
[ ] 用户资料正常
[ ] 文章列表正常
[ ] 文章阅读正常
[ ] 发布文章正常
[ ] 点赞正常
[ ] 评论正常
[ ] 回复正常
[ ] 热度榜正常
[ ] D1 查询正常
[ ] 未登录用户不会获得受保护操作权限
```

---

# 56. AI 最重要的结论

把这个项目理解成：

```text
一个“文件系统驱动”的静态 Markdown 阅读器
```

而不是：

```text
一个数据库驱动的 CMS
```

知识库部分的真实数据源是：

```text
notes/**/*.md
```

图片数据源是：

```text
images/**
```

程序只是：

```text
读取文件
↓
解析 Front Matter
↓
执行 IWP Markdown 预处理
↓
Marked
↓
后处理
↓
KaTeX / Highlight.js
↓
渲染
```

博客是一个独立的可选子系统：

```text
blog.html
↓
blog.js
↓
Cloudflare Worker
↓
D1
```

因此如果目标只是 Fork 一个自己的知识库网站：

> **先不要碰博客。**

只需要维护：

```text
notes/
images/
reader.js
```

就足够了。

---

# 57. 权威来源与源码

原始仓库：

https://github.com/GumingDilian-hub/input

网站：

https://gumingdilian-hub.github.io/input/

程序源码应以 GitHub `main` 分支实际文件为最终权威，而不是本技术文档中的示例。

尤其对于：

```text
js/reader.js
js/blog.js
js/profile.js
css/style.css
```

如果本文档与仓库代码产生差异：

> **以仓库当前代码为准。**

