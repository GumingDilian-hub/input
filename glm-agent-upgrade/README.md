# GLM GitHub Agent（主 Worker 独立版）

当前先部署一个主 Cloudflare Worker。Terminal Worker 不是必需组件，主 Agent 不依赖 Terminal Worker、Worker Loader、TERMINAL_WORKER_URL 或 TERMINAL_SHARED_SECRET。

## 功能
- GLM 多轮工具调用。
- GitHub 仓库读取、搜索、写入、删除、PR、Issue、CI 与 workflow 查询。
- 默认通过 PR 工作分支写入；Direct 写入需要服务端显式启用并由请求确认。
- D1 限流与工作流运行记录。
- /health、/agent、/run、/workflow/runs、/workflow/:run_id、/pull API。

当前版本不执行终端命令，也不提供 Bash/Linux shell。

## 1. 创建 D1
在 Cloudflare Dashboard → Workers & Pages → D1 SQL Database 创建数据库，例如 glm-agent-db。

将主 Worker 绑定到该数据库，Binding 名称必须为 DB。

你已经在 D1 Console 执行过之前提供的 11 条 SQL，因此不需要重复执行。仓库中的两份 migration 已同步为同一套表结构，供后续新建数据库时使用。

## 2. 创建主 Worker
在 Cloudflare Dashboard → Workers & Pages → Create → Worker 创建 Worker，例如 glm-github-agent。

将 main/worker.js 的完整内容粘贴到在线编辑器并部署。

### D1 Binding
| 类型 | Variable name | Database |
|---|---|---|
| D1 database | DB | glm-agent-db |

### Secrets
在 Worker → Settings → Variables and Secrets 中添加：
| 名称 | 内容 |
|---|---|
| GLM_API_KEY | 你的智谱 GLM API Key |
| GITHUB_TOKEN | 有目标仓库读写权限的 GitHub Token |
| AGENT_API_TOKEN | 自己生成的高强度随机 API Token |

### 普通环境变量
| 名称 | 值 |
|---|---|
| CORS_ALLOWED_ORIGINS | 暂无浏览器前端时可留空；有前端时填它的 Origin |
| GLM_MODEL | glm-5.3 |
| GLM_REASONING_EFFORT | max |
| WRITE_MODE_DEFAULT | pr |
| ENABLE_DIRECT_WRITE | false |

GLM_ENDPOINT、GLM_MAX_TOKENS、GLM_TEMPERATURE、GLM_TIMEOUT_MS、GH_TIMEOUT_MS、AGENT_MAX_ROUNDS、AGENT_SUBREQUEST_BUDGET 等均可使用代码默认值。

## 3. 验证 Worker
部署后访问 https://你的Worker域名/health，应返回 {"ok":true,"service":"glm-github-agent"}。

向 https://你的Worker域名/agent 发送 POST 请求。请求需要：
- Header：Authorization: Bearer 你的AGENT_API_TOKEN
- Header：Content-Type: application/json
- JSON Body 示例：

```json
{
  "owner": "你的GitHub用户名或组织",
  "repo": "目标仓库",
  "branch": "main",
  "prompt": "检查仓库结构并总结主要模块",
  "mode": "pr"
}
```

/agent 和 /run 当前是同步 JSON API。main/public/index.html 是独立的前端文件；当前 Worker 尚未配置静态资源绑定，也没有 /dashboard 或 SSE 路由，因此它还不是可直接访问的在线 Dashboard。

## 安全说明
- 不要把 API Token、GLM Key 或 GitHub Token 放进 HTML 或公开仓库。
- 默认 WRITE_MODE_DEFAULT=pr，建议先用 PR 模式验证。
- Direct 写入默认关闭；除非确有需要，不要开启 ENABLE_DIRECT_WRITE。
