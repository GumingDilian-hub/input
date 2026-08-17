// pdf-export.js - 独立 PDF 导出模块（带封面图片 + 所选章节列表）
(function() {
    if (window.__pdfExportInitialized) return;
    window.__pdfExportInitialized = true;

    // ---------- 注入样式 ----------
    const style = document.createElement('style');
    style.textContent = `
        /* 按钮样式 */
        #pdf-export-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            color: #e0e0e0;
            padding: 4px 12px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        #pdf-export-btn:hover {
            background: rgba(255, 255, 255, 0.18);
        }

        /* 模态框样式（同前） */
        .pdf-modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            animation: pdfFadeIn 0.25s ease;
        }
        .pdf-modal-overlay.active {
            display: flex;
        }
        .pdf-modal-box {
            background: #1e1e2e;
            border-radius: 12px;
            padding: 24px;
            max-width: 640px;
            width: 92%;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            color: #cdd6f4;
        }
        .pdf-modal-box h2 {
            margin-top: 0;
            color: #fff;
            font-size: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding-bottom: 12px;
        }
        .pdf-modal-scroll {
            overflow-y: auto;
            flex: 1;
            margin: 8px 0 16px;
            padding-right: 4px;
        }
        .pdf-modal-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .pdf-modal-scroll::-webkit-scrollbar-thumb {
            background: #45475a;
            border-radius: 4px;
        }
        .pdf-chapter-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.15s;
            border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .pdf-chapter-item:hover {
            background: rgba(255,255,255,0.05);
        }
        .pdf-chapter-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: #89b4fa;
            cursor: pointer;
            flex-shrink: 0;
        }
        .pdf-chapter-item .chapter-label {
            font-size: 14px;
            color: #cdd6f4;
            word-break: break-word;
        }
        .pdf-chapter-item .chapter-badge {
            font-size: 11px;
            color: #6c7086;
            background: rgba(255,255,255,0.05);
            padding: 0 8px;
            border-radius: 4px;
            margin-left: auto;
            flex-shrink: 0;
        }
        .pdf-modal-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding-top: 16px;
            align-items: center;
        }
        .pdf-modal-actions button {
            padding: 6px 16px;
            border-radius: 6px;
            border: none;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            background: #313244;
            color: #cdd6f4;
        }
        .pdf-modal-actions button:hover {
            background: #45475a;
        }
        .pdf-modal-actions .btn-primary {
            background: #89b4fa;
            color: #1e1e2e;
            font-weight: 600;
        }
        .pdf-modal-actions .btn-primary:hover {
            background: #74c7ec;
            transform: scale(1.02);
        }
        .pdf-modal-actions .btn-secondary {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .pdf-modal-actions .btn-secondary:hover {
            background: rgba(255,255,255,0.05);
        }
        .pdf-selection-info {
            font-size: 12px;
            color: #6c7086;
            margin-left: auto;
        }

        @keyframes pdfFadeIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
        }

        /* ---------- 封面样式（屏幕隐藏，打印显示） ---------- */
        .pdf-cover {
            display: none;  /* 默认隐藏，打印时显示 */
            text-align: center;
            page-break-after: always;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100vh;  /* 填满一页 */
            box-sizing: border-box;
            background: #fff; /* 背景白色，保证图片和文字清晰 */
            color: #000;
        }
        .pdf-cover img {
            width: 100%;
            height: 50vh;   /* 图片占上半页 */
            object-fit: contain; /* 保持比例，留白自动填充 */
        }
        .pdf-cover .cover-list {
            height: 50vh;   /* 下半页列表 */
            overflow-y: auto;
            padding: 20px 40px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            background: #fafafa;
        }
        .pdf-cover .cover-list h2 {
            margin: 0 0 12px 0;
            font-size: 22px;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 8px;
        }
        .pdf-cover .cover-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
            text-align: left;
            font-size: 14px;
            line-height: 1.8;
            columns: 2;           /* 双栏显示，更紧凑 */
            column-gap: 40px;
        }
        .pdf-cover .cover-list ul li {
            padding: 2px 0;
            border-bottom: 1px dashed #eee;
            break-inside: avoid;
        }
        .pdf-cover .cover-list ul li::before {
            content: "▸ ";
            color: #4a90d9;
            font-weight: bold;
        }

        /* 打印样式：显示封面，隐藏界面，强制内容可见 */
        @media print {
            body * {
                visibility: hidden;
            }
            #article-body, #article-body * {
                visibility: visible;
            }
            #article-body {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 0;
                margin: 0;
            }

            /* 封面显示 */
            .pdf-cover {
                display: block !important;
                visibility: visible !important;
            }
            .pdf-cover * {
                visibility: visible !important;
            }

            /* 内容章节强制可见 */
            #article-body .section-wrapper,
            #article-body .figure-container,
            #article-body .iwp-figure,
            #article-body img {
                content-visibility: visible !important;
                display: block;
            }

            /* 防跨页截断 */
            #article-body .section-wrapper,
            #article-body .figure-container,
            #article-body .iwp-figure,
            #article-body img,
            #article-body pre,
            #article-body .iwp-code-wrapper {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            #article-body img {
                max-width: 100%;
                height: auto;
                page-break-inside: avoid;
            }

            h1, h2, h3 {
                page-break-after: avoid;
            }

            /* 隐藏工具栏等 */
            #toolbar, #sidebar, #toc-panel, #search-panel,
            .comment-section, .copy-btn-standalone,
            .pdf-modal-overlay {
                display: none !important;
            }

            pre, code {
                white-space: pre-wrap !important;
                word-break: break-all !important;
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(style);

    // ---------- 注入按钮 ----------
    function injectButton() {
        const toolbar = document.getElementById('toolbar');
        if (!toolbar) {
            const wait = setInterval(() => {
                const tb = document.getElementById('toolbar');
                if (tb) {
                    clearInterval(wait);
                    doInject(tb);
                }
            }, 200);
            setTimeout(() => clearInterval(wait), 5000);
            return;
        }
        doInject(toolbar);
    }

    function doInject(toolbar) {
        const btn = document.createElement('button');
        btn.id = 'pdf-export-btn';
        btn.textContent = '📄 PDF';
        btn.setAttribute('aria-label', '导出 PDF（按 H2 章节选择）');
        btn.addEventListener('click', openModal);
        toolbar.appendChild(btn);
    }

    // ---------- 模态框 ----------
    function getModalHTML() {
        return `
            <div class="pdf-modal-overlay" id="pdf-modal-overlay">
                <div class="pdf-modal-box">
                    <h2>📄 选择要导出的章节</h2>
                    <div style="font-size:13px; color:#6c7086; margin-bottom:8px;">
                       勾选你想包含的 H2 章节，封面将自动列出所选章节标题。
                    </div>
                    <div class="pdf-modal-scroll" id="pdf-chapter-list"></div>
                    <div class="pdf-modal-actions">
                        <button class="btn-secondary" id="pdf-select-all">✅ 全选</button>
                        <button class="btn-secondary" id="pdf-deselect-all">❌ 取消全选</button>
                        <span class="pdf-selection-info" id="pdf-selection-info">已选 0 章</span>
                        <button class="btn-secondary" id="pdf-close-modal">关闭</button>
                        <button class="btn-primary" id="pdf-generate">🖨️ 生成 PDF</button>
                    </div>
                </div>
            </div>
        `;
    }

    // ---------- 核心逻辑 ----------
    function openModal() {
        let modal = document.getElementById('pdf-modal-overlay');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', getModalHTML());
            modal = document.getElementById('pdf-modal-overlay');
            document.getElementById('pdf-close-modal').addEventListener('click', closeModal);
            document.getElementById('pdf-select-all').addEventListener('click', () => toggleAllCheckboxes(true));
            document.getElementById('pdf-deselect-all').addEventListener('click', () => toggleAllCheckboxes(false));
            document.getElementById('pdf-generate').addEventListener('click', generatePDF);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
        renderChapterList();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSelectionCount();
    }

    function closeModal() {
        const modal = document.getElementById('pdf-modal-overlay');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        restoreAllElements();
    }

    function restoreAllElements() {
        // 移除封面（如果存在）
        const cover = document.querySelector('.pdf-cover');
        if (cover && cover.parentNode) cover.parentNode.removeChild(cover);
        // 恢复所有隐藏的元素
        document.querySelectorAll('#article-body *').forEach(el => {
            if (el.style && el.style.display === 'none') {
                el.style.display = '';
            }
        });
    }

    // ---------- 渲染 H2 列表 ----------
    function renderChapterList() {
        const container = document.getElementById('pdf-chapter-list');
        if (!container) return;
        const h2s = document.querySelectorAll('#article-body h2');
        if (h2s.length === 0) {
            container.innerHTML = `<div style="color:#6c7086; padding:20px; text-align:center;">⚠️ 当前没有找到 H2 章节标题</div>`;
            return;
        }
        container.innerHTML = '';
        h2s.forEach((h2, index) => {
            if (!h2.id) h2.id = 'h2-' + Date.now() + '-' + index;
            const item = document.createElement('label');
            item.className = 'pdf-chapter-item';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.dataset.h2Id = h2.id;
            cb.addEventListener('change', updateSelectionCount);

            const label = document.createElement('span');
            label.className = 'chapter-label';
            let parentH1 = h2.previousElementSibling;
            let h1Name = '';
            while (parentH1) {
                if (parentH1.tagName === 'H1') { h1Name = parentH1.textContent.trim(); break; }
                parentH1 = parentH1.previousElementSibling;
            }
            label.textContent = h2.textContent.trim();

            const badge = document.createElement('span');
            badge.className = 'chapter-badge';
            badge.textContent = h1Name ? `📁 ${h1Name}` : `H2-${index+1}`;

            item.appendChild(cb);
            item.appendChild(label);
            item.appendChild(badge);
            container.appendChild(item);
        });
        updateSelectionCount();
    }

    function toggleAllCheckboxes(checked) {
        document.querySelectorAll('#pdf-chapter-list input[type="checkbox"]').forEach(cb => cb.checked = checked);
        updateSelectionCount();
    }

    function updateSelectionCount() {
        const cbs = document.querySelectorAll('#pdf-chapter-list input[type="checkbox"]');
        const checked = document.querySelectorAll('#pdf-chapter-list input[type="checkbox"]:checked');
        const info = document.getElementById('pdf-selection-info');
        if (info) info.textContent = `已选 ${checked.length} / ${cbs.length} 章`;
    }

    // ---------- 生成 PDF（含封面） ----------
    function generatePDF() {
        const checkedIds = new Set();
        const checkedLabels = [];
        document.querySelectorAll('#pdf-chapter-list input[type="checkbox"]:checked').forEach(cb => {
            checkedIds.add(cb.dataset.h2Id);
            const label = cb.closest('.pdf-chapter-item').querySelector('.chapter-label');
            if (label) checkedLabels.push(label.textContent.trim());
        });

        if (checkedIds.size === 0) {
            alert('⚠️ 请至少勾选一个章节再导出！');
            return;
        }

        closeModal();

        // 1. 恢复所有元素（移除之前可能残留的样式）
        restoreAllElements();

        // 2. 构建封面并插入到 #article-body 最前面
        const cover = document.createElement('div');
        cover.className = 'pdf-cover';
        cover.innerHTML = `
            <img src="images/077.png" alt="封面" />
            <div class="cover-list">
                <h2>📌 范围说明</h2>
                <ul>
                    ${checkedLabels.map(title => `<li>${escapeHtml(title)}</li>`).join('')}
                </ul>
            </div>
        `;
        const body = document.getElementById('article-body');
        body.prepend(cover);

        // 3. 隐藏未选中的 H2 及其后续内容
        const allH2s = document.querySelectorAll('#article-body h2');
        allH2s.forEach(h2 => {
            if (!checkedIds.has(h2.id)) {
                h2.style.display = 'none';
                let sibling = h2.nextElementSibling;
                while (sibling) {
                    if (sibling.tagName === 'H1' || sibling.tagName === 'H2') break;
                    sibling.style.display = 'none';
                    sibling = sibling.nextElementSibling;
                }
            }
        });

        // 4. 打印
        const printHandler = () => {
            restoreAllElements();
            window.onafterprint = null;
        };
        window.onafterprint = printHandler;

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                restoreAllElements();
                window.onafterprint = null;
            }, 5000);
        }, 150);
    }

    // ---------- 工具函数 ----------
    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    // ---------- 启动 ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButton);
    } else {
        injectButton();
    }
})();
