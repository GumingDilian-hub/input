// ============================================================
// copilot.js - 依赖 reader.js 中的 state.user
// 修改点：在下方设置 WORKER_BASE_URL 为你的 Cloudflare Worker 域名
// ============================================================

(function() {
  // ---------- 在这里修改 Worker 地址（必填） ----------
  const WORKER_BASE_URL = 'https://你的worker域名.workers.dev';  // 替换为你的 Worker 域名
  // ---------------------------------------------------------

  // ---------- DOM 引用 ----------
  const btnCopilot = document.getElementById('btn-copilot');
  const tocView = document.getElementById('sidebar-toc-view');
  const copilotView = document.getElementById('sidebar-copilot-view');
  const modelDisplay = document.getElementById('copilot-model-display');
  const modelOptions = document.getElementById('copilot-model-options');
  const modeBtns = document.querySelectorAll('.copilot-mode-btn');
  const messagesContainer = document.getElementById('copilot-messages');
  const inputArea = document.getElementById('copilot-input');
  const sendBtn = document.getElementById('copilot-send');
  const newChatBtn = document.getElementById('copilot-new-chat');
  const historyList = document.getElementById('copilot-history-list');
  const imageInput = document.getElementById('copilot-image-input');
  const imageLabel = document.getElementById('copilot-image-label');

  // ---------- 模型列表 ----------
  const MODELS = [
    { id: 'nvidia/nemotron-3-super-120b-a12b', label: 'NVIDIA 3 super', logo: '1.png' },
    { id: 'nvidia/nemotron-3-ultra-550b-a55b', label: 'NVIDIA 3 ultra', logo: '1.png' },
    { id: 'meta/llama-3.3-70b-instruct', label: 'Meta 3.3', logo: '2.png' },
    { id: 'meta/llama-3.2-90b-vision-instruct', label: 'Meta 3.3 视觉', logo: '2.png' },
    { id: 'nvidia/gpt-oss-120b', label: 'ChatGPT', logo: '3.png' },
    { id: 'nvidia/gpt-oss-20b', label: 'CatGPT', logo: '3.png' },
    { id: 'minimaxai/minimax-m3', label: 'MiniMax M3', logo: '5.png' },
    { id: 'deepseek-ai/deepseek-v4-flash-0731', label: 'DeepSeek V4', logo: '6.png' },
    { id: 'z-ai/glm-5.2', label: 'GLM 5.2', logo: '7.png' },
    { id: 'google/gemma-4-31b-it', label: 'Google Gemma 4', logo: '4.png' },
  ];
  const LOGO_BASE = 'images/copilot/';

  // ---------- 状态 ----------
  let currentMode = 'note';
  let currentModel = MODELS[0].id;
  let currentImageBase64 = null;
  let messageHistory = [];
  let isProcessing = false;
  let currentSessionId = null;

  // ---------- 初始化 ----------
  function init() {
    renderModelOptions();
    bindEvents();
    loadHistoryList();
    document.querySelector('.copilot-mode-btn[data-mode="note"]')?.classList.add('active');
    updateImageUploadState();
    if (window.state && window.state.user) {
      showWelcome();
    } else {
      messagesContainer.innerHTML = '<div class="copilot-placeholder">请先登录（使用评论区登录）</div>';
    }
  }

  function renderModelOptions() {
    modelOptions.innerHTML = '';
    MODELS.forEach(m => {
      const div = document.createElement('div');
      div.className = 'copilot-model-option';
      div.dataset.model = m.id;
      div.innerHTML = `<img src="${LOGO_BASE}${m.logo}" style="width:20px;height:20px;margin-right:8px;" /> ${m.label}`;
      modelOptions.appendChild(div);
    });
    updateModelDisplay();
  }

  function updateModelDisplay() {
    const model = MODELS.find(m => m.id === currentModel);
    if (model) {
      modelDisplay.innerHTML = `<img src="${LOGO_BASE}${model.logo}" style="width:20px;height:20px;margin-right:8px;" /> ${model.label}`;
    }
  }

  function toggleDropdown() {
    const isOpen = modelOptions.style.display === 'block';
    modelOptions.style.display = isOpen ? 'none' : 'block';
  }

  function closeDropdown() {
    modelOptions.style.display = 'none';
  }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    btnCopilot.addEventListener('click', toggleCopilot);
    sendBtn.addEventListener('click', sendMessage);
    inputArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    newChatBtn.addEventListener('click', startNewChat);

    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        updateImageUploadState();
      });
    });

    modelDisplay.addEventListener('click', toggleDropdown);
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#copilot-model-dropdown')) closeDropdown();
    });

    modelOptions.addEventListener('click', (e) => {
      const option = e.target.closest('.copilot-model-option');
      if (!option) return;
      currentModel = option.dataset.model;
      updateModelDisplay();
      updateImageUploadState();
      closeDropdown();
    });

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        currentImageBase64 = ev.target.result;
        const thumb = document.createElement('div');
        thumb.className = 'copilot-image-thumb';
        thumb.innerHTML = `<img src="${currentImageBase64}" style="max-width:60px;max-height:60px;border-radius:4px;" />`;
        const wrap = inputArea.closest('.copilot-input-wrap');
        const existing = wrap.querySelector('.copilot-image-thumb');
        if (existing) existing.remove();
        wrap.insertBefore(thumb, inputArea);
      };
      reader.readAsDataURL(file);
    });
  }

  function updateImageUploadState() {
    const isVision = MODELS.some(m => m.id === currentModel && m.label.includes('视觉'));
    const enabled = isVision;
    imageInput.disabled = !enabled;
    imageLabel.style.opacity = enabled ? '1' : '0.3';
    if (!enabled) {
      currentImageBase64 = null;
      const thumb = document.querySelector('.copilot-image-thumb');
      if (thumb) thumb.remove();
      imageInput.value = '';
    }
  }

  // ---------- 切换面板 ----------
  function toggleCopilot() {
    const isOpen = copilotView.style.display !== 'none';
    if (isOpen) {
      copilotView.style.display = 'none';
      tocView.style.display = 'block';
      btnCopilot.textContent = 'Copilot';
    } else {
      copilotView.style.display = 'flex';
      tocView.style.display = 'none';
      btnCopilot.textContent = '关闭 Copilot';
      if (window.state && window.state.user) {
        if (messagesContainer.children.length === 0 || messagesContainer.querySelector('.copilot-placeholder')) {
          showWelcome();
        }
      } else {
        messagesContainer.innerHTML = '<div class="copilot-placeholder">请先登录（使用评论区登录）</div>';
      }
    }
  }

  function showWelcome() {
    messagesContainer.innerHTML = '<div class="copilot-placeholder">有什么可以帮你的？</div>';
  }

  // ---------- 发送消息 ----------
  async function sendMessage() {
    const text = inputArea.value.trim();
    if (!text && !currentImageBase64) return;
    if (!window.state || !window.state.user) {
      alert('请先登录');
      return;
    }
    if (isProcessing) return;
    isProcessing = true;
    sendBtn.disabled = true;

    const placeholder = messagesContainer.querySelector('.copilot-placeholder');
    if (placeholder) placeholder.remove();

    appendMessage('user', text, currentImageBase64);
    inputArea.value = '';
    const imgBase64 = currentImageBase64;
    currentImageBase64 = null;
    const thumb = document.querySelector('.copilot-image-thumb');
    if (thumb) thumb.remove();
    imageInput.value = '';

    // 准备AI消息占位
    const msgDiv = document.createElement('div');
    msgDiv.className = 'copilot-msg copilot-msg-assistant';
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'copilot-thinking';
    thinkingDiv.style.display = 'none';
    const thinkingSummary = document.createElement('span');
    thinkingSummary.className = 'thinking-toggle';
    thinkingSummary.textContent = '思考过程';
    thinkingSummary.addEventListener('click', () => {
      const content = thinkingDiv.querySelector('.thinking-content');
      if (content) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        thinkingSummary.textContent = isHidden ? '收起' : '思考过程';
      }
    });
    const thinkingContent = document.createElement('div');
    thinkingContent.className = 'thinking-content';
    thinkingContent.style.display = 'none';
    thinkingDiv.appendChild(thinkingSummary);
    thinkingDiv.appendChild(thinkingContent);
    const contentDiv = document.createElement('div');
    contentDiv.className = 'copilot-answer';
    msgDiv.appendChild(thinkingDiv);
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);

    let context = '';
    if (currentMode === 'note') {
      context = getCurrentChapterText();
    }
    const payload = {
      mode: currentMode,
      model: currentModel,
      messages: [{ role: 'user', content: text }],
      chapterContext: context,
      image: imgBase64 || undefined,
    };

    try {
      const response = await fetch(WORKER_BASE_URL + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.state.user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '请求失败');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let reasoningText = '';
      let contentText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'reasoning') {
                reasoningText += parsed.text;
                thinkingContent.textContent = reasoningText;
                if (thinkingDiv.style.display === 'none') {
                  thinkingDiv.style.display = 'block';
                  thinkingSummary.textContent = '思考过程';
                }
              } else if (parsed.type === 'content') {
                contentText += parsed.text;
                contentDiv.textContent = contentText;
              } else if (parsed.type === 'done') {
                break;
              }
            } catch (e) { /* ignore */ }
          }
        }
      }

      if (!reasoningText.trim()) {
        thinkingDiv.style.display = 'none';
      } else {
        thinkingContent.style.display = 'none';
        thinkingSummary.textContent = '思考过程';
      }

      // 保存历史
      const userMsg = { role: 'user', content: text };
      const assistantMsg = { role: 'assistant', content: contentText, reasoning: reasoningText };
      messageHistory.push(userMsg, assistantMsg);
      saveCurrentChat();

    } catch (err) {
      contentDiv.textContent = '错误：' + err.message;
    } finally {
      isProcessing = false;
      sendBtn.disabled = false;
    }
  }

  function getCurrentChapterText() {
    const article = document.getElementById('article-body');
    if (!article) return '';
    const h2s = article.querySelectorAll('h2');
    let target = null;
    for (const h2 of h2s) {
      const rect = h2.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        target = h2;
        break;
      }
    }
    if (!target) return '';
    let text = '';
    let node = target;
    while (node) {
      if (node.tagName === 'H2' && node !== target) break;
      if (node.tagName === 'H1') break;
      text += node.textContent + '\n';
      node = node.nextElementSibling;
    }
    return text.trim();
  }

  function appendMessage(role, content, image) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `copilot-msg copilot-msg-${role}`;
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.style.maxWidth = '120px';
      img.style.borderRadius = '4px';
      img.style.marginBottom = '4px';
      msgDiv.appendChild(img);
    }
    const p = document.createElement('p');
    p.textContent = content;
    msgDiv.appendChild(p);
    messagesContainer.appendChild(msgDiv);
  }

  // ---------- 新对话 ----------
  function startNewChat() {
    messagesContainer.innerHTML = '';
    messageHistory = [];
    currentSessionId = null;
    currentImageBase64 = null;
    const thumb = document.querySelector('.copilot-image-thumb');
    if (thumb) thumb.remove();
    imageInput.value = '';
    showWelcome();
  }

  // ---------- 历史记录 ----------
  async function loadHistoryList() {
    if (!window.state || !window.state.user) return;
    try {
      const res = await fetch(WORKER_BASE_URL + '/api/history', {
        headers: { 'Authorization': `Bearer ${window.state.user.token}` },
      });
      if (!res.ok) throw new Error('load history failed');
      const list = await res.json();
      historyList.innerHTML = '';
      if (list.length === 0) {
        historyList.innerHTML = '<div class="copilot-history-empty">暂无历史</div>';
        return;
      }
      list.forEach(item => {
        const div = document.createElement('div');
        div.className = 'copilot-history-item';
        div.textContent = item.title || '未命名对话';
        div.dataset.id = item.id;
        div.addEventListener('click', () => loadHistoryItem(item.id));
        const del = document.createElement('span');
        del.className = 'copilot-history-delete';
        del.textContent = '×';
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteHistoryItem(item.id);
        });
        div.appendChild(del);
        historyList.appendChild(div);
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function loadHistoryItem(id) {
    if (!window.state || !window.state.user) return;
    try {
      const res = await fetch(WORKER_BASE_URL + `/api/history/${id}`, {
        headers: { 'Authorization': `Bearer ${window.state.user.token}` },
      });
      if (!res.ok) throw new Error('load detail failed');
      const data = await res.json();
      if (data.messages) {
        messagesContainer.innerHTML = '';
        data.messages.forEach(msg => {
          appendHistoryMessage(msg);
        });
        messageHistory = data.messages;
        currentSessionId = id;
        const placeholder = messagesContainer.querySelector('.copilot-placeholder');
        if (placeholder) placeholder.remove();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function appendHistoryMessage(msg) {
    const role = msg.role;
    const content = msg.content;
    const reasoning = msg.reasoning || '';
    const msgDiv = document.createElement('div');
    msgDiv.className = `copilot-msg copilot-msg-${role}`;
    if (role === 'assistant' && reasoning) {
      const thinkingDiv = document.createElement('div');
      thinkingDiv.className = 'copilot-thinking';
      const summary = document.createElement('span');
      summary.className = 'thinking-toggle';
      summary.textContent = '思考过程';
      summary.addEventListener('click', () => {
        const contentEl = thinkingDiv.querySelector('.thinking-content');
        if (contentEl) {
          const isHidden = contentEl.style.display === 'none';
          contentEl.style.display = isHidden ? 'block' : 'none';
          summary.textContent = isHidden ? '收起' : '思考过程';
        }
      });
      const contentEl = document.createElement('div');
      contentEl.className = 'thinking-content';
      contentEl.style.display = 'none';
      contentEl.textContent = reasoning;
      thinkingDiv.appendChild(summary);
      thinkingDiv.appendChild(contentEl);
      msgDiv.appendChild(thinkingDiv);
    }
    const p = document.createElement('p');
    p.textContent = content;
    msgDiv.appendChild(p);
    messagesContainer.appendChild(msgDiv);
  }

  async function saveCurrentChat() {
    if (!window.state || !window.state.user || messageHistory.length < 2) return;
    const title = messageHistory[0]?.content?.slice(0, 30) || '新对话';
    try {
      await fetch(WORKER_BASE_URL + '/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.state.user.token}`,
        },
        body: JSON.stringify({ messages: messageHistory, title }),
      });
      loadHistoryList();
    } catch (e) {
      console.error('save history error', e);
    }
  }

  async function deleteHistoryItem(id) {
    if (!window.state || !window.state.user) return;
    if (!confirm('删除此历史记录？')) return;
    try {
      await fetch(WORKER_BASE_URL + `/api/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${window.state.user.token}` },
      });
      loadHistoryList();
    } catch (e) {
      console.error(e);
    }
  }

  // ---------- 暴露全局 ----------
  window.initCopilot = init;
  window.toggleCopilot = toggleCopilot;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
