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
\n## 本轮完成的生产能力\n\n- 注册时选择 **教练 / 学生**，并选择已有学校或直接创建学校；学校进入共享目录。\n- 学生与教练均绑定唯一学校，考试参加范围由学校控制。\n- 题库支持人工题号（如 `011-079`）、OCR、解析、难度系数、题型与来源维护。\n- 教练可创建 Paper、上传文档、创建本校/跨校考试，并选择参加学校。\n- 答案键可以随时发布；每次发布生成新版本。\n- B3 评分版本支持历史保留，并可重新指定历史版本为当前版本。\n- 成绩页支持题目级明细：学生答案、正确答案、得分与结果。\n- 历史成绩支持 Excel / CSV 导入：第一行为答案键、第一列为学生姓名、B2 起为答案；浏览器自动识别 TF / ABCD，Worker 做确定性评分并保存原始/规范化答案。\n- LLM 模型列表已收窄为两款 NVIDIA Nemotron：`nvidia/nemotron-3-super-120b-a12b` 与 `nvidia/nemotron-3-ultra-550b-a55b`。\n- 前端加入登录/注册、角色化导航、学校管理、题目编辑、答案键编辑、评分版本管理与历史成绩导入。