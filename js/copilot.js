// ============================================================
// copilot.js - 与 reader.js 完全兼容
// 依赖：window.state（由 reader.js 提供）
// 包含：模式上拉、模型分组、轮次点、白板AI
// 基于用户修正版本，增量添加所有新功能
// ============================================================

(function() {
  // ---------- 配置 ----------
  var WORKER_BASE_URL = 'https://rough-firefly-b2a7.2167964516.workers.dev';
  var MAX_DOTS = 10;
  var LOGO_BASE = 'images/copilot/';

  // ---------- 模型列表 ----------
  var TEXT_MODELS = [
    { id: 'nvidia/nemotron-3-super-120b-a12b', label: 'NVIDIA 3 super', logo: '1.png' },
    { id: 'nvidia/nemotron-3-ultra-550b-a55b', label: 'NVIDIA 3 ultra', logo: '1.png' },
    { id: 'meta/llama-3.3-70b-instruct', label: 'Meta 3.3', logo: '2.png' },
    { id: 'nvidia/gpt-oss-120b', label: 'ChatGPT', logo: '3.png' },
    { id: 'nvidia/gpt-oss-20b', label: 'CatGPT', logo: '3.png' },
    { id: 'minimaxai/minimax-m3', label: 'MiniMax M3', logo: '5.png' },
    { id: 'deepseek-ai/deepseek-v4-flash-0731', label: 'DeepSeek V4', logo: '6.png' },
    { id: 'z-ai/glm-5.2', label: 'GLM 5.2', logo: '7.png' },
    { id: 'google/gemma-4-31b-it', label: 'Google Gemma 4', logo: '4.png' }
  ];

  var VISION_MODELS = [
    { id: 'meta/llama-3.2-90b-vision-instruct', label: 'Meta 3.3 视觉', logo: '2.png' }
  ];

  var ALL_MODELS = TEXT_MODELS.concat(VISION_MODELS);

  // ---------- 状态 ----------
  var currentMode = 'note';
  var currentModel = ALL_MODELS[0].id;
  var currentImageBase64 = null;
  var messageHistory = [];
  var isProcessing = false;
  var currentSessionId = null;
  var whiteboardContent = '';
  var roundCount = 0;
  var dotElements = [];

  // ---------- DOM 引用 ----------
  var btnCopilot, copilotView, tocView;
  var modeDisplay, modeText, modeOptions;
  var modelDisplay, modelText, modelIcon, modelOptions;
  var messagesWrapper, messagesContainer, dotsContainer;
  var inputArea, sendBtn, newChatBtn;
  var historyList, imageInput, imageLabel;
  var whiteboardImportBtn;

  // ---------- 等待 reader.js 加载 ----------
  function waitForContent() {
    if (window.contentRenderComplete) {
      initCopilot();
    } else if (window.contentRenderPromise) {
      window.contentRenderPromise.then(initCopilot).catch(function() {
        initCopilot();
      });
    } else {
      var tries = 0;
      var interval = setInterval(function() {
        if (window.contentRenderComplete || tries > 20) {
          clearInterval(interval);
          initCopilot();
        }
        tries++;
      }, 300);
    }
  }

  // ---------- 工具函数 ----------
  function getCurrentChapterText() {
    var article = document.getElementById('article-body');
    if (!article) return '';
    var h2s = article.querySelectorAll('h2');
    var target = null;
    for (var i = 0; i < h2s.length; i++) {
      var rect = h2s[i].getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        target = h2s[i];
        break;
      }
    }
    if (!target) return '';
    var text = '';
    var node = target;
    while (node) {
      if (node.tagName === 'H2' && node !== target) break;
      if (node.tagName === 'H1') break;
      text += node.textContent + '\n';
      node = node.nextElementSibling;
    }
    return text.trim();
  }

  function showToast(msg) {
    var existing = document.querySelector('.copilot-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'copilot-toast';
    toast.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.85); color: #eee; padding: 8px 20px; border-radius: 8px; font-size: 0.85rem; z-index: 9999; border: 1px solid #555; backdrop-filter: blur(4px); animation: fadeUp 0.3s ease;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(function() { toast.remove(); }, 300);
    }, 2000);
  }

  // ---------- 轮次点逻辑 ----------
  function updateDots() {
    if (!dotsContainer) return;
    var totalRounds = 0;
    for (var i = 0; i < messageHistory.length; i++) {
      if (messageHistory[i].role === 'user') totalRounds++;
    }
    var displayCount = Math.min(totalRounds, MAX_DOTS);
    var startIndex = Math.max(0, totalRounds - MAX_DOTS);

    dotsContainer.innerHTML = '';
    dotElements = [];

    for (var j = 0; j < displayCount; j++) {
      var dot = document.createElement('div');
      dot.className = 'copilot-dot';
      var roundIndex = startIndex + j;
      dot.dataset.round = roundIndex;
      if (j === displayCount - 1) {
        dot.classList.add('active');
      }
      (function(idx) {
        dot.addEventListener('click', function() {
          jumpToRound(idx);
        });
      })(roundIndex);
      dotsContainer.appendChild(dot);
      dotElements.push(dot);
    }
  }

  function jumpToRound(roundIndex) {
    var userCount = -1;
    var targetMsg = null;
    var allMsgs = messagesContainer.querySelectorAll('.copilot-msg');
    for (var i = 0; i < allMsgs.length; i++) {
      if (allMsgs[i].classList.contains('copilot-msg-user')) {
        userCount++;
        if (userCount === roundIndex) {
          targetMsg = allMsgs[i];
          break;
        }
      }
    }
    if (targetMsg) {
      targetMsg.scrollIntoView({ block: 'center', behavior: 'smooth' });
      var totalRounds = 0;
      for (var j = 0; j < messageHistory.length; j++) {
        if (messageHistory[j].role === 'user') totalRounds++;
      }
      var startIndex = Math.max(0, totalRounds - MAX_DOTS);
      for (var k = 0; k < dotElements.length; k++) {
        var idx = k;
        dotElements[k].classList.toggle('active', idx === roundIndex - startIndex);
      }
    }
  }

  // ---------- 渲染消息 ----------
  function appendMessage(role, content, image) {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'copilot-msg copilot-msg-' + role;
    if (image) {
      var img = document.createElement('img');
      img.src = image;
      img.style.maxWidth = '120px';
      img.style.borderRadius = '4px';
      img.style.marginBottom = '4px';
      msgDiv.appendChild(img);
    }
    var p = document.createElement('p');
    p.textContent = content;
    msgDiv.appendChild(p);
    messagesContainer.appendChild(msgDiv);
    if (role === 'user') {
      roundCount++;
      updateDots();
    }
  }

  function appendHistoryMessage(msg) {
    var role = msg.role;
    var content = msg.content;
    var reasoning = msg.reasoning || '';
    var msgDiv = document.createElement('div');
    msgDiv.className = 'copilot-msg copilot-msg-' + role;
    if (role === 'assistant' && reasoning) {
      var thinkingDiv = document.createElement('div');
      thinkingDiv.className = 'copilot-thinking';
      var summary = document.createElement('span');
      summary.className = 'thinking-toggle';
      summary.textContent = '思考过程';
      summary.addEventListener('click', function() {
        var contentEl = thinkingDiv.querySelector('.thinking-content');
        if (contentEl) {
          var isHidden = contentEl.style.display === 'none';
          contentEl.style.display = isHidden ? 'block' : 'none';
          summary.textContent = isHidden ? '收起' : '思考过程';
        }
      });
      var contentEl = document.createElement('div');
      contentEl.className = 'thinking-content';
      contentEl.style.display = 'none';
      contentEl.textContent = reasoning;
      thinkingDiv.appendChild(summary);
      thinkingDiv.appendChild(contentEl);
      msgDiv.appendChild(thinkingDiv);
    }
    var p = document.createElement('p');
    p.textContent = content;
    msgDiv.appendChild(p);
    messagesContainer.appendChild(msgDiv);
  }

  function showWelcome() {
    messagesContainer.innerHTML = '<div class="copilot-placeholder">有什么可以帮你的？</div>';
    roundCount = 0;
    updateDots();
  }

  // ---------- 渲染模式上拉 ----------
  function renderModeOptions() {
    var modeMap = {
      'note': '本站笔记',
      'textbook': '知识库',
      'whiteboard': '白板AI'
    };
    modeOptions.innerHTML = '';
    var keys = Object.keys(modeMap);
    for (var i = 0; i < keys.length; i++) {
      var value = keys[i];
      var label = modeMap[value];
      var div = document.createElement('div');
      div.className = 'copilot-mode-option';
      div.dataset.mode = value;
      div.textContent = label;
      if (value === currentMode) {
        div.classList.add('active');
      }
      (function(modeVal) {
        div.addEventListener('click', function() {
          currentMode = modeVal;
          modeText.textContent = modeMap[modeVal];
          closeModeDropdown();
          var opts = modeOptions.querySelectorAll('.copilot-mode-option');
          for (var j = 0; j < opts.length; j++) {
            opts[j].classList.remove('active');
          }
          div.classList.add('active');
          updateWhiteboardUI();
          updateImageUploadState();
        });
      })(value);
      modeOptions.appendChild(div);
    }
  }

  // ---------- 渲染模型下拉（分组） ----------
  function renderModelOptions() {
    modelOptions.innerHTML = '';

    for (var i = 0; i < TEXT_MODELS.length; i++) {
      var m = TEXT_MODELS[i];
      var div = document.createElement('div');
      div.className = 'copilot-model-option';
      div.dataset.model = m.id;
      div.innerHTML = '<img src="' + LOGO_BASE + m.logo + '" style="width:20px;height:20px;margin-right:8px;" /> ' + m.label;
      if (m.id === currentModel) div.classList.add('active');
      (function(modelObj) {
        div.addEventListener('click', function() {
          currentModel = modelObj.id;
          updateModelDisplay();
          closeModelDropdown();
          updateImageUploadState();
          var opts = modelOptions.querySelectorAll('.copilot-model-option');
          for (var j = 0; j < opts.length; j++) {
            opts[j].classList.remove('active');
          }
          div.classList.add('active');
        });
      })(m);
      modelOptions.appendChild(div);
    }

    var divider = document.createElement('div');
    divider.className = 'copilot-model-divider';
    modelOptions.appendChild(divider);

    var visionLabel = document.createElement('div');
    visionLabel.style.cssText = 'padding: 4px 12px; font-size:0.65rem; color:#666; user-select:none;';
    visionLabel.textContent = '— 视觉模型 —';
    modelOptions.appendChild(visionLabel);

    for (var k = 0; k < VISION_MODELS.length; k++) {
      var vm = VISION_MODELS[k];
      var vdiv = document.createElement('div');
      vdiv.className = 'copilot-model-option';
      vdiv.dataset.model = vm.id;
      vdiv.innerHTML = '<img src="' + LOGO_BASE + vm.logo + '" style="width:20px;height:20px;margin-right:8px;" /> ' + vm.label;
      if (vm.id === currentModel) vdiv.classList.add('active');
      (function(vmObj) {
        vdiv.addEventListener('click', function() {
          currentModel = vmObj.id;
          updateModelDisplay();
          closeModelDropdown();
          updateImageUploadState();
          var opts = modelOptions.querySelectorAll('.copilot-model-option');
          for (var j = 0; j < opts.length; j++) {
            opts[j].classList.remove('active');
          }
          vdiv.classList.add('active');
        });
      })(vm);
      modelOptions.appendChild(vdiv);
    }

    updateModelDisplay();
  }

  function updateModelDisplay() {
    var model = null;
    for (var i = 0; i < ALL_MODELS.length; i++) {
      if (ALL_MODELS[i].id === currentModel) {
        model = ALL_MODELS[i];
        break;
      }
    }
    if (model) {
      modelText.textContent = model.label;
      modelIcon.src = LOGO_BASE + model.logo;
      modelIcon.style.display = 'inline';
    }
  }

  // ---------- 下拉开关 ----------
  function toggleModeDropdown() {
    var isOpen = modeOptions.style.display === 'block';
    modeOptions.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) closeModelDropdown();
  }

  function closeModeDropdown() {
    modeOptions.style.display = 'none';
  }

  function toggleModelDropdown() {
    var isOpen = modelOptions.style.display === 'block';
    modelOptions.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) closeModeDropdown();
  }

  function closeModelDropdown() {
    modelOptions.style.display = 'none';
  }

  // ---------- 图片上传 ----------
  function updateImageUploadState() {
    var isVision = false;
    for (var i = 0; i < VISION_MODELS.length; i++) {
      if (VISION_MODELS[i].id === currentModel) {
        isVision = true;
        break;
      }
    }
    var enabled = isVision;
    imageInput.disabled = !enabled;
    imageLabel.style.opacity = enabled ? '1' : '0.3';
    if (!enabled) {
      currentImageBase64 = null;
      var thumb = document.querySelector('.copilot-image-thumb');
      if (thumb) thumb.remove();
      imageInput.value = '';
    }
  }

  // ---------- 白板UI ----------
  function updateWhiteboardUI() {
    if (currentMode === 'whiteboard') {
      whiteboardImportBtn.style.display = 'inline-block';
      if (whiteboardContent) {
        whiteboardImportBtn.textContent = '已导入 (' + whiteboardContent.length + ' 字)';
        whiteboardImportBtn.classList.add('active');
      } else {
        whiteboardImportBtn.textContent = '导入资料';
        whiteboardImportBtn.classList.remove('active');
      }
    } else {
      whiteboardImportBtn.style.display = 'none';
    }
  }

  function showWhiteboardPanel() {
    var existing = document.getElementById('copilot-whiteboard-panel');
    if (existing) existing.remove();

    var panel = document.createElement('div');
    panel.id = 'copilot-whiteboard-panel';
    panel.className = 'open';
    panel.innerHTML = '<textarea id="wb-textarea" placeholder="粘贴资料文本（支持 Markdown）..." style="width:100%; background:#1e1e1e; border:1px solid #555; border-radius:4px; color:#ddd; padding:6px; resize:vertical; font-family:inherit; font-size:0.85rem; min-height:80px;">' + (whiteboardContent || '') + '</textarea><div class="wb-actions"><button onclick="document.getElementById(\'wb-file-input\').click()" style="background:#333; border:1px solid #555; color:#ddd; border-radius:4px; padding:2px 10px; font-size:0.75rem; cursor:pointer;">上传 .txt</button><input type="file" id="wb-file-input" accept=".txt" style="display:none;"><button class="primary" id="wb-confirm" style="background:#555; border-color:#777; color:#ddd; border-radius:4px; padding:2px 10px; font-size:0.75rem; cursor:pointer;">确认导入</button><button id="wb-cancel" style="background:#333; border:1px solid #555; color:#ddd; border-radius:4px; padding:2px 10px; font-size:0.75rem; cursor:pointer;">取消</button><button id="wb-from-page" style="background:#333; border:1px solid #555; color:#ddd; border-radius:4px; padding:2px 10px; font-size:0.75rem; cursor:pointer;">从当前章节导入</button></div><div id="copilot-whiteboard-status" style="font-size:0.7rem; color:#888; margin-top:4px;">' + (whiteboardContent ? '已导入 ' + whiteboardContent.length + ' 字' : '未导入资料') + '</div>';

    var inputWrap = document.querySelector('.copilot-input-wrap');
    inputWrap.parentNode.insertBefore(panel, inputWrap);

    var textarea = document.getElementById('wb-textarea');

    document.getElementById('wb-confirm').addEventListener('click', function() {
      whiteboardContent = textarea.value;
      updateWhiteboardUI();
      panel.style.display = 'none';
      if (whiteboardContent) {
        showToast('资料已导入，共 ' + whiteboardContent.length + ' 字');
      }
    });

    document.getElementById('wb-cancel').addEventListener('click', function() {
      panel.style.display = 'none';
    });

    document.getElementById('wb-from-page').addEventListener('click', function() {
      var context = getCurrentChapterText();
      if (context) {
        textarea.value = context;
        document.getElementById('copilot-whiteboard-status').textContent = '已导入当前章节 ( ' + context.length + ' 字)';
        showToast('已导入当前章节内容');
      } else {
        showToast('未找到当前章节内容');
      }
    });

    document.getElementById('wb-file-input').addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        textarea.value = ev.target.result;
        document.getElementById('copilot-whiteboard-status').textContent = '已导入文件: ' + file.name + ' (' + ev.target.result.length + ' 字)';
        showToast('文件导入成功: ' + file.name);
      };
      reader.readAsText(file);
    });

    panel.style.display = 'block';
  }

  // ---------- 切换面板 ----------
  function toggleCopilotPanel() {
    var isOpen = copilotView.style.display !== 'none';
    if (isOpen) {
      copilotView.style.display = 'none';
      if (tocView) tocView.style.display = 'block';
      btnCopilot.textContent = 'Copilot';
    } else {
      copilotView.style.display = 'flex';
      if (tocView) tocView.style.display = 'none';
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

  // ---------- 发送消息 ----------
  async function sendMessage() {
    var text = inputArea.value.trim();
    if (!text && !currentImageBase64) return;
    if (!window.state || !window.state.user) {
      alert('请先登录');
      return;
    }
    if (isProcessing) return;
    isProcessing = true;
    sendBtn.disabled = true;

    var placeholder = messagesContainer.querySelector('.copilot-placeholder');
    if (placeholder) placeholder.remove();

    appendMessage('user', text, currentImageBase64);
    inputArea.value = '';
    var imgBase64 = currentImageBase64;
    currentImageBase64 = null;
    var thumb = document.querySelector('.copilot-image-thumb');
    if (thumb) thumb.remove();
    imageInput.value = '';

    var msgDiv = document.createElement('div');
    msgDiv.className = 'copilot-msg copilot-msg-assistant';
    var thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'copilot-thinking';
    thinkingDiv.style.display = 'none';
    var thinkingSummary = document.createElement('span');
    thinkingSummary.className = 'thinking-toggle';
    thinkingSummary.textContent = '思考过程';
    thinkingSummary.addEventListener('click', function() {
      var content = thinkingDiv.querySelector('.thinking-content');
      if (content) {
        var isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        thinkingSummary.textContent = isHidden ? '收起' : '思考过程';
      }
    });
    var thinkingContent = document.createElement('div');
    thinkingContent.className = 'thinking-content';
    thinkingContent.style.display = 'none';
    thinkingDiv.appendChild(thinkingSummary);
    thinkingDiv.appendChild(thinkingContent);
    var contentDiv = document.createElement('div');
    contentDiv.className = 'copilot-answer';
    msgDiv.appendChild(thinkingDiv);
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);

    var context = '';
    if (currentMode === 'note') {
      context = getCurrentChapterText();
    } else if (currentMode === 'whiteboard') {
      context = whiteboardContent || '';
    }

    var payload = {
      mode: currentMode,
      model: currentModel,
      messages: [{ role: 'user', content: text }],
      chapterContext: context,
      image: imgBase64 || undefined,
      whiteboardContext: whiteboardContent || ''
    };

    try {
      var response = await fetch(WORKER_BASE_URL + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.state.user.token
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        var err = await response.json();
        throw new Error(err.error || '请求失败');
      }

      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';
      var reasoningText = '';
      var contentText = '';

      while (true) {
        var result = await reader.read();
        if (result.done) break;
        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (line.startsWith('data: ')) {
            var data = line.slice(6);
            try {
              var parsed = JSON.parse(data);
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
            } catch (e) {
              // 忽略
            }
          }
        }
      }

      if (!reasoningText.trim()) {
        thinkingDiv.style.display = 'none';
      } else {
        thinkingContent.style.display = 'none';
        thinkingSummary.textContent = '思考过程';
      }

      var userMsg = { role: 'user', content: text };
      var assistantMsg = { role: 'assistant', content: contentText, reasoning: reasoningText };
      messageHistory.push(userMsg, assistantMsg);
      saveCurrentChat();

    } catch (err) {
      contentDiv.textContent = '错误：' + err.message;
    } finally {
      isProcessing = false;
      sendBtn.disabled = false;
    }
  }

  // ---------- 新对话 ----------
  function startNewChat() {
    messagesContainer.innerHTML = '';
    messageHistory = [];
    currentSessionId = null;
    currentImageBase64 = null;
    var thumb = document.querySelector('.copilot-image-thumb');
    if (thumb) thumb.remove();
    imageInput.value = '';
    roundCount = 0;
    updateDots();
    showWelcome();
  }

  // ---------- 历史记录 ----------
  async function loadHistoryList() {
    if (!window.state || !window.state.user) return;
    try {
      var res = await fetch(WORKER_BASE_URL + '/api/history', {
        headers: { 'Authorization': 'Bearer ' + window.state.user.token }
      });
      if (!res.ok) throw new Error('load history failed');
      var list = await res.json();
      historyList.innerHTML = '';
      if (list.length === 0) {
        historyList.innerHTML = '<div class="copilot-history-empty">暂无历史</div>';
        return;
      }
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var div = document.createElement('div');
        div.className = 'copilot-history-item';
        div.textContent = item.title || '未命名对话';
        div.dataset.id = item.id;
        (function(id) {
          div.addEventListener('click', function() {
            loadHistoryItem(id);
          });
        })(item.id);
        var del = document.createElement('span');
        del.className = 'copilot-history-delete';
        del.textContent = '×';
        (function(id) {
          del.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteHistoryItem(id);
          });
        })(item.id);
        div.appendChild(del);
        historyList.appendChild(div);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadHistoryItem(id) {
    if (!window.state || !window.state.user) return;
    try {
      var res = await fetch(WORKER_BASE_URL + '/api/history/' + id, {
        headers: { 'Authorization': 'Bearer ' + window.state.user.token }
      });
      if (!res.ok) throw new Error('load detail failed');
      var data = await res.json();
      if (data.messages) {
        messagesContainer.innerHTML = '';
        for (var i = 0; i < data.messages.length; i++) {
          appendHistoryMessage(data.messages[i]);
        }
        messageHistory = data.messages;
        currentSessionId = id;
        var totalRounds = 0;
        for (var j = 0; j < messageHistory.length; j++) {
          if (messageHistory[j].role === 'user') totalRounds++;
        }
        roundCount = totalRounds;
        updateDots();
        var placeholder = messagesContainer.querySelector('.copilot-placeholder');
        if (placeholder) placeholder.remove();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function saveCurrentChat() {
    if (!window.state || !window.state.user || messageHistory.length < 2) return;
    var title = messageHistory[0]?.content?.slice(0, 30) || '新对话';
    try {
      await fetch(WORKER_BASE_URL + '/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.state.user.token
        },
        body: JSON.stringify({ messages: messageHistory, title: title })
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
      await fetch(WORKER_BASE_URL + '/api/history/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + window.state.user.token }
      });
      loadHistoryList();
    } catch (e) {
      console.error(e);
    }
  }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    btnCopilot.addEventListener('click', toggleCopilotPanel);

    sendBtn.addEventListener('click', sendMessage);
    inputArea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    newChatBtn.addEventListener('click', startNewChat);

    modeDisplay.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleModeDropdown();
    });

    modelDisplay.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleModelDropdown();
    });

    document.addEventListener('click', function() {
      closeModeDropdown();
      closeModelDropdown();
    });

    imageInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        currentImageBase64 = ev.target.result;
        var thumb = document.createElement('div');
        thumb.className = 'copilot-image-thumb';
        thumb.innerHTML = '<img src="' + currentImageBase64 + '" style="max-width:60px;max-height:60px;border-radius:4px;" />';
        var wrap = inputArea.closest('.copilot-input-wrap');
        var existing = wrap.querySelector('.copilot-image-thumb');
        if (existing) existing.remove();
        wrap.insertBefore(thumb, inputArea);
      };
      reader.readAsDataURL(file);
    });

    whiteboardImportBtn.addEventListener('click', showWhiteboardPanel);

    messagesWrapper.addEventListener('scroll', function() {
      var msgs = messagesContainer.querySelectorAll('.copilot-msg-user');
      var wrapperRect = messagesWrapper.getBoundingClientRect();
      var centerY = wrapperRect.top + wrapperRect.height / 2;
      var centerIndex = -1;
      var closestDist = Infinity;
      for (var i = 0; i < msgs.length; i++) {
        var rect = msgs[i].getBoundingClientRect();
        var msgCenter = rect.top + rect.height / 2;
        var dist = Math.abs(msgCenter - centerY);
        if (dist < closestDist) {
          closestDist = dist;
          centerIndex = i;
        }
      }
      if (centerIndex >= 0) {
        var totalRounds = 0;
        for (var j = 0; j < messageHistory.length; j++) {
          if (messageHistory[j].role === 'user') totalRounds++;
        }
        var startIndex = Math.max(0, totalRounds - MAX_DOTS);
        for (var k = 0; k < dotElements.length; k++) {
          dotElements[k].classList.toggle('active', k === centerIndex - startIndex);
        }
      }
    });
  }

  // ---------- 实际初始化 ----------
  function initCopilot() {
    btnCopilot = document.getElementById('btn-copilot');
    copilotView = document.getElementById('sidebar-copilot-view');
    if (!btnCopilot || !copilotView) {
      console.warn('Copilot DOM elements not found');
      return;
    }

    tocView = document.getElementById('sidebar-toc-view');
    modeDisplay = document.getElementById('copilot-mode-display');
    modeText = document.getElementById('copilot-mode-text');
    modeOptions = document.getElementById('copilot-mode-options');
    modelDisplay = document.getElementById('copilot-model-display');
    modelText = document.getElementById('copilot-model-text');
    modelIcon = document.getElementById('copilot-model-icon');
    modelOptions = document.getElementById('copilot-model-options');
    messagesWrapper = document.getElementById('copilot-messages-wrapper');
    messagesContainer = document.getElementById('copilot-messages');
    dotsContainer = document.getElementById('copilot-dots');
    inputArea = document.getElementById('copilot-input');
    sendBtn = document.getElementById('copilot-send');
    newChatBtn = document.getElementById('copilot-new-chat');
    historyList = document.getElementById('copilot-history-list');
    imageInput = document.getElementById('copilot-image-input');
    imageLabel = document.getElementById('copilot-image-label');
    whiteboardImportBtn = document.getElementById('copilot-whiteboard-import');

    renderModeOptions();
    renderModelOptions();
    bindEvents();
    loadHistoryList();

    modeText.textContent = '本站笔记';
    var opts = modeOptions.querySelectorAll('.copilot-mode-option');
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].dataset.mode === 'note') {
        opts[i].classList.add('active');
      }
    }

    updateImageUploadState();
    updateWhiteboardUI();

    if (window.state && window.state.user) {
      showWelcome();
    } else {
      messagesContainer.innerHTML = '<div class="copilot-placeholder">请先登录（使用评论区登录）</div>';
    }

    updateDots();
  }

  // ---------- 启动 ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForContent);
  } else {
    waitForContent();
  }

})();
