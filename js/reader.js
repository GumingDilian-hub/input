/* ========== 配置与常量 ========== */
const CONFIG = {
    COMMENT_API: 'https://woxiangcaoni.2167964516.workers.dev', // 请确保这是你的 Worker 地址
    ADMIN_USERNAME: 'loading', // 站主账号（始作俑者标签判定）
    CHAPTERS: [
        'notes/000/index.md', 'notes/001/index.md', 'notes/002/index.md', 'notes/003/index.md',
        'notes/004/index.md', 'notes/005/index.md', 'notes/006/index.md', 'notes/007/index.md',
        'notes/008/index.md', 'notes/009/index.md', 'notes/010/index.md', 'notes/011/index.md',
        'notes/012/index.md', 'notes/013/index.md', 'notes/014/index.md', 'notes/015/index.md',
        'notes/016/index.md', 'notes/017/index.md', 'notes/018/index.md', 'notes/019/index.md'
    ],
    AUTHOR_MD: 'notes/000/index.md',
    DEFAULT_AVATAR: 'images/0721.png'
};

/* ========== 全局状态 ========== */
let state = {
    user: null, // { username, token }
    comments: {}, // 缓存评论数据 { sectionId: { comments: [], page: 1 } }
    scrollSpyActive: false
};

/* ========== 工具函数 ========== */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const safeFetch = async (url, options = {}) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error(`Fetch Error [${url}]:`, error);
        return null;
    }
};

/* ========== 初始化入口 ========== */
document.addEventListener('DOMContentLoaded', async () => {
    const overlay = $('#loading-overlay');
    
    // 并行加载所有章节（优化版）
    await loadAllContent();

    // 移除 Loading
    if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 500);
    }

    // 初始化 UI 组件
    try {
        initSidebar();
        initSearch();
        initScrollSpy();
        initProgress();
        initAuthorPanel();
        initChapterSelect();
        
        // 恢复用户登录状态
        restoreUserSession();
        
        // 渲染所有评论区结构
        const body = $('#article-body');
        if (body) {
            injectCommentSections(body);
            setupGlobalCommentListeners();
        }
    } catch (e) {
        console.error("Init Error:", e);
    }
});

/* ========== 核心内容加载 ========== */
async function loadAllContent() {
    const body = $('#article-body');
    const progressText = $('#progress-text');
    if (!body) return;

    const total = CONFIG.CHAPTERS.length;
    const results = [];

    // 并行下载
    const promises = CONFIG.CHAPTERS.map((path, index) => 
        fetch(path)
            .then(resp => resp.ok ? resp.text() : Promise.reject('404'))
            .then(text => processMarkdown(text, path))
            .catch(err => {
                console.warn(`Load failed: ${path}`, err);
                return { meta: null, content: '', chapterNum: 'unknown' };
            })
    );

    for (let i = 0; i < total; i++) {
        try {
            const result = await promises[i];
            results.push(result);
            
            // 更新进度文本
            if (progressText) progressText.textContent = `少女祈祷中... ${i + 1}/${total}`;
        } catch (e) {
            console.error("Chapter load error:", e);
            results.push({ meta: null, content: '', chapterNum: 'err' });
        }
    }

    // 渲染版本信息
    renderVersionInfo(results);
    
    // 分批渲染 DOM (避免主线程卡死)
    if (progressText) progressText.textContent = '正在渲染 DOM...';
    body.innerHTML = '';

    let currentWrapper = null;

    for (let i = 0; i < results.length; i++) {
        const chunk = results[i].content;
        if (!chunk) continue;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-chunk clearfix';
        
        // 安全解析 Markdown
        try {
            sectionDiv.innerHTML = marked.parse(chunk);
        } catch (e) {
            sectionDiv.innerHTML = `<p>[解析错误]</p>`;
        }

        // 图片处理
        postProcessImages(sectionDiv, results[i].chapterNum);
        postProcessFigure(sectionDiv);
        sectionDiv.querySelectorAll('pre code').forEach(b => {
            try { hljs.highlightElement(b); } catch(e){}
        });

        body.appendChild(sectionDiv);

        // 每 3 章节让出主线程，保持 UI 响应
        if (i % 3 === 2) await new Promise(r => requestAnimationFrame(r));
    }

    // 后处理
    renderMath();
    buildTOC();
    
    // 如果进度条还在，隐藏它
    if (progressText) progressText.parentElement.classList.add('hidden');
}

/* ========== Markdown 预处理 ========== */
function processMarkdown(md, path) {
    const { meta, content } = extractAndRemoveFrontMatter(md);
    const chapterNum = path.split('/')[1];
    
    let processedContent = content
        // 图片路径修正
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
            if (!src.startsWith('http') && !src.startsWith('/')) {
                return `![${alt}](images/${chapterNum}/${src})`;
            }
            return m;
        })
        // 特殊图片标签处理
        .replace(/(:::image\s+\S+\s+)([^\s]+)(\s*.*?:::)/g, (m, prefix, filename, suffix) => {
            if (!filename.startsWith('http') && !filename.startsWith('/')) {
                return prefix + 'images/' + chapterNum + '/' + filename + suffix;
            }
            return m;
        });

    return { meta, content: processedContent, chapterNum };
}

function extractAndRemoveFrontMatter(md) {
    const lines = md.split(/\r?\n/);
    if (lines[0].trim() !== '---') return { content: md, meta: null };
    const end = lines.indexOf('---', 1);
    if (end === -1) return { content: md, meta: null };
    
    const fmLines = lines.slice(1, end);
    const meta = {};
    fmLines.forEach(line => {
        const m = line.match(/^(\w+):\s*(.*)/);
        if (m) {
            let key = m[1], val = m[2].trim();
            if (key === 'tags') val = val.replace(/[\[\]]/g, '').split(',').map(t=>t.trim());
            meta[key] = val;
        }
    });
    
    let content = lines.slice(end+1).join('\n').replace(/^\n+/, '');
    return { content, meta };
}

/* ========== 图片与图表后处理 ========== */
function postProcessImages(container, chapterNum) {
    container.querySelectorAll('img').forEach(img => {
        // 容错：添加加载失败处理
        img.onerror = function() {
            console.warn('Image broken:', this.src);
            // 可选：替换为占位符
            // this.style.display = 'none'; 
        };

        const alt = img.alt || '';
        const match = alt.match(/\{(left|right|around)\s*(width=(\d+))?\}/);
        if (match) {
            const pos = match[1], width = match[3];
            if (width) img.style.width = width+'px';
            img.classList.add('iwp-img-' + pos);
            img.alt = alt.replace(match[0], '').trim();
        } else {
            img.classList.add('iwp-img-center');
        }
    });
}

function postProcessFigure(container) {
    const regex = /:::image\s+(left|right|center)?\s*([^\s]+)\s*(.*?)\s*:::/g;
    container.innerHTML = container.innerHTML.replace(regex, (m, pos, filename, caption) => {
        pos = pos || 'center';
        return `<div class="figure-container figure-${pos}"><img src="${filename}" alt="${escapeHtml(caption)}" class="iwp-img-${pos}"><div class="figure-caption">${escapeHtml(caption)}</div></div>`;
    });
}

function renderMath() {
    const body = $('#article-body');
    if (body && typeof renderMathInElement === 'function') {
        renderMathInElement(body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

function renderVersionInfo(results) {
    let versionMeta = null;
    for (const r of results) {
        if (r.meta && r.meta.title) { versionMeta = r.meta; break; }
    }
    
    const versionDiv = $('#version-info');
    if (versionMeta && versionDiv) {
        versionDiv.innerHTML =
            `<strong>${escapeHtml(versionMeta.title || '')}</strong>` +
            (versionMeta.date ? ` · 更新: ${escapeHtml(versionMeta.date)}` : '') +
            (versionMeta.version ? ` · v${escapeHtml(versionMeta.version)}` : '') +
            (versionMeta.tags ? ` · 标签: ${escapeHtml(Array.isArray(versionMeta.tags) ? versionMeta.tags.join(', ') : versionMeta.tags)}` : '');
        versionDiv.style.display = 'block';
    }
}

/* ========== UI 功能：侧边栏、搜索、进度 ========== */
function initSidebar() {
    const resizer = $('#resizer');
    const sidebar = $('#sidebar');
    if (!resizer || !sidebar) return;

    let isResizing = false;
    resizer.addEventListener('mousedown', () => { isResizing=true; document.body.style.cursor='col-resize'; document.body.style.userSelect='none'; });
    document.addEventListener('mousemove', e => { 
        if(!isResizing) return; 
        const w = e.clientX; 
        if(w > 180 && w < 600) sidebar.style.width = w + 'px'; 
    });
    document.addEventListener('mouseup', () => { isResizing=false; document.body.style.cursor=''; document.body.style.userSelect=''; });
    
    // 全局展开/折叠绑定
    window.expandAll = () => {
        $$('.section-wrapper').forEach(w => w.style.display='');
        $$('.toc-toggle').forEach(t => t.textContent='▼');
        $$('.toc-item[data-parent]').forEach(i => i.style.display='');
    };
    window.collapseAll = () => {
        $$('.section-wrapper').forEach(w => w.style.display='none');
        $$('.toc-toggle').forEach(t => t.textContent='▶');
        $$('.toc-item[data-parent]').forEach(i => i.style.display='none');
    };
}

function buildTOC() {
    const toc = $('#toc-tree');
    if (!toc) return;
    toc.innerHTML = '';
    const headings = $$('#article-body h1, #article-body h2, #article-body h3');
    let lastH1=null, lastH2=null;
    let headingIndex = 0;

    headings.forEach(h => {
        if (!h.id) h.id = 'h-' + (headingIndex++);
        const level = parseInt(h.tagName.charAt(1));
        const text = h.textContent.trim();
        const item = document.createElement('div');
        item.className = `toc-item toc-h${level}`;
        item.setAttribute('data-target', h.id);

        if (level===1) { lastH1=h.id; lastH2=null; }
        else if (level===2) { lastH2=h.id; item.setAttribute('data-parent', lastH1); }
        else if (level===3) { item.setAttribute('data-parent', lastH2||lastH1); }

        if (level<=2) {
            const toggle = document.createElement('span');
            toggle.className='toc-toggle'; toggle.textContent='▼';
            toggle.addEventListener('click', e => { e.stopPropagation(); toggleSectionVisibility(h.id, toggle); });
            item.appendChild(toggle);
        } else {
            const spacer = document.createElement('span');
            spacer.style.display='inline-block'; spacer.style.width='1rem';
            item.appendChild(spacer);
        }
        const span = document.createElement('span'); span.textContent=text;
        item.appendChild(span);
        item.addEventListener('click', () => { 
            try { h.scrollIntoView({behavior:'smooth',block:'start'}); } catch(e){}
        });
        toc.appendChild(item);
    });
}

function toggleSectionVisibility(headingId, toggleEl) {
    const target = document.getElementById(headingId);
    if (!target) return;
    const wrapper = target.closest('.section-wrapper');
    if (!wrapper) return;
    const visible = wrapper.style.display !== 'none';
    if (visible) {
        wrapper.style.display = 'none'; toggleEl.textContent = '▶';
        hideTOCChildren(headingId);
    } else {
        wrapper.style.display = ''; toggleEl.textContent = '▼';
        showTOCChildren(headingId);
    }
}

function hideTOCChildren(parentId) { $$('.toc-item').forEach(c => { if(c.getAttribute('data-parent')===parentId) c.style.display='none'; }); }
function showTOCChildren(parentId) { 
    $$('.toc-item').forEach(c => { 
        if(c.getAttribute('data-parent')===parentId) {
            if(isParentVisible(c)) c.style.display='';
        } 
    }); 
}
function isParentVisible(child) {
    const pid = child.getAttribute('data-parent');
    if (!pid) return true;
    const p = document.getElementById(pid);
    if (!p) return true;
    const pw = p.closest('.section-wrapper');
    return !(pw && pw.style.display==='none');
}

function initSearch() {
    const input = $('#search-input');
    const results = $('#search-results');
    if (!input || !results) return;

    let debounceTimer;
    let searchIndex = [];

    function buildIndex() {
        searchIndex = [];
        $$('#article-body h3').forEach((h3, i) => {
            if(!h3.id) h3.id = 'h3-'+i;
            const title = h3.textContent.trim();
            let ctx = '', node = h3.nextElementSibling;
            while(node && !['H1','H2','H3'].includes(node.tagName)) {
                if(node.textContent.trim()) ctx += node.textContent.trim()+' ';
                node = node.nextElementSibling;
                if(ctx.length>80) break;
            }
            searchIndex.push({ title, titleLower: title.toLowerCase(), context: ctx.slice(0,80).trim(), id: h3.id });
        });
    }
    
    // 延迟构建索引，等待 DOM 渲染
    setTimeout(buildIndex, 1000);

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const q = input.value.trim().toLowerCase();
            results.innerHTML = '';
            if(!q) return;
            
            searchIndex.filter(i => i.titleLower.includes(q) || i.context.toLowerCase().includes(q)).forEach(i=>{
                const div = document.createElement('div');
                div.className='search-result-item';
                div.innerHTML = `<div class="title">${escapeHtml(i.title)}</div><div class="context">${escapeHtml(i.context)}</div>`;
                div.addEventListener('click', ()=>{
                    const el = document.getElementById(i.id);
                    if(el) {
                        el.scrollIntoView({behavior:'smooth',block:'start'});
                        toggleSearchPanel();
                    }
                });
                results.appendChild(div);
            });
        }, 300);
    });
}

function toggleSearchPanel() {
    const panel = $('#search-panel');
    if (panel) {
        panel.classList.toggle('panel-visible');
    }
}

function initScrollSpy() {
    const tocItems = $$('.toc-item');
    const autoCheckbox = $('#auto-scroll-checkbox');
    const rootEl = $('#content');

    const idToToc = new Map();
    tocItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        if (targetId) idToToc.set(targetId, item);
    });

    function highlightChain(targetId) {
        tocItems.forEach(i => i.classList.remove('active'));
        let current = $(`.toc-item[data-target="${targetId}"]`);
        while (current) {
            current.classList.add('active');
            const parentId = current.getAttribute('data-parent');
            if (parentId) {
                current = $(`.toc-item[data-target="${parentId}"]`);
            } else break;
        }
    }

    function scrollTocTo(targetId) {
        if (!autoCheckbox || !autoCheckbox.checked) return;
        const item = $(`.toc-item[data-target="${targetId}"]`);
        if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    const observer = new IntersectionObserver((entries) => {
        let topMostEntry = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!topMostEntry || entry.boundingClientRect.top < topMostEntry.boundingClientRect.top) {
                    topMostEntry = entry;
                }
            }
        });
        if (topMostEntry) {
            const id = topMostEntry.target.id;
            highlightChain(id);
            scrollTocTo(id);
        }
    }, {
        root: rootEl,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0
    });

    $$('#article-body h1, #article-body h2, #article-body h3').forEach(h => {
        try { observer.observe(h); } catch (e) {}
    });
}

function initProgress() {
    const content = $('#content');
    if (!content) return;
    
    // 恢复
    const saved = localStorage.getItem('iwp-progress');
    if (saved) content.scrollTop = parseInt(saved) || 0;

    // 保存
    let timer;
    content.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => localStorage.setItem('iwp-progress', content.scrollTop), 300);
    });
}

function initAuthorPanel() {
    const btn = $('#btn-author');
    const panel = $('#author-panel');
    const close = $('#close-author');
    if (!btn || !panel || !close) return;

    btn.addEventListener('click', async () => {
        panel.classList.add('panel-visible');
        const info = $('#author-info');
        if (panel.classList.contains('loaded') || !info) return;

        try {
            const resp = await fetch(CONFIG.AUTHOR_MD);
            if(resp.ok) {
                const md = await resp.text();
                const fm = extractAndRemoveFrontMatter(md).meta || {};
                let name = fm.name || '未署名', bio = fm.bio || '暂无简介', avatar = fm.avatar || '';
                if(avatar && !avatar.startsWith('http')) avatar = 'images/000/' + avatar;
                
                info.innerHTML = `${avatar ? `<img src="${avatar}" style="width:80px;border-radius:50%;margin-bottom:1rem;">` : ''}<h2>${escapeHtml(name)}</h2><p>${escapeHtml(bio)}</p>`;
                panel.classList.add('loaded');
            }
        } catch(e){}
    });
    
    close.addEventListener('click', () => panel.classList.remove('panel-visible'));
}

function initChapterSelect() {
    const select = $('#chapter-select');
    if(!select) return;
    // 简单获取所有 H1
    $$('#article-body h1').forEach(h1 => {
        if(!h1.id) h1.id = 'h-' + Math.random().toString(36).substr(2,8);
        const opt = document.createElement('option');
        opt.value = h1.id;
        opt.textContent = h1.textContent.trim();
        select.appendChild(opt);
    });
    select.addEventListener('change', () => {
        const el = document.getElementById(select.value);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
}

/* ========== 评论区系统 (核心嵌套逻辑) ========== */

// 1. 为每个 H2 插入评论区容器
function injectCommentSections(body) {
    const h2s = body.querySelectorAll('h2');
    h2s.forEach((h2, index) => {
        if (!h2.id) h2.id = 'h2-' + index;
        const sectionId = h2.id;

        const commentSection = document.createElement('div');
        commentSection.className = 'comment-section';
        commentSection.setAttribute('data-section-id', sectionId);
        commentSection.innerHTML = `
            <div class="comment-toggle" onclick="toggleCommentSection(this, '${sectionId}')">
                来喵两句～（点击展开评论区） <span class="comment-count-badge" id="comment-count-${sectionId}"></span>
            </div>
            <div class="comment-body" id="comment-body-${sectionId}" style="display:none;">
                <div class="comment-list" id="comment-list-${sectionId}"></div>
                <div class="comment-form" id="comment-form-${sectionId}">
                    <div class="auth-panel" id="auth-panel-${sectionId}"></div>
                    <div class="input-area" id="input-area-${sectionId}" style="display:none;">
                        <textarea id="comment-input-${sectionId}" placeholder="良言一句我就热，恶语伤人我就冷..." rows="3"></textarea>
                        <button onclick="submitComment('${sectionId}')">说话！</button>
                    </div>
                </div>
            </div>
        `;
        h2.parentNode.insertBefore(commentSection, h2.nextSibling);
    });
}

// 2. 切换评论区显示
function toggleCommentSection(toggleEl, sectionId) {
    const body = document.getElementById('comment-body-' + sectionId);
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
        // 延迟加载，提升首屏性能
        if (!state.comments[sectionId]) {
            fetchCommentsForSection(sectionId);
        } else {
            // 已加载，直接显示（如果已经被渲染）
            // 这里简单处理：总是重新渲染以确保状态同步，或者由 state 管理
            renderCommentsForSection(sectionId);
        }
    } else {
        body.style.display = 'none';
    }
}

// 3. 获取评论数据
async function fetchCommentsForSection(sectionId) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    const countBadge = document.getElementById('comment-count-' + sectionId);
    if (!listEl) return;
    listEl.innerHTML = '少女祈祷中...';

    const data = await safeFetch(`${CONFIG.COMMENT_API}/comments?section=${sectionId}&limit=100`);
    
    if (data) {
        state.comments[sectionId] = data.comments || [];
        if (countBadge) countBadge.textContent = `(${data.total || 0})`;
        renderCommentsForSection(sectionId);
        updateAuthUI(sectionId); // 更新登录状态显示
    } else {
        listEl.innerHTML = '加载失败，请稍后再试';
    }
}

// 4. 构建评论树 (健壮性：处理孤儿节点)
function buildCommentTree(flatComments) {
    const map = {};
    const roots = [];
    
    flatComments.forEach(c => { 
        c.children = []; 
        map[c.id] = c; 
    });
    
    flatComments.forEach(c => {
        // 如果存在 parent_id 且能在 map 中找到父节点，则加入父节点 children
        // 否则，视为孤儿节点，作为根节点显示（鲁棒性处理）
        if (c.parent_id && map[c.parent_id]) {
            map[c.parent_id].children.push(c);
        } else {
            roots.push(c);
        }
    });
    return roots;
}

// 5. 渲染评论树 (递归)
function renderCommentsForSection(sectionId) {
    const listEl = document.getElementById('comment-list-' + sectionId);
    if (!listEl) return;
    
    const flat = state.comments[sectionId] || [];
    const tree = buildCommentTree(flat);
    listEl.innerHTML = ''; // 清空
    
    if (flat.length === 0) {
        listEl.innerHTML = '<p style="color:#999; font-size:0.9rem;">暂无评论，快来抢沙发～</p>';
        return;
    }
    
    renderCommentNodeRecursive(listEl, tree, sectionId);
}

function renderCommentNodeRecursive(container, nodes, sectionId) {
    nodes.forEach(node => {
        const div = document.createElement('div');
        const isChild = !!node.parent_id;
        
        // 样式逻辑
        const style = isChild ? 
            `margin-left: 24px; padding-left: 12px; border-left: 2px solid #eee; background: #fcfcfc;` : 
            `padding: 12px 0; border-bottom: 1px solid #eee;`;
        div.style.cssText = style;

        // 站主标签
        const isMaster = (node.username === CONFIG.ADMIN_USERNAME);
        const masterTag = isMaster ? 
            `<span style="background:#d9534f; color:white; font-size:10px; padding:2px 6px; border-radius:3px; margin-left:6px; vertical-align:middle;">始作俑者</span>` : '';

        div.innerHTML = `
            <div class="comment-item">
                <div class="comment-avatar">
                    <img src="${node.avatar || CONFIG.DEFAULT_AVATAR}" width="30" height="30" onerror="this.src='${CONFIG.DEFAULT_AVATAR}'">
                </div>
                <div class="comment-content">
                    <div>
                        <span class="comment-user">${escapeHtml(node.username)}</span>${masterTag}
                        <span class="comment-time">${node.created_at ? new Date(node.created_at).toLocaleString() : ''}</span>
                    </div>
                    <p style="margin: 5px 0 0; color: #444; line-height: 1.5;">${escapeHtml(node.content)}</p>
                    <div class="comment-actions" style="margin-top: 5px;">
                        <button onclick="likeComment(${node.id}, '${sectionId}')" style="background:none; border:none; cursor:pointer; font-size:0.85rem;">❤️ ${node.likes || 0}</button>
                        <button onclick="quoteComment('${escapeHtml(node.content)}', '${sectionId}')" style="background:none; border:none; cursor:pointer; font-size:0.85rem;">引用</button>
                        <button onclick="showReplyBox(${node.id}, '${sectionId}')" style="background:none; border:none; cursor:pointer; font-size:0.85rem;">回复</button>
                    </div>
                </div>
            </div>
            <div id="reply-box-${node.id}" style="display:none; margin: 8px 0 8px 42px;"></div>
        `;
        
        container.appendChild(div);

        // 递归
        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            container.appendChild(childrenContainer);
            renderCommentNodeRecursive(childrenContainer, node.children, sectionId);
        }
    });
}

/* ========== 交互逻辑：登录、回复、点赞 ========== */

function restoreUserSession() {
    const saved = localStorage.getItem('iwp-user');
    if (saved) {
        try {
            state.user = JSON.parse(saved);
        } catch(e) { localStorage.removeItem('iwp-user'); }
    }
    // 更新所有可见的评论区 UI
    $$('.comment-section').forEach(sec => {
        const sectionId = sec.getAttribute('data-section-id');
        updateAuthUI(sectionId);
    });
}

function updateAuthUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    const inputArea = document.getElementById('input-area-' + sectionId);
    if (!panel) return;
    
    if (state.user) {
        panel.innerHTML = `<span>Hi ${state.user.username}</span> <button onclick="doLogout()">退出</button>`;
        if (inputArea) inputArea.style.display = 'block';
    } else {
        panel.innerHTML = `
            <button onclick="showLoginUI('${sectionId}')">登录</button>
            <button onclick="showRegisterUI('${sectionId}')">注册</button>
        `;
        if (inputArea) inputArea.style.display = 'none';
    }
}

function showLoginUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    panel.innerHTML = `
        <input type="text" id="login-user-${sectionId}" placeholder="用户名">
        <input type="password" id="login-pass-${sectionId}" placeholder="密码">
        <button onclick="doLogin('${sectionId}')">Go</button>
    `;
}

function showRegisterUI(sectionId) {
    const panel = document.getElementById('auth-panel-' + sectionId);
    panel.innerHTML = `
        <input type="text" id="reg-user-${sectionId}" placeholder="用户名">
        <input type="password" id="reg-pass-${sectionId}" placeholder="密码">
        <button onclick="doRegister('${sectionId}')">Go</button>
    `;
}

async function doLogin(sectionId) {
    const u = document.getElementById(`login-user-${sectionId}`)?.value.trim();
    const p = document.getElementById(`login-pass-${sectionId}`)?.value;
    if (!u || !p) return alert('请填写完整');

    const data = await safeFetch(`${CONFIG.COMMENT_API}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: u, password: p })
    });

    if (data && data.token) {
        state.user = { username: u, token: data.token };
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        updateAuthUI(sectionId);
        fetchCommentsForSection(sectionId); // 刷新评论
    } else {
        alert('登录失败');
    }
}

async function doRegister(sectionId) {
    const u = document.getElementById(`reg-user-${sectionId}`)?.value.trim();
    const p = document.getElementById(`reg-pass-${sectionId}`)?.value;
    if (!u || !p) return alert('请填写完整');

    const data = await safeFetch(`${CONFIG.COMMENT_API}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: u, password: p })
    });

    if (data && data.token) {
        state.user = { username: u, token: data.token };
        localStorage.setItem('iwp-user', JSON.stringify(state.user));
        updateAuthUI(sectionId);
        fetchCommentsForSection(sectionId);
    } else {
        alert('注册失败，可能用户名已存在');
    }
}

function doLogout() {
    state.user = null;
    localStorage.removeItem('iwp-user');
    $$('.auth-panel').forEach(p => {
        // 查找最近的 section ID
        const sec = p.closest('.comment-section');
        if (sec) updateAuthUI(sec.getAttribute('data-section-id'));
    });
}

// 顶层评论
async function submitComment(sectionId) {
    if (!state.user) return alert('请先登录');
    const input = document.getElementById(`comment-input-${sectionId}`);
    const content = input?.value.trim();
    if (!content) return;

    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${state.user.token}`},
        body: JSON.stringify({ section: sectionId, content })
    });

    if (res) {
        input.value = '';
        fetchCommentsForSection(sectionId);
    } else {
        alert('发送失败');
    }
}

// 显示回复框
function showReplyBox(parentId, sectionId) {
    const box = document.getElementById(`reply-box-${parentId}`);
    if (box.style.display === 'none') {
        box.style.display = 'block';
        box.innerHTML = `
            <textarea id="reply-input-${parentId}" rows="2" style="width:100%; border:1px solid #ddd; border-radius:4px; padding:5px;" placeholder="回复..."></textarea>
            <div style="margin-top:5px;">
                <button onclick="doReply(${parentId}, '${sectionId}')" style="padding:4px 10px; background:#333; color:#fff; border:none; border-radius:3px; cursor:pointer;">发送</button>
                <button onclick="document.getElementById('reply-box-${parentId}').style.display='none'" style="padding:4px 10px; border:none; background:none; cursor:pointer;">取消</button>
            </div>
        `;
    } else {
        box.style.display = 'none';
    }
}

// 发送回复
async function doReply(parentId, sectionId) {
    if (!state.user) return alert('请先登录');
    const input = document.getElementById(`reply-input-${parentId}`);
    const content = input?.value.trim();
    if (!content) return;

    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${state.user.token}`},
        body: JSON.stringify({ section: sectionId, content, parent_id: parentId })
    });

    if (res) {
        fetchCommentsForSection(sectionId);
    } else {
        alert('发送失败');
    }
}

// 点赞
async function likeComment(commentId, sectionId) {
    const res = await safeFetch(`${CONFIG.COMMENT_API}/comments/${commentId}/like`, { method: 'POST' });
    if (res) {
        fetchCommentsForSection(sectionId);
    }
}

// 引用
function quoteComment(text, sectionId) {
    const input = document.getElementById(`comment-input-${sectionId}`);
    if (input) {
        input.value += `> ${text}\n`;
        input.focus();
    }
}

// 绑定全局事件（防止内联 onclick 找不到函数）
function setupGlobalCommentListeners() {
    window.toggleCommentSection = toggleCommentSection;
    window.submitComment = submitComment;
    window.likeComment = likeComment;
    window.quoteComment = quoteComment;
    window.showReplyBox = showReplyBox;
    window.doReply = doReply;
    window.showLoginUI = showLoginUI;
    window.showRegisterUI = showRegisterUI;
    window.doLogin = doLogin;
    window.doRegister = doRegister;
    window.doLogout = doLogout;
}
