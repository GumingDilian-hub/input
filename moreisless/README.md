# moreisless

Biology competition question-bank and examination workspace.

This first frontend prototype is intentionally dependency-free: plain HTML, CSS and JavaScript. It is designed as the visual shell for the later Worker/API implementation.

## Included

- School / coach / student workspace model
- Exam dashboard and live examination workspace
- Long-document reader + answer sheet concept
- Offline-first answer state
- Indefinite-selection answers
- Question-level OCR / solution / discussion entry points
- Named discussion with coach moderation affordances
- Score-version history with immutable historical versions and explicit current version
- Inter-school results: own-school names visible; other schools show school only
- Responsive layout
- Restrained neutral visual system; no gradients or decorative color noise

## Run

Open `index.html` directly, or serve the folder with any static HTTP server.

The current files are a frontend prototype. Persistence, authentication, GitHub storage, Cloudflare Worker APIs, PDF/Word conversion, OCR, deterministic scoring and NVIDIA model calls should be wired in subsequent iterations.


## 文档上传与实时考试

- Paper 文档上传接口：POST /api/papers/:id/document
- Worker 通过 `GITHUB_TOKEN` 写入 `GITHUB_REPO` / `GITHUB_BRANCH` 指定的仓库路径 `moreisless/documents/<paper-code>/...`
- 部署前请配置：
  - `wrangler secret put GITHUB_TOKEN`
  - `wrangler deploy`
- D1 仍需把 `wrangler.toml` 中的 `database_id` 换成实际数据库 ID。
- 实时考试答案先写浏览器本地存储，再后台同步；截止时间由服务端 deadline 约束。断网到截止后，本地会锁定答题，恢复网络后自动提交。
- PDF 使用内置文档阅读区；Word 文件使用浏览器端 Office 阅读入口。Paper 与 Exam 分离，文档只存一次。
- 评分版本保持历史版本；重新设置答案键并计算会产生新的 score version。
