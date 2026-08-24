/* ============================================================
 * IWP Copilot
 * Complete rollback-compatible client
 *
 * Based on the existing IWP reader DOM contract.
 *
 * Important:
 *   #sidebar
 *   #sidebar-toc-view
 *   #sidebar-copilot-view
 *   #btn-copilot
 *
 * are intentionally preserved.
 * ============================================================ */

(function () {
    'use strict';

    const API = 'https://copilot.2167964516.workers.dev';
    const LOGO = 'images/copilot/';
    const ADMIN = 'loading';

    const TEXT_MODELS = [
        ['nvidia/nemotron-3-super-120b-a12b', 'NVIDIA 3 super 120', '1.png'],
        ['nvidia/nemotron-3-ultra-550b-a55b', 'NVIDIA 3 Ultra 550', '1.png'],
        ['meta/llama-3.3-70b-instruct', 'Meta 3.3', '2.png'],
        ['openai/gpt-oss-120b', 'ChatGPT 120', '3.png'],
        ['openai/gpt-oss-20b', 'CatGPT 20', '3.png'],
        ['minimaxai/minimax-m3', 'MiniMax', '5.png'],
        ['deepseek-ai/deepseek-v4-flash', 'DeepSeek V4（已失效）', '6.png'],
        ['z-ai/glm4.7', 'GLM 4.7（已失效）', '7.png'],
        ['google/gemma-4-31b-it', 'Google Gemma 4', '4.png']
    ];

    const VISION_MODELS = [
        ['meta/llama-3.2-90b-vision-instruct', 'Meta 3.2 视觉', '2.png']
    ];

    const ALL_MODELS = TEXT_MODELS.concat(VISION_MODELS);

    const MODE_NAMES = {
        note: '本站笔记',
        textbook: '竞赛教材',
        whiteboard: '无参考'
    };

    let mode = 'note';
    let model = TEXT_MODELS[0][0];
    let image = null;
    let history = [];
    let sessionId = null;
    let busy = false;
    let whiteboard = '';
    let copilotOpen = false;
    let els = {};
    let modelMenuBound = false;
    let globalDropdownBound = false;

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
                { status: response.status, data }
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
            'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);' +
            'background:rgba(0,0,0,.9);color:#eee;padding:8px 20px;' +
            'border-radius:8px;font-size:.85rem;z-index:99999;' +
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

    function renderModelOptions() {
        const container = $('copilot-model-options');
        if (!container) return;

        container.innerHTML = '';

        ALL_MODELS.forEach(([id, name, logo]) => {
            const option = document.createElement('div');

            option.className = 'copilot-model-option';
            option.dataset.copilotModel = id;
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', id === model ? 'true' : 'false');

            option.style.cssText =
                'display:flex;align-items:center;gap:7px;' +
                'padding:6px 9px;cursor:pointer;color:#ddd;' +
                'font-size:.75rem;white-space:nowrap;';

            const icon = document.createElement('img');
            icon.src = LOGO + logo;
            icon.alt = '';
            icon.style.cssText =
                'width:18px;height:18px;object-fit:contain;flex-shrink:0;';

            const text = document.createElement('span');
            text.textContent = name;

            option.append(icon, text);

            option.addEventListener('mouseenter', () => {
                option.style.background = '#444';
            });

            option.addEventListener('mouseleave', () => {
                option.style.background = id === model ? '#444' : 'transparent';
            });

            option.addEventListener('pointerdown', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }, true);

            option.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();

                setModel(id);

                const menu = $('copilot-model-options');
                if (menu) menu.style.display = 'none';
            });

            container.appendChild(option);
        });

        updateModelOptionsState();
    }

    function updateModelOptionsState() {
        document.querySelectorAll('.copilot-model-option').forEach(option => {
            const active = option.dataset.copilotModel === model;

            option.classList.toggle('active', active);
            option.classList.toggle('selected', active);
            option.setAttribute('aria-selected', active ? 'true' : 'false');
            option.style.background = active ? '#444' : 'transparent';
        });
    }

    function updateModelDisplay() {
        const current = findModel(model);
        if (!current) return;

        const text = $('copilot-model-text');
        const icon = $('copilot-model-icon');

        if (text) text.textContent = current[1];
        if (icon) icon.src = LOGO + current[2];

        updateModelOptionsState();
        updateImageUI();
    }

    function setModel(modelId) {
        if (!findModel(modelId)) return false;

        model = modelId;
        updateModelDisplay();
        return true;
    }

    /* ============================================================
     * IMAGE
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
            hideImagePreview();
        }
    }

    function setImage(value) {
        image = typeof value === 'string' ? value.trim() || null : null;
        if (image) showImagePreview(image);
        else hideImagePreview();
    }

    function clearImage() {
        image = null;
        const input = $('copilot-image-input');
        if (input) input.value = '';
        hideImagePreview();
        toast('已清除图片');
    }

    /* ---------- 缩略图预览 ---------- */
    function showImagePreview(dataUrl) {
        let container = document.getElementById('copilot-image-preview');
        if (!container) {
            container = document.createElement('div');
            container.id = 'copilot-image-preview';
            container.style.cssText =
                'margin:4px 0; display:flex; align-items:center; gap:8px; flex-shrink:0; padding:2px 4px;';
            // 插入到输入框上方
            const inputWrap = document.querySelector('.copilot-input-wrap');
            if (inputWrap) {
                inputWrap.parentNode.insertBefore(container, inputWrap);
            } else {
                // fallback
                const wrapper = document.getElementById('copilot-messages-wrapper');
                if (wrapper) wrapper.parentNode.insertBefore(container, wrapper);
            }
        }
        container.innerHTML = `
            <img src="${dataUrl}" style="max-height:60px; max-width:120px; border-radius:4px; border:1px solid #555; object-fit:contain;">
            <button id="copilot-clear-image" style="background:transparent; border:none; color:#ccc; cursor:pointer; font-size:0.8rem; padding:0 4px;">✕</button>
        `;
        container.style.display = 'flex';
        const clearBtn = document.getElementById('copilot-clear-image');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearImage();
            });
        }
    }

    function hideImagePreview() {
        const container = document.getElementById('copilot-image-preview');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    function bindImageInput() {
        const input = $('copilot-image-input');
        if (!input) return;

        if (input.dataset.iwpCopilotImageBound === '1') {
            updateImageUI();
            return;
        }

        input.dataset.iwpCopilotImageBound = '1';

        input.addEventListener('change', () => {
            const file = input.files?.[0];

            if (!file) {
                image = null;
                hideImagePreview();
                toast('未选择文件');
                return;
            }

            if (!isVisionModel(model)) {
                input.value = '';
                image = null;
                hideImagePreview();
                toast('当前模型不支持图片');
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                image = String(reader.result || '');
                showImagePreview(image);
                toast('我看见了！');
            };

            reader.onerror = () => {
                image = null;
                hideImagePreview();
                toast('图片读取失败，请重试');
            };

            reader.readAsDataURL(file);
        });

        updateImageUI();
    }

    /* ============================================================
     * MARKDOWN / LATEX / TABLE RENDERER
     * ============================================================ */

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderMarkdown(text) {
        const source = String(text || '');

        if (typeof marked === 'undefined') {
            return escapeHtml(source).replace(/\n/g, '<br>');
        }

        try {
            marked.setOptions({
                gfm: true,
                breaks: true
            });

            /*
             * 先保护 LaTeX，避免 marked 把某些数学符号
             * 当作 Markdown 特殊结构。
             */
            const mathBlocks = [];

            const protectedText = source.replace(
                /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|(?<!\$)\$(?!\$)[^\n$]+?\$(?!\$))/g,
                match => {
                    const index = mathBlocks.length;
                    mathBlocks.push(match);
                    return `@@IWP_MATH_${index}@@`;
                }
            );

            let html = marked.parse(protectedText);

            html = html.replace(
                /@@IWP_MATH_(\d+)@@/g,
                (_, index) => mathBlocks[Number(index)] || ''
            );

            return html;
        } catch (error) {
            console.warn('[IWP Copilot] markdown render failed:', error);
            return escapeHtml(source).replace(/\n/g, '<br>');
        }
    }

    function renderAssistantContent(element, text) {
        if (!element) return;

        /*
         * 流式阶段直接使用 textContent，
         * 避免每个 token 都重新建立复杂 DOM。
         */
        const html = renderMarkdown(text);

        element.innerHTML = html;

        /*
         * KaTeX auto-render 已由 reader.html 加载。
         */
        if (
            typeof renderMathInElement === 'function'
        ) {
            try {
                renderMathInElement(element, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '\\[', right: '\\]', display: true },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '$', right: '$', display: false }
                    ],
                    throwOnError: false,
                    strict: false
                });
            } catch (error) {
                console.warn(
                    '[IWP Copilot] KaTeX render failed:',
                    error
                );
            }
        }

        /*
         * Highlight.js
         */
        if (typeof hljs !== 'undefined') {
            element.querySelectorAll('pre code').forEach(block => {
                try {
                    hljs.highlightElement(block);
                } catch (_) {}
            });
        }

        /*
         * 表格样式。
         * 不依赖额外 CSS。
         */
        element.querySelectorAll('table').forEach(table => {
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.margin = '8px 0';
            table.style.fontSize = '.88rem';

            table.querySelectorAll('th,td').forEach(cell => {
                cell.style.border = '1px solid #555';
                cell.style.padding = '5px 7px';
                cell.style.verticalAlign = 'top';
            });

            table.querySelectorAll('th').forEach(th => {
                th.style.background = '#333';
                th.style.fontWeight = '600';
            });
        });

        /*
         * Markdown heading。
         */
        element.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(heading => {
            heading.style.margin = '10px 0 6px';
            heading.style.lineHeight = '1.35';
        });

        /*
         * 列表。
         */
        element.querySelectorAll('ul,ol').forEach(list => {
            list.style.paddingLeft = '1.5em';
            list.style.margin = '6px 0';
        });

        /*
         * 段落。
         */
        element.querySelectorAll('p').forEach(p => {
            p.style.margin = '5px 0';
        });

        /*
         * 引用。
         */
        element.querySelectorAll('blockquote').forEach(blockquote => {
            blockquote.style.margin = '8px 0';
            blockquote.style.padding = '5px 10px';
            blockquote.style.borderLeft = '3px solid #666';
            blockquote.style.color = '#aaa';
        });

        /*
         * 行内代码。
         */
        element.querySelectorAll('code:not(pre code)').forEach(code => {
            code.style.background = '#333';
            code.style.padding = '1px 4px';
            code.style.borderRadius = '3px';
        });
    }

    /* ============================================================
     * MODE
     * ============================================================ */

    function updateModeDisplay() {
        const text = $('copilot-mode-text');

        if (text) {
            text.textContent = MODE_NAMES[mode] || MODE_NAMES.note;
        }

        document.querySelectorAll('.copilot-mode-option').forEach(node => {
            const active = node.dataset.mode === mode;

            node.classList.toggle('active', active);
            node.classList.toggle('selected', active);
            node.setAttribute('aria-selected', active ? 'true' : 'false');
            node.style.background = active ? '#444' : 'transparent';
        });
    }

    function setMode(nextMode) {
        if (!MODE_NAMES[nextMode]) return false;

        mode = nextMode;
        updateModeDisplay();

        const options = $('copilot-mode-options');
        if (options) options.style.display = 'none';

        return true;
    }

    function toggleModeMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }

        const options = $('copilot-mode-options');
        if (!options) return;

        const visible = options.style.display === 'block';

        options.style.display = visible ? 'none' : 'block';

        if (!visible) {
            options.style.zIndex = '9999';
        }
    }

    function bindModeButtons() {
        const display = $('copilot-mode-display');
        const options = $('copilot-mode-options');
        const dropdown = $('copilot-mode-dropdown');

        if (!display || !options) return;

        /*
         * 关键修复：
         *
         * 不只监听 click。
         * pointerdown 阶段就阻止事件向外传播，
         * 避免 reader / sidebar 的 document click
         * 在 click 到达之前把菜单收掉。
         */
        if (display.dataset.iwpCopilotModeDisplayBound !== '1') {
            display.dataset.iwpCopilotModeDisplayBound = '1';

            display.addEventListener('pointerdown', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                toggleModeMenu(event);
            }, true);

            display.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }, true);
        }

        document.querySelectorAll('.copilot-mode-option[data-mode]').forEach(node => {
            if (node.dataset.iwpCopilotModeBound === '1') return;

            node.dataset.iwpCopilotModeBound = '1';

            node.addEventListener('pointerdown', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }, true);

            node.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                setMode(node.dataset.mode);
            }, true);

            node.addEventListener('mouseenter', () => {
                node.style.background = '#444';
            });

            node.addEventListener('mouseleave', () => {
                node.style.background =
                    node.dataset.mode === mode ? '#444' : 'transparent';
            });
        });

        /*
         * 自己处理菜单外点击。
         * 使用 composedPath()，比 contains() 对复杂 DOM 更稳。
         */
        if (!globalDropdownBound) {
            globalDropdownBound = true;

            document.addEventListener('click', event => {
                const modeDrop = $('copilot-mode-dropdown');
                const modelDrop = $('copilot-model-dropdown');

                const path = typeof event.composedPath === 'function'
                    ? event.composedPath()
                    : [];

                const insideMode =
                    modeDrop &&
                    (modeDrop.contains(event.target) || path.includes(modeDrop));

                const insideModel =
                    modelDrop &&
                    (modelDrop.contains(event.target) || path.includes(modelDrop));

                if (!insideMode) {
                    const modeOptions = $('copilot-mode-options');
                    if (modeOptions) modeOptions.style.display = 'none';
                }

                if (!insideModel) {
                    const modelOptions = $('copilot-model-options');
                    if (modelOptions) modelOptions.style.display = 'none';
                }
            });
        }

        updateModeDisplay();
    }

    /* ============================================================
     * MODEL DROPDOWN
     * ============================================================ */

    function bindModelButtons() {
        const display = $('copilot-model-display');
        const options = $('copilot-model-options');

        if (!display || !options) return;

        if (display.dataset.iwpCopilotModelDisplayBound !== '1') {
            display.dataset.iwpCopilotModelDisplayBound = '1';

            display.addEventListener('pointerdown', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                options.style.display =
                    options.style.display === 'block'
                        ? 'none'
                        : 'block';
            }, true);

            display.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }, true);
        }

        if (!modelMenuBound) {
            modelMenuBound = true;
            renderModelOptions();
        }

        updateModelDisplay();
    }

    /* ============================================================
     * SIDEBAR / COPILOT VIEW
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
            console.warn('[IWP Copilot] Copilot DOM not found');
            return false;
        }

        /*
         * 原 reader 结构：
         *
         * #sidebar
         *   ├── #sidebar-toc-view
         *   └── #sidebar-copilot-view
         *
         * 这里只切换 view，不创建新的 sidebar。
         */
        toc.style.display = 'none';

        copilot.style.display = 'flex';

        copilotOpen = true;

        sidebar.style.overflow = 'hidden';

        if (isMobile()) {
            sidebar.classList.add('sidebar-open');

            const app = $('app');
            if (app) app.classList.add('copilot-active');
        }

        const button = getCopilotButton();

        if (button) {
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }

        /*
         * DOM 已经存在后再绑定一次。
         */
        refreshCopilotUI();

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

        sidebar.style.overflow = '';

        if (isMobile()) {
            sidebar.classList.remove('sidebar-open');

            const app = $('app');
            if (app) app.classList.remove('copilot-active');
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
            console.warn('[IWP Copilot] #btn-copilot not found');
            return;
        }

        if (button.dataset.iwpCopilotBound === '1') {
            return;
        }

        button.dataset.iwpCopilotBound = '1';

        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            toggleCopilot();
        });

        /*
         * 页面初始状态同步。
         */
        const copilot = getCopilotView();

        if (copilot) {
            copilotOpen = copilot.style.display !== 'none';
        }

        button.classList.toggle('active', copilotOpen);
        button.setAttribute(
            'aria-expanded',
            copilotOpen ? 'true' : 'false'
        );
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
                node.style.cssText =
                    'display:flex;align-items:center;gap:8px;' +
                    'padding:7px 10px;color:#aaa;font-size:.82rem;';

                node.innerHTML =
                    '<span style="' +
                    'display:inline-block;width:13px;height:13px;' +
                    'border:2px solid #555;border-top-color:#ddd;' +
                    'border-radius:50%;animation:copilot-spin .8s linear infinite;' +
                    '"></span><span>少女祈祷中...</span>';

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

        els.messages.scrollTop = els.messages.scrollHeight;
    }

    /* ============================================================
     * MESSAGE
     * ============================================================ */

    function appendMessage(role, text, reasoning) {
        if (!els.messages) return null;

        const box = document.createElement('div');
        box.className = 'copilot-message ' + role;

        box.style.cssText =
            'white-space:normal;word-break:break-word;margin:8px 0;' +
            'line-height:1.55;';

        if (reasoning) {
            const think = document.createElement('details');
            think.className = 'copilot-reasoning';

            const summary = document.createElement('summary');
            summary.textContent = '思考过程';

            const body = document.createElement('div');
            body.style.cssText =
                'white-space:pre-wrap;color:#999;font-size:.85rem;padding:6px 0;';
            body.textContent = reasoning;

            think.append(summary, body);
            box.appendChild(think);
        }

        const content = document.createElement('div');
        content.className = 'copilot-content';

        if (role === 'assistant') {
            renderAssistantContent(content, text || '');
        } else {
            content.textContent = text || '';
            content.style.whiteSpace = 'pre-wrap';
        }

        box.appendChild(content);
        els.messages.appendChild(box);

        els.messages.scrollTop = els.messages.scrollHeight;

        return {
            box,
            content,
            reasoning: reasoning || ''
        };
    }

    /* ============================================================
     * SSE
     * ============================================================ */

    function readSSE(response, onEvent) {
        if (!response.body) {
            throw new Error('服务器没有返回流');
        }

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

                for (let line of lines) {
                    line = line.trim();

                    if (!line.startsWith('data:')) continue;

                    const raw = line.slice(5).trim();

                    if (!raw || raw === '[DONE]') continue;

                    try {
                        await onEvent(JSON.parse(raw));
                    } catch (error) {
                        console.warn(
                            '[IWP Copilot] SSE event parse failed:',
                            error
                        );
                    }
                }
            }

            const last = buffer.trim();

            if (last.startsWith('data:')) {
                const raw = last.slice(5).trim();

                if (raw && raw !== '[DONE]') {
                    try {
                        await onEvent(JSON.parse(raw));
                    } catch (_) {}
                }
            }
        })();
    }

    /* ============================================================
     * SEND
     * ============================================================ */

    async function send() {
        if (busy) return;

        const input = els.input;
        const question = String(input?.value || '').trim();

        if (!question) return;

        if (!getToken()) {
            toast('请先去个人中心登录');
            return;
        }

        busy = true;

        if (input) input.value = '';

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
            const response = await fetch(API + '/api/chat', {
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
            });

            if (!response.ok) {
                const text = await response.text();

                let err = {};

                try {
                    err = JSON.parse(text);
                } catch (_) {}

                throw new Error(
                    err.error || `HTTP ${response.status}`
                );
            }

            setLoading(false);

            await readSSE(response, async event => {
                if (event.type === 'reasoning') {
                    reasoning += event.text || '';

                    if (!assistant) {
                        assistant = appendMessage(
                            'assistant',
                            '',
                            reasoning
                        );
                    }

                    const body =
                        assistant.box.querySelector(
                            '.copilot-reasoning > div'
                        );

                    if (body) {
                        body.textContent = reasoning;
                    }
                }

                else if (event.type === 'content') {
                    answer += event.text || '';

                    if (!assistant) {
                        assistant = appendMessage(
                            'assistant',
                            '',
                            reasoning
                        );
                    }

                    /*
                     * Markdown / LaTeX / table 实时渲染。
                     */
                    renderAssistantContent(
                        assistant.content,
                        answer
                    );

                    if (els.messages) {
                        els.messages.scrollTop =
                            els.messages.scrollHeight;
                    }
                }

                else if (event.type === 'error') {
                    throw new Error(
                        event.error || 'stream error'
                    );
                }
            });

            history.push({
                role: 'assistant',
                content: answer
            });

            if (sessionId) {
                await api('/api/history', {
                    method: 'POST',
                    body: {
                        messages: history,
                        title:
                            history.find(
                                x => x.role === 'user'
                            )?.content?.slice(0, 40) ||
                            '新对话'
                    }
                });
            }

        } catch (error) {
            setLoading(false);

            toast(
                error?.message ||
                '请求失败'
            );

            if (
                history.length &&
                history[history.length - 1]?.role === 'user'
            ) {
                history.pop();
            }
        } finally {
            busy = false;
            image = null;
            hideImagePreview();   // 清除缩略图
        }
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
        if (!id) return null;

        const data = await api(
            '/api/history/' +
            encodeURIComponent(id)
        );

        sessionId = id;

        history = Array.isArray(data?.messages)
            ? data.messages
            : [];

        renderHistory();

        return data;
    }

    async function saveHistory(title) {
        if (!getToken()) return null;

        const data = await api('/api/history', {
            method: 'POST',
            body: {
                messages: history,
                title: String(
                    title ||
                    history.find(
                        x => x.role === 'user'
                    )?.content ||
                    '新对话'
                ).slice(0, 100)
            }
        });

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
            { method: 'DELETE' }
        );

        if (sessionId === id) {
            sessionId = null;
            history = [];
        }

        return true;
    }

    function newConversation() {
        history = [];
        sessionId = null;
        image = null;
        hideImagePreview();

        if (els.messages) {
            els.messages.innerHTML = '';
        }

        setLoading(false);
    }

    function renderHistory() {
        if (!els.messages) return;

        els.messages.innerHTML = '';

        for (const message of history) {
            if (!message) continue;

            if (
                message.role !== 'user' &&
                message.role !== 'assistant'
            ) {
                continue;
            }

            if (typeof message.content !== 'string') {
                continue;
            }

            appendMessage(
                message.role,
                message.content
            );
        }
    }

    /* ============================================================
     * HISTORY BUTTON
     * ============================================================ */

    function bindHistoryToggle() {
        const button = qs([
            '#copilot-history-toggle',
            '.copilot-history-toggle',
            '[data-copilot-history-toggle]'
        ]);

        const panel = qs([
            '#copilot-history-panel',
            '.copilot-history-panel',
            '[data-copilot-history-panel]'
        ]);

        if (!button || !panel) return;

        if (button.dataset.iwpCopilotHistoryToggleBound === '1') {
            return;
        }

        button.dataset.iwpCopilotHistoryToggleBound = '1';

        button.addEventListener('pointerdown', event => {
            event.preventDefault();
            event.stopPropagation();
        }, true);

        button.addEventListener('click', async event => {
            event.preventDefault();
            event.stopPropagation();

            const visible =
                panel.style.display === 'block' ||
                panel.style.display === 'flex';

            panel.style.display = visible ? 'none' : 'block';

            if (!visible) {
                await renderHistoryList(panel);
            }
        });
    }

    async function renderHistoryList(panel) {
        try {
            const data = await loadHistoryList();

            const list =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.history)
                        ? data.history
                        : Array.isArray(data?.items)
                            ? data.items
                            : [];

            panel.innerHTML = '';

            if (!list.length) {
                const empty = document.createElement('div');
                empty.textContent = '暂无历史记录';
                empty.style.cssText =
                    'padding:10px;color:#888;font-size:.8rem;';
                panel.appendChild(empty);
                return;
            }

            list.forEach(item => {
                const row = document.createElement('div');

                row.style.cssText =
                    'padding:7px 9px;border-bottom:1px solid #444;' +
                    'cursor:pointer;color:#ddd;font-size:.8rem;';

                row.textContent =
                    item.title ||
                    item.name ||
                    '未命名对话';

                row.addEventListener('click', async event => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!item.id) return;

                    try {
                        await loadHistory(item.id);
                        panel.style.display = 'none';
                    } catch (error) {
                        toast(
                            error?.message ||
                            '历史记录加载失败'
                        );
                    }
                });

                row.addEventListener('mouseenter', () => {
                    row.style.background = '#333';
                });

                row.addEventListener('mouseleave', () => {
                    row.style.background = 'transparent';
                });

                panel.appendChild(row);
            });
        } catch (error) {
            panel.innerHTML = '';

            const failed = document.createElement('div');
            failed.textContent = '历史记录加载失败';
            failed.style.cssText =
                'padding:10px;color:#888;font-size:.8rem;';

            panel.appendChild(failed);
        }
    }

    function bindHistoryButtons() {
        document.querySelectorAll(
            '[data-copilot-history-id]'
        ).forEach(node => {
            if (node.dataset.iwpCopilotHistoryItemBound === '1') {
                return;
            }

            node.dataset.iwpCopilotHistoryItemBound = '1';

            node.addEventListener('click', async event => {
                event.preventDefault();
                event.stopPropagation();

                const id =
                    node.dataset.copilotHistoryId;

                if (!id) return;

                try {
                    await loadHistory(id);
                } catch (error) {
                    toast(
                        error?.message ||
                        '历史记录加载失败'
                    );
                }
            });
        });

        qsa([
            '#copilot-new-chat',
            '.copilot-new-chat',
            '[data-copilot-new-chat]'
        ]).forEach(button => {
            if (button.dataset.iwpCopilotHistoryBound === '1') {
                return;
            }

            button.dataset.iwpCopilotHistoryBound = '1';

            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                newConversation();
            });
        });

        bindHistoryToggle();
    }

    /* ============================================================
     * SEND / INPUT
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
            if (button.dataset.iwpCopilotSendBound === '1') {
                return;
            }

            button.dataset.iwpCopilotSendBound = '1';

            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                send();
            });
        });

        if (
            els.input &&
            els.input.dataset.iwpCopilotInputBound !== '1'
        ) {
            els.input.dataset.iwpCopilotInputBound = '1';

            els.input.addEventListener('keydown', event => {
                if (
                    event.key === 'Enter' &&
                    !event.shiftKey
                ) {
                    event.preventDefault();
                    send();
                }
            });
        }
    }

    /* ============================================================
     * REFRESH
     * ============================================================ */

    function refreshCopilotUI() {
        els.messages =
            $('copilot-messages') ||
            document.querySelector('.copilot-messages');

        els.input =
            $('copilot-input') ||
            document.querySelector(
                '.copilot-input,' +
                'textarea[name="copilot-input"]'
            );

        bindModeButtons();
        bindModelButtons();
        bindImageInput();
        bindSend();
        bindHistoryButtons();

        updateModeDisplay();
        updateModelDisplay();

        return true;
    }

    function refresh() {
        bindCopilotButton();
        refreshCopilotUI();
        return true;
    }

    /* ============================================================
     * DYNAMIC DOM
     * ============================================================ */

    function watchDOM() {
        if (typeof MutationObserver === 'undefined') {
            return;
        }

        let timer = null;

        const observer = new MutationObserver(() => {
            clearTimeout(timer);

            timer = setTimeout(() => {
                refresh();
            }, 50);
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
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

    function start() {
        refresh();
        watchDOM();
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            start,
            { once: true }
        );
    } else {
        start();
    }

})();
