/* IWP Copilot - independent auth, same DOM/CSS contract. */
(function () {
  'use strict';
  const API = 'https://copilot.2167964516.workers.dev';
  const LOGO = 'images/copilot/';
  const ADMIN = 'loading';
  const TEXT = [
    ['nvidia/nemotron-3-super-120b-a12b','NVIDIA 3 super','1.png'],
    ['nvidia/nemotron-3-ultra-550b-a55b','NVIDIA 3 ultra','1.png'],
    ['meta/llama-3.3-70b-instruct','Meta 3.3','2.png'],
    ['nvidia/gpt-oss-120b','ChatGPT','3.png'],
    ['nvidia/gpt-oss-20b','CatGPT','3.png'],
    ['minimaxai/minimax-m3','MiniMax M3','5.png'],
    ['deepseek-ai/deepseek-v4-flash-0731','DeepSeek V4','6.png'],
    ['z-ai/glm-5.2','GLM 5.2','7.png'],
    ['google/gemma-4-31b-it','Google Gemma 4','4.png']
  ];
  const VISION = [['meta/llama-3.2-90b-vision-instruct','Meta 3.3 视觉','2.png']];
  const ALL = TEXT.concat(VISION);
  let mode='note', model=ALL[0][0], image=null, history=[], sessionId=null, busy=false, whiteboard='';
  let els={};

  const $ = id => document.getElementById(id);
  const user = () => window.SiteAuth && window.SiteAuth.getUser();
  const token = () => window.SiteAuth && window.SiteAuth.getToken();
  const toast = msg => { let x=document.querySelector('.copilot-toast'); if(x)x.remove(); x=document.createElement('div'); x.className='copilot-toast'; x.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#eee;padding:8px 20px;border-radius:8px;font-size:.85rem;z-index:9999;border:1px solid #555;'; x.textContent=msg; document.body.appendChild(x); setTimeout(()=>x.remove(),2200); };

  function contextText(){
    const a=$('article-body'); if(!a)return '';
    const hs=a.querySelectorAll('h2'); let target=null;
    for(const h of hs){const r=h.getBoundingClientRect(); if(r.top<innerHeight&&r.bottom>0){target=h;break;}}
    if(!target)return '';
    let s='', n=target; while(n){if(n!==target&&n.tagName==='H2')break;if(n.tagName==='H1')break;s+=n.textContent+'\n';n=n.nextElementSibling;} return s.trim();
  }
  function renderMessage(m){
    const d=document.createElement('div'); d.className='copilot-msg copilot-msg-'+m.role;
    if(m.image){const img=document.createElement('img');img.src=m.image;img.style.cssText='max-width:120px;border-radius:4px;margin-bottom:4px;';d.appendChild(img);}
    if(m.role==='assistant'&&m.reasoning){const t=document.createElement('div');t.className='copilot-thinking';const s=document.createElement('span');s.className='thinking-toggle';s.textContent='思考过程';const c=document.createElement('div');c.className='thinking-content';c.style.display='none';c.textContent=m.reasoning;s.onclick=()=>{const hide=c.style.display==='none';c.style.display=hide?'block':'none';s.textContent=hide?'收起':'思考过程';};t.append(s,c);d.appendChild(t);}
    const p=document.createElement('p');p.textContent=m.content||'';d.appendChild(p);els.messages.appendChild(d);
  }
  function redraw(){els.messages.innerHTML='';if(!history.length){els.messages.innerHTML='<div class="copilot-placeholder">'+(user()&&user().username===ADMIN?'✨ 管理员模式 - ':'')+'有什么可以帮你的？</div>'; }else history.forEach(renderMessage); els.messages.scrollTop=els.messages.scrollHeight; dots();}
  function dots(){ if(!els.dots)return; const n=history.filter(x=>x.role==='user').length; els.dots.innerHTML=''; const start=Math.max(0,n-10); for(let i=start;i<n;i++){const d=document.createElement('div');d.className='copilot-dot'+(i===n-1?' active':'');d.dataset.round=i;d.onclick=()=>{const ms=els.messages.querySelectorAll('.copilot-msg-user');if(ms[i])ms[i].scrollIntoView({behavior:'smooth',block:'center'});};els.dots.appendChild(d);} }

  function renderModes(){
    const map={note:'本站笔记',textbook:'知识库',whiteboard:'白板AI'}; els.modeOptions.innerHTML=''; Object.entries(map).forEach(([k,v])=>{const d=document.createElement('div');d.className='copilot-mode-option'+(k===mode?' active':'');d.dataset.mode=k;d.textContent=v;d.onclick=()=>{mode=k;els.modeText.textContent=v;els.modeOptions.style.display='none';renderModes();updateImage();updateWhiteboard();};els.modeOptions.appendChild(d);});els.modeText.textContent=map[mode];
  }
  function renderModels(){
    els.modelOptions.innerHTML=''; TEXT.forEach(addModel); const sep=document.createElement('div');sep.className='copilot-model-divider';els.modelOptions.appendChild(sep);const lab=document.createElement('div');lab.style.cssText='padding:4px 12px;font-size:.65rem;color:#666;user-select:none;';lab.textContent='— 视觉模型 —';els.modelOptions.appendChild(lab);VISION.forEach(addModel);showModel();
    function addModel(m){const d=document.createElement('div');d.className='copilot-model-option'+(m[0]===model?' active':'');d.dataset.model=m[0];d.innerHTML='<img src="'+LOGO+m[2]+'" style="width:20px;height:20px;margin-right:8px;" /> '+m[1];d.onclick=()=>{model=m[0];showModel();els.modelOptions.style.display='none';renderModels();updateImage();};els.modelOptions.appendChild(d);}
  }
  function showModel(){const m=ALL.find(x=>x[0]===model);if(m){els.modelText.textContent=m[1];els.modelIcon.src=LOGO+m[2];els.modelIcon.style.display='inline';}}
  function updateImage(){const vision=VISION.some(x=>x[0]===model);els.imageInput.disabled=!vision;els.imageLabel.style.opacity=vision?'1':'.3';if(!vision){image=null;els.imageInput.value='';const t=document.querySelector('.copilot-image-thumb');if(t)t.remove();}}
  function updateWhiteboard(){els.whiteboardImport.style.display=mode==='whiteboard'?'inline-block':'none';}

  function whiteboardPanel(){
    let old=$('copilot-whiteboard-panel');if(old){old.style.display=old.style.display==='none'?'block':'none';return;}
    const p=document.createElement('div');p.id='copilot-whiteboard-panel';p.className='open';p.innerHTML='<textarea id="wb-textarea" placeholder="粘贴资料文本（支持 Markdown）..." style="width:100%;background:#1e1e1e;border:1px solid #555;border-radius:4px;color:#ddd;padding:6px;resize:vertical;font-family:inherit;font-size:.85rem;min-height:80px;"></textarea><div class="wb-actions"><button id="wb-file" style="background:#333;border:1px solid #555;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">上传 .txt</button><input type="file" id="wb-file-input" accept=".txt" style="display:none"><button id="wb-confirm" style="background:#555;border:1px solid #777;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">确认导入</button><button id="wb-cancel" style="background:#333;border:1px solid #555;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">取消</button><button id="wb-from-page" style="background:#333;border:1px solid #555;color:#ddd;border-radius:4px;padding:2px 10px;font-size:.75rem;cursor:pointer;">从当前章节导入</button></div><div id="copilot-whiteboard-status" style="font-size:.7rem;color:#888;margin-top:4px;"></div>';
    els.inputWrap.parentNode.insertBefore(p,els.inputWrap);const ta=$('wb-textarea');ta.value=whiteboard;$('wb-file').onclick=()=> $('wb-file-input').click();$('wb-file-input').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{ta.value=r.result;$('copilot-whiteboard-status').textContent='已导入文件: '+f.name+' ('+r.result.length+' 字)';};r.readAsText(f);};$('wb-from-page').onclick=()=>{const x=contextText();if(x){ta.value=x;toast('已导入当前章节内容');}else toast('未找到当前章节内容');};$('wb-confirm').onclick=()=>{whiteboard=ta.value;updateWhiteboard();p.style.display='none';toast('资料已导入，共 '+whiteboard.length+' 字');};$('wb-cancel').onclick=()=>p.style.display='none';
  }

  async function loadList(){
    if(!token())return; try{const list=await window.SiteAuth.request('/api/history');els.history.innerHTML='';(list||[]).forEach(x=>{const d=document.createElement('div');d.className='copilot-history-item';d.dataset.id=x.id;d.textContent=x.title||'新对话';d.onclick=()=>loadSession(x.id);els.history.appendChild(d);});}catch(e){console.warn(e);}
  }
  async function loadSession(id){try{const r=await window.SiteAuth.request('/api/history/'+encodeURIComponent(id));sessionId=id;history=Array.isArray(r.messages)?r.messages:[];redraw();}catch(e){toast('历史记录加载失败：'+e.message);}}
  async function save(){if(!token()||!history.length)return;try{if(sessionId){await window.SiteAuth.request('/api/history/'+encodeURIComponent(sessionId),{method:'PUT',body:{messages:history,title:(history.find(x=>x.role==='user')||{}).content?.slice(0,30)||'新对话'}});}else{const r=await window.SiteAuth.request('/api/history',{method:'POST',body:{messages:history,title:(history.find(x=>x.role==='user')||{}).content?.slice(0,30)||'新对话'}});sessionId=r.id;}await loadList();}catch(e){console.warn('save history',e);}}

  async function send(){
    if(busy)return;const A=window.SiteAuth;if(!A||!A.getUser()){toast('请先登录');return;}
    const text=els.input.value.trim();if(!text&&!image)return;busy=true;els.send.disabled=true;
    const userMsg={role:'user',content:text||'请分析这张图片',image:image};history.push(userMsg);redraw();els.input.value='';const img=image;image=null;updateImage();
    const assistant={role:'assistant',content:'',reasoning:''};history.push(assistant);redraw();
    try{
      const msgs=history.filter((x,i)=>i<history.length-1).map(x=>({role:x.role,content:x.content}));
      const body={mode,model,messages:msgs.concat([{role:'user',content:text||'请分析这张图片'}]),chapterContext:contextText(),whiteboardContext:whiteboard};if(img)body.image=img;
      const res=await fetch(API+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+A.getToken()},body:JSON.stringify(body)});
      if(!res.ok){let e={};try{e=await res.json();}catch(_){}throw new Error(e.error||('HTTP '+res.status));}
      const reader=res.body.getReader(),dec=new TextDecoder();let buf='';
      while(true){const q=await reader.read();if(q.done)break;buf+=dec.decode(q.value,{stream:true});const lines=buf.split('\n');buf=lines.pop()||'';for(const line of lines){if(!line.startsWith('data:'))continue;const raw=line.slice(5).trim();if(!raw)continue;try{const x=JSON.parse(raw);if(x.type==='content')assistant.content+=x.text||'';else if(x.type==='reasoning')assistant.reasoning+=x.text||'';redraw();}catch(_){} }}
      await save();
    }catch(e){history.pop();assistant.content='错误：'+e.message;history.push(assistant);redraw();}
    finally{busy=false;els.send.disabled=false;els.input.focus();}
  }

  function newChat(){sessionId=null;history=[];image=null;whiteboard='';if(els.input)els.input.value='';redraw();updateImage();}
  function bind(){
    els.btn.onclick=()=>{els.copilot.style.display='block';if(els.toc)els.toc.style.display='none';};
    els.modeDisplay.onclick=()=>{els.modeOptions.style.display=els.modeOptions.style.display==='block'?'none':'block';els.modelOptions.style.display='none';};
    els.modelDisplay.onclick=()=>{els.modelOptions.style.display=els.modelOptions.style.display==='block'?'none':'block';els.modeOptions.style.display='none';};
    document.addEventListener('click',e=>{if(!e.target.closest('.copilot-mode-display')&&!e.target.closest('#copilot-mode-options'))els.modeOptions.style.display='none';if(!e.target.closest('.copilot-model-display')&&!e.target.closest('#copilot-model-options'))els.modelOptions.style.display='none';});
    els.send.onclick=send;els.input.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))send();});els.newChat.onclick=newChat;els.imageInput.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{image=r.result;let old=document.querySelector('.copilot-image-thumb');if(old)old.remove();const im=document.createElement('img');im.className='copilot-image-thumb';im.src=image;im.style.cssText='max-width:80px;max-height:60px;border-radius:4px;margin:4px;';els.input.parentNode.insertBefore(im,els.input);};r.readAsDataURL(f);};els.whiteboardImport.onclick=whiteboardPanel;
    window.addEventListener('iwp-auth-changed',()=>{if(!token()){newChat();}else loadList();});
  }
  function init(){
    els={btn:$('btn-copilot'),copilot:$('sidebar-copilot-view'),toc:$('sidebar-toc-view'),modeDisplay:$('copilot-mode-display'),modeText:$('copilot-mode-text'),modeOptions:$('copilot-mode-options'),modelDisplay:$('copilot-model-display'),modelText:$('copilot-model-text'),modelIcon:$('copilot-model-icon'),modelOptions:$('copilot-model-options'),messages:$('copilot-messages'),dots:$('copilot-dots'),input:$('copilot-input'),send:$('copilot-send'),newChat:$('copilot-new-chat'),history:$('copilot-history-list'),imageInput:$('copilot-image-input'),imageLabel:$('copilot-image-label'),whiteboardImport:$('copilot-whiteboard-import'),inputWrap:document.querySelector('.copilot-input-wrap')};
    if(!els.btn||!els.copilot||!els.messages)return;renderModes();renderModels();updateImage();updateWhiteboard();bind();redraw();loadList();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
