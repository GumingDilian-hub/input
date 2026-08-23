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
        ['minimaxai/minimax-m2.5', 'MiniMax', '5.png'],
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

    function currentChapter() {
        return fullNoteContext();
    }

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
            els.messages.scrollTop = els.messages.scrollHeight;
        } else node?.remove();
    }

    function render() {
        if (!els.messages) return;
        els.messages.innerHTML = '';
        if (!history.length) {
            const u = getUser();
            els.messages.innerHTML = '<div class="copilot-placeholder">' + (u?.username === ADMIN ? '管理员模式 - ' : '') + '有什么可以帮你的？</div>';
        }
        history.forEach(m => {
            const box = document.createElement('div');
            box.className = 'copilot-msg copilot-msg-' + m.role;
            if (m.image) {
                const img = document.createElement('img');
                img.src = m.image;
                img.style.cssText = 'max-width:120px;border-radius:4px;margin-bottom:4px;display:block;';
                box.appendChild(img);
            }
            if (m.role === 'assistant' && m.reasoning) {
                const thinking = document.createElement('div');
                thinking.className = 'copilot-thinking';
                const toggle = document.createElement('span');
                toggle.className = 'thinking-toggle';
                toggle.textContent = '思考过程';
                const content = document.createElement('div');
                content.className = 'thinking-content';
                content.style.display = 'none';
                content.textContent = m.reasoning;
                toggle.onclick = () => {
                    const open = content.style.display === 'none';
                    content.style.display = open ? 'block' : 'none';
                    toggle.textContent = open ? '收起' : '思考过程';
                };
                thinking.append(toggle, content);
                box.appendChild(thinking);
            }
            const p = document.createElement('p');
            p.textContent = m.content || '';
            box.appendChild(p);
            els.messages.appendChild(box);
        });
        els.messages.scrollTop = els.messages.scrollHeight;
        drawDots();
        if (busy) setLoading(true);
    }

    function drawDots() {
        if (!els.dots) return;
        const count = history.filter(x => x.role === 'user').length;
        els.dots.innerHTML = '';
        const start = Math.max(0, count - 10);
        for (let i = start; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'copilot-dot' + (i === count - 1 ? ' active' : '');
            dot.onclick = () => els.messages.querySelectorAll('.copilot-msg-user')[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            els.dots.appendChild(dot);
        }
    }

    function renderModes() {
        const labels = { note: '本站笔记', textbook: '知识库', whiteboard: '白板AI' };
        els.modeOptions.innerHTML = '';
        Object.entries(labels).forEach(([key, label]) => {
            const node = document.createElement('div');
            node.className = 'copilot-mode-option' + (key === mode ? ' active' : '');
            node.textContent = label;
            node.onclick = () => {
                mode = key;
                els.modeOptions.style.display = 'none';
                renderModes();
                updateImageState();
                updateWhiteboardState();
            };
            els.modeOptions.appendChild(node);
        });
        els.modeText.textContent = labels[mode];
    }

    function renderModels() {
        els.modelOptions.innerHTML = '';
        TEXT_MODELS.forEach(addModel);
        const divider = document.createElement('div');
        divider.className = 'copilot-model-divider';
        els.modelOptions.appendChild(divider);
        const label = document.createElement('div');
        label.style.cssText = 'padding:4px 12px;font-size:.65rem;color:#666;user-select:none;';
        label.textContent = '— 视觉模型 —';
        els.modelOptions.appendChild(label);
        VISION_MODELS.forEach(addModel);
        showSelectedModel();
        function addModel(item) {
            const node = document.createElement('div');
            node.className = 'copilot-model-option' + (item[0] === model ? ' active' : '');
            const icon = document.createElement('img');
            icon.src = LOGO + item[2];
            icon.style.cssText = 'width:20px;height:20px;margin-right:8px;';
            node.append(icon, document.createTextNode(item[1]));
            node.onclick = () => { model = item[0]; els.modelOptions.style.display = 'none'; renderModels(); updateImageState(); };
            els.modelOptions.appendChild(node);
        }
    }

    function showSelectedModel() {
        const item = ALL_MODELS.find(x => x[0] === model);
        if (!item) return;
        els.modelText.textContent = item[1];
        els.modelIcon.src = LOGO + item[2];
        els.modelIcon.style.display = 'inline';
    }

    function updateImageState() {
        const enabled = VISION_MODELS.some(x => x[0] === model);
        if (els.imageInput) els.imageInput.disabled = !enabled;
        if (els.imageLabel) els.imageLabel.style.opacity = enabled ? '1' : '.3';
        if (!enabled) {
            image = null;
            if (els.imageInput) els.imageInput.value = '';
            document.querySelector('.copilot-image-thumb')?.remove();
        }
    }
    function updateWhiteboardState() {
        if (els.whiteboardImport) els.whiteboardImport.style.display = mode === 'whiteboard' ? 'inline-block' : 'none';
    }

    function openWhiteboard() {
        let panel = $('copilot-whiteboard-panel');
        if (panel) { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; return; }
        panel = document.createElement('div');
        panel.id = 'copilot-whiteboard-panel';
        panel.className = 'open';
        panel.innerHTML = `<textarea id="wb-textarea" placeholder="粘贴资料文本（支持 Markdown）..." style="width:100%;background:#1e1e1e;border:1px solid #555;border-radius:4px;color:#ddd;padding:6px;resize:vertical;font-family:inherit;font-size:.85rem;min-height:80px;"></textarea><div class="wb-actions"><button id="wb-file" style="background:#333;border:1px solid #555;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">上传 .txt</button><input type="file" id="wb-file-input" accept=".txt" style="display:none"><button id="wb-confirm" style="background:#555;border:1px solid #777;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">确认导入</button><button id="wb-cancel" style="background:#333;border:1px solid #555;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">取消</button><button id="wb-from-page" style="background:#333;border:1px solid #555;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">从当前章节导入</button></div><div id="copilot-whiteboard-status" style="font-size:.7rem;color:#888;margin-top:4px;"></div>`;
        els.inputWrap.parentNode.insertBefore(panel, els.inputWrap);
        const ta = $('wb-textarea');
        ta.value = whiteboard;
        $('wb-file').onclick = () => $('wb-file-input').click();
        $('wb-file-input').onchange = e => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = () => { ta.value = String(reader.result || ''); $('copilot-whiteboard-status').textContent = `已导入文件: ${file.name} (${ta.value.length} 字)`; };
            reader.readAsText(file);
        };
        $('wb-from-page').onclick = () => { const text = currentChapter(); if (text) { ta.value = text; toast('已导入当前页面全部内容'); } else toast('未找到当前页面内容'); };
        $('wb-confirm').onclick = () => { whiteboard = ta.value; panel.style.display = 'none'; toast('资料已导入，共 ' + whiteboard.length + ' 字'); };
        $('wb-cancel').onclick = () => { panel.style.display = 'none'; };
    }

    async function loadHistoryList() {
        if (!getToken() || !els.history) return;
        try {
            const list = await api('/api/history');
            els.history.innerHTML = '';
            (Array.isArray(list) ? list : []).forEach(item => {
                const node = document.createElement('div');
                node.className = 'copilot-history-item';
                node.textContent = item.title || '新对话';
                node.onclick = () => loadHistory(item.id);
                els.history.appendChild(node);
            });
        } catch (e) { console.warn('[Copilot history]', e); }
    }
    async function loadHistory(id) {
        try {
            const record = await api('/api/history/' + encodeURIComponent(id));
            sessionId = id;
            history = Array.isArray(record?.messages) ? record.messages : [];
            render();
        } catch (e) { toast('历史记录加载失败：' + e.message); }
    }
    async function saveHistory() {
        if (!getToken() || !history.length) return;
        const firstUser = history.find(x => x.role === 'user');
        const title = String(firstUser?.content || '新对话').slice(0, 30);
        try {
            const record = await api('/api/history', { method: 'POST', body: { messages: history, title } });
            if (sessionId) await api('/api/history/' + encodeURIComponent(sessionId), { method: 'DELETE' }).catch(() => {});
            sessionId = record.id;
            await loadHistoryList();
        } catch (e) { console.warn('[Copilot save]', e); }
    }

    async function send() {
        if (busy) return;
        if (!getToken()) { toast('请先登录'); return; }
        const text = els.input.value.trim();
        if (!text && !image) return;
        busy = true;
        els.send.disabled = true;
        const selectedImage = image;
        const userText = text || '请分析这张图片。';
        history.push({ role: 'user', content: userText, image: selectedImage });
        history.push({ role: 'assistant', content: '', reasoning: '' });
        const assistant = history[history.length - 1];
        image = null;
        els.input.value = '';
        updateImageState();
        render();
        setLoading(true);
        try {
            const messages = history.slice(0, -1).map(m => ({ role: m.role, content: m.content || '' }));
            const payload = { mode, model, messages, chapterContext: currentChapter(), whiteboardContext: whiteboard };
            if (selectedImage) payload.image = selectedImage;
            const response = await fetch(API + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() }, body: JSON.stringify(payload) });
            if (!response.ok) {
                let error = null; try { error = await response.json(); } catch (_) {}
                throw new Error(error?.error || `HTTP ${response.status}`);
            }
            if (!response.body) throw new Error('服务器没有返回流式响应');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
                const part = await reader.read();
                if (part.done) break;
                buffer += decoder.decode(part.value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;
                    const raw = line.slice(5).trim();
                    if (!raw) continue;
                    const event = JSON.parse(raw);
                    if (event.type === 'content') assistant.content += event.text || '';
                    else if (event.type === 'reasoning') assistant.reasoning += event.text || '';
                    else if (event.type === 'error') throw new Error(event.error || '流式响应错误');
                    render();
                    setLoading(true);
                }
            }
            await saveHistory();
        } catch (e) {
            assistant.content = '错误：' + e.message;
            render();
        } finally {
            busy = false;
            els.send.disabled = false;
            setLoading(false);
            els.input.focus();
        }
    }

    function newChat() {
        sessionId = null; history = []; image = null; whiteboard = '';
        els.input.value = '';
        $('copilot-whiteboard-panel')?.remove();
        render(); updateImageState(); updateWhiteboardState();
    }

    function bind() {
        els.btn.onclick = () => { els.copilot.style.display = 'block'; if (els.toc) els.toc.style.display = 'none'; };
        els.modeDisplay.onclick = () => { els.modeOptions.style.display = els.modeOptions.style.display === 'block' ? 'none' : 'block'; els.modelOptions.style.display = 'none'; };
        els.modelDisplay.onclick = () => { els.modelOptions.style.display = els.modelOptions.style.display === 'block' ? 'none' : 'block'; els.modeOptions.style.display = 'none'; };
        document.addEventListener('click', e => {
            if (!e.target.closest('#copilot-mode-display') && !e.target.closest('#copilot-mode-options')) els.modeOptions.style.display = 'none';
            if (!e.target.closest('#copilot-model-display') && !e.target.closest('#copilot-model-options')) els.modelOptions.style.display = 'none';
        });
        els.send.onclick = send;
        els.input.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); });
        els.newChat.onclick = newChat;
        els.imageInput.onchange = e => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                image = String(reader.result || '');
                document.querySelector('.copilot-image-thumb')?.remove();
                const thumb = document.createElement('img');
                thumb.className = 'copilot-image-thumb'; thumb.src = image;
                thumb.style.cssText = 'max-width:80px;max-height:60px;border-radius:4px;margin:4px;display:block;';
                els.input.parentNode.insertBefore(thumb, els.input);
            };
            reader.readAsDataURL(file);
        };
        els.whiteboardImport.onclick = openWhiteboard;
        window.addEventListener('iwp-auth-changed', () => { if (!getToken()) newChat(); else loadHistoryList(); });
        document.addEventListener('profile-login', loadHistoryList);
        document.addEventListener('profile-logout', newChat);
        window.addEventListener('storage', e => { if (e.key === 'iwp-user') { if (!getToken()) newChat(); else loadHistoryList(); } });
    }

    function init() {
        els = {
            btn: $('btn-copilot'), copilot: $('sidebar-copilot-view'), toc: $('sidebar-toc-view'),
            modeDisplay: $('copilot-mode-display'), modeText: $('copilot-mode-text'), modeOptions: $('copilot-mode-options'),
            modelDisplay: $('copilot-model-display'), modelText: $('copilot-model-text'), modelIcon: $('copilot-model-icon'),
            modelOptions: $('copilot-model-options'), messages: $('copilot-messages'), dots: $('copilot-dots'),
            input: $('copilot-input'), send: $('copilot-send'), newChat: $('copilot-new-chat'), history: $('copilot-history-list'),
            imageInput: $('copilot-image-input'), imageLabel: $('copilot-image-label'), whiteboardImport: $('copilot-whiteboard-import'),
            inputWrap: document.querySelector('.copilot-input-wrap')
        };
        if (!els.btn || !els.copilot || !els.messages || !els.input) return;
        const guard = document.createElement('div');
        guard.id = 'copilot-bottom-guard';
        guard.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:28px;background:linear-gradient(transparent,rgba(15,15,15,.96));pointer-events:none;z-index:20;';
        if (getComputedStyle(els.copilot).position === 'static') els.copilot.style.position = 'relative';
        els.copilot.appendChild(guard);
        renderModes(); renderModels(); updateImageState(); updateWhiteboardState(); bind(); render(); loadHistoryList();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
