/* ============================================================
 * IWP Copilot
 * Rollback-compatible client
 *
 * IMPORTANT:
 * Actual reader.html DOM:
 *
 *   #btn-copilot
 *   #sidebar
 *   #sidebar-toc-view
 *   #sidebar-copilot-view
 *
 * Copilot does NOT own a separate sidebar.
 * It switches the existing reader sidebar between:
 *
 *   TOC view <-> Copilot view
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
    let els = {};
    let copilotOpen = false;

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

        let requestOptions = Object.assign({}, options);

        if (requestOptions.body && typeof requestOptions.body !== 'string') {
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

        if (!article) {
            return '';
        }

        return String(
            article.innerText ||
            article.textContent ||
            ''
        ).trim();
    }

    function currentChapter() {
        return fullNoteContext();
    }

    function getWhiteboardContext() {
        return String(whiteboard || '');
    }

    function setWhiteboard(value) {
        whiteboard = String(value || '');
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

    function setModel(modelId) {
        if (!findModel(modelId)) {
            return false;
        }

        model = modelId;

        document.querySelectorAll('[data-copilot-model]').forEach(node => {
            const active = node.dataset.copilotModel === modelId;

            node.classList.toggle('active', active);
            node.classList.toggle('selected', active);
            node.setAttribute(
                'aria-selected',
                active ? 'true' : 'false'
            );
        });

        updateModelDisplay();

        return true;
    }

    function updateModelDisplay() {
        const current = findModel(model);

        if (!current) {
            return;
        }

        const name = current[1];
        const logo = current[2];

        const text = $('copilot-model-text');
        const icon = $('copilot-model-icon');

        if (text) {
            text.textContent = name;
        }

        if (icon) {
            icon.src = LOGO + logo;
        }
    }

    /* ============================================================
     * MODE
     * ============================================================ */

    function setMode(nextMode) {
        if (!['note', 'whiteboard', 'textbook'].includes(nextMode)) {
            return false;
        }

        mode = nextMode;

        document.querySelectorAll('[data-copilot-mode]').forEach(node => {
            const active = node.dataset.copilotMode === nextMode;

            node.classList.toggle('active', active);
            node.classList.toggle('selected', active);

            node.setAttribute(
                'aria-selected',
                active ? 'true' : 'false'
            );
        });

        updateModeDisplay();

        return true;
    }

    function updateModeDisplay() {
        const text = $('copilot-mode-text');

        if (!text) {
            return;
        }

        const names = {
            note: '本站笔记',
            textbook: '知识库',
            whiteboard: '白板AI'
        };

        text.textContent = names[mode] || '本站笔记';
    }

    /* ============================================================
     * COPILOT SIDEBAR
     *
     * THIS IS THE IMPORTANT FIX.
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
        return window.innerWidth < 768;
    }

    function showCopilotView() {
        const sidebar = getSidebar();
        const toc = getTocView();
        const copilot = getCopilotView();

        if (!sidebar || !toc || !copilot) {
            console.warn(
                '[IWP Copilot] sidebar DOM not found'
            );
            return false;
        }

        toc.style.display = 'none';

        copilot.style.display = 'flex';

        copilotOpen = true;

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
        if (copilotOpen) {
            return hideCopilotView();
        }

        return showCopilotView();
    }

    function openCopilot() {
        return showCopilotView();
    }

    function closeCopilot() {
        return hideCopilotView();
    }

    function isCopilotOpen() {
        const copilot = getCopilotView();

        if (!copilot) {
            return false;
        }

        return copilot.style.display !== 'none';
    }

    /* ============================================================
     * COPILOT BUTTON
     * ============================================================ */

    function bindCopilotButton() {
        const button = getCopilotButton();

        if (!button) {
            console.warn(
                '[IWP Copilot] #btn-copilot not found'
            );
            return;
        }

        if (button.dataset.iwpCopilotBound === '1') {
            return;
        }

        button.dataset.iwpCopilotBound = '1';

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            toggleCopilot();
        });
    }

    /* ============================================================
     * LOADING
     * ============================================================ */

    function setLoading(on) {
        if (!els.messages) {
            return;
        }

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
                    'border-radius:50%;animation:copilot-spin .8s linear infinite;">' +
                    '</span>' +
                    '<span>少女祈祷中...</span>';

                els.messages.appendChild(node);

                if (!document.getElementById('copilot-spin-style')) {
                    const style = document.createElement('style');

                    style.id = 'copilot-spin-style';

                    style.textContent =
                        '@keyframes copilot-spin{' +
                        'to{transform:rotate(360deg)}}';

                    document.head.appendChild(style);
                }
            }
        } else {
            node?.remove();
        }

        els.messages.scrollTop = els.messages.scrollHeight;
    }

    /* ============================================================
     * MESSAGE
     * ============================================================ */

    function appendMessage(role, text, reasoning) {
        if (!els.messages) {
            return null;
        }

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
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

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

                const raw = line.slice(5).trim();

                if (!raw || raw === '[DONE]') {
                    continue;
                }

                try {
                    await onEvent(JSON.parse(raw));
                } catch (_) {}
            }
        }

        if (buffer.trim().startsWith('data:')) {
            const raw = buffer.trim().slice(5).trim();

            if (raw && raw !== '[DONE]') {
                try {
                    await onEvent(JSON.parse(raw));
                } catch (_) {}
            }
        }
    }

    /* ============================================================
     * SEND
     * ============================================================ */

    async function send() {
        if (busy) {
            return;
        }

        const input = els.input;

        const question =
            String(input?.value || '').trim();

        if (!question) {
            return;
        }

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
                        Authorization: 'Bearer ' + getToken()
                    },
                    body: JSON.stringify({
                        mode,
                        model,
                        messages: history.slice(-20),
                        chapterContext: context,
                        whiteboardContext: whiteboard,
                        image
                    })
                }
            );

            if (!response.ok) {
                const text = await response.text();

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
                    if (event.type === 'reasoning') {
                        reasoning += event.text || '';

                        if (!assistant) {
                            assistant =
                                appendMessage(
                                    'assistant',
                                    '',
                                    reasoning
                                );
                        }

                        const details =
                            assistant.box.querySelector(
                                '.copilot-reasoning'
                            );

                        const body =
                            details?.querySelector('div');

                        if (body) {
                            body.textContent = reasoning;
                        }

                    } else if (event.type === 'content') {
                        answer += event.text || '';

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

                    } else if (event.type === 'error') {
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

            if (sessionId) {
                await api(
                    '/api/history',
                    {
                        method: 'POST',
                        body: {
                            messages: history,
                            title:
                                history.find(
                                    x => x.role === 'user'
                                )?.content?.slice(0, 40) ||
                                '新对话'
                        }
                    }
                );
            }

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
     * IMAGE
     * ============================================================ */

    function setImage(value) {
        image =
            typeof value === 'string'
                ? value.trim() || null
                : null;
    }

    function clearImage() {
        image = null;
    }

    function bindImageInput() {
        const input = qs([
            '#copilot-image',
            '#copilot-image-input',
            'input[data-copilot-image]',
            'input[type="file"].copilot-image'
        ]);

        if (!input ||
            input.dataset.iwpCopilotImageBound === '1') {
            return;
        }

        input.dataset.iwpCopilotImageBound = '1';

        input.addEventListener(
            'change',
            () => {
                const file = input.files?.[0];

                if (!file) {
                    image = null;
                    return;
                }

                const reader = new FileReader();

                reader.onload = () => {
                    image =
                        String(
                            reader.result || ''
                        );
                };

                reader.onerror = () => {
                    image = null;
                    toast('图片读取失败');
                };

                reader.readAsDataURL(file);
            }
        );
    }

    /* ============================================================
     * HISTORY
     * ============================================================ */

    async function loadHistoryList() {
        try {
            return await api('/api/history');
        } catch (error) {
            console.warn(
                '[IWP Copilot] history list failed:',
                error
            );

            return [];
        }
    }

    async function loadHistory(id) {
        if (!id) {
            return null;
        }

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
                                    x => x.role === 'user'
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
        if (!id) {
            return false;
        }

        await api(
            '/api/history/' +
            encodeURIComponent(id),
            {
                method: 'DELETE'
            }
        );

        if (sessionId === id) {
            sessionId = null;
            history = [];
            renderHistory();
        }

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
    }

    function renderHistory() {
        if (!els.messages) {
            return;
        }

        els.messages.innerHTML = '';

        for (const message of history) {
            if (!message) {
                continue;
            }

            if (
                message.role !== 'user' &&
                message.role !== 'assistant'
            ) {
                continue;
            }

            if (
                typeof message.content !== 'string'
            ) {
                continue;
            }

            appendMessage(
                message.role,
                message.content
            );
        }
    }

    /* ============================================================
     * SEND / INPUT BINDING
     * ============================================================ */

    function bindSend() {
        els.messages =
            $('copilot-messages') ||
            document.querySelector('.copilot-messages');

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
                button.dataset.iwpCopilotSendBound === '1'
            ) {
                return;
            }

            button.dataset.iwpCopilotSendBound = '1';

            button.addEventListener(
                'click',
                send
            );
        });

        if (
            els.input &&
            els.input.dataset.iwpCopilotInputBound !== '1'
        ) {
            els.input.dataset.iwpCopilotInputBound = '1';

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
     * MODE BUTTONS
     * ============================================================ */

    function bindModeButtons() {
        document.querySelectorAll(
            '[data-copilot-mode]'
        ).forEach(node => {
            if (
                node.dataset.iwpCopilotModeBound === '1'
            ) {
                return;
            }

            node.dataset.iwpCopilotModeBound = '1';

            node.addEventListener(
                'click',
                () => {
                    setMode(
                        node.dataset.copilotMode
                    );
                }
            );
        });

        const display = $('copilot-mode-display');

        if (
            display &&
            display.dataset.iwpCopilotDisplayBound !== '1'
        ) {
            display.dataset.iwpCopilotDisplayBound = '1';

            display.addEventListener(
                'click',
                event => {
                    event.stopPropagation();

                    const options =
                        $('copilot-mode-options');

                    if (!options) {
                        return;
                    }

                    options.style.display =
                        options.style.display === 'block'
                            ? 'none'
                            : 'block';
                }
            );
        }
    }

    /* ============================================================
     * MODEL BUTTONS
     * ============================================================ */

    function bindModelButtons() {
        document.querySelectorAll(
            '[data-copilot-model]'
        ).forEach(node => {
            if (
                node.dataset.iwpCopilotModelBound === '1'
            ) {
                return;
            }

            node.dataset.iwpCopilotModelBound = '1';

            node.addEventListener(
                'click',
                () => {
                    setModel(
                        node.dataset.copilotModel
                    );
                }
            );
        });

        const display = $('copilot-model-display');

        if (
            display &&
            display.dataset.iwpCopilotDisplayBound !== '1'
        ) {
            display.dataset.iwpCopilotDisplayBound = '1';

            display.addEventListener(
                'click',
                event => {
                    event.stopPropagation();

                    const options =
                        $('copilot-model-options');

                    if (!options) {
                        return;
                    }

                    options.style.display =
                        options.style.display === 'block'
                            ? 'none'
                            : 'block';
                }
            );
        }
    }

    /* ============================================================
     * NEW CHAT / HISTORY
     * ============================================================ */

    function bindHistoryButtons() {
        qsa([
            '#copilot-new-chat',
            '.copilot-new-chat',
            '[data-copilot-new-chat]'
        ]).forEach(button => {
            if (
                button.dataset.iwpCopilotHistoryBound === '1'
            ) {
                return;
            }

            button.dataset.iwpCopilotHistoryBound = '1';

            button.addEventListener(
                'click',
                newConversation
            );
        });

        document.querySelectorAll(
            '[data-copilot-history-id]'
        ).forEach(node => {
            if (
                node.dataset.iwpCopilotHistoryItemBound === '1'
            ) {
                return;
            }

            node.dataset.iwpCopilotHistoryItemBound = '1';

            node.addEventListener(
                'click',
                async () => {
                    const id =
                        node.dataset.copilotHistoryId;

                    if (!id) {
                        return;
                    }

                    try {
                        await loadHistory(id);
                    } catch (error) {
                        toast(
                            error?.message ||
                            '历史记录加载失败'
                        );
                    }
                }
            );
        });
    }

    /* ============================================================
     * REFRESH
     * ============================================================ */

    function refresh() {
        els.messages =
            $('copilot-messages') ||
            document.querySelector('.copilot-messages');

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

        setMode(mode);
        setModel(model);

        return true;
    }

    /* ============================================================
     * DYNAMIC DOM
     * ============================================================ */

    function watchDOM() {
        if (
            typeof MutationObserver === 'undefined' ||
            window.__IWP_COPILOT_OBSERVER__
        ) {
            return;
        }

        let timer = null;

        const observer =
            new MutationObserver(() => {
                clearTimeout(timer);

                timer = setTimeout(
                    refresh,
                    50
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
     * START
     * ============================================================ */

    function init() {
        refresh();

        const toc = getTocView();
        const copilot = getCopilotView();

        if (toc && copilot) {
            copilot.style.display = 'none';
            toc.style.display = '';
        }

        copilotOpen = false;

        const button = getCopilotButton();

        if (button) {
            button.setAttribute(
                'aria-expanded',
                'false'
            );
        }

        watchDOM();
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            init,
            { once: true }
        );
    } else {
        init();
    }

})();
