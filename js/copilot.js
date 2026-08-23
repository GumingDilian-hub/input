/* ============================================================
 * IWP Copilot
 * Complete rollback-compatible client
 *
 * UI / DOM contract:
 *   - 保留现有 Copilot DOM
 *   - 保留 iwp-user/localStorage 登录方式
 *   - 保留 reader.js 使用的 Worker
 *
 * Worker:
 *   https://copilot.2167964516.workers.dev
 *
 * Features:
 *   - Note
 *   - Whiteboard
 *   - Textbook
 *   - SSE streaming
 *   - Reasoning display
 *   - Image / vision model
 *   - Conversation history
 *   - Login token
 *   - Model selection
 *   - Copilot sidebar toggle
 *
 * ============================================================ */

(function () {
    'use strict';

    /* ============================================================
     * CONFIG
     * ============================================================ */

    const API = 'https://copilot.2167964516.workers.dev';

    const LOGO = 'images/copilot/';

    const ADMIN = 'loading';

    /*
     * 文本模型
     *
     * [model id, display name, logo]
     */
    const TEXT_MODELS = [
        [
            'nvidia/nemotron-3-super-120b-a12b',
            'NVIDIA 3 super',
            '1.png'
        ],
        [
            'meta/llama-3.3-70b-instruct',
            'Meta 3.3',
            '2.png'
        ],
        [
            'openai/gpt-oss-120b',
            'ChatGPT',
            '3.png'
        ],
        [
            'openai/gpt-oss-20b',
            'CatGPT',
            '3.png'
        ],
        [
            'minimaxai/minimax-m3',
            'MiniMax',
            '5.png'
        ],
        [
            'deepseek-ai/deepseek-v4-flash',
            'DeepSeek V4',
            '6.png'
        ],
        [
            'z-ai/glm4.7',
            'GLM 4.7',
            '7.png'
        ],
        [
            'google/gemma-4-31b-it',
            'Google Gemma 4',
            '4.png'
        ]
    ];

    /*
     * 视觉模型
     */
    const VISION_MODELS = [
        [
            'meta/llama-3.2-90b-vision-instruct',
            'Meta 3.2 视觉',
            '2.png'
        ]
    ];

    const ALL_MODELS =
        TEXT_MODELS.concat(VISION_MODELS);


    /* ============================================================
     * STATE
     * ============================================================ */

    let mode = 'note';

    let model =
        TEXT_MODELS[0][0];

    let image = null;

    let history = [];

    let sessionId = null;

    let busy = false;

    let whiteboard = '';

    let els = {};

    /*
     * 当前 Copilot 是否打开。
     *
     * null = 尚未初始化
     */
    let copilotOpen = null;


    /* ============================================================
     * DOM HELPERS
     * ============================================================ */

    const $ = id =>
        document.getElementById(id);


    function qs(selectors) {
        for (const selector of selectors) {
            try {
                const node =
                    document.querySelector(selector);

                if (node) {
                    return node;
                }
            } catch (_) {}
        }

        return null;
    }


    function qsa(selectors) {
        const result = [];

        for (const selector of selectors) {
            try {
                document
                    .querySelectorAll(selector)
                    .forEach(node => {
                        if (!result.includes(node)) {
                            result.push(node);
                        }
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
            return JSON.parse(
                localStorage.getItem('iwp-user') ||
                'null'
            );
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
        const headers =
            Object.assign(
                {},
                options.headers || {}
            );

        const token =
            getToken();

        if (token) {
            headers.Authorization =
                'Bearer ' + token;
        }

        if (
            options.body &&
            typeof options.body !== 'string'
        ) {
            headers['Content-Type'] =
                'application/json';

            options =
                Object.assign(
                    {},
                    options,
                    {
                        body:
                            JSON.stringify(
                                options.body
                            )
                    }
                );
        }

        const response =
            await fetch(
                API + path,
                Object.assign(
                    {},
                    options,
                    {
                        headers
                    }
                )
            );

        const text =
            await response.text();

        let data = {};

        try {
            data =
                JSON.parse(text);
        } catch (_) {}

        if (!response.ok) {
            throw Object.assign(
                new Error(
                    data?.error ||
                    `HTTP ${response.status}`
                ),
                {
                    status:
                        response.status,
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
        document
            .querySelector(
                '.copilot-toast'
            )
            ?.remove();

        const node =
            document.createElement(
                'div'
            );

        node.className =
            'copilot-toast';

        node.style.cssText =
            [
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
                'pointer-events:none'
            ].join(';');

        node.textContent =
            String(message || '');

        document.body.appendChild(node);

        setTimeout(() => {
            node.remove();
        }, 2200);
    }


    /* ============================================================
     * ARTICLE / NOTE CONTEXT
     * ============================================================ */

    function fullNoteContext() {
        const article =
            $('article-body') ||
            document.querySelector(
                '#article-body'
            );

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


    /* ============================================================
     * WHITEBOARD
     * ============================================================ */

    function getWhiteboardContext() {
        return String(
            whiteboard || ''
        );
    }


    function setWhiteboard(value) {
        whiteboard =
            String(value || '');
    }


    /* ============================================================
     * MODEL HELPERS
     * ============================================================ */

    function findModel(modelId) {
        return ALL_MODELS.find(
            item =>
                item[0] === modelId
        ) || null;
    }


    function isVisionModel(modelId) {
        return VISION_MODELS.some(
            item =>
                item[0] === modelId
        );
    }


    function setModel(modelId) {
        const found =
            findModel(modelId);

        if (!found) {
            return false;
        }

        model =
            modelId;

        /*
         * 同步可能存在的模型 UI。
         */
        document
            .querySelectorAll(
                '[data-copilot-model]'
            )
            .forEach(node => {
                const active =
                    node.dataset.copilotModel ===
                    modelId;

                node.classList.toggle(
                    'active',
                    active
                );

                node.setAttribute(
                    'aria-selected',
                    active
                        ? 'true'
                        : 'false'
                );
            });

        return true;
    }


    function setMode(nextMode) {
        const valid =
            [
                'note',
                'whiteboard',
                'textbook'
            ];

        if (!valid.includes(nextMode)) {
            return false;
        }

        mode =
            nextMode;

        document
            .querySelectorAll(
                '[data-copilot-mode]'
            )
            .forEach(node => {
                const active =
                    node.dataset.copilotMode ===
                    nextMode;

                node.classList.toggle(
                    'active',
                    active
                );

                node.setAttribute(
                    'aria-selected',
                    active
                        ? 'true'
                        : 'false'
                );
            });

        return true;
    }


    /* ============================================================
     * THINKING / LOADING
     * ============================================================ */

    function setLoading(on) {
        if (!els.messages) {
            return;
        }

        let node =
            $('copilot-thinking-status');

        if (on) {
            if (!node) {
                node =
                    document.createElement(
                        'div'
                    );

                node.id =
                    'copilot-thinking-status';

                node.className =
                    'copilot-thinking-status';

                node.style.cssText =
                    [
                        'display:flex',
                        'align-items:center',
                        'gap:8px',
                        'padding:7px 10px',
                        'color:#aaa',
                        'font-size:.82rem',
                        'opacity:.95'
                    ].join(';');

                node.innerHTML =
                    `
                    <span
                        class="copilot-spinner"
                        style="
                            display:inline-block;
                            width:13px;
                            height:13px;
                            border:2px solid #555;
                            border-top-color:#ddd;
                            border-radius:50%;
                            animation:copilot-spin .8s linear infinite;
                        "
                    ></span>
                    <span>少女祈祷中...</span>
                    `;

                els.messages.appendChild(
                    node
                );

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
                        `
                        @keyframes copilot-spin {
                            to {
                                transform:rotate(360deg)
                            }
                        }
                        `;

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


    /* ============================================================
     * MESSAGE
     * ============================================================ */

    function appendMessage(
        role,
        text,
        reasoning
    ) {
        if (!els.messages) {
            return null;
        }

        const box =
            document.createElement(
                'div'
            );

        box.className =
            'copilot-message ' +
            role;

        box.style.cssText =
            [
                'white-space:pre-wrap',
                'word-break:break-word',
                'margin:8px 0'
            ].join(';');


        /*
         * Reasoning
         */
        if (reasoning) {
            const think =
                document.createElement(
                    'details'
                );

            think.className =
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
                [
                    'white-space:pre-wrap',
                    'color:#999',
                    'font-size:.85rem',
                    'padding:6px 0'
                ].join(';');

            body.textContent =
                reasoning;

            think.append(
                summary,
                body
            );

            box.appendChild(
                think
            );
        }


        /*
         * Content
         */
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


    /* ============================================================
     * SSE
     * ============================================================ */

    function readSSE(
        response,
        onEvent
    ) {
        if (!response.body) {
            throw new Error(
                '服务器没有返回流'
            );
        }

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();

        let buffer = '';

        return (async () => {
            while (true) {
                const {
                    done,
                    value
                } =
                    await reader.read();

                if (done) {
                    break;
                }

                buffer +=
                    decoder.decode(
                        value,
                        {
                            stream: true
                        }
                    );

                const lines =
                    buffer.split('\n');

                buffer =
                    lines.pop() || '';

                for (
                    let line of lines
                ) {
                    line =
                        line.trim();

                    if (
                        !line.startsWith(
                            'data:'
                        )
                    ) {
                        continue;
                    }

                    const raw =
                        line
                            .slice(5)
                            .trim();

                    if (!raw) {
                        continue;
                    }

                    try {
                        const event =
                            JSON.parse(raw);

                        await onEvent(
                            event
                        );
                    } catch (_) {
                        /*
                         * 单个 SSE event 解析失败，
                         * 不影响后续事件。
                         */
                    }
                }
            }

            /*
             * 尝试处理最后残留数据。
             */
            if (
                buffer.trim()
                    .startsWith('data:')
            ) {
                const raw =
                    buffer
                        .trim()
                        .slice(5)
                        .trim();

                if (
                    raw &&
                    raw !== '[DONE]'
                ) {
                    try {
                        await onEvent(
                            JSON.parse(raw)
                        );
                    } catch (_) {}
                }
            }
        })();
    }


    /* ============================================================
     * SEND
     * ============================================================ */

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
        }

        appendMessage(
            'user',
            question
        );

        setLoading(true);


        /*
         * Context
         */
        let context = '';

        if (mode === 'note') {
            context =
                currentChapter();
        } else if (
            mode === 'whiteboard'
        ) {
            context =
                getWhiteboardContext();
        }


        /*
         * History
         */
        history.push({
            role: 'user',
            content: question
        });


        let answer = '';

        let reasoning = '';

        let assistant = null;


        try {
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
                            JSON.stringify({
                                mode,
                                model,

                                messages:
                                    history.slice(
                                        -20
                                    ),

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
                    err =
                        JSON.parse(text);
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

                    /*
                     * Reasoning
                     */
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
                    }


                    /*
                     * Content
                     */
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

                        assistant.content.textContent =
                            answer;

                        if (els.messages) {
                            els.messages.scrollTop =
                                els.messages.scrollHeight;
                        }
                    }


                    /*
                     * Error
                     */
                    else if (
                        event.type ===
                        'error'
                    ) {
                        throw new Error(
                            event.error ||
                            'stream error'
                        );
                    }


                    /*
                     * Done
                     */
                    else if (
                        event.type ===
                        'done'
                    ) {
                        /*
                         * Worker 正常结束。
                         */
                    }
                }
            );


            /*
             * 保存 assistant message
             */
            history.push({
                role: 'assistant',
                content: answer
            });


            /*
             * History
             *
             * 只有已经存在 sessionId 时才保存，
             * 保留原有行为。
             */
            if (sessionId) {
                await api(
                    '/api/history',
                    {
                        method: 'POST',

                        body: {
                            messages:
                                history,

                            title:
                                history.find(
                                    x =>
                                        x.role ===
                                        'user'
                                )?.content
                                    ?.slice(
                                        0,
                                        40
                                    ) ||
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

            /*
             * 发送失败时删除刚刚加入的 user message。
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

            /*
             * 图片只使用一次。
             */
            image = null;
        }
    }


    /* ============================================================
     * IMAGE
     * ============================================================ */

    function setImage(value) {
        if (
            typeof value !== 'string'
        ) {
            image = null;
            return;
        }

        image =
            value.trim() ||
            null;
    }


    function clearImage() {
        image = null;
    }


    /* ============================================================
     * HISTORY
     * ============================================================ */

    async function loadHistoryList() {
        try {
            return await api(
                '/api/history'
            );
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

        sessionId =
            id;

        history =
            Array.isArray(
                data?.messages
            )
                ? data.messages
                : [];

        return data;
    }


    async function saveHistory(
        title
    ) {
        if (!getToken()) {
            return null;
        }

        const data =
            await api(
                '/api/history',
                {
                    method: 'POST',

                    body: {
                        messages:
                            history,

                        title:
                            String(
                                title ||
                                history.find(
                                    x =>
                                        x.role ===
                                        'user'
                                )?.content ||
                                '新对话'
                            ).slice(
                                0,
                                100
                            )
                    }
                }
            );

        if (data?.id) {
            sessionId =
                data.id;
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

        if (
            sessionId === id
        ) {
            sessionId = null;
            history = [];
        }

        return true;
    }


    function newConversation() {
        history = [];

        sessionId = null;

        if (els.messages) {
            els.messages.innerHTML = '';
        }

        image = null;

        setLoading(false);
    }


    /* ============================================================
     * SIDEBAR
     * ============================================================ */

    /*
     * 为了兼容你原来的 HTML，这里同时识别几种
     * 常见 Copilot 侧边栏命名。
     *
     * 不会创建新的 sidebar。
     */
    const SIDEBAR_SELECTORS = [
        '#copilot-sidebar',
        '#copilot-panel',
        '#copilot-side-panel',
        '#copilot-drawer',
        '.copilot-sidebar',
        '.copilot-panel',
        '.copilot-side-panel',
        '.copilot-drawer',
        '[data-copilot-sidebar]',
        '[data-copilot-panel]'
    ];


    /*
     * Copilot 按钮。
     *
     * 第一优先级是明确的 data 属性和 id，
     * 避免误伤其他按钮。
     */
    const TOGGLE_BUTTON_SELECTORS = [
        '[data-copilot-toggle]',
        '#copilot-toggle',
        '#copilot-button',
        '#copilot-btn',
        '.copilot-toggle',
        '.copilot-button',
        '.copilot-btn'
    ];


    function getCopilotSidebar() {
        return qs(
            SIDEBAR_SELECTORS
        );
    }


    function getCopilotToggleButtons() {
        return qsa(
            TOGGLE_BUTTON_SELECTORS
        );
    }


    /*
     * 检查元素当前是否隐藏。
     */
    function elementHidden(element) {
        if (!element) {
            return true;
        }

        if (
            element.hidden === true
        ) {
            return true;
        }

        if (
            element.getAttribute(
                'aria-hidden'
            ) === 'true'
        ) {
            return true;
        }

        if (
            element.classList.contains(
                'hidden'
            ) ||
            element.classList.contains(
                'is-hidden'
            ) ||
            element.classList.contains(
                'closed'
            ) ||
            element.classList.contains(
                'collapsed'
            )
        ) {
            return true;
        }

        const style =
            window.getComputedStyle(
                element
            );

        return (
            style.display === 'none' ||
            style.visibility === 'hidden'
        );
    }


    /*
     * 设置侧边栏状态。
     *
     * 这里尽量不改你的原 CSS：
     *   1. 优先使用 hidden / aria-hidden
     *   2. 增加 is-open / open
     *   3. 增加 copilot-closed
     *
     * 如果你的 CSS 本来已经控制 open/closed，
     * 这些 class 可以直接接管。
     */
    function setCopilotOpen(
        open
    ) {
        const sidebar =
            getCopilotSidebar();

        if (!sidebar) {
            /*
             * 没找到侧边栏时仍然记录状态，
             * 等 DOM 出现后再同步。
             */
            copilotOpen =
                !!open;

            return false;
        }

        copilotOpen =
            !!open;


        /*
         * 通用 class
         */
        sidebar.classList.toggle(
            'open',
            copilotOpen
        );

        sidebar.classList.toggle(
            'is-open',
            copilotOpen
        );

        sidebar.classList.toggle(
            'closed',
            !copilotOpen
        );

        sidebar.classList.toggle(
            'copilot-closed',
            !copilotOpen
        );


        /*
         * aria
         */
        sidebar.setAttribute(
            'aria-hidden',
            copilotOpen
                ? 'false'
                : 'true'
        );


        /*
         * 不直接使用 display:none，
         * 除非它本来就使用 hidden。
         *
         * 这样可以最大程度避免破坏
         * 原有 CSS transition。
         */
        if (
            sidebar.hasAttribute(
                'data-copilot-use-hidden'
            )
        ) {
            sidebar.hidden =
                !copilotOpen;
        }


        /*
         * 同步按钮状态
         */
        getCopilotToggleButtons()
            .forEach(button => {
                button.classList.toggle(
                    'active',
                    copilotOpen
                );

                button.classList.toggle(
                    'is-open',
                    copilotOpen
                );

                button.setAttribute(
                    'aria-expanded',
                    copilotOpen
                        ? 'true'
                        : 'false'
                );
            });


        return true;
    }


    function isCopilotOpen() {
        const sidebar =
            getCopilotSidebar();

        if (!sidebar) {
            return copilotOpen === true;
        }

        if (
            copilotOpen !== null
        ) {
            return copilotOpen;
        }

        return !elementHidden(
            sidebar
        );
    }


    /*
     * 打开
     */
    function openCopilot() {
        return setCopilotOpen(true);
    }


    /*
     * 关闭
     */
    function closeCopilot() {
        return setCopilotOpen(false);
    }


    /*
     * 切换
     *
     * 这就是新增功能：
     *
     * 第一次点击：
     *     打开
     *
     * 再点击：
     *     关闭
     *
     * 再点击：
     *     打开
     */
    function toggleCopilot() {
        const sidebar =
            getCopilotSidebar();

        if (!sidebar) {
            /*
             * 如果原页面使用的是别的 selector，
             * 不强行创建 UI。
             */
            toast(
                '找不到 Copilot 侧边栏'
            );

            return false;
        }

        const next =
            !isCopilotOpen();

        setCopilotOpen(
            next
        );

        return next;
    }


    /*
     * 初始化 sidebar 状态。
     *
     * 如果页面本来就是打开状态，
     * 不强行关闭。
     */
    function initSidebarState() {
        const sidebar =
            getCopilotSidebar();

        if (!sidebar) {
            return;
        }

        if (
            copilotOpen === null
        ) {
            copilotOpen =
                !elementHidden(
                    sidebar
                );
        }

        /*
         * 只同步按钮，不重写 sidebar 状态，
         * 防止加载时破坏原有 CSS。
         */
        getCopilotToggleButtons()
            .forEach(button => {
                button.setAttribute(
                    'aria-expanded',
                    copilotOpen
                        ? 'true'
                        : 'false'
                );

                button.classList.toggle(
                    'active',
                    copilotOpen
                );

                button.classList.toggle(
                    'is-open',
                    copilotOpen
                );
            });
    }


    /* ============================================================
     * BIND SIDEBAR BUTTON
     * ============================================================ */

    function bindCopilotToggle() {
        const buttons =
            getCopilotToggleButtons();

        buttons.forEach(button => {

            /*
             * 防止重复绑定。
             */
            if (
                button.dataset
                    .iwpCopilotToggleBound ===
                '1'
            ) {
                return;
            }

            button.dataset
                .iwpCopilotToggleBound =
                '1';


            button.addEventListener(
                'click',
                function (event) {

                    /*
                     * 阻止原来可能存在的
                     * click handler 重复打开。
                     */
                    event.preventDefault();

                    event.stopPropagation();

                    toggleCopilot();
                },
                false
            );
        });

        initSidebarState();
    }


    /* ============================================================
     * MODE BUTTONS
     * ============================================================ */

    function bindModeButtons() {
        document
            .querySelectorAll(
                '[data-copilot-mode]'
            )
            .forEach(node => {

                if (
                    node.dataset
                        .iwpCopilotModeBound ===
                    '1'
                ) {
                    return;
                }

                node.dataset
                    .iwpCopilotModeBound =
                    '1';

                node.addEventListener(
                    'click',
                    () => {
                        setMode(
                            node.dataset
                                .copilotMode
                        );
                    }
                );
            });
    }


    /* ============================================================
     * MODEL BUTTONS
     * ============================================================ */

    function bindModelButtons() {
        document
            .querySelectorAll(
                '[data-copilot-model]'
            )
            .forEach(node => {

                if (
                    node.dataset
                        .iwpCopilotModelBound ===
                    '1'
                ) {
                    return;
                }

                node.dataset
                    .iwpCopilotModelBound =
                    '1';

                node.addEventListener(
                    'click',
                    () => {
                        setModel(
                            node.dataset
                                .copilotModel
                        );
                    }
                );
            });
    }


    /* ============================================================
     * IMAGE INPUT
     * ============================================================ */

    function bindImageInput() {

        /*
         * 兼容：
         *   #copilot-image
         *   #copilot-image-input
         *   input[type=file][data-copilot-image]
         */
        const input =
            qs([
                '#copilot-image',
                '#copilot-image-input',
                'input[data-copilot-image]',
                'input[type="file"].copilot-image'
            ]);

        if (!input) {
            return;
        }

        if (
            input.dataset
                .iwpCopilotImageBound ===
            '1'
        ) {
            return;
        }

        input.dataset
            .iwpCopilotImageBound =
            '1';

        input.addEventListener(
            'change',
            () => {

                const file =
                    input.files?.[0];

                if (!file) {
                    image = null;
                    return;
                }

                /*
                 * Data URL，
                 * Worker 会直接作为 image_url
                 * 发送给 NIM。
                 */
                const reader =
                    new FileReader();

                reader.onload = () => {
                    image =
                        String(
                            reader.result ||
                            ''
                        );
                };

                reader.onerror = () => {
                    image = null;

                    toast(
                        '图片读取失败'
                    );
                };

                reader.readAsDataURL(
                    file
                );
            }
        );
    }


    /* ============================================================
     * SEND BUTTON / INPUT
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
                '.copilot-input, textarea[name="copilot-input"]'
            );


        const sendButtons =
            qsa([
                '#copilot-send',
                '.copilot-send',
                '[data-copilot-send]'
            ]);


        sendButtons.forEach(
            sendBtn => {

                if (
                    sendBtn.dataset
                        .iwpCopilotSendBound ===
                    '1'
                ) {
                    return;
                }

                sendBtn.dataset
                    .iwpCopilotSendBound =
                    '1';

                sendBtn.addEventListener(
                    'click',
                    send
                );
            }
        );


        if (
            els.input &&
            els.input.dataset
                .iwpCopilotInputBound !==
            '1'
        ) {

            els.input.dataset
                .iwpCopilotInputBound =
                '1';

            els.input.addEventListener(
                'keydown',
                event => {

                    if (
                        event.key ===
                        'Enter' &&
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
     * HISTORY BUTTONS
     * ============================================================ */

    function bindHistoryButtons() {

        /*
         * New conversation
         */
        qsa([
            '#copilot-new-chat',
            '.copilot-new-chat',
            '[data-copilot-new-chat]'
        ]).forEach(button => {

            if (
                button.dataset
                    .iwpCopilotHistoryBound ===
                '1'
            ) {
                return;
            }

            button.dataset
                .iwpCopilotHistoryBound =
                '1';

            button.addEventListener(
                'click',
                () => {
                    newConversation();
                }
            );
        });


        /*
         * History item
         */
        document
            .querySelectorAll(
                '[data-copilot-history-id]'
            )
            .forEach(node => {

                if (
                    node.dataset
                        .iwpCopilotHistoryItemBound ===
                    '1'
                ) {
                    return;
                }

                node.dataset
                    .iwpCopilotHistoryItemBound =
                    '1';

                node.addEventListener(
                    'click',
                    async () => {

                        const id =
                            node.dataset
                                .copilotHistoryId;

                        if (!id) {
                            return;
                        }

                        try {
                            await loadHistory(
                                id
                            );

                            renderHistory();
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
     * RENDER HISTORY
     * ============================================================ */

    function renderHistory() {
        if (!els.messages) {
            return;
        }

        els.messages.innerHTML =
            '';

        for (
            const message of
            history
        ) {
            if (!message) {
                continue;
            }

            if (
                message.role !==
                    'user' &&
                message.role !==
                    'assistant'
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
    }


    /* ============================================================
     * PUBLIC INIT
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
                '.copilot-input, textarea[name="copilot-input"]'
            );

        bindCopilotToggle();
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
     * DOM READY
     * ============================================================ */

    function bind() {
        refresh();
    }


    /*
     * 某些页面的 Copilot DOM 是动态插入的。
     *
     * 因此使用 MutationObserver。
     *
     * 只负责寻找并绑定，不修改页面结构。
     */
    function watchDOM() {
        if (
            typeof MutationObserver ===
            'undefined'
        ) {
            return;
        }

        const observer =
            new MutationObserver(
                () => {
                    refresh();
                }
            );

        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* ============================================================
     * GLOBAL API
     * ============================================================ */

    window.IWPCopilot = {

        /*
         * HTTP API
         */
        api,

        /*
         * Chat
         */
        send,

        /*
         * Mode
         */
        setMode,

        /*
         * Model
         */
        setModel,

        /*
         * Whiteboard
         */
        setWhiteboard,

        /*
         * Image
         */
        setImage,

        clearImage,

        /*
         * History
         */
        loadHistoryList,

        loadHistory,

        saveHistory,

        deleteHistory,

        newConversation,

        /*
         * Sidebar
         */
        open: openCopilot,

        close: closeCopilot,

        toggle: toggleCopilot,

        isOpen: isCopilotOpen,

        /*
         * Refresh DOM bindings
         */
        refresh,

        /*
         * Useful state getters
         */
        getMode: () => mode,

        getModel: () => model,

        getModels: () =>
            ALL_MODELS.slice(),

        getHistory: () =>
            history.slice(),

        getSessionId: () =>
            sessionId,

        getToken,

        getUser
    };


    /* ============================================================
     * START
     * ============================================================ */

    if (
        document.readyState ===
        'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            () => {
                bind();
                watchDOM();
            },
            {
                once: true
            }
        );
    } else {
        bind();
        watchDOM();
    }

})();
