// terminal-worker.js — Public HTTP endpoint + Cloudflare Dynamic Workers execution.
// Required secrets: TERMINAL_SHARED_SECRET
// Required bindings: DB (D1), LOADER (Worker Loader)

const encoder = new TextEncoder();
const COMPATIBILITY_DATE = "2026-10-01";
const MAX_REQUEST_BYTES = 1_000_000;
const MAX_STORED_OUTPUT_BYTES = 100_000;

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

function constantTimeEqual(a, b) {
  const x = encoder.encode(String(a || ""));
  const y = encoder.encode(String(b || ""));
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i % (x.length || 1)] || 0) ^ (y[i % (y.length || 1)] || 0);
  return diff === 0;
}

function authorized(request, env) {
  const header = request.headers.get("Authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  return !!env.TERMINAL_SHARED_SECRET && constantTimeEqual(supplied, env.TERMINAL_SHARED_SECRET);
}

async function readJson(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("application/json")) throw new Error("Content-Type 必须为 application/json");
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_REQUEST_BYTES) throw new Error("请求体过大");
  const raw = await request.text();
  if (encoder.encode(raw).length > MAX_REQUEST_BYTES) throw new Error("请求体过大");
  try { return JSON.parse(raw); }
  catch { throw new Error("请求体不是合法 JSON"); }
}

function safeString(value) {
  if (typeof value === "string") return value;
  try { const result = JSON.stringify(value); return result === undefined ? String(value) : result; }
  catch { return String(value); }
}

function stringifyBounded(value) {
  let raw;
  try { raw = JSON.stringify(value === undefined ? null : value); }
  catch (error) { raw = JSON.stringify({ serialization_error: error.message }); }
  if (encoder.encode(raw).length <= MAX_STORED_OUTPUT_BYTES) return { json: raw, truncated: false };
  let out = raw;
  while (encoder.encode(out).length > MAX_STORED_OUTPUT_BYTES - 100) out = out.slice(0, Math.floor(out.length * 0.8));
  return { json: JSON.stringify({ _truncated: true, preview: out }), truncated: true };
}

function buildDynamicModule(code) {
  // The submitted source is compiled as part of a Dynamic Worker module, not eval'ed
  // inside the long-lived host Worker. The code is an async function body.
  const marker = "/*__GLM_USER_CODE__*/";
  const template = `
const __safeString = (v) => {
  if (typeof v === "string") return v;
  try { return JSON.stringify(v); } catch { return String(v); }
};
export default {
  async fetch(request) {
    const payload = await request.json();
    const input = payload && payload.input !== undefined ? payload.input : {};
    const logs = [];
    const console = {
      log: (...args) => logs.push(args.map(__safeString).join(" ")),
      info: (...args) => logs.push(args.map(__safeString).join(" ")),
      warn: (...args) => logs.push("WARN " + args.map(__safeString).join(" ")),
      error: (...args) => logs.push("ERROR " + args.map(__safeString).join(" ")),
      debug: (...args) => logs.push("DEBUG " + args.map(__safeString).join(" ")),
    };
    try {
      const run = async (input, console) => {
        ${marker}
      };
      const result = await run(input, console);
      let resultJson;
      try { resultJson = JSON.stringify(result === undefined ? null : result); }
      catch (error) { resultJson = JSON.stringify({ serialization_error: error.message }); }
      return Response.json({ ok: true, result: resultJson === undefined ? null : JSON.parse(resultJson), logs });
    } catch (error) {
      return Response.json({ ok: false, error: error && error.message ? error.message : String(error), stack: error && error.stack ? String(error.stack).slice(0, 8000) : null, logs }, { status: 200 });
    }
  }
};
`;
  return template.replace(marker, () => code);
}

async function createTask(db, task) {
  await db.prepare(`INSERT INTO terminal_tasks
    (task_id, status, code, input_json, created_at, updated_at)
    VALUES (?, 'running', ?, ?, ?, ?)`)
    .bind(task.taskId, task.code, JSON.stringify(task.input ?? {}), task.now, task.now).run();
}

async function updateTask(db, taskId, fields) {
  await db.prepare(`UPDATE terminal_tasks SET status = ?, result_json = ?, logs_json = ?, error = ?, duration_ms = ?, updated_at = ? WHERE task_id = ?`)
    .bind(fields.status, fields.resultJson, fields.logsJson, fields.error, fields.durationMs, Date.now(), taskId).run();
}

async function runCode(request, env) {
  if (!env.DB) throw new Error("缺少 D1 binding：DB");
  if (!env.LOADER) throw new Error("缺少 Worker Loader binding：LOADER");
  const body = await readJson(request);
  if (typeof body.code !== "string" || !body.code.trim()) throw new Error("code 必须是非空 JavaScript 字符串");
  const taskId = crypto.randomUUID();
  const startedAt = Date.now();
  const input = body.input === undefined ? {} : body.input;
  await createTask(env.DB, { taskId, code: body.code, input, now: startedAt });

  try {
    const moduleSource = buildDynamicModule(body.code);
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(moduleSource));
    const codeId = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    const worker = env.LOADER.get(`glm-terminal-${codeId}`, async () => ({
      compatibilityDate: COMPATIBILITY_DATE,
      mainModule: "glm-terminal.js",
      modules: { "glm-terminal.js": moduleSource },
      // Leave globalOutbound unset: generated code can call public APIs with fetch().
    }));
    const entrypoint = worker.getEntrypoint();
    const dynamicResponse = await entrypoint.fetch(new Request("https://dynamic-worker.internal/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    }));
    const dynamicText = await dynamicResponse.text();
    let dynamicData;
    try { dynamicData = JSON.parse(dynamicText); }
    catch { throw new Error(`Dynamic Worker 返回非 JSON: ${dynamicText.slice(0, 1000)}`); }

    const result = stringifyBounded(dynamicData.result);
    const logs = stringifyBounded(dynamicData.logs || []);
    const durationMs = Date.now() - startedAt;
    const ok = dynamicData.ok === true;
    await updateTask(env.DB, taskId, {
      status: ok ? "completed" : "failed",
      resultJson: result.json,
      logsJson: logs.json,
      error: ok ? null : String(dynamicData.error || "JavaScript execution failed").slice(0, 8000),
      durationMs,
    });
    return {
      ok,
      task_id: taskId,
      status: ok ? "completed" : "failed",
      duration_ms: durationMs,
      result: JSON.parse(result.json),
      logs: JSON.parse(logs.json),
      ...(dynamicData.error ? { error: dynamicData.error, stack: dynamicData.stack } : {}),
      output_truncated: result.truncated || logs.truncated,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    await updateTask(env.DB, taskId, {
      status: "failed", resultJson: "null", logsJson: "[]",
      error: String(error?.message || error).slice(0, 8000), durationMs,
    });
    return { ok: false, task_id: taskId, status: "failed", duration_ms: durationMs, error: error?.message || String(error) };
  }
}

async function getTask(env, taskId, includeLogs = false) {
  if (!/^[0-9a-f-]{36}$/i.test(taskId)) return json({ ok: false, error: "task_id 格式非法" }, 400);
  const row = await env.DB.prepare(`SELECT task_id, status, result_json, logs_json, error, duration_ms, created_at, updated_at
    FROM terminal_tasks WHERE task_id = ?`).bind(taskId).first();
  if (!row) return json({ ok: false, error: "任务不存在" }, 404);
  if (includeLogs) return json({ ok: true, task_id: row.task_id, logs: JSON.parse(row.logs_json || "[]"), status: row.status });
  return json({
    ok: true, task_id: row.task_id, status: row.status,
    result: row.result_json ? JSON.parse(row.result_json) : null,
    error: row.error, duration_ms: row.duration_ms,
    created_at: row.created_at, updated_at: row.updated_at,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "glm-terminal-worker", dynamic_workers: !!env.LOADER, d1: !!env.DB, ts: Date.now() });
    }
    if (!authorized(request, env)) return json({ ok: false, error: "未授权" }, 401);
    try {
      if (request.method === "POST" && url.pathname === "/run") return json(await runCode(request, env));
      const match = url.pathname.match(/^\/tasks\/([^/]+)(\/logs)?$/);
      if (request.method === "GET" && match) return await getTask(env, decodeURIComponent(match[1]), !!match[2]);
      return json({ ok: false, error: "Not Found" }, 404);
    } catch (error) {
      const message = error?.message || String(error);
      const status = /必须|过大|非空|格式非法|Content-Type|合法 JSON/.test(message) ? 400 : 500;
      return json({ ok: false, error: message }, status);
    }
  },
};