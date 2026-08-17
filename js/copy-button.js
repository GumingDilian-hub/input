// copy-button.js - 全自动代码复制按钮（独立模块，零侵入，增强版）
(function() {
    if (window.__copyButtonInitialized) return;
    window.__copyButtonInitialized = true;

    const style = document.createElement('style');
    style.textContent = `
        .iwp-code-wrapper {
            position: relative;
        }
        .iwp-code-wrapper pre {
            margin: 0;
        }
        .copy-btn-standalone {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(40, 40, 40, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.25s ease, background 0.2s ease;
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e0e0e0;
            line-height: 1;
            z-index: 10;
            font-size: 12px;
            gap: 4px;
            white-space: nowrap;
        }
        .iwp-code-wrapper:hover .copy-btn-standalone {
            opacity: 0.7;
        }
        .copy-btn-standalone:hover {
            opacity: 1 !important;
            background: rgba(70, 70, 70, 0.9);
        }
        .copy-btn-standalone svg {
            display: block;
            width: 16px;
            height: 16px;
            fill: currentColor;
        }
        .copy-btn-standalone .check-svg {
            fill: #6fcf97;
        }
        .copy-btn-standalone .status-text {
            margin-left: 2px;
        }
    `;
    document.head.appendChild(style);

    const COPY_SVG = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
    const CHECK_SVG = `<svg class="check-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;

    function processCodeBlock(pre) {
        if (pre.dataset.copyInited === 'true') return;
        if (!pre.querySelector('code')) return;

        if (window.getComputedStyle(pre).position === 'static') {
            pre.style.position = 'relative';
        }

        const btn = document.createElement('button');
        btn.className = 'copy-btn-standalone';
        btn.setAttribute('aria-label', '复制代码');
        btn.innerHTML = COPY_SVG; // 初始只显示图标

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const codeEl = pre.querySelector('code');
            if (!codeEl) return;
            const text = codeEl.textContent;

            const setCopied = () => {
                // 显示对勾 + “已复制”
                btn.innerHTML = CHECK_SVG + `<span class="status-text">已复制</span>`;
                // 调整内边距让文字不挤
                btn.style.padding = '4px 10px';
                // 2秒后恢复
                clearTimeout(btn._timeout);
                btn._timeout = setTimeout(() => {
                    btn.innerHTML = COPY_SVG;
                    btn.style.padding = '4px 8px';
                }, 2000);
            };

            try {
                await navigator.clipboard.writeText(text);
                setCopied();
            } catch {
                // 降级
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    setCopied();
                } catch (e2) {
                    alert('复制失败，请手动复制');
                }
                document.body.removeChild(ta);
            }
        });

        pre.appendChild(btn);
        pre.dataset.copyInited = 'true';
    }

    // ---------- 扫描与监听（与之前相同，略作简化） ----------
    function scanAndAdd(container) {
        if (!container) container = document.getElementById('article-body');
        if (!container) return;
        const pres = container.querySelectorAll('pre:not([data-copy-inited])');
        pres.forEach(pre => {
            if (pre.querySelector('code')) processCodeBlock(pre);
        });
    }

    function resetCopyInited(container) {
        if (!container) container = document.getElementById('article-body');
        if (!container) return;
        const pres = container.querySelectorAll('pre[data-copy-inited]');
        pres.forEach(pre => delete pre.dataset.copyInited);
    }

    function setupObserver() {
        const container = document.getElementById('article-body');
        if (!container) {
            const waitForBody = new MutationObserver(() => {
                const body = document.getElementById('article-body');
                if (body) {
                    waitForBody.disconnect();
                    scanAndAdd(body);
                    observeContainer(body);
                }
            });
            waitForBody.observe(document.body, { childList: true, subtree: false });
            return;
        }
        observeContainer(container);
        scanAndAdd(container);
    }

    function observeContainer(container) {
        if (container.__copyObserver) return;
        const observer = new MutationObserver((mutations) => {
            let needScan = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    resetCopyInited(container);
                    needScan = true;
                }
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('pre')) {
                            processCodeBlock(node);
                        } else {
                            const pres = node.querySelectorAll ? node.querySelectorAll('pre:not([data-copy-inited])') : [];
                            pres.forEach(pre => {
                                if (pre.querySelector('code')) processCodeBlock(pre);
                            });
                        }
                        needScan = true;
                    }
                }
            }
            if (needScan) scanAndAdd(container);
        });
        observer.observe(container, { childList: true, subtree: true });
        container.__copyObserver = observer;
    }

    // 兜底
    function fallbackOnComplete() {
        const checkComplete = setInterval(() => {
            if (window.contentRenderComplete) {
                clearInterval(checkComplete);
                const container = document.getElementById('article-body');
                if (container) scanAndAdd(container);
            }
        }, 500);
        setTimeout(() => clearInterval(checkComplete), 10000);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupObserver();
            fallbackOnComplete();
        });
    } else {
        setupObserver();
        fallbackOnComplete();
    }
})();// copy-button.js - 全自动代码复制按钮（独立模块，零侵入，增强版）
(function() {
    if (window.__copyButtonInitialized) return;
    window.__copyButtonInitialized = true;

    const style = document.createElement('style');
    style.textContent = `
        .iwp-code-wrapper {
            position: relative;
        }
        .iwp-code-wrapper pre {
            margin: 0;
        }
        .copy-btn-standalone {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(40, 40, 40, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.25s ease, background 0.2s ease;
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e0e0e0;
            line-height: 1;
            z-index: 10;
            font-size: 12px;
            gap: 4px;
            white-space: nowrap;
        }
        .iwp-code-wrapper:hover .copy-btn-standalone {
            opacity: 0.7;
        }
        .copy-btn-standalone:hover {
            opacity: 1 !important;
            background: rgba(70, 70, 70, 0.9);
        }
        .copy-btn-standalone svg {
            display: block;
            width: 16px;
            height: 16px;
            fill: currentColor;
        }
        .copy-btn-standalone .check-svg {
            fill: #6fcf97;
        }
        .copy-btn-standalone .status-text {
            margin-left: 2px;
        }
    `;
    document.head.appendChild(style);

    const COPY_SVG = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
    const CHECK_SVG = `<svg class="check-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;

    function processCodeBlock(pre) {
        if (pre.dataset.copyInited === 'true') return;
        if (!pre.querySelector('code')) return;

        if (window.getComputedStyle(pre).position === 'static') {
            pre.style.position = 'relative';
        }

        const btn = document.createElement('button');
        btn.className = 'copy-btn-standalone';
        btn.setAttribute('aria-label', '复制代码');
        btn.innerHTML = COPY_SVG; // 初始只显示图标

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const codeEl = pre.querySelector('code');
            if (!codeEl) return;
            const text = codeEl.textContent;

            const setCopied = () => {
                // 显示对勾 + “已复制”
                btn.innerHTML = CHECK_SVG + `<span class="status-text">已复制</span>`;
                // 调整内边距让文字不挤
                btn.style.padding = '4px 10px';
                // 2秒后恢复
                clearTimeout(btn._timeout);
                btn._timeout = setTimeout(() => {
                    btn.innerHTML = COPY_SVG;
                    btn.style.padding = '4px 8px';
                }, 2000);
            };

            try {
                await navigator.clipboard.writeText(text);
                setCopied();
            } catch {
                // 降级
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    setCopied();
                } catch (e2) {
                    alert('复制失败，请手动复制');
                }
                document.body.removeChild(ta);
            }
        });

        pre.appendChild(btn);
        pre.dataset.copyInited = 'true';
    }

    // ---------- 扫描与监听（与之前相同，略作简化） ----------
    function scanAndAdd(container) {
        if (!container) container = document.getElementById('article-body');
        if (!container) return;
        const pres = container.querySelectorAll('pre:not([data-copy-inited])');
        pres.forEach(pre => {
            if (pre.querySelector('code')) processCodeBlock(pre);
        });
    }

    function resetCopyInited(container) {
        if (!container) container = document.getElementById('article-body');
        if (!container) return;
        const pres = container.querySelectorAll('pre[data-copy-inited]');
        pres.forEach(pre => delete pre.dataset.copyInited);
    }

    function setupObserver() {
        const container = document.getElementById('article-body');
        if (!container) {
            const waitForBody = new MutationObserver(() => {
                const body = document.getElementById('article-body');
                if (body) {
                    waitForBody.disconnect();
                    scanAndAdd(body);
                    observeContainer(body);
                }
            });
            waitForBody.observe(document.body, { childList: true, subtree: false });
            return;
        }
        observeContainer(container);
        scanAndAdd(container);
    }

    function observeContainer(container) {
        if (container.__copyObserver) return;
        const observer = new MutationObserver((mutations) => {
            let needScan = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    resetCopyInited(container);
                    needScan = true;
                }
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches('pre')) {
                            processCodeBlock(node);
                        } else {
                            const pres = node.querySelectorAll ? node.querySelectorAll('pre:not([data-copy-inited])') : [];
                            pres.forEach(pre => {
                                if (pre.querySelector('code')) processCodeBlock(pre);
                            });
                        }
                        needScan = true;
                    }
                }
            }
            if (needScan) scanAndAdd(container);
        });
        observer.observe(container, { childList: true, subtree: true });
        container.__copyObserver = observer;
    }

    // 兜底
    function fallbackOnComplete() {
        const checkComplete = setInterval(() => {
            if (window.contentRenderComplete) {
                clearInterval(checkComplete);
                const container = document.getElementById('article-body');
                if (container) scanAndAdd(container);
            }
        }, 500);
        setTimeout(() => clearInterval(checkComplete), 10000);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupObserver();
            fallbackOnComplete();
        });
    } else {
        setupObserver();
        fallbackOnComplete();
    }
})();
