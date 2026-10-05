const content=document.getElementById("content");
const pageTitle=document.getElementById("page-title");
const pageName=document.getElementById("page-name");
const state={view:"overview",selectedQuestion:56,answers:{56:["A","C"],57:["B"],58:[],59:["A","D"],60:["C"]},time:3128};

const exams=[
["2026 联赛模拟卷 07","进行中","42 / 48 人","01:18:32","96.4%"],
["细胞板块专项训练","已结束","48 / 48 人","01:20:00","82.7%"],
["跨校联合模拟 · 秋季","已结束","126 / 132 人","01:30:00","79.3%"],
["论文阅读训练 03","已结束","31 / 34 人","00:55:00","86.1%"]
];
const questions=[
["011-056","细胞信号转导","综合","0.82","含图片、OCR、解析"],
["011-057","膜蛋白运输与定位","基础","0.36","已发布"],
["011-058","代谢调控","板块","0.57","已发布"],
["011-059","论文图表阅读","论文","0.91","含讨论"],
["011-060","群体遗传","综合","0.76","待补解析"],
["011-061","植物激素","基础","0.28","已发布"]
];

function overview(){
return `<div class="view-head"><div><h2>今日概览</h2><p>把考试、题库与学生表现压缩到一个工作面。</p></div><div class="actions"><button class="secondary" onclick="openView('results')">查看成绩</button><button class="primary" onclick="openView('exams')">进入考试</button></div></div>
<div class="stats">
<div class="stat"><div class="stat-top">本周考试 <span>07</span></div><div class="stat-value">12</div><div class="stat-note">较上周 +3 场</div></div>
<div class="stat"><div class="stat-top">活跃学生 <span>01</span></div><div class="stat-value">48</div><div class="stat-note">本周提交率 93.8%</div></div>
<div class="stat"><div class="stat-top">题库总量 <span>03</span></div><div class="stat-value">2,846</div><div class="stat-note">本月新增 126 题</div></div>
<div class="stat"><div class="stat-top">平均得分 <span>04</span></div><div class="stat-value">81.6</div><div class="stat-note">较上周期 +4.2</div></div>
</div>
<div class="grid-2">
<div class="panel"><div class="panel-title"><h3>近期考试</h3><a href="#" onclick="openView('exams');return false">全部考试</a></div><div class="activity">${exams.slice(0,4).map((e,i)=>`<div class="activity-row"><span class="date">10/${5-i}</span><div><strong>${e[0]}</strong><small>${e[1]} · ${e[2]}</small></div><span class="score">${e[4]}</span></div>`).join("")}</div></div>
<div class="panel"><div class="panel-title"><h3>成绩趋势</h3><span class="tag">近 8 周</span></div><div class="mini-bars">${[54,62,58,71,69,77,75,82].map((v,i)=>`<div class="bar-wrap"><div class="bar" style="height:${v}%"></div><span class="bar-label">W${i+1}</span></div>`).join("")}</div></div>
</div>
<div class="panel" style="margin-top:14px"><div class="panel-title"><h3>需要关注</h3><span class="tag">3 项</span></div><div class="activity-row"><span class="date">高优先</span><div><strong>011-059 论文图表阅读</strong><small>6 名学生连续两次答错；建议补充图表解读训练。</small></div><button class="secondary" onclick="openView('questions')">处理</button></div><div class="activity-row"><span class="date">版本</span><div><strong>跨校联合模拟 · 秋季</strong><small>已有新版答案键 v3，可发布为当前计分版本。</small></div><button class="secondary" onclick="openView('results')">查看</button></div></div>`;
}

function examsView(){
return `<div class="view-head"><div><h2>考试</h2><p>统一管理普通考试、实时答题与跨校联考。</p></div><div class="actions"><button class="secondary" onclick="openView('schools')">跨校联合</button><button class="primary" onclick="startExam()">新建考试</button></div></div>
<div class="table-wrap"><table><thead><tr><th>考试</th><th>状态</th><th>参与</th><th>时长</th><th>平均得分</th><th>操作</th></tr></thead><tbody>${exams.map((e,i)=>`<tr><td><strong>${e[0]}</strong><div class="muted">Paper 011 · 2026-10-0${5-i}</div></td><td><span class="status ${i===0?"live":"done"}">${e[1]}</span></td><td>${e[2]}</td><td>${e[3]}</td><td><strong>${e[4]}</strong></td><td><button class="secondary" onclick="${i===0?"startExam()":"openView('results')"}">${i===0?"进入工作台":"查看成绩"}</button></td></tr>`).join("")}</tbody></table></div>
<div class="grid-2"><div class="panel"><div class="panel-title"><h3>实时答题设计</h3><span class="tag">离线优先</span></div><p class="muted" style="line-height:1.8">学生端采用文档阅读器 + 答题卡。答案先写入本地存储，再后台同步；断网不暂停考试，恢复网络后自动上传。截止时间到达后答案锁定。</p></div><div class="panel"><div class="panel-title"><h3>答案键</h3><span class="tag">可延后 1000 天</span></div><p class="muted" style="line-height:1.8">答案键可以考前、考中或考后发布。每次答案键或评分规则变化都会生成不可覆盖的版本。</p></div></div>`;
}

function examView(){
const qs=[56,57,58,59,60,61,62,63,64];
return `<div class="view-head"><div><h2>2026 联赛模拟卷 07</h2><p>实时考试工作台 · 不定项选择 · 48 人在线</p></div><div class="actions"><span class="tag">本地已保存 · 后台同步</span></div></div>
<div class="exam-layout"><section class="reader"><div class="reader-head"><strong>Paper 011 · Biology Competition</strong><div class="reader-tools"><button class="tool">−</button><button class="tool">100%</button><button class="tool">+</button><button class="tool">笔</button></div></div><div class="paper"><article class="paper-page"><h2>第 56 题</h2><p class="q">某研究者观察一类真核细胞在不同信号分子处理条件下的响应。根据实验结果和下图所示通路，判断下列陈述中正确的是：</p><p class="option">A. 受体激活后可引起下游蛋白磷酸化状态改变</p><p class="option">B. 该过程必然依赖细胞核内的转录</p><p class="option annotation">C. 第二信使的局部浓度变化可产生空间特异性</p><p class="option">D. 所有信号通路均共享同一终端效应器</p><div style="margin-top:55px;border:1px dashed #d6d7d3;border-radius:10px;padding:22px;text-align:center;color:#8b8e88;font-size:11px">题图区域 · 可在此使用画笔、标记与自由批注</div><p class="q">材料提示：部分选项需要结合题图与实验条件共同判断。请在右侧答题卡中选择全部正确选项。</p></article></div></section>
<aside class="answer-sheet"><div class="sheet-head"><strong>答题卡</strong><span class="timer" id="timer">52:08</span></div><div class="sheet-body"><div class="save-state">离线保护已开启 · 答案实时写入本机</div>${qs.map(q=>answerRow(q)).join("")}</div><div class="submit-bar"><button class="primary" onclick="submitExam()">提交试卷</button></div></aside></div>`;
}
function answerRow(q){
const selected=state.answers[q]||[];
return `<div class="answer-row ${q===state.selectedQuestion?"is-active":""}" onclick="state.selectedQuestion=${q};openView('exam')"><div class="answer-row-head"><strong>${q}</strong><span>${selected.length?selected.join("、"):"未作答"}</span></div><div class="choices">${["A","B","C","D"].map(c=>`<button class="choice ${selected.includes(c)?"selected":""}" onclick="event.stopPropagation();toggleAnswer(${q},'${c}')">${c}</button>`).join("")}</div></div>`;
}
function toggleAnswer(q,c){state.answers[q]=state.answers[q]||[];const a=state.answers[q],i=a.indexOf(c);i>=0?a.splice(i,1):a.push(c);openView("exam")}
function submitExam(){if(confirm("确认提交？提交后答案将不可修改。"))alert("已提交。当前网络状态下会继续完成服务端确认。")}

function questionsView(){
return `<div class="view-head"><div><h2>全球题库</h2><p>题目独立于学校与考试，OCR、解析和讨论长期沉淀。</p></div><div class="actions"><button class="secondary">导入题目</button><button class="primary">新建题目</button></div></div><div class="question-grid">${questions.map(q=>`<article class="card question-card"><div class="meta"><span class="tag">${q[0]}</span><span class="tag">${q[2]}</span></div><h3>${q[1]}</h3><p>难度系数 <span class="difficulty">${q[3]}</span> · ${q[4]}</p><div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center"><span class="muted">OCR · 解析 · 讨论</span><button class="secondary" onclick="openView('discussion')">打开</button></div></article>`).join("")}</div>`;
}

function studentsView(){
return `<div class="view-head"><div><h2>学生</h2><p>学校内学生可完整查看；跨校联考按学校展示外校成绩，不展示外校学生姓名。</p></div><button class="primary">添加学生</button></div><div class="table-wrap"><table><thead><tr><th>学生</th><th>训练阶段</th><th>近 30 天</th><th>平均得分</th><th>薄弱板块</th><th>操作</th></tr></thead><tbody>${[["陈同学","联赛组","18 场","88.4","论文阅读"],["周同学","进阶组","15 场","84.7","遗传与进化"],["许同学","基础组","12 场","79.3","植物生理"],["赵同学","联赛组","21 场","91.1","群体遗传"]].map(r=>`<tr>${r.map((x,j)=>`<td>${j===0?"<strong>"+x+"</strong>":x}</td>`).join("")}<td><button class="secondary" onclick="openView('results')">分析</button></td></tr>`).join("")}</tbody></table></div>`;
}

function resultsView(){
return `<div class="view-head"><div><h2>成绩与版本</h2><p>B3 版本模型：历史成绩永不覆盖，新答案键或评分规则生成新版本，可显式指定当前版本。</p></div><div class="actions"><button class="secondary">导出明细</button><button class="primary">生成分析</button></div></div>
<div class="grid-2"><div class="panel"><div class="panel-title"><h3>评分版本</h3><span class="tag">当前 v3</span></div><div class="version-list">${[["v3","2026-10-05 20:42","新版答案键 + 评分规则 B","当前"],["v2","2026-09-28 18:10","旧答案键","历史"],["v1","2026-09-20 12:04","首次发布","历史"]].map((v,i)=>`<div class="version ${i===0?"current":""}"><div><strong>${v[0]}</strong><small>${v[1]} · ${v[2]}</small></div><span class="mark">${v[3]}</span></div>`).join("")}</div></div>
<div class="panel"><div class="panel-title"><h3>题目明细</h3><span class="tag">陈同学 · v3</span></div><div class="table-wrap"><table><thead><tr><th>题号</th><th>作答</th><th>正确答案</th><th>结果</th><th>得分</th></tr></thead><tbody>${[["56","A,C","A,C","正确","2.0"],["57","B","B,D","错误","0"],["58","A,D","A,D","正确","2.0"],["59","C","A,C,D","错误","0"],["60","A,C","A,C","正确","2.0"]].map(r=>`<tr>${r.map((x,j)=>`<td class="${j===3&&x==="错误"?"muted":""}">${j===0?"<strong>"+x+"</strong>":x}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div></div>
<div class="panel" style="margin-top:14px"><div class="panel-title"><h3>跨校联合模拟 · 秋季</h3><span class="tag">方案 B</span></div><div class="table-wrap"><table><thead><tr><th>排名</th><th>学校</th><th>成绩</th><th>完成度</th><th>备注</th></tr></thead><tbody><tr><td>01</td><td><strong>汇智生物竞赛中心</strong></td><td>91.8</td><td>100%</td><td>本校学生可见姓名</td></tr><tr><td>02</td><td><strong>北斗学友</strong></td><td>89.7</td><td>98%</td><td>外校仅展示学校</td></tr><tr><td>03</td><td><strong>质心教育</strong></td><td>87.9</td><td>96%</td><td>外校仅展示学校</td></tr></tbody></table></div></div>`;
}

function discussionView(){
return `<div class="view-head"><div><h2>题目讨论</h2><p>讨论挂在全球 Question 上，身份实名展示；教练可管理评论。</p></div><button class="primary">写新评论</button></div><div class="discussion"><div class="panel"><div class="panel-title"><h3>011-059 · 论文图表阅读</h3><span class="tag">4 条讨论</span></div>${[["林教练","教练","这里的关键不是记忆结论，而是先判断实验变量的因果方向。"],["陈同学","学生","我对图 2 的纵坐标理解有偏差，重新看材料后发现是相对表达量。"],["周同学","学生","第三个选项为什么不能成立？我感觉它和图 3 的结果一致。"],["林教练","教练","第三项把相关关系直接等同于机制，题干没有提供足够证据。"]].map(c=>`<div class="comment"><div class="comment-head"><strong>${c[0]} <small>· ${c[1]}</small></strong><small>10 月 5 日</small></div><p>${c[2]}</p><div class="moderation">可见 · 教练可隐藏/恢复</div></div>`).join("")}</div><div class="panel"><div class="panel-title"><h3>题目资料</h3></div><div class="detail-grid" style="grid-template-columns:1fr"><div class="detail"><span>来源</span><strong>联赛题目</strong></div><div class="detail"><span>类型</span><strong>论文</strong></div><div class="detail"><span>难度系数</span><strong>0.91</strong></div><div class="detail"><span>OCR</span><strong>已上传</strong></div><div class="detail"><span>解析</span><strong>已发布</strong></div></div></div></div>`;
}

function schoolsView(){
return `<div class="view-head"><div><h2>学校与联考</h2><p>主教练创建跨校联合考试；外校成绩展示学校，不展示学生姓名。</p></div><button class="primary">创建联考</button></div><div class="stats"><div class="stat"><div class="stat-top">已连接学校</div><div class="stat-value">06</div><div class="stat-note">共享题库与联考空间</div></div><div class="stat"><div class="stat-top">联考场次</div><div class="stat-value">09</div><div class="stat-note">本学期</div></div><div class="stat"><div class="stat-top">参赛学生</div><div class="stat-value">312</div><div class="stat-note">累计去重</div></div><div class="stat"><div class="stat-top">当前联考</div><div class="stat-value">01</div><div class="stat-note">秋季联合模拟</div></div></div><div class="panel" style="margin-top:14px"><div class="panel-title"><h3>学校</h3><button class="secondary">管理学校</button></div><div class="table-wrap"><table><thead><tr><th>学校</th><th>身份</th><th>学生数</th><th>联考权限</th><th>状态</th></tr></thead><tbody>${[["汇智生物竞赛中心","主教练学校","48","全部","正常"],["北斗学友","合作学校","61","联考","正常"],["质心教育","合作学校","83","联考","正常"],["愿程","合作学校","54","联考","正常"]].map(r=>`<tr>${r.map((x,j)=>`<td>${j===0?"<strong>"+x+"</strong>":x}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
}
function settingsView(){
return `<div class="view-head"><div><h2>设置</h2><p>账号、学校与数据策略。</p></div><button class="primary">保存更改</button></div><div class="panel profile-card"><div class="avatar-lg">林</div><div><h2 style="margin:0 0 18px;font-size:18px">林教练</h2><div class="detail-grid"><div class="detail"><span>角色</span><strong>Coach</strong></div><div class="detail"><span>学校</span><strong>汇智生物竞赛中心</strong></div><div class="detail"><span>账号状态</span><strong>已验证</strong></div></div></div></div>`;
}

const views={overview,exams:examsView,exam:examView,questions:questionsView,students:studentsView,results:resultsView,discussion:discussionView,schools:schoolsView,settings:settingsView};
function openView(view){state.view=view;document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));const names={overview:"总览",exams:"考试",questions:"题库",students:"学生",results:"成绩与版本",discussion:"讨论",schools:"学校与联考",settings:"设置",exam:"实时考试"};pageName.textContent=names[view]||"工作台";pageTitle.textContent=view==="exam"?"正在进行 · 2026 联赛模拟卷 07":"训练与考试，一处完成";content.innerHTML=views[view]();window.scrollTo(0,0)}
function startExam(){openView("exam")}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>openView(b.dataset.view)));
document.getElementById("new-exam").addEventListener("click",startExam);
openView("overview");


// --- Live API bridge -------------------------------------------------
const MIL_LOCAL = "mil_exam_state_v2";
const milStore = JSON.parse(localStorage.getItem(MIL_LOCAL) || "{}");
function milPersist(){localStorage.setItem(MIL_LOCAL,JSON.stringify(milStore))}
async function milLoadExams(){
  try{
    const d=await MoreIsLessAPI.exams();
    window.milExams=d.exams||[];
    return window.milExams;
  }catch(e){return []}
}
async function milLoadQuestions(){
  try{const d=await MoreIsLessAPI.questions();window.milQuestions=d.questions||[];return window.milQuestions}catch(e){return []}
}
function milAnswerKey(examId){return milStore[examId]?.answers||{}}
function milSetAnswer(examId,qid,opts){
  if(!milStore[examId])milStore[examId]={answers:{},revision:0,submissionId:null,dirty:false};
  milStore[examId].answers[qid]=Array.from(new Set(opts)).sort();
  milStore[examId].revision++;
  milStore[examId].dirty=true;
  milPersist();
}
async function milSync(examId){
  const s=milStore[examId]; if(!s||!s.submissionId||!s.dirty)return;
  const answers=Object.entries(s.answers).map(([question_id,answer])=>({question_id:Number(question_id),answer}));
  try{
    await MoreIsLessAPI.saveAnswers(s.submissionId,answers,s.revision);
    s.dirty=false;milPersist();
    const el=document.querySelector("[data-save-state]");if(el)el.textContent="已同步";
  }catch(e){
    const el=document.querySelector("[data-save-state]");if(el)el.textContent="仅本地保存";
  }
}
async function milStartRealExam(examId){
  const d=await MoreIsLessAPI.startExam(examId);
  const existing=milStore[examId]||{answers:{},revision:0};
  existing.submissionId=d.submission.id;
  for(const a of d.answers||[])try{existing.answers[a.question_id]=JSON.parse(a.answer_json)}catch{}
  milStore[examId]=existing;milPersist();
  return d;
}
window.addEventListener("online",()=>{const id=window.activeMilExam;if(id)milSync(id)});
setInterval(()=>{if(window.activeMilExam)milSync(window.activeMilExam)},12000);


async function renderLiveExams(){
  const list=await milLoadExams();
  const rows=list.length?list.map(e=>`<tr><td><strong>${milEsc(e.title||e.paper_title||"未命名考试")}</strong><div class="muted">${milEsc(e.code||"Paper")} · ${e.kind==="inter_school"?"跨校联合":"本校考试"}</div></td><td><span class="status ${e.status==="published"||e.status==="live"?"live":"done"}">${e.status==="published"?"已发布":milEsc(e.status)}</span></td><td>${e.kind==="inter_school"?"跨校":"本校"}</td><td>${e.deadline?new Date(e.deadline).toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"—"}</td><td><button class="secondary" onclick="openRealExam(${e.id})">进入</button></td></tr>`).join(""):`<tr><td colspan="5"><div class="empty">当前没有服务端考试。先创建一场考试。</div></td></tr>`;
  content.innerHTML=`<div class="view-head"><div><h2>考试</h2><p>真实考试数据 · 本地优先答题 · 后台同步 · 截止自动锁卷</p></div><button class="primary" onclick="createExamFlow()">创建考试</button></div><div class="table-wrap"><table><thead><tr><th>考试</th><th>状态</th><th>范围</th><th>截止时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function milEsc(v){return String(v??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]))}
function createExamFlow(){
  content.innerHTML=`<div class="view-head"><div><h2>创建考试</h2><p>先建立共享 Paper，再发布本校或跨校考试。材料可稍后补充。</p></div><button class="secondary" onclick="renderLiveExams()">返回考试</button></div>
  <div class="panel form-panel"><div class="form-grid">
  <label>考试名称<input id="mil-title" placeholder="例如：2026 联赛模拟卷 08"></label>
  <label>Paper 编号<input id="mil-code" placeholder="例如：011"></label>
  <label>截止时间<input id="mil-deadline" type="datetime-local"></label>
  <label>考试范围<select id="mil-kind" onchange="milToggleExamSchools()"><option value="school">本校</option><option value="inter_school">跨校联合</option></select></label>
  <div class="full" id="mil-exam-schools" style="display:none"><div class="field-label">参加学校</div><div id="mil-school-options" class="check-grid">加载中…</div></div>
  <label class="full">考试材料<input id="mil-file" type="file" accept=".pdf,.doc,.docx,.txt"></label>
  <label class="full">文档类型<select id="mil-doc-type"><option value="pdf">PDF</option><option value="docx">Word</option><option value="text">文本</option></select></label>
  </div><div class="form-actions"><button class="primary" onclick="createExamSubmit()">创建并保存</button></div></div>`;
  milFillExamSchools();
}
async function milFillExamSchools(){
  try{const d=await MoreIsLessAPI.schools(),box=document.getElementById("mil-school-options");if(box)box.innerHTML=(d.schools||[]).map(s=>`<label class="check-item"><input type="checkbox" value="${s.id}"> <span>${milEscText(s.name)}</span></label>`).join("")||"暂无学校"}catch{}
}
function milToggleExamSchools(){const v=document.getElementById("mil-kind")?.value;const el=document.getElementById("mil-exam-schools");if(el)el.style.display=v==="inter_school"?"block":"none"}
async function createExamSubmit(){
  const title=document.getElementById("mil-title")?.value.trim(),code=document.getElementById("mil-code")?.value.trim(),deadlineLocal=document.getElementById("mil-deadline")?.value,kind=document.getElementById("mil-kind")?.value||"school",file=document.getElementById("mil-file")?.files?.[0],documentType=document.getElementById("mil-doc-type")?.value||"pdf";
  if(!title||!code||!deadlineLocal){alert("请填写考试名称、Paper 编号和截止时间");return}
  const schoolIds=[...document.querySelectorAll("#mil-school-options input:checked")].map(x=>Number(x.value));
  if(kind==="inter_school"&&!schoolIds.length){alert("跨校考试至少选择一所参加学校");return}
  try{
    const paper=await MoreIsLessAPI.createPaper({title,code,document_type:documentType});
    if(file){const base64=await milFileBase64(file);await MoreIsLessAPI.uploadDocument(paper.id,{filename:file.name,mime_type:file.type||"application/octet-stream",content_base64:base64,document_type:documentType})}
    const deadline=new Date(deadlineLocal).toISOString();
    const ex=await MoreIsLessAPI.createExam({title,paper_id:paper.id,deadline,kind,school_ids:schoolIds});
    alert("考试已创建，编号 #"+ex.id);await renderLiveExams();
  }catch(e){alert(e.message||"创建失败")}
}
function milFileBase64(file){
  return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(",")[1]||"");r.onerror=reject;r.readAsDataURL(file)});
}
function milExamRemaining(deadline){
  const ms=new Date(deadline).getTime()-Date.now();
  return Math.max(0,ms);
}
function milFormat(ms){
  const sec=Math.floor(ms/1000),h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;
  return [h,m,s].map((x,i)=>i===0?String(x).padStart(2,"0"):String(x).padStart(2,"0")).join(":");
}
function milDocumentHtml(exam){
  const url=exam.source_url;
  if(!url)return `<div class="document-empty"><strong>考试材料尚未上传</strong><span>教练可以稍后补充 PDF / Word 文件，不影响考试题目数据继续维护。</span></div>`;
  if((exam.document_type||"pdf").toLowerCase()==="pdf")return `<iframe class="document-frame" src="${milEsc(url)}" title="考试文档"></iframe>`;
  if((exam.document_type||"").toLowerCase()==="docx")return `<iframe class="document-frame" src="https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}" title="Word考试文档"></iframe>`;
  return `<iframe class="document-frame" src="${milEsc(url)}" title="考试文档"></iframe>`;
}
async function openRealExam(id){
  try{
    const d=await MoreIsLessAPI.exam(id); window.activeMilExam=id; window.activeMilExamData=d;
    const s=await milStartRealExam(id);
    const qs=d.questions||[];
    if(!milStore[id])milStore[id]={answers:{},revision:0,submissionId:s.submission.id,dirty:false};
    milStore[id].submissionId=s.submission.id;
    milPersist();
    const render=()=>{
      const locked=milExamRemaining(d.exam.deadline)<=0||s.submission.status!=="draft";
      const timer=milFormat(milExamRemaining(d.exam.deadline));
      const source=d.exam.source_url?`<div class="document-wrap">${milDocumentHtml(d.exam)}</div>`:`<div class="paper"><article class="paper-page">${qs.map((q,i)=>`<section class="real-question"><div class="q-no">${q.number||i+1} · ${milEsc(q.public_id||"")}</div><h3>${milEsc(q.stem||q.ocr_text||"题目内容尚未上传")}</h3>${q.ocr_text&&q.stem?milEsc(q.ocr_text).replaceAll("\\n","<br>"):""}</section>`).join("")}</article></div>`;
      content.innerHTML=`<div class="view-head"><div><h2>${milEsc(d.exam.title)}</h2><p>${milEsc(d.exam.code||"")} · ${qs.length} 题 · 不定项选择</p></div><div class="actions"><span class="tag ${locked?"":"live-tag"}" id="real-timer">${locked?"已锁定":timer}</span><span class="tag" data-save-state>${milStore[id]?.dirty?"仅本地保存":"已同步"}</span><button class="primary" ${locked?"disabled":""} onclick="submitRealExam(${s.submission.id})">${locked?"已提交/锁定":"提交试卷"}</button></div></div>
      <div class="exam-layout"><section class="reader"><div class="reader-head"><strong>${milEsc(d.exam.paper_title||"考试材料")}</strong><div class="reader-tools"><button class="tool" onclick="milZoom(-1)">−</button><button class="tool" id="zoom-label">100%</button><button class="tool" onclick="milZoom(1)">+</button><button class="tool">笔</button></div></div>${source}</section>
      <aside class="answer-sheet"><div class="sheet-head"><strong>答题卡</strong><span class="timer">${locked?"锁定":timer}</span></div><div class="sheet-body"><div class="save-state" data-save-state>${milStore[id]?.dirty?"本地保存中":"已同步"}</div>${qs.map(q=>realAnswerRow(id,q,locked)).join("")}</div><div class="submit-bar"><button class="primary" ${locked?"disabled":""} onclick="submitRealExam(${s.submission.id})">提交试卷</button></div></aside></div>`;
    };
    render();
    clearInterval(window.milExamTimer);
    window.milExamTimer=setInterval(async()=>{
      const left=milExamRemaining(d.exam.deadline);
      const timerEl=document.getElementById("real-timer");
      if(timerEl)timerEl.textContent=milFormat(left);
      document.querySelectorAll(".answer-sheet .timer").forEach(el=>el.textContent=left?"剩余 "+milFormat(left):"已截止");
      if(left<=0){clearInterval(window.milExamTimer);await milDeadlineSubmit(id,s.submission.id)}
    },1000);
  }catch(e){alert(e.message||"无法进入考试")}
}
function realAnswerRow(examId,q,locked){
  const selected=(milStore[examId]?.answers?.[q.id])||[];
  return `<div class="answer-row ${selected.length?"has-answer":""}"><div class="answer-row-head"><strong>${q.number||q.id}</strong><span>${selected.length?selected.join("、"):"未作答"}</span></div><div class="choices">${["A","B","C","D"].map(c=>`<button class="choice ${selected.includes(c)?"selected":""}" ${locked?"disabled":""} onclick="realToggleAnswer(${examId},${q.id},'${c}')">${c}</button>`).join("")}</div></div>`;
}
function realToggleAnswer(examId,qid,c){
  if(milExamRemaining(window.activeMilExamData?.exam?.deadline||0)<=0)return;
  const old=(milStore[examId]?.answers?.[qid])||[];
  const next=old.includes(c)?old.filter(x=>x!==c):old.concat(c);
  milSetAnswer(examId,qid,next);
  const row=document.querySelectorAll(".answer-row");
  const q=window.activeMilExamData?.questions?.find(x=>x.id===qid);
  if(q){const idx=(window.activeMilExamData.questions||[]).findIndex(x=>x.id===qid);const target=row[idx];if(target){target.querySelector(".answer-row-head span").textContent=next.length?next.join("、"):"未作答";target.querySelectorAll(".choice").forEach(b=>b.classList.toggle("selected",b.textContent===b.textContent&&next.includes(b.textContent)))}} 
  milSync(examId);
}
async function milDeadlineSubmit(examId,submissionId){
  const s=milStore[examId]||{};
  s.pendingSubmit=true;s.dirty=true;milPersist();
  try{await milSync(examId);if(navigator.onLine){await MoreIsLessAPI.submit(submissionId);s.pendingSubmit=false;s.dirty=false;milPersist();}}catch{}
  const el=document.querySelector("[data-save-state]");if(el)el.textContent=navigator.onLine?"已自动提交":"已锁定，等待网络恢复自动提交";
}
async function milFlushExam(examId){
  const s=milStore[examId];if(!s)return;
  try{
    await milSync(examId);
    if(s.pendingSubmit&&navigator.onLine&&s.submissionId){await MoreIsLessAPI.submit(s.submissionId);s.pendingSubmit=false;s.dirty=false;milPersist()}
  }catch{}
}
window.addEventListener("online",()=>{if(window.activeMilExam)milFlushExam(window.activeMilExam)});
setInterval(()=>{if(window.activeMilExam)milFlushExam(window.activeMilExam)},12000);
async function submitRealExam(submissionId){
  if(milExamRemaining(window.activeMilExamData?.exam?.deadline||0)<=0){await milDeadlineSubmit(window.activeMilExam,submissionId);return}
  if(!confirm("确认提交？提交后答案不可修改。"))return;
  try{
    await milSync(window.activeMilExam);
    await MoreIsLessAPI.submit(submissionId);
    const s=milStore[window.activeMilExam]||{};s.pendingSubmit=false;s.dirty=false;milPersist();
    alert("已提交");
    await renderLiveExams();
  }catch(e){alert(e.message||"提交失败；答案仍保留在本机")}
}
function milZoom(delta){
  const el=document.querySelector(".paper-page,.document-frame"); if(!el)return;
  const cur=Number(localStorage.getItem("mil_zoom")||100)+delta*10;const next=Math.max(70,Math.min(160,cur));localStorage.setItem("mil_zoom",next);
  const label=document.getElementById("zoom-label");if(label)label.textContent=next+"%";
  if(el.classList.contains("paper-page"))el.style.zoom=next/100;else el.style.transform="scale("+next/100+")";
}
const _openView=openView;
openView=async function(view){
  if(view==="exams"){state.view=view;document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));pageName.textContent="考试";pageTitle.textContent="训练与考试，一处完成";await renderLiveExams();return}
  return _openView(view);
};

/* ============================================================
   Production management layer
   ============================================================ */
let milUser=null;

function milEscText(v){return milEsc(v==null?"":String(v))}
function milRole(){return milUser?.role||"student"}
function milAuthShell(){
  content.innerHTML=`<div class="auth-shell">
    <div class="auth-brand"><div class="brand-mark">m</div><div><strong>moreisless</strong><span>Biology Competition OS</span></div></div>
    <div class="auth-card">
      <div class="auth-copy"><span class="eyebrow">ACCESS</span><h1>进入竞赛工作台</h1><p>学校、考试、题库与成绩统一在同一账户下管理。</p></div>
      <div id="auth-panel"></div>
    </div>
    <div class="auth-base"><span>Worker API</span><input id="auth-api-base" placeholder="例如 https://your-worker.workers.dev"><button class="secondary" onclick="milSaveApiBase()">保存地址</button></div>
  </div>`;
  const base=document.getElementById("auth-api-base");if(base)base.value=localStorage.getItem("mil_api_base")||"";
  milRenderLogin();
}
function milSaveApiBase(){
  const v=document.getElementById("auth-api-base")?.value.trim()||"";
  MoreIsLessAPI.setBase(v);milRenderLogin();
}
function milRenderLogin(){
  const p=document.getElementById("auth-panel");if(!p)return;
  p.innerHTML=`<div class="auth-tabs"><button class="auth-tab active" onclick="milRenderLogin()">登录</button><button class="auth-tab" onclick="milRenderRegister()">注册</button></div>
  <form class="auth-form" onsubmit="event.preventDefault();milLoginSubmit()">
    <label>用户名<input id="login-user" autocomplete="username" required></label>
    <label>密码<input id="login-pass" type="password" autocomplete="current-password" required></label>
    <div id="auth-error" class="form-error"></div><button class="primary wide">登录</button>
  </form>`;
}
function milRenderRegister(){
  const p=document.getElementById("auth-panel");if(!p)return;
  p.innerHTML=`<div class="auth-tabs"><button class="auth-tab" onclick="milRenderLogin()">登录</button><button class="auth-tab active">注册</button></div>
  <form class="auth-form" onsubmit="event.preventDefault();milRegisterSubmit()">
    <label>用户名<input id="reg-user" required maxlength="32"></label>
    <label>密码<input id="reg-pass" type="password" required maxlength="128"></label>
    <label>角色<select id="reg-role"><option value="student">学生</option><option value="coach">教练</option></select></label>
    <label>学校<select id="reg-school"><option value="">加载中…</option></select></label>
    <label>或新建学校<input id="reg-new-school" placeholder="学校不在列表时填写"></label>
    <div id="auth-error" class="form-error"></div><button class="primary wide">创建账户</button>
  </form>`;
  milFillSchools();
}
async function milFillSchools(){
  const s=document.getElementById("reg-school");if(!s)return;
  try{const d=await MoreIsLessAPI.schools();s.innerHTML='<option value="">选择已有学校</option>'+(d.schools||[]).map(x=>`<option value="${x.id}">${milEscText(x.name)}</option>`).join("")}
  catch(e){s.innerHTML='<option value="">暂时无法加载学校</option>'}
}
async function milLoginSubmit(){
  const err=document.getElementById("auth-error");try{
    const d=await MoreIsLessAPI.login(document.getElementById("login-user").value.trim(),document.getElementById("login-pass").value);
    milUser=d.user||d;await milEnterApp();
  }catch(e){if(err)err.textContent=e.message||"登录失败"}
}
async function milRegisterSubmit(){
  const err=document.getElementById("auth-error");try{
    const schoolId=Number(document.getElementById("reg-school").value)||0,newSchool=document.getElementById("reg-new-school").value.trim();
    if(!schoolId&&!newSchool)throw new Error("请选择学校，或填写新学校名称");
    const d=await MoreIsLessAPI.register({username:document.getElementById("reg-user").value.trim(),password:document.getElementById("reg-pass").value,role:document.getElementById("reg-role").value,school_id:schoolId,school:newSchool});
    milUser=d;await milEnterApp();
  }catch(e){if(err)err.textContent=e.message||"注册失败"}
}
async function milEnterApp(){
  try{const d=await MoreIsLessAPI.me();milUser=d.user||d}catch{}
  milApplyIdentity();
  openView("overview");
}
function milApplyIdentity(){
  const school=milUser?.school||"未设置学校",name=milUser?.username||"用户",role=milRole()==="coach"?"教练":"学生";
  const sw=document.querySelector(".school-switch");if(sw)sw.innerHTML=`<span class="eyebrow">当前学校</span><strong>${milEscText(school)}</strong><span class="muted">${role} · ${milEscText(name)}</span>`;
  const pr=document.querySelector(".profile");if(pr)pr.innerHTML=`${milEscText(name)} <span>${milEscText(name.slice(0,2).toUpperCase())}</span>`;
  const nav=document.querySelectorAll(".nav-item");
  nav.forEach(x=>{if(milRole()!=="coach"&&["students","schools"].includes(x.dataset.view))x.style.display="none"});
  const newBtn=document.getElementById("new-exam");if(newBtn)newBtn.style.display=milRole()==="coach"?"":"none";
}
function milLogout(){MoreIsLessAPI.logout();milUser=null;milAuthShell()}

async function milQuestionsView(){
  const isCoach=milRole()==="coach";
  let qs=[];try{qs=(await MoreIsLessAPI.questions()).questions||[]}catch{}
  content.innerHTML=`<div class="view-head"><div><h2>全球题库</h2><p>题目独立于学校与考试；OCR、解析、难度与讨论长期沉淀。</p></div>${isCoach?'<button class="primary" onclick="milQuestionEditor()">新建题目</button>':''}</div>
  <div class="table-wrap"><table><thead><tr><th>题号</th><th>题目</th><th>类型</th><th>难度</th><th>来源</th><th>内容</th><th>操作</th></tr></thead><tbody>
  ${qs.map(q=>`<tr><td><strong>${milEscText(q.public_id)}</strong></td><td>${milEscText((q.stem||"").slice(0,70))}</td><td>${milEscText(q.question_type||"未分类")}</td><td>${q.difficulty==null?"—":q.difficulty}</td><td>${milEscText(q.source||"—")}</td><td>${q.ocr_text?"OCR":"—"} · ${q.solution?"解析":"—"}</td><td><button class="secondary" onclick="milQuestionEditor(${q.id})">编辑</button></td></tr>`).join("")}</tbody></table></div>`;
  if(!qs.length)content.innerHTML+='<div class="empty">还没有题目。教练可以先创建 Paper，再录入题目。</div>';
}
async function milQuestionEditor(id){
  let q={};if(id){try{const d=await MoreIsLessAPI.questions();q=(d.questions||[]).find(x=>x.id===id)||{}}catch{}}
  let papers=[];try{papers=(await MoreIsLessAPI.papers()).papers||[]}catch{}
  content.innerHTML=`<div class="view-head"><div><h2>${id?"编辑题目":"新建题目"}</h2><p>人工定义题号，不依赖 OCR；支持基础、板块、论文、综合四类。</p></div><button class="secondary" onclick="openView('questions')">返回题库</button></div>
  <div class="panel form-panel"><form class="form-grid" onsubmit="event.preventDefault();milQuestionSave(${id||0})">
    <label>Paper<select id="q-paper" required><option value="">选择 Paper</option>${papers.map(p=>`<option value="${p.id}" ${Number(q.paper_id)===Number(p.id)?"selected":""}>${milEscText(p.code+" · "+p.title)}</option>`).join("")}</select></label>
    <label>题号 / 公开号<input id="q-public" value="${milEscText(q.public_id||"")}" placeholder="011-079" required></label>
    <label>题目序号<input id="q-number" type="number" value="${q.number||""}" required></label>
    <label>题型<select id="q-type"><option>基础</option><option>板块</option><option>论文</option><option>综合</option></select></label>
    <label>难度系数<input id="q-difficulty" type="number" min="0" max="1" step="0.01" value="${q.difficulty??""}" placeholder="0.00–1.00"></label>
    <label>来源<input id="q-source" value="${milEscText(q.source||"")}" placeholder="联赛题目 / 质心教育 / ..."></label>
    <label class="full">题干<textarea id="q-stem" rows="7" required>${milEscText(q.stem||"")}</textarea></label>
    <label class="full">OCR 文本<textarea id="q-ocr" rows="6">${milEscText(q.ocr_text||"")}</textarea></label>
    <label class="full">解析 / 解决方案<textarea id="q-solution" rows="8">${milEscText(q.solution||"")}</textarea></label>
    <div class="form-actions full"><button class="secondary" type="button" onclick="openView('questions')">取消</button><button class="primary">保存题目</button></div>
  </form></div>`;
  const type=document.getElementById("q-type");if(type&&q.question_type)type.value=q.question_type;
}
async function milQuestionSave(id){
  try{
    await MoreIsLessAPI.upsertQuestion({id:id||undefined,paper_id:Number(document.getElementById("q-paper").value),number:Number(document.getElementById("q-number").value),public_id:document.getElementById("q-public").value.trim(),question_type:document.getElementById("q-type").value,difficulty:document.getElementById("q-difficulty").value===""?null:Number(document.getElementById("q-difficulty").value),source:document.getElementById("q-source").value.trim(),stem:document.getElementById("q-stem").value,ocr_text:document.getElementById("q-ocr").value,solution:document.getElementById("q-solution").value});
    openView("questions");
  }catch(e){alert(e.message||"保存失败")}
}

async function milAnswerKeyView(examId){
  const exams=await milLoadExams();const ex=(exams||[]).find(x=>Number(x.id)===Number(examId))||exams?.[0];
  if(!ex){content.innerHTML='<div class="empty">暂无考试</div>';return}
  let detail;try{detail=await MoreIsLessAPI.exam(ex.id)}catch(e){alert(e.message);return}
  const qs=detail.questions||[];
  content.innerHTML=`<div class="view-head"><div><h2>答案键 · ${milEscText(ex.title)}</h2><p>答案键可以在考前、考中或考后发布；每次发布生成新版本。</p></div><button class="secondary" onclick="openView('exams')">返回考试</button></div>
  <div class="panel form-panel"><div class="form-grid" id="key-grid">${qs.map(q=>`<label><span>${milEscText(q.public_id||q.number)} · 正确选项</span><input class="key-input" data-q="${q.id}" placeholder="ACD" maxlength="4"><small class="field-help">每题分值 2；可改为其他分值</small></label><label><span>分值</span><input class="point-input" data-q="${q.id}" type="number" step="0.1" value="2"></label>`).join("")}</div><label class="full">版本说明<input id="key-note" placeholder="例如：考后核对图 3 后修正第 79 题"></label><div class="form-actions"><button class="primary" onclick="milAnswerKeySave(${ex.id})">发布答案键</button><button class="secondary" onclick="milCalculate(${ex.id})">按当前答案键评分</button></div></div>`;
}
async function milAnswerKeySave(examId){
  const rows=[...document.querySelectorAll(".key-input")].filter(x=>x.value.trim()).map(x=>({question_id:Number(x.dataset.q),answer:x.value.trim(),points:Number(document.querySelector('.point-input[data-q="'+x.dataset.q+'"]')?.value||2)}));
  try{const d=await MoreIsLessAPI.setAnswerKey(examId,{questions:rows,note:document.getElementById("key-note").value.trim()});alert("答案键 v"+d.version+" 已发布");}catch(e){alert(e.message||"发布失败")}
}
async function milCalculate(examId){try{const d=await MoreIsLessAPI.calculate(examId);alert("评分完成，生成 score v"+d.version);openView("results")}catch(e){alert(e.message||"评分失败")}}

async function milResultsView(){
  const exams=await milLoadExams();const ex=exams?.[0];if(!ex){content.innerHTML='<div class="empty">暂无考试成绩</div>';return}
  let d={results:[]};try{d=await MoreIsLessAPI.results(ex.id)}catch(e){}
  const rows=d.results||[];window.milResultRows=rows;
  content.innerHTML=`<div class="view-head"><div><h2>成绩与版本</h2><p>B3：历史版本保留；当前版本可显式切换，题目级得分明细长期保留。</p></div><div class="actions">${milRole()==="coach"?`<button class="secondary" onclick="milAnswerKeyView(${ex.id})">答案键</button><button class="primary" onclick="milCalculate(${ex.id})">重新评分</button>`:""}</div></div>
  <div class="panel" style="margin-bottom:14px"><div class="panel-title"><h3>评分版本</h3><span class="tag">B3</span></div><div id="mil-version-list" class="version-list"><div class="empty">正在加载版本…</div></div></div>
  <div class="grid-2"><div class="panel"><div class="panel-title"><h3>${milEscText(ex.title)}</h3><span class="tag">${rows.length} 份提交</span></div><div class="table-wrap"><table><thead><tr><th>排名</th><th>学生</th><th>学校</th><th>成绩</th><th>提交时间</th><th>明细</th></tr></thead><tbody>${rows.map((x,i)=>`<tr><td>${i+1}</td><td><strong>${milEscText(x.username||"外校学生")}</strong></td><td>${milEscText(x.school_name||"")}</td><td><strong>${x.total==null?"未评分":x.total}</strong></td><td>${milEscText(x.submitted_at||"")}</td><td><button class="secondary" onclick="milShowResultDetail(${i})">查看</button></td></tr>`).join("")}</tbody></table></div></div>
  <div class="panel"><div class="panel-title"><h3>规则</h3><span class="tag">方案 B</span></div><div class="detail-grid" style="grid-template-columns:1fr"><div class="detail"><span>答案键</span><strong>可迟发布、可重复发布</strong></div><div class="detail"><span>评分</span><strong>新规则不覆盖旧版本</strong></div><div class="detail"><span>题目明细</span><strong>学生答案 / 正确答案 / 得分</strong></div><div class="detail"><span>校际可见性</span><strong>外校只显示学校，不显示姓名</strong></div></div></div></div>`;
  try{const vd=await MoreIsLessAPI.versions(ex.id),box=document.getElementById("mil-version-list");if(box)box.innerHTML=(vd.versions||[]).map(v=>`<div class="version ${v.is_current?"current":""}"><div><strong>v${v.version}</strong><small>${milEscText(v.created_at||"")} · ${milEscText(v.scoring_rule_json||"").slice(0,100)}</small></div><span class="mark">${v.is_current?"当前":milRole()==="coach"?`<button class="secondary" onclick="milSwitchVersion(${ex.id},${v.version})">设为当前</button>`:"历史"}</span></div>`).join("")||'<div class="empty">还没有评分版本</div>'}catch{}
}
function milShowResultDetail(index){
  const row=window.milResultRows?.[index];if(!row)return;
  let details=[];try{details=JSON.parse(row.detail_json||"[]")}catch{}
  const html=`<div class="view-head"><div><h2>题目级答题明细</h2><p>${milEscText(row.username||"外校学生")} · ${milEscText(row.school_name||"")} · 总分 ${row.total??"未评分"}</p></div><button class="secondary" onclick="openView('results')">返回成绩</button></div>
  <div class="table-wrap"><table><thead><tr><th>题号</th><th>学生答案</th><th>正确答案</th><th>得分</th><th>结果</th></tr></thead><tbody>${details.map((d,i)=>{const sa=(d.student_answer||[]).join("、"),ca=(d.correct_answer||[]).join("、"),ok=sa===ca;return `<tr><td><strong>${d.question_id??i+1}</strong></td><td>${milEscText(sa||"未作答")}</td><td>${milEscText(ca||"未设置")}</td><td>${d.score??0}</td><td>${ok?"正确":d.score>0?"部分得分":"错误"}</td></tr>`}).join("")}</tbody></table></div>`;
  content.innerHTML=html;
}
async function milSwitchVersion(examId,version){try{await MoreIsLessAPI.switchVersion(examId,version);openView("results")}catch(e){alert(e.message||"切换失败")}}
async function milSchoolsView(){
  let schools=[];try{schools=(await MoreIsLessAPI.schools()).schools||[]}catch{}
  content.innerHTML=`<div class="view-head"><div><h2>学校与联考</h2><p>学校是共享实体；每个学生与教练只归属于一个学校。</p></div><button class="primary" onclick="milCreateSchool()">新建学校</button></div>
  <div class="panel"><div class="panel-title"><h3>学校目录</h3><span class="tag">${schools.length} 所</span></div><div class="table-wrap"><table><thead><tr><th>ID</th><th>学校</th><th>操作</th></tr></thead><tbody>${schools.map(s=>`<tr><td>${s.id}</td><td><strong>${milEscText(s.name)}</strong></td><td><button class="secondary" onclick="navigator.clipboard?.writeText('${milEscText(s.name)}')">复制名称</button></td></tr>`).join("")}</tbody></table></div></div>
  <div class="panel" style="margin-top:14px"><div class="panel-title"><h3>跨校联考规则</h3><span class="tag">方案 B</span></div><p class="muted">本校学生完整看到本校结果；跨校结果按学校展示，外校学生姓名隐藏。主教练负责考试设置与答案键/评分版本。</p></div>`;
}
async function milCreateSchool(){
  const name=prompt("学校名称");if(!name?.trim())return;
  try{await MoreIsLessAPI.createSchool(name.trim());openView("schools")}catch(e){alert(e.message||"创建失败")}
}

function milSettingsView(){
  const name=milUser?.username||"",school=milUser?.school||"",role=milRole();
  content.innerHTML=`<div class="view-head"><div><h2>账户与设置</h2><p>当前身份与 API 连接。</p></div><button class="secondary" onclick="milLogout()">退出登录</button></div>
  <div class="grid-2"><div class="panel"><div class="panel-title"><h3>身份</h3><span class="tag">${role}</span></div><div class="detail-grid" style="grid-template-columns:1fr"><div class="detail"><span>用户名</span><strong>${milEscText(name)}</strong></div><div class="detail"><span>学校</span><strong>${milEscText(school)}</strong></div><div class="detail"><span>角色</span><strong>${role==="coach"?"教练":"学生"}</strong></div></div></div><div class="panel"><div class="panel-title"><h3>Worker API</h3></div><label class="standalone-field">地址<input id="settings-api-base" value="${milEscText(localStorage.getItem("mil_api_base")||"")}" placeholder="https://your-worker.workers.dev"></label><button class="primary" style="margin-top:12px" onclick="MoreIsLessAPI.setBase(document.getElementById('settings-api-base').value.trim());alert('已保存')">保存</button></div></div>`;
}

views.questions=()=>{milQuestionsView();return '<div class="empty">正在加载题库…</div>'};
views.results=()=>{milResultsView();return '<div class="empty">正在加载成绩…</div>'};
views.schools=()=>{milSchoolsView();return '<div class="empty">正在加载学校…</div>'};
views.settings=milSettingsView;
const __milOpenView=openView;
openView=async function(view){
  if(!MoreIsLessAPI.getToken()){milAuthShell();return}
  if(view==="questions"){await milQuestionsView();return}
  if(view==="results"){await milResultsView();return}
  if(view==="schools"){await milSchoolsView();return}
  if(view==="settings"){milSettingsView();return}
  return __milOpenView(view);
};
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>openView(b.dataset.view));
window.addEventListener("load",async()=>{
  if(MoreIsLessAPI.getToken()){try{const d=await MoreIsLessAPI.me();milUser=d.user||d;milApplyIdentity();openView("overview")}catch{milAuthShell()}}
  else milAuthShell();
});
if(MoreIsLessAPI.getToken()){milEnterApp()}else milAuthShell();

async function milStudentsView(){
  let rows=[];try{rows=(await MoreIsLessAPI.historical()).rows||[]}catch{}
  const by={};for(const x of rows){const k=x.student_id||x.student_name;by[k]??=[];by[k].push(x)}
  content.innerHTML=`<div class="view-head"><div><h2>学生与历史成绩</h2><p>历史成绩保留原始答案、规范化答案与确定性评分，可持续生成学生纵向画像。</p></div>${milRole()==="coach"?'<button class="primary" onclick="milHistoricalImportView()">导入 Excel / CSV</button>':''}</div>
  <div class="stats"><div class="stat"><div class="stat-top">历史记录</div><div class="stat-value">${rows.length}</div><div class="stat-note">当前学校</div></div><div class="stat"><div class="stat-top">已匹配学生</div><div class="stat-value">${new Set(rows.filter(x=>x.student_id).map(x=>x.student_id)).size}</div><div class="stat-note">按用户名自动匹配</div></div><div class="stat"><div class="stat-top">未匹配</div><div class="stat-value">${rows.filter(x=>!x.student_id).length}</div><div class="stat-note">仍保留原始姓名</div></div><div class="stat"><div class="stat-top">平均历史分</div><div class="stat-value">${rows.length?(rows.reduce((a,x)=>a+Number(x.score||0),0)/rows.length).toFixed(1):"—"}</div><div class="stat-note">按导入记录</div></div></div>
  <div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>学生</th><th>来源</th><th>日期</th><th>模式</th><th>得分</th><th>匹配</th></tr></thead><tbody>${rows.map(x=>`<tr><td><strong>${milEscText(x.student_name)}</strong></td><td>${milEscText(x.source_name||"")}</td><td>${milEscText(x.exam_date||"")}</td><td>${x.mode}</td><td><strong>${x.score}</strong></td><td>${x.student_id?"已匹配":"待匹配"}</td></tr>`).join("")}</tbody></table></div>`;
  if(!rows.length)content.innerHTML+='<div class="empty">还没有历史成绩。可以导入“第一行答案、第一列姓名、B2 开始学生答案”的表格。</div>';
}
function milHistoricalImportView(){
  content.innerHTML=`<div class="view-head"><div><h2>导入历史成绩</h2><p>格式：第 1 行为标准答案，第 1 列为学生姓名，B2 起为学生答案。系统自动识别 TF / ABCD。</p></div><button class="secondary" onclick="openView('students')">返回学生</button></div>
  <div class="panel form-panel"><div class="form-grid">
    <label>文件<input id="hist-file" type="file" accept=".xlsx,.xls,.csv"></label>
    <label>来源<input id="hist-source" placeholder="例如：2025 联赛初赛"></label>
    <label>考试日期<input id="hist-date" type="date"></label>
    <label>模式<select id="hist-mode"><option value="auto">自动识别</option><option value="TF">TF</option><option value="ABCD">ABCD</option></select></label>
  </div><div id="hist-preview" class="import-preview">选择文件后预览。</div><div class="form-actions"><button class="primary" onclick="milHistoricalImport()">开始导入</button></div></div>`;
  document.getElementById("hist-file").addEventListener("change",milPreviewHistorical);
}
async function milReadSheet(file){
  if(window.XLSX){const data=await file.arrayBuffer();const wb=XLSX.read(data,{type:"array"});return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:""});}
  const text=await file.text();return text.split(/\r?\n/).map(line=>line.split(","));
}
function milDetectHistMode(matrix){
  const vals=matrix.slice(1).flat().filter(v=>String(v).trim()).map(v=>String(v).trim().toUpperCase());
  const ab=vals.filter(v=>/^[ABCD]+$/.test(v)).length,tf=vals.filter(v=>/^[TF]+$/.test(v)).length;
  return ab>tf?"ABCD":"TF";
}
async function milPreviewHistorical(){
  const file=document.getElementById("hist-file").files[0];if(!file)return;
  try{
    const matrix=await milReadSheet(file);const mode=milDetectHistMode(matrix);const keys=(matrix[0]||[]).slice(1);
    const students=matrix.slice(1).filter(r=>String(r?.[0]||"").trim()).slice(0,5);
    document.getElementById("hist-preview").innerHTML=`<strong>${milEscText(file.name)}</strong><span>${matrix.length-1} 名学生 · ${keys.length} 题 · 自动识别 ${mode}</span><code>${milEscText(JSON.stringify({key_answers:keys,first_student:students[0]||[]},null,2).slice(0,1200))}</code>`;
    document.getElementById("hist-mode").dataset.detected=mode;
  }catch(e){document.getElementById("hist-preview").textContent=e.message||"文件解析失败"}
}
async function milHistoricalImport(){
  const file=document.getElementById("hist-file").files[0];if(!file)return alert("请选择文件");
  try{
    const matrix=await milReadSheet(file),keys=(matrix[0]||[]).slice(1),auto=milDetectHistMode(matrix),mode=document.getElementById("hist-mode").value==="auto"?auto:document.getElementById("hist-mode").value;
    const students=matrix.slice(1).filter(r=>String(r?.[0]||"").trim()).map(r=>({student_name:String(r[0]).trim(),answers:r.slice(1,keys.length+1).map(v=>String(v??"").trim())}));
    const d=await MoreIsLessAPI.importHistorical({key_answers:keys,students,mode,source_name:document.getElementById("hist-source").value.trim(),exam_date:document.getElementById("hist-date").value});
    alert(`已导入 ${d.count} 条历史成绩`);openView("students");
  }catch(e){alert(e.message||"导入失败")}
}
views.students=()=>{milStudentsView();return '<div class="empty">正在加载学生数据…</div>'};

async function milProfileView(){
  let d={profile:{},student:{}};try{d=await MoreIsLessAPI.profile()}catch(e){}
  const p=d.profile||{};
  content.innerHTML=`<div class="view-head"><div><h2>我的学生画像</h2><p>画像基于历史成绩与错题数据生成；每次生成都会保留模型与结果记录。</p></div><button class="primary" onclick="milProfileRefresh()">重新分析</button></div>
  <div class="grid-2"><div class="panel"><div class="panel-title"><h3>总体判断</h3><span class="tag">NVIDIA</span></div><p class="profile-summary">${milEscText(p.summary||"暂无画像，点击重新分析。")}</p><div class="detail-grid" style="grid-template-columns:1fr"><div class="detail"><span>优势</span><strong>${milEscText((p.strengths||[]).join(" · ")||"—")}</strong></div><div class="detail"><span>薄弱点</span><strong>${milEscText((p.weaknesses||[]).join(" · ")||"—")}</strong></div><div class="detail"><span>推荐方向</span><strong>${milEscText((p.recommended_topics||[]).join(" · ")||"—")}</strong></div></div></div>
  <div class="panel"><div class="panel-title"><h3>下一步</h3><span class="tag">建议</span></div><ol class="ai-list">${(p.next_actions||[]).map(x=>`<li>${milEscText(x)}</li>`).join("")||"<li>先导入历史成绩并完成几套考试。</li>"}</ol><p class="muted">置信度：${milEscText(p.confidence||"未评估")}</p></div></div>`;
}
async function milProfileRefresh(){try{await MoreIsLessAPI.profile();await milProfileView()}catch(e){alert(e.message||"分析失败")}}
async function milErrorView(){
  let d={rows:[]};try{d=await MoreIsLessAPI.errorQuestions()}catch{}
  content.innerHTML=`<div class="view-head"><div><h2>错题本</h2><p>评分低于满分的题目自动进入错题本；重做后可以标记清除。</p></div></div>
  <div class="table-wrap"><table><thead><tr><th>题号</th><th>题型</th><th>难度</th><th>来源</th><th>尝试</th><th>最近得分</th><th>状态</th></tr></thead><tbody>${(d.rows||[]).map(x=>`<tr><td><strong>${milEscText(x.public_id)}</strong></td><td>${milEscText(x.question_type||"")}</td><td>${x.difficulty??"—"}</td><td>${milEscText(x.source||"")}</td><td>${x.attempt_count||0}</td><td>${x.last_score??"—"}</td><td>${x.status}</td></tr>`).join("")}</tbody></table></div>`;
  if(!d.rows?.length)content.innerHTML+='<div class="empty">暂时没有错题。完成考试并评分后，失分题会自动进入这里。</div>';
}
views.profile=()=>{milProfileView();return '<div class="empty">正在加载画像…</div>'};
views.errors=()=>{milErrorView();return '<div class="empty">正在加载错题本…</div>'};

async function milGeneratedQuestionsView(){
  if(milRole()!=="coach"){content.innerHTML='<div class="empty">只有教练可以生成新题。</div>';return}
  let students=[];try{const d=await MoreIsLessAPI.historical();const ids=[...new Set((d.rows||[]).filter(x=>x.student_id).map(x=>x.student_id))];students=ids.map(id=>({id,name:(d.rows.find(x=>x.student_id===id)||{}).student_name||("学生 #"+id)}))}catch{}
  content.innerHTML=`<div class="view-head"><div><h2>AI 新题生成</h2><p>仅使用 NVIDIA 模型；生成结果标记为原创练习题，不冒充真实赛事题。</p></div></div><div class="panel form-panel"><div class="form-grid"><label>学生<select id="gen-student">${students.map(s=>`<option value="${s.id}">${milEscText(s.name)}</option>`).join("")}</select></label><label>题数<input id="gen-count" type="number" min="1" max="10" value="5"></label></div><div class="form-actions"><button class="primary" onclick="milGenerateQuestions()">生成</button></div></div><div id="generated-box"></div>`;
}
async function milGenerateQuestions(){
  const sid=Number(document.getElementById("gen-student")?.value),count=Number(document.getElementById("gen-count")?.value||5);if(!sid)return;
  const box=document.getElementById("generated-box");box.innerHTML='<div class="empty">NVIDIA 正在根据学生错题生成练习题…</div>';
  try{const d=await MoreIsLessAPI.generateQuestions(sid,count);box.innerHTML=`<div class="panel"><div class="panel-title"><h3>生成结果</h3><span class="tag">${milEscText(d.model)}</span></div>${(d.questions||[]).map((q,i)=>`<article class="generated-q"><div class="q-no">AI-${String(i+1).padStart(2,"0")}</div><h3>${milEscText(q.stem)}</h3><div class="option-grid">${Object.entries(q.options||{}).map(([k,v])=>`<div><strong>${k}</strong> ${milEscText(v)}</div>`).join("")}</div><div class="generated-answer">答案：${milEscText(q.answer||"")} · ${milEscText(q.explanation||"")}</div></article>`).join("")}</div>`}catch(e){box.innerHTML=`<div class="empty">${milEscText(e.message||"生成失败")}</div>`}
}
views.generated=()=>{milGeneratedQuestionsView();return '<div class="empty">正在加载…</div>'};
