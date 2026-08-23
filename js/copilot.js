/* IWP Copilot — rollback-compatible client
 * UI/DOM contract remains unchanged; authentication is shared directly
 * through iwp-user/localStorage and the same Worker used by reader.js.
 */
(function () {
    'use strict';

    const API = 'https://copilot.2167964516.workers.dev';
    const LOGO = 'images/copilot/';
    const ADMIN = 'loading';
    const TEXT_MODELS = [
        ['nvidia/nemotron-3-super-120b-a12b', 'NVIDIA 3 super', '1.png'],
        ['meta/llama-3.3-70b-instruct', 'Meta 3.3', '2.png'],
        ['openai/gpt-oss-120b', 'ChatGPT', '3.png'],
        ['openai/gpt-oss-20b', 'CatGPT', '3.png'],
        ['minimaxai/minimax-m3', 'MiniMax', '5.png'],
        ['deepseek-ai/deepseek-v4-flash', 'DeepSeek V4', '6.png'],
        ['z-ai/glm4.7', 'GLM 4.7', '7.png'],
        ['google/gemma-4-31b-it', 'Google Gemma 4', '4.png']
    ];

    const VISION_MODELS = [['meta/llama-3.2-90b-vision-instruct', 'Meta 3.2 视觉', '2.png']];
    const ALL_MODELS = TEXT_MODELS.concat(VISION_MODELS);

    let mode = 'note', model = TEXT_MODELS[0][0], image = null;
    let history = [], sessionId = null, busy = false, whiteboard = '', els = {};
    const $ = id => document.getElementById(id);

    function getUser() {
        try { return JSON.parse(localStorage.getItem('iwp-user') || 'null'); } catch (_) { return null; }
    }
    function getToken() { return getUser()?.token || null; }

    async function api(path, options = {}) {
        const headers = Object.assign({}, options.headers || {});
        const t = getToken();
        if (t) headers.Authorization = 'Bearer ' + t;
        if (options.body && typeof options.body !== 'string') {
            headers['Content-Type'] = 'application/json';
            options = Object.assign({}, options, { body: JSON.stringify(options.body) });
        }
        const r = await fetch(API + path, Object.assign({}, options, { headers }));
        const text = await r.text();
        let data = {};
        try { data = JSON.parse(text); } catch (_) {}
        if (!r.ok) throw Object.assign(new Error(data?.error || `HTTP ${r.status}`), { status: r.status, data });
        return data;
    }

    function toast(message) {
        document.querySelector('.copilot-toast')?.remove();
        const node = document.createElement('div');
        node.className = 'copilot-toast';
        node.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.88);color:#eee;padding:8px 20px;border-radius:8px;font-size:.85rem;z-index:99999;border:1px solid #555;';
        node.textContent = message;
        document.body.appendChild(node);
        setTimeout(() => node.remove(), 2200);
    }

    function fullNoteContext() {
        const article = $('article-body');
        if (!article) return '';
        return String(article.innerText || article.textContent || '').trim();
    }

    function currentChapter() { return fullNoteContext(); }

    function setLoading(on) {
        if (!els.messages) return;
        let node = $('copilot-thinking-status');
        if (on) {
            if (!node) {
                node = document.createElement('div');
                node.id = 'copilot-thinking-status';
                node.className = 'copilot-thinking-status';
                node.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;color:#aaa;font-size:.82rem;opacity:.95;';
                node.innerHTML = '<span class="copilot-spinner" style="display:inline-block;width:13px;height:13px;border:2px solid #555;border-top-color:#ddd;border-radius:50%;animation:copilot-spin .8s linear infinite;"></span><span>少女祈祷中...</span>';
                els.messages.appendChild(node);
                if (!document.getElementById('copilot-spin-style')) {
                    const style = document.createElement('style');
                    style.id = 'copilot-spin-style';
                    style.textContent = '@keyframes copilot-spin{to{transform:rotate(360deg)}}';
                    document.head.appendChild(style);
                }
            }
        } else node?.remove();
        els.messages.scrollTop = els.messages.scrollHeight;
    }

    function appendMessage(role, text, reasoning) {
        if (!els.messages) return null;
        const box = document.createElement('div');
        box.className = 'copilot-message ' + role;
        box.style.cssText = 'white-space:pre-wrap;word-break:break-word;margin:8px 0;';
        if (reasoning) {
            const think = document.createElement('details');
            think.className = 'copilot-reasoning';
            const summary = document.createElement('summary');
            summary.textContent = '思考过程';
            const body = document.createElement('div');
            body.style.cssText = 'white-space:pre-wrap;color:#999;font-size:.85rem;padding:6px 0;';
            body.textContent = reasoning;
            think.append(summary, body);
            box.appendChild(think);
        }
        const content = document.createElement('div');
        content.className = 'copilot-content';
        content.textContent = text || '';
        box.appendChild(content);
        els.messages.appendChild(box);
        els.messages.scrollTop = els.messages.scrollHeight;
        return { box, content, reasoning: reasoning || '' };
    }

    function readSSE(response, onEvent) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        return (async () => {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;
                    const raw = line.slice(5).trim();
                    if (!raw) continue;
                    try { onEvent(JSON.parse(raw)); } catch (_) {}
                }
            }
        })();
    }

    async function send() {
        if (busy) return;
        const input = els.input;
        const question = String(input?.value || '').trim();
        if (!question) return;
        if (!getToken()) { toast('请先登录'); return; }
        busy = true;
        input.value = '';
        appendMessage('user', question);
        setLoading(true);
        const context = mode === 'note' ? currentChapter() : whiteboard;
        history.push({ role: 'user', content: question });
        let answer = '', reasoning = '', assistant = null;
        try {
            const response = await fetch(API + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
                body: JSON.stringify({ mode, model, messages: history.slice(-20), chapterContext: context, whiteboardContext: whiteboard, image })
            });
            if (!response.ok) {
                const text = await response.text();
                let err = {};
                try { err = JSON.parse(text); } catch (_) {}
                throw new Error(err.error || `HTTP ${response.status}`);
            }
            setLoading(false);
            await readSSE(response, event => {
                if (event.type === 'reasoning') {
                    reasoning += event.text || '';
                    if (!assistant) assistant = appendMessage('assistant', '', reasoning);
                    const details = assistant.box.querySelector('.copilot-reasoning');
                    const body = details?.querySelector('div');
                    if (body) body.textContent = reasoning;
                } else if (event.type === 'content') {
                    answer += event.text || '';
                    if (!assistant) assistant = appendMessage('assistant', '', reasoning);
                    assistant.content.textContent = answer;
                    els.messages.scrollTop = els.messages.scrollHeight;
                } else if (event.type === 'error') {
                    throw new Error(event.error || 'stream error');
                }
            });
            history.push({ role: 'assistant', content: answer });
            if (sessionId) await api('/api/history', { method: 'POST', body: { messages: history, title: history.find(x => x.role === 'user')?.content?.slice(0, 40) || '新对话' } });
        } catch (e) {
            setLoading(false);
            toast(e.message || '请求失败');
            history.pop();
        } finally {
            busy = false;
            image = null;
        }
    }

    function bind() {
        els.messages = $('copilot-messages') || document.querySelector('.copilot-messages');
        els.input = $('copilot-input') || document.querySelector('.copilot-input, textarea[name="copilot-input"]');
        const sendBtn = $('copilot-send') || document.querySelector('.copilot-send');
        sendBtn?.addEventListener('click', send);
        els.input?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
        document.querySelectorAll('[data-copilot-mode]').forEach(x => x.addEventListener('click', () => { mode = x.dataset.copilotMode; }));
        document.querySelectorAll('[data-copilot-model]').forEach(x => x.addEventListener('click', () => { model = x.dataset.copilotModel; }));
    }

    window.IWPCopilot = { api, send, setMode: m => mode = m, setModel: m => model = m, setWhiteboard: x => whiteboard = String(x || '') };
    document.addEventListener('DOMContentLoaded', bind);
})();
