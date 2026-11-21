// worker.js — Cloudflare Worker: GLM GitHub Repo Agent (GLM-5.3)
//
// 必填 Secrets: GLM_API_KEY, GITHUB_TOKEN, AGENT_API_TOKEN, TERMINAL_SHARED_SECRET
// 必填 Binding: DB (D1)
// 必填 Var:     CORS_ALLOWED_ORIGINS (逗号分隔), TERMINAL_WORKER_URL
// 可选 Var:    GLM_MODEL(默认 glm-5.3)
//              GLM_REASONING_EFFORT(默认 max, 可选 low|high|max)  ← 替代旧 GLM_THINKING
//              GLM_MAX_TOKENS(默认 32768, 上限 131072)
//              GLM_TEMPERATURE(默认 0.4)
//              GLM_TIMEOUT_MS, GH_TIMEOUT_MS, GITHUB_API_VERSION,
//              AGENT_MAX_ROUNDS, AGENT_SUBREQUEST_BUDGET,
//              AGENT_TRANSCRIPT_MAX_CHARS, TOOL_RESULT_MAX_BYTES,
//              FILE_READ_MAX_LINES, FILE_READ_MAX_BYTES, FILE_WRITE_MAX_BYTES,
//              WRITE_MODE_DEFAULT(pr|direct), ENABLE_DIRECT_WRITE, ALLOWED_PREFIXES, LOG_LEVEL,
//              TERMINAL_TIMEOUT_MS

const GITHUB_API = "https://api.github.com";
const DEFAULT_GLM_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

const _encoder = new TextEncoder();
const _decoder = new TextDecoder();

// ============================================================
// 配置
// ============================================================
function loadConfig(env) {
  const num = (v, d) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : d;
  };
  const reasoningEffort = (env.GLM_REASONING_EFFORT || "max").toLowerCase();
  const validEfforts = ["low", "high", "max"];

  const cfg = {
    glmApiKey: env.GLM_API_KEY,
    glmEndpoint: env.GLM_ENDPOINT || DEFAULT_GLM_ENDPOINT,
    glmModel: env.GLM_MODEL || "glm-5.3",
    // FIX: GLM-5.3 强制思考，不再使用 GLM_THINKING；改用 reasoning_effort
    glmReasoningEffort: validEfforts.includes(reasoningEffort) ? reasoningEffort : "max",
    glmMaxTokens: Math.min(num(env.GLM_MAX_TOKENS, 32768), 131072),
    glmTimeoutMs: num(env.GLM_TIMEOUT_MS, 180000),
    glmTemperature: parseFloat(env.GLM_TEMPERATURE || "0.4"),

    ghToken: env.GITHUB_TOKEN,
    agentApiToken: env.AGENT_API_TOKEN,
    terminalWorkerUrl: (env.TERMINAL_WORKER_URL || "").replace(/\/$/, ""),
    terminalSharedSecret: env.TERMINAL_SHARED_SECRET,
    terminalTimeoutMs: num(env.TERMINAL_TIMEOUT_MS, 60000),
    enableDirectWrite: String(env.ENABLE_DIRECT_WRITE || "false").toLowerCase() === "true",
    ghApiVersion: env.GITHUB_API_VERSION || "2022-11-28",
    ghTimeoutMs: num(env.GH_TIMEOUT_MS, 30000),

    corsOrigins: (env.CORS_ALLOWED_ORIGINS || "")
      .split(",")
      .map((s) => s.trim().replace(/\/$/, ""))
      .filter(Boolean),

    maxRounds: num(env.AGENT_MAX_ROUNDS, 12),
    subrequestBudget: num(env.AGENT_SUBREQUEST_BUDGET, 800),
    transcriptMaxChars: num(env.AGENT_TRANSCRIPT_MAX_CHARS, 120000),
    toolResultMaxBytes: num(env.TOOL_RESULT_MAX_BYTES, 24000),
    fileReadMaxLines: num(env.FILE_READ_MAX_LINES, 400),
    fileReadMaxBytes: num(env.FILE_READ_MAX_BYTES, 40000),
    fileWriteMaxBytes: num(env.FILE_WRITE_MAX_BYTES, 200000),

    writeModeDefault: (env.WRITE_MODE_DEFAULT || "pr").toLowerCase() === "direct"
      ? "direct" : "pr",
    allowedPrefixes: env.ALLOWED_PREFIXES
      ? env.ALLOWED_PREFIXES.split(",").map((s) => s.trim()).filter(Boolean)
      : null,
    logLevel: (env.LOG_LEVEL || "info").toLowerCase(),
  };
  if (!cfg.glmApiKey) throw new Error("缺少 GLM_API_KEY");
  if (!cfg.ghToken) throw new Error("缺少 GITHUB_TOKEN");
  if (!cfg.agentApiToken) throw new Error("缺少 AGENT_API_TOKEN（主 Worker API 认证密钥）");
  if (!cfg.terminalWorkerUrl) throw new Error("缺少 TERMINAL_WORKER_URL");
  if (!cfg.terminalSharedSecret) throw new Error("缺少 TERMINAL_SHARED_SECRET");
  if (!env.DB) throw new Error("缺少 D1 binding：DB");
  return cfg;
}

// ============================================================
// 日志 & 基础工具
// ============================================================
const LOG_ORDER = { debug: 10, info: 20, warn: 30, error: 40 };
function log(cfg, level, event, data = {}) {
  if ((LOG_ORDER[level] || 20) < (LOG_ORDER[cfg?.logLevel] || 20)) return;
  try {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level, event, ...data }));
  } catch { /* ignore */ }
}

function bytesToBase64(bytes) {
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}
function b64EncodeUtf8(str) { return bytesToBase64(_encoder.encode(str)); }
function b64DecodeUtf8(b64) {
  const clean = String(b64).replace(/\s+/g, "");
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return _decoder.decode(bytes);
}

async function fetchWithTimeout(url, init, timeoutMs, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (e?.name === "AbortError") throw new Error(`${label} 超时 (${timeoutMs}ms)`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// FIX: 用 UTF-8 字节数而非 s.length 判断截断
function limitResult(obj, maxBytes) {
  let s;
  try { s = JSON.stringify(obj); } catch { return { _error: "结果序列化失败" }; }
  const bytes = _encoder.encode(s).length;
  if (bytes <= maxBytes) return obj;
  return {
    _truncated: true,
    _original_length: bytes,
    _hint: "结果过大，请用更精确的参数（如 start_line/end_line、glob、max_files）缩小范围",
    head: s.slice(0, Math.max(500, maxBytes - 400)),
  };
}

// ============================================================
// CORS
// ============================================================
function corsHeaders(origin, cfg) {
  const clean = (origin || "").replace(/\/$/, "");
  if (!clean || !cfg.corsOrigins.includes(clean)) return {};
  return {
    "Access-Control-Allow-Origin": clean,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// ============================================================
// 路径安全
// ============================================================
const DEFAULT_DENY = [
  /^\.git(\/|$)/,
  /^\.github\/workflows\//,
  /^\.github\/actions\//,
  /^\.env(\.|$)/,
  /^wrangler\.(toml|json|jsonc)$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /^yarn\.lock$/,
  /^\.npmrc$/,
  /^\.yarnrc(\.yml)?$/,
  /^\.gitmodules$/,
  /(^|\/)\.secrets?(\/|\.|$)/,
  /(^|\/)node_modules\//,
];

function assertSafePath(path, cfg) {
  if (typeof path !== "string" || !path.trim()) throw new Error("路径为空");
  const normalized = path.replace(/\\/g, "/");
  if (normalized.split("/").some((part) => !part || part === "." || part === "..") || normalized.startsWith("/") || normalized.includes("\0"))
    throw new Error(`非法路径: ${path}`);
  path = normalized;
  if (DEFAULT_DENY.some((re) => re.test(normalized)))
    throw new Error(`路径 ${path} 属于敏感文件，禁止通过 Agent API 读取或修改`);
  if (cfg.allowedPrefixes) {
    const ok = cfg.allowedPrefixes.some((p) => normalized === p || normalized.startsWith(p.endsWith("/") ? p : `${p}/`));
    if (!ok) throw new Error(`路径 ${path} 不在白名单内`);
  }
  return normalized;
}

// ============================================================
// Budget & 限流
// ============================================================
class BudgetExceededError extends Error {
  constructor() { super("subrequest 预算已耗尽"); this.name = "BudgetExceededError"; }
}

function makeBudget(limit) {
  let used = 0;
  return {
    limit,
    get used() { return used; },
    remaining() { return Math.max(0, limit - used); },
    use(n = 1) {
      used += n;
      if (used > limit) throw new BudgetExceededError();
    },
    nearLimit() { return used >= limit * 0.85; },
  };
}

async function rateLimit(db, key, limit, windowMs) {
  if (!db) throw new Error("D1 binding DB 不可用");
  const now = Date.now();
  const resetAt = now + windowMs;
  const row = await db.prepare(`
    INSERT INTO rate_limits (bucket, count, reset_at, updated_at)
    VALUES (?, 1, ?, ?)
    ON CONFLICT(bucket) DO UPDATE SET
      count = CASE WHEN rate_limits.reset_at <= ? THEN 1 ELSE rate_limits.count + 1 END,
      reset_at = CASE WHEN rate_limits.reset_at <= ? THEN excluded.reset_at ELSE rate_limits.reset_at END,
      updated_at = excluded.updated_at
    RETURNING count, reset_at
  `).bind(key, resetAt, now, now, now).first();
  return !!row && row.count <= limit;
}

function validateRepoPart(value, label) {
  if (typeof value !== "string" || !/^[A-Za-z0-9_.-]{1,100}$/.test(value) || value === "." || value === "..")
    throw new Error(`${label} 格式非法`);
  return value;
}
function repoPath(owner, repo, suffix) {
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}${suffix}`;
}
function validateGitHubNumber(value, label = "number") {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${label} 必须是正整数`);
  return value;
}

function constantTimeEqual(a, b) {
  const x = _encoder.encode(String(a || ""));
  const y = _encoder.encode(String(b || ""));
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i % (x.length || 1)] || 0) ^ (y[i % (y.length || 1)] || 0);
  return diff === 0;
}
function requireApiAuth(request, token) {
  const header = request.headers.get("Authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  return constantTimeEqual(supplied, token);
}

async function readJsonBody(request, maxBytes = 1_000_000) {
  const ct = (request.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("application/json")) throw new Error("Content-Type 必须为 application/json");
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new Error(`请求体过大（最大 ${maxBytes}B）`);
  const text = await request.text();
  if (_encoder.encode(text).length > maxBytes) throw new Error(`请求体过大（最大 ${maxBytes}B）`);
  try { return JSON.parse(text); }
  catch { throw new Error("请求体不是合法 JSON"); }
}

// ============================================================
// GitHub 客户端
// ============================================================
function ghHeaders(cfg, extra = {}) {
  return {
    Authorization: `Bearer ${cfg.ghToken}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": cfg.ghApiVersion,
    "User-Agent": "glm-repo-agent/3",
    ...extra,
  };
}

async function ghRequest(ctx, method, path, body, opts = {}) {
  ctx.budget.use();
  const { cfg } = ctx;
  const res = await fetchWithTimeout(`${GITHUB_API}${path}`, {
    method,
    headers: ghHeaders(cfg, opts.headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }, cfg.ghTimeoutMs, `GitHub ${method} ${path}`);

  const text = await res.text();

  if (!res.ok) {
    if (res.status === 404 && opts.allow404) return null;
    if (res.status === 422 && opts.allow422) return { __422: true, body: text };
    const snippet = text.slice(0, 400);
    if (res.status === 403 && /rate limit/i.test(snippet))
      throw new Error(`GitHub rate limit: ${snippet}`);
    if (res.status === 401)
      throw new Error(`GitHub 认证失败: 检查 GITHUB_TOKEN`);
    throw new Error(`GitHub ${method} ${path} -> ${res.status}: ${snippet}`);
  }
  return text ? JSON.parse(text) : null;
}

function refPath(branch) {
  return branch.split("/").map(encodeURIComponent).join("/");
}

async function getBranchHead(ctx, branch) {
  const { owner, repo } = ctx;
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/git/ref/heads/${refPath(branch)}`), undefined, { allow404: true });
  if (!data) throw new Error(`分支 ${branch} 不存在`);
  return data.object.sha;
}

async function ensureWorkBranch(ctx) {
  if (ctx.state.workBranch) return ctx.state.workBranch;

  const { owner, repo } = ctx;
  const name = ctx.workBranchName || `agent/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  if (name === ctx.baseBranch)
    throw new Error("工作分支名不能与 base 分支相同");

  const baseSha = await getBranchHead(ctx, ctx.baseBranch);
  const res = await ghRequest(ctx, "POST",
    repoPath(owner, repo, "/git/refs"),
    { ref: `refs/heads/${name}`, sha: baseSha }, { allow422: true });

  if (res && res.__422 && !/already exists/i.test(res.body))
    throw new Error(`创建工作分支失败: ${res.body.slice(0, 200)}`);

  ctx.state.workBranch = name;
  log(ctx.cfg, "info", "branch.created", { owner, repo, branch: name, base: ctx.baseBranch });
  return name;
}

function readBranch(ctx) { return ctx.state.workBranch || ctx.baseBranch; }
function writeBranch(ctx) {
  if (ctx.mode === "direct") return ctx.baseBranch;
  return ctx.state.workBranch; // 调用方必须先 ensureWorkBranch（仅 pr 模式）
}

async function readFileRaw(ctx, path, branch) {
  assertSafePath(path, ctx.cfg, ctx.allowSensitive);
  const { owner, repo } = ctx;
  const b = branch || readBranch(ctx);
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(b)}`));
  if (Array.isArray(data)) throw new Error(`${path} 是目录，请用 list_files`);
  if (data.type !== "file") throw new Error(`${path} 不是普通文件`);
  if (data.size > 2_000_000) throw new Error(`文件 ${path} 超过 2MB`);
  // FIX: 空文件 content 为 ""，不应拒绝
  if (data.content == null) throw new Error(`文件 ${path} 内容不可读`);
  return {
    path: data.path, sha: data.sha, size: data.size,
    content: b64DecodeUtf8(data.content),
  };
}

async function readFileWithRange(ctx, path, startLine, endLine) {
  const { cfg } = ctx;
  const file = await readFileRaw(ctx, path);
  const lines = file.content.split("\n");
  const total = lines.length;

  let from = startLine ? Math.max(0, Math.min(total, startLine - 1)) : 0;
  let to = endLine ? Math.max(from + 1, Math.min(total, endLine)) : Math.min(total, from + cfg.fileReadMaxLines);
  let slice = lines.slice(from, to);
  let content = slice.join("\n");
  let truncated = to < total;

  while (content.length > cfg.fileReadMaxBytes && slice.length > 1) {
    slice.pop(); to -= 1; truncated = true;
    content = slice.join("\n");
  }

  return {
    path: file.path,
    total_lines: total,
    range: [from + 1, to],
    content,
    truncated,
    hint: truncated
      ? `已截断，剩余内容用 start_line=${to + 1} 继续读`
      : undefined,
  };
}

async function writeFileRaw(ctx, path, content, message) {
  assertSafePath(path, ctx.cfg, ctx.allowSensitive);
  const bytes = _encoder.encode(content).length;
  if (bytes > ctx.cfg.fileWriteMaxBytes)
    throw new Error(`内容 ${bytes}B 超过上限 ${ctx.cfg.fileWriteMaxBytes}B`);

  const branch = writeBranch(ctx);
  if (!branch) throw new Error("内部错误：writeBranch 为空（pr 模式应先 ensureWorkBranch）");

  const { owner, repo } = ctx;
  const payload = { message: message || `agent: update ${path}`, content: b64EncodeUtf8(content), branch };

  const existing = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(branch)}`),
    undefined, { allow404: true });
  if (existing) {
    if (Array.isArray(existing) || existing.type !== "file")
      throw new Error(`${path} 已存在但不是普通文件`);
    payload.sha = existing.sha;
  }

  const data = await ghRequest(ctx, "PUT",
    repoPath(owner, repo, `/contents/${path.split("/").map(encodeURIComponent).join("/")}`),
    payload);

  ctx.state.hasWrites = true;
  return {
    path: data.content.path,
    sha: data.content.sha,
    commit: data.commit.sha,
    html_url: data.commit.html_url,
    branch,
  };
}

async function deleteFileRaw(ctx, path, message) {
  assertSafePath(path, ctx.cfg, ctx.allowSensitive);
  const branch = writeBranch(ctx);
  if (!branch) throw new Error("内部错误：writeBranch 为空");

  const { owner, repo } = ctx;
  const existing = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(branch)}`),
    undefined, { allow404: true });
  if (!existing) throw new Error(`${path} 不存在`);
  if (Array.isArray(existing) || existing.type !== "file")
    throw new Error(`${path} 不是普通文件`);

  const data = await ghRequest(ctx, "DELETE",
    repoPath(owner, repo, `/contents/${path.split("/").map(encodeURIComponent).join("/")}`),
    { message: message || `agent: delete ${path}`, sha: existing.sha, branch });

  ctx.state.hasWrites = true;
  return { path, deleted: true, commit: data.commit.sha, html_url: data.commit.html_url, branch };
}

async function listFilesRaw(ctx, path) {
  if (path) assertSafePath(path, ctx.cfg, ctx.allowSensitive);
  const branch = readBranch(ctx);
  const qs = path ? `/${path.split("/").map(encodeURIComponent).join("/")}` : "";
  const { owner, repo } = ctx;
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/contents${qs}?ref=${encodeURIComponent(branch)}`));
  const items = Array.isArray(data) ? data : [data];
  const mapped = items.map((it) => ({
    name: it.name, path: it.path, type: it.type, size: it.size ?? null,
  }));
  // FIX: GitHub Contents API 单次最多返回 1000 项，超出时标记
  return {
    path: path || "",
    items: mapped,
    truncated: mapped.length >= 1000,
    hint: mapped.length >= 1000 ? "目录项超过 1000，可能不完整" : undefined,
  };
}

async function getTreeRaw(ctx) {
  const branch = readBranch(ctx);
  const { owner, repo } = ctx;
  const head = await getBranchHead(ctx, branch);
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/git/trees/${head}?recursive=1`));
  const blobs = (data.tree || []).filter((t) => t.type === "blob");
  const truncated = !!data.truncated;
  return {
    branch,
    total_files: blobs.length,
    truncated,
    files: blobs.slice(0, 2000).map((t) => ({ path: t.path, size: t.size ?? null })),
  };
}

// FIX: **/ 应匹配零级或多级目录，修复根目录文件扫不到的问题
function matchGlob(path, glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped
    .replace(/\*\*\//g, "__GLOBSTAR_SLASH__")
    .replace(/\*\*/g, "__GLOBSTAR__")
    .replace(/\*/g, "[^/]*")
    .replace(/\?/g, "[^/]")
    .replace(/__GLOBSTAR_SLASH__/g, "(?:.*/)?")
    .replace(/__GLOBSTAR__/g, ".*");
  return new RegExp("^" + pattern + "$").test(path);
}

async function searchCodeRaw(ctx, query, opts = {}) {
  if (!query || typeof query !== "string") throw new Error("query 不能为空");
  // FIX: 限制 query 长度，降低 ReDoS 风险
  if (query.length > 500) throw new Error("query 过长（最大 500 字符）");
  const maxFiles = Math.min(Math.max(opts.max_files || 20, 1), 50);
  const maxResults = Math.min(Math.max(opts.max_results || 50, 1), 200);
  const glob = opts.glob || null;

  const tree = await getTreeRaw(ctx);
  let candidates = tree.files
    .filter((f) => (glob ? matchGlob(f.path, glob) : true))
    .filter((f) => (f.size ?? 0) < 400_000)
    .slice(0, maxFiles);

  let re = null;
  if (opts.regex) {
    // Regex is deliberately limited to a non-repeating subset to avoid catastrophic backtracking.
    if (/[?*+{]/.test(query) || /\\[1-9]/.test(query) || /\(\?/.test(query))
      throw new Error("regex 模式仅支持无重复量词的简单正则；请移除 ?、*、+、{n} 等量词，或使用字面量搜索");
    try { re = new RegExp(query); }
    catch (e) { throw new Error(`正则表达式无效: ${e.message}`); }
  }

  const results = [];
  for (const f of candidates) {
    if (results.length >= maxResults) break;
    if (ctx.budget.remaining() < 5) break;
    try {
      const file = await readFileRaw(ctx, f.path, tree.branch);
      const lines = file.content.split("\n");
      for (let i = 0; i < lines.length && results.length < maxResults; i++) {
        const matched = re ? (re.lastIndex = 0, re.test(lines[i])) : lines[i].includes(query);
        if (matched) {
          results.push({ path: f.path, line: i + 1, text: lines[i].slice(0, 240) });
        }
      }
    } catch { /* 跳过读不了的文件 */ }
  }

  return {
    query,
    branch: tree.branch,
    files_scanned: candidates.length,
    total_files_in_repo: tree.total_files,
    truncated_tree: tree.truncated,
    results,
    hint: results.length === 0
      ? "未找到，尝试放宽 glob 或增大 max_files"
      : undefined,
  };
}

async function findOpenPR(ctx, head, base) {
  const { owner, repo } = ctx;
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/pulls?state=open&head=${encodeURIComponent(owner + ":" + head)}&base=${encodeURIComponent(base)}`));
  return Array.isArray(data) && data.length ? data[0] : null;
}

async function createPRRaw(ctx, { title, body, draft }) {
  const { owner, repo } = ctx;
  const head = await ensureWorkBranch(ctx);
  const base = ctx.baseBranch;

  const existing = await findOpenPR(ctx, head, base);
  if (existing) return { number: existing.number, html_url: existing.html_url, existed: true };

  const data = await ghRequest(ctx, "POST",
    repoPath(owner, repo, "/pulls"),
    { head, base, title: title || "AI Agent 变更", body: body || "由 AI Agent 自动提交", draft: !!draft },
    { allow422: true });

  if (data && data.__422) {
    if (/No commits between/i.test(data.body))
      throw new Error("工作分支与 base 之间没有提交，无法创建 PR");
    throw new Error(`创建 PR 失败: ${data.body.slice(0, 200)}`);
  }

  ctx.state.prNumber = data.number;
  ctx.state.prCreated = true;
  return { number: data.number, html_url: data.html_url, existed: false };
}

async function getPRRaw(ctx, number) {
  validateGitHubNumber(number, "PR number");
  const { owner, repo } = ctx;
  const pr = await ghRequest(ctx, "GET", repoPath(owner, repo, `/pulls/${number}`));
  const files = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/pulls/${number}/files?per_page=100`));

  let patchBudget = 30000;
  const fileSummaries = [];
  for (const f of files || []) {
    if (patchBudget <= 0) { fileSummaries.push({ filename: f.filename, note: "patch 已截断" }); continue; }
    const patch = (f.patch || "").slice(0, Math.min(patchBudget, 4000));
    patchBudget -= patch.length;
    fileSummaries.push({
      filename: f.filename, status: f.status,
      additions: f.additions, deletions: f.deletions,
      patch: patch || undefined,
    });
  }

  return {
    number: pr.number,
    title: pr.title,
    state: pr.state,
    draft: pr.draft,
    head: pr.head?.ref,
    base: pr.base?.ref,
    mergeable: pr.mergeable,
    html_url: pr.html_url,
    body: (pr.body || "").slice(0, 2000),
    // FIX: 标记可能还有更多文件
    has_more_files: (files || []).length >= 100,
    files: fileSummaries,
  };
}

async function listPRCommentsRaw(ctx, number) {
  validateGitHubNumber(number, "PR number");
  const { owner, repo } = ctx;
  const [issueComments, reviewComments] = await Promise.all([
    ghRequest(ctx, "GET", repoPath(owner, repo, `/issues/${number}/comments?per_page=50`)),
    ghRequest(ctx, "GET", repoPath(owner, repo, `/pulls/${number}/comments?per_page=50`)),
  ]);
  return {
    issue_comments: (issueComments || []).map((c) => ({
      user: c.user?.login, created_at: c.created_at, body: (c.body || "").slice(0, 1000),
    })),
    review_comments: (reviewComments || []).map((c) => ({
      user: c.user?.login, path: c.path, line: c.line, body: (c.body || "").slice(0, 1000),
    })),
  };
}

async function commentOnPRRaw(ctx, number, body) {
  validateGitHubNumber(number, "PR number");
  if (!body) throw new Error("body 不能为空");
  // FIX: 同一请求内对相同评论做幂等去重
  const commentKey = `${number}:${body.slice(0, 200)}`;
  if (!ctx.state.sentComments) ctx.state.sentComments = new Set();
  if (ctx.state.sentComments.has(commentKey)) {
    return { skipped: true, reason: "duplicate comment in same request" };
  }
  const { owner, repo } = ctx;
  const data = await ghRequest(ctx, "POST",
    repoPath(owner, repo, `/issues/${number}/comments`), { body });
  ctx.state.sentComments.add(commentKey);
  return { id: data.id, html_url: data.html_url };
}

async function getCheckRunsRaw(ctx, ref) {
  const target = ref || readBranch(ctx);
  const { owner, repo } = ctx;
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/commits/${refPath(target)}/check-runs?per_page=50`),
    undefined, { headers: { Accept: "application/vnd.github+json" } });
  return {
    ref: target,
    total: data.total_count,
    check_runs: (data.check_runs || []).map((c) => ({
      name: c.name,
      status: c.status,
      conclusion: c.conclusion,
      output_title: c.output?.title,
      output_summary: (c.output?.summary || "").slice(0, 800),
      html_url: c.html_url,
    })),
  };
}

async function getWorkflowRunsRaw(ctx, ref, limit) {
  const target = ref || readBranch(ctx);
  const { owner, repo } = ctx;
  const n = Math.min(Math.max(limit || 5, 1), 20);
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/actions/runs?branch=${encodeURIComponent(target)}&per_page=${n}`));
  return {
    branch: target,
    total: data.total_count,
    runs: (data.workflow_runs || []).map((r) => ({
      id: r.id, name: r.name, event: r.event, status: r.status,
      conclusion: r.conclusion, head_sha: r.head_sha,
      created_at: r.created_at, html_url: r.html_url,
    })),
  };
}

async function getIssueRaw(ctx, number) {
  validateGitHubNumber(number, "issue number");
  const { owner, repo } = ctx;
  const issue = await ghRequest(ctx, "GET", repoPath(owner, repo, `/issues/${number}`));
  const comments = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/issues/${number}/comments?per_page=20`));
  return {
    number: issue.number, title: issue.title, state: issue.state,
    user: issue.user?.login, labels: (issue.labels || []).map((l) => l.name),
    // FIX: 透出是否为 PR（GitHub issues API 对 PR 也返回）
    is_pull_request: !!issue.pull_request,
    body: (issue.body || "").slice(0, 4000),
    comments: (comments || []).map((c) => ({
      user: c.user?.login, body: (c.body || "").slice(0, 1000),
    })),
  };
}

async function listCommitsRaw(ctx, path, limit) {
  const { owner, repo } = ctx;
  const branch = readBranch(ctx);
  const n = Math.min(Math.max(limit || 10, 1), 50);
  const qs = new URLSearchParams({ sha: branch, per_page: String(n) });
  if (path) qs.set("path", path);
  const data = await ghRequest(ctx, "GET",
    repoPath(owner, repo, `/commits?${qs.toString()}`));
  return {
    branch, path: path || null,
    commits: (data || []).map((c) => ({
      sha: c.sha.slice(0, 12),
      message: (c.commit?.message || "").split("\n")[0].slice(0, 200),
      author: c.commit?.author?.name,
      date: c.commit?.author?.date,
    })),
  };
}

// ============================================================
// Patch / 字符串替换
// ============================================================
function applyStrReplace(content, oldStr, newStr, replaceAll) {
  if (!oldStr) throw new Error("old_string 不能为空");
  const parts = content.split(oldStr);
  const count = parts.length - 1;
  if (count === 0) throw new Error("old_string 在文件中未找到，请先 read_file 确认上下文");
  if (count > 1 && !replaceAll)
    throw new Error(`old_string 在文件中出现 ${count} 次；请提供更长上下文或设置 replace_all:true`);
  // FIX: 原实现非 replaceAll 分支双重拼接尾部，会损坏文件
  return replaceAll ? parts.join(newStr) : parts[0] + newStr + parts[1];
}

function parsePatch(patch) {
  const lines = String(patch).split(/\r?\n/);
  const hunks = [];
  let cur = null;
  for (const line of lines) {
    if (line.startsWith("---") || line.startsWith("+++") || line.startsWith("diff ")) continue;
    if (line === "\\ No newline at end of file") continue;
    const m = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (m) {
      if (cur) hunks.push(cur);
      cur = {
        oldStart: +m[1],
        oldLines: m[2] !== undefined ? +m[2] : 1,
        newStart: +m[3],
        newLines: m[4] !== undefined ? +m[4] : 1,
        lines: [],
      };
      continue;
    }
    if (cur) {
      if (line.length === 0) { cur.lines.push(" "); continue; }
      const tag = line[0];
      if (tag === " " || tag === "-" || tag === "+") cur.lines.push(line);
      else throw new Error(`无法解析 patch 行: ${line.slice(0, 60)}`);
    }
  }
  if (cur) hunks.push(cur);
  return hunks;
}

function findBlockMatch(fileLines, block, hint) {
  const tryAt = (i) => {
    if (i < 0 || i + block.length > fileLines.length) return false;
    for (let k = 0; k < block.length; k++) if (fileLines[i + k] !== block[k]) return false;
    return true;
  };
  if (tryAt(hint)) return hint;
  for (let d = 1; d <= fileLines.length; d++) {
    if (tryAt(hint - d)) return hint - d;
    if (tryAt(hint + d)) return hint + d;
  }
  if (block.length <= 50) {
    for (let i = 0; i <= fileLines.length - block.length; i++) if (tryAt(i)) return i;
  }
  return -1;
}

function applyPatch(content, patch) {
  const hunks = parsePatch(patch);
  if (!hunks.length) throw new Error("patch 为空或格式不正确");

  const lines = content.split("\n");
  // FIX: 维护累计行偏移，修复多 hunk 时后续 hunk 位置漂移
  let lineDelta = 0;
  for (const h of hunks) {
    const oldBlock = [];
    const newBlock = [];
    for (const l of h.lines) {
      const tag = l[0];
      const text = l.slice(1);
      if (tag === " ") { oldBlock.push(text); newBlock.push(text); }
      else if (tag === "-") { oldBlock.push(text); }
      else if (tag === "+") { newBlock.push(text); }
    }
    const hint = Math.max(0, h.oldStart - 1 + lineDelta);
    const idx = findBlockMatch(lines, oldBlock, hint);
    if (idx < 0)
      throw new Error(`hunk @@ -${h.oldStart},${h.oldLines} 无法匹配上下文，请重新读取文件后生成 patch`);
    lines.splice(idx, oldBlock.length, ...newBlock);
    lineDelta += newBlock.length - oldBlock.length;
  }
  return lines.join("\n");
}

function makePreview(before, after, path) {
  const a = before.split("\n"), b = after.split("\n");
  return {
    path,
    lines_before: a.length,
    lines_after: b.length,
    delta: b.length - a.length,
    head: b.slice(0, 20),
    tail: b.slice(-20),
    note: "dry_run 预览：head/tail 仅展示前后片段",
  };
}

// ============================================================
// 工具定义
// ============================================================
const TOOLS = [
  {
    type: "function",
    function: {
      name: "read_file",
      description: "读取仓库中文件内容（默认读工作分支）。大文件请配合 start_line/end_line 分段读。",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "文件路径" },
          start_line: { type: "integer", description: "起始行（1-based，含）" },
          end_line: { type: "integer", description: "结束行（1-based，含）" },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_files",
      description: "列出目录下的文件/子目录（不递归）。",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "目录路径，根目录传空字符串" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_tree",
      description: "一次性获取仓库完整文件树（推荐先调用，比 list_files 逐层爬高效）。",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "search_code",
      description: "在仓库中按正则搜索代码内容。先缩小 glob 再搜索。",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "默认按字面量搜索；regex:true 时按正则搜索" },
          regex: { type: "boolean", description: "是否将 query 作为正则表达式" },
          glob: { type: "string", description: "如 src/**/*.ts" },
          max_files: { type: "integer", description: "最多扫描文件数，默认 20" },
          max_results: { type: "integer", description: "最多返回结果数，默认 50" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "创建新文件，或完全重写已有文件。修改已有文件优先用 str_replace/apply_patch。",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          content: { type: "string", description: "完整 UTF-8 内容" },
          message: { type: "string", description: "commit message" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "str_replace",
      description: "在文件中把 old_string 替换为 new_string。old_string 必须唯一（或设置 replace_all）。",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          old_string: { type: "string" },
          new_string: { type: "string" },
          replace_all: { type: "boolean" },
          message: { type: "string" },
        },
        required: ["path", "old_string", "new_string"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "apply_patch",
      description: "应用 unified diff 格式的 patch 到单个文件。",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          patch: { type: "string", description: "unified diff 文本" },
          message: { type: "string" },
        },
        required: ["path", "patch"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_file",
      description: "删除文件。",
      parameters: {
        type: "object",
        properties: { path: { type: "string" }, message: { type: "string" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_pr",
      description: "以工作分支为 head、base 分支为 base 创建/复用 PR。",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          draft: { type: "boolean" },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_pr",
      description: "获取 PR 详情与文件 diff。",
      parameters: { type: "object", properties: { number: { type: "integer" } }, required: ["number"] },
    },
  },
  {
    type: "function",
    function: {
      name: "list_pr_comments",
      description: "列出 PR 的 issue 评论与 review 评论。",
      parameters: { type: "object", properties: { number: { type: "integer" } }, required: ["number"] },
    },
  },
  {
    type: "function",
    function: {
      name: "comment_on_pr",
      description: "在 PR 上发评论。",
      parameters: {
        type: "object",
        properties: { number: { type: "integer" }, body: { type: "string" } },
        required: ["number", "body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_check_runs",
      description: "获取某分支/commit 的 CI check runs（用于判断改动是否通过）。",
      parameters: { type: "object", properties: { ref: { type: "string", description: "分支或 SHA，默认当前工作分支" } } },
    },
  },
  {
    type: "function",
    function: {
      name: "get_workflow_runs",
      description: "获取分支上最近的 GitHub Actions workflow runs。",
      parameters: {
        type: "object",
        properties: { ref: { type: "string" }, limit: { type: "integer" } },
      },
    },
  },
  {