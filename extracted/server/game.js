'use strict';
// game.js — игровая логика СРЕДНЕВЕКОВЬЕ

// ─── РАСЫ ───────────────────────────────────────────────────────────
const RACES = {
  human: { name: 'Люди',  bonus: 'Железо +20%', color: '#c8a060' },
  elf:   { name: 'Эльфы', bonus: 'Дерево +20%', color: '#60c860' },
  dwarv: { name: 'Гномы', bonus: 'Камень +20%', color: '#a0a0c0' },
};

const RES       = ['gold','wood','stone','food','iron','people'];
const RES_LABEL = { gold:'Золото', wood:'Дерево', stone:'Камень', food:'Еда', iron:'Железо', people:'Люди' };
const RES_IMG   = { gold:'res/gold.png', wood:'res/wood.png', stone:'res/stone.png', food:'res/food.png', iron:'res/iron.png', people:'res/people.png' };

// ─── ЗДАНИЯ ЗАМКА ───────────────────────────────────────────────────
const BUILDINGS = {
  castle:     { name:'Ратуша',          img:'build/castle.png',     unique:true,              cost:{wood:200,stone:200,iron:50},  time:120, max:10 },
  storage:    { name:'Склад',           img:'build/storage.png',                              cost:{wood:80,stone:120,iron:0},   time:60,  max:49 },
  market:     { name:'Рынок',           img:'build/market.png',     unique:true, req:{castle:2}, cost:{wood:120,stone:60,iron:0},  time:90  },
  treasury:   { name:'Сокровищница',    img:'build/reasury.png',    unique:true, req:{castle:5}, cost:{wood:100,stone:200,iron:80}, time:180 },
  commerce:   { name:'Торговый центр',  img:'build/commerce.png',   unique:true, req:{market:3}, cost:{wood:200,stone:100,iron:50}, time:200 },
  barracks:   { name:'Казарма',         img:'build/baraks.png',     unique:true, req:{castle:2}, cost:{wood:80,stone:120,iron:60},  time:120 },
  stables:    { name:'Конюшня',         img:'build/stables.png',    unique:true, req:{castle:3}, cost:{wood:140,stone:80,iron:60},  time:160 },
  smithy:     { name:'Кузница',         img:'build/smith.png',      unique:true, req:{castle:3}, cost:{wood:60,stone:120,iron:80},  time:120 },
  workshop:   { name:'Мастерская',      img:'build/workshop.png',   unique:true, req:{castle:3}, cost:{wood:80,stone:160,iron:40},  time:120 },
  guard_tower:{ name:'Сторож.башня',    img:'build/guard_tower.png',unique:true, req:{castle:3}, cost:{wood:120,stone:160,iron:60}, time:200 },
  university: { name:'Университет',     img:'build/university.png', unique:true, req:{castle:5}, cost:{wood:200,stone:200,iron:100},time:300 },
  magscool:   { name:'Акад.магов',      img:'build/magscool.png',   unique:true, req:{castle:5}, cost:{wood:300,stone:200,iron:100},time:360 },
  magtower:   { name:'Башня арт.',      img:'build/magtower.png',   unique:true, req:{castle:5}, cost:{wood:150,stone:300,iron:100},time:300 },
  alchimia:   { name:'Алхимик',         img:'build/alchimia.png',   unique:true, req:{castle:4}, cost:{wood:60,stone:120,iron:80},  time:180 },
  temple:     { name:'Храм',            img:'build/temple.png',     unique:true, req:{castle:4}, cost:{wood:200,stone:300,iron:50},  time:240 },
  beer:       { name:'Пивоварня',       img:'build/beer.png',       unique:true, req:{castle:3}, cost:{wood:100,stone:60,iron:0},   time:120 },
  secret:     { name:'Тайник',          img:'build/secret.png',     unique:true, req:{castle:2}, cost:{wood:120,stone:60,iron:30},  time:90  },
  wisdom:     { name:'Дом мудрецов',    img:'build/wisdom_house.png',unique:true,req:{castle:3}, cost:{wood:80,stone:60,iron:30},   time:120 },
  gendel:     { name:'Гильдия',         img:'build/gendel.png',     unique:true, req:{castle:4}, cost:{wood:120,stone:80,iron:60},  time:180 },
  resident:   { name:'Шпионаж',         img:'build/resident.png',   unique:true, req:{castle:5}, cost:{wood:100,stone:100,iron:50}, time:180 },
  diplomat:   { name:'Дипломатия',      img:'build/diplomat.png',   unique:true, req:{castle:4}, cost:{wood:80,stone:80,iron:40},   time:150 },
  spycentr:   { name:'Центр разведки',  img:'build/spycentr.png',   unique:true, req:{resident:3},cost:{wood:150,stone:100,iron:80},time:220 },
  expedition: { name:'Лагерь арх.',     img:'build/expedition.png', unique:true, req:{castle:4}, cost:{wood:160,stone:80,iron:0},   time:200 },
  portal:     { name:'Портал',          img:'build/portal.png',     unique:true, req:{castle:7}, cost:{wood:300,stone:300,iron:200},time:600 },
  traveler:   { name:'Дом путеш.',      img:'build/traveler.png',   unique:true, req:{castle:6}, cost:{wood:200,stone:200,iron:100},time:300 },
  arhcamp:    { name:'Лагерь героя',    img:'build/arhcamp.png',    unique:true, req:{castle:5}, cost:{wood:180,stone:120,iron:100},time:250 },
};

// ─── ЗДАНИЯ ЗЕМЕЛЬ ──────────────────────────────────────────────────
const LAND_BUILDINGS = {
  farm_small:   { name:'Ферма',        img:'build/farm_small.png',   terrain:'grass', produces:'food',   basePerHour:80,  lvlImg:['build/farm_small.png','build/farm_avg.png','build/farm_big.png'] },
  sawmill_small:{ name:'Лесопилка',    img:'build/sawmill_small.png',terrain:'forest',produces:'wood',   basePerHour:60,  lvlImg:['build/sawmill_small.png','build/sawmill_avg.png','build/sawmill_big.png'] },
  stone_small:  { name:'Каменоломня',  img:'build/stone_small.png',  terrain:'stone', produces:'stone',  basePerHour:60,  lvlImg:['build/stone_small.png','build/stone_avg.png','build/stone_big.png'] },
  iron_small:   { name:'Жел.рудник',   img:'build/iron_small.png',   terrain:'stone', produces:'iron',   basePerHour:50,  lvlImg:['build/iron_small.png','build/iron_avg.png','build/iron_big.png'] },
  house_small:  { name:'Дом',          img:'build/house_small.png',  terrain:'grass', produces:'people', basePerHour:8,   capacity:50, lvlImg:['build/house_small.png','build/house_avg.png','build/house_big.png'] },
};

// ─── ЮНИТЫ ──────────────────────────────────────────────────────────
const UNITS = {
  // Люди
  human_swordman:  { name:'Мечник',    race:'human',img:'units/human/swordman.png',  simg:'smallunits/human/swordman.png',  atk:30, def:35, hp:40, speed:18,carry:60, upkeep:2,building:'barracks', trainTime:60, reqLvl:1,cost:{wood:50,iron:80,food:30},people:1 },
  human_javelineer:{ name:'Копейщик',  race:'human',img:'units/human/javelineer.png',simg:'smallunits/human/javelineer.png',atk:20, def:50, hp:35, speed:22,carry:50, upkeep:2,building:'barracks', trainTime:50, reqLvl:1,cost:{wood:80,iron:30,food:30},people:1 },
  human_scout:     { name:'Разведчик', race:'human',img:'units/human/scout.png',     simg:'smallunits/human/scout.png',     atk:15, def:15, hp:20, speed:8, carry:30, upkeep:1,building:'barracks', trainTime:40, reqLvl:1,cost:{wood:40,iron:20,food:20},people:1 },
  human_knight:    { name:'Рыцарь',    race:'human',img:'units/human/knight.png',    simg:'smallunits/human/knight.png',    atk:80, def:60, hp:80, speed:8, carry:100,upkeep:5,building:'stables',  trainTime:200,reqLvl:1,cost:{wood:60,iron:140,food:80},people:1 },
  human_paladin:   { name:'Паладин',   race:'human',img:'units/human/paladin.png',   simg:'smallunits/human/paladin.png',   atk:90, def:80, hp:100,speed:10,carry:80, upkeep:6,building:'stables',  trainTime:280,reqLvl:3,cost:{wood:80,iron:160,food:100},people:1 },
  human_mage:      { name:'Маг',       race:'human',img:'units/human/mage.png',      simg:'smallunits/human/mage.png',      atk:90, def:20, hp:35, speed:12,carry:30, upkeep:4,building:'magscool', trainTime:240,reqLvl:1,cost:{wood:30,iron:30,food:60},people:1 },
  human_general:   { name:'Генерал',   race:'human',img:'units/human/general.png',   simg:'smallunits/human/general.png',   atk:150,def:120,hp:200,speed:12,carry:150,upkeep:10,building:'university',trainTime:600,reqLvl:5,cost:{wood:200,iron:300,food:200},people:1 },
  // Эльфы
  elf_fighter:     { name:'Воин',      race:'elf',  img:'units/elf/fighter.png',     simg:'smallunits/elf/fighter.png',     atk:25, def:30, hp:35, speed:16,carry:50, upkeep:2,building:'barracks', trainTime:55, reqLvl:1,cost:{wood:60,iron:50,food:30},people:1 },
  elf_archer:      { name:'Лучник',    race:'elf',  img:'units/elf/archer.png',      simg:'smallunits/elf/archer.png',      atk:50, def:15, hp:25, speed:14,carry:40, upkeep:2,building:'barracks', trainTime:75, reqLvl:1,cost:{wood:80,iron:20,food:30},people:1 },
  elf_scout:       { name:'Разведчик', race:'elf',  img:'units/elf/scout.png',       simg:'smallunits/elf/scout.png',       atk:18, def:18, hp:22, speed:7, carry:35, upkeep:1,building:'barracks', trainTime:38, reqLvl:1,cost:{wood:50,iron:15,food:20},people:1 },
  elf_kenaur:      { name:'Кентавр',   race:'elf',  img:'units/elf/kenaur.png',      simg:'smallunits/elf/kenaur.png',      atk:70, def:55, hp:75, speed:7, carry:90, upkeep:5,building:'stables',  trainTime:190,reqLvl:1,cost:{wood:100,iron:60,food:80},people:1 },
  elf_edinorog:    { name:'Единорог',  race:'elf',  img:'units/elf/edinorog.png',    simg:'smallunits/elf/edinorog.png',    atk:80, def:70, hp:90, speed:8, carry:80, upkeep:6,building:'stables',  trainTime:250,reqLvl:3,cost:{wood:120,iron:40,food:100},people:1 },
  elf_ent:         { name:'Энт',       race:'elf',  img:'units/elf/ent.png',         simg:'smallunits/elf/ent.png',         atk:100,def:120,hp:150,speed:25,carry:120,upkeep:7,building:'magscool', trainTime:350,reqLvl:1,cost:{wood:200,iron:0,food:100},people:1 },
  elf_create:      { name:'Созидатель',race:'elf',  img:'units/elf/create.png',      simg:'smallunits/elf/create.png',      atk:85, def:25, hp:40, speed:11,carry:35, upkeep:4,building:'magscool', trainTime:230,reqLvl:1,cost:{wood:80,iron:40,food:80},people:1 },
  elf_general:     { name:'Генерал',   race:'elf',  img:'units/elf/general.png',     simg:'smallunits/elf/general.png',     atk:140,def:110,hp:180,speed:11,carry:140,upkeep:9,building:'university',trainTime:580,reqLvl:5,cost:{wood:200,iron:200,food:200},people:1 },
  // Гномы
  dwarv_fighter:   { name:'Воин',      race:'dwarv',img:'units/dwarv/fighter.png',   simg:'smallunits/dwarv/fighter.png',   atk:35, def:45, hp:50, speed:20,carry:70, upkeep:3,building:'barracks', trainTime:65, reqLvl:1,cost:{wood:40,iron:100,food:30},people:1 },
  dwarv_defender:  { name:'Защитник',  race:'dwarv',img:'units/dwarv/defender.png',  simg:'smallunits/dwarv/defender.png',  atk:20, def:70, hp:60, speed:25,carry:60, upkeep:3,building:'barracks', trainTime:70, reqLvl:1,cost:{wood:30,iron:120,food:30},people:1 },
  dwarv_arbalet:   { name:'Арбалетчик',race:'dwarv',img:'units/dwarv/arbalet.png',   simg:'smallunits/dwarv/arbalet.png',   atk:55, def:20, hp:30, speed:16,carry:45, upkeep:2,building:'barracks', trainTime:85, reqLvl:2,cost:{wood:60,iron:80,food:30},people:1 },
  dwarv_revolver:  { name:'Пушкарь',   race:'dwarv',img:'units/dwarv/revolver.png',  simg:'smallunits/dwarv/revolver.png',  atk:100,def:30, hp:45, speed:20,carry:50, upkeep:4,building:'stables',  trainTime:220,reqLvl:1,cost:{wood:60,iron:180,food:60},people:1 },
  dwarv_gryphon:   { name:'Грифон',    race:'dwarv',img:'units/dwarv/gryphon.png',   simg:'smallunits/dwarv/gryphon.png',   atk:90, def:65, hp:85, speed:9, carry:95, upkeep:6,building:'stables',  trainTime:260,reqLvl:3,cost:{wood:80,iron:120,food:100},people:1 },
  dwarv_yeti:      { name:'Йети',      race:'dwarv',img:'units/dwarv/yeti.png',      simg:'smallunits/dwarv/yeti.png',      atk:110,def:100,hp:130,speed:22,carry:110,upkeep:7,building:'magscool', trainTime:320,reqLvl:1,cost:{wood:100,iron:60,food:120},people:1 },
  dwarv_elder:     { name:'Старейшина',race:'dwarv',img:'units/dwarv/elder.png',     simg:'smallunits/dwarv/elder.png',     atk:80, def:40, hp:50, speed:14,carry:40, upkeep:4,building:'magscool', trainTime:210,reqLvl:1,cost:{wood:60,iron:60,food:80},people:1 },
  dwarv_general:   { name:'Генерал',   race:'dwarv',img:'units/dwarv/general.png',   simg:'smallunits/dwarv/general.png',   atk:160,def:130,hp:210,speed:13,carry:160,upkeep:10,building:'university',trainTime:620,reqLvl:5,cost:{wood:200,iron:350,food:200},people:1 },
};

// ─── РЕЙТИНГ ────────────────────────────────────────────────────────
const RATING_WEIGHTS = {
  castle:10, barracks:6, stables:6, smithy:5, university:8,
  magscool:7, magtower:7, market:5, treasury:6, temple:4,
  storage:3, workshop:4, guard_tower:4, alchimia:5, beer:3,
  secret:3, diplomat:5, resident:5, expedition:4, commerce:6,
  wisdom:3, gendel:4, spycentr:5, portal:15, traveler:8, arhcamp:6,
  farm_small:2, sawmill_small:2, stone_small:2, iron_small:2, house_small:2,
};

function calcRating(p) {
  let pts = 0;
  for (const c of [...(p.castle || []), ...(p.lands || [])]) {
    if (!c.bldId || !c.level) continue;
    const w = RATING_WEIGHTS[c.bldId] || 1;
    for (let lv = 1; lv <= c.level; lv++) pts += Math.round(w * lv * 1.5);
  }
  for (const uid in (p.army || {})) pts += Math.floor((p.army[uid] || 0) * 0.5);
  pts += Object.keys(p.techs || {}).length * 20;
  return pts;
}

function ratingDelta(bldId, toLvl) {
  return Math.round((RATING_WEIGHTS[bldId] || 1) * toLvl * 1.5);
}

// ─── РАЗМЕРЫ КАРТ ───────────────────────────────────────────────────
const CASTLE_COLS = 7, CASTLE_ROWS = 7;
const LANDS_COLS  = 10, LANDS_ROWS = 10;
const WORLD_COLS  = 20, WORLD_ROWS = 20;
const MAX_PLAYERS_PER_PROVINCE = 10;
const OASES_PER_PROVINCE = 3;

function isCastleWall(col, row) { return col===0||row===0||col===CASTLE_COLS-1||row===CASTLE_ROWS-1; }
function isLandsWall(col, row)  { return col===0||row===0||col===LANDS_COLS-1||row===LANDS_ROWS-1; }

function mulberry32(a) {
  return () => { let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; };
}
function strHash(s) { let h=5381; for (const ch of s) h=((h<<5)+h+ch.charCodeAt(0))|0; return h>>>0; }
function gridDist(a,b) { return Math.abs(a.col-b.col)+Math.abs(a.row-b.row); }

// ─── СОЗДАНИЕ КАРТ ──────────────────────────────────────────────────
function createCastleGrid() {
  const grid = [];
  for (let row=0; row<CASTLE_ROWS; row++)
    for (let col=0; col<CASTLE_COLS; col++) {
      const wall = isCastleWall(col, row);
      const center = (col===3 && row===3);
      grid.push({ col, row, type: wall?'wall':'inner', bldId: center?'castle':null, level: center?1:0 });
    }
  return grid;
}

function createLandsGrid(seed) {
  const rng = mulberry32(seed || 12345);
  const grid = [];
  for (let row=0; row<LANDS_ROWS; row++)
    for (let col=0; col<LANDS_COLS; col++) {
      const wall = isLandsWall(col, row);
      let type = 'grass';
      if (!wall) { const r=rng(); if(r<0.25) type='forest'; else if(r<0.45) type='stone'; }
      grid.push({ col, row, type: wall?'wall':type, bldId:null, level:0 });
    }
  const farm = grid.find(c=>!isLandsWall(c.col,c.row)&&c.type==='grass');
  if (farm) { farm.bldId='farm_small'; farm.level=1; }
  return grid;
}

function createWorldGrid() {
  const rng = mulberry32(99999);
  return Array.from({length:WORLD_ROWS}, (_,row) =>
    Array.from({length:WORLD_COLS}, (_,col) => {
      const r = rng();
      const type = r<0.08 ? 'bandit' : 'empty';
      return { col, row, type, power: type==='bandit'?50+Math.floor(rng()*250):0, player:null, race:null, lvl:1, resource:null };
    })
  ).flat();
}

function initProvince(world) {
  const empties = world.filter(c=>c.type==='empty');
  const rng = mulberry32(77777);
  const oasisRes = ['wood','stone','iron','food'];
  for (let i=0; i<OASES_PER_PROVINCE; i++) {
    if (!empties.length) break;
    const idx = Math.floor(rng()*empties.length);
    const cell = empties.splice(idx, 1)[0];
    cell.type = 'oasis'; cell.resource = oasisRes[i%oasisRes.length];
  }
}

function createPlayer(race, kingdom) {
  const now = Date.now();
  return {
    race, kingdom, ts: now, created: now,
    res:    { gold:5000, wood:3000, stone:3000, food:3000, iron:1500, people:100 },
    resMax: { gold:10000,wood:5000, stone:5000, food:5000, iron:5000, people:200 },
    castle: createCastleGrid(),
    lands:  createLandsGrid(strHash(kingdom)),
    queue: [], trainQueue: [], army: {}, marches: [],
    reports: [{ t:now, txt:'Добро пожаловать!', kind:'info' }],
    worldPos: null,
    techs: {},
    avatar: null, avatarBg: null, photo: null,
  };
}

function placePlayerOnWorld(world, username, race) {
  const free = world.filter(c=>c.type==='empty');
  if (!free.length) return null;
  const idx = strHash(username) % free.length;
  const cell = free[idx];
  cell.type='player'; cell.player=username; cell.race=race; cell.lvl=1;
  return { col:cell.col, row:cell.row };
}

// ─── БАЛАНС ─────────────────────────────────────────────────────────
function buildingProduction(bldId, level, race) {
  const b = LAND_BUILDINGS[bldId]; if (!b || !b.produces) return 0;
  let p = b.basePerHour * Math.pow(1.3, level-1);
  if (race==='human' && b.produces==='iron')  p *= 1.2;
  if (race==='elf'   && b.produces==='wood')  p *= 1.2;
  if (race==='dwarv' && b.produces==='stone') p *= 1.2;
  return Math.round(p);
}

function nextBuildCost(bldId, lv) {
  const def = BUILDINGS[bldId] || LAND_BUILDINGS[bldId]; if (!def) return null;
  const m = Math.pow(1.6, lv);
  return { wood:Math.round((def.cost.wood||0)*m), stone:Math.round((def.cost.stone||0)*m), iron:Math.round((def.cost.iron||0)*m), food:Math.round((def.cost.food||0)*m) };
}

function nextBuildTime(bldId, lv, clvl=1) {
  const def = BUILDINGS[bldId] || LAND_BUILDINGS[bldId]; if (!def) return 60;
  return Math.max(5, Math.round(def.time * Math.pow(1.4,lv) * Math.pow(0.92,clvl-1)));
}

function getCastleLevel(p) { const c=(p.castle||[]).find(x=>x.bldId==='castle'); return c?c.level:1; }

function reqMet(p, bldId) {
  const def = BUILDINGS[bldId]; if (!def?.req) return true;
  for (const k in def.req) {
    let lv=0; for (const c of p.castle) if(c.bldId===k) lv=Math.max(lv,c.level);
    if (lv < def.req[k]) return false;
  }
  return true;
}

function hasUnique(p, bldId) { if (!BUILDINGS[bldId]?.unique) return false; return p.castle.some(c=>c.bldId===bldId&&c.level>0); }
function canAfford(p, cost)  { for (const k in cost) if ((p.res[k]||0)<cost[k]) return false; return true; }
function payCost(p, cost)    { for (const k in cost) p.res[k] -= cost[k]; }

function computeRates(p) {
  const r = { gold:50, wood:0, stone:0, food:0, iron:0, people:0 };
  for (const c of p.lands) {
    if (!c.bldId) continue;
    const def = LAND_BUILDINGS[c.bldId]; if (!def?.produces) continue;
    r[def.produces] += buildingProduction(c.bldId, c.level, p.race);
  }
  for (const uid in p.army) {
    const n=p.army[uid]; if (!n) continue;
    const u=UNITS[uid]; if (u?.upkeep) r.food -= n * u.upkeep;
  }
  return r;
}

function recomputeMaxes(p) {
  p.resMax = { gold:10000, wood:3000, stone:3000, food:3000, iron:3000, people:100 };
  for (const c of p.castle) {
    if (c.bldId==='storage' && c.level>0) { const cap=500*Math.pow(1.5,c.level-1); p.resMax.wood+=cap; p.resMax.stone+=cap; p.resMax.iron+=cap; p.resMax.food+=cap; }
    if (c.bldId==='treasury' && c.level>0) p.resMax.gold += 500*Math.pow(1.6,c.level-1);
  }
  for (const c of p.lands) if (c.bldId==='house_small' && c.level>0) p.resMax.people += 50*Math.pow(1.4,c.level-1);
  for (const k of RES) if (p.res[k] > p.resMax[k]) p.res[k] = p.resMax[k];
}

function addReport(p, txt, kind='info') {
  p.reports.push({ t:Date.now(), txt, kind });
  if (p.reports.length > 100) p.reports.shift();
}

// ─── БОЙ ────────────────────────────────────────────────────────────
function resolveBattle(p, world, march) {
  let atkPow = 0;
  for (const uid in march.units) atkPow += (march.units[uid]||0) * (UNITS[uid]?.atk||0);
  const cell = world.find(c=>c.col===march.target.col&&c.row===march.target.row);
  if (!cell) return { win:false, survivors:{}, losses:march.units, lossesTxt:'цель не найдена', loot:null };
  let defPow=0, lootMult=1;
  if (cell.type==='bandit')  defPow = cell.power||100;
  else if (cell.type==='oasis')  defPow = 30;
  else if (cell.type==='player') { defPow=(cell.lvl||1)*200; lootMult=0.3; }
  const win = atkPow > defPow * 0.9;
  const lr = win ? Math.min(0.6,defPow/Math.max(1,atkPow)*0.5) : Math.min(0.95,defPow/Math.max(1,atkPow)*0.8);
  const survivors={}, losses={};
  for (const uid in march.units) {
    const start=march.units[uid], lost=Math.min(start,Math.round(start*lr)), surv=start-lost;
    if (surv>0) survivors[uid]=surv;
    if (lost>0) losses[uid]=lost;
  }
  const lossesTxt = Object.entries(losses).map(([u,n])=>`${UNITS[u]?.name||u}×${n}`).join(', ')||'нет';
  let loot = null;
  if (win) {
    if (cell.type==='bandit') { const t=(cell.power||100)*3; loot={gold:Math.round(t*.4),wood:Math.round(t*.2),stone:Math.round(t*.2),food:Math.round(t*.2)}; cell.type='empty'; cell.power=0; }
    else if (cell.type==='oasis') { loot={[cell.resource]:500}; addReport(p,`Захвачен оазис!`,'capture'); cell.type='empty'; cell.resource=null; }
    else if (cell.type==='player') { const t=(cell.lvl||1)*300*lootMult; loot={gold:Math.round(t*.5),wood:Math.round(t*.2),stone:Math.round(t*.15),iron:Math.round(t*.15)}; }
    if (loot) { let cap=0; for (const uid in survivors) cap+=survivors[uid]*(UNITS[uid]?.carry||50); const tl=Object.values(loot).reduce((a,b)=>a+b,0); if(tl>cap){const k2=cap/tl;for(const r in loot)loot[r]=Math.floor(loot[r]*k2);} }
  }
  return { win, survivors, losses, lossesTxt, loot };
}

// ─── ТИК ────────────────────────────────────────────────────────────
function tickPlayer(p, world) {
  const now=Date.now(), dt=Math.max(0,(now-p.ts)/1000); p.ts=now; if(!dt) return;
  const rates=computeRates(p);
  for (const r of RES) if (rates[r]) p.res[r]=Math.max(0,Math.min(p.resMax[r]||9e9,p.res[r]+rates[r]*dt/3600));
  // Постройки
  for (let i=p.queue.length-1; i>=0; i--) {
    const j=p.queue[i]; if (now<j.end) continue;
    const cells=j.loc==='castle'?p.castle:p.lands;
    const c=cells.find(x=>x.col===j.col&&x.row===j.row);
    if (c) { c.bldId=j.bldId; c.level=j.toLvl; }
    p.queue.splice(i,1);
    addReport(p,`«${(BUILDINGS[j.bldId]||LAND_BUILDINGS[j.bldId])?.name}» ур.${j.toLvl} построено`,'build');
  }
  // Тренировка
  for (let i=p.trainQueue.length-1; i>=0; i--) {
    const j=p.trainQueue[i];
    while (j.count>0&&now>=j.nextDone) { p.army[j.uid]=(p.army[j.uid]||0)+1; j.count--; j.totalDone=(j.totalDone||0)+1; if(j.count>0) j.nextDone+=j.batchTime*1000; }
    if (j.count<=0) { p.trainQueue.splice(i,1); addReport(p,`Тренировка: ${j.totalDone}× ${UNITS[j.uid]?.name}`,'train'); }
  }
  // Походы
  for (let i=p.marches.length-1; i>=0; i--) {
    const m=p.marches[i];
    if (m.phase==='going'&&now>=m.arriveAt) {
      const result=resolveBattle(p,world,m);
      m.phase='returning'; m.returnAt=now+(m.arriveAt-m.startAt); m.battleResult=result; m.units=result.survivors; m.loot=result.loot;
      if (!Object.values(result.survivors).reduce((a,b)=>a+b,0)) { p.marches.splice(i,1); addReport(p,`Войско уничтожено`,'battle-loss'); }
    } else if (m.phase==='returning'&&now>=m.returnAt) {
      for (const uid in m.units) p.army[uid]=(p.army[uid]||0)+m.units[uid];
      if (m.loot) for (const k in m.loot) p.res[k]=Math.min(p.resMax[k]||9e9,(p.res[k]||0)+m.loot[k]);
      p.marches.splice(i,1);
      const r=m.battleResult, lt=r.loot?Object.entries(r.loot).filter(([,v])=>v).map(([k,v])=>`${k}+${v}`).join(' '):'';
      addReport(p,`${r.win?'🏆 Победа':'⚔ Поражение'} · потери: ${r.lossesTxt}${lt?' · добыча: '+lt:''}`,r.win?'battle-win':'battle-loss');
    }
  }
  recomputeMaxes(p);
}

// ─── КОМАНДЫ ────────────────────────────────────────────────────────
function cmdBuild(p, { loc, col, row, bldId }) {
  const isCastle=loc==='castle', cells=isCastle?p.castle:p.lands;
  const cell=cells.find(c=>c.col===col&&c.row===row); if (!cell) return err('cell not found');
  if (cell.type==='wall') return err('cannot build on wall');
  const defs=isCastle?BUILDINGS:LAND_BUILDINGS, def=defs[bldId]; if (!def) return err('unknown building');
  if (!isCastle&&def.terrain&&def.terrain!==cell.type) return err('wrong terrain');
  if (cell.bldId&&cell.bldId!==bldId) return err('cell occupied');
  const curLvl=cell.bldId===bldId?cell.level:0;
  if (curLvl>=(def.max||10)) return err('max level');
  if (isCastle&&def.unique&&hasUnique(p,bldId)&&cell.bldId!==bldId) return err('unique already built');
  if (isCastle&&!reqMet(p,bldId)) return err('requirements not met');
  if (p.queue.filter(j=>j.loc===loc).length>=2) return err('queue full');
  const cost=nextBuildCost(bldId,curLvl); if (!canAfford(p,cost)) return err('not enough resources');
  payCost(p,cost);
  const t=Date.now(), time=nextBuildTime(bldId,curLvl,getCastleLevel(p));
  p.queue.push({ loc, col, row, bldId, toLvl:curLvl+1, start:t, end:t+time*1000 });
  return ok({ time });
}

function cmdDemolish(p, { loc, col, row }) {
  const cells=loc==='castle'?p.castle:p.lands;
  const cell=cells.find(c=>c.col===col&&c.row===row);
  if (!cell||!cell.bldId) return err('nothing here');
  if (cell.bldId==='castle') return err('cannot demolish castle');
  cell.bldId=null; cell.level=0; recomputeMaxes(p); return ok();
}

function cmdTrain(p, { bldCol, bldRow, uid, count }) {
  const u=UNITS[uid]; if (!u) return err('unknown unit');
  if (u.race!==p.race) return err('wrong race');
  const bc=p.castle.find(c=>c.col===bldCol&&c.row===bldRow);
  if (!bc||bc.bldId!==u.building) return err('wrong building');
  if (bc.level<u.reqLvl) return err('building level too low');
  if (p.trainQueue.length>=4) return err('train queue full');
  count=Math.max(1,Math.floor(count));
  let max=count;
  for (const k of ['wood','stone','iron','food']) if ((u.cost[k]||0)>0) max=Math.min(max,Math.floor((p.res[k]||0)/u.cost[k]));
  max=Math.min(max,Math.floor((p.res.people||0)/u.people));
  if (max<=0) return err('not enough resources or people');
  count=Math.min(count,max);
  const tc={wood:(u.cost.wood||0)*count,stone:(u.cost.stone||0)*count,iron:(u.cost.iron||0)*count,food:(u.cost.food||0)*count};
  payCost(p,tc); p.res.people-=u.people*count;
  const now=Date.now();
  p.trainQueue.push({ uid, count, batchTime:u.trainTime, nextDone:now+u.trainTime*1000, startedAt:now });
  addReport(p,`Начат найм: ${count}× ${u.name}`,'train');
  return ok({ count });
}

function cmdAttack(p, world, { targetCol, targetRow, units }) {
  const cell=world.find(c=>c.col===targetCol&&c.row===targetRow); if (!cell) return err('target not found');
  if (!['bandit','oasis','player'].includes(cell.type)) return err('cannot attack this');
  let total=0, slowest=0;
  for (const uid in units) {
    const n=Math.floor(units[uid]||0); if (!n) continue;
    if (!UNITS[uid]) return err('unknown unit');
    if ((p.army[uid]||0)<n) return err('not enough '+uid);
    total+=n; slowest=Math.max(slowest,UNITS[uid].speed);
  }
  if (!total) return err('no units');
  for (const uid in units) { p.army[uid]-=(units[uid]||0); if (p.army[uid]<=0) delete p.army[uid]; }
  const pos=p.worldPos||{col:0,row:0}, dist=Math.max(1,gridDist(pos,{col:targetCol,row:targetRow}));
  const travelMs=slowest*dist*1000, now=Date.now();
  p.marches.push({ type:'attack', target:{col:targetCol,row:targetRow}, units:Object.fromEntries(Object.entries(units).filter(([,v])=>v>0)), startAt:now, arriveAt:now+travelMs, phase:'going' });
  addReport(p,`Войско отправлено (${total} воинов)`,'march');
  return ok({ travelMs });
}

const ok  = (e={}) => ({ ok:true,  ...e });
const err = (m)    => ({ ok:false, error:m });

module.exports = {
  RACES, RES, RES_LABEL, RES_IMG,
  BUILDINGS, LAND_BUILDINGS, UNITS,
  RATING_WEIGHTS, calcRating, ratingDelta,
  CASTLE_COLS, CASTLE_ROWS, LANDS_COLS, LANDS_ROWS, WORLD_COLS, WORLD_ROWS,
  MAX_PLAYERS_PER_PROVINCE, OASES_PER_PROVINCE,
  isCastleWall, isLandsWall,
  createPlayer, createWorldGrid, initProvince, placePlayerOnWorld,
  tickPlayer, recomputeMaxes, computeRates,
  cmdBuild, cmdDemolish, cmdTrain, cmdAttack,
  nextBuildCost, nextBuildTime, getCastleLevel, reqMet, hasUnique,
  gridDist, strHash,
};
