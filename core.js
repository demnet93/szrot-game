const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const mm=document.getElementById('minimap'),mctx=mm.getContext('2d');
function freshPlayer(){return{x:450,y:450,speed:4.6,facing:'down',money:20,hp:100,maxHp:100,hunger:0,thirst:0,energy:100,level:1,xp:0,respect:0,day:1,target:null,job:null,crew:[],crewPool:0,heat:0,stealCd:0,placToday:0,base:0,furn:{},biz:false,eventDay:0,
 tot:{sell:0,steal:0,win:0,sleep:0,train:0,junk:0,electro:0},ach:[],
 stats:{sila:1,zrec:1,charyzma:1,odp:1},buffs:[],pet:{fed:0,owned:false},junk:[],equip:{weapon:null,armor:null,trinket:null},
 inv:{bottle:0,can:0,scrap:0,copper:0,electro:0},food:0,drink:0,gear:{grab:false,bag:false,backpack:false,gloves:false,cart:false,radio:false}}}
const player=freshPlayer();
let items=[],enemies=[],floats=[],crewAgents=[],prices={},fight=null,uiOpen=false,keys={},joy={active:false,dx:0,dy:0},scale=1,curZone='',dead=false,bob=0,started=false,autoOn=false,lastCamX=0,lastCamY=0,pendingEvent=null,warnedHunger=false,warnedThirst=false;

let audioOn=true,AC=null;
function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function beep(f,d,type,vol,slide){if(!audioOn)return;try{const a=ac(),o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.value=f;if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),a.currentTime+d);g.gain.setValueAtTime(vol||.12,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+d);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
const SFX={click:()=>beep(600,.08,'square',.1),collect:()=>{beep(880,.07,'square',.1);setTimeout(()=>beep(1320,.09,'square',.08),70)},money:()=>{beep(988,.08,'triangle',.14);setTimeout(()=>beep(1319,.12,'triangle',.14),90)},eat:()=>beep(300,.12,'sawtooth',.1,-120),drink:()=>beep(450,.12,'sine',.14,250),hit:()=>beep(180,.12,'sawtooth',.16,-80),hurt:()=>beep(110,.18,'sawtooth',.16,-40),sleep:()=>beep(500,.4,'sine',.1,-300),level:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.12,'square',.1),i*90)),error:()=>beep(150,.15,'square',.1,-50),bark:()=>{beep(300,.08,'square',.15);setTimeout(()=>beep(360,.08,'square',.15),90)},train:()=>beep(220,.15,'square',.15,120)};

function saveGame(){if(!started)return;try{localStorage.setItem('prezesSave',JSON.stringify({p:player,t:territories.map(t=>t.owner),ua:territories.map(t=>t.underAttack||null),pr:prices,ts:Date.now()}))}catch(e){}}
function loadGame(){const s=localStorage.getItem('prezesSave');if(!s)return null;try{const d=JSON.parse(s);Object.assign(player,d.p);
 if(!player.stats)player.stats={sila:1,zrec:1,charyzma:1,odp:1};
 if(!player.buffs)player.buffs=[];if(!player.pet)player.pet={fed:0,owned:false};
 if(!player.junk)player.junk=[];if(!player.equip)player.equip={weapon:null,armor:null,trinket:null};
 if(!player.crew)player.crew=[];if(player.crewPool===undefined)player.crewPool=0;
 if(player.heat===undefined)player.heat=0;if(player.stealCd===undefined)player.stealCd=0;if(player.placToday===undefined)player.placToday=0;
 if(player.gear.radio===undefined)player.gear.radio=false;
 if(player.base===undefined){player.base=0;if(player.gear.cardboard)player.base=1;if(player.gear.tent)player.base=2}
 if(!player.furn)player.furn={};
 if(player.gear.camp&&!player.furn.sleepingbag)player.furn.sleepingbag=true;
 if(!player.tot)player.tot={sell:0,steal:0,win:0,sleep:0,train:0,junk:0,electro:0};
 if(!player.ach)player.ach=[];if(player.biz===undefined)player.biz=false;if(player.eventDay===undefined)player.eventDay=0;
 if(player.inv.electro===undefined)player.inv.electro=0;
 if(player.gear.bat){player.gear.bat=false;if(!player.equip.weapon)player.equip.weapon='bat';else player.junk.push('bat')}
 if(player.target===undefined)player.target=null;if(player.job===undefined)player.job=null;
 if(typeof player.money!=='number'||isNaN(player.money))player.money=0;
 for(let k in player.inv){if(typeof player.inv[k]!=='number'||isNaN(player.inv[k]))player.inv[k]=0}
 if(d.t)d.t.forEach((o,i)=>{if(territories[i])territories[i].owner=o});if(d.ua)d.ua.forEach((u,i)=>{if(territories[i])territories[i].underAttack=u});if(d.pr)prices=d.pr;
 player.maxHp=calcMaxHp();player.hp=Math.min(player.hp,player.maxHp);return d}catch(e){return null}}
function hasSave(){return !!localStorage.getItem('prezesSave')}
function calcMaxHp(){return 90+player.level*10+player.stats.odp*8}
function buffMod(s){let m=0;const now=Date.now();player.buffs.forEach(b=>{if(b.until>now&&b.mods&&b.mods[s])m+=b.mods[s]});return m}
function buffSell(){let m=1;const now=Date.now();player.buffs.forEach(b=>{if(b.until>now&&b.sellMult)m*=b.sellMult});return m}
function equipMod(s){let m=0;for(let slot in player.equip){const id=player.equip[slot];if(id){const d=JUNK.find(j=>j.id===id);if(d&&d.stat===s)m+=d.bonus}}return m}
function totalChar(){return player.stats.charyzma+equipMod('charyzma')+buffMod('charyzma')+(player.furn.shower?3:0)}
function buffXp(){let m=1;const now=Date.now();player.buffs.forEach(b=>{if(b.until>now&&b.xpMult)m*=b.xpMult});return m}
function addBuff(id,icon,name,sec,mods,xpMult,sellMult){player.buffs=player.buffs.filter(b=>b.id!==id);player.buffs.push({id,icon,name,until:Date.now()+sec*1000,mods,xpMult,sellMult});SFX.drink();notify(icon+' '+name+'!')}
function strength(){return player.stats.sila+equipMod('sila')+player.level+buffMod('sila')}
function defense(){return Math.floor((player.stats.odp+equipMod('odp')+buffMod('odp'))/2)}
function capacity(){return 10+(player.gear.bag?10:0)+(player.gear.backpack?25:0)+(player.gear.cart?80:0)+(player.pet.owned?5:0)}
function usedCap(){let u=0;for(let t in player.inv)u+=player.inv[t]*LOOT[t].w;return u}
function range(){return 36+(player.gear.grab?24:0)}
function discount(){return Math.min(0.2,totalChar()*0.01)}
function priceOf(it){return Math.max(1,Math.round(it.price*(1-discount())))}
function owned(id){return territories.find(t=>t.id===id).owner==='Ty'}
function ownedCount(){return territories.filter(t=>t.owner==='Ty').length}
function xpNext(){return player.level*100}
function rollPrices(){prices={bottle:+(0.4+Math.random()*0.3).toFixed(2),can:+(0.2+Math.random()*0.2).toFixed(2),scrap:+(1.5+Math.random()*1.5).toFixed(2),copper:+(8+Math.random()*7).toFixed(2),electro:+(20+Math.random()*15).toFixed(2)}}
function rndIn(z){return{x:z.x+25+Math.random()*(z.w-50),y:z.y+35+Math.random()*(z.h-50)}}
function spawnLoot(){
 items=[];
 const add=(n,type,z,extra)=>{n+=(extra||0);for(let i=0;i<n;i++){const p=rndIn(z);items.push({x:p.x,y:p.y,type,taken:false})}};
 add(10,'bottle',zones.park,owned('park')?4:0);
 add(6,'bottle',zones.plac);add(4,'can',zones.plac);
 add(6,'scrap',zones.bloki,owned('bloki')?3:0);add(6,'can',zones.bloki);
 add(5,'scrap',zones.budowa);add(4,'copper',zones.budowa);
 add(5,'electro',zones.magazyn);
}
function spawnEnemies(){
 enemies=[];
 const sc=Math.floor(player.day/5);
 ROSTER.forEach(r=>{if(player.level<r.lvl)return;
  for(let i=0;i<r.n;i++){const p=rndIn(zones[r.z]);enemies.push({x:p.x,y:p.y,str:r.str+sc,hp:r.hp,maxHp:r.hp,zone:zones[r.z],name:r.name,icon:r.icon,spr:r.spr,vx:0,vy:0})}});
}
function spawnCrew(){
 crewAgents=player.crew.map(c=>{const t=CREWT.find(x=>x.id===c.type);const z=zones[t.req];const p=rndIn(z);return{type:c.type,x:p.x,y:p.y,vx:0,vy:0,zone:z}});
}
function crewCut(){return Math.min(.75,.5+totalChar()*.01)}
function crewRate(){let r=0;player.crew.forEach(c=>{r+=CREWT.find(t=>t.id===c.type).rate});return r}
function maxWorkers(){return ownedCount()*2+Math.floor(totalChar()/4)}
function hireCost(){return 100+player.crew.length*100}
function hire(t){
 if(!owned(t.req)){SFX.error();notify('Musisz mieć rewir: '+zones[t.req].label,'bad');return}
 if(player.crew.length>=maxWorkers()){SFX.error();notify('Za mało miejsca w ekipie!','bad');return}
 if(totalChar()<3+player.crew.length*2){SFX.error();notify('Za mała charyzma! Trzeba '+(3+player.crew.length*2),'bad');return}
 const c=hireCost();
 if(player.money<c){SFX.error();notify('Rekrutacja kosztuje '+c+'zł','bad');return}
 player.money-=c;player.crew.push({type:t.id});spawnCrew();SFX.level();
 notify('👥 Zatrudniono: '+t.name+'! Haracz leci.','rare');
 saveGame();openCrew();
}
function claimPool(){
 if(player.crewPool>=1){const v=Math.floor(player.crewPool);player.crewPool-=v;player.money+=v;SFX.money();addFloat(player.x,player.y-50,'+'+v+'zł haraczu','#e0aaff');notify('👥 Haracz odebrany: +'+v+'zł','rare');saveGame();openCrew()}
 else{SFX.error();notify('Ekipa jeszcze nic nie uzbierała.','bad')}
}
function offlineRewards(d){
 const now=Date.now();const el=Math.min(480,Math.floor((now-(d.ts||now))/60000));
 if(el<2)return;
 let money=ownedCount()*Math.floor(el/2);if(player.gear.radio)money=Math.floor(money*1.5);
 if(player.biz)money+=Math.floor(el/24)*4;
 const crewOff=Math.floor(el*crewRate()*crewCut());
 const bottles=player.pet.owned?Math.min(50,Math.floor(el/10)):0;
 money+=crewOff;
 if(money>0)player.money+=money;if(bottles>0)player.inv.bottle+=bottles;
 if(money>0||bottles>0){SFX.money();notify('⏰ Offline '+el+' min: +'+money+'zł (haracz '+crewOff+'zł)'+(bottles>0?', Burek +'+bottles+'🍾':''),'rare')}
}
function addFloat(x,y,txt,color){floats.push({x,y,txt,color,t:0})}
function inRect(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
function zoneAt(x,y){for(let k in zones)if(inRect(x,y,zones[k]))return k;return null}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function nearestItem(d){let b=null,bd=d;items.forEach(it=>{if(it.taken)return;const dd=dist(player,it);if(dd<bd){bd=dd;b=it}});return b}
function nearestEnemy(d){let b=null,bd=d;enemies.forEach(e=>{if(e.hp<=0)return;const dd=dist(player,e);if(dd<bd){bd=dd;b=e}});return b}
function nearTerritory(d){return territories.find(t=>dist(player,{x:t.mx,y:t.my})<d)}
function nearestDumpster(){let b=null,bd=55;DUMPSTERS.forEach(d=>{if(d.l===player.day)return;const dd=dist(player,d);if(dd<bd){bd=dd;b=d}});return b}

const IMGS={},SPR={};
const PREP={player:{crop:[0.33,0.03,0.34,0.94],chroma:true},player_up:{crop:[0.33,0.03,0.34,0.94],chroma:true},player_side:{crop:[0.30,0.03,0.40,0.94],chroma:true},dumpster:{crop:[0.24,0.10,0.52,0.80]},bench:{crop:[0.24,0.14,0.52,0.70]},bottle:{crop:[0.30,0.14,0.40,0.74]},scrap:{crop:[0.20,0.12,0.60,0.76]},tree:{chroma:true},block:{chroma:true},shopfront:{chroma:true},scrapyard:{chroma:true},pawnshop:{chroma:true},station:{chroma:true},construction:{chroma:true},car:{chroma:true},streetlamp:{chroma:true},dog:{chroma:true},copper:{chroma:true},can:{chroma:true},electro:{chroma:true},zbyszek:{chroma:true},ochroniarz:{chroma:true},kieszonkowiec:{chroma:true},mietek:{chroma:true},brygadzista:{chroma:true},szef:{chroma:true},celnik:{chroma:true},rysio:{chroma:true},henio:{chroma:true}};
['asphalt','grass','player','player_up','player_side','dumpster','bench','bottle','scrap','tree','block','shopfront','scrapyard','pawnshop','station','construction','car','streetlamp','dog','copper','can','electro','zbyszek','ochroniarz','kieszonkowiec','mietek','brygadzista','szef','celnik','rysio','henio'].forEach(k=>{const im=new Image();IMGS[k]={img:im,ok:false};im.onload=()=>{IMGS[k].ok=true;prep(k)};im.src='img/'+k+'.png'});
function trim(c){const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let a=c.width,b=c.height,mx=-1,my=-1;for(let py=0;py!==c.height;py++)for(let px=0;px!==c.width;px++){if(d[(py*c.width+px)*4+3]>=11){if(a>px)a=px;if(px>mx)mx=px;if(b>py)b=py;if(py>my)my=py}}if(0>mx)return c;const t=document.createElement('canvas');t.width=mx-a+1;t.height=my-b+1;t.getContext('2d').drawImage(c,a,b,t.width,t.height,0,0,t.width,t.height);return t}
function prep(k){const P=PREP[k]||{},im=IMGS[k].img;const full=document.createElement('canvas');full.width=im.width;full.height=im.height;const fx=full.getContext('2d');fx.drawImage(im,0,0);const W=im.width,H=im.height,d=fx.getImageData(0,0,W,H).data;const corners=[0,(W-1)*4,((H-1)*W)*4,((H-1)*W+W-1)*4];const transparent=corners.some(i=>250>d[i+3]);let c=full,x=fx;
 if(!transparent&&P.crop){const sx=W*P.crop[0],sy=H*P.crop[1],sw=W*P.crop[2],sh=H*P.crop[3];c=document.createElement('canvas');c.width=sw;c.height=sh;x=c.getContext('2d');x.drawImage(full,sx,sy,sw,sh,0,0,sw,sh)}
 if(!transparent&&P.chroma){const dd=x.getImageData(0,0,c.width,c.height),p=dd.data;const a=0,b=(c.width-1)*4;const kr=(p[a]+p[b])/2,kg=(p[a+1]+p[b+1])/2,kb=(p[a+2]+p[b+2])/2;const thr=70,soft=45;for(let i=0;i!==p.length;i+=4){const dr=p[i]-kr,dg=p[i+1]-kg,db=p[i+2]-kb,ds=Math.sqrt(dr*dr+dg*dg+db*db);if(thr>ds)p[i+3]=0;else if(thr+soft>ds)p[i+3]*=(ds-thr)/soft}x.putImageData(dd,0,0)}
 SPR[k]=trim(c)}
function drawSprite(k,x,y,w,shadow,flip){const s=SPR[k];if(!s)return false;const h=w*s.height/s.width;if(shadow){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+h*0.42,w*0.42,w*0.13,0,0,7);ctx.fill()}if(flip){ctx.save();ctx.translate(x,y);ctx.scale(-1,1);ctx.drawImage(s,-w/2,-h/2,w,h);ctx.restore()}else ctx.drawImage(s,x-w/2,y-h/2,w,h);return true}