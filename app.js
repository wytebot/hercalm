const SWEET_MESSAGES = [
  "You deserve a softer moment today 💗","Rest can be part of a good day.",
  "Small comforts count. Take the next gentle step.","Breathe, reset, and give yourself room."
];

const FAQS = [
 {q:"How can I make a comfort routine?",a:"Pick one calming activity, one gentle movement option, and one rest activity. Keep it simple and adjust based on how you feel."},
 {q:"What can I do when I need a short reset?",a:"Try the 5-minute Stretch Timer, Calm Breath, or a quiet timer. These are general wellness activities."},
 {q:"How should I use the tracker?",a:"Log what you notice consistently. After a few entries, Pattern Insights can summarize your own logged information."},
 {q:"Can I use HerCalm without an account?",a:"Yes. The core tracker and timers are designed to work locally in your browser."},
 {q:"Is CalmPlan AI medical advice?",a:"No. CalmPlan AI creates general self-care ideas. It does not diagnose, prescribe, or replace professional care."},
 {q:"Can I delete my data?",a:"Yes. Delete All My Data removes HerCalm's locally stored logs from this browser."},
 {q:"What does the Cycle Planner predict?",a:"It creates simple planning dates from the date and typical cycle length you enter. It is a planning estimate, not a medical prediction."},
 {q:"What if my experience is severe or unusual?",a:"HerCalm is not designed to assess emergencies or diagnose symptoms. Seek appropriate professional help for health concerns."},
 {q:"Does HerCalm send my tracker data to the cloud?",a:"The included tracker stores entries in localStorage. The AI tool sends only the fields you submit to its configured AI endpoint so it can generate the requested plan."},
 {q:"Can I customize the tools?",a:"Yes. This source code is intentionally simple vanilla HTML/CSS/JS so developers can customize labels, durations, branding and workflows."}
];

function $(id){return document.getElementById(id);}
function nav(page){
  document.querySelectorAll('.container > div').forEach(d=>d.classList.add('hidden'));
  const target=$(page);
  if(!target){ console.warn('Unknown page:',page); return; }
  target.classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const map={home:0,tracker:1,guide:2,mood:3};
  if(map[page]!==undefined){const n=document.querySelectorAll('.nav-item')[map[page]];if(n)n.classList.add('active');}
  if(page==='insights') renderInsights();
  if(page==='hydrate') renderWater();
  window.scrollTo({top:0,behavior:'smooth'});
}
function toggleMenu(){ $('drawer').classList.toggle('open'); }
function closeMenu(e){if(e.target.id==='drawer') $('drawer').classList.remove('open');}
function navFromMenu(page){event?.preventDefault?.();$('drawer').classList.remove('open');nav(page);}

function trackAffiliate(event,product){
 if(event) event.preventDefault();
 const links={
  'yoga-mat':'https://www.amazon.com/s?k=yoga+mat',
  'heat-pad':'https://www.amazon.com/s?k=heating+pad',
  'tea-bundle':'https://www.amazon.com/s?k=herbal+tea',
  'ginger-tea':'https://www.amazon.com/s?k=ginger+tea'
 };
 const url=links[product];
 if(url) window.open(url,'_blank','noopener,noreferrer');
 else alert('Shopping link is not configured yet.');
}

function checkDailyMessage(){
 const last=localStorage.getItem('hercalm_lastMsg'); if(!last || Date.now()-Number(last)>86400000){
  $('messageText').textContent=SWEET_MESSAGES[Math.floor(Math.random()*SWEET_MESSAGES.length)];
  $('dailyMessage').classList.remove('hidden');
 }
}
function closeDailyMessage(){localStorage.setItem('hercalm_lastMsg',Date.now());$('dailyMessage').classList.add('hidden');}

let yogaInterval=null,yogaSec=360,yogaRunning=false;
const yogaPoses=[['Shoulder rolls','Move slowly and comfortably.'],['Cat-Cow','Use a gentle range of motion.'],['Reclined twist','Keep the movement easy.'],['Supine butterfly','Relax your shoulders.'],['Legs-up rest','Pause and breathe.'],['Quiet rest','Let the timer finish quietly.']];
function setYogaDisplay(){ $('yogaTimer').textContent=`${Math.floor(yogaSec/60)}:${String(yogaSec%60).padStart(2,'0')}`; $('yogaProgress').style.width=`${100-(yogaSec/360)*100}%`; }
function toggleYoga(){
 if(yogaRunning){clearInterval(yogaInterval);yogaRunning=false;$('yogaBtn').textContent='Resume Flow';return;}
 if(yogaSec<=0) yogaSec=360;
 yogaRunning=true;$('yogaBtn').textContent='Pause';
 yogaInterval=setInterval(()=>{yogaSec--;setYogaDisplay();const i=Math.min(5,Math.floor((360-yogaSec)/60));$('poseName').textContent=yogaPoses[i][0];$('poseDesc').textContent=yogaPoses[i][1];if(yogaSec<=0){clearInterval(yogaInterval);yogaRunning=false;$('yogaBtn').textContent='Start 6-Min Flow';setTimeout(()=>{yogaSec=360;setYogaDisplay();$('poseName').textContent='Ready to Start?';$('poseDesc').textContent='Find a quiet space. 6 minutes for gentle movement and relaxation.'},700)}} ,1000);
}
let breatheRunning=false,breatheTimer=null;
function toggleBreathe(){
 if(breatheRunning){breatheRunning=false;clearTimeout(breatheTimer);$('breatheBtn').textContent='Resume';return;}
 breatheRunning=true;$('breatheBtn').textContent='Pause';let i=0;
 const cycle=[['Breathe In','Slowly and comfortably',4000],['Hold','Relax your shoulders',7000],['Breathe Out','Slowly and comfortably',8000]];
 const run=()=>{if(!breatheRunning)return;const c=cycle[i];$('breatheTimer').textContent=c[0];$('breatheInstruction').textContent=c[1];$('breatheProgress').style.width=`${((i+1)/3)*100}%`;breatheTimer=setTimeout(()=>{i=(i+1)%3;run()},c[2])};run();
}
let heatInterval=null,heatSec=1200,heatRunning=false;
function setHeatDisplay(){$('heatTimer').textContent=`${Math.floor(heatSec/60)}:${String(heatSec%60).padStart(2,'0')}`;}
function toggleHeat(){
 if(heatRunning){clearInterval(heatInterval);heatRunning=false;$('heatBtn').textContent='Resume Timer';return;}
 if(heatSec<=0)heatSec=1200;
 heatRunning=true;$('heatBtn').textContent='Pause Timer';
 heatInterval=setInterval(()=>{heatSec--;setHeatDisplay();if(heatSec<=0){clearInterval(heatInterval);heatRunning=false;heatSec=1200;$('heatBtn').textContent='Start 20-Min Timer';setTimeout(setHeatDisplay,500);}},1000);
}
const pointTimers={};function startPointTimer(seconds,id){clearInterval(pointTimers[id]);let sec=seconds;const el=$(id+'Timer');if(!el)return;el.style.display='block';el.textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;pointTimers[id]=setInterval(()=>{sec--;el.textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;if(sec<=0){clearInterval(pointTimers[id]);pointTimers[id]=null;el.textContent='Done';setTimeout(()=>el.style.display='none',1500)}},1000);}

let selectedSymptoms=[];
function toggleSymptom(el){el.classList.toggle('active');const s=el.textContent.trim();selectedSymptoms=selectedSymptoms.includes(s)?selectedSymptoms.filter(x=>x!==s):[...selectedSymptoms,s];}
function saveLog(){
 const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]');
 logs.unshift({date:new Date().toISOString(),level:Number($('comfortLevel').value),symptoms:[...selectedSymptoms],note:$('comfortNote').value.trim()});
 localStorage.setItem('hercalm_logs',JSON.stringify(logs.slice(0,90)));$('comfortNote').value='';selectedSymptoms=[];document.querySelectorAll('#symptomBadges .badge').forEach(b=>b.classList.remove('active'));loadHistory();alert('Saved locally.');
}
function loadHistory(){
 const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]');
 $('historyList').innerHTML=logs.length?logs.map(l=>`<div style="border-bottom:1px solid #F3F4F6;padding:8px 0"><strong>${new Date(l.date).toLocaleDateString()}</strong> · Comfort level: ${l.level}/10<br><span style="font-size:12px;color:var(--gray)">${(l.symptoms||[]).join(', ')||'No tags'}</span>${l.note?`<br><em style="font-size:12px">${escapeHtml(l.note)}</em>`:''}</div>`).join(''):'No logs yet.';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
let currentMood=0;
function setMood(v,el){currentMood=v;document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');$('moodMessage').textContent=['','A very low day','A low day','Neutral','A good day','A great day'][v];}
function saveMood(){if(!currentMood){alert('Choose a mood first.');return}const m=JSON.parse(localStorage.getItem('hercalm_moods')||'[]');m.unshift({date:new Date().toISOString(),mood:currentMood});localStorage.setItem('hercalm_moods',JSON.stringify(m.slice(0,90)));loadMoods();currentMood=0;document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));$('moodMessage').textContent='Saved locally.'}
function loadMoods(){const m=JSON.parse(localStorage.getItem('hercalm_moods')||'[]'),e=['','😭','😔','😐','🙂','😊'];$('moodHistory').innerHTML=m.length?m.slice(0,7).map(x=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F3F4F6"><span>${new Date(x.date).toLocaleDateString()}</span><span style="font-size:20px">${e[x.mood]}</span></div>`).join(''):'No mood logs yet.';}

let soundInterval=null,soundSec=0,soundCtx=null,soundSource=null;
function stopSound(){if(soundInterval)clearInterval(soundInterval);soundInterval=null;if(soundSource){try{soundSource.stop()}catch(e){}soundSource=null}if(soundCtx){try{soundCtx.close()}catch(e){}soundCtx=null}document.querySelectorAll('[id$="Timer"]').forEach(el=>{if(['rainTimer','wavesTimer','whiteTimer'].includes(el.id)){el.style.display='none'}})}
async function playSound(type){
 stopSound();const d={rain:300,waves:300,white:600};soundSec=d[type]||300;const el=$(type+'Timer');if(!el)return;el.style.display='block';el.textContent=`${Math.floor(soundSec/60)}:${String(soundSec%60).padStart(2,'0')}`;
 try{
  soundCtx=new (window.AudioContext||window.webkitAudioContext)();if(soundCtx.state==='suspended')await soundCtx.resume();
  const buffer=soundCtx.createBuffer(1,soundCtx.sampleRate*2,soundCtx.sampleRate),data=buffer.getChannelData(0);let last=0;
  for(let i=0;i<data.length;i++){const n=Math.random()*2-1;if(type==='white')data[i]=n*0.16;else if(type==='waves'){last=last*0.985+n*0.015;data[i]=last*0.55}else{last=last*0.93+n*0.07;data[i]=last*0.32}}
  soundSource=soundCtx.createBufferSource();soundSource.buffer=buffer;soundSource.loop=true;const gain=soundCtx.createGain();gain.gain.value=0.12;soundSource.connect(gain).connect(soundCtx.destination);soundSource.start();
 }catch(e){el.textContent='Timer only — sound unavailable'}
 soundInterval=setInterval(()=>{soundSec--;el.textContent=`${Math.floor(soundSec/60)}:${String(soundSec%60).padStart(2,'0')}`;if(soundSec<=0){stopSound();el.textContent='Done'}},1000);
}
function toggleFAQ(el){const a=el.querySelector('.faq-answer'),show=a.classList.contains('hidden');document.querySelectorAll('.faq-answer').forEach(x=>x.classList.add('hidden'));if(show)a.classList.remove('hidden')}
function loadFAQs(){$('faqList').innerHTML=FAQS.map(f=>`<div class="faq-item" onclick="toggleFAQ(this)"><strong>${escapeHtml(f.q)}</strong><p class="faq-answer hidden">${escapeHtml(f.a)}</p></div>`).join('')}

let stretchInterval=null,stretchSec=300,stretchRunning=false;
const stretchSteps=[['Shoulder rolls',60],['Neck side stretch',45],['Seated side reach',45],['Gentle torso turn',45],['Ankle circles',30],['Quiet breathing',75]];
function toggleStretch(){if(stretchRunning){clearInterval(stretchInterval);stretchRunning=false;$('stretchBtn').textContent='Resume';return}stretchRunning=true;$('stretchBtn').textContent='Pause';stretchInterval=setInterval(()=>{stretchSec--;let elapsed=300-stretchSec,acc=0;for(const s of stretchSteps){acc+=s[1];if(elapsed<acc){$('stretchStep').textContent=s[0]+' • '+(acc-elapsed)+' sec';break}}$('stretchTimer').textContent=`${String(Math.floor(stretchSec/60)).padStart(2,'0')}:${String(stretchSec%60).padStart(2,'0')}`;$('stretchProgress').style.width=`${elapsed/300*100}%`;if(stretchSec<=0){clearInterval(stretchInterval);stretchRunning=false;stretchSec=300;$('stretchTimer').textContent='05:00';$('stretchProgress').style.width='0%';$('stretchBtn').textContent='Start 5-Min Reset';$('stretchStep').textContent='Shoulder rolls • 60 sec'}},1000)}

let hydrateInterval=null,hydrateSec=1800,hydrateRunning=false;
function setHydrateDisplay(){$('hydrateTimer').textContent=`${String(Math.floor(hydrateSec/60)).padStart(2,'0')}:${String(hydrateSec%60).padStart(2,'0')}`;}
function toggleHydrate(){if(hydrateRunning){clearInterval(hydrateInterval);hydrateRunning=false;$('hydrateBtn').textContent='Resume Reminder';return}if(hydrateSec<=0)hydrateSec=1800;hydrateRunning=true;$('hydrateBtn').textContent='Pause';hydrateInterval=setInterval(()=>{hydrateSec--;setHydrateDisplay();if(hydrateSec<=0){clearInterval(hydrateInterval);hydrateRunning=false;hydrateSec=1800;$('hydrateBtn').textContent='Start 30-Min Reminder';alert('Reminder complete. If you want a drink, take a comfortable break.');setHydrateDisplay()}},1000)}
function localDateKey(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
function logWater(){const k='hercalm_water_'+localDateKey();localStorage.setItem(k,String(Number(localStorage.getItem(k)||0)+1));renderWater()}
function renderWater(){$('waterCount').textContent='Glasses logged today: '+(localStorage.getItem('hercalm_water_'+localDateKey())||0)}

function calculateCycle(){
 const d=new Date($('cycleStart').value+'T12:00:00'),len=Math.min(60,Math.max(15,Number($('cycleLength').value)||28));if(Number.isNaN(d.getTime())){alert('Choose a date.');return}
 const add=n=>{const x=new Date(d);x.setDate(x.getDate()+n);return x.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})};
 const dates=[1,2,3].map(i=>`<li style="margin:8px 0">Estimated cycle ${i}: <strong>${add(len*i)}</strong></li>`).join('');
 $('cycleResult').classList.remove('hidden');$('cycleResult').innerHTML=`<h3>Planning dates</h3><ul style="list-style:none;padding:0">${dates}</ul><p style="font-size:12px;color:var(--gray);margin-top:12px">These are calendar estimates based only on the date and cycle length you entered. Real cycles can vary.</p>`;
}

function renderInsights(){
 const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]'),m=JSON.parse(localStorage.getItem('hercalm_moods')||'[]');
 const avg=logs.length?(logs.reduce((a,x)=>a+Number(x.level||0),0)/logs.length).toFixed(1):'—';
 const tagCounts={};logs.forEach(x=>(x.symptoms||[]).forEach(t=>tagCounts[t]=(tagCounts[t]||0)+1));
 const topTags=Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t,n])=>`${escapeHtml(t)} (${n})`).join(', ')||'No repeated tags yet';
 $('insightStats').innerHTML=`<div class="stat"><strong>${logs.length}</strong><br><small>comfort logs</small></div><div class="stat"><strong>${avg}</strong><br><small>avg rating</small></div><div class="stat"><strong>${m.length}</strong><br><small>mood logs</small></div><div class="stat"><strong>${logs.reduce((a,x)=>a+(x.symptoms||[]).length,0)}</strong><br><small>tags logged</small></div>`;
 $('insightText').innerHTML=logs.length?`<h3>Your local pattern summary</h3><p>Most frequently logged tags: <strong>${topTags}</strong>.</p><p style="margin-top:8px">This is a simple summary of entries stored in this browser. It does not interpret or diagnose health conditions.</p>`:'<h3>Start logging</h3><p>Add a few tracker entries and mood check-ins to see your own local activity summary here.</p>';
}

async function generateCalmPlan(){
 const result=$('aiResult'),button=document.querySelector('#ai button.btn');result.classList.remove('hidden');result.innerHTML='<strong>Creating your CalmPlan…</strong><p style="color:var(--gray)">Please wait.</p>';if(button)button.disabled=true;
 const payload={mood:$('aiMood').value,goal:$('aiGoal').value,time:$('aiTime').value,note:$('aiNote').value.trim().slice(0,400)};
 try{
  const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'AI service unavailable');
  if(typeof data.text!=='string'||!data.text.trim())throw new Error('AI returned an empty response.');
  result.innerHTML=`<h3>✨ Your CalmPlan</h3><div style="white-space:pre-wrap;line-height:1.65">${escapeHtml(data.text)}</div><p style="font-size:11px;color:var(--gray);margin-top:14px">General wellness only — not medical advice.</p>`;
 }catch(e){const msg=e.message||'AI service unavailable';result.innerHTML=`<h3>CalmPlan unavailable</h3><p style="color:var(--gray)">${escapeHtml(msg)}</p><p style="font-size:12px;color:var(--gray);margin-top:8px">If you are deploying the source, confirm the server-side <code>GEMINI_API_KEY</code> is configured.</p>`}
 finally{if(button)button.disabled=false}
}

function resetAllData(){
 if(!confirm('Delete all HerCalm logs, moods and local water counts?'))return;
 Object.keys(localStorage).filter(k=>k.startsWith('hercalm_')).forEach(k=>localStorage.removeItem(k));loadHistory();loadMoods();renderWater();alert('Local HerCalm data deleted.');
}
document.addEventListener('DOMContentLoaded',()=>{loadHistory();loadMoods();loadFAQs();checkDailyMessage();renderWater();const d=new Date();d.setDate(d.getDate()-27);$('cycleStart').value=localDateKey(d);});
