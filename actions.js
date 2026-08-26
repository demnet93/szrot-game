function getContext(){
 const e=nearestEnemy(45);if(e)return{type:'fight',label:'⚔️ Walcz',target:e};
 const it=nearestItem(range());if(it)return{type:'collect',label:'🤚 Zbierz',target:it};
 const du=nearestDumpster();if(du)return{type:'dump',label:'🗑️ Przeszukaj',target:du};
 if(!player.pet.owned&&player.day>=2&&dist(player,dogPos)<45)return{type:'dog',label:'🍖 Nakarm psa'};
 const t=nearTerritory(55);
 if(t&&t.owner==='Ty'&&t.underAttack)return{type:'defend',label:'🛡️ Broń!',target:t};
 if(t&&t.owner!=='Ty'){
  if(player.level>=t.reqLevel&&player.respect>=t.reqRespect)return{type:'capture',label:'👑 Przejmij',target:t};
  return{type:'locked',label:'🔒 '+t.reqLevel+'lvl/'+t.reqRespect+'resp',target:t};
 }
 if(dist(player,gymPos)<50)return{type:'train',label:'💪 Trenuj'};
 const z=zoneAt(player.x,player.y);
 if(z==='skup')return{type:'yard',label:'⚙️ Skup'};
 if(z==='lombard')return{type:'pawn',label:'💎 Lombard'};
 if(z==='sklep')return{type:'shop',label:'🛒 Sklep'};
 if(z==='plac')return{type:'beg',label:'🤲 Żebraj'};
 return null;
}
function notify(m,t='good'){const n=document.getElementById('notification');n.textContent=m;n.className='notification show '+t;clearTimeout(n._t);n._t=setTimeout(()=>n.className='notification',2200)}
function gainXp(x){x=Math.max(1,Math.round(x*buffXp()));player.xp+=x;while(player.xp>=xpNext()){player.xp-=xpNext();player.level++;player.maxHp=calcMaxHp();player.hp=player.maxHp;SFX.level();addFloat(player.x,player.y-50,'LEVEL UP!','#a8e6cf');notify('🎉 LEVEL UP! '+player.level+' lvl — nowi wrogowie i sprzęt!','rare');spawnEnemies()}}
function rndJunk(){const pool=JUNK.filter(j=>!j.price);const d=pool[Math.floor(Math.random()*pool.length)];player.junk.push(d.id);return d}
function collect(it){
 const z=zoneAt(it.x,it.y),zl=zones[z];
 if(zl&&player.level<zl.lvl){SFX.error();notify('Za niski level na '+zl.label,'bad');return}
 if(it.type==='copper'&&!player.gear.gloves&&!owned('budowa')){SFX.error();notify('Potrzebujesz rękawic! 🧤','bad');return}
 if(usedCap()+LOOT[it.type].w>capacity()){SFX.error();notify('Pełny plecak!','bad');return}
 it.taken=true;player.inv[it.type]++;
 addFloat(it.x,it.y-20,'+1 '+LOOT[it.type].name,'#4ecdc4');
 if(owned('park')&&it.type==='bottle'&&Math.random()<.3){player.inv.bottle++;notify('Bonus rewiru: +1 butelka!','rare')}
 if(player.pet.owned&&Math.random()<(player.furn.doghouse?.25:.15)){player.inv[it.type]++;SFX.bark();notify('🐕 Burek coś znalazł! +1','rare')}
 player.energy=Math.max(0,player.energy-3);
 gainXp(LOOT[it.type].xp);SFX.collect();
}
function searchDumpster(du){
 if(player.energy<5){SFX.error();notify('Za mało energii!','bad');return}
 player.energy-=5;du.l=player.day;SFX.collect();
 const r=Math.random();
 if(r<.25){notify('🗑️ Pusto... tylko muchy.','bad')}
 else if(r<.6){player.inv.scrap++;addFloat(du.x,du.y-30,'+1 🔩','#4ecdc4');notify('🗑️ Znalazłeś złom!')}
 else if(r<.8){player.inv.can++;addFloat(du.x,du.y-30,'+1 🥫','#4ecdc4');notify('🗑️ Puszka!')}
 else{const d=rndJunk();player.tot.junk++;SFX.level();addFloat(du.x,du.y-30,d.icon,'#e0aaff');notify('🗑️ COŚ CENNEGO: '+d.icon+' '+d.name+'!','rare')}
 gainXp(2);
}
function sell(){
 let total=0,count=0;
 for(let t in player.inv){total+=player.inv[t]*(prices[t]||0);count+=player.inv[t]}
 if(count===0){SFX.error();notify('Pusty plecak!','bad');return}
 let mult=buffSell();if(player.biz)mult*=1.25;
 total*=mult;
 player.tot.sell+=count;player.tot.electro+=player.inv.electro;
 player.money+=total;gainXp(Math.floor(total/2));SFX.money();
 addFloat(player.x,player.y-50,'+'+total.toFixed(0)+'zł','#ffd700');
 notify('💰 Sprzedane za '+total.toFixed(2)+'zł!'+(mult>1?' (bonus x'+mult.toFixed(2)+')':''),'rare');
 for(let t in player.inv)player.inv[t]=0;saveGame();
}
function beg(){
 if(player.energy<5){SFX.error();notify('Za mało energii!','bad');return}
 player.energy-=5;player.hunger=Math.min(100,player.hunger+2);player.thirst=Math.min(100,player.thirst+3);
 let m=Math.floor(Math.random()*13*(1+totalChar()*0.1));
 if(owned('dworzec'))m=Math.floor(m*1.5);
 player.money+=m;gainXp(2);
 if(m>0){SFX.money();addFloat(player.x,player.y-50,'+'+m+'zł','#ffd700');notify('🤲 Dostałeś '+m+'zł')}else{SFX.error();notify('Nikt nic nie dał...','bad')}
}
function steal(){
 const now=Date.now();
 if(now<player.stealCd){SFX.error();notify('😮‍💨 Za gorąco! Odczekaj '+Math.ceil((player.stealCd-now)/1000)+'s','bad');return}
 if(player.energy<8){SFX.error();notify('Za mało energii na akcję!','bad');return}
 const z=zoneAt(player.x,player.y);
 if(z!=='sklep'&&z!=='plac'){SFX.error();notify('Tu nie ma czego kraść. (sklep/plac)','bad');return}
 player.energy-=8;player.stealCd=now+30000;
 const heatPen=Math.min(.4,player.heat*.008);
 if(z==='sklep'){
  if(Math.random()<.5+player.stats.zrec*.01-heatPen){
   const g=20+Math.floor(Math.random()*40);player.money+=g;player.tot.steal++;SFX.money();addFloat(player.x,player.y-50,'🥷+'+g+'zł','#9d4edd');
   if(Math.random()<.3){const d=rndJunk();notify('🥷 Ukradłeś '+d.icon+' '+d.name+'!','rare')}else notify('🥷 Ukradłeś '+g+'zł ze sklepu!','rare');
   gainXp(6);player.respect+=1;player.heat=Math.min(100,player.heat+20);
  }else{const f=Math.min(player.money,50);player.money-=f;player.hp=Math.max(1,player.hp-15);player.respect=Math.max(0,player.respect-3);player.heat=Math.min(100,player.heat+10);SFX.hurt();addFloat(player.x,player.y-50,'🚨 -'+f+'zł','#ff6b6b');notify('🚨 Złapali Cię! -'+f+'zł i -15 HP','bad')}
 }else{
  if(player.placToday>=60){player.heat=Math.min(100,player.heat+5);SFX.error();notify('😏 Plac dziś ogołocony — wróć jutro.','bad');return}
  if(Math.random()<.6+player.stats.zrec*.01-heatPen){
   const g=5+Math.floor(Math.random()*20);player.money+=g;player.placToday+=g;player.tot.steal++;player.heat=Math.min(100,player.heat+8);
   SFX.money();addFloat(player.x,player.y-50,'🥷+'+g+'zł','#9d4edd');notify('🥷 Kieszonkowe: +'+g+'zł','rare');gainXp(4);
  }else{
   player.heat=Math.min(100,player.heat+12);SFX.hurt();
   if(player.heat>=50&&Math.random()<.5){notify('👮 STRAŻ MIEJSKA cię namierzyła!','bad');startFight({name:'Straż Miejska',str:7+Math.floor(player.day/4),hp:70+player.level*10,maxHp:70+player.level*10,icon:'👮'},null)}
   else{notify('😡 Zauważył Cię! Atakuje!','bad');startFight({name:'Wściekły przechodzień',str:4+Math.floor(player.day/5),hp:40+player.level*8,maxHp:40+player.level*8,icon:'😡'},null)}
  }
 }
 saveGame();
}
function sleepAt(){
 if(player.base>=1){sleep();return}
 const atBench=inRect(player.x,player.y,{x:bench.x-20,y:bench.y-20,w:bench.w+40,h:bench.h+40});
 if(!atBench){SFX.error();notify('Podejdź do ławki lub kup bazę (🏠)!','bad');return}
 sleep();
}
function sleep(){
 let q={...BQ[player.base]};
 if(player.furn.sleepingbag)q.e=Math.min(100,q.e+10);
 if(player.furn.tv)q.h+=20;
 if(player.furn.light)q.e=Math.min(100,q.e+5);
 if(player.furn.safe)q.thief=0;
 player.energy=Math.min(100,player.energy+q.e);player.hp=Math.min(player.maxHp,player.hp+q.h);
 player.hunger=Math.min(100,player.hunger+10);player.thirst=Math.min(100,player.thirst+12);
 SFX.sleep();player.tot.sleep++;
 if(Math.random()<q.thief&&player.money>0){
  if(player.pet.owned&&Math.random()<.7){SFX.bark();notify('🐕 Burek odpędził złodzieja!','rare')}
  else{const s=Math.floor(player.money*(player.pet.owned?.15:.3));player.money-=s;SFX.hurt();addFloat(player.x,player.y-50,'-'+s+'zł 💀','#ff6b6b');notify('😱 Okradli Cię we śnie! -'+s+'zł','bad')}
 }
 if(player.biz){player.money+=100;notify('🏭 Twój skup zarobił +100zł','rare')}
 player.day++;player.heat=Math.max(0,player.heat-50);player.placToday=0;player.stealCd=0;
 territories.forEach(t=>{
  if(t.owner==='Ty'){
   if(t.underAttack){t.owner=ORIG[t.id];t.underAttack=null;SFX.hurt();notify('💥 NIE OBRONIŁEŚ! '+t.name+' wraca do '+ORIG[t.id],'bad')}
   else if(Math.random()<.3){t.underAttack={name:'Rywale: '+ORIG[t.id],str:6+player.level*2,hp:60+player.level*10,icon:'😈'};SFX.hurt();notify('🚨 '+ORIG[t.id]+' ATAKUJE '+t.name+'! Broń go do jutra!','bad')}
  }
 });
 spawnLoot();DUMPSTERS.forEach(d=>d.l=0);spawnEnemies();rollPrices();
 notify('🌅 Dzień '+player.day+'. Nowy loot, śmietniki, wrogowie, ceny!');
 saveGame();
 if(Math.random()<.6&&player.eventDay!==player.day){player.eventDay=player.day;showEvent(EVENTS[Math.floor(Math.random()*EVENTS.length)])}
}
function showEvent(ev){
 pendingEvent=ev;uiOpen=true;
 document.getElementById('eventOverlay').classList.remove('hidden');
 document.getElementById('evTxt').textContent=ev.txt;
 document.getElementById('btnEvA').textContent=ev.a.l;
 document.getElementById('btnEvB').textContent=ev.b.l;
}
document.getElementById('btnEvA').onclick=()=>{document.getElementById('eventOverlay').classList.add('hidden');if(pendingEvent)pendingEvent.a.f();pendingEvent=null;uiOpen=false;saveGame()};
document.getElementById('btnEvB').onclick=()=>{document.getElementById('eventOverlay').classList.add('hidden');if(pendingEvent)pendingEvent.b.f();pendingEvent=null;uiOpen=false;saveGame()};
function feedDog(){
 if(player.food<=0){SFX.error();notify('Nie masz jedzenia dla psa!','bad');return}
 player.food--;player.pet.fed++;SFX.bark();addFloat(dogPos.x,dogPos.y-30,'❤️','#ff6b6b');
 if(player.pet.fed>=3){player.pet.owned=true;SFX.level();notify('🐕 BUREK dołączył!','rare')}else notify('🐶 ('+player.pet.fed+'/3)');
}
function trainCost(s){let c=20+player.stats[s]*15;if(player.furn.gym2)c=Math.round(c*.7);return c}
function openTrain(){uiOpen=true;SFX.click();document.getElementById('trainOverlay').classList.remove('hidden');
 const list=document.getElementById('trainList');list.innerHTML='';
 TRAIND.forEach(t=>{const cost=trainCost(t.id);const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+t.icon+' '+t.name+' <span class="st">['+player.stats[t.id]+']</span><br><small>'+t.desc+'</small></span><button>'+cost+'zł</button>';
  d.querySelector('button').onclick=()=>doTrain(t);list.appendChild(d)})}
function doTrain(t){const cost=trainCost(t.id);
 if(player.energy<15){SFX.error();notify('Za mało energii!','bad');return}
 if(player.money<cost){SFX.error();notify('Koszt: '+cost+'zł','bad');return}
 player.money-=cost;player.energy-=15;player.stats[t.id]++;player.tot.train++;
 if(t.id==='odp'){player.maxHp=calcMaxHp();player.hp=Math.min(player.maxHp,player.hp+8)}
 SFX.train();addFloat(player.x,player.y-50,'+1 '+t.icon,'#a8e6cf');notify(t.icon+' '+t.name+' → '+player.stats[t.id]+'!');
 gainXp(3);saveGame();openTrain()}
function openBase(){uiOpen=true;SFX.click();document.getElementById('baseOverlay').classList.remove('hidden');
 const list=document.getElementById('baseList');list.innerHTML='';
 const cur=document.createElement('div');cur.className='shop-item';
 cur.innerHTML='<span><b>'+BICON[player.base]+' '+BASES[player.base].name+'</b> (lvl '+player.base+')<br><small>Sen: +'+BQ[player.base].e+'⚡ +'+BQ[player.base].h+'HP • kradzieże '+Math.round(BQ[player.base].thief*100)+'%</small></span>';
 list.appendChild(cur);
 if(player.base<BASES.length-1){
  const nb=BASES[player.base+1];
  const row=document.createElement('div');row.className='shop-item';
  row.innerHTML='<span>⬆️ '+BICON[player.base+1]+' '+nb.name+'<br><small>wymaga '+nb.min+' lvl</small></span><button>'+nb.cost+'zł</button>';
  row.querySelector('button').onclick=upBase;
  list.appendChild(row);
 }else{
  const end=document.createElement('div');end.className='shop-item';end.innerHTML='<span>👑 JESTEŚ PREZESEM! (Emerytura w v14)</span>';list.appendChild(end);
 }
 const biz=document.createElement('div');biz.className='shop-item';
 biz.innerHTML='<span>🏭 Własny skup<br><small>+100zł/dzień, ceny sprzedaży +25% • wym. 8 lvl</small></span><button '+(player.biz?'disabled':'')+'>'+(player.biz?'MASZ':'10000zł')+'</button>';
 if(!player.biz)biz.querySelector('button').onclick=()=>{if(player.level<8){SFX.error();notify('Wymaga 8 lvl!','bad');return}if(player.money<10000){SFX.error();notify('Za mało kasy!','bad');return}player.money-=10000;player.biz=true;SFX.level();notify('🏭 TWÓJ SKUP OTWARTY! +100zł/dzień','rare');saveGame();openBase()};
 list.appendChild(biz);
 const hdr=document.createElement('div');hdr.className='shop-item';hdr.innerHTML='<span><b>🛋️ WYPOSAŻENIE</b> (od bazy lvl 3)</span>';list.appendChild(hdr);
 FURN.forEach(f=>{
  const has=player.furn[f.id];const locked=player.base<3;
  const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+f.icon+' '+f.name+' <span class="st">'+f.desc+'</span></span><button '+(has||locked?'disabled':'')+'>'+(has?'✅':locked?'🔒':f.cost+'zł')+'</button>';
  if(!has&&!locked)d.querySelector('button').onclick=()=>{if(player.money<f.cost){SFX.error();notify('Za mało kasy!','bad');return}player.money-=f.cost;player.furn[f.id]=true;SFX.money();notify(f.icon+' Kupiono: '+f.name,'rare');saveGame();openBase()};
  list.appendChild(d)});
}
function upBase(){const nb=player.base+1;if(nb>=BASES.length)return;const b=BASES[nb];
 if(player.level<b.min){SFX.error();notify('Wymaga '+b.min+' lvl!','bad');return}
 if(player.money<b.cost){SFX.error();notify('Potrzeba '+b.cost+'zł','bad');return}
 player.money-=b.cost;player.base=nb;SFX.level();
 notify('🏠 NOWA BAZA: '+b.name+'!'+(nb===6?' 👑 WILLA PREZESA! JESTEŚ LEGENDĄ!':''),'rare');
 saveGame();openBase()}
function openAch(){uiOpen=true;SFX.click();document.getElementById('achOverlay').classList.remove('hidden');
 const list=document.getElementById('achList');list.innerHTML='';
 ACH.forEach(a=>{
  const done=player.ach.includes(a.id);const can=a.c()&&!done;
  const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+a.icon+' '+a.name+' <span class="st">'+a.rew+'zł</span><br><small>'+a.desc+'</small></span><button '+(done||!can?'disabled':'')+'>'+(done?'✅':'Odbierz')+'</button>';
  if(can)d.querySelector('button').onclick=()=>{player.ach.push(a.id);player.money+=a.rew;SFX.level();notify('🏆 '+a.name+'! +'+a.rew+'zł','rare');saveGame();openAch()};
  list.appendChild(d)})}
function openInv(){uiOpen=true;SFX.click();document.getElementById('invOverlay').classList.remove('hidden');
 const list=document.getElementById('invList');list.innerHTML='';
 const w=player.equip.weapon?JUNK.find(j=>j.id===player.equip.weapon):null;
 const a=player.equip.armor?JUNK.find(j=>j.id===player.equip.armor):null;
 const tr=player.equip.trinket?JUNK.find(j=>j.id===player.equip.trinket):null;
 const eq=document.createElement('div');eq.className='shop-item';
 eq.innerHTML='<span>⚔️ '+(w?w.icon+' '+w.name+' (+'+w.bonus+')':'—')+'<br>🛡️ '+(a?a.icon+' '+a.name+' (+'+a.bonus+')':'—')+'<br>🧿 '+(tr?tr.icon+' '+tr.name+' (+'+tr.bonus+')':'—')+'</span><button>Zdejmij</button>';
 eq.querySelector('button').onclick=()=>{if(w)player.junk.push(w.id);if(a)player.junk.push(a.id);if(tr)player.junk.push(tr.id);player.equip={weapon:null,armor:null,trinket:null};SFX.click();openInv()};
 list.appendChild(eq);
 if(player.junk.length===0){const d=document.createElement('div');d.className='shop-item';d.innerHTML='<span>Brak znalezisk. Przeszukuj śmietniki! 🗑️</span>';list.appendChild(d)}
 player.junk.forEach(id=>{const j=JUNK.find(x=>x.id===id);const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+j.icon+' '+j.name+' <span class="st">'+j.val+'zł</span><br><small>'+(j.slot?'Zakładane: +'+j.bonus+' '+j.stat:'Sprzedaj w lombardzie')+'</small></span><button>'+(j.slot?'Załóż':'—')+'</button>';
  if(j.slot)d.querySelector('button').onclick=()=>equipItem(id);else d.querySelector('button').disabled=true;
  list.appendChild(d)});
 const loot=document.createElement('div');loot.className='shop-item';
 loot.innerHTML='<span>🍾'+player.inv.bottle+' 🥫'+player.inv.can+' 🔩'+player.inv.scrap+' 🟠'+player.inv.copper+' 🔌'+player.inv.electro+'<br>🍔'+player.food+' 🥤'+player.drink+'</span>';
 list.appendChild(loot);
}
function equipItem(id){const j=JUNK.find(x=>x.id===id);if(!j||!j.slot)return;
 const idx=player.junk.indexOf(id);if(idx>=0)player.junk.splice(idx,1);
 const old=player.equip[j.slot];if(old)player.junk.push(old);
 player.equip[j.slot]=id;SFX.train();notify(j.icon+' Założono: '+j.name+' (+'+j.bonus+' '+j.stat+')','rare');saveGame();openInv()}
function openPawn(){uiOpen=true;SFX.click();document.getElementById('pawnOverlay').classList.remove('hidden');
 const list=document.getElementById('pawnList');list.innerHTML='';
 if(player.junk.length===0){const d=document.createElement('div');d.className='shop-item';d.innerHTML='<span>Henio czeka... ale nie masz nic cennego. 🗑️</span>';list.appendChild(d)}
 player.junk.forEach(id=>{const j=JUNK.find(x=>x.id===id);const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+j.icon+' '+j.name+'</span><button>'+j.val+'zł</button>';
  d.querySelector('button').onclick=()=>{const i2=player.junk.indexOf(id);if(i2>=0)player.junk.splice(i2,1);player.money+=j.val;SFX.money();notify('💎 Henio kupił: '+j.name);saveGame();openPawn()};
  list.appendChild(d)})}
function openCrew(){uiOpen=true;SFX.click();document.getElementById('crewOverlay').classList.remove('hidden');
 const list=document.getElementById('crewList');list.innerHTML='';
 const info=document.createElement('div');info.className='shop-item';
 info.innerHTML='<span>👥 Ekipa: '+player.crew.length+'/'+maxWorkers()+' • Haracz: '+Math.round(crewCut()*100)+'%<br><small>Tempo: '+crewRate().toFixed(1)+' zł/min • Charyzma: '+totalChar()+'</small></span><button>💰 '+Math.floor(player.crewPool)+'zł</button>';
 info.querySelector('button').onclick=claimPool;
 list.appendChild(info);
 CREWT.forEach(t=>{
  const cnt=player.crew.filter(c=>c.type===t.id).length;
  const row=document.createElement('div');row.className='shop-item';
  row.innerHTML='<span>'+t.icon+' '+t.name+' x'+cnt+'<br><small>'+t.desc+' • '+t.rate+' zł/min • rewir: '+zones[t.req].label+'</small></span><button>'+hireCost()+'zł</button>';
  row.querySelector('button').onclick=()=>hire(t);
  list.appendChild(row)});
 const tip=document.createElement('div');tip.className='shop-item';
 tip.innerHTML='<span><small>Wymagania: rewir + charyzma '+(3+player.crew.length*2)+' • Ekipa zbiera też OFFLINE (8h)!</small></span>';
 list.appendChild(tip);
}
function fmtDur(s){return s>=60?Math.floor(s/60)+' min':s+'s'}
function openYard(){uiOpen=true;SFX.click();document.getElementById('yardOverlay').classList.remove('hidden');
 const list=document.getElementById('yardList');list.innerHTML='';
 const d=document.createElement('div');d.className='shop-item';
 d.innerHTML='<span>💰 Sprzedaj wszystko'+(player.biz?' <span class="st">(TWÓJ SKUP +25%)</span>':'')+'<br><small>🍾'+prices.bottle+' 🥫'+prices.can+' 🔩'+prices.scrap+' 🟠'+prices.copper+' 🔌'+prices.electro+'</small></span><button>Sprzedaj</button>';
 d.querySelector('button').onclick=()=>{sell();openYard()};list.appendChild(d);
 JOBS.forEach(j=>{const locked=player.level<j.min;const row=document.createElement('div');row.className='shop-item';
  row.innerHTML='<span>'+j.name+' ('+fmtDur(j.dur)+')<br><small>~'+j.rew+'zł • '+j.min+' lvl</small></span><button id="jb_'+j.id+'" '+(locked?'disabled':'')+'>'+(locked?'🔒':'Start')+'</button>';
  if(!locked)row.querySelector('button').onclick=()=>startJob(j);list.appendChild(row)});
 refreshJobBtn()}
function startJob(j){if(player.job){SFX.error();notify('Już pracujesz!','bad');return}
 player.job={id:j.id,name:j.name,until:Date.now()+j.dur*1000,rew:j.rew+Math.floor(Math.random()*10)};
 SFX.click();notify('🕐 '+j.name+': wróć za '+fmtDur(j.dur)+'!');saveGame();openYard()}
function checkJob(){if(player.job&&Date.now()>=player.job.until){player.money+=player.job.rew;gainXp(Math.floor(player.job.rew/2));SFX.money();addFloat(player.x,player.y-50,'+'+player.job.rew+'zł','#ffd700');notify('🕐 '+player.job.name+' skończona! +'+player.job.rew+'zł','rare');player.job=null;saveGame()}}
function refreshJobBtn(){if(player.job){const b=document.getElementById('jb_'+player.job.id);if(b){b.disabled=true;b.textContent='⏳'+Math.max(0,Math.ceil((player.job.until-Date.now())/1000))+'s'}}}
function openShop(){uiOpen=true;SFX.click();document.getElementById('shopOverlay').classList.remove('hidden');
 const list=document.getElementById('shopList');list.innerHTML='';
 SHOP.forEach(it=>{const has=player.gear[it.id]===true;const locked=it.min&&player.level<it.min;const p=priceOf(it);
  const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+it.name+'</span><button '+(has||locked?'disabled':'')+'>'+(has?'MASZ':locked?'🔒'+it.min:p+'zł')+'</button>';
  if(!has&&!locked)d.querySelector('button').onclick=()=>buy(it);
  list.appendChild(d)});
 const hdr=document.createElement('div');hdr.className='shop-item';hdr.innerHTML='<span><b>🗡️ BRO I PANCERZE</b> (załóż w 🎒)</span>';list.appendChild(hdr);
 JUNK.filter(j=>j.price).forEach(j=>{const locked=j.min&&player.level<j.min;
  const d=document.createElement('div');d.className='shop-item';
  d.innerHTML='<span>'+j.icon+' '+j.name+' <span class="st">+'+j.bonus+' '+j.stat+'</span></span><button '+(locked?'disabled':'')+'>'+(locked?'🔒'+j.min:priceOf(j)+'zł')+'</button>';
  if(!locked)d.querySelector('button').onclick=()=>{const p=priceOf(j);if(player.money<p){SFX.error();notify('Za mało kasy!','bad');return}player.money-=p;player.junk.push(j.id);SFX.money();notify('Kupiono '+j.icon+' '+j.name+'! Załóż w 🎒.','rare');saveGame();openShop()};
  list.appendChild(d)})}
function buy(it){if(player.gear[it.id]===true)return;const p=priceOf(it);
 if(it.min&&player.level<it.min){SFX.error();notify('Wymaga '+it.min+' lvl!','bad');return}
 if(player.money<p){SFX.error();notify('Za mało kasy!','bad');return}
 player.money-=p;SFX.money();
 if(it.id==='water')player.drink++;else if(it.id==='bread')player.food++;else if(it.id==='conserve')player.food+=2;
 else if(it.id==='energy')player.energy=Math.min(100,player.energy+30);
 else if(it.id==='beer')addBuff('beer','🍺','Piwo: +1 siła',60,{sila:1});
 else if(it.id==='jabol')addBuff('jabol','🍷','Jabol: +2 siła',90,{sila:2,odp:1});
 else if(it.id==='cigs')addBuff('cigs','🚬','Fajka: +1 charyzma',60,{charyzma:1});
 else player.gear[it.id]=true;
 gainXp(5);notify('Kupiono: '+it.name);saveGame();openShop()}
function startFight(enemy,terr,defT){fight={enemy,hp:player.hp,ehp:enemy.hp,terr,defT};uiOpen=true;SFX.hit();
 document.getElementById('fightOverlay').classList.remove('hidden');
 document.getElementById('fightTitle').textContent='⚔️ '+enemy.name+' (tura: TY)';
 document.getElementById('fightEnemyIcon').textContent=enemy.icon||'👊';
 document.getElementById('fightLog').innerHTML='';updateFightUI()}
function flog(m){document.getElementById('fightLog').innerHTML=m+'<br>'+document.getElementById('fightLog').innerHTML}
function updateFightUI(){document.getElementById('fightPlayerBar').style.width=Math.max(0,fight.hp/player.maxHp*100)+'%';
 document.getElementById('fightEnemyBar').style.width=Math.max(0,fight.ehp/fight.enemy.maxHp*100)+'%';
 document.getElementById('fightPlayerHpTxt').textContent=Math.max(0,Math.round(fight.hp))+'/'+player.maxHp;
 document.getElementById('fightEnemyName').textContent=fight.enemy.name+' '+Math.max(0,Math.round(fight.ehp))+'/'+fight.enemy.maxHp}
function endFight(win){uiOpen=false;document.getElementById('fightOverlay').classList.add('hidden');
 if(win){const e=fight.enemy,reward=e.str*5+Math.floor(Math.random()*10);
  player.money+=reward;let rg=e.str*2;if(player.furn.trophy)rg=Math.round(rg*1.1);
  player.respect+=rg;player.tot.win++;gainXp(e.str*8);SFX.money();
  addFloat(player.x,player.y-50,'+'+reward+'zł','#ffd700');
  notify('🏆 Wygrałeś z '+e.name+'! +'+reward+'zł, +'+rg+' resp','rare');
  if(fight.terr){fight.terr.owner='Ty';fight.terr.underAttack=null;player.respect+=10;notify('👑 REWIR TWÓJ: '+fight.terr.name+'! '+fight.terr.bonus,'rare')}
  else if(fight.defT){fight.defT.underAttack=null;player.respect+=5;SFX.level();notify('🛡️ OBRONIŁEŚ '+fight.defT.name+'! +5 respektu','rare');e.hp=0}
  else e.hp=0;
  player.hp=fight.hp;
 }else{player.money=Math.floor(player.money*.7);player.hp=40;player.x=450;player.y=450;SFX.hurt();notify('💀 Przegranie... -30% kasy.','bad')}
 fight=null;saveGame()}
function attack(){if(!fight)return;
 const pd=strength()+Math.floor(Math.random()*7);
 fight.ehp-=pd;SFX.hit();addFloat(fight.enemy.x,fight.enemy.y-30,'-'+pd,'#ffd700');
 flog('⚔️ Twoja tura: <b style="color:#ffd700">'+pd+'</b> obrażeń.');
 if(player.pet.owned&&Math.random()<(player.furn.doghouse?.45:.3)){const bd=2+Math.floor(Math.random()*4);fight.ehp-=bd;SFX.bark();flog('🐕 Burek gryzie: <b style="color:#a8e6cf">'+bd+'</b>!')}
 if(fight.ehp<=0){updateFightUI();endFight(true);return}
 const dodgeCh=Math.min(30,(player.stats.zrec+equipMod('zrec')+buffMod('zrec'))*2);
 if(Math.random()*100<dodgeCh){SFX.click();flog('🌀 <b style="color:#4ecdc4">Unik!</b>')}
 else{const ed=Math.max(1,fight.enemy.str+Math.floor(Math.random()*7)-defense());fight.hp-=ed;SFX.hurt();flog('💢 '+fight.enemy.name+': <b style="color:#ff6b6b">-'+ed+'</b> HP!');
  if(fight.hp<=0){updateFightUI();endFight(false);return}}
 updateFightUI()}
function flee(){if(!fight)return;
 if(Math.random()<Math.min(.9,.5+player.stats.zrec*.02)){SFX.click();notify('🏃 Uciekłeś!');uiOpen=false;document.getElementById('fightOverlay').classList.add('hidden');fight=null}
 else{const ed=Math.max(1,fight.enemy.str+Math.floor(Math.random()*7));fight.hp-=ed;SFX.hurt();flog('Nie uciekłeś! -'+ed+' HP');if(fight.hp<=0){updateFightUI();endFight(false);return}updateFightUI()}}
function doAction(){
 if(!started||dead)return;
 if(uiOpen){if(!fight&&!pendingEvent){uiOpen=false;['shopOverlay','trainOverlay','yardOverlay','pawnOverlay','invOverlay','crewOverlay','baseOverlay','achOverlay'].forEach(id=>document.getElementById(id).classList.add('hidden'))}return}
 const c=getContext();
 if(!c){SFX.error();notify('Tu nic nie ma.','bad');return}
 if(c.type==='collect')collect(c.target);
 else if(c.type==='dump')searchDumpster(c.target);
 else if(c.type==='fight')startFight(c.target,null);
 else if(c.type==='dog')feedDog();
 else if(c.type==='capture')startFight({...c.target.boss,maxHp:c.target.boss.hp},c.target);
 else if(c.type==='defend')startFight({...c.target.underAttack,maxHp:c.target.underAttack.hp},null,c.target);
 else if(c.type==='locked'){SFX.error();notify('Potrzeba: '+c.target.reqLevel+' lvl i '+c.target.reqRespect+' respektu','bad')}
 else if(c.type==='train')openTrain();
 else if(c.type==='yard')openYard();
 else if(c.type==='pawn')openPawn();
 else if(c.type==='shop')openShop();
 else if(c.type==='beg')beg();
}
function eat(){if(player.food>0){player.food--;const v=player.furn.kitchen?80:40;player.hunger=Math.max(0,player.hunger-v);SFX.eat();notify('🍔 Zjadłeś! -'+v+' głodu')}else{SFX.error();notify('Nie masz jedzenia!','bad')}}
function drinkF(){if(player.drink>0){player.drink--;player.thirst=Math.max(0,player.thirst-40);SFX.drink();notify('🥤 Wypiłeś!')}else{SFX.error();notify('Nie masz picia!','bad')}}

