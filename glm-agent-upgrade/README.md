# GLM GitHub Agent + Terminal Worker

本项目由两个独立的 Cloudflare Workers 组成：

- `main/worker.js`：GLM 主 Agent、GitHub 工具、PR/CI 和工作流 API。
- `terminal/worker.js`：通过 Cloudflare Dynamic Workers 执行 GLM 生成的 JavaScript。
- `main/public/index.html`：唯一的 Workflow Dashboard 页面。
- `migrations/0001_init.sql`、`migrations/0002_workflow_observability.sql`：D1 数据库初始化 SQL，按顺序执行。

两个 Worker 通过公网 HTTPS 通信，不使用 Worker-to-Worker Service Binding。Terminal Worker 的 `LOADER` 是执行 Dynamic Workers 所需的 Cloudflare Worker Loader binding。

## 运行能力

Terminal Worker 执行动态 JavaScript（async function body），支持 `await`、`fetch` 和 Web APIs；它不是 Linux/Bash，不提供 `npm`、`git` 或系统命令。Dynamic Workers 需要 Workers Paid。

## 部署（Cloudflare Dashboard 网页操作）

### 1. 创建 D1

在 Cloudflare Dashboard 的 **Workers & Pages → D1 SQL Database** 创建数据库。打开数据库的 Console，依次执行：

1. `migrations/0001_init.sql`
2. `migrations/0002_workflow_observability.sql`

两个 Worker 都绑定同一个 D1 数据库，Binding 名称必须是 `DB`。

### 2. 创建 Terminal Worker

新建 Worker，将 `terminal/worker.js` 的完整内容粘贴到在线编辑器并部署。

在 Worker 设置中添加：

- **D1 binding**：变量名 `DB`，指向刚创建的数据库。
- **Worker Loader binding**：变量名 `LOADER`。
- **Secret**：`TERMINAL_SHARED_SECRET`。

部署后记下它的 `workers.dev` HTTPS URL。

### 3. 创建主 Worker

新建另一个 Worker，将 `main/worker.js` 的完整内容粘贴到在线编辑器。

绑定与变量：

- **D1 binding**：变量名 `DB`，指向同一个数据库。
- **环境变量**：`TERMINAL_WORKER_URL`，填入 Terminal Worker 的 HTTPS URL。
- **环境变量**：`CORS_ALLOWED_ORIGINS`，填写允许访问 API 的前端来源；同源 Dashboard 可按实际部署方式配置。
- **可选环境变量**：`GLM_MODEL=glm-5.3`、`GLM_REASONING_EFFORT=max`、`WRITE_MODE_DEFAULT=pr`、`ENABLE_DIRECT_WRITE=false`。
- **Secrets**：`GLM_API_KEY`、`GITHUB_TOKEN`、`AGENT_API_TOKEN`、`TERMINAL_SHARED_SECRET`。

两个 Worker 的 `TERMINAL_SHARED_SECRET` 必须完全相同。不要把任何 Secret 写入 HTML 或公开仓库。

将唯一的 Dashboard 文件 `main/public/index.html` 作为主 Worker 的静态资源发布，并按 Cloudflare Dashboard 当前的静态资源配置方式关联到主 Worker。页面本身不包含 API Token；用户在浏览器输入的 Token 只存于当前会话的 `sessionStorage`。

### 4. 打开控制台

部署完成后打开主 Worker 的 Dashboard 路径。输入 `AGENT_API_TOKEN`、GitHub Owner/Repository、分支和任务描述，即可启动任务并查看实时事件及 D1 历史记录。

## API 路由

- `GET /health`：健康检查。
- `GET /dashboard`：工作流控制台。
- `POST /agent`：同步 Agent API。
- `POST /agent/stream`：SSE 实时执行 API。
- `GET /workflow/runs?limit=20`：查询最近运行记录（Bearer Token）。
- `GET /workflow/:run_id`：查询运行详情和事件时间线（Bearer Token）。
- `POST /pull`：读取仓库文件（Bearer Token）。

GLM 可调用的终端工具：`terminal_run({ code, input })`、`terminal_status({ task_id })`、`terminal_logs({ task_id })`。

## 安全提示

- `AGENT_API_TOKEN` 和 `TERMINAL_SHARED_SECRET` 不要提交到公共仓库或写入浏览器源码。
- `/dashboard` 页面可以公开访问，但执行和历史查询 API 需要 Bearer Token。
- Direct 写入默认关闭；只有在确有需要时才设置 `ENABLE_DIRECT_WRITE=true`。
- Dynamic Worker 的 CPU、内存、请求时长和平台配额仍受 Cloudflare 运行时限制。
