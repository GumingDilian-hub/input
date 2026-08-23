/* ============================================================
 * IWP Copilot — full rollback-compatible client
 *
 * UI / DOM contract remains unchanged.
 *
 * Authentication:
 *   iwp-user / localStorage
 *
 * Worker:
 *   https://copilot.2167964516.workers.dev
 *
 * Supported modes:
 *   note
 *   whiteboard
 *   textbook
 *
 * Features:
 *   - Multi-model
 *   - Vision model
 *   - SSE streaming
 *   - Reasoning display
 *   - Conversation history
 *   - Whiteboard context
 *   - Textbook mode
 *   - Image input
 *   - Login state
 *   - Existing DOM compatibility
 * ============================================================ */

(function () {
    'use strict';

    /* ==========================================================
     * Configuration
     * ========================================================== */

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
        [
            'meta/llama-3.2-90b-vision-instruct',
            'Meta 3.2 视觉',
            '2.png'
        ]
    ];

    const ALL_MODELS = TEXT_MODELS.concat(VISION_MODELS);

    const DEFAULT_MODEL = TEXT_MODELS[0][0];

    const MAX_HISTORY_MESSAGES = 100;
    const SEND_HISTORY_MESSAGES = 20;
    const MAX_MESSAGE_LENGTH = 20000;
    const MAX_TITLE_LENGTH = 100;

    /* ==========================================================
     * Runtime state
     * ========================================================== */

    let mode = 'note';
    let model = DEFAULT_MODEL;
    let image = null;

    let history = [];
    let sessionId = null;

    let busy = false;
    let whiteboard = '';

    let els = {};

    let historyList = [];
    let initialized = false;

    /* ==========================================================
     * DOM helpers
     * ========================================================== */

    const $ = id => document.getElementById(id);

    function query(selectors) {
        for (const selector of selectors) {
            const node = document.querySelector(selector);
            if (node) return node;
        }
        return null;
    }

    function queryAll(selectors) {
        const result = [];

        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach(node => {
                if (!result.includes(node)) {
                    result.push(node);
                }
            });
        }

        return result;
    }

    /* ==========================================================
     * Authentication
     * ========================================================== */

    function getUser() {
        try {
            return JSON.parse(
                localStorage.getItem('iwp-user') || 'null'
            );
        } catch (_) {
            return null;
        }
    }

    function getToken() {
        return getUser()?.token || null;
    }

    function isLoggedIn() {
        return !!getToken();
    }

    /* ==========================================================
     * Toast
     * ========================================================== */

    function toast(message) {
        document
            .querySelectorAll('.copilot-toast')
            .forEach(x => x.remove());

        const node = document.createElement('div');

        node.className = 'copilot-toast';

        node.style.cssText = [
            'position:fixed',
            'bottom:20px',
            'left:50%',
            'transform:translateX(-50%)',
            'background:rgba(0,0,0,.88)',
            'color:#eee',
            'padding:8px 20px',
            'border-radius:8px',
            'font-size:.85rem',
            'z-index:99999',
            'border:1px solid #555',
            'max-width:min(90vw,600px)',
            'text-align:center',
            'box-sizing:border-box'
        ].join(';');

        node.textContent = String(message || '');

        document.body.appendChild(node);

        setTimeout(() => {
            node.remove();
        }, 2200);
    }

    /* ==========================================================
     * Generic API
     * ========================================================== */

    async function api(path, options = {}) {
        const headers = Object.assign(
            {},
            options.headers || {}
        );

        const token = getToken();

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        let requestOptions = Object.assign(
            {},
            options
        );

        if (
            requestOptions.body &&
            typeof requestOptions.body !== 'string'
        ) {
            headers['Content-Type'] = 'application/json';

            requestOptions.body = JSON.stringify(
                requestOptions.body
            );
        }

        requestOptions.headers = headers;

        const response = await fetch(
            API + path,
            requestOptions
        );

        const text = await response.text();

        let data = {};

        try {
            data = text
                ? JSON.parse(text)
                : {};
        } catch (_) {
            data = {};
        }

        if (!response.ok) {
            const error = new Error(
                data?.error ||
                `HTTP ${response.status}`
            );

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data;
    }

    /* ==========================================================
     * Context
     * ========================================================== */

    function fullNoteContext() {
        const article =
            $('article-body') ||
            document.querySelector('#article-body');

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
        return String(
            whiteboard ||
            ''
        ).trim();
    }

    /* ==========================================================
     * Model helpers
     * ========================================================== */

    function getModel(id) {
        return ALL_MODELS.find(
            item => item[0] === id
        ) || null;
    }

    function isVisionModel(id) {
        return VISION_MODELS.some(
            item => item[0] === id
        );
    }

    function setModelInternal(id) {
        if (!id) return;

        const found = getModel(id);

        if (!found) {
            return;
        }

        model = found[0];

        updateModelUI();
    }

    function updateModelUI() {
        queryAll([
            '[data-copilot-model]'
        ]).forEach(node => {
            const active =
                node.dataset.copilotModel === model;

            node.classList.toggle(
                'active',
                active
            );

            node.classList.toggle(
                'selected',
                active
            );

            node.setAttribute(
                'aria-selected',
                active ? 'true' : 'false'
            );
        });

        const current = getModel(model);

        if (!current) {
            return;
        }

        const modelName =
            current[1];

        queryAll([
            '[data-copilot-current-model]',
            '.copilot-current-model',
            '#copilot-current-model'
        ]).forEach(node => {
            node.textContent = modelName;
        });
    }

    function updateModeUI() {
        queryAll([
            '[data-copilot-mode]'
        ]).forEach(node => {
            const active =
                node.dataset.copilotMode === mode;

            node.classList.toggle(
                'active',
                active
            );

            node.classList.toggle(
                'selected',
                active
            );

            node.setAttribute(
                'aria-selected',
                active ? 'true' : 'false'
            );
        });
    }

    /* ==========================================================
     * Loading state
     * ========================================================== */

    function setLoading(on) {
        if (!els.messages) {
            return;
        }

        let node =
            $('copilot-thinking-status');

        if (on) {
            if (!node) {
                node = document.createElement(
                    'div'
                );

                node.id =
                    'copilot-thinking-status';

                node.className =
                    'copilot-thinking-status';

                node.style.cssText = [
                    'display:flex',
                    'align-items:center',
                    'gap:8px',
                    'padding:7px 10px',
                    'color:#aaa',
                    'font-size:.82rem',
                    'opacity:.95'
                ].join(';');

                node.innerHTML =
                    '<span class="copilot-spinner" ' +
                    'style="' +
                    'display:inline-block;' +
                    'width:13px;' +
                    'height:13px;' +
                    'border:2px solid #555;' +
                    'border-top-color:#ddd;' +
                    'border-radius:50%;' +
                    'animation:copilot-spin .8s linear infinite;' +
                    '">' +
                    '</span>' +
                    '<span>少女祈祷中...</span>';

                els.messages.appendChild(node);

                if (
                    !document.getElementById(
                        'copilot-spin-style'
                    )
                ) {
                    const style =
                        document.createElement(
                            'style'
                        );

                    style.id =
                        'copilot-spin-style';

                    style.textContent =
                        '@keyframes copilot-spin{' +
                        'to{transform:rotate(360deg)}' +
                        '}';

                    document.head.appendChild(
                        style
                    );
                }
            }
        } else {
            node?.remove();
        }

        els.messages.scrollTop =
            els.messages.scrollHeight;
    }

    /* ==========================================================
     * Message rendering
     * ========================================================== */

    function appendMessage(
        role,
        text,
        reasoning
    ) {
        if (!els.messages) {
            return null;
        }

        const box =
            document.createElement('div');

        box.className =
            'copilot-message ' + role;

        box.style.cssText =
            'white-space:pre-wrap;' +
            'word-break:break-word;' +
            'margin:8px 0;';

        let reasoningNode = null;

        if (reasoning) {
            reasoningNode =
                document.createElement(
                    'details'
                );

            reasoningNode.className =
                'copilot-reasoning';

            const summary =
                document.createElement(
                    'summary'
                );

            summary.textContent =
                '思考过程';

            const body =
                document.createElement(
                    'div'
                );

            body.style.cssText =
                'white-space:pre-wrap;' +
                'color:#999;' +
                'font-size:.85rem;' +
                'padding:6px 0;';

            body.textContent =
                reasoning;

            reasoningNode.append(
                summary,
                body
            );

            box.appendChild(
                reasoningNode
            );
        }

        const content =
            document.createElement(
                'div'
            );

        content.className =
            'copilot-content';

        content.textContent =
            text || '';

        box.appendChild(
            content
        );

        els.messages.appendChild(
            box
        );

        els.messages.scrollTop =
            els.messages.scrollHeight;

        return {
            box,
            content,
            reasoning:
                reasoning || ''
        };
    }

    /* ==========================================================
     * Render existing history
     * ========================================================== */

    function clearMessages() {
        if (!els.messages) {
            return;
        }

        els.messages.innerHTML = '';
    }

    function renderHistory() {
        clearMessages();

        for (const message of history) {
            if (!message) continue;

            if (
                message.role !== 'user' &&
                message.role !== 'assistant'
            ) {
                continue;
            }

            if (
                typeof message.content !==
                'string'
            ) {
                continue;
            }

            appendMessage(
                message.role,
                message.content
            );
        }

        if (els.messages) {
            els.messages.scrollTop =
                els.messages.scrollHeight;
        }
    }

    /* ==========================================================
     * SSE parser
     * ========================================================== */

    async function readSSE(
        response,
        onEvent
    ) {
        if (!response.body) {
            throw new Error(
                '浏览器未提供流式响应'
            );
        }

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();

        let buffer = '';

        while (true) {
            const {
                done,
                value
            } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(
                value,
                {
                    stream: true
                }
            );

            const lines =
                buffer.split('\n');

            buffer =
                lines.pop() || '';

            for (let line of lines) {
                line =
                    line.replace(
                        /\r$/,
                        ''
                    );

                if (
                    !line.startsWith(
                        'data:'
                    )
                ) {
                    continue;
                }

                const raw =
                    line.slice(5).trim();

                if (!raw) {
                    continue;
                }

                if (
                    raw === '[DONE]'
                ) {
                    await onEvent({
                        type: 'done'
                    });

                    continue;
                }

                try {
                    await onEvent(
                        JSON.parse(raw)
                    );
                } catch (_) {
                    /* ignore malformed SSE event */
                }
            }
        }

        if (buffer.trim()) {
            const lines =
                buffer.split('\n');

            for (let line of lines) {
                line =
                    line.replace(
                        /\r$/,
                        ''
                    );

                if (
                    !line.startsWith(
                        'data:'
                    )
                ) {
                    continue;
                }

                const raw =
                    line.slice(5).trim();

                if (
                    !raw ||
                    raw === '[DONE]'
                ) {
                    continue;
                }

                try {
                    await onEvent(
                        JSON.parse(raw)
                    );
                } catch (_) {
                    /* ignore */
                }
            }
        }
    }

    /* ==========================================================
     * Chat request
     * ========================================================== */

    async function send() {
        if (busy) {
            return;
        }

        const input =
            els.input;

        const question =
            String(
                input?.value || ''
            ).trim();

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
            input.style.height = '';
        }

        appendMessage(
            'user',
            question
        );

        setLoading(true);

        const context =
            mode === 'note'
                ? currentChapter()
                : mode === 'whiteboard'
                    ? getWhiteboardContext()
                    : '';

        history.push({
            role: 'user',
            content: question
        });

        history =
            history.slice(
                -MAX_HISTORY_MESSAGES
            );

        let answer = '';
        let reasoning = '';
        let assistant = null;

        try {
            const payload = {
                mode,
                model,
                messages:
                    history.slice(
                        -SEND_HISTORY_MESSAGES
                    ),
                chapterContext:
                    context,
                whiteboardContext:
                    getWhiteboardContext(),
                image
            };

            const response =
                await fetch(
                    API + '/api/chat',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',

                            Authorization:
                                'Bearer ' +
                                getToken()
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

            if (!response.ok) {
                const text =
                    await response.text();

                let errorData = {};

                try {
                    errorData =
                        text
                            ? JSON.parse(text)
                            : {};
                } catch (_) {
                    errorData = {};
                }

                const error =
                    new Error(
                        errorData.error ||
                        `HTTP ${response.status}`
                    );

                error.status =
                    response.status;

                error.data =
                    errorData;

                throw error;
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

                        const details =
                            assistant.box
                                .querySelector(
                                    '.copilot-reasoning'
                                );

                        const body =
                            details?.querySelector(
                                'div'
                            );

                        if (body) {
                            body.textContent =
                                reasoning;
                        }

                        els.messages.scrollTop =
                            els.messages
                                .scrollHeight;
                    }

                    else if (
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

                        assistant.content
                            .textContent =
                            answer;

                        els.messages.scrollTop =
                            els.messages
                                .scrollHeight;
                    }

                    else if (
                        event.type ===
                        'error'
                    ) {
                        throw new Error(
                            event.error ||
                            'stream error'
                        );
                    }

                    else if (
                        event.type ===
                        'done'
                    ) {
                        /* normal completion */
                    }
                }
            );

            if (
                !assistant &&
                (answer || reasoning)
            ) {
                assistant =
                    appendMessage(
                        'assistant',
                        answer,
                        reasoning
                    );
            }

            history.push({
                role: 'assistant',
                content: answer
            });

            history =
                history.slice(
                    -MAX_HISTORY_MESSAGES
                );

            /*
             * Save conversation.
             *
             * The old implementation only saved when
             * sessionId existed. Keep compatibility but
             * also create a session automatically after
             * the first successful answer.
             */

            const title =
                history
                    .find(
                        x =>
                            x?.role ===
                            'user'
                    )
                    ?.content
                    ?.slice(
                        0,
                        MAX_TITLE_LENGTH
                    ) ||
                '新对话';

            const saved =
                await api(
                    '/api/history',
                    {
                        method: 'POST',

                        body: {
                            id:
                                sessionId ||
                                undefined,

                            messages:
                                history,

                            title
                        }
                    }
                );

            if (saved?.id) {
                sessionId =
                    saved.id;
            }

        } catch (error) {
            setLoading(false);

            console.error(
                '[IWP Copilot]',
                error
            );

            toast(
                error?.message ||
                '请求失败'
            );

            /*
             * Remove the user message if
             * the request failed.
             */
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

            updateSendState();
        }
    }

    /* ==========================================================
     * New conversation
     * ========================================================== */

    function newChat() {
        if (busy) {
            return;
        }

        history = [];
        sessionId = null;
        image = null;

        clearMessages();

        if (els.input) {
            els.input.value = '';
            els.input.focus();
        }

        toast('已新建对话');
    }

    /* ==========================================================
     * History
     * ========================================================== */

    async function loadHistoryList() {
        if (!getToken()) {
            historyList = [];
            return [];
        }

        try {
            const result =
                await api(
                    '/api/history'
                );

            historyList =
                Array.isArray(result)
                    ? result
                    : [];

            return historyList;
        } catch (error) {
            console.error(
                '[IWP Copilot] history list:',
                error
            );

            if (
                error?.status === 401
            ) {
                historyList = [];
            }

            return [];
        }
    }

    async function loadHistory(id) {
        if (!id) {
            return null;
        }

        try {
            const record =
                await api(
                    '/api/history/' +
                    encodeURIComponent(id)
                );

            sessionId =
                record?.id ||
                id;

            history =
                Array.isArray(
                    record?.messages
                )
                    ? record.messages
                        .filter(
                            message =>
                                message &&
                                (
                                    message.role ===
                                        'user' ||
                                    message.role ===
                                        'assistant'
                                ) &&
                                typeof message.content ===
                                    'string'
                        )
                        .slice(
                            -MAX_HISTORY_MESSAGES
                        )
                    : [];

            renderHistory();

            return record;
        } catch (error) {
            console.error(
                '[IWP Copilot] load history:',
                error
            );

            toast(
                error?.message ||
                '读取历史失败'
            );

            return null;
        }
    }

    async function deleteHistory(id) {
        if (!id) {
            return false;
        }

        try {
            await api(
                '/api/history/' +
                encodeURIComponent(id),
                {
                    method: 'DELETE'
                }
            );

            historyList =
                historyList.filter(
                    item =>
                        item?.id !== id
                );

            if (
                sessionId === id
            ) {
                newChat();
            }

            return true;
        } catch (error) {
            console.error(
                '[IWP Copilot] delete history:',
                error
            );

            toast(
                error?.message ||
                '删除历史失败'
            );

            return false;
        }
    }

    /* ==========================================================
     * Input / image helpers
     * ========================================================== */

    function setImage(value) {
        if (
            typeof value ===
            'string' &&
            value.trim()
        ) {
            image =
                value.trim();
        } else {
            image = null;
        }

        updateVisionUI();
    }

    function clearImage() {
        image = null;
        updateVisionUI();
    }

    function updateVisionUI() {
        const hasImage =
            !!image;

        queryAll([
            '[data-copilot-image-status]',
            '.copilot-image-status',
            '#copilot-image-status'
        ]).forEach(node => {
            node.textContent =
                hasImage
                    ? '已添加图片'
                    : '';
        });

        queryAll([
            '[data-copilot-clear-image]',
            '.copilot-clear-image',
            '#copilot-clear-image'
        ]).forEach(node => {
            node.style.display =
                hasImage
                    ? ''
                    : 'none';
        });
    }

    function updateSendState() {
        const disabled =
            busy ||
            !String(
                els.input?.value || ''
            ).trim();

        queryAll([
            '#copilot-send',
            '.copilot-send',
            '[data-copilot-send]'
        ]).forEach(node => {
            node.disabled =
                disabled;
        });
    }

    /* ==========================================================
     * Mode
     * ========================================================== */

    function setModeInternal(value) {
        if (
            value !== 'note' &&
            value !== 'whiteboard' &&
            value !== 'textbook'
        ) {
            return;
        }

        mode = value;

        updateModeUI();
    }

    /* ==========================================================
     * Whiteboard
     * ========================================================== */

    function setWhiteboardContext(value) {
        whiteboard =
            String(
                value || ''
            );

        return whiteboard;
    }

    /* ==========================================================
     * DOM bindings
     * ========================================================== */

    function bindSendButton() {
        const sendButton =
            query([
                '#copilot-send',
                '.copilot-send',
                '[data-copilot-send]'
            ]);

        if (!sendButton) {
            return;
        }

        if (
            sendButton.dataset
                .copilotBound === '1'
        ) {
            return;
        }

        sendButton.dataset
            .copilotBound = '1';

        sendButton.addEventListener(
            'click',
            send
        );
    }

    function bindInput() {
        els.input =
            query([
                '#copilot-input',
                '.copilot-input',
                'textarea[name="copilot-input"]',
                'input[name="copilot-input"]'
            ]);

        if (!els.input) {
            return;
        }

        if (
            els.input.dataset
                .copilotBound === '1'
        ) {
            return;
        }

        els.input.dataset
            .copilotBound = '1';

        els.input.addEventListener(
            'keydown',
            event => {
                if (
                    event.key ===
                    'Enter' &&
                    !event.shiftKey
                ) {
                    event.preventDefault();

                    if (!busy) {
                        send();
                    }
                }
            }
        );

        els.input.addEventListener(
            'input',
            updateSendState
        );
    }

    function bindModes() {
        queryAll([
            '[data-copilot-mode]'
        ]).forEach(node => {
            if (
                node.dataset
                    .copilotBound === '1'
            ) {
                return;
            }

            node.dataset
                .copilotBound = '1';

            node.addEventListener(
                'click',
                () => {
                    setModeInternal(
                        node.dataset
                            .copilotMode
                    );
                }
            );
        });
    }

    function bindModels() {
        queryAll([
            '[data-copilot-model]'
        ]).forEach(node => {
            if (
                node.dataset
                    .copilotBound === '1'
            ) {
                return;
            }

            node.dataset
                .copilotBound = '1';

            node.addEventListener(
                'click',
                () => {
                    setModelInternal(
                        node.dataset
                            .copilotModel
                    );
                }
            );
        });
    }

    function bindNewChat() {
        queryAll([
            '[data-copilot-new]',
            '[data-copilot-new-chat]',
            '#copilot-new',
            '#copilot-new-chat',
            '.copilot-new',
            '.copilot-new-chat'
        ]).forEach(node => {
            if (
                node.dataset
                    .copilotBound === '1'
            ) {
                return;
            }

            node.dataset
                .copilotBound = '1';

            node.addEventListener(
                'click',
                newChat
            );
        });
    }

    function bindHistoryControls() {
        queryAll([
            '[data-copilot-history-id]'
        ]).forEach(node => {
            if (
                node.dataset
                    .copilotBound === '1'
            ) {
                return;
            }

            node.dataset
                .copilotBound = '1';

            node.addEventListener(
                'click',
                async () => {
                    const id =
                        node.dataset
                            .copilotHistoryId;

                    if (id) {
                        await loadHistory(
                            id
                        );
                    }
                }
            );
        });
    }

    function bindImageControls() {
        queryAll([
            '[data-copilot-image-url]'
        ]).forEach(node => {
            if (
                node.dataset
                    .copilotBound === '1'
            ) {
                return;
            }

            node.dataset
                .copilotBound = '1';

            node.addEventListener(
                'click',
                () => {
                    setImage(
                        node.dataset
                            .copilotImageUrl
                    );
                }
            );
        });

        queryAll([
            '[data-copilot-clear-image]',
            '.copilot-clear-image',
            '#copilot-clear-image'
        ]).forEach(node => {
            if (
                node.dataset
                    .copilotBound === '1'
            ) {
                return;
            }

            node.dataset
                .copilotBound = '1';

            node.addEventListener(
                'click',
                clearImage
            );
        });
    }

    function bind() {
        els.messages =
            query([
                '#copilot-messages',
                '.copilot-messages'
            ]);

        bindInput();
        bindSendButton();
        bindModes();
        bindModels();
        bindNewChat();
        bindHistoryControls();
        bindImageControls();

        updateModeUI();
        updateModelUI();
        updateVisionUI();
        updateSendState();

        initialized = true;
    }

    /* ==========================================================
     * Dynamic DOM support
     *
     * Some IWP pages create Copilot controls after
     * DOMContentLoaded. A small observer restores bindings
     * without changing the existing UI.
     * ========================================================== */

    function observeDOM() {
        if (
            window.__IWP_COPILOT_OBSERVER__
        ) {
            return;
        }

        if (!document.body) {
            return;
        }

        const observer =
            new MutationObserver(
                () => {
                    if (!initialized) {
                        return;
                    }

                    bind();
                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

        window.__IWP_COPILOT_OBSERVER__ =
            observer;
    }

    /* ==========================================================
     * Public API
     * ========================================================== */

    window.IWPCopilot = {
        api,

        send,

        newChat,

        loadHistory,

        loadHistoryList,

        deleteHistory,

        getUser,

        getToken,

        getModel,

        isVisionModel,

        setMode: setModeInternal,

        setModel: setModelInternal,

        setWhiteboard:
            setWhiteboardContext,

        setImage,

        clearImage,

        getHistory: () =>
            history.slice(),

        getSessionId: () =>
            sessionId,

        getMode: () =>
            mode,

        getModelId: () =>
            model,

        getWhiteboard: () =>
            whiteboard,

        isBusy: () =>
            busy,

        models: ALL_MODELS,

        textModels: TEXT_MODELS,

        visionModels:
            VISION_MODELS,

        config: {
            API,
            LOGO,
            ADMIN,
            DEFAULT_MODEL
        }
    };

    /* ==========================================================
     * Initialization
     * ========================================================== */

    function init() {
        bind();
        observeDOM();

        /*
         * Do not force-load history here.
         * Existing IWP UI may decide when the history panel
         * is opened. The public loadHistoryList() API remains
         * available for it.
         */
    }

    if (
        document.readyState ===
        'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            init,
            {
                once: true
            }
        );
    } else {
        init();
    }

})();
