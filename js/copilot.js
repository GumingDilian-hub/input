/* ============================================================
 * IWP Copilot

 * ============================================================ */

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

    const VISION_MODELS = [
        ['meta/llama-3.2-90b-vision-instruct', 'Meta 3.2 视觉', '2.png']
    ];

    const ALL_MODELS = TEXT_MODELS.concat(VISION_MODELS);

    let mode = 'note';
    let model = TEXT_MODELS[0][0];
    let image = null;
    let history = [];
    let sessionId = null;
    let busy = false;
    let whiteboard = '';
    let copilotOpen = false;
    let els = {};

    const $ = id => document.getElementById(id);

    function qs(selectors) {
        for (const selector of selectors) {
            try {
                const node = document.querySelector(selector);
                if (node) return node;
            } catch (_) {}
        }
        return null;
    }

    function qsa(selectors) {
        const result = [];
        for (const selector of selectors) {
            try {
                document.querySelectorAll(selector).forEach(node => {
                    if (!result.includes(node)) result.push(node);
                });
            } catch (_) {}
        }
        return result;
    }

    /* ============================================================
     * AUTH
     * ============================================================ */

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem('iwp-user') || 'null');
        } catch (_) {
            return null;
        }
    }

    function getToken() {
        return getUser()?.token || null;
    }

    /* ============================================================
     * API
     * ============================================================ */

    async function api(path, options = {}) {
        const headers = Object.assign({}, options.headers || {});
        const token = getToken();

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        const requestOptions = Object.assign({}, options);

        if (
            requestOptions.body &&
            typeof requestOptions.body !== 'string'
        ) {
            headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(requestOptions.body);
        }

        requestOptions.headers = headers;

        const response = await fetch(API + path, requestOptions);
        const text = await response.text();

        let data = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch (_) {}

        if (!response.ok) {
            throw Object.assign(
                new Error(data?.error || `HTTP ${response.status}`),
                {
                    status: response.status,
                    data
                }
            );
        }

        return data;
    }

    /* ============================================================
     * TOAST
     * ============================================================ */

    function toast(message) {
        document.querySelector('.copilot-toast')?.remove();

        const node = document.createElement('div');

        node.className = 'copilot-toast';

        node.style.cssText =
            'position:fixed;bottom:20px;left:50%;' +
            'transform:translateX(-50%);' +
            'background:rgba(0,0,0,.88);color:#eee;' +
            'padding:8px 20px;border-radius:8px;' +
            'font-size:.85rem;z-index:99999;' +
            'border:1px solid #555;pointer-events:none;';

        node.textContent = String(message || '');

        document.body.appendChild(node);

        setTimeout(() => node.remove(), 2200);
    }

    /* ============================================================
     * CONTEXT
     * ============================================================ */

    function fullNoteContext() {
        const article = $('article-body');

        if (!article) return '';

        return String(
            article.innerText ||
            article.textContent ||
            ''
        ).trim();
    }

    function currentChapter() {
        return fullNoteContext();
    }

    function setWhiteboard(value) {
        whiteboard = String(value || '');
    }

    function getWhiteboardContext() {
        return String(whiteboard || '');
    }

    /* ============================================================
     * MODEL
     * ============================================================ */

    function findModel(modelId) {
        return ALL_MODELS.find(item => item[0] === modelId) || null;
    }

    function isVisionModel(modelId) {
        return VISION_MODELS.some(item => item[0] === modelId);
    }

    /*
     * 真正生成模型菜单。
     *
     * 这是当前仓库缺失的核心部分。
     */
    function renderModelOptions() {
        const container = $('copilot-model-options');

        if (!container) return;

        container.innerHTML = '';

        ALL_MODELS.forEach(item => {
            const [id, name, logo] = item;

            const option = document.createElement('div');

            option.className = 'copilot-model-option';
            option.dataset.copilotModel = id;
            option.setAttribute('role', 'option');
            option.setAttribute(
                'aria-selected',
                id === model ? 'true' : 'false'
            );

            option.style.cssText =
                'display:flex;' +
                'align-items:center;' +
                'gap:7px;' +
                'padding:6px 9px;' +
                'cursor:pointer;' +
                'color:#ddd;' +
                'font-size:.75rem;' +
                'white-space:nowrap;';

            const icon = document.createElement('img');

            icon.src = LOGO + logo;
            icon.alt = '';
            icon.style.cssText =
                'width:18px;height:18px;' +
                'object-fit:contain;flex-shrink:0;';

            const text = document.createElement('span');

            text.textContent = name;

            option.appendChild(icon);
            option.appendChild(text);

            option.addEventListener('mouseenter', () => {
                option.style.background = '#444';
            });

            option.addEventListener('mouseleave', () => {
                option.style.background =
                    id === model ? '#444' : 'transparent';
            });

            option.addEventListener('click', event => {
                event.stopPropagation();

                setModel(id);

                const menu = $('copilot-model-options');

                if (menu) {
                    menu.style.display = 'none';
                }
            });

            container.appendChild(option);
        });

        updateModelOptionsState();
    }

    function updateModelOptionsState() {
        document
            .querySelectorAll('.copilot-model-option')
            .forEach(option => {
                const active =
                    option.dataset.copilotModel === model;

                option.classList.toggle('active', active);
                option.classList.toggle('selected', active);

                option.setAttribute(
                    'aria-selected',
                    active ? 'true' : 'false'
                );

                option.style.background =
                    active ? '#444' : 'transparent';
            });
    }

    function updateModelDisplay() {
        const current = findModel(model);

        if (!current) return;

        const text = $('copilot-model-text');
        const icon = $('copilot-model-icon');

        if (text) {
            text.textContent = current[1];
        }

        if (icon) {
            icon.src = LOGO + current[2];
        }

        updateModelOptionsState();
        updateImageUI();
    }

    function setModel(modelId) {
        if (!findModel(modelId)) {
            return false;
        }

        model = modelId;

        updateModelDisplay();

        return true;
    }

    /* ============================================================
     * IMAGE UI
     * ============================================================ */

    function updateImageUI() {
        const input = $('copilot-image-input');
        const label = $('copilot-image-label');

        if (!input || !label) return;

        const enabled = isVisionModel(model);

        input.disabled = !enabled;

        label.style.opacity = enabled ? '1' : '.3';
        label.style.color = enabled ? '#ccc' : '#888';
        label.style.cursor = enabled ? 'pointer' : 'default';

        if (!enabled) {
            image = null;
            input.value = '';
        }
    }

    function setImage(value) {
        image =
            typeof value === 'string'
                ? value.trim() || null
                : null;
    }

    function clearImage() {
        image = null;

        const input = $('copilot-image-input');

        if (input) {
            input.value = '';
        }
    }

    function bindImageInput() {
        const input = $('copilot-image-input');

        if (!input) return;

        if (
            input.dataset.iwpCopilotImageBound === '1'
        ) {
            updateImageUI();
            return;
        }

        input.dataset.iwpCopilotImageBound = '1';

        input.addEventListener('change', () => {
            const file = input.files?.[0];

            if (!file) {
                image = null;
                return;
            }

            if (!isVisionModel(model)) {
                input.value = '';
                image = null;
                toast('当前模型不支持图片');
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                image = String(reader.result || '');
            };

            reader.onerror = () => {
                image = null;
                toast('图片读取失败');
            };

            reader.readAsDataURL(file);
        });

        updateImageUI();
    }

    /* ============================================================
     * MODE
     * ============================================================ */

    const MODE_NAMES = {
        note: '本站笔记',
        textbook: '知识库',
        whiteboard: '白板AI'
    };

    function updateModeDisplay() {
        const text = $('copilot-mode-text');

        if (text) {
            text.textContent =
                MODE_NAMES[mode] || '本站笔记';
        }

        document
            .querySelectorAll('.copilot-mode-option')
            .forEach(node => {
                const active =
                    node.dataset.mode === mode;

                node.classList.toggle('active', active);
                node.classList.toggle('selected', active);

                node.style.background =
                    active ? '#444' : 'transparent';

                node.setAttribute(
                    'aria-selected',
                    active ? 'true' : 'false'
                );
            });
    }

    function setMode(nextMode) {
        if (!MODE_NAMES[nextMode]) {
            return false;
        }

        mode = nextMode;

        updateModeDisplay();

        const options = $('copilot-mode-options');

        if (options) {
            options.style.display = 'none';
        }

        return true;
    }

    function bindModeButtons() {
        const display = $('copilot-mode-display');
        const options = $('copilot-mode-options');

        if (
            display &&
            display.dataset.iwpCopilotModeDisplayBound !== '1'
        ) {
            display.dataset.iwpCopilotModeDisplayBound = '1';

            display.addEventListener('click', event => {
                event.stopPropagation();

                if (!options) return;

                options.style.display =
                    options.style.display === 'block'
                        ? 'none'
                        : 'block';
            });
        }

        /*
         * reader.html 实际使用：
         * data-mode="note"
         *
         * 不再错误寻找 data-copilot-mode。
         */
        document
            .querySelectorAll('.copilot-mode-option[data-mode]')
            .forEach(node => {
                if (
                    node.dataset.iwpCopilotModeBound === '1'
                ) {
                    return;
                }

                node.dataset.iwpCopilotModeBound = '1';

                node.addEventListener('click', event => {
                    event.stopPropagation();

                    setMode(node.dataset.mode);
                });

                node.addEventListener('mouseenter', () => {
                    node.style.background = '#444';
                });

                node.addEventListener('mouseleave', () => {
                    node.style.background =
                        node.dataset.mode === mode
                            ? '#444'
                            : 'transparent';
                });
            });

        updateModeDisplay();
    }

    /* ============================================================
     * SIDEBAR
     * ============================================================ */

    function getSidebar() {
        return $('sidebar');
    }

    function getTocView() {
        return $('sidebar-toc-view');
    }

    function getCopilotView() {
        return $('sidebar-copilot-view');
    }

    function getCopilotButton() {
        return $('btn-copilot');
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function showCopilotView() {
        const sidebar = getSidebar();
        const toc = getTocView();
        const copilot = getCopilotView();

        if (!sidebar || !toc || !copilot) {
            console.warn(
                '[IWP Copilot] Copilot DOM not found'
            );
            return false;
        }

        toc.style.display = 'none';
        copilot.style.display = 'flex';

        copilotOpen = true;

        /*
         * 移动端必须真正把 sidebar 滑出来。
         */
        if (isMobile()) {
            sidebar.classList.add('sidebar-open');

            const app = $('app');

            if (app) {
                app.classList.add('sidebar-active');
            }
        }

        const button = getCopilotButton();

        if (button) {
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }

        refresh();

        /*
         * 打开 Copilot 时同步历史记录。
         */
        refreshHistoryList();

        return true;
    }

    function hideCopilotView() {
        const sidebar = getSidebar();
        const toc = getTocView();
        const copilot = getCopilotView();

        if (!sidebar || !toc || !copilot) {
            return false;
        }

        copilot.style.display = 'none';
        toc.style.display = '';

        copilotOpen = false;

        if (isMobile()) {
            sidebar.classList.remove('sidebar-open');

            const app = $('app');

            if (app) {
                app.classList.remove('sidebar-active');
            }
        }

        const button = getCopilotButton();

        if (button) {
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
        }

        return true;
    }

    function toggleCopilot() {
        return copilotOpen
            ? hideCopilotView()
            : showCopilotView();
    }

    function openCopilot() {
        return showCopilotView();
    }

    function closeCopilot() {
        return hideCopilotView();
    }

    function isCopilotOpen() {
        const copilot = getCopilotView();

        if (!copilot) return false;

        return copilot.style.display !== 'none';
    }

    function bindCopilotButton() {
        const button = getCopilotButton();

        if (!button) {
            console.warn(
                '[IWP Copilot] #btn-copilot not found'
            );
            return;
        }

        if (
            button.dataset.iwpCopilotBound === '1'
        ) {
            return;
        }

        button.dataset.iwpCopilotBound = '1';

        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            toggleCopilot();
        });
    }

    /* ============================================================
     * LOADING
     * ============================================================ */

    function setLoading(on) {
        if (!els.messages) return;

        let node = $('copilot-thinking-status');

        if (on) {
            if (!node) {
                node = document.createElement('div');

                node.id = 'copilot-thinking-status';
                node.className = 'copilot-thinking-status';

                node.style.cssText =
                    'display:flex;align-items:center;gap:8px;' +
                    'padding:7px 10px;color:#aaa;font-size:.82rem;';

                node.innerHTML =
                    '<span class="copilot-spinner" ' +
                    'style="display:inline-block;width:13px;height:13px;' +
                    'border:2px solid #555;border-top-color:#ddd;' +
                    'border-radius:50%;animation:copilot-spin .8s linear infinite;"></span>' +
                    '<span>少女祈祷中...</span>';

                els.messages.appendChild(node);

                if (!document.getElementById('copilot-spin-style')) {
                    const style = document.createElement('style');

                    style.id = 'copilot-spin-style';

                    style.textContent =
                        '@keyframes copilot-spin{to{transform:rotate(360deg)}}';

                    document.head.appendChild(style);
                }
            }
        } else {
            node?.remove();
        }

        els.messages.scrollTop =
            els.messages.scrollHeight;
    }

    /* ============================================================
     * MESSAGE
     * ============================================================ */

    function appendMessage(role, text, reasoning) {
        if (!els.messages) return null;

        const box = document.createElement('div');

        box.className = 'copilot-message ' + role;

        box.style.cssText =
            'white-space:pre-wrap;' +
            'word-break:break-word;' +
            'margin:8px 0;';

        if (reasoning) {
            const think = document.createElement('details');

            think.className = 'copilot-reasoning';

            const summary = document.createElement('summary');

            summary.textContent = '思考过程';

            const body = document.createElement('div');

            body.style.cssText =
                'white-space:pre-wrap;' +
                'color:#999;font-size:.85rem;padding:6px 0;';

            body.textContent = reasoning;

            think.append(summary, body);
            box.appendChild(think);
        }

        const content = document.createElement('div');

        content.className = 'copilot-content';
        content.textContent = text || '';

        box.appendChild(content);
        els.messages.appendChild(box);

        els.messages.scrollTop =
            els.messages.scrollHeight;

        return {
            box,
            content,
            reasoning: reasoning || ''
        };
    }

    /* ============================================================
     * SSE
     * ============================================================ */

    async function readSSE(response, onEvent) {
        if (!response.body) {
            throw new Error('服务器没有返回流');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {
            const { done, value } =
                await reader.read();

            if (done) break;

            buffer += decoder.decode(
                value,
                { stream: true }
            );

            const lines = buffer.split('\n');

            buffer = lines.pop() || '';

            for (let line of lines) {
                line = line.trim();

                if (!line.startsWith('data:')) {
                    continue;
                }

                const raw =
                    line.slice(5).trim();

                if (!raw || raw === '[DONE]') {
                    continue;
                }

                try {
                    await onEvent(
                        JSON.parse(raw)
                    );
                } catch (_) {}
            }
        }

        if (buffer.trim().startsWith('data:')) {
            const raw =
                buffer.trim().slice(5).trim();

            if (raw && raw !== '[DONE]') {
                try {
                    await onEvent(
                        JSON.parse(raw)
                    );
                } catch (_) {}
            }
        }
    }

    /* ============================================================
     * SEND
     * ============================================================ */

    async function send() {
        if (busy) return;

        const input = els.input;

        const question =
            String(input?.value || '').trim();

        if (!question) return;

        if (!getToken()) {
            toast('请先登录');
            return;
        }

        busy = true;

        if (input) {
            input.value = '';
        }

        appendMessage('user', question);
        setLoading(true);

        let context = '';

        if (mode === 'note') {
            context = currentChapter();
        } else if (mode === 'whiteboard') {
            context = getWhiteboardContext();
        }

        history.push({
            role: 'user',
            content: question
        });

        let answer = '';
        let reasoning = '';
        let assistant = null;

        try {
            const response = await fetch(
                API + '/api/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'Bearer ' + getToken()
                    },
                    body: JSON.stringify({
                        mode,
                        model,
                        messages:
                            history.slice(-20),
                        chapterContext:
                            context,
                        whiteboardContext:
                            whiteboard,
                        image
                    })
                }
            );

            if (!response.ok) {
                const text =
                    await response.text();

                let err = {};

                try {
                    err = JSON.parse(text);
                } catch (_) {}

                throw new Error(
                    err.error ||
                    `HTTP ${response.status}`
                );
            }

            setLoading(false);

            await readSSE(
                response,
                async event => {
                    if (
                        event.type ===
                        'reasoning'
                    ) {
                        reasoning +=
                            event.text || '';

                        if (!assistant) {
                            assistant =
                                appendMessage(
                                    'assistant',
                                    '',
                                    reasoning
                                );
                        }

                        const body =
                            assistant.box
                                .querySelector(
                                    '.copilot-reasoning div'
                                );

                        if (body) {
                            body.textContent =
                                reasoning;
                        }

                    } else if (
                        event.type ===
                        'content'
                    ) {
                        answer +=
                            event.text || '';

                        if (!assistant) {
                            assistant =
                                appendMessage(
                                    'assistant',
                                    '',
                                    reasoning
                                );
                        }

                        assistant.content.textContent =
                            answer;

                        if (els.messages) {
                            els.messages.scrollTop =
                                els.messages.scrollHeight;
                        }

                    } else if (
                        event.type ===
                        'error'
                    ) {
                        throw new Error(
                            event.error ||
                            'stream error'
                        );
                    }
                }
            );

            history.push({
                role: 'assistant',
                content: answer
            });

            /*
             * 如果已经有 session，更新它。
             * 新对话第一次回答后没有 session，
             * 这里主动创建。
             */
            if (history.length >= 2) {
                await saveHistory();
            }

            await refreshHistoryList();

        } catch (error) {
            setLoading(false);

            toast(
                error?.message ||
                '请求失败'
            );

            if (
                history.length &&
                history[
                    history.length - 1
                ]?.role === 'user'
            ) {
                history.pop();
            }
        } finally {
            busy = false;
            image = null;
        }
    }

    /* ============================================================
     * HISTORY
     * ============================================================ */

    async function loadHistoryList() {
        try {
            const data =
                await api('/api/history');

            /*
             * Worker 可能直接返回数组，
             * 也可能包在 histories/history/data 里面。
             */
            if (Array.isArray(data)) {
                return data;
            }

            if (Array.isArray(data?.history)) {
                return data.history;
            }

            if (Array.isArray(data?.histories)) {
                return data.histories;
            }

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            return [];
        } catch (error) {
            console.warn(
                '[IWP Copilot] history list failed:',
                error
            );

            return [];
        }
    }

    function getHistoryTitle(item) {
        return String(
            item?.title ||
            item?.name ||
            item?.messages?.find(
                x => x?.role === 'user'
            )?.content ||
            '新对话'
        ).slice(0, 40);
    }

    function getHistoryId(item) {
        return (
            item?.id ||
            item?._id ||
            item?.sessionId ||
            item?.session_id ||
            null
        );
    }

    function renderHistoryList(items) {
        const container =
            $('copilot-history-list');

        if (!container) return;

        container.innerHTML = '';

        if (!getToken()) {
            container.textContent =
                '登录后显示历史记录';
            container.style.color = '#777';
            container.style.fontSize = '.75rem';
            return;
        }

        if (!items.length) {
            container.textContent =
                '暂无历史对话';
            container.style.color = '#777';
            container.style.fontSize = '.75rem';
            return;
        }

        items.forEach(item => {
            const id =
                getHistoryId(item);

            if (!id) return;

            const row =
                document.createElement('div');

            row.className =
                'copilot-history-item';

            row.dataset.copilotHistoryId =
                id;

            row.style.cssText =
                'padding:5px 7px;' +
                'margin:2px 0;' +
                'border-radius:4px;' +
                'cursor:pointer;' +
                'font-size:.75rem;' +
                'color:#aaa;' +
                'white-space:nowrap;' +
                'overflow:hidden;' +
                'text-overflow:ellipsis;';

            row.textContent =
                getHistoryTitle(item);

            if (String(id) === String(sessionId)) {
                row.style.background = '#444';
                row.style.color = '#ddd';
            }

            row.addEventListener('mouseenter', () => {
                row.style.background = '#3a3a3a';
                row.style.color = '#ddd';
            });

            row.addEventListener('mouseleave', () => {
                row.style.background =
                    String(id) === String(sessionId)
                        ? '#444'
                        : 'transparent';

                row.style.color =
                    String(id) === String(sessionId)
                        ? '#ddd'
                        : '#aaa';
            });

            row.addEventListener('click', async () => {
                try {
                    await loadHistory(id);
                } catch (error) {
                    toast(
                        error?.message ||
                        '历史记录加载失败'
                    );
                }
            });

            container.appendChild(row);
        });
    }

    async function refreshHistoryList() {
        const container =
            $('copilot-history-list');

        if (!container) return;

        if (!getToken()) {
            renderHistoryList([]);
            return;
        }

        container.textContent =
            '加载历史记录…';

        try {
            const items =
                await loadHistoryList();

            renderHistoryList(items);
        } catch (_) {
            renderHistoryList([]);
        }
    }

    async function loadHistory(id) {
        if (!id) return null;

        const data =
            await api(
                '/api/history/' +
                encodeURIComponent(id)
            );

        sessionId = id;

        history =
            Array.isArray(data?.messages)
                ? data.messages
                : [];

        renderHistory();

        return data;
    }

    async function saveHistory(title) {
        if (!getToken()) {
            return null;
        }

        const data =
            await api(
                '/api/history',
                {
                    method: 'POST',
                    body: {
                        messages: history,
                        title:
                            String(
                                title ||
                                history.find(
                                    x =>
                                        x.role ===
                                        'user'
                                )?.content ||
                                '新对话'
                            ).slice(0, 100)
                    }
                }
            );

        if (data?.id) {
            sessionId = data.id;
        }

        return data;
    }

    async function deleteHistory(id) {
        if (!id) return false;

        await api(
            '/api/history/' +
            encodeURIComponent(id),
            {
                method: 'DELETE'
            }
        );

        if (
            String(sessionId) ===
            String(id)
        ) {
            sessionId = null;
            history = [];
            renderHistory();
        }

        await refreshHistoryList();

        return true;
    }

    function newConversation() {
        history = [];
        sessionId = null;
        image = null;

        if (els.messages) {
            els.messages.innerHTML = '';
        }

        setLoading(false);

        refreshHistoryList();
    }

    function renderHistory() {
        if (!els.messages) return;

        els.messages.innerHTML = '';

        history.forEach(message => {
            if (!message) return;

            if (
                message.role !== 'user' &&
                message.role !== 'assistant'
            ) {
                return;
            }

            if (
                typeof message.content !==
                'string'
            ) {
                return;
            }

            appendMessage(
                message.role,
                message.content
            );
        });
    }

    /* ============================================================
     * SEND / INPUT
     * ============================================================ */

    function bindSend() {
        els.messages =
            $('copilot-messages') ||
            document.querySelector(
                '.copilot-messages'
            );

        els.input =
            $('copilot-input') ||
            document.querySelector(
                '.copilot-input,' +
                'textarea[name="copilot-input"]'
            );

        qsa([
            '#copilot-send',
            '.copilot-send',
            '[data-copilot-send]'
        ]).forEach(button => {
            if (
                button.dataset.iwpCopilotSendBound ===
                '1'
            ) {
                return;
            }

            button.dataset.iwpCopilotSendBound =
                '1';

            button.addEventListener(
                'click',
                send
            );
        });

        if (
            els.input &&
            els.input.dataset.iwpCopilotInputBound !==
            '1'
        ) {
            els.input.dataset.iwpCopilotInputBound =
                '1';

            els.input.addEventListener(
                'keydown',
                event => {
                    if (
                        event.key === 'Enter' &&
                        !event.shiftKey
                    ) {
                        event.preventDefault();
                        send();
                    }
                }
            );
        }
    }

    /* ============================================================
     * MODEL BINDING
     * ============================================================ */

    function bindModelButtons() {
        /*
         * 菜单是 JS 动态生成的，所以先生成。
         */
        renderModelOptions();

        const display =
            $('copilot-model-display');

        const options =
            $('copilot-model-options');

        if (
            display &&
            display.dataset.iwpCopilotModelDisplayBound !==
            '1'
        ) {
            display.dataset.iwpCopilotModelDisplayBound =
                '1';

            display.addEventListener(
                'click',
                event => {
                    event.stopPropagation();

                    if (!options) return;

                    options.style.display =
                        options.style.display === 'block'
                            ? 'none'
                            : 'block';
                }
            );
        }

        updateModelDisplay();
    }

    /* ============================================================
     * NEW CHAT
     * ============================================================ */

    function bindHistoryButtons() {
        qsa([
            '#copilot-new-chat',
            '.copilot-new-chat',
            '[data-copilot-new-chat]'
        ]).forEach(button => {
            if (
                button.dataset.iwpCopilotHistoryBound ===
                '1'
            ) {
                return;
            }

            button.dataset.iwpCopilotHistoryBound =
                '1';

            button.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();
                    newConversation();
                }
            );
        });
    }

    /* ============================================================
     * GLOBAL CLICK
     *
     * 点击外部关闭两个下拉菜单。
     * 不影响 Copilot 按钮。
     * ============================================================ */

    function bindGlobalDropdownClose() {
        if (window.__IWP_COPILOT_GLOBAL_CLICK__) {
            return;
        }

        window.__IWP_COPILOT_GLOBAL_CLICK__ = true;

        document.addEventListener(
            'click',
            event => {
                const modeDrop =
                    $('copilot-mode-dropdown');

                const modelDrop =
                    $('copilot-model-dropdown');

                if (
                    modeDrop &&
                    !modeDrop.contains(event.target)
                ) {
                    const options =
                        $('copilot-mode-options');

                    if (options) {
                        options.style.display =
                            'none';
                    }
                }

                if (
                    modelDrop &&
                    !modelDrop.contains(event.target)
                ) {
                    const options =
                        $('copilot-model-options');

                    if (options) {
                        options.style.display =
                            'none';
                    }
                }
            }
        );
    }

    /* ============================================================
     * REFRESH
     * ============================================================ */

    function refresh() {
        els.messages =
            $('copilot-messages') ||
            document.querySelector(
                '.copilot-messages'
            );

        els.input =
            $('copilot-input') ||
            document.querySelector(
                '.copilot-input,' +
                'textarea[name="copilot-input"]'
            );

        bindCopilotButton();
        bindModeButtons();
        bindModelButtons();
        bindImageInput();
        bindSend();
        bindHistoryButtons();
        bindGlobalDropdownClose();

        setMode(mode);
        setModel(model);

        return true;
    }

    /* ============================================================
     * DOM OBSERVER
     * ============================================================ */

    function watchDOM() {
        if (
            typeof MutationObserver ===
            'undefined' ||
            window.__IWP_COPILOT_OBSERVER__
        ) {
            return;
        }

        let timer = null;

        const observer =
            new MutationObserver(() => {
                clearTimeout(timer);

                timer = setTimeout(
                    () => {
                        refresh();
                    },
                    80
                );
            });

        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );

        window.__IWP_COPILOT_OBSERVER__ =
            observer;
    }

    /* ============================================================
     * GLOBAL API
     * ============================================================ */

    window.IWPCopilot = {
        api,

        send,

        setMode,
        setModel,

        setWhiteboard,

        setImage,
        clearImage,

        loadHistoryList,
        loadHistory,
        saveHistory,
        deleteHistory,

        newConversation,

        open: openCopilot,
        close: closeCopilot,
        toggle: toggleCopilot,
        isOpen: isCopilotOpen,

        refresh,

        getMode: () => mode,
        getModel: () => model,
        getModels: () => ALL_MODELS.slice(),
        getHistory: () => history.slice(),
        getSessionId: () => sessionId,

        getToken,
        getUser
    };

    /* ============================================================
     * INIT
     * ============================================================ */

    function init() {
        const toc = getTocView();
        const copilot = getCopilotView();

        /*
         * 初始保持目录。
         */
        if (toc && copilot) {
            copilot.style.display = 'none';
            toc.style.display = '';
        }

        copilotOpen = false;

        const button =
            getCopilotButton();

        if (button) {
            button.setAttribute(
                'aria-expanded',
                'false'
            );
        }

        refresh();

        watchDOM();
    }

    if (
        document.readyState ===
        'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            init,
            { once: true }
        );
    } else {
        init();
    }

})();
