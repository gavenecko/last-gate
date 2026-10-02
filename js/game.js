(() => {
  "use strict";

  const WORLD_W = 100;
  const WORLD_H = 132;
  const BASE = { x: 50, y: 66, r: 8.4 };
  const BASE_HP0 = 200;
  const START_CASH = 100;
  const CAP = 10;
  const ORDER = ["vera", "roxie", "lila", "nyx"];

  const HEROES = {
    vera: {
      name: "Vera Voss", extra: "Spotter", short: "Vera", role: "Rifle Sniper",
      tag: "Deadeye snipe", cost: 110, accent: "#e7c56a", attack: "snipe",
      dmg: 64, range: 37, rate: 0.7, move: 13.5, leash: 34, post: 19.5, seek: 48,
    },
    roxie: {
      name: "Roxie Kane", extra: "Brawler", short: "Roxie", role: "Shotgun Brawler",
      tag: "Buckshot blast", cost: 80, accent: "#ff4d9a", attack: "blast",
      dmg: 17, range: 14, rate: 1.55, move: 17, leash: 17, post: 12.2, seek: 20,
      aoe: 5.3, cap: 5, capExtra: 3,
    },
    lila: {
      name: "Lila Marsh", extra: "Torch", short: "Lila", role: "Firebug",
      tag: "Burn patch", cost: 140, accent: "#ff9a3c", attack: "patch",
      dmg: 12, range: 24, rate: 0.58, move: 14, leash: 27, post: 16, seek: 32,
      aoe: 6.6, patch: 22, patchTime: 2.9,
    },
    nyx: {
      name: "Nyx Calder", extra: "Hexer", short: "Nyx", role: "Hex Warden",
      tag: "Slow / stun pulse", cost: 120, accent: "#c49bff", attack: "pulse",
      dmg: 8, range: 24, rate: 0.82, move: 15, leash: 28, post: 16.2, seek: 32,
      aoe: 6.4, slow: 0.46, slowTime: 2.15, stun: 0.5, stunExtra: 0.22,
    },
  };

  const ENEMIES = {
    walker: { sprite: "zombie", hp: 40, speed: 7.2, r: 2.65, reward: 6, bite: 4, biteEvery: 0.95, armor: 0, slowRes: 0 },
    runner: { sprite: "zombie", hp: 28, speed: 12.6, r: 2.25, reward: 8, bite: 3, biteEvery: 0.6, armor: 0, slowRes: 0.08, runner: true },
    tank: { sprite: "brute", hp: 170, speed: 4.05, r: 3.45, reward: 16, bite: 8, biteEvery: 1.05, armor: 0.12, slowRes: 0.28 },
    brute: { sprite: "brute", hp: 128, speed: 5.5, r: 3.25, reward: 14, bite: 6, biteEvery: 0.9, armor: 0.34, slowRes: 0.2, armored: true },
    boss: { sprite: "boss", hp: 1680, speed: 3.9, r: 5.9, reward: 80, bite: 18, biteEvery: 0.8, armor: 0.2, slowRes: 0.62, boss: true },
  };

  const WAVES = [
    { name: "Shamble", blurb: "Walkers stumble in off every edge.", groups: [{ type: "walker", n: 8, every: 1.05 }] },
    { name: "Pack", blurb: "A thicker crowd from all sides.", groups: [{ type: "walker", n: 12, every: 0.78 }] },
    { name: "Strays", blurb: "Runners break ahead of the walkers.", groups: [
      { type: "walker", n: 6, every: 0.85 },
      { type: "runner", n: 6, every: 0.95, delay: 1.8 },
    ] },
    { name: "Fast Swarm", challenge: "faster", speed: 1.24, blurb: "Challenge: the whole wave is sprinting.", groups: [
      { type: "runner", n: 12, every: 0.46 },
      { type: "walker", n: 5, every: 0.7, delay: 0.8 },
    ] },
    { name: "Bulwark", blurb: "Tanks shoulder through the pack.", groups: [
      { type: "walker", n: 8, every: 0.7 },
      { type: "tank", n: 3, every: 2.2, delay: 1.4 },
    ] },
    { name: "Crossfire", blurb: "Every kind, from every side.", groups: [
      { type: "runner", n: 8, every: 0.5 },
      { type: "walker", n: 8, every: 0.62, delay: 0.3 },
      { type: "tank", n: 2, every: 2.8, delay: 2 },
    ] },
    { name: "Armored Rush", challenge: "armored", blurb: "Challenge: plated brutes. Shots glance off.", groups: [
      { type: "brute", n: 6, every: 1.2 },
      { type: "runner", n: 8, every: 0.5, delay: 1 },
    ] },
    { name: "Horde", blurb: "They do not stop coming.", groups: [
      { type: "walker", n: 22, every: 0.32 },
      { type: "tank", n: 3, every: 2.4, delay: 1.6 },
    ] },
    { name: "Blackout", blurb: "Runners and iron in the dark.", groups: [
      { type: "runner", n: 14, every: 0.36 },
      { type: "tank", n: 4, every: 1.8, delay: 0.8 },
    ] },
    { name: "Graveking", boss: true, blurb: "Boss: the Graveking and his court.", groups: [
      { type: "walker", n: 8, every: 0.5 },
      { type: "boss", n: 1, every: 1, delay: 3.2 },
      { type: "runner", n: 8, every: 0.48, delay: 4.5 },
      { type: "brute", n: 2, every: 1.6, delay: 5.5 },
    ] },
  ];

  const BASE_UPS = {
    wall: { name: "Sandbag Wall", mark: "W", blurb: "Armor. The base takes less damage.", costs: [65, 95, 140], max: 3 },
    aura: { name: "Dread Aura", mark: "A", blurb: "Zombies slow down near the gate.", costs: [75, 110, 155], max: 3 },
    turret: { name: "Sentry Turret", mark: "T", blurb: "A gun on the compound fires by itself.", costs: [85, 125, 175], max: 3 },
  };
  const WALL_CUT = [0, 0.18, 0.32, 0.46];
  const AURA = [null, { r: 13.5, slow: 0.8 }, { r: 16.5, slow: 0.66 }, { r: 20, slow: 0.52 }];
  const TURRET = [null, { dmg: 11, rate: 1.15, range: 26 }, { dmg: 18, rate: 1.45, range: 30 }, { dmg: 28, rate: 1.75, range: 34 }];

  const PERKS = [
    { id: "dmg", name: "Hot Barrels", short: "DMG+", desc: "All heroines deal 20% more damage." },
    { id: "rate", name: "Hair Trigger", short: "RATE+", desc: "Heroines attack 16% faster." },
    { id: "move", name: "Quick Step", short: "MOVE+", desc: "Heroines move 18% faster." },
    { id: "heal", name: "Field Medic", short: "HEAL", desc: "Repair 45 base HP." },
    { id: "sale", name: "Surplus", short: "SALE", desc: "The next heroine is 40% off." },
    { id: "range", name: "Spotter Kit", short: "RANGE+", desc: "Heroine range is 12% longer." },
    { id: "gate", name: "Reinforced Gate", short: "HP+", desc: "Max base HP +30, and heal 30." },
    { id: "cash", name: "Scavenge", short: "CASH", desc: "Pocket $45 from the yard." },
  ];

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const canvas = $("game");
  const ctx = canvas.getContext("2d");
  const stage = $("stage");

  // SPRITE SWAP POINT
  // Drawn only through a circular clip (see drawToken) so the dark photo
  // background never shows as a rectangle. Drop in a new png and reload.
  //   assets/vera.png assets/roxie.png assets/lila.png assets/nyx.png
  //   assets/zombie.png assets/zombie-brute.png assets/boss.png
  const sprites = {};
  function loadSprites() {
    const files = [
      ["vera", "assets/vera.png", 0.18],
      ["roxie", "assets/roxie.png", 0.18],
      ["lila", "assets/lila.png", 0.18],
      ["nyx", "assets/nyx.png", 0.18],
      ["zombie", "assets/zombie.png", 0.4],
      ["brute", "assets/zombie-brute.png", 0.38],
      ["boss", "assets/boss.png", 0.34],
    ];
    for (const row of files) {
      const key = row[0];
      const src = row[1];
      const anchor = row[2];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        try { sprites[key] = prepareSprite(img, anchor); }
        catch (err) { sprites[key] = null; }
      };
      img.onerror = () => { sprites[key] = null; };
      img.src = src;
    }
  }

  function prepareSprite(img, anchor) {
    const S = 280;
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0, S, S);
    const image = g.getImageData(0, 0, S, S);
    const d = image.data;
    let ar = 0, ag = 0, ab = 0, n = 0;
    const sample = (x, y) => {
      const i = (y * S + x) * 4;
      ar += d[i]; ag += d[i + 1]; ab += d[i + 2]; n++;
    };
    for (let i = 0; i < S; i += 6) {
      sample(i, 0); sample(i, S - 1); sample(0, i); sample(S - 1, i);
    }
    ar /= n; ag /= n; ab /= n;
    const thresh = 34 * 34;
    const seen = new Uint8Array(S * S);
    const stack = new Int32Array(S * S);
    let sp = 0;
    const push = (x, y) => {
      if (x < 0 || y < 0 || x >= S || y >= S) return;
      const p = y * S + x;
      if (seen[p]) return;
      seen[p] = 1;
      stack[sp++] = p;
    };
    push(0, 0); push(S - 1, 0); push(0, S - 1); push(S - 1, S - 1);
    while (sp) {
      const p = stack[--sp];
      const x = p % S;
      const y = (p / S) | 0;
      const i = p * 4;
      const dr = d[i] - ar, dg = d[i + 1] - ag, db = d[i + 2] - ab;
      if (dr * dr + dg * dg + db * db > thresh) continue;
      d[i + 3] = 0;
      push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
    }
    let minX = S, minY = S, maxX = 0, maxY = 0, opaque = 0;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        if (d[(y * S + x) * 4 + 3] > 24) {
          opaque++;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    const frac = opaque / (S * S);
    const knocked = frac > 0.08 && frac < 0.78 && maxX > minX + 8;
    if (!knocked) {
      const side = Math.round(Math.min(img.width, img.height) * 0.8);
      const sx = Math.round((img.width - side) / 2);
      const sy = Math.round(img.height * 0.02);
      const out = document.createElement("canvas");
      out.width = side;
      out.height = side;
      out.getContext("2d").drawImage(img, sx, Math.min(sy, img.height - side), side, side, 0, 0, side, side);
      return { canvas: out, anchor: anchor, frac: frac, knocked: false };
    }
    g.putImageData(image, 0, 0);
    const pad = 2;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(S - 1, maxX + pad);
    maxY = Math.min(S - 1, maxY + pad);
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = bw;
    out.height = bh;
    out.getContext("2d").drawImage(c, minX, minY, bw, bh, 0, 0, bw, bh);
    return { canvas: out, anchor: anchor, frac: frac, knocked: true };
  }

  const units = [];
  const enemies = [];
  const bolts = [];
  const lobs = [];
  const patches = [];
  const flashes = [];
  const rings = [];
  const particles = [];
  const floaters = [];
  let uid = 1;
  let eid = 1;

  function freshState() {
    return {
      phase: "shop",
      wave: 1,
      cash: START_CASH,
      baseHp: BASE_HP0,
      baseMax: BASE_HP0,
      ups: { wall: 0, aura: 0, turret: 0 },
      dmgMult: 1, rateMult: 1, moveMult: 1, rangeMult: 1,
      sale: 0,
      taken: [],
      modLabels: [],
      kills: 0, spawned: 0, shots: 0, travel: 0,
      closest: 1e9, baseHurt: 0,
      log: [],
      time: 0, fightT: 0,
      shake: 0, baseFlash: 0, banner: null,
      muted: false, sent: false,
      spawnQ: [], offer: [],
      turretCd: 0.2, turretAng: -Math.PI / 2,
    };
  }
  const state = freshState();

  const SPECKS = Array.from({ length: 70 }, (_, i) => ({
    x: ((i * 53) % 997) / 997 * WORLD_W,
    y: ((i * 97) % 991) / 991 * WORLD_H,
    r: 0.12 + (i % 4) * 0.08,
    a: 0.1 + (i % 5) * 0.04,
  }));

  let view = { ox: 0, oy: 0, s: 1 };
  let audioCtx = null;
  let toastTimer = 0;
  const rosterButtons = {};
  const upButtons = {};

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function angleDiff(a, b) {
    let d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  function statsOf(u) {
    const h = HEROES[u.kind];
    const low = u.named ? 1 : 0.74;
    return {
      kind: h.attack,
      accent: h.accent,
      dmg: h.dmg * low * state.dmgMult,
      range: h.range * (u.named ? 1 : 0.88) * state.rangeMult,
      rate: h.rate * (u.named ? 1 : 0.9) * state.rateMult,
      move: h.move * (u.named ? 1 : 0.92) * state.moveMult,
      leash: h.leash,
      seek: h.seek * state.rangeMult,
      post: h.post,
      aoe: (h.aoe || 0) * (u.named ? 1 : 0.78),
      patch: (h.patch || 0) * low * state.dmgMult,
      patchTime: (h.patchTime || 2.4) * (u.named ? 1 : 0.75),
      slow: h.slow || 0.5,
      slowTime: (h.slowTime || 2) * (u.named ? 1 : 0.8),
      stun: u.named ? (h.stun || 0) : (h.stunExtra || 0),
      cap: u.named ? (h.cap || 5) : (h.capExtra || 3),
    };
  }

  function priceOf(id) {
    const base = HEROES[id].cost;
    return state.sale ? Math.max(1, Math.round(base * state.sale)) : base;
  }
  function canShop() { return state.phase === "shop" || state.phase === "fight"; }

  function addUnit(kind) {
    const named = !units.some((u) => u.kind === kind);
    const ang = Math.random() * Math.PI * 2;
    const rad = BASE.r + 5.5;
    const u = {
      id: ++uid, kind, named,
      x: BASE.x + Math.cos(ang) * rad,
      y: BASE.y + Math.sin(ang) * rad,
      home: ang,
      idle: Math.random() * 6,
      cooldown: 0.25 + Math.random() * 0.4,
      walk: Math.random() * 3,
      facing: ang,
      strafe: Math.random() * 4,
      muzzle: 0,
    };
    units.push(u);
    return u;
  }

  function layoutHomes() {
    const n = units.length || 1;
    for (let i = 0; i < units.length; i++) {
      units[i].home = -Math.PI / 2 + ((i + 0.5) / n) * Math.PI * 2;
    }
  }

  function buy(id) {
    if (!canShop()) return;
    if (units.length >= CAP) { toast("Squad is full"); return; }
    const cost = priceOf(id);
    if (state.cash < cost) { toast("Need $" + cost); return; }
    state.cash -= cost;
    state.sale = 0;
    const u = addUnit(id);
    layoutHomes();
    toast(u.named ? HEROES[id].name + " joins" : HEROES[id].extra + " joins (lower rank)");
    blip(520, 0.07, "square", 0.03);
  }

  function buyUp(id) {
    if (!canShop()) return;
    const up = BASE_UPS[id];
    const lv = state.ups[id];
    if (lv >= up.max) { toast(up.name + " is maxed"); return; }
    const cost = up.costs[lv];
    if (state.cash < cost) { toast("Need $" + cost); return; }
    state.cash -= cost;
    state.ups[id] += 1;
    toast(up.name + " LV " + state.ups[id]);
    blip(300, 0.08, "square", 0.035);
  }

  function edgePoint() {
    const pad = 1.15;
    const side = (Math.random() * 4) | 0;
    if (side === 0) return { x: rand(pad, WORLD_W - pad), y: pad };
    if (side === 1) return { x: WORLD_W - pad, y: rand(pad, WORLD_H - pad) };
    if (side === 2) return { x: rand(pad, WORLD_W - pad), y: WORLD_H - pad };
    return { x: pad, y: rand(pad, WORLD_H - pad) };
  }

  function spawnEnemy(type) {
    const proto = ENEMIES[type];
    const wave = WAVES[state.wave - 1];
    const p = edgePoint();
    const scale = proto.boss ? 1 : 1 + (state.wave - 1) * 0.05;
    const hp = Math.round(proto.hp * scale);
    enemies.push({
      id: ++eid,
      type: type,
      sprite: proto.sprite,
      boss: !!proto.boss,
      runner: !!proto.runner,
      armored: !!proto.armored,
      x: p.x, y: p.y, r: proto.r,
      hp: hp, max: hp,
      speed: proto.speed * (wave.speed || 1),
      reward: proto.reward,
      bite: proto.bite,
      biteEvery: proto.biteEvery,
      biteCd: 0.3 + Math.random() * 0.35,
      armor: proto.armor,
      slowRes: proto.slowRes,
      slowFactor: 1, slowT: 0, stunT: 0,
      walk: Math.random() * 8,
      side: Math.random() < 0.5 ? -1 : 1,
      flash: 0, dead: false,
    });
    state.spawned++;
  }

  function startWave() {
    if (state.phase !== "shop") return;
    const spec = WAVES[state.wave - 1];
    state.phase = "fight";
    state.fightT = 0;
    state.sent = true;
    state.spawnQ = [];
    for (const g of spec.groups) {
      for (let i = 0; i < g.n; i++) {
        state.spawnQ.push({ t: 0.35 + (g.delay || 0) + i * g.every, type: g.type });
      }
    }
    state.spawnQ.sort((a, b) => a.t - b.t);
    const kind = spec.boss ? "BOSS" : spec.challenge ? "CHALLENGE" : "WAVE";
    toast(kind + " " + state.wave + " — " + spec.name);
    state.banner = { title: spec.name, sub: spec.blurb, life: 2.3 };
    blip(170, 0.09, "square", 0.03);
  }

  function hurtEnemy(e, raw) {
    if (!e || e.dead || state.phase !== "fight") return;
    const dealt = raw * (1 - (e.armor || 0));
    if (dealt <= 0) return;
    e.hp -= dealt;
    e.flash = 0.08;
    if (e.hp <= 0) killEnemy(e);
  }

  function killEnemy(e) {
    if (!e || e.dead) return;
    e.dead = true;
    e.hp = 0;
    state.cash += e.reward;
    state.kills++;
    burst(e.x, e.y, e.boss ? "#d7c4ff" : "#8a9474", e.boss ? 14 : 6, e.boss ? 7 : 4.5);
    if (floaters.length < 24) {
      floaters.push({ x: e.x, y: e.y - e.r, text: "+" + e.reward, life: 0.7, color: "#ffc857" });
    }
  }

  function hurtBase(raw) {
    if (state.phase !== "fight") return;
    const dmg = raw * (1 - WALL_CUT[state.ups.wall]);
    state.baseHp -= dmg;
    state.baseHurt += dmg;
    state.shake = Math.min(1.3, state.shake + (reduceMotion ? 0 : 0.45));
    state.baseFlash = 0.16;
    if (floaters.length < 20) {
      floaters.push({
        x: BASE.x + rand(-2, 2), y: BASE.y - BASE.r,
        text: "-" + Math.max(1, Math.round(dmg)), life: 0.65, color: "#ff5d6c",
      });
    }
    blip(80, 0.08, "sawtooth", 0.03);
    if (state.baseHp <= 0) {
      state.baseHp = 0;
      lose();
    }
  }

  function applySlow(e, factor, time) {
    const resisted = 1 - (1 - factor) * (1 - e.slowRes);
    if (e.slowT <= 0 || resisted <= e.slowFactor) e.slowFactor = resisted;
    e.slowT = Math.max(e.slowT, time);
  }

  function findEnemy(id) {
    for (const e of enemies) if (e.id === id && !e.dead) return e;
    return null;
  }

  function burst(x, y, color, n, speed) {
    const count = reduceMotion ? Math.min(2, n) : n;
    for (let i = 0; i < count; i++) {
      if (particles.length > 110) particles.shift();
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random());
      const life = 0.28 + Math.random() * 0.32;
      particles.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: life, max: life, color: color, r: 0.22 + Math.random() * 0.4,
      });
    }
  }

  function fire(u, target, s) {
    u.cooldown = 1 / s.rate;
    u.muzzle = 0.08;
    u.facing = Math.atan2(target.y - u.y, target.x - u.x);
    state.shots++;
    if (s.kind === "snipe") {
      let dmg = s.dmg;
      if (target.max > 0 && target.hp > target.max * 0.5) dmg *= u.named ? 1.35 : 1.15;
      bolts.push({ x: u.x, y: u.y, ox: u.x, oy: u.y, targetId: target.id, dmg: dmg, color: s.accent });
    } else if (s.kind === "blast") {
      const victims = [];
      for (const e of enemies) {
        if (e.dead) continue;
        const d = Math.hypot(e.x - target.x, e.y - target.y);
        if (d <= s.aoe + e.r * 0.25 && Math.hypot(e.x - u.x, e.y - u.y) <= s.range + s.aoe) {
          victims.push({ e: e, d: d });
        }
      }
      victims.sort((a, b) => a.d - b.d);
      const cap = s.cap || 4;
      const n = Math.min(cap, victims.length);
      for (let i = 0; i < n; i++) {
        hurtEnemy(victims[i].e, s.dmg);
        flashes.push({ x: victims[i].e.x, y: victims[i].e.y, sx: u.x, sy: u.y, life: 0.1, max: 0.1, color: s.accent });
      }
      if (!n) flashes.push({ x: target.x, y: target.y, sx: u.x, sy: u.y, life: 0.08, max: 0.08, color: s.accent });
    } else if (s.kind === "patch") {
      const dist = Math.hypot(target.x - u.x, target.y - u.y);
      lobs.push({
        x: u.x, y: u.y, sx: u.x, sy: u.y, tx: target.x, ty: target.y,
        t: 0, dur: Math.max(0.18, dist / 28),
        dmg: s.dmg, aoe: s.aoe, patch: s.patch, patchTime: s.patchTime,
      });
    } else if (s.kind === "pulse") {
      rings.push({ x: target.x, y: target.y, r: 0.4, max: s.aoe, life: 0.32, color: s.accent });
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.hypot(e.x - target.x, e.y - target.y) <= s.aoe + e.r * 0.2) {
          hurtEnemy(e, s.dmg);
          applySlow(e, s.slow, s.slowTime);
          const stun = s.stun * (1 - e.slowRes);
          if (stun > 0.05) e.stunT = Math.max(e.stunT, stun);
        }
      }
    }
  }

  function explodeLob(p) {
    patches.push({ x: p.tx, y: p.ty, r: p.aoe, dps: p.patch, life: p.patchTime, max: p.patchTime });
    for (const e of enemies) {
      if (e.dead) continue;
      if (Math.hypot(e.x - p.tx, e.y - p.ty) <= p.aoe + e.r * 0.3) hurtEnemy(e, p.dmg);
    }
    burst(p.tx, p.ty, "#ff9a3c", 8, 5);
  }

  function pickTarget(u, s) {
    let best = null;
    let bestScore = Infinity;
    let bestHp = -1;
    for (const e of enemies) {
      if (e.dead) continue;
      const d = Math.hypot(e.x - u.x, e.y - u.y);
      const db = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      const ang = Math.atan2(e.y - BASE.y, e.x - BASE.x);
      const inSector = Math.abs(angleDiff(ang, u.home)) < 1.15;
      const biting = db <= BASE.r + e.r + 2.6;
      if (!(d <= s.seek || biting || (inSector && db < 84))) continue;
      if (s.kind === "snipe") {
        if (e.hp > bestHp || (e.hp === bestHp && db < bestScore)) {
          bestHp = e.hp;
          bestScore = db;
          best = e;
        }
      } else {
        let score = d + db * 0.45;
        if (biting) score -= 16;
        if (e.boss) score -= 8;
        if (inSector) score -= 5;
        if (score < bestScore) { bestScore = score; best = e; }
      }
    }
    return best;
  }

  function moveToward(u, tx, ty, maxStep) {
    const dx = tx - u.x;
    const dy = ty - u.y;
    const d = Math.hypot(dx, dy);
    if (d < 0.06 || maxStep <= 0) return;
    const step = Math.min(maxStep, d);
    u.x += (dx / d) * step;
    u.y += (dy / d) * step;
    u.walk += step;
    u.facing = Math.atan2(dy, dx);
    state.travel += step;
  }

  function clampUnit(u) {
    let bx = u.x - BASE.x;
    let by = u.y - BASE.y;
    let bd = Math.hypot(bx, by);
    const minR = BASE.r + 3.5;
    if (bd < minR) {
      if (bd < 0.001) { bx = 1; by = 0; bd = 1; }
      u.x = BASE.x + (bx / bd) * minR;
      u.y = BASE.y + (by / bd) * minR;
    }
    u.x = clamp(u.x, 2, WORLD_W - 2);
    u.y = clamp(u.y, 2, WORLD_H - 2);
  }

  function separateUnits() {
    for (let i = 0; i < units.length; i++) {
      for (let j = i + 1; j < units.length; j++) {
        const a = units[i], b = units[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        const min = 7.1;
        if (d > 0.001 && d < min) {
          const push = (min - d) * 0.5;
          dx /= d; dy /= d;
          a.x -= dx * push; a.y -= dy * push;
          b.x += dx * push; b.y += dy * push;
        }
      }
    }
  }

  function updateUnits(dt) {
    const fighting = state.phase === "fight";
    for (const u of units) {
      const s = statsOf(u);
      u.idle += dt;
      const target = fighting ? pickTarget(u, s) : null;
      if (target) {
        const d = Math.hypot(target.x - u.x, target.y - u.y);
        if (d > s.range) {
          let tx = target.x, ty = target.y;
          const bd = Math.hypot(target.x - BASE.x, target.y - BASE.y) || 1;
          if (bd > s.leash) {
            tx = BASE.x + ((target.x - BASE.x) / bd) * s.leash;
            ty = BASE.y + ((target.y - BASE.y) / bd) * s.leash;
          }
          moveToward(u, tx, ty, s.move * dt);
        } else {
          u.strafe += dt;
          const ang = u.facing + Math.PI / 2;
          const wob = Math.cos(u.strafe * 2.1) * 1.4;
          moveToward(u, u.x + Math.cos(ang) * wob, u.y + Math.sin(ang) * wob, s.move * 0.32 * dt);
        }
        u.facing = Math.atan2(target.y - u.y, target.x - u.x);
        u.cooldown -= dt;
        if (d <= s.range && u.cooldown <= 0) fire(u, target, s);
      } else {
        const ang = u.home + Math.sin(u.idle * 0.85) * 0.7;
        const rad = s.post + Math.sin(u.idle * 0.65) * 1.7;
        moveToward(u, BASE.x + Math.cos(ang) * rad, BASE.y + Math.sin(ang) * rad, s.move * 0.62 * dt);
        u.cooldown = Math.max(0, u.cooldown - dt);
      }
      clampUnit(u);
    }
    separateUnits();
    for (const u of units) clampUnit(u);
  }

  function auraMul(e) {
    const aura = AURA[state.ups.aura];
    if (!aura) return 1;
    const d = Math.hypot(e.x - BASE.x, e.y - BASE.y);
    return d <= aura.r ? aura.slow : 1;
  }

  function separateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
      const a = enemies[i];
      if (a.dead) continue;
      for (let j = i + 1; j < enemies.length; j++) {
        const b = enemies[j];
        if (b.dead) continue;
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        const min = (a.r + b.r) * 0.7;
        if (d > 0.01 && d < min) {
          const push = (min - d) * 0.28;
          dx /= d; dy /= d;
          a.x -= dx * push; a.y -= dy * push;
          b.x += dx * push; b.y += dy * push;
        }
      }
    }
  }

  function updateEnemies(dt) {
    for (const e of enemies) {
      if (e.dead) continue;
      e.flash = Math.max(0, e.flash - dt);
      e.stunT = Math.max(0, e.stunT - dt);
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.slowFactor = 1;
      }
      const dx = BASE.x - e.x;
      const dy = BASE.y - e.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      if (dist < state.closest) state.closest = dist;
      const stop = BASE.r + e.r * 0.62;
      const mul = (e.stunT > 0 ? 0 : e.slowFactor) * auraMul(e);
      if (dist > stop) {
        const step = e.speed * mul * dt;
        const nx = dx / dist, ny = dy / dist;
        const wob = Math.sin(e.walk * 0.8) * 0.45 * e.side;
        e.x += nx * step + (-ny) * wob * dt * 2.2;
        e.y += ny * step + nx * wob * dt * 2.2;
        e.walk += Math.max(step, dt);
        e.x = clamp(e.x, 0.4, WORLD_W - 0.4);
        e.y = clamp(e.y, 0.4, WORLD_H - 0.4);
      } else {
        e.walk += dt * 2;
        if (e.stunT <= 0) {
          e.biteCd -= dt;
          if (e.biteCd <= 0) {
            e.biteCd = e.biteEvery;
            hurtBase(e.bite);
          }
        }
        const spin = e.stunT > 0 ? 0 : e.side * dt * 0.35;
        const ang = Math.atan2(e.y - BASE.y, e.x - BASE.x) + spin;
        e.x = BASE.x + Math.cos(ang) * stop;
        e.y = BASE.y + Math.sin(ang) * stop;
      }
    }
    separateEnemies();
  }

  function updatePatches(dt) {
    for (const p of patches) {
      p.life -= dt;
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) <= p.r + e.r * 0.35) hurtEnemy(e, p.dps * dt);
      }
    }
  }

  function updateTurret(dt) {
    const spec = TURRET[state.ups.turret];
    if (!spec || state.phase !== "fight") return;
    let best = null;
    let bestD = spec.range;
    for (const e of enemies) {
      if (e.dead) continue;
      const d = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      if (d < bestD) { bestD = d; best = e; }
    }
    if (!best) return;
    state.turretAng = Math.atan2(best.y - BASE.y, best.x - BASE.x);
    state.turretCd -= dt;
    if (state.turretCd <= 0) {
      state.turretCd = 1 / spec.rate;
      const ang = state.turretAng;
      bolts.push({
        x: BASE.x + Math.cos(ang) * (BASE.r * 0.85),
        y: BASE.y + Math.sin(ang) * (BASE.r * 0.85),
        ox: BASE.x, oy: BASE.y,
        targetId: best.id, dmg: spec.dmg, color: "#d5e6ff",
      });
      state.shots++;
    }
  }

  function updateBolts(dt) {
    for (let i = bolts.length - 1; i >= 0; i--) {
      const p = bolts[i];
      if (state.phase !== "fight") { bolts.splice(i, 1); continue; }
      const t = findEnemy(p.targetId);
      if (!t) { bolts.splice(i, 1); continue; }
      const dx = t.x - p.x, dy = t.y - p.y;
      const d = Math.hypot(dx, dy);
      const step = 68 * dt;
      p.ox = p.x; p.oy = p.y;
      if (d <= Math.max(step, t.r * 0.75)) {
        hurtEnemy(t, p.dmg);
        burst(t.x, t.y, p.color, 3, 3);
        bolts.splice(i, 1);
      } else {
        p.x += (dx / d) * step;
        p.y += (dy / d) * step;
      }
    }
  }

  function updateLobs(dt) {
    for (let i = lobs.length - 1; i >= 0; i--) {
      const p = lobs[i];
      p.t += dt;
      const k = Math.min(1, p.t / p.dur);
      p.x = p.sx + (p.tx - p.sx) * k;
      p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * 5;
      if (k >= 1) {
        if (state.phase === "fight") explodeLob(p);
        lobs.splice(i, 1);
      }
    }
  }

  function compact() {
    for (let i = enemies.length - 1; i >= 0; i--) if (enemies[i].dead) enemies.splice(i, 1);
    for (let i = patches.length - 1; i >= 0; i--) if (patches[i].life <= 0) patches.splice(i, 1);
  }

  function checkClear() {
    if (state.phase !== "fight") return;
    if (state.spawnQ.length) return;
    if (enemies.length) return;
    const cleared = state.wave;
    const bonus = 8 + cleared * 3;
    state.cash += bonus;
    state.log.push("w" + cleared + " hp" + Math.round(state.baseHp) + " $" + state.cash + " u" + units.length);
    toast("Wave " + cleared + " down +$" + bonus);
    if (cleared >= WAVES.length) { win(); return; }
    state.wave = cleared + 1;
    if (cleared === 3 || cleared === 6 || cleared === 9) openPick();
    else state.phase = "shop";
  }

  function updateFx(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = floaters.length - 1; i >= 0; i--) {
      const f = floaters[i];
      f.life -= dt;
      f.y -= dt * 2.4;
      if (f.life <= 0) floaters.splice(i, 1);
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      flashes[i].life -= dt;
      if (flashes[i].life <= 0) flashes.splice(i, 1);
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].life -= dt;
      rings[i].r += dt * 16;
      if (rings[i].life <= 0) rings.splice(i, 1);
    }
    for (const u of units) u.muzzle = Math.max(0, u.muzzle - dt);
  }

  function update(dt) {
    state.time += dt;
    state.shake = Math.max(0, state.shake - dt * 1.8);
    state.baseFlash = Math.max(0, state.baseFlash - dt);
    if (state.banner) {
      state.banner.life -= dt;
      if (state.banner.life <= 0) state.banner = null;
    }
    if (state.phase === "fight") {
      state.fightT += dt;
      while (state.spawnQ.length && state.spawnQ[0].t <= state.fightT) spawnEnemy(state.spawnQ.shift().type);
      updateEnemies(dt);
      updatePatches(dt);
      updateUnits(dt);
      updateTurret(dt);
      updateBolts(dt);
      updateLobs(dt);
      compact();
      checkClear();
    } else if (state.phase === "shop") {
      updateUnits(dt);
    }
    updateFx(dt);
  }

  function drawToken(key, x, y, r, backup) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const spr = sprites[key];
    if (spr && spr.canvas) {
      const img = spr.canvas;
      const scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, -r - (dw - r * 2) * 0.5, -r - (dh - r * 2) * spr.anchor, dw, dh);
    } else if (backup) {
      backup(r);
    }
    ctx.restore();
  }

  function drawHeroFallback(h, r) {
    ctx.fillStyle = h.accent;
    ctx.beginPath();
    ctx.arc(0, -r * 0.2, r * 0.62, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fill();
    ctx.fillStyle = "#f0c2a8";
    ctx.beginPath();
    ctx.arc(0, -r * 0.08, r * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1b1a22";
    ctx.fillRect(-r * 0.42, r * 0.22, r * 0.84, r * 0.5);
    ctx.fillStyle = h.accent;
    ctx.fillRect(-r * 0.48, r * 0.2, r * 0.96, r * 0.18);
  }

  function drawZombieFallback(e, r) {
    ctx.fillStyle = e.boss ? "#5c4d6e" : "#6a7264";
    ctx.beginPath();
    ctx.ellipse(0, r * 0.18, r * 0.52, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9aa18c";
    ctx.beginPath();
    ctx.arc(0, -r * 0.32, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff2a3a";
    ctx.fillRect(-r * 0.18, -r * 0.4, r * 0.1, r * 0.08);
    ctx.fillRect(r * 0.08, -r * 0.38, r * 0.1, r * 0.08);
    ctx.fillStyle = "#7a2430";
    ctx.fillRect(-r * 0.05, r * 0.1, r * 0.32, r * 0.1);
  }

  function drawUnit(u) {
    const h = HEROES[u.kind];
    const r = u.named ? 5.05 : 4.35;
    const bob = Math.sin(u.walk * 1.35) * (reduceMotion ? 0 : 0.3);
    const x = u.x;
    const y = u.y + bob;
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath();
    ctx.ellipse(u.x, u.y + r * 0.8, r * 0.7, r * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#10131b";
    ctx.fill();
    drawToken(u.kind, x, y, r, (rr) => drawHeroFallback(h, rr));
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = h.accent;
    ctx.globalAlpha = u.named ? 1 : 0.8;
    ctx.lineWidth = u.named ? 0.48 : 0.28;
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (u.named) {
      ctx.fillStyle = h.accent;
      ctx.beginPath();
      ctx.arc(x + r * 0.64, y - r * 0.64, 0.48, 0, Math.PI * 2);
      ctx.fill();
    }
    const fx = Math.cos(u.facing), fy = Math.sin(u.facing);
    ctx.strokeStyle = h.accent;
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(x + fx * r * 0.85, y + fy * r * 0.85);
    ctx.lineTo(x + fx * (r + 1.7), y + fy * (r + 1.7));
    ctx.stroke();
    if (u.muzzle > 0) {
      ctx.globalAlpha = Math.min(1, u.muzzle / 0.08);
      ctx.fillStyle = "#fff4cc";
      ctx.beginPath();
      ctx.arc(x + fx * (r + 1.4), y + fy * (r + 1.4), 0.62, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawEnemy(e) {
    const bob = Math.sin(e.walk * (e.runner ? 2.2 : 1.45)) * (reduceMotion ? 0 : 0.22);
    const x = e.x;
    const y = e.y + bob;
    const r = e.r * 1.38;
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.beginPath();
    ctx.ellipse(e.x, e.y + r * 0.78, r * 0.72, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    if (e.type === "tank") ctx.filter = "brightness(0.78)";
    if (e.flash > 0) ctx.globalAlpha = 0.55;
    drawToken(e.sprite, x, y, r, (rr) => drawZombieFallback(e, rr));
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = e.boss ? "#c49bff" : e.armored ? "#c8b498" : "#6e3038";
    ctx.lineWidth = e.boss ? 0.5 : 0.26;
    ctx.stroke();
    if (e.runner) {
      ctx.strokeStyle = "rgba(230,220,120,0.85)";
      ctx.lineWidth = 0.28;
      ctx.beginPath();
      ctx.moveTo(x - r * 0.2, y + r * 0.2);
      ctx.lineTo(x - r - 1.5, y + r * 0.45);
      ctx.stroke();
    }
    if (e.slowT > 0 || e.stunT > 0) {
      ctx.strokeStyle = e.stunT > 0 ? "rgba(255,255,255,0.9)" : "rgba(196,155,255,0.9)";
      ctx.lineWidth = 0.28;
      ctx.beginPath();
      ctx.arc(x, y, r + 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
    const w = r * 2.15;
    const hx = x - w / 2;
    const hy = y - r - 1.2;
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(hx, hy, w, 0.48);
    ctx.fillStyle = e.boss ? "#ff6b8a" : "#c5e38a";
    ctx.fillRect(hx, hy, w * Math.max(0, e.hp / e.max), 0.48);
    if (e.boss) {
      ctx.fillStyle = "#f3e9ff";
      ctx.font = "700 2.4px Passion One, Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("GRAVEKING", x, hy - 0.2);
    }
  }

  function drawPatch(p) {
    const flick = reduceMotion ? 1 : 0.9 + Math.sin(state.time * 9 + p.x) * 0.1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * flick, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,110,24," + (0.22 + 0.18 * Math.max(0, p.life / p.max)) + ")";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,190,70,0.75)";
    ctx.lineWidth = 0.22;
    ctx.stroke();
  }

  function drawFence() {
    ctx.strokeStyle = "rgba(180,170,150,0.28)";
    ctx.lineWidth = 0.28;
    const gap = 7.5;
    for (let x = 3; x < WORLD_W - 2; x += gap) {
      if (Math.round(x / gap) % 4 === 2) continue;
      ctx.beginPath();
      ctx.moveTo(x, 1.1); ctx.lineTo(x, 3.1);
      ctx.moveTo(x, WORLD_H - 1.1); ctx.lineTo(x, WORLD_H - 3.1);
      ctx.stroke();
    }
    for (let y = 3; y < WORLD_H - 2; y += gap) {
      if (Math.round(y / gap) % 4 === 1) continue;
      ctx.beginPath();
      ctx.moveTo(1.1, y); ctx.lineTo(3.1, y);
      ctx.moveTo(WORLD_W - 1.1, y); ctx.lineTo(WORLD_W - 3.1, y);
      ctx.stroke();
    }
  }

  function drawBase() {
    const aura = AURA[state.ups.aura];
    if (aura) {
      ctx.beginPath();
      ctx.arc(BASE.x, BASE.y, aura.r, 0, Math.PI * 2);
      const pulse = reduceMotion ? 0.3 : 0.25 + Math.sin(state.time * 3) * 0.08;
      ctx.strokeStyle = "rgba(196,155,255," + pulse + ")";
      ctx.lineWidth = 0.35;
      ctx.setLineDash([1.2, 0.85]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, BASE.r, 0, Math.PI * 2);
    ctx.fillStyle = state.baseFlash > 0 ? "#6a3038" : "#2a261c";
    ctx.fill();
    ctx.lineWidth = 0.7 + state.ups.wall * 0.45;
    ctx.strokeStyle = state.ups.wall ? "#d9c08a" : "#6a6254";
    ctx.stroke();
    if (state.ups.wall >= 2) {
      ctx.beginPath();
      ctx.arc(BASE.x, BASE.y, BASE.r + 0.9, 0, Math.PI * 2);
      ctx.lineWidth = 0.28;
      ctx.strokeStyle = "rgba(217,192,138,0.7)";
      ctx.stroke();
    }
    if (state.ups.turret) {
      ctx.save();
      ctx.translate(BASE.x, BASE.y);
      ctx.rotate(state.turretAng);
      ctx.fillStyle = "#b7c4d6";
      ctx.fillRect(BASE.r * 0.15, -0.42, BASE.r * 0.95, 0.84);
      ctx.fillStyle = "#7f8ea3";
      ctx.fillRect(BASE.r * 0.95, -0.28, 1.3, 0.56);
      ctx.restore();
    }
    const frac = Math.max(0, state.baseHp / state.baseMax);
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, BASE.r + 1.7 + state.ups.wall * 0.25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
    ctx.strokeStyle = frac < 0.3 ? "#ff5d6c" : "#7dffb3";
    ctx.lineWidth = 0.72;
    ctx.stroke();
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "700 3px Passion One, Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GATE", BASE.x, BASE.y - 0.7);
    ctx.font = "700 2.15px sans-serif";
    ctx.fillStyle = frac < 0.3 ? "#ff8d98" : "#d9ffe8";
    ctx.fillText(String(Math.max(0, Math.ceil(state.baseHp))), BASE.x, BASE.y + 2.15);
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const s = Math.min(canvas.width / WORLD_W, canvas.height / WORLD_H);
    view.s = s || 1;
    view.ox = (canvas.width - WORLD_W * view.s) / 2;
    view.oy = (canvas.height - WORLD_H * view.s) / 2;
  }

  function draw() {
    resize();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#05060a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sh = reduceMotion ? 0 : state.shake;
    const jx = Math.sin(state.time * 46) * sh * 0.35 * view.s;
    const jy = Math.cos(state.time * 33) * sh * 0.28 * view.s;
    ctx.setTransform(view.s, 0, 0, view.s, view.ox + jx, view.oy + jy);
    ctx.fillStyle = "#14160f";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    const yard = ctx.createRadialGradient(BASE.x, BASE.y, 3, BASE.x, BASE.y, 40);
    yard.addColorStop(0, "#322e22");
    yard.addColorStop(1, "rgba(20,22,15,0)");
    ctx.fillStyle = yard;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    for (const s of SPECKS) {
      ctx.globalAlpha = s.a;
      ctx.fillStyle = "#d9d3c4";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(80,16,28,0.16)";
    ctx.fillRect(0, 0, WORLD_W, 5);
    ctx.fillRect(0, WORLD_H - 5, WORLD_W, 5);
    ctx.fillRect(0, 0, 5, WORLD_H);
    ctx.fillRect(WORLD_W - 5, 0, 5, WORLD_H);
    drawFence();
    for (const p of patches) drawPatch(p);
    for (const e of enemies) if (!e.dead) drawEnemy(e);
    drawBase();
    for (const b of bolts) {
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 0.42;
      ctx.beginPath();
      ctx.moveTo(b.ox, b.oy);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    for (const p of lobs) {
      ctx.fillStyle = "#ffb04a";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const f of flashes) {
      ctx.globalAlpha = Math.max(0, f.life / f.max);
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 0.38;
      ctx.beginPath();
      ctx.moveTo(f.sx, f.sy);
      ctx.lineTo(f.x, f.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const ring of rings) {
      ctx.globalAlpha = Math.max(0, ring.life / 0.32);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 0.32;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, Math.min(ring.max, ring.r), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const u of units) drawUnit(u);
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / (p.max || 0.5));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const f of floaters) {
      ctx.globalAlpha = Math.max(0, f.life / 0.7);
      ctx.fillStyle = f.color;
      ctx.font = "700 2.2px sans-serif";
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    if (state.banner && state.banner.life > 0) {
      ctx.globalAlpha = Math.min(1, state.banner.life * 2);
      ctx.fillStyle = "#f7f3ea";
      ctx.font = "700 4px Passion One, Impact, sans-serif";
      ctx.fillText(state.banner.title, WORLD_W / 2, 7.2);
      ctx.globalAlpha = 1;
    }
  }

  function upEffect(id, lv) {
    if (id === "wall") return lv ? "Hits on the base are " + [0, 18, 32, 46][lv] + "% softer" : "Not built";
    if (id === "aura") return lv ? "Nearby dead move at " + [0, 80, 66, 52][lv] + "% speed" : "Not built";
    return lv ? "Sentry hits for " + [0, 11, 18, 28][lv] : "Not built";
  }

  function syncHud() {
    $("hp").textContent = String(Math.max(0, Math.ceil(state.baseHp)));
    $("cash").textContent = String(state.cash);
    $("waveNum").textContent = String(state.wave);
    const frac = Math.max(0, state.baseHp / state.baseMax);
    $("hpFill").style.transform = "scaleX(" + frac + ")";
    $("hpPill").classList.toggle("low", frac < 0.3);
    const spec = WAVES[state.wave - 1];
    $("waveName").textContent = spec.name;
    const tag = $("waveTag");
    if (spec.boss) { tag.textContent = "BOSS"; tag.className = "tag boss"; }
    else if (spec.challenge) { tag.textContent = "CHALLENGE"; tag.className = "tag chal"; }
    else { tag.textContent = ""; tag.className = "tag"; }
    if (state.phase === "fight") {
      const left = state.spawnQ.length + enemies.filter((e) => !e.dead).length;
      $("waveBlurb").textContent = left + " left in the wave";
    } else if (state.phase === "shop") {
      $("waveBlurb").textContent = spec.blurb;
    }
    $("mods").textContent = state.modLabels.join("  ·  ");
    const next = $("next");
    next.disabled = state.phase !== "shop";
    next.textContent = state.phase === "fight" ? "HOLDING" : (state.wave === 1 && !state.sent ? "START WAVE" : "NEXT WAVE");
    const locked = state.phase === "pick" || state.phase === "won" || state.phase === "lost";
    for (const id of ORDER) {
      const btn = rosterButtons[id];
      const cost = priceOf(id);
      btn.querySelector(".price").textContent = state.sale ? "SALE $" + cost : "$" + cost;
      const owned = units.filter((u) => u.kind === id);
      const named = owned.some((u) => u.named);
      const extras = owned.length - (named ? 1 : 0);
      let own = "Not hired";
      if (named && extras) own = "Hero + " + extras + " lower rank";
      else if (named) own = "Hero on field";
      else if (extras) own = extras + " on field";
      btn.querySelector(".own").textContent = own;
      btn.classList.toggle("broke", locked || units.length >= CAP || state.cash < cost);
    }
    for (const id of ["wall", "aura", "turret"]) {
      const btn = upButtons[id];
      const lv = state.ups[id];
      const up = BASE_UPS[id];
      const maxed = lv >= up.max;
      btn.querySelector(".lv").textContent = maxed ? "LV " + lv + " · MAX" : "LV " + lv + " · $" + up.costs[lv];
      btn.querySelector(".fx").textContent = upEffect(id, lv);
      btn.classList.toggle("broke", locked || maxed || state.cash < (maxed ? 1e9 : up.costs[lv]));
    }
  }

  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1500);
  }

  function unlock() {
    if (state.muted) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
    } catch (err) { /* autoplay */ }
  }

  function blip(freq, dur, type, gain) {
    if (state.muted || !audioCtx) return;
    try {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "square";
      o.frequency.value = freq;
      g.gain.value = gain;
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + dur);
    } catch (err) { /* ignore */ }
  }

  function applyPerk(id) {
    if (id === "dmg") state.dmgMult *= 1.2;
    else if (id === "rate") state.rateMult *= 1.16;
    else if (id === "move") state.moveMult *= 1.18;
    else if (id === "heal") state.baseHp = Math.min(state.baseMax, state.baseHp + 45);
    else if (id === "sale") state.sale = 0.6;
    else if (id === "range") state.rangeMult *= 1.12;
    else if (id === "gate") {
      state.baseMax += 30;
      state.baseHp = Math.min(state.baseMax, state.baseHp + 30);
    } else if (id === "cash") state.cash += 45;
  }

  function rollPerks() {
    const pool = PERKS.filter((p) => state.taken.indexOf(p.id) === -1);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    return pool.slice(0, 3);
  }

  function choosePerk(perk) {
    applyPerk(perk.id);
    state.taken.push(perk.id);
    state.modLabels.push(perk.short);
    state.phase = "shop";
    state.offer = [];
    $("overlay").classList.add("hidden");
    toast(perk.name);
  }

  function openPick() {
    state.phase = "pick";
    const choices = rollPerks();
    state.offer = choices;
    $("ovTitle").textContent = "Between waves";
    $("ovBody").textContent = "Pick one free upgrade. Base gear is still bought with cash.";
    const box = $("ovChoices");
    box.innerHTML = "";
    for (const perk of choices) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.innerHTML = "<b>" + perk.name + "</b><span>" + perk.desc + "</span>";
      b.addEventListener("click", () => choosePerk(perk));
      box.appendChild(b);
    }
    $("ovBtn").hidden = true;
    $("ovRestart").hidden = false;
    $("overlay").classList.remove("hidden");
  }

  function win() {
    state.phase = "won";
    $("ovTitle").textContent = "Compound stands";
    $("ovBody").textContent = "All 10 waves are down, Graveking included. Base left at " + Math.ceil(state.baseHp) + ".";
    $("ovChoices").innerHTML = "";
    $("ovBtn").hidden = false;
    $("ovRestart").hidden = true;
    $("overlay").classList.remove("hidden");
  }

  function lose() {
    if (state.phase === "lost" || state.phase === "won") return;
    state.phase = "lost";
    state.baseHp = 0;
    $("ovTitle").textContent = "Gate breached";
    $("ovBody").textContent = "The center fell on wave " + state.wave + ". The yard is theirs.";
    $("ovChoices").innerHTML = "";
    $("ovBtn").hidden = false;
    $("ovRestart").hidden = true;
    $("overlay").classList.remove("hidden");
  }

  function restart() {
    const muted = state.muted;
    units.length = 0;
    enemies.length = 0;
    bolts.length = 0;
    lobs.length = 0;
    patches.length = 0;
    flashes.length = 0;
    rings.length = 0;
    particles.length = 0;
    floaters.length = 0;
    const next = freshState();
    next.muted = muted;
    Object.assign(state, next);
    addUnit("vera");
    addUnit("roxie");
    layoutHomes();
    $("overlay").classList.add("hidden");
    $("ovChoices").innerHTML = "";
    $("mute").textContent = state.muted ? "OFF" : "SND";
    toast("Vera and Roxie hold the yard.");
  }

  function buildRoster() {
    const root = $("roster");
    root.innerHTML = "";
    for (const id of ORDER) {
      const h = HEROES[id];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hire";
      b.dataset.id = id;
      b.innerHTML = '<span class="face" style="background-image:url(assets/' + id + '.png)"></span>' +
        '<span class="meta"><b>' + h.short + '</b><small>' + h.tag + '</small><em class="price"></em><i class="own"></i></span>';
      b.addEventListener("click", () => buy(id));
      root.appendChild(b);
      rosterButtons[id] = b;
    }
  }

  function buildUps() {
    const root = $("baseShop");
    root.innerHTML = "";
    for (const id of ["wall", "aura", "turret"]) {
      const up = BASE_UPS[id];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "up";
      b.dataset.id = id;
      b.innerHTML = '<span class="mark">' + up.mark + '</span><span class="meta"><b>' + up.name +
        '</b><small>' + up.blurb + '</small><em class="lv"></em><i class="fx"></i></span>';
      b.addEventListener("click", () => buyUp(id));
      root.appendChild(b);
      upButtons[id] = b;
    }
  }

  $("next").addEventListener("click", () => { unlock(); startWave(); });
  $("restart").addEventListener("click", () => { unlock(); restart(); });
  $("ovBtn").addEventListener("click", () => restart());
  $("ovRestart").addEventListener("click", () => restart());
  $("mute").addEventListener("click", () => {
    state.muted = !state.muted;
    $("mute").textContent = state.muted ? "OFF" : "SND";
    if (!state.muted) unlock();
  });
  document.addEventListener("pointerdown", () => unlock(), { passive: true });
  window.addEventListener("keydown", (ev) => {
    if (ev.repeat) return;
    if (ev.target && ev.target.tagName === "BUTTON" && (ev.key === " " || ev.code === "Space")) return;
    if (ev.key === " " || ev.code === "Space") { ev.preventDefault(); startWave(); }
    else if (ev.key === "1") buy("vera");
    else if (ev.key === "2") buy("roxie");
    else if (ev.key === "3") buy("lila");
    else if (ev.key === "4") buy("nyx");
    else if (ev.key === "5") buyUp("wall");
    else if (ev.key === "6") buyUp("aura");
    else if (ev.key === "7") buyUp("turret");
    else if (ev.key === "r" || ev.key === "R") restart();
    else if (ev.key === "m" || ev.key === "M") $("mute").click();
  });
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => resize()).observe(stage);
  else window.addEventListener("resize", resize);


  loadSprites();
  buildRoster();
  buildUps();
  restart();

  let last = 0;
  function frame(ts) {
    let dt = last ? (ts - last) / 1000 : 0.016;
    last = ts;
    dt = Math.min(0.034, Math.max(0, dt));
    update(dt);
    draw();
    syncHud();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
