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
 {id:'crowbar',icon:'⚒️',name:'Łom Prezes',val:500,slot:'weapon',stat:'sila',bonus:12,price:2000,min:9},
 {id:'jacket',icon:'🧥',name:'Skórzana kurtka',val:70,slot:'armor',stat:'odp',bonus:2},
 {id:'helmet',icon:'⛑️',name:'Kask',val:50,slot:'armor',stat:'odp',bonus:1},
 {id:'vest',icon:'🦺',name:'Kamizelka',val:200,slot:'armor',stat:'odp',bonus:3,price:500,min:6},
 {id:'charm',icon:'🧿',name:'Amulet',val:80,slot:'trinket',stat:'zrec',bonus:2},
 {id:'medal',icon:'🎖️',name:'Medal',val:65,slot:'trinket',stat:'charyzma',bonus:2}
];
const SHOP=[
 {id:'water',name:'🥤 Woda',price:8},{id:'bread',name:'🍔 Bułka',price:10},
 {id:'conserve',name:'🥫 Konserwa x2',price:30},{id:'energy',name:'⚡ Energetyk',price:25},
 {id:'beer',name:'🍺 Piwo (BUFF)',price:12},{id:'jabol',name:'🍷 Jabol (BUFF+KAC)',price:15},
 {id:'cigs',name:'🚬 Fajka (BUFF)',price:10},{id:'grab',name:'🥢 Chwytak (+zasięg)',price:60},
 {id:'bag',name:'👜 Torba',price:25},{id:'backpack',name:'🎒 Plecak',price:80,min:2},
 {id:'gloves',name:'🧤 Rękawice',price:120,min:2},{id:'cart',name:'🛒 Wózek',price:250,min:4},
 {id:'radio',name:'📻 Radio (offline +50%)',price:400,min:5}
];
const BASES=[
 {name:'Ławka',cost:0,min:1},{name:'Karton',cost:30,min:1},{name:'Namiot',cost:150,min:2},
 {name:'Melina w piwnicy',cost:1000,min:5},{name:'Garaż',cost:5000,min:10},
 {name:'Kamienica',cost:20000,min:15},{name:'WILLA PREZESA 👑',cost:100000,min:20}
];
const BICON=['','📦','⛺','🏚️','🏠','','🏰'];
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
 {n:1,str:10,hp:90,z:'bloki',name:'Mietek',icon:'👨',lvl:5},
 {n:2,str:12,hp:100,z:'budowa',name:'Brygadzista',icon:'👷',lvl:6},
 {n:1,str:15,hp:130,z:'dworzec',name:'Szef Dworca',icon:'🕴️',lvl:8},
 {n:2,str:20,hp:180,z:'magazyn',name:'Celnik',icon:'🕵️',lvl:12},
 {n:1,str:26,hp:260,z:'magazyn',name:'Magazynier Boss',icon:'📦',lvl:16}
];
let territories=[
 {id:'park',name:'Park',owner:'Ekipa spod ławki',reqLevel:2,reqRespect:5,boss:{name:'Karyn',str:4,hp:40,icon:'🧑'},bonus:'+30% butelek',mx:550,my:480},
 {id:'bloki',name:'Śmietniki',owner:'Mietek i Spółka',reqLevel:4,reqRespect:15,boss:{name:'Mietek',str:8,hp:70,icon:'👨'},bonus:'+25% złomu',mx:1650,my:200},
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
 {txt:'🧢 Koleś spod bloku proponuje okazję za 50zł...',a:{l:'💰 Kup (50zł)',f:()=>{player.money-=50;if(Math.random()<.5){const d=rndJunk();notify('🎁 Okazja! '+d.icon+' '+d.name,'rare')}else notify('🤡 Scam. 50zł w błoto.','bad')}},b:{l:'🚫 Odmów',f:()=>notify('🚫 Rozsądnie.')}},
 {txt:'👮 Strażnik skupu chce łapówkę 20zł za lepsze ceny...',a:{l:'💵 Zapłać (20zł)',f:()=>{player.money-=20;addBuff('lapowka','💵','Ceny skupu +20%',300,null,1,1.2);notify('💵 Ceny +20% przez 5 min','rare')}},b:{l:'🖕 Spław',f:()=>{if(Math.random()<.3){startFight({name:'Wściekły strażnik',str:6+Math.floor(player.day/5),hp:60,maxHp:60,icon:'👮'},null)}else notify('🖕 Udało się.')}}},
 {txt:'👛 Znalazłeś portfel z 40zł i dowodem osobistym...',a:{l:'📮 Oddaj',f:()=>{player.respect+=5;gainXp(30);notify('📮 +5 respektu, +30 XP','rare')}},b:{l:'💰 Zatrzymaj',f:()=>{player.money+=40;player.respect=Math.max(0,player.respect-3);player.heat=Math.min(100,player.heat+10);notify('💰 +40zł, -3 respektu','bad')}}}
];

