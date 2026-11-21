# GLM GitHub Agent + Terminal Worker + Workflow Console

本项目由两个独立的 Cloudflare Workers 组成：

- `main/worker.js`：GLM-5.3 主 Agent、GitHub 工具、PR/CI、SSE 工作流事件和 HTML 控制台。
- `terminal/worker.js`：通过 Cloudflare Dynamic Workers 执行 GLM 生成的 JavaScript。
- `main/public/index.html`：Workflow Console 页面，由主 Worker 的 `ASSETS` 静态资源绑定提供；根目录 `dashboard.html` 是可单独编辑的副本。
- `migrations/0001_init.sql`：限流、幂等和终端任务表。
- `migrations/0002_workflow_observability.sql`：Agent 运行记录和事件时间线。

两个 Worker 通过公网 HTTPS 通信，不使用 Worker Service Binding。Terminal Worker 使用 `LOADER` Worker Loader binding，这是执行 Dynamic Worker 的 Cloudflare 平台接口，不是两个 Worker 之间的通信绑定。

## 运行能力说明

Terminal Worker 执行的是动态 JavaScript（async function body），可使用 `await`、`fetch` 和 Web APIs；不是 Linux/Bash，不提供 `npm`、`git` 或系统命令。Dynamic Workers 需要 Workers Paid。动态代码默认继承宿主 Worker 的公网网络访问能力；不要将 GLM/GitHub 等主 Worker Secrets 注入动态 Worker。

## 1. 创建 D1

```bash
npx wrangler d1 create glm-agent-db
```

把返回的 `database_id` 填入 `main/wrangler.toml` 和 `terminal/wrangler.toml`。

从项目根目录执行迁移：

```bash
npx wrangler d1 migrations apply glm-agent-db --remote --config main/wrangler.toml
```

如果你已经部署过旧版并执行过 `0001_init.sql`，只会补跑新的 `0002_workflow_observability.sql`，不需要删除数据库。

## 2. 配置 Secrets

主 Worker：

```bash
npx wrangler secret put GLM_API_KEY --config main/wrangler.toml
npx wrangler secret put GITHUB_TOKEN --config main/wrangler.toml
npx wrangler secret put AGENT_API_TOKEN --config main/wrangler.toml
npx wrangler secret put TERMINAL_SHARED_SECRET --config main/wrangler.toml
```

Terminal Worker：

```bash
npx wrangler secret put TERMINAL_SHARED_SECRET --config terminal/wrangler.toml
```

两个 Worker 的 `TERMINAL_SHARED_SECRET` 必须相同。`AGENT_API_TOKEN` 是主 API 和工作流查询 API 的 Bearer Token。控制台会要求在页面中输入它，只存于当前浏览器 `sessionStorage`，不要把它写进公开前端代码。

## 3. 配置 Terminal Worker URL

先部署 Terminal Worker，得到其 `workers.dev` URL：

```bash
npx wrangler deploy --config terminal/wrangler.toml
```

把 URL 填到 `main/wrangler.toml` 的 `TERMINAL_WORKER_URL`。

## 4. 部署主 Worker

```bash
npx wrangler deploy --config main/wrangler.toml
```

打开：

```text
https://YOUR_MAIN_WORKER.workers.dev/dashboard
```

在控制台输入 `AGENT_API_TOKEN`、GitHub Owner/Repository、分支和任务描述，即可实时观察 Agent 工作流。

## 5. API 路由

- `GET /health`：健康检查。
- `GET /dashboard`：工作流控制台 HTML。
- `POST /agent`：同步 Agent API。
- `POST /agent/stream`：SSE 实时执行 API。
- `GET /workflow/runs?limit=20`：查询最近运行记录（Bearer Token）。
- `GET /workflow/:run_id`：查询运行详情和完整事件时间线（Bearer Token）。
- `POST /pull`：读取仓库文件（Bearer Token）。

GLM 可调用的终端工具：

- `terminal_run({ code, input })`
- `terminal_status({ task_id })`
- `terminal_logs({ task_id })`

## 6. Workflow Console 展示内容

- GLM 思考轮次和消息数量。
- 每次 GitHub / Terminal 工具调用、参数摘要和执行状态。
- Terminal 执行结果预览、日志和任务 ID（由工具结果返回）。
- PR 创建事件。
- 最终回复、运行状态、耗时、工具调用数。
- D1 历史任务列表，支持打开旧任务查看完整事件。

## 7. 已修复的问题

- 限流改用 D1 原子计数，避免 isolate 内存 Map 在多实例下失效。
- 幂等键按仓库与 requestId 隔离。
- 不再接受客户端传入 `allowSensitive` 来绕过敏感路径保护。
- Direct 写入要求服务端 `ENABLE_DIRECT_WRITE=true` 且请求显式确认。
- `/pull` 及 Agent API 统一校验 JSON Content-Type 和实际请求体字节数。
- GitHub owner/repo/branch/path 参数校验及 URL path 编码。
- 搜索默认字面量匹配，正则模式限制高风险语法并重置正则状态。
- Transcript 压缩按完整消息组处理，避免孤立 tool call/tool result。
- GLM 工具参数解析失败时显式返回工具错误。
- 工作流事件在 runAgent 中 await 后再继续，保证 D1 和 SSE 事件顺序。

## 注意

- `AGENT_API_TOKEN` 和 `TERMINAL_SHARED_SECRET` 都不要放进公共仓库或浏览器源码。
- `/dashboard` 页面本身可公开访问，但所有数据查询和执行 API 都要求 Bearer Token。
- Direct 模式默认关闭；需要时在主 Worker 配置 `ENABLE_DIRECT_WRITE=true`。
- Dynamic Worker 的 CPU、内存、请求时长和平台配额仍然受 Cloudflare 运行时限制。