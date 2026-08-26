const vgEl=document.getElementById('vignette'),wcEl=document.getElementById('warnChip');
function refreshMenu(){const c=document.getElementById('btnCont');
 if(hasSave()&&!dead){c.classList.remove('hidden');try{c.textContent='💾 KONTYNUUJ — Dzień '+JSON.parse(localStorage.getItem('prezesSave')).p.day}catch(e){c.textContent='💾 KONTYNUUJ'}}
 else c.classList.add('hidden')}
function showMenu(){started=false;document.getElementById('menuOverlay').classList.remove('hidden');refreshMenu()}
document.getElementById('btnNew').onclick=()=>{
 localStorage.removeItem('prezesSave');
 Object.assign(player,freshPlayer());
 territories.forEach((t,i)=>{t.owner=['Ekipa spod ławki','Mietek i Spółka','Brygada','Dworcowa Ekipa'][i];t.underAttack=null});
 DUMPSTERS.forEach(d=>d.l=0);
 dead=false;warnedHunger=false;warnedThirst=false;rollPrices();spawnLoot();spawnEnemies();spawnCrew();
 started=true;SFX.click();document.getElementById('menuOverlay').classList.add('hidden');
 notify('Zaczynasz od zera. Powodzenia, Prezesie! 🍾')};
document.getElementById('btnCont').onclick=()=>{const d=loadGame();
 if(d){dead=false;spawnLoot();spawnEnemies();spawnCrew();started=true;SFX.click();
  document.getElementById('menuOverlay').classList.add('hidden');
  checkJob();offlineRewards(d);notify('Wczytano zapis — Dzień '+player.day+' • Baza: '+BASES[player.base].name)}
 else{SFX.error();notify('Brak zapisu!','bad')}};
document.getElementById('btnSound').onclick=function(){audioOn=!audioOn;this.textContent=audioOn?'🔊 Dźwięk: ON':'🔇 Dźwięk: OFF';if(audioOn)SFX.click()};
document.getElementById('btnAuto').onclick=function(){autoOn=!autoOn;this.classList.toggle('on',autoOn);SFX.click();notify(autoOn?'🧲 Auto-zbieranie WŁ':'🧲 WYŁ')};
document.getElementById('btnSleep').onclick=()=>{if(started&&!dead&&!uiOpen)sleepAt()};
document.getElementById('btnSteal').onclick=()=>{if(started&&!dead&&!uiOpen)steal()};
document.getElementById('btnInv').onclick=()=>{if(started&&!dead)openInv()};
document.getElementById('btnCrew').onclick=()=>{if(started&&!dead)openCrew()};
document.getElementById('btnBase').onclick=()=>{if(started&&!dead)openBase()};
document.getElementById('btnAch').onclick=()=>{if(started&&!dead)openAch()};

let tapStart=null;
canvas.addEventListener('touchstart',e=>{tapStart={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()}},{passive:true});
canvas.addEventListener('touchend',e=>{if(!tapStart)return;const t=e.changedTouches[0];
 if(Math.hypot(t.clientX-tapStart.x,t.clientY-tapStart.y)<10&&Date.now()-tapStart.t<400){const r=canvas.getBoundingClientRect();
  player.target={x:Math.max(15,Math.min(WORLD.w-15,lastCamX+(t.clientX-r.left)/scale)),y:Math.max(15,Math.min(WORLD.h-15,lastCamY+(t.clientY-r.top)/scale))};SFX.click()}
 tapStart=null},{passive:true});
canvas.addEventListener('click',e=>{if(!started)return;const r=canvas.getBoundingClientRect();
 player.target={x:Math.max(15,Math.min(WORLD.w-15,lastCamX+(e.clientX-r.left)/scale)),y:Math.max(15,Math.min(WORLD.h-15,lastCamY+(e.clientY-r.top)/scale))}});

function resize(){const r=canvas.parentElement.getBoundingClientRect();canvas.width=r.width;canvas.height=r.height;scale=Math.min(canvas.width/800,canvas.height/600)}
window.addEventListener('resize',resize);

function update(){
 if(!started||dead||uiOpen)return;
 checkJob();
 const now=Date.now();
 for(let i=player.buffs.length-1;i>=0;i--){const b=player.buffs[i];
  if(b.until<=now){if(b.id==='jabol'){player.buffs.push({id:'kac',icon:'🤢',name:'KAC',until:now+120000,mods:{zrec:-1},xpMult:0.7});SFX.hurt();notify('🤢 KAC!','bad')}else notify(b.icon+' koniec.');player.buffs.splice(i,1)}}
 if(player.hunger>=80&&!warnedHunger){warnedHunger=true;SFX.hurt();notify('🍖 GŁÓD KRYTYCZNY! Zjedz coś, zaraz zemdlejesz (🐌 wolniejszy chód)!','bad')}
 if(player.hunger<50)warnedHunger=false;
 if(player.thirst>=80&&!warnedThirst){warnedThirst=true;SFX.hurt();notify('💧 PRAGNIENIE KRYTYCZNE! Pij wodę (🐌 wolniejszy chód)!','bad')}
 if(player.thirst<50)warnedThirst=false;
 let sp=player.speed;
 if(player.hunger>=80)sp*=.7;
 if(player.thirst>=80)sp*=.7;
 let dx=0,dy=0;
 const manual=joy.active||keys.KeyW||keys.KeyS||keys.KeyA||keys.KeyD||keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight;
 if(manual)player.target=null;
 if(joy.active){dx=joy.dx*sp;dy=joy.dy*sp}
 else if(keys.KeyW||keys.ArrowUp)dy-=sp;
 else if(keys.KeyS||keys.ArrowDown)dy+=sp;
 else if(keys.KeyA||keys.ArrowLeft)dx-=sp;
 else if(keys.KeyD||keys.ArrowRight)dx+=sp;
 else if(player.target){const d=dist(player,player.target);if(d<6)player.target=null;else{dx=(player.target.x-player.x)/d*sp;dy=(player.target.y-player.y)/d*sp}}
 if(dx&&dy&&Math.abs(dx)>1&&Math.abs(dy)>1){dx*=.707;dy*=.707}
 if(dx||dy){bob+=.25;if(Math.abs(dx)>Math.abs(dy))player.facing=dx>0?'right':'left';else player.facing=dy>0?'down':'up'}
 player.x=Math.max(15,Math.min(WORLD.w-15,player.x+dx));
 player.y=Math.max(15,Math.min(WORLD.h-15,player.y+dy));
 if(autoOn){const it=nearestItem(range());if(it)collect(it)}
 enemies.forEach(e=>{if(e.hp<=0)return;if(Math.random()<.02){e.vx=(Math.random()-.5)*1.5;e.vy=(Math.random()-.5)*1.5}e.x+=e.vx;e.y+=e.vy;
  if(e.x<e.zone.x+20||e.x>e.zone.x+e.zone.w-20)e.vx*=-1;if(e.y<e.zone.y+20||e.y>e.zone.y+e.zone.h-20)e.vy*=-1});
 crewAgents.forEach(a=>{if(Math.random()<.02){a.vx=(Math.random()-.5)*1.2;a.vy=(Math.random()-.5)*1.2}a.x+=a.vx;a.y+=a.vy;
  if(a.x<a.zone.x+20||a.x>a.zone.x+a.zone.w-20)a.vx*=-1;if(a.y<a.zone.y+20||a.y>a.zone.y+a.zone.h-20)a.vy*=-1});
 const c=getContext();
 document.getElementById('btnAction').textContent=c?c.label:'...';
 const z=zoneAt(player.x,player.y);
 if(z==='skup'&&curZone!=='skup')notify('Ceny: 🍾'+prices.bottle+' 🥫'+prices.can+' 🔩'+prices.scrap+' 🟠'+prices.copper+' 🔌'+prices.electro);
 curZone=z;
 if(player.hunger>=100||player.thirst>=100){dead=true;SFX.hurt();localStorage.removeItem('prezesSave');notify('💀 UMARŁEŚ!','bad');setTimeout(showMenu,1500)}
}
setInterval(()=>{if(started&&!dead&&!uiOpen){const m=player.furn.stove?0.8:1;player.hunger=Math.min(100,player.hunger+0.6*m);player.thirst=Math.min(100,player.thirst+0.8*m)}},4000);
setInterval(()=>{if(started&&!dead){player.crewPool=(player.crewPool||0)+crewRate()*crewCut()*(10/60)}},10000);
setInterval(saveGame,5000);

function drawTile(k,x,y,s){if(IMGS[k]&&IMGS[k].ok)ctx.drawImage(IMGS[k].img,x,y,s,s);else{ctx.fillStyle=k==='grass'?'#2d5016':'#4a4a4a';ctx.fillRect(x,y,s,s)}}
function draw(){
 ctx.fillStyle='#161616';ctx.fillRect(0,0,canvas.width,canvas.height);
 const vw=canvas.width/scale,vh=canvas.height/scale;
 lastCamX=Math.max(0,Math.min(WORLD.w-vw,player.x-vw/2));
 lastCamY=Math.max(0,Math.min(WORLD.h-vh,player.y-vh/2));
 ctx.save();ctx.setTransform(scale,0,0,scale,-lastCamX*scale,-lastCamY*scale);
 const T=128,x0=Math.floor(lastCamX/T),x1=Math.ceil((lastCamX+vw)/T),y0=Math.floor(lastCamY/T),y1=Math.ceil((lastCamY+vh)/T);
 for(let ty=y0;ty<y1;ty++)for(let tx=x0;tx<x1;tx++){const cx=tx*T,cy=ty*T;drawTile(inRect(cx+T/2,cy+T/2,zones.park)?'grass':'asphalt',cx,cy,T)}
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(zones.bloki.x,zones.bloki.y,zones.bloki.w,zones.bloki.h);
 ctx.fillStyle='rgba(107,90,26,.3)';ctx.fillRect(zones.budowa.x,zones.budowa.y,zones.budowa.w,zones.budowa.h);
 ctx.fillStyle='rgba(29,53,87,.35)';ctx.fillRect(zones.sklep.x,zones.sklep.y,zones.sklep.w,zones.sklep.h);
 ctx.fillStyle='rgba(139,69,19,.35)';ctx.fillRect(zones.skup.x,zones.skup.y,zones.skup.w,zones.skup.h);
 ctx.fillStyle='rgba(106,27,154,.3)';ctx.fillRect(zones.lombard.x,zones.lombard.y,zones.lombard.w,zones.lombard.h);
 ctx.fillStyle='rgba(55,71,79,.4)';ctx.fillRect(zones.dworzec.x,zones.dworzec.y,zones.dworzec.w,zones.dworzec.h);
 ctx.fillStyle='rgba(93,64,55,.4)';ctx.fillRect(zones.magazyn.x,zones.magazyn.y,zones.magazyn.w,zones.magazyn.h);
 ctx.fillStyle='#fff';ctx.font='bold 22px Courier New';ctx.textAlign='center';
 for(let k in zones)ctx.fillText(zones[k].label,zones[k].x+zones[k].w/2,zones[k].y+32);
 DECOR.forEach(d=>{drawSprite(d.s,d.x,d.y,d.w,true)});
 ctx.fillStyle='#ffd700';ctx.font='bold 9px Courier New';ctx.textAlign='center';
 ctx.fillText('PAN RYSIO 🏪',330,955);ctx.fillText('HENIO 💎',680,1335);
 if(player.base>0){ctx.font='40px Courier New';ctx.fillText(BICON[player.base],basePos.x,basePos.y);ctx.fillStyle='#fff';ctx.font='bold 10px Courier New';ctx.fillText('TWOJA BAZA',basePos.x,basePos.y-30)}
 if(!drawSprite('bench',bench.x+bench.w/2,bench.y+bench.h/2,110,true)){ctx.fillStyle='#6b4423';ctx.fillRect(bench.x,bench.y,bench.w,bench.h)}
 DUMPSTERS.forEach(d=>{ctx.globalAlpha=d.l===player.day?.45:1;if(!drawSprite('dumpster',d.x,d.y,110,true)){ctx.fillStyle='#1e5631';ctx.fillRect(d.x-45,d.y-45,90,90)}ctx.globalAlpha=1});
 ctx.font='34px Courier New';ctx.fillText('🏋️',gymPos.x,gymPos.y);
 ctx.fillStyle='#fff';ctx.font='bold 12px Courier New';ctx.fillText('SIŁKA',gymPos.x,gymPos.y-26);
 if(!player.pet.owned&&player.day>=2){if(!drawSprite('dog',dogPos.x,dogPos.y,44,true)){ctx.font='30px Courier New';ctx.fillText('🐶',dogPos.x,dogPos.y)}ctx.fillStyle='#fff';ctx.font='10px Courier New';ctx.fillText('bezdomny pies',dogPos.x,dogPos.y-30)}
 territories.forEach(t=>{ctx.fillStyle=t.owner==='Ty'?(t.underAttack?'#ff6b6b':'#ffd700'):'#e63946';ctx.beginPath();ctx.arc(t.mx,t.my,14,0,7);ctx.fill();
  if(t.underAttack){ctx.font='16px Courier New';ctx.fillText('⚠️',t.mx,t.my-34)}
  ctx.fillStyle='#fff';ctx.font='bold 12px Courier New';
  ctx.fillText('👑 '+t.name,t.mx,t.my-20);ctx.fillText(t.owner==='Ty'?'TWÓJ':t.owner,t.mx,t.my+28)});
 items.forEach(it=>{if(it.taken)return;
  if(it.type==='bottle'){if(!drawSprite('bottle',it.x,it.y,34,true)){ctx.fillStyle='#4ecdc4';ctx.fillRect(it.x-4,it.y-8,8,16)}}
  else if(it.type==='scrap'){if(!drawSprite('scrap',it.x,it.y,64,true)){ctx.fillStyle='#888';ctx.fillRect(it.x-6,it.y-4,12,8)}}
  else if(it.type==='can'){if(!drawSprite('can',it.x,it.y,30,true)){ctx.fillStyle='#ccc';ctx.fillRect(it.x-4,it.y-6,8,12)}}
  else if(it.type==='electro'){if(!drawSprite('electro',it.x,it.y,40,true)){ctx.font='22px Courier New';ctx.fillText('🔌',it.x,it.y)}}
  else if(it.type==='copper'){if(!drawSprite('copper',it.x,it.y,40,true)){ctx.fillStyle='#e07b39';ctx.fillRect(it.x-5,it.y-5,10,10)}}
  else{ctx.fillStyle='#e07b39';ctx.fillRect(it.x-5,it.y-5,10,10)}});
 crewAgents.forEach(a=>{const t=CREWT.find(x=>x.id===a.type);ctx.font='22px Courier New';ctx.fillText(t.icon,a.x,a.y)});
 enemies.forEach(e=>{if(e.hp<=0)return;
  if(!(e.spr&&drawSprite(e.spr,e.x,e.y,44,true))){ctx.font='26px Courier New';ctx.fillText(e.icon,e.x,e.y)}
  ctx.fillStyle='#fff';ctx.font='9px Courier New';ctx.fillText(e.name,e.x,e.y-26)});
 if(player.target){ctx.strokeStyle='rgba(255,215,0,'+(0.4+0.3*Math.sin(bob))+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(player.target.x,player.target.y,12+3*Math.sin(bob),0,7);ctx.stroke()}
 const py=player.y+Math.sin(bob)*3;
 let pkey='player',pflip=false;
 if(player.facing==='up'&&SPR['player_up'])pkey='player_up';
 else if(player.facing==='right'&&SPR['player_side'])pkey='player_side';
 else if(player.facing==='left'&&SPR['player_side']){pkey='player_side';pflip=true}
 if(!drawSprite(pkey,player.x,py,58,true,pflip)){ctx.fillStyle='#ff6b6b';ctx.beginPath();ctx.arc(player.x,py,10,0,7);ctx.fill()}
 if(player.pet.owned){if(!drawSprite('dog',player.x-30,py+14+Math.sin(bob*1.3)*2,40,true)){ctx.font='26px Courier New';ctx.fillText('🐕',player.x-28,py+16)}}
 for(let i=floats.length-1;i>=0;i--){const f=floats[i];f.t++;ctx.globalAlpha=Math.max(0,1-f.t/60);ctx.fillStyle=f.color;ctx.font='bold 16px Courier New';ctx.textAlign='center';ctx.fillText(f.txt,f.x,f.y-f.t*0.8);ctx.globalAlpha=1;if(f.t>=60)floats.splice(i,1)}
 const ni=nearestItem(range());
 if(ni){ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(ni.x,ni.y,22,0,7);ctx.stroke();ctx.setLineDash([])}
 ctx.restore();
 if(mm.classList.contains('show')){mctx.clearRect(0,0,90,68);const ms=90/WORLD.w;
  mctx.fillStyle='#3a3a3a';mctx.fillRect(0,0,90,68);
  mctx.fillStyle='#2d5016';mctx.fillRect(zones.park.x*ms,zones.park.y*ms,zones.park.w*ms,zones.park.h*ms);
  mctx.fillStyle='#8b4513';mctx.fillRect(zones.skup.x*ms,zones.skup.y*ms,zones.skup.w*ms,zones.skup.h*ms);
  mctx.fillStyle='#1d3557';mctx.fillRect(zones.sklep.x*ms,zones.sklep.y*ms,zones.sklep.w*ms,zones.sklep.h*ms);
  mctx.fillStyle='#6a1b9a';mctx.fillRect(zones.lombard.x*ms,zones.lombard.y*ms,zones.lombard.w*ms,zones.lombard.h*ms);
  mctx.fillStyle='#37474f';mctx.fillRect(zones.dworzec.x*ms,zones.dworzec.y*ms,zones.dworzec.w*ms,zones.dworzec.h*ms);
  mctx.fillStyle='#5d4037';mctx.fillRect(zones.magazyn.x*ms,zones.magazyn.y*ms,zones.magazyn.w*ms,zones.magazyn.h*ms);
  territories.forEach(t=>{mctx.fillStyle=t.owner==='Ty'?'#ffd700':'#e63946';mctx.fillRect(t.mx*ms-2,t.my*ms-2,4,4)});
  mctx.fillStyle='#fff';mctx.fillRect(bench.x*ms-1,bench.y*ms-1,3,3);
  mctx.fillStyle='#ff6b6b';mctx.fillRect(player.x*ms-2,player.y*ms-2,4,4)}
 document.getElementById('money').textContent=player.money.toFixed(0)+' zł';
 document.getElementById('level').textContent=player.level;
 document.getElementById('hp').textContent=Math.round(player.hp);
 document.getElementById('hunger').textContent=Math.floor(player.hunger)+'%';
 document.getElementById('thirst').textContent=Math.floor(player.thirst)+'%';
 document.getElementById('energy').textContent=Math.floor(player.energy)+'%';
 document.getElementById('respect').textContent=player.respect;
 document.getElementById('cap').textContent=usedCap()+'/'+capacity();
 const now=Date.now();
 let bt=player.buffs.map(b=>b.icon+Math.max(0,Math.ceil((b.until-now)/1000))+'s').join(' ');
 if(player.job)bt+=' 🕐'+Math.max(0,Math.ceil((player.job.until-now)/1000))+'s';
 if(player.crewPool>=1)bt+=' 👥'+Math.floor(player.crewPool);
 if(player.heat>0)bt+=' 🚨'+player.heat;
 document.getElementById('buffs').textContent=bt;
 let sp2=player.speed;if(player.hunger>=80)sp2*=.7;if(player.thirst>=80)sp2*=.7;
 document.getElementById('location').textContent='D'+player.day+' '+(curZone?ZSHORT[curZone]:'ULICA')+BICON[player.base]+(player.pet.owned?'🐕':'')+(player.crew.length?'👥'+player.crew.length:'')+(sp2<player.speed?' 🐌':'');
 const hCrit=player.hunger>=80,tCrit=player.thirst>=80;
 if(hCrit||tCrit){vgEl.classList.add('on');vgEl.classList.toggle('thirst',tCrit&&!hCrit);wcEl.style.display='block';wcEl.textContent=(hCrit?'🍖 GŁÓD! ':'')+(tCrit?'💧 PRAGNIENIE! ':'')+'🐌 wolniej';}
 else{vgEl.classList.remove('on');wcEl.style.display='none';}
 if(!document.getElementById('yardOverlay').classList.contains('hidden'))refreshJobBtn();
}
function loop(){update();draw();requestAnimationFrame(loop)}

const jc=document.getElementById('joystick'),js=document.getElementById('joystickStick');
let jcx=0,jcy=0;const JR=48;
function jsetup(){const r=jc.getBoundingClientRect();jcx=r.left+r.width/2;jcy=r.top+r.height/2}
function jmove(x,y){const dx=x-jcx,dy=y-jcy,d=Math.hypot(dx,dy);let mx=dx,my=dy;
 if(d>JR){mx=dx/d*JR;my=dy/d*JR;joy.dx=dx/d;joy.dy=dy/d}else{joy.dx=dx/JR;joy.dy=dy/JR}
 js.style.transform='translate(calc(-50% + '+mx+'px), calc(-50% + '+my+'px))'}
function jreset(){joy.active=false;joy.dx=0;joy.dy=0;js.style.transform='translate(-50%,-50%)'}
jc.addEventListener('touchstart',e=>{e.preventDefault();jsetup();joy.active=true;jmove(e.touches[0].clientX,e.touches[0].clientY)});
jc.addEventListener('touchmove',e=>{e.preventDefault();if(joy.active)jmove(e.touches[0].clientX,e.touches[0].clientY)});
jc.addEventListener('touchend',e=>{e.preventDefault();jreset()});
document.getElementById('btnAction').addEventListener('touchstart',e=>{e.preventDefault();doAction()});
document.getElementById('btnAction').addEventListener('click',doAction);
document.getElementById('btnEat').addEventListener('touchstart',e=>{e.preventDefault();eat()});
document.getElementById('btnEat').addEventListener('click',eat);
document.getElementById('btnDrink').addEventListener('touchstart',e=>{e.preventDefault();drinkF()});
document.getElementById('btnDrink').addEventListener('click',drinkF);
['btnCloseShop','btnCloseTrain','btnCloseYard','btnClosePawn','btnCloseInv','btnCloseCrew','btnCloseBase','btnCloseAch'].forEach(id=>{document.getElementById(id).onclick=()=>{uiOpen=false;SFX.click();['shopOverlay','trainOverlay','yardOverlay','pawnOverlay','invOverlay','crewOverlay','baseOverlay','achOverlay'].forEach(o=>document.getElementById(o).classList.add('hidden'))}});
document.getElementById('btnAttack').onclick=attack;
document.getElementById('btnFlee').onclick=flee;
document.getElementById('btnMap').onclick=()=>{mm.classList.toggle('show');SFX.click()};
document.addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyE')doAction();if(e.code==='KeyF')eat();if(e.code==='KeyG')drinkF();if(e.code==='KeyI')openInv()});
document.addEventListener('keyup',e=>keys[e.code]=false);
document.addEventListener('touchmove',e=>{if(e.target.closest('.overlay'))return;e.preventDefault()},{passive:false});

resize();rollPrices();spawnLoot();spawnEnemies();spawnCrew();
setTimeout(jsetup,100);
showMenu();
loop();