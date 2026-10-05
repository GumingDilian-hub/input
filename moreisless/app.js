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
