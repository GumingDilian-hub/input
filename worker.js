// ============================================================
// Cloudflare Worker
// D1 + Blog + Comments + Copilot + 多级目录知识库1
// Bindings: DB -> D1, NIM -> Secret, GH_TEXTBOOK -> 根目录 URL, COPILOT_HISTORY -> KV
// ============================================================

const MAX_USERNAME_LENGTH = 32, MAX_PASSWORD_LENGTH = 128, MAX_TITLE_LENGTH = 200, MAX_CONTENT_LENGTH = 500000, MAX_COMMENT_LENGTH = 5000;

const DEFAULT_MODEL = 'meta/llama-3.3-70b-instruct', ROUTER_MODEL = 'nvidia/nemotron-3-super-120b-a12b', TOC_CACHE_TTL = 60 * 60 * 1000;

const MODEL_LIST = [
  { id: 'nvidia/nemotron-3-super-120b-a12b', name: 'NVIDIA 3 super', icon: '1.png' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b', name: 'NVIDIA 3 Ultra', icon: '1.png' },
  { id: 'meta/llama-3.3-70b-instruct', name: 'Meta 3.3', icon: '2.png' },
  { id: 'meta/llama-3.2-90b-vision-instruct', name: 'Meta 3.2 视觉', icon: '2.png' },
  { id: 'openai/gpt-oss-120b', name: 'ChatGPT', icon: '3.png' },
  { id: 'openai/gpt-oss-20b', name: 'CatGPT', icon: '3.png' },
  { id: 'minimaxai/minimax-m3', name: 'MiniMax', icon: '5.png' },
  { id: 'deepseek-ai/deepseek-v4-flash', name: 'DeepSeek V4', icon: '6.png' },
  { id: 'deepseek-ai/deepseek-v4-flash-0731', name: 'DeepSeek V4 (0731)', icon: '6.png' },
  { id: 'google/diffusiongemma-26b-a4b-it', name: 'Diffusion Gemma', icon: '4.png' },
  { id: 'z-ai/glm4.7', name: 'GLM 4.7', icon: '7.png' },
  { id: 'google/gemma-4-31b-it', name: 'Google Gemma 4', icon: '4.png' }
];
const VALID_MODELS = new Set(MODEL_LIST.map(m => m.id));

// 模型上下文上限（字符数，用于后端硬性校验）
const MODEL_CHAR_LIMITS = {
  'nvidia/nemotron-3-super-120b-a12b': 480000,
  'nvidia/nemotron-3-ultra-550b-a55b': 480000,
  'meta/llama-3.3-70b-instruct': 60000,
  'meta/llama-3.2-90b-vision-instruct': 60000,
  'openai/gpt-oss-120b': 60000,
  'openai/gpt-oss-20b': 60000,
  'minimaxai/minimax-m3': 480000,
  'deepseek-ai/deepseek-v4-flash': 480000,
  'deepseek-ai/deepseek-v4-flash-0731': 480000,
  'z-ai/glm4.7': 60000,
  'google/diffusiongemma-26b-a4b-it': 100000,
  'google/gemma-4-31b-it': 100000
};
const DEFAULT_CHAR_LIMIT = 60000;

let tocCache = null, tocCacheAt = 0;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
  });
}
function optionsResponse() { return new Response(null, { status: 204, headers: CORS_HEADERS }); }

function getTokenFromRequest(request) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  return token || null;
}
async function getUser(request, env) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return await env.DB.prepare('SELECT * FROM users WHERE token = ?').bind(token).first();
}
function getSafeUser(user) {
  if (!user) return null;
  const { password, token, ...safeUser } = user;
  return safeUser;
}

function bytesToHex(bytes) { return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''); }
function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hash));
}
async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return 'pbkdf2$100000$' + bytesToHex(salt) + '$' + bytesToHex(new Uint8Array(bits));
}
function hexToBytes(hex) {
  if (typeof hex !== 'string' || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) throw new Error('Invalid hex');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}
async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return { valid: false, legacy: false };
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return { valid: false, legacy: false };
    const iterations = Number(parts[1]), saltHex = parts[2], expectedHex = parts[3];
    if (!Number.isInteger(iterations) || iterations < 1 || !/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(expectedHex))
      return { valid: false, legacy: false };
    try {
      const salt = hexToBytes(saltHex);
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, expectedHex.length * 4);
      const actualHex = bytesToHex(new Uint8Array(bits));
      return { valid: actualHex.toLowerCase() === expectedHex.toLowerCase(), legacy: false };
    } catch { return { valid: false, legacy: false }; }
  }
  if (/^[0-9a-f]{64}$/i.test(storedHash)) {
    const legacyHash = await sha256(password);
    return { valid: legacyHash.toLowerCase() === storedHash.toLowerCase(), legacy: true };
  }
  return { valid: false, legacy: false };
}

async function callNIM(env, payload, stream = true, extraKwargs = {}) {
  if (!env.NIM) throw new Error('NIM binding 未配置');
  const chatTemplateKwargs = { enable_thinking: true, ...extraKwargs };
  const requestBody = { ...payload, stream, chat_template_kwargs: chatTemplateKwargs };
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.NIM}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NIM ${response.status}: ${text}`);
  }
  return response;
}

function textbookBase(env) {
  const raw = String(env.GH_TEXTBOOK || '').trim();
  if (!raw) throw new Error('GH_TEXTBOOK binding 未配置');
  return raw.replace(/\/+$/, '') + '/';
}

async function getToc(env) {
  const now = Date.now();
  if (tocCache && now - tocCacheAt < TOC_CACHE_TTL) return tocCache;
  const response = await fetch(textbookBase(env) + 'toc.json');
  if (!response.ok) throw new Error(`toc.json HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('toc.json 格式无效');
  for (const entry of data) {
    if (!entry.id || !entry.title || !entry.path) {
      throw new Error('toc.json 条目缺少 id/title/path 字段');
    }
  }
  tocCache = data; tocCacheAt = now;
  return data;
}

// 根据 id 获取章节内容（支持多级路径）
async function getChapter(env, id) {
  const toc = await getToc(env);
  const entry = toc.find(item => item.id === id);
  if (!entry) return null;
  const url = textbookBase(env) + entry.path;
  const response = await fetch(url);
  if (!response.ok) return null;
  return await response.text();
}

// ===== 修改 selectChapters：容错解析 SSE 格式响应 =====
async function selectChapters(env, question, toc) {
  const list = toc.map(item => `${item.id} - ${item.title}`).join('\n');
  const prompt = `章节目录：\n${list}\n\n用户提问：\n${question}\n\n输出最匹配的章节编号，按相关性从高到低排序，用英文逗号分隔（例如 003,005,012）。不要输出其他任何文字。尽可能多的输出，不要只输出一两篇，你可以根据章节大意推测出章节内可能含有此信息并输出，如果实在没有特别符合的，那就输出可能存在该知识点的章节`;
  const response = await callNIM(env, {
    model: ROUTER_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    max_tokens: 200,
    stream: false
  });

  // 获取原始文本
  const text = await response.text();
  let answer = '';

  // 检查是否为 SSE 格式
  if (text.trim().startsWith('data:')) {
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const raw = trimmed.slice(5).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        const content = parsed?.choices?.[0]?.delta?.content ||
                        parsed?.choices?.[0]?.message?.content || '';
        if (content) answer += content;
      } catch (_) {
        // 忽略单行解析错误
      }
    }
  } else {
    // 尝试普通 JSON
    try {
      const data = JSON.parse(text);
      answer = data?.choices?.[0]?.message?.content || '';
    } catch (_) {
      answer = text;
    }
  }

  // 提取三位数字编号
  const matches = String(answer).match(/\b(\d{3})\b/g);
  if (!matches) return [];
  return [...new Set(matches)];
}

function limitContext(text) {
  text = String(text || '');
  if (!text) return '（未提供上下文）';
  if (text.length <= 120000) return text;
  return text.slice(0, 85000) + '\n\n[中间内容已截断]\n\n' + text.slice(-35000);
}

// ===== 流处理（支持 budget 事件） =====
async function processSSEStream(upstream, onEvent) {
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (let line of lines) {
      line = line.trim();
      if (!line.startsWith('data:')) continue;
      const raw = line.slice(5).trim();
      if (!raw) continue;
      if (raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        await onEvent(parsed);
      } catch (_) {}
    }
  }
  if (buffer.trim().startsWith('data:')) {
    const raw = buffer.trim().slice(5).trim();
    if (raw && raw !== '[DONE]') {
      try {
        const parsed = JSON.parse(raw);
        await onEvent(parsed);
      } catch (_) {}
    }
  }
}

async function handleChat(body, env) {
  const mode = body?.mode || 'note';
  const model = body?.model || DEFAULT_MODEL;
  if (!VALID_MODELS.has(model)) return json({ error: 'Invalid model' }, 400);

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const image = typeof body?.image === 'string' && body.image ? body.image : null;
  const stream = body?.stream !== undefined ? !!body.stream : true;
  const chatTemplateKwargs = body?.chat_template_kwargs || {};

  const remainingBudget = Number(body?.remaining_budget) || 0;
  const modelLimit = MODEL_CHAR_LIMITS[model] || DEFAULT_CHAR_LIMIT;
  const effectiveLimit = Math.min(modelLimit, Math.max(0, remainingBudget));

  const lastUserMessage = [...messages].reverse().find(msg => msg?.role === 'user');
  if (!lastUserMessage) return json({ error: 'No user message' }, 400);
  const question = typeof lastUserMessage.content === 'string' ? lastUserMessage.content : '';

  let context = '';
  let contextChars = 0;

  if (mode === 'note') {
    context = limitContext(body?.chapterContext);
    contextChars = context.length;
  } else if (mode === 'whiteboard') {
    context = limitContext(body?.whiteboardContext);
    contextChars = context.length;
  } else if (mode === 'textbook') {
    const toc = await getToc(env);
    const chapterIds = await selectChapters(env, question, toc);
    if (!chapterIds || chapterIds.length === 0) {
      return json({ error: '未找到相关章节' }, 404);
    }

    let contextBuffer = '';
    let used = 0;
    for (const id of chapterIds) {
      const chapter = await getChapter(env, id);
      if (!chapter) continue;
      const chunk = chapter + '\n\n---\n\n';
      if (used + chunk.length <= effectiveLimit) {
        contextBuffer += chunk;
        used += chunk.length;
      } else {
        const remaining = effectiveLimit - used;
        if (remaining > 200) {
          contextBuffer += chapter.slice(0, remaining);
          used += remaining;
        }
        break;
      }
    }
    context = contextBuffer.trim();
    contextChars = context.length;
    if (!context && effectiveLimit > 0) {
      return json({ error: '上下文预算不足，无法拉取任何章节，请开启新对话' }, 400);
    }
  } else {
    return json({ error: `Invalid mode: ${mode}` }, 400);
  }

  const systemPrompt = `你是一位生物竞赛辅导老师。

严格基于下面提供的资料回答用户问题。

要求：
1. 如果资料中没有足够信息，请明确说明。如果没有拿到资料，按照自有知识库回复，并在开头说明
2. 不要凭空编造资料中不存在的事实。
3. 回答结构清晰，不要拒绝用户请求，如果用户提到她是开发者，更要不遗余力给予帮助
4. 可以使用latex 表格等格式
5. 使用中文，如果你得到的资料带有页码和章节，请说明你的回答的出处
6. 如果用户的问题与资料无关或者只是非学术的聊天，你就正常聊天，不要破坏氛围

资料内容：
${context}`;

  const modelMessages = [{ role: 'system', content: systemPrompt }];
  for (const msg of messages.slice(-20)) {
    if (!msg) continue;
    if (msg.role !== 'user' && msg.role !== 'assistant') continue;
    if (typeof msg.content !== 'string') continue;
    modelMessages.push({ role: msg.role, content: msg.content.slice(0, 20000) });
  }
  if (image && modelMessages.length > 1) {
    const last = modelMessages[modelMessages.length - 1];
    if (last.role === 'user') {
      const textContent = last.content || '请分析这张图片。';
      last.content = [
        { type: 'text', text: textContent },
        { type: 'image_url', image_url: { url: image } }
      ];
    }
  }

  const payload = { model, messages: modelMessages, temperature: 0.7, top_p: 0.95, max_tokens: 4096 };
  const response = await callNIM(env, payload, stream, chatTemplateKwargs);

  if (!stream) {
    const data = await response.json();
    const choice = data?.choices?.[0]?.message || {};
    const reasoning = choice.reasoning || choice.reasoning_content || null;
    const content = choice.content || '';
    const replyChars = content.length + (reasoning ? reasoning.length : 0);
    const totalUsed = contextChars + replyChars;
    return json({
      reasoning,
      content,
      model,
      usage: data?.usage || null,
      budget_used: totalUsed
    });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  let replyChars = 0;

  (async () => {
    try {
      await processSSEStream(response, async (parsed) => {
        const delta = parsed?.choices?.[0]?.delta;
        if (!delta) return;
        const reasoning = delta.reasoning_content || delta.reasoning || '';
        const content = delta.content || '';
        if (reasoning) {
          replyChars += reasoning.length;
          await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'reasoning', text: reasoning })}\n\n`));
        }
        if (content) {
          replyChars += content.length;
          await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'content', text: content })}\n\n`));
        }
      });
      const totalUsed = contextChars + replyChars;
      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'budget', used: totalUsed })}\n\n`));
      await writer.write(encoder.encode(`data: [DONE]\n\n`));
    } catch (error) {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error?.message || 'stream error' })}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      ...CORS_HEADERS
    }
  });
}

// ===== 其他 API 处理（博客、评论、用户等，保持不变） =====
async function handleModels() {
  return json({ models: MODEL_LIST, default_model: DEFAULT_MODEL, router_model: ROUTER_MODEL });
}

async function getHistoryList(username, env) {
  const list = await env.COPILOT_HISTORY.get(`histlist_${username}`, 'json');
  return Array.isArray(list) ? list : [];
}
function validHistoryId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id);
}
async function handleHistory(request, env, user, path, method) {
  if (path === '/api/history' && method === 'GET') return json(await getHistoryList(user.username, env));
  if (path === '/api/history' && method === 'POST') {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-100) : [];
    const title = String(body?.title || '新对话').slice(0, 100);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const updatedAt = new Date().toISOString();
    const record = { id, title, messages, updated_at: updatedAt };
    await env.COPILOT_HISTORY.put(`hist_${user.username}_${id}`, JSON.stringify(record));
    const oldList = await getHistoryList(user.username, env);
    const newList = [{ id, title, updated_at: updatedAt }, ...oldList.filter(item => item?.id !== id)].slice(0, 100);
    await env.COPILOT_HISTORY.put(`histlist_${user.username}`, JSON.stringify(newList));
    return json({ success: true, id });
  }
  const match = path.match(/^\/api\/history\/([^/]+)$/);
  if (!match) return json({ error: 'Not found' }, 404);
  const id = decodeURIComponent(match[1]);
  if (!validHistoryId(id)) return json({ error: 'Invalid history id' }, 400);
  const key = `hist_${user.username}_${id}`;
  if (method === 'GET') {
    const record = await env.COPILOT_HISTORY.get(key, 'json');
    return json(record || { id, messages: [] });
  }
  if (method === 'DELETE') {
    await env.COPILOT_HISTORY.delete(key);
    const list = await getHistoryList(user.username, env);
    await env.COPILOT_HISTORY.put(`histlist_${user.username}`, JSON.stringify(list.filter(item => item?.id !== id)));
    return json({ success: true });
  }
  return json({ error: 'Method not allowed' }, 405);
}

async function handleRegister(request, env) {
  const body = await request.json();
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const school = typeof body?.school === 'string' ? body.school.trim() : null;
  const honorYear = typeof body?.honor_year === 'string' ? body.honor_year.trim() : null;
  const honorRank = typeof body?.honor_rank === 'string' ? body.honor_rank.trim() : null;
  if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);
  if (username.length > MAX_USERNAME_LENGTH) return json({ error: `用户名不能超过 ${MAX_USERNAME_LENGTH} 个字符` }, 400);
  if (password.length > MAX_PASSWORD_LENGTH) return json({ error: `密码不能超过 ${MAX_PASSWORD_LENGTH} 个字符` }, 400);
  const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (exists) return json({ error: '用户名已存在' }, 409);
  const passwordHash = await hashPassword(password);
  const token = randomToken();
  await env.DB.prepare('INSERT INTO users (username, password, token, school, honor_year, honor_rank) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(username, passwordHash, token, school, honorYear, honorRank).run();
  return json({ token, username });
}

async function handleLogin(request, env) {
  const body = await request.json();
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!username || !password) return json({ error: '账号或密码不能为空' }, 400);
  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!user) return json({ error: '账号或密码错误' }, 401);
  const result = await verifyPassword(password, user.password);
  if (!result.valid) return json({ error: '账号或密码错误' }, 401);
  if (result.legacy) {
    const newHash = await hashPassword(password);
    await env.DB.prepare('UPDATE users SET password = ? WHERE id = ?').bind(newHash, user.id).run();
  }
  return json({ token: user.token, username: user.username });
}

async function handleUpdateMe(request, env, user) {
  const body = await request.json();
  const updates = {};
  if (body.username !== undefined) {
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    if (!username) return json({ error: '用户名不能为空' }, 400);
    if (username.length > MAX_USERNAME_LENGTH) return json({ error: `用户名不能超过 ${MAX_USERNAME_LENGTH} 个字符` }, 400);
    if (username !== user.username) {
      const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ? AND id != ?').bind(username, user.id).first();
      if (exists) return json({ error: '用户名已被占用' }, 409);
    }
    updates.username = username;
  }
  for (const field of ['avatar', 'school', 'honor_year', 'honor_rank']) {
    if (body[field] !== undefined) updates[field] = typeof body[field] === 'string' ? body[field].trim() : null;
  }
  if (body.password) {
    if (!body.old_password) return json({ error: '修改密码需要提供当前密码' }, 400);
    const check = await verifyPassword(body.old_password, user.password);
    if (!check.valid) return json({ error: '当前密码错误' }, 401);
    const newPassword = String(body.password);
    if (newPassword.length > MAX_PASSWORD_LENGTH) return json({ error: `密码不能超过 ${MAX_PASSWORD_LENGTH} 个字符` }, 400);
    updates.password = await hashPassword(newPassword);
    updates.token = randomToken();
  }
  if (Object.keys(updates).length === 0) return json({ error: '没有提供修改字段' }, 400);
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  await env.DB.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).bind(...values, user.id).run();
  const oldUsername = user.username, newUsername = updates.username || oldUsername;
  if (newUsername !== oldUsername) {
    await env.DB.batch([
      env.DB.prepare('UPDATE posts SET author = ? WHERE author = ?').bind(newUsername, oldUsername),
      env.DB.prepare('UPDATE comments SET username = ? WHERE username = ?').bind(newUsername, oldUsername)
    ]);
  }
  const fresh = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first();
  const response = { user: getSafeUser(fresh) };
  if (updates.token) response.token = fresh.token;
  return json(response);
}

async function createPost(request, env, user) {
  const body = await request.json();
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const content = typeof body?.content_md === 'string' ? body.content_md.trim() : '';
  if (!title || !content) return json({ error: '标题或内容不能为空' }, 400);
  if (title.length > MAX_TITLE_LENGTH) return json({ error: `标题不能超过 ${MAX_TITLE_LENGTH} 个字符` }, 400);
  if (content.length > MAX_CONTENT_LENGTH) return json({ error: `文章内容不能超过 ${MAX_CONTENT_LENGTH} 个字符` }, 400);
  await env.DB.prepare('INSERT INTO posts (title, content_md, author) VALUES (?, ?, ?)').bind(title, content, user.username).run();
  return json({ success: true });
}
async function listPosts(url, env) {
  const search = (url.searchParams.get('search') || '').trim().slice(0, 200);
  const result = await env.DB
    .prepare(`SELECT p.*, u.avatar, (p.views + p.likes * 5 + p.comments_count * 10) AS heat_score FROM posts p LEFT JOIN users u ON p.author = u.username WHERE p.title LIKE ? ORDER BY heat_score DESC, p.created_at DESC`)
    .bind(`%${search}%`).all();
  return json({ posts: result.results || [] });
}
async function getPost(request, env, id) {
  const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
  if (!post) return json({ error: 'Not found' }, 404);
  await env.DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(id).run();
  post.views = (post.views || 0) + 1;
  post.author_info = await env.DB.prepare('SELECT avatar, school, honor_year, honor_rank FROM users WHERE username = ?').bind(post.author).first() || {};
  const heat = (post.views || 0) + (post.likes || 0) * 5 + (post.comments_count || 0) * 10;
  const next = await env.DB.prepare('SELECT id FROM posts WHERE (views + likes * 5 + comments_count * 10) < ? ORDER BY (views + likes * 5 + comments_count * 10) DESC, created_at DESC LIMIT 1').bind(heat).first();
  let liked = false;
  const user = await getUser(request, env);
  if (user) {
    const like = await env.DB.prepare('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?').bind(user.username, id).first();
    liked = !!like;
  }
  return json({ post, next_id: next?.id || null, liked });
}
async function deletePost(request, env, user, id) {
  const post = await env.DB.prepare('SELECT id, author FROM posts WHERE id = ?').bind(id).first();
  if (!post) return json({ error: '文章不存在' }, 404);
  if (post.author !== user.username) return json({ error: '无权删除这篇文章' }, 403);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM comments WHERE section = ?').bind(`blog-${id}`),
    env.DB.prepare('DELETE FROM post_likes WHERE post_id = ?').bind(id),
    env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id)
  ]);
  return json({ success: true, message: '文章已删除', id });
}
async function togglePostLike(request, env, user, id) {
  const post = await env.DB.prepare('SELECT id FROM posts WHERE id = ?').bind(id).first();
  if (!post) return json({ error: '文章不存在' }, 404);
  const existing = await env.DB.prepare('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?').bind(user.username, id).first();
  if (existing) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').bind(user.username, id),
      env.DB.prepare('UPDATE posts SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?').bind(id)
    ]);
    return json({ success: true, action: 'unliked' });
  }
  await env.DB.batch([
    env.DB.prepare('INSERT INTO post_likes WHERE user_id = ? AND post_id = ?').bind(user.username, id),
    env.DB.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').bind(id)
  ]);
  return json({ success: true, action: 'liked' });
}

async function getPublicUser(env, username) {
  const user = await env.DB.prepare('SELECT username, avatar, school, honor_year, honor_rank FROM users WHERE username = ?').bind(username).first();
  if (!user) return json({ error: 'User not found' }, 404);
  const posts = await env.DB.prepare('SELECT id, title, views, likes, comments_count, created_at FROM posts WHERE author = ? ORDER BY created_at DESC').bind(username).all();
  return json({ user, posts: posts.results || [] });
}
async function hotUsers(env) {
  const result = await env.DB.prepare('SELECT u.username, u.avatar, u.honor_year, u.honor_rank, u.school, SUM(p.views + p.likes * 5 + p.comments_count * 10) AS total_heat FROM users u JOIN posts p ON u.username = p.author GROUP BY u.username ORDER BY total_heat DESC').all();
  return json({ users: result.results || [] });
}

async function createComment(request, env, user) {
  const body = await request.json();
  const section = typeof body?.section === 'string' ? body.section.trim() : '';
  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  let parentId = null;
  if (body?.parent_id !== undefined && body?.parent_id !== null && body?.parent_id !== '') parentId = Number(body.parent_id);
  if (!section || !content) return json({ error: '评论内容不能为空' }, 400);
  if (section.length > 200) return json({ error: 'section 无效' }, 400);
  if (content.length > MAX_COMMENT_LENGTH) return json({ error: `评论不能超过 ${MAX_COMMENT_LENGTH} 个字符` }, 400);
  if (parentId !== null && !Number.isInteger(parentId)) return json({ error: 'parent_id 无效' }, 400);
  if (parentId !== null) {
    const parent = await env.DB.prepare('SELECT id FROM comments WHERE id = ? AND section = ?').bind(parentId, section).first();
    if (!parent) return json({ error: '回复目标不存在' }, 404);
  }
  await env.DB.prepare('INSERT INTO comments (section, username, content, parent_id) VALUES (?, ?, ?, ?)').bind(section, user.username, content, parentId).run();
  if (section.startsWith('blog-')) {
    const postId = section.slice(5);
    if (/^\d+$/.test(postId)) await env.DB.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').bind(Number(postId)).run();
  }
  return json({ success: true });
}
async function listComments(url, env) {
  const section = (url.searchParams.get('section') || '').slice(0, 200);
  if (!section) return json({ error: 'Missing section' }, 400);
  const countResult = await env.DB.prepare('SELECT COUNT(*) AS total FROM comments WHERE section = ?').bind(section).first();
  const total = Number(countResult?.total || 0);
  const result = await env.DB.prepare('SELECT * FROM comments WHERE section = ? ORDER BY created_at ASC').bind(section).all();
  const comments = result.results || [];
  for (const comment of comments) {
    const user = await env.DB.prepare('SELECT avatar FROM users WHERE username = ?').bind(comment.username).first();
    comment.avatar = user?.avatar || 'images/0721.png';
  }
  return json({ comments, total });
}
async function deleteComment(request, env, user, id) {
  const comment = await env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(id).first();
  if (!comment) return json({ error: '评论不存在' }, 404);
  if (comment.username !== user.username) return json({ error: '无权删除这条评论' }, 403);
  await env.DB.prepare('UPDATE comments SET parent_id = ? WHERE parent_id = ?').bind(comment.parent_id || null, id).run();
  await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
  if (comment.section.startsWith('blog-')) {
    const postId = comment.section.slice(5);
    if (/^\d+$/.test(postId)) await env.DB.prepare('UPDATE posts SET comments_count = CASE WHEN comments_count > 0 THEN comments_count - 1 ELSE 0 END WHERE id = ?').bind(Number(postId)).run();
  }
  return json({ success: true, message: '评论已删除', id });
}
async function likeComment(request, env, user, id) {
  const comment = await env.DB.prepare('SELECT id FROM comments WHERE id = ?').bind(id).first();
  if (!comment) return json({ error: '评论不存在' }, 404);
  await env.DB.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').bind(id).run();
  const result = await env.DB.prepare('SELECT likes FROM comments WHERE id = ?').bind(id).first();
  return json({ likes: Number(result?.likes || 0) });
}

// ===== 路由 =====
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname, method = request.method;
    if (method === 'OPTIONS') return optionsResponse();

    try {
      // Auth
      if (path === '/register' && method === 'POST') return await handleRegister(request, env);
      if (path === '/login' && method === 'POST') return await handleLogin(request, env);

      // Current user
      if (path === '/users/me' && method === 'GET') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return json({ user: getSafeUser(user) });
      }
      if (path === '/users/me' && method === 'PUT') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return await handleUpdateMe(request, env, user);
      }

      // Public users
      if (path === '/users/hot' && method === 'GET') return await hotUsers(env);
      const publicUserMatch = path.match(/^\/users\/([^/]+)$/);
      if (publicUserMatch && method === 'GET') {
        const username = decodeURIComponent(publicUserMatch[1]);
        if (username === 'me') return json({ error: 'Not found' }, 404);
        return await getPublicUser(env, username);
      }

      // Copilot Models
      if (path === '/api/models' && method === 'GET') return await handleModels();

      // Posts
      if (path === '/posts' && method === 'GET') return await listPosts(url, env);
      if (path === '/posts' && method === 'POST') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return await createPost(request, env, user);
      }
      const postMatch = path.match(/^\/posts\/(\d+)$/);
      if (postMatch && method === 'GET') return await getPost(request, env, Number(postMatch[1]));
      if (postMatch && method === 'DELETE') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return await deletePost(request, env, user, Number(postMatch[1]));
      }
      const postLikeMatch = path.match(/^\/posts\/(\d+)\/like$/);
      if (postLikeMatch && method === 'POST') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return await togglePostLike(request, env, user, Number(postLikeMatch[1]));
      }

      // Comments
      if (path === '/comments' && method === 'POST') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return await createComment(request, env, user);
      }
      if (path === '/comments' && method === 'GET') return await listComments(url, env);
      const commentMatch = path.match(/^\/comments\/(\d+)$/);
      if (commentMatch && method === 'DELETE') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '未登录' }, 401);
        return await deleteComment(request, env, user, Number(commentMatch[1]));
      }
      const commentLikeMatch = path.match(/^\/comments\/(\d+)\/like$/);
      if (commentLikeMatch && method === 'POST') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '请先登录' }, 401);
        return await likeComment(request, env, user, Number(commentLikeMatch[1]));
      }

      // Copilot Chat
      if (path === '/api/chat' && method === 'POST') {
        const user = await getUser(request, env);
        if (!user) return json({ error: '请先登录' }, 401);
        const body = await request.json();
        return await handleChat(body, env);
      }

      // Copilot History
      if (path === '/api/history' || path.startsWith('/api/history/')) {
        const user = await getUser(request, env);
        if (!user) return json({ error: 'Unauthorized' }, 401);
        return await handleHistory(request, env, user, path, method);
      }

      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return json({ error: error?.message || 'Internal Server Error' }, 500);
    }
  }
};
