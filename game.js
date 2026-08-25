/* IMG: asphalt grass player player_up player_side dumpster bench bottle scrap
   tree block shopfront scrapyard pawnshop station construction car streetlamp dog (.png) */
const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const mm=document.getElementById('minimap'),mctx=mm.getContext('2d');
const WORLD={w:2000,h:1500};
const zones={
 park:{x:100,y:100,w:600,h:500,label:'🌳 PARK',lvl:1},
 plac:{x:800,y:150,w:500,h:350,label:'🏙️ PLAC',lvl:1},
 bloki:{x:1400,y:100,w:500,h:450,label:'🏢 BLOKI',lvl:2},
 sklep:{x:100,y:750,w:350,h:300,label:'🏪 SKLEP',lvl:1},
 skup:{x:1500,y:700,w:400,h:300,label:'⚙️ SKUP',lvl:1},
 budowa:{x:800,y:700,w:500,h:400,label:'🏗️ BUDOWA',lvl:4},
 lombard:{x:450,y:1150,w:320,h:280,label:'💎 LOMBARD',lvl:1},
 dworzec:{x:1250,y:1100,w:650,h:350,label:'🚉 DWORZEC',lvl:3},
 magazyn:{x:80,y:1150,w:330,h:280,label:'📦 MAGAZYNY',lvl:12}
};
const ZSHORT={park:'PARK',plac:'PLAC',bloki:'BLOKI',sklep:'SKLEP',skup:'SKUP',budowa:'BUDOWA',lombard:'LOMBARD',dworzec:'DWORZEC',magazyn:'MAGAZYNY'};
const bench={x:330,y:280,w:120,h:60};
const basePos={x:230,y:190};
const gymPos={x:1650,y:480};
const dogPos={x:520,y:520};
let DUMPSTERS=[{x:300,y:250,l:0},{x:700,y:520,l:0},{x:1550,y:300,l:0},{x:1700,y:450,l:0},{x:1400,y:1250,l:0},{x:1750,y:1320,l:0}];
const DECOR=[
 {s:'tree',x:150,y:150,w:70},{s:'tree',x:600,y:180,w:80},{s:'tree',x:200,y:560,w:70},{s:'tree',x:620,y:520,w:75},{s:'tree',x:450,y:140,w:65},{s:'tree',x:140,y:430,w:70},
 {s:'streetlamp',x:760,y:300,w:55},{s:'streetlamp',x:1250,y:420,w:55},{s:'streetlamp',x:500,y:700,w:55},{s:'streetlamp',x:1100,y:620,w:55},{s:'streetlamp',x:760,y:1100,w:55},
 {s:'car',x:860,y:470,w:95},{s:'car',x:980,y:470,w:95},{s:'car',x:1450,y:560,w:95},{s:'car',x:620,y:1160,w:95},
 {s:'block',x:1480,y:170,w:170},{s:'block',x:1800,y:200,w:160},{s:'block',x:1850,y:430,w:150},
 {s:'shopfront',x:275,y:900,w:150},{s:'scrapyard',x:1700,y:850,w:150},{s:'pawnshop',x:610,y:1290,w:140},{s:'station',x:1700,y:1200,w:200},
 {s:'construction',x:900,y:800,w:90},{s:'construction',x:1150,y:950,w:90},{s:'construction',x:950,y:1010,w:80},
 {s:'construction',x:200,y:1260,w:90},{s:'construction',x:320,y:1330,w:80}
];
const LOOT={bottle:{name:'Butelka',w:1,xp:1},can:{name:'Puszka',w:1,xp:1},scrap:{name:'Złom',w:2,xp:3},copper:{name:'Miedź',w:2,xp:8},electro:{name:'Elektronika',w:3,xp:15}};
const JUNK=[
 {id:'watch',icon:'⌚',name:'Zegarek dziadka',val:60},
 {id:'phone',icon:'📱',name:'Stary telefon',val:45},
 {id:'ring',icon:'💍',name:'Pierścionek',val:90},
 {id:'vhs',icon:'📼',name:'Kaseta VHS',val:25},
 {id:'knife',icon:'🔪',name:'Scyzoryk',val:40,slot:'weapon',stat:'sila',bonus:2},
 {id:'chain',icon:'⛓️',name:'Łańcuch',val:55,slot:'weapon',stat:'sila',bonus:3},
 {id:'bat',icon:'🏏',name:'Pałka',val:90,slot:'weapon',stat:'sila',bonus:3,price:180,min:3},
 {id:'spring',icon:'🔪',name:'Nóż sprężynowy',val:150,slot:'weapon',stat:'sila',bonus:5,price:300,min:5},
 {id:'machete',icon:'🗡️',name:'Macheta',val:300,slot:'weapon',stat:'sila',bonus:8,price:800,min:7},
 {id:'crowbar',icon:'⚒️',name:'Łom "Prezes"',val:500,slot:'weapon',stat:'sila',bonus:12,price:2000,min:9},
 {id:'jacket',icon:'🧥',name:'Skórzana kurtka',val:70,slot:'armor',stat:'odp',bonus:2},
 {id:'helmet',icon:'⛑️',name:'Kask',val:50,slot:'armor',stat:'odp',bonus:1},
 {id:'vest',icon:'🦺',name:'Kamizelka',val:200,slot:'armor',stat:'odp',bonus:3,price:500,min:6},
 {id:'charm',icon:'🧿',name:'Amulet',val:80,slot:'trinket',stat:'zrec',bonus:2},
 {id:'medal',icon:'🎖️',name:'Medal',val:65,slot:'trinket',stat:'charyzma',bonus:2}
];
const SHOP=[
 {id:'water',name:'🥤 Woda',price:8},
 {id:'bread',name:'🍔 Bułka',price:10},
 {id:'conserve',name:'🥫 Konserwa x2',price:30},
 {id:'energy',name:'⚡ Energetyk',price:25},
 {id:'beer',name:'🍺 Piwo (BUFF)',price:12},
 {id:'jabol',name:'🍷 Jabol (BUFF+KAC)',price:15},
 {id:'cigs',name:'🚬 Fajka (BUFF)',price:10},
 {id:'grab',name:'🥢 Chwytak (+zasięg)',price:60},
 {id:'bag',name:'👜 Torba',price:25},
 {id:'backpack',name:'🎒 Plecak',price:80,min:2},
 {id:'gloves',name:'🧤 Rękawice',price:120,min:2},
 {id:'cart',name:'🛒 Wózek',price:250,min:4},
 {id:'radio',name:'📻 Radio (offline +50%)',price:400,min:5}
];
const BASES=[
 {name:'Ławka',cost:0,min:1},
 {name:'Karton',cost:30,min:1},
 {name:'Namiot',cost:150,min:2},
 {name:'Melina w piwnicy',cost:1000,min:5},
 {name:'Garaż',cost:5000,min:10},
 {name:'Kamienica',cost:20000,min:15},
 {name:'WILLA PREZESA 👑',cost:100000,min:20}
];
const BICON=['','📦','','🏚️','🏠','','🏰'];
const BQ=[{e:40,h:20,thief:.25},{e:60,h:30,thief:.2},{e:90,h:50,thief:.15},{e:95,h:55,thief:.1},{e:100,h:60,thief:.05},{e:100,h:70,thief:0},{e:100,h:80,thief:0}];
const FURN=[
 {id:'sleepingbag',icon:'🛏️',name:'Śpiwór',cost:200,desc:'sen +10% energii'},
 {id:'light',icon:'💡',name:'Oświetlenie',cost:250,desc:'+5 energii co rano'},
 {id:'stove',icon:'🔥',name:'Koza',cost:300,desc:'głód/pragnienie -20%'},
 {id:'doghouse',icon:'🐕',name:'Buda Burka',cost:400,desc:'Burek gryzie i znajduje częściej'},
 {id:'safe',icon:'🗄️',name:'Sejf',cost:500,desc:'koniec kradzieży we śnie'},
 {id:'kitchen',icon:'🍳',name:'Kuchnia',cost:600,desc:'jedzenie x2'},
 {id:'tv',icon:'📺',name:'Telewizor',cost:700,desc:'sen +20 HP'},
 {id:'gym2',icon:'🏋️',name:'Domowa siłka',cost:800,desc:'trening -30%'},
 {id:'shower',icon:'🚿',name:'Prysznic',cost:900,desc:'+3 charyzmy'},
 {id:'trophy',icon:'🖼️',name:'Półka trofeów',cost:1200,desc:'+10% respektu z walk'}
];
const CREWT=[
 {id:'zbieracz',icon:'🧍',name:'Zbieracz butelek',req:'park',rate:1.2,desc:'zbiera 🍾 w Parku'},
 {id:'zlomiarz',icon:'🧎',name:'Złomiarz',req:'bloki',rate:2,desc:'ściąga 🔩 ze Śmietników'},
 {id:'zebrak',icon:'🙇',name:'Żebrak',req:'dworzec',rate:1.5,desc:'żebra na Dworcu'}
];
const JOBS=[
 {id:'sort',name:'🕐 Sortuj złom',dur:120,min:1,rew:20},
 {id:'deliver',name:'📦 Rozładuj dostawę',dur:300,min:3,rew:50},
 {id:'night',name:'🌙 Nocna zmiana',dur:1800,min:5,rew:220}
];
const TRAIND=[
 {id:'sila',icon:'💪',name:'Siła',desc:'+1 obrażeń'},
 {id:'zrec',icon:'🏃',name:'Zręczność',desc:'+2% uniku'},
 {id:'charyzma',icon:'🗣️',name:'Charyzma',desc:'+10% żebrania, -1% cen, +haracz'},
 {id:'odp',icon:'🛡️',name:'Odporność',desc:'+8 max HP'}
];
const ROSTER=[
 {n:2,str:3,hp:30,z:'bloki',name:'Zbyszek',icon:'🧔',lvl:1},
 {n:2,str:6,hp:55,z:'budowa',name:'Ochroniarz',icon:'👮',lvl:1},
 {n:2,str:5,hp:45,z:'plac',name:'Kieszonkowiec',icon:'🕵️',lvl:3},
 {n:2,str:8,hp:70,z:'dworzec',name:'Dworcowy',icon:'🧥',lvl:4},
 {n:1,str:10,hp:90,z:'bloki',name:'Mietek',icon:'👨🦲',lvl:5},
 {n:2,str:12,hp:100,z:'budowa',name:'Brygadzista',icon:'👷',lvl:6},
 {n:1,str:15,hp:130,z:'dworzec',name:'Szef Dworca',icon:'🕴️',lvl:8},
 {n:2,str:20,hp:180,z:'magazyn',name:'Celnik',icon:'🕵️️',lvl:12},
 {n:1,str:26,hp:260,z:'magazyn',name:'Magazynier Boss',icon:'📦',lvl:16}
];
let territories=[
 {id:'park',name:'Park',owner:'Ekipa spod ławki',reqLevel:2,reqRespect:5,boss:{name:'Karyn',str:4,hp:40,icon:'🧑‍🎤'},bonus:'+30% butelek',mx:550,my:480},
 {id:'bloki',name:'Śmietniki',owner:'Mietek i Spółka',reqLevel:4,reqRespect:15,boss:{name:'Mietek',str:8,hp:70,icon:'👨🦲'},bonus:'+25% złomu',mx:1650,my:200},
 {id:'budowa',name:'Budowa',owner:'Brygada',reqLevel:5,reqRespect:25,boss:{name:'Brygadzista',str:10,hp:90,icon:'👷'},bonus:'miedź bez rękawic',mx:1050,my:900},
 {id:'dworzec',name:'Dworzec',owner:'Dworcowa Ekipa',reqLevel:6,reqRespect:30,boss:{name:'Szef Dworca',str:12,hp:100,icon:'🕴️'},bonus:'+50% żebrania',mx:1570,my:1270}
];
const ORIG={park:'Ekipa spod ławki',bloki:'Mietek i Spółka',budowa:'Brygada',dworzec:'Dworcowa Ekipa'};
const ACH=[
 {id:'a1',icon:'🍾',name:'Pierwsza stówa',desc:'Sprzedaj 100 szt. lootu',rew:50,c:()=>player.tot.sell>=100},
 {id:'a2',icon:'⚔️',name:'Bijoka',desc:'Wygraj 10 walk',rew:100,c:()=>player.tot.win>=10},
 {id:'a3',icon:'🥷',name:'Złota rączka',desc:'15 udanych kradzieży',rew:100,c:()=>player.tot.steal>=15},
 {id:'a4',icon:'🗑️',name:'Archeolog',desc:'Znajdź 10 fantów w śmietnikach',rew:150,c:()=>player.tot.junk>=10},
 {id:'a5',icon:'😴',name:'Pracuś',desc:'Prześpij 10 nocy',rew:100,c:()=>player.tot.sleep>=10},
 {id:'a6',icon:'💪',name:'Kulturysta',desc:'10 treningów',rew:100,c:()=>player.tot.train>=10},
 {id:'a7',icon:'👑',name:'Feudał',desc:'Miej 1 rewir',rew:200,c:()=>ownedCount()>=1},
 {id:'a8',icon:'👥',name:'Szef',desc:'Zatrudnij 3 ludzi',rew:200,c:()=>player.crew.length>=3},
 {id:'a9',icon:'🐕',name:'Przyjaciel człowieka',desc:'Oswój Burka',rew:100,c:()=>player.pet.owned},
 {id:'a10',icon:'🏠',name:'Deweloper',desc:'Baza lvl 3 (Melina)',rew:500,c:()=>player.base>=3},
 {id:'a11',icon:'🔌',name:'Elektronik',desc:'Sprzedaj 10 elektroniki',rew:300,c:()=>player.tot.electro>=10},
 {id:'a12',icon:'🏰',name:'PREZES',desc:'Kup Willę Prezesa',rew:5000,c:()=>player.base>=6}
];
const EVENTS=[
 {txt:'👵 Babcia rozsypała zakupy na schodach...',a:{l:'🤝 Pomóż',f:()=>{player.respect+=3;gainXp(20);notify('🤝 +3 respektu, +20 XP','rare')}},b:{l:'🥷 Ukradnij portfel',f:()=>{player.money+=30;player.respect=Math.max(0,player.respect-2);player.heat=Math.min(100,player.heat+10);notify('🥷 +30zł, -2 respektu','bad')}}},
 {txt:'🧢 Koleś spod bloku proponuje "okazję" za 50zł...',a:{l:'💰 Kup (50zł)',f:()=>{player.money-=50;if(Math.random()<.5){const d=rndJunk();notify('🎁 Okazja! '+d.icon+' '+d.name,'rare')}else notify('🤡 Scam. 50zł w błoto.','bad')}},b:{l:'🚫 Odmów',f:()=>notify('🚫 Rozsądnie.')}},
 {txt:'👮 Strażnik skupu chce łapówkę 20zł za "lepsze ceny"...',a:{l:'💵 Zapłać (20zł)',f:()=>{player.money-=20;addBuff('lapowka','💵','Ceny skupu +20%',300,null,1,1.2);notify('💵 Ceny +20% przez 5 min','rare')}},b:{l:'🖕 Spław',f:()=>{if(Math.random()<.3){startFight({name:'Wściekły strażnik',str:6+Math.floor(player.day/5),hp:60,maxHp:60,icon:'👮'},null)}else notify('🖕 Udało się.')}}},
 {txt:'👛 Znalazłeś portfel z 40zł i dowodem osobistym...',a:{l:'📮 Oddaj',f:()=>{player.respect+=5;gainXp(30);notify('📮 +5 respektu, +30 XP','rare')}},b:{l:'💰 Zatrzymaj',f:()=>{player.money+=40;player.respect=Math.max(0,player.respect-3);player.heat=Math.min(100,player.heat+10);notify('💰 +40zł, -3 respektu','bad')}}}
];
function freshPlayer(){return{x:450,y:450,speed:4.6,facing:'down',money:20,hp:100,maxHp:100,hunger:0,thirst:0,energy:100,level:1,xp:0,respect:0,day:1,target:null,job:null,crew:[],crewPool:0,heat:0,stealCd:0,placToday:0,base:0,furn:{},biz:false,eventDay:0,
 tot:{sell:0,steal:0,win:0,sleep:0,train:0,junk:0,electro:0},ach:[],
 stats:{sila:1,zrec:1,charyzma:1,odp:1},buffs:[],pet:{fed:0,owned:false},junk:[],equip:{weapon:null,armor:null,trinket:null},
 inv:{bottle:0,can:0,scrap:0,copper:0,electro:0},food:0,drink:0,gear:{grab:false,bag:false,backpack:false,gloves:false,cart:false,radio:false}}}
const player=freshPlayer();
let items=[],enemies=[],floats=[],crewAgents=[],prices={},fight=null,uiOpen=false,keys={},joy={active:false,dx:0,dy:0},scale=1,curZone='',dead=false,bob=0,started=false,autoOn=false,lastCamX=0,lastCamY=0,pendingEvent=null;

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
  for(let i=0;i<r.n;i++){const p=rndIn(zones[r.z]);enemies.push({x:p.x,y:p.y,str:r.str+sc,hp:r.hp,maxHp:r.hp,zone:zones[r.z],name:r.name,icon:r.icon,vx:0,vy:0})}});
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
const PREP={player:{crop:[0.33,0.03,0.34,0.94],chroma:true},player_up:{crop:[0.33,0.03,0.34,0.94],chroma:true},player_side:{crop:[0.30,0.03,0.40,0.94],chroma:true},dumpster:{crop:[0.24,0.10,0.52,0.80]},bench:{crop:[0.24,0.14,0.52,0.70]},bottle:{crop:[0.30,0.14,0.40,0.74]},scrap:{crop:[0.20,0.12,0.60,0.76]},tree:{chroma:true},block:{chroma:true},shopfront:{chroma:true},scrapyard:{chroma:true},pawnshop:{chroma:true},station:{chroma:true},construction:{chroma:true},car:{chroma:true},streetlamp:{chroma:true},dog:{chroma:true}};
['asphalt','grass','player','player_up','player_side','dumpster','bench','bottle','scrap','tree','block','shopfront','scrapyard','pawnshop','station','construction','car','streetlamp','dog'].forEach(k=>{const im=new Image();IMGS[k]={img:im,ok:false};im.onload=()=>{IMGS[k].ok=true;prep(k)};im.src='img/'+k+'.png'});
function trim(c){const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let a=c.width,b=c.height,mx=-1,my=-1;for(let py=0;py!==c.height;py++)for(let px=0;px!==c.width;px++){if(d[(py*c.width+px)*4+3]>=11){if(a>px)a=px;if(px>mx)mx=px;if(b>py)b=py;if(py>my)my=py}}if(0>mx)return c;const t=document.createElement('canvas');t.width=mx-a+1;t.height=my-b+1;t.getContext('2d').drawImage(c,a,b,t.width,t.height,0,0,t.width,t.height);return t}
function prep(k){const P=PREP[k]||{},im=IMGS[k].img;const full=document.createElement('canvas');full.width=im.width;full.height=im.height;const fx=full.getContext('2d');fx.drawImage(im,0,0);const W=im.width,H=im.height,d=fx.getImageData(0,0,W,H).data;const corners=[0,(W-1)*4,((H-1)*W)*4,((H-1)*W+W-1)*4];const transparent=corners.some(i=>250>d[i+3]);let c=full,x=fx;
 if(!transparent&&P.crop){const sx=W*P.crop[0],sy=H*P.crop[1],sw=W*P.crop[2],sh=H*P.crop[3];c=document.createElement('canvas');c.width=sw;c.height=sh;x=c.getContext('2d');x.drawImage(full,sx,sy,sw,sh,0,0,sw,sh)}
 if(!transparent&&P.chroma){const dd=x.getImageData(0,0,c.width,c.height),p=dd.data;const a=0,b=(c.width-1)*4;const kr=(p[a]+p[b])/2,kg=(p[a+1]+p[b+1])/2,kb=(p[a+2]+p[b+2])/2;const thr=70,soft=45;for(let i=0;i!==p.length;i+=4){const dr=p[i]-kr,dg=p[i+1]-kg,db=p[i+2]-kb,ds=Math.sqrt(dr*dr+dg*dg+db*db);if(thr>ds)p[i+3]=0;else if(thr+soft>ds)p[i+3]*=(ds-thr)/soft}x.putImageData(dd,0,0)}
 SPR[k]=trim(c)}
function drawSprite(k,x,y,w,shadow,flip){const s=SPR[k];if(!s)return false;const h=w*s.height/s.width;if(shadow){ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+h*0.42,w*0.42,w*0.13,0,0,7);ctx.fill()}if(flip){ctx.save();ctx.translate(x,y);ctx.scale(-1,1);ctx.drawImage(s,-w/2,-h/2,w,h);ctx.restore()}else ctx.drawImage(s,x-w/2,y-h/2,w,h);return true}

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
 for(let t in player.inv){total+=player.inv[t]*prices[t];count+=player.inv[t]}
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

function refreshMenu(){const c=document.getElementById('btnCont');
 if(hasSave()&&!dead){c.classList.remove('hidden');try{c.textContent='💾 KONTYNUUJ — Dzień '+JSON.parse(localStorage.getItem('prezesSave')).p.day}catch(e){c.textContent='💾 KONTYNUUJ'}}
 else c.classList.add('hidden')}
function showMenu(){started=false;document.getElementById('menuOverlay').classList.remove('hidden');refreshMenu()}
document.getElementById('btnNew').onclick=()=>{
 localStorage.removeItem('prezesSave');
 Object.assign(player,freshPlayer());
 territories.forEach((t,i)=>{t.owner=['Ekipa spod ławki','Mietek i Spółka','Brygada','Dworcowa Ekipa'][i];t.underAttack=null});
 DUMPSTERS.forEach(d=>d.l=0);
 dead=false;rollPrices();spawnLoot();spawnEnemies();spawnCrew();
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
 let dx=0,dy=0;
 const manual=joy.active||keys.KeyW||keys.KeyS||keys.KeyA||keys.KeyD||keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight;
 if(manual)player.target=null;
 if(joy.active){dx=joy.dx*player.speed;dy=joy.dy*player.speed}
 else if(keys.KeyW||keys.ArrowUp)dy-=player.speed;
 else if(keys.KeyS||keys.ArrowDown)dy+=player.speed;
 else if(keys.KeyA||keys.ArrowLeft)dx-=player.speed;
 else if(keys.KeyD||keys.ArrowRight)dx+=player.speed;
 else if(player.target){const d=dist(player,player.target);if(d<6)player.target=null;else{dx=(player.target.x-player.x)/d*player.speed;dy=(player.target.y-player.y)/d*player.speed}}
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
  else if(it.type==='can'){ctx.fillStyle='#ccc';ctx.fillRect(it.x-4,it.y-6,8,12)}
  else if(it.type==='electro'){ctx.font='22px Courier New';ctx.fillText('🔌',it.x,it.y)}
  else{ctx.fillStyle='#e07b39';ctx.fillRect(it.x-5,it.y-5,10,10)}});
 crewAgents.forEach(a=>{const t=CREWT.find(x=>x.id===a.type);ctx.font='22px Courier New';ctx.fillText(t.icon,a.x,a.y)});
 enemies.forEach(e=>{if(e.hp<=0)return;ctx.font='26px Courier New';ctx.fillText(e.icon,e.x,e.y);
  ctx.fillStyle='#fff';ctx.font='9px Courier New';ctx.fillText(e.name,e.x,e.y-20)});
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
 document.getElementById('location').textContent='D'+player.day+' '+(curZone?ZSHORT[curZone]:'ULICA')+BICON[player.base]+(player.pet.owned?'🐕':'')+(player.crew.length?'👥'+player.crew.length:'');
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