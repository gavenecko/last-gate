(() => {
  "use strict";

  const WORLD_W = 100;
  // 390x844 phone aspect so the yard fills the screen instead of letterboxing.
  const WORLD_H = WORLD_W * (844 / 390);
  const BASE = { x: WORLD_W / 2, y: WORLD_H / 2, r: 8.4 };
  const BASE_HP0 = 200;
  const START_CASH = 100;
  const CAP = 10;
  const FINALE = 100;
  const SPLASH_COUNT = 24;
  const ORDER = ["vera", "roxie", "lila", "nyx", "sable", "wren"];
  const TRACKS = [
    "assets/music/scrap-tension.mp3",
    "assets/music/scrap-tension-2.mp3",
    "assets/music/survival-loop.mp3",
    "assets/music/survival-loop-2.mp3",
    "assets/music/tick-tock-defense.mp3",
    "assets/music/tick-tock-defense-2.mp3",
  ];

  const HEROES = {
    vera: {
      name: "Vera Voss", extra: "Spotter", short: "Vera", role: "Rifle Sniper",
      tag: "Deadeye snipe", cost: 110, accent: "#e7c56a", attack: "snipe",
      dmg: 64, range: 37, rate: 0.7, move: 13.5, leash: 34, post: 19.5, seek: 48,
      unlock: 1,
    },
    roxie: {
      name: "Roxie Kane", extra: "Brawler", short: "Roxie", role: "Shotgun Brawler",
      tag: "Buckshot blast", cost: 80, accent: "#ff4d9a", attack: "blast",
      dmg: 17, range: 14, rate: 1.55, move: 17, leash: 17, post: 12.2, seek: 20,
      aoe: 5.3, cap: 5, capExtra: 3, unlock: 1,
    },
    lila: {
      name: "Lila Marsh", extra: "Torch", short: "Lila", role: "Firebug",
      tag: "Burn patch", cost: 140, accent: "#ff9a3c", attack: "patch",
      dmg: 12, range: 24, rate: 0.58, move: 14, leash: 27, post: 16, seek: 32,
      aoe: 6.6, patch: 22, patchTime: 2.9, unlock: 1,
    },
    nyx: {
      name: "Nyx Calder", extra: "Hexer", short: "Nyx", role: "Hex Warden",
      tag: "Slow / stun pulse", cost: 120, accent: "#c49bff", attack: "pulse",
      dmg: 8, range: 24, rate: 0.82, move: 15, leash: 28, post: 16.2, seek: 32,
      aoe: 6.4, slow: 0.46, slowTime: 2.15, stun: 0.5, stunExtra: 0.22, unlock: 1,
    },
    sable: {
      name: "Sable Quinn", extra: "Gunner", short: "Sable", role: "Pistol Gunner",
      tag: "Three-shot volley", cost: 90, accent: "#7ec8ff", attack: "volley",
      dmg: 11, range: 22, rate: 1.35, move: 16, leash: 24, post: 15, seek: 28,
      unlock: 4,
    },
    wren: {
      name: "Wren Holt", extra: "Lancer", short: "Wren", role: "Spear Lancer",
      tag: "Close cleave", cost: 75, accent: "#9be36a", attack: "cleave",
      dmg: 28, range: 9.5, rate: 1.25, move: 18, leash: 14, post: 10.5, seek: 16,
      aoe: 4.2, unlock: 6,
    },
  };

  const ENEMIES = {
    walker: { sprite: "zombie", hp: 40, speed: 7.2, r: 2.65, reward: 6, bite: 4, biteEvery: 0.95, armor: 0, slowRes: 0 },
    runner: { sprite: "runner", hp: 28, speed: 12.6, r: 2.25, reward: 8, bite: 3, biteEvery: 0.6, armor: 0, slowRes: 0.08, runner: true },
    tank: { sprite: "brute", hp: 170, speed: 4.05, r: 3.45, reward: 16, bite: 8, biteEvery: 1.05, armor: 0.12, slowRes: 0.28 },
    brute: { sprite: "brute", hp: 128, speed: 5.5, r: 3.25, reward: 14, bite: 6, biteEvery: 0.9, armor: 0.34, slowRes: 0.2, armored: true },
    boss: { sprite: "boss", hp: 1680, speed: 3.9, r: 5.9, reward: 80, bite: 18, biteEvery: 0.8, armor: 0.2, slowRes: 0.62, boss: true },
    crawler: { sprite: "crawler", hp: 18, speed: 15.4, r: 1.95, reward: 4, bite: 2, biteEvery: 0.55, armor: 0, slowRes: 0.05, crawler: true },
    spitter: { sprite: "spitter", hp: 54, speed: 6.1, r: 2.7, reward: 11, bite: 3, biteEvery: 1.1, armor: 0, slowRes: 0.1, spitter: true, spit: 7, spitEvery: 2.45, spitRange: 28, spitSpeed: 8.2 },
    shrieker: { sprite: "shrieker", hp: 76, speed: 6.5, r: 2.85, reward: 15, bite: 4, biteEvery: 1, armor: 0, slowRes: 0.16, shrieker: true, shriek: 1.42, shriekR: 12 },
    egg: { sprite: "", hp: 70, speed: 0, r: 2.4, reward: 5, bite: 0, biteEvery: 9, armor: 0, slowRes: 1, egg: true },
    bloater: { sprite: "bloater", hp: 124, speed: 4.25, r: 3.75, reward: 18, bite: 6, biteEvery: 1.05, armor: 0.06, slowRes: 0.22, bloater: true, explode: 16, explodeR: 13 },
  };

  const TYPE_NAME = {
    walker: "Walkers", runner: "Runners", tank: "Tanks", brute: "Brutes", boss: "The Graveking",
    crawler: "Crawlers", spitter: "Spitters", shrieker: "Shriekers", bloater: "Bloaters",
  };

  const DEBUTS = [
    { stage: 1, type: "walker", name: "Walker", line: "Walkers. Slow, and they bite the gate." },
    { stage: 3, type: "runner", name: "Runner", line: "Runners. Lighter, and much faster." },
    { stage: 5, type: "tank", name: "Tank", line: "Tanks. Thick, slow, and hard to drop." },
    { stage: 7, type: "brute", name: "Brute", line: "Brutes. Plated. Shots glance off." },
    { stage: 10, type: "boss", name: "Graveking", line: "The Graveking. He raises the dead around him and is shielded while they stand." },
    { stage: 20, type: "boss", name: "Brood Mother", line: "The Brood Mother. She lays eggs on the way in. Shoot them before they hatch." },
    { stage: 30, type: "boss", name: "Juggernaut", line: "The Juggernaut. A red lane means a charge. Drag heroines out of it or they get knocked flat." },
    { stage: 40, type: "boss", name: "Bile Queen", line: "The Bile Queen. Green rings turn into acid pools. Heroines in acid slow to a crawl. Drag them out." },
    { stage: 6, type: "crawler", name: "Crawler", line: "Crawlers. Small, fast, and they swarm." },
    { stage: 9, type: "spitter", name: "Spitter", line: "Spitters. They stop and lob a slow glob at the gate." },
    { stage: 11, type: "elite", name: "Elite", line: "Elites. Tinted gold, with a lot more health." },
    { stage: 13, type: "shrieker", name: "Shrieker", line: "Shriekers. The wail makes nearby dead hurry." },
    { stage: 17, type: "bloater", name: "Bloater", line: "Bloaters. They burst on death, and the gate takes it if they pop close." },
  ];

  const EARLY_META = {
    1: { name: "Shamble", blurb: "Walkers stumble in off every edge." },
    2: { name: "Pack", blurb: "A thicker crowd from all sides." },
    3: { name: "Strays", blurb: "Runners break ahead of the walkers." },
    4: { name: "Fast Swarm", blurb: "Challenge: the whole wave is sprinting." },
    5: { name: "Bulwark", blurb: "Tanks shoulder through the pack." },
    6: { name: "Crossfire", blurb: "Crawlers swarm in with the rest of the pack." },
    7: { name: "Armored Rush", blurb: "Challenge: plated brutes. Shots glance off." },
    8: { name: "Horde", blurb: "They do not stop coming." },
    9: { name: "Blackout", blurb: "Spitters lob from the dark with runners and iron." },
    10: { name: "Graveking", blurb: "Boss: the Graveking. He raises the dead and hides behind them. Kill the risen to break his shield." },
  };

  const EARLY_GROUPS = {
    1: [{ type: "walker", n: 8, every: 1.05 }],
    2: [{ type: "walker", n: 12, every: 0.78 }],
    3: [{ type: "walker", n: 6, every: 0.85 }, { type: "runner", n: 6, every: 0.95, delay: 1.8 }],
    4: [{ type: "runner", n: 12, every: 0.46 }, { type: "walker", n: 5, every: 0.7, delay: 0.8 }],
    5: [{ type: "walker", n: 8, every: 0.7 }, { type: "tank", n: 3, every: 2.2, delay: 1.4 }],
    6: [{ type: "crawler", n: 12, every: 0.3 }, { type: "runner", n: 6, every: 0.5, delay: 0.35 }, { type: "walker", n: 6, every: 0.62, delay: 0.4 }, { type: "tank", n: 2, every: 2.8, delay: 2 }],
    7: [{ type: "brute", n: 6, every: 1.2 }, { type: "runner", n: 8, every: 0.5, delay: 1 }],
    8: [{ type: "walker", n: 22, every: 0.32 }, { type: "tank", n: 3, every: 2.4, delay: 1.6 }],
    9: [{ type: "spitter", n: 4, every: 1.5, delay: 0.5 }, { type: "runner", n: 10, every: 0.36 }, { type: "tank", n: 3, every: 1.8, delay: 0.8 }],
    10: [{ type: "walker", n: 8, every: 0.5 }, { type: "boss", n: 1, every: 1, delay: 3.2 }, { type: "runner", n: 8, every: 0.48, delay: 4.5 }, { type: "brute", n: 2, every: 1.6, delay: 5.5 }],
  };

  const NAME_A = ["Ash", "Wire", "Ditch", "Lantern", "Marrow", "Cinder", "Hollow", "Rust", "Veil", "Chapel", "Orchard", "Static", "Gutter", "Pall", "Thorn", "Night", "Salt", "Glass", "River", "Kiln", "Moth", "Briar", "Hush", "Soot", "Willow", "Iron", "Fog", "Pine", "Grave", "Ember"];
  const NAME_B = ["Walk", "Line", "Hour", "Mouth", "Field", "Choir", "Rain", "Watch", "Bell", "Road", "Pit", "Song", "March", "Crown", "Flood", "Wake", "Gate", "Pack", "Cut", "Yard"];

  function cloneGroups(list) {
    const out = [];
    for (const g of list) out.push({ type: g.type, n: g.n, every: g.every, delay: g.delay || 0 });
    return out;
  }

  function debutsOn(n) {
    const list = [];
    for (const d of DEBUTS) if (d.stage === n) list.push(d);
    return list;
  }

  function stageName(n) {
    if (n === FINALE) return "Last Gate";
    if (n % 10 === 0) return BOSS_KINDS[bossKindFor(n)].name;
    if (EARLY_META[n]) return EARLY_META[n].name;
    const i = n - 11;
    return NAME_A[i % NAME_A.length] + " " + NAME_B[(i * 7) % NAME_B.length];
  }

  function describe(n, groups) {
    if (n === FINALE) return "Finale. The Last King comes for the yard with every trick: risen dead, eggs, acid, and the charge. He brings everyone.";
    if (EARLY_META[n]) return EARLY_META[n].blurb;
    const bits = [];
    const debut = debutsOn(n);
    if (debut.length) {
      const lines = [];
      for (const d of debut) lines.push(d.line);
      bits.push(lines.join(" "));
    }
    if (n % 10 === 0) bits.push(BOSS_KINDS[bossKindFor(n)].blurb);
    else if (n % 10 === 4) bits.push("The whole wave moves faster.");
    else if (n % 10 === 7) bits.push("Plated brutes. Shots glance off.");
    if (!bits.length) {
      const names = [];
      for (const g of groups) {
        const label = TYPE_NAME[g.type] || g.type;
        if (names.indexOf(label) === -1) names.push(label);
      }
      bits.push(names.join(", ") + " come in off every edge.");
    }
    return bits.join(" ");
  }

  function regionOf(n) {
    if (n >= 51) return "chapel";
    if (n >= 21) return "marsh";
    return "yard";
  }

  function regionHpMul(n) {
    if (n >= 51) return 1.3;
    if (n >= 21) return 1.15;
    return 1;
  }

  function hpMul(n, isBoss) {
    let mul;
    if (isBoss) {
      if (n >= FINALE) mul = 3.8;
      else mul = 1 + Math.max(0, n - 10) * 0.02;
    } else {
      mul = 1 + Math.max(0, n - 1) * 0.037;
    }
    // Late waves. Stages 1-15 stay on the base curve (both extras are 1).
    mul *= 1 + Math.max(0, n - 15) * 0.012;
    mul *= 1 + Math.max(0, n - 39) * 0.018;
    mul *= regionHpMul(n);
    // Extra bulk from the late yard onward. Stages 1-17 are unchanged by these.
    if (n >= 18) mul *= 1.22;
    if (n >= 30) mul *= 1.18;
    // Cards and abilities add power, so the back half gets a little thicker.
    mul *= 1 + Math.max(0, n - 25) * 0.004;
    return mul;
  }

  function speedMul(n) {
    let s = 1 + Math.min(0.32, Math.max(0, n - 1) * 0.0026);
    if (n % 10 === 4) s += 0.24;
    if (n >= 21 && n < 51) s *= 1.08;
    return s;
  }

  function makeGroups(n) {
    if (n <= 10) return cloneGroups(EARLY_GROUPS[n]);
    if (n === FINALE) {
      return cloneGroups([
        { type: "walker", n: 16, every: 0.34 },
        { type: "runner", n: 12, every: 0.3, delay: 0.4 },
        { type: "crawler", n: 14, every: 0.24, delay: 0.2 },
        { type: "tank", n: 4, every: 1.6, delay: 1.2 },
        { type: "brute", n: 4, every: 1.4, delay: 1.5 },
        { type: "spitter", n: 5, every: 1.5, delay: 2 },
        { type: "shrieker", n: 3, every: 2, delay: 1.8 },
        { type: "bloater", n: 4, every: 1.8, delay: 2.4 },
        { type: "boss", n: 1, every: 1, delay: 3.2 },
      ]);
    }
    const groups = [];
    const late = Math.min(1, Math.max(0, (n - 10) / 90));
    const add = (type, count, every, delay) => {
      const c = Math.round(count);
      if (c <= 0) return;
      groups.push({ type: type, n: c, every: Math.max(0.22, every), delay: delay || 0 });
    };
    const crawlerFeature = n === 6 || n % 4 === 0 || n % 10 === 2;
    const spitFeature = n === 9 || n % 5 === 3 || n % 10 === 8;
    const shriekFeature = n === 13 || n % 6 === 2 || n % 10 === 6;
    const bloatFeature = n === 17 || n % 7 === 6 || n % 10 === 4;
    add("walker", 8 + n * 0.2, 0.74 - late * 0.34, 0);
    add("runner", 3 + n * 0.09, 0.58 - late * 0.22, 0.7);
    if (n % 2 === 1 || n % 10 === 0) add("tank", 1 + n / 24, 2.05, 1.3);
    if (n % 10 === 7 || n % 10 === 9 || n % 10 === 0 || n % 10 === 5) add("brute", 1 + n / 22, 1.4, 1.05);
    if (n >= 6 && crawlerFeature) add("crawler", n === 6 ? 16 : 7 + n * 0.07, 0.28, 0.25);
    else if (n >= 6) add("crawler", 4 + n * 0.03, 0.36, 0.5);
    if (n >= 9 && spitFeature) add("spitter", n === 9 ? 4 : 2 + n / 32, 1.65, 1.7);
    else if (n > 9) add("spitter", 1 + n / 40, 1.8, 2.2);
    if (n >= 13 && shriekFeature) add("shrieker", n === 13 ? 3 : 1 + n / 42, 2.15, 1.15);
    else if (n > 13) add("shrieker", 1, 2.4, 1.6);
    if (n >= 17 && bloatFeature) add("bloater", n === 17 ? 4 : 1 + n / 30, 1.95, 2);
    else if (n > 17) add("bloater", 1, 2.3, 2.4);
    if (n % 10 === 0) {
      add("boss", 1, 1, 3);
      add("runner", 6 + n * 0.03, 0.4, 4);
      if (n >= 13) add("shrieker", 1, 2, 3.4);
      if (n >= 17) add("bloater", 2, 2.2, 4.6);
    }
    const scaleType = (type, mul) => {
      for (const g of groups) {
        if (g.type !== type || g.type === "boss") continue;
        g.n = Math.max(1, Math.round(g.n * mul));
      }
    };
    const hasType = (type) => {
      for (const g of groups) if (g.type === type) return true;
      return false;
    };
    // Marsh and chapel shift the mix. Bosses stay on the tenth stages only.
    if (n >= 21 && n < 51) {
      scaleType("crawler", 1.5);
      scaleType("spitter", 1.45);
      scaleType("bloater", 1.4);
      if (!hasType("crawler")) add("crawler", 6, 0.3, 0.2);
      if (!hasType("spitter")) add("spitter", 2, 1.6, 1);
      if (!hasType("bloater")) add("bloater", 2, 2, 1.4);
    }
    if (n >= 51) {
      scaleType("shrieker", 1.6);
      scaleType("brute", 1.5);
      if (!hasType("shrieker")) add("shrieker", 2, 2, 1);
      if (!hasType("brute")) add("brute", 2, 1.4, 1.1);
    }
    if (n > 25) {
      if (n >= 51) add("shrieker", 2, 2.1, 0.6);
      else add("crawler", 4, 0.3, 0.25);
    }
    if (n > 60) {
      if (n >= 51) add("brute", 2, 1.5, 1.2);
      else add("bloater", 2, 2, 1.4);
    }
    // Extra pack from 22. Stacks with the crawler pack that already starts after 25.
    if (n >= 22) {
      if (n % 2 === 0) add("runner", 4, 0.42, 0.35);
      else add("crawler", 4, 0.32, 0.3);
    }
    let total = 0;
    for (const g of groups) total += g.n;
    const capN = Math.min(130, 40 + Math.floor(n * 0.85));
    if (total > capN) {
      const scale = capN / total;
      for (const g of groups) {
        if (g.type === "boss") continue;
        g.n = Math.max(1, Math.round(g.n * scale));
      }
    }
    return groups;
  }

  const STAGE_CACHE = [];
  function stageSpec(n) {
    const idx = Math.max(1, n | 0);
    if (!STAGE_CACHE[idx]) {
      const groups = makeGroups(idx);
      let challenge = null;
      if (idx % 10 !== 0 && idx % 10 === 4) challenge = "faster";
      else if (idx % 10 !== 0 && idx % 10 === 7) challenge = "armored";
      else if (idx % 10 !== 0 && idx >= 12 && idx % 10 === 2) challenge = "swarm";
      STAGE_CACHE[idx] = {
        n: idx,
        name: stageName(idx),
        blurb: describe(idx, groups),
        groups: groups,
        boss: idx % 10 === 0,
        finale: idx === FINALE,
        challenge: challenge,
        speed: speedMul(idx),
        hpMul: hpMul(idx, false),
        bossHp: hpMul(idx, true),
      };
    }
    return STAGE_CACHE[idx];
  }

  const BASE_UPS = {
    wall: { name: "Sandbag Wall", mark: "W", blurb: "Armor. The base takes less damage.", costs: [65, 95, 140, 210, 280], max: 5 },
    aura: { name: "Dread Aura", mark: "A", blurb: "Zombies slow down near the gate.", costs: [75, 110, 155, 233, 310], max: 5 },
    turret: { name: "Sentry Turret", mark: "T", blurb: "A gun on the compound fires by itself.", costs: [85, 125, 175, 263, 350], max: 5 },
    spikes: { name: "Bite Spikes", mark: "S", blurb: "Biters take damage when they hit the gate.", costs: [70, 100, 145, 218, 290], max: 5 },
    mend: { name: "Field Mend", mark: "M", blurb: "The gate slowly heals.", costs: [60, 90, 130, 195, 260], max: 5 },
    mines: { name: "Yard Mines", mark: "N", blurb: "A mine pops the nearest zombie.", costs: [90, 130, 180, 270, 360], max: 5 },
    ammo: { name: "Ammo Stock", mark: "B", blurb: "Every heroine hits a little harder.", costs: [100, 150, 210, 280], max: 4 },
    squad: { name: "Squad Call", mark: "C", blurb: "Room for two more heroines.", costs: [120, 180, 260], max: 3 },
  };
  const WALL_CUT = [0, 0.18, 0.32, 0.46, 0.54, 0.60];
  const AURA = [null, { r: 13.5, slow: 0.8 }, { r: 16.5, slow: 0.66 }, { r: 20, slow: 0.52 }, { r: 22, slow: 0.44 }, { r: 23.5, slow: 0.39 }];
  const TURRET = [null, { dmg: 11, rate: 1.15, range: 26 }, { dmg: 18, rate: 1.45, range: 30 }, { dmg: 28, rate: 1.75, range: 34 }, { dmg: 34, rate: 1.93, range: 36.5 }, { dmg: 38, rate: 2.05, range: 38.5 }];
  const SPIKE_DMG = [0, 8, 14, 22, 27, 31];
  const MEND_RATE = [0, 1.2, 2.2, 3.4, 4.2, 4.8];
  const MINES = [null, { every: 2.6, range: 30, dmg: 24 }, { every: 2.1, range: 36, dmg: 40 }, { every: 1.7, range: 42, dmg: 58 }, { every: 1.45, range: 46, dmg: 68 }, { every: 1.3, range: 49, dmg: 76 }];
  const UP_IDS = ["wall", "aura", "turret", "spikes", "mend", "mines", "ammo", "squad"];

  const SKILL_COST = [80, 140, 220];
  const SKILL_FORK = {
    range: { name: "Range", blurb: "+14% range" },
    tempo: { name: "Tempo", blurb: "+16% attack rate" },
  };
  const SKILL_NODES = {
    vera: [
      { name: "Keen Eye", blurb: "+18% damage" },
      null,
      { name: "Long Glass", blurb: "+12% range" },
    ],
    roxie: [
      { name: "Buck and Ball", blurb: "+18% damage" },
      null,
      { name: "Extra Pellet", blurb: "The blast hits one more target" },
    ],
    lila: [
      { name: "Hotter Mix", blurb: "+18% damage" },
      null,
      { name: "Long Burn", blurb: "The fire patch lasts longer" },
    ],
    nyx: [
      { name: "Hex Mark", blurb: "+18% damage" },
      null,
      { name: "Deep Hex", blurb: "Slow and stun bite harder" },
    ],
    sable: [
      { name: "Tight Group", blurb: "+18% damage" },
      null,
      { name: "Fourth Shot", blurb: "The volley fires one more round" },
    ],
    wren: [
      { name: "Heavy Haft", blurb: "+18% damage" },
      null,
      { name: "Hard Cleave", blurb: "The swing hits harder" },
    ],
  };
  const JOBS = { vera: "Sniper", roxie: "Shotgun", lila: "Fire", nyx: "Hex", sable: "Pistols", wren: "Spear" };
  const LAB_MAX = 12;
  const LAB_TRACKS = [
    { id: "power", name: "Power", blurb: "+7% heroine damage per level. Stacks with skills." },
    { id: "tempo", name: "Tempo", blurb: "+5% heroine attack rate per level." },
    { id: "gate", name: "Gate", blurb: "+20 max HP and +$2 starting cash per level. Next run." },
  ];
  const META_KEY = "last-gate-meta";

  function defaultMeta() {
    return { ash: 0, power: 0, tempo: 0, gate: 0, veteran: "", regions: { yard: true, marsh: false, chapel: false } };
  }

  function loadMeta() {
    try {
      const raw = localStorage.getItem(META_KEY);
      const meta = defaultMeta();
      if (!raw) return meta;
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return meta;
      meta.ash = Math.max(0, data.ash | 0);
      meta.power = clamp(data.power | 0, 0, LAB_MAX);
      meta.tempo = clamp(data.tempo | 0, 0, LAB_MAX);
      meta.gate = clamp(data.gate | 0, 0, LAB_MAX);
      if (data.regions && typeof data.regions === "object") {
        meta.regions.marsh = !!data.regions.marsh;
        meta.regions.chapel = !!data.regions.chapel;
      }
      if (typeof data.veteran === "string" && HEROES[data.veteran]) meta.veteran = data.veteran;
      return meta;
    } catch (err) {
      return defaultMeta();
    }
  }

  function saveMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(meta)); }
    catch (err) { /* keep playing on defaults */ }
  }

  function labCost(level) {
    return 12 * ((level | 0) + 1);
  }

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

  // ---------- Run variety: twists, cards, abilities, bosses, events ----------
  // Twists are rolled per stage on the brief. bonus = extra share of the clear bonus, ash = extra ash.
  const TWISTS = {
    fog: { name: "Fog", desc: "The dead are hidden until they reach the light of the gate or a heroine. Unseen zombies cannot be shot.", pay: "+40% clear cash, +2 ash", bonus: 0.4, ash: 2, color: "#9fb4c8", boss: true },
    bloodmoon: { name: "Blood Moon", desc: "Zombies move 25% faster. Every kill pays double.", pay: "Kills pay x2", bonus: 0, ash: 1, color: "#ff4d5e", boss: true },
    onesided: { name: "One-Sided Horde", desc: "Everything comes from one or two edges, and there are more of them.", pay: "+35% clear cash, +1 ash", bonus: 0.35, ash: 1, color: "#ffb05a", boss: false },
    ironhide: { name: "Ironhide", desc: "Flat armor shaves every hit. Small hits barely scratch; big hitters shine.", pay: "+45% clear cash, +2 ash", bonus: 0.45, ash: 2, color: "#a9c2dd", boss: true },
    swarm: { name: "The Swarm", desc: "A flood of small, fast, weak crawlers on top of the wave.", pay: "+30% clear cash, +1 ash", bonus: 0.3, ash: 1, color: "#b8f06a", boss: false },
    frenzy: { name: "Frenzy", desc: "Hurt zombies run faster the closer they are to dying.", pay: "+35% clear cash, +1 ash", bonus: 0.35, ash: 1, color: "#ff7a3c", boss: true },
    exploding: { name: "Exploding Dead", desc: "Corpses burst. The blast hurts nearby zombies, and the gate if they die close to it.", pay: "+30% clear cash, +1 ash", bonus: 0.3, ash: 1, color: "#ffcf5a", boss: false },
    giants: { name: "Night of Giants", desc: "Fewer small dead. Many more tanks and brutes, and they are huge.", pay: "+45% clear cash, +2 ash", bonus: 0.45, ash: 2, color: "#d2a6ff", boss: false },
    goldrush: { name: "Gold Rush", desc: "Some zombies glow gold. They are tougher and drop five times the cash.", pay: "Gold zombies pay x5", bonus: 0, ash: 0, color: "#ffd94a", boss: false },
    plague: { name: "Plague", desc: "The dead leave toxic puddles. Heroines standing in them slow down. Drag them out.", pay: "+35% clear cash, +1 ash", bonus: 0.35, ash: 1, color: "#8fe36a", boss: true },
  };
  const TWIST_IDS = Object.keys(TWISTS);

  const RARITY = {
    common: { name: "Common", weight: 6 },
    rare: { name: "Rare", weight: 4 },
    epic: { name: "Epic", weight: 1.6 },
  };
  const CARDS = [
    { id: "dragonshells", name: "Dragon Shells", rarity: "rare", kind: "roxie", desc: "Roxie's pellets set zombies on fire." },
    { id: "wildfire", name: "Wildfire", rarity: "epic", kind: "lila", desc: "Lila's fire ignites zombies, and burning zombies spread it to their neighbours." },
    { id: "hexthorns", name: "Hex Thorns", rarity: "rare", kind: "nyx", desc: "Zombies slowed by Nyx take damage every second." },
    { id: "hollowpoint", name: "Hollow Points", rarity: "rare", kind: "vera", desc: "Vera's shots pierce through to 2 more zombies." },
    { id: "ricochet", name: "Ricochet", rarity: "rare", kind: "sable", desc: "Sable's bullets bounce to a second zombie." },
    { id: "shockhaft", name: "Shock Haft", rarity: "common", kind: "wren", desc: "Wren's cleave knocks zombies back and staggers them." },
    { id: "chainmines", name: "Chain Mines", rarity: "rare", kind: "", desc: "Mines blast an area and set off a second mine. Grants Mines LV 1 if you have none." },
    { id: "thorngate", name: "Thorned Gate", rarity: "common", kind: "", desc: "Biters take heavy thorn damage on every bite. Spikes hit twice as hard." },
    { id: "twinbarrel", name: "Twin Barrel", rarity: "rare", kind: "", desc: "The turret fires a second barrel at another zombie. Grants Turret LV 1 if you have none." },
    { id: "triage", name: "Field Triage", rarity: "common", kind: "", desc: "Every kill heals the gate 0.5 HP." },
    { id: "precision", name: "Deadly Precision", rarity: "rare", kind: "", desc: "Heroine hits: +15% crit chance. Crits deal 2.5x." },
    { id: "quickhands", name: "Quick Hands", rarity: "common", kind: "", desc: "Ability cooldowns are 25% shorter." },
    { id: "spree", name: "Killing Spree", rarity: "rare", kind: "", desc: "12 kills in a quick streak: heroines attack 35% faster for 5 seconds." },
    { id: "interest", name: "Compound Interest", rarity: "common", kind: "", desc: "Earn 5% of your banked cash after each stage (up to $60)." },
    { id: "overcharge", name: "Overcharge", rarity: "epic", kind: "", desc: "Abilities hit 50% harder and last 25% longer." },
    { id: "mortar", name: "Mortar Team", rarity: "epic", kind: "", desc: "Every 6 seconds a shell lands on the biggest crowd." },
    { id: "goldteeth", name: "Gold Teeth", rarity: "common", kind: "", desc: "Kills pay 25% more cash." },
    { id: "secondwind", name: "Second Wind", rarity: "rare", kind: "", desc: "Once per stage, when the gate drops below 30%, it heals 35% and the dead freeze for 2s." },
  ];
  const CARD_BY_ID = {};
  for (const c of CARDS) CARD_BY_ID[c.id] = c;

  const ABILITIES = {
    vera: { name: "Deadeye", cd: 32, desc: "Marks the toughest zombies and drops each with a heavy shot." },
    roxie: { name: "Dragon's Breath", cd: 24, desc: "A ring of fire around Roxie. Knocks back and burns." },
    lila: { name: "Fire Wall", cd: 36, desc: "A ring of fire around the gate for a few seconds." },
    nyx: { name: "Time Freeze", cd: 42, desc: "Every zombie on the field freezes for 3 seconds." },
    sable: { name: "Bullet Storm", cd: 28, desc: "Sable sprays bullets all around for 4 seconds." },
    wren: { name: "Whirlwind", cd: 26, desc: "Wren spins into the nearest crowd, cutting everything." },
  };

  const BOSS_KINDS = {
    graveking: { name: "Graveking", label: "GRAVEKING", filter: "none", blurb: "Boss: the Graveking. He raises the dead and hides behind them. Kill the risen to break his shield.", debut: "The Graveking. He raises the dead around him and is shielded while they stand." },
    brood: { name: "Brood Mother", label: "BROOD MOTHER", filter: "hue-rotate(70deg) saturate(1.5) brightness(0.95)", blurb: "Boss: the Brood Mother. She lays eggs that hatch into crawlers. Break them early.", debut: "The Brood Mother. She lays eggs on the way in. Shoot them before they hatch." },
    juggernaut: { name: "Juggernaut", label: "JUGGERNAUT", filter: "sepia(0.7) saturate(1.8) hue-rotate(-25deg) brightness(0.85)", blurb: "Boss: the Juggernaut. He marks a lane, then charges down it. Move heroines out of the red.", debut: "The Juggernaut. A red lane means a charge. Drag heroines out of it or they get knocked flat." },
    bile: { name: "Bile Queen", label: "BILE QUEEN", filter: "hue-rotate(100deg) saturate(1.9) brightness(1.05)", blurb: "Boss: the Bile Queen. She lobs acid at heroines. Green rings become pools that slow them.", debut: "The Bile Queen. Green rings turn into acid pools. Heroines in acid slow to a crawl. Drag them out." },
    lastking: { name: "Last King", label: "LAST KING", filter: "saturate(1.4) brightness(1.1)", blurb: "Finale. The Last King uses every trick: risen dead, eggs, acid, and the charge.", debut: "" },
  };
  const BOSS_CYCLE = ["graveking", "brood", "juggernaut", "bile"];
  function bossKindFor(n) {
    if (n >= FINALE) return "lastking";
    return BOSS_CYCLE[((Math.max(10, n) / 10 | 0) - 1) % BOSS_CYCLE.length];
  }
  const BOUNTY_NAMES = ["Butcher Hank", "Mother Rot", "Old Sawtooth", "Gravel Jaw", "Sister Ash", "The Deacon", "Big Marrow", "Hollow Tom", "Lady Lye", "Rattlebone"];
  const EVENT_KINDS = ["survivor", "drop", "bounty", "rally", "breach"];
  const TIPS_KEY = "last-gate-tips";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const canvas = $("game");
  const ctx = canvas.getContext("2d");
  const stage = $("stage");

  // Field art is the cutout PNGs (real alpha). Drawn whole with drawSprite.
  //   assets/vera-sprite.png assets/roxie-sprite.png assets/lila-sprite.png assets/nyx-sprite.png
  //   assets/zombie-sprite.png assets/zombie-brute-sprite.png assets/boss-sprite.png
  //   assets/base-sprite.png assets/upgrade-wall-sprite.png assets/upgrade-aura-sprite.png assets/upgrade-turret-sprite.png
  // Walk sheets are 4-frame strips. Missing sheets fall back to the static sprite; if neither image is ready, only the caller's ground shadow remains.
  const sprites = {};
  const walks = {};
  const WALK_FRAMES = 4;
  function loadSprites() {
    const files = [
      ["vera", "assets/vera-sprite.png"],
      ["roxie", "assets/roxie-sprite.png"],
      ["lila", "assets/lila-sprite.png"],
      ["nyx", "assets/nyx-sprite.png"],
      ["sable", "assets/sable.png"],
      ["wren", "assets/wren.png"],
      ["zombie", "assets/zombie-sprite.png"],
      ["brute", "assets/zombie-brute-sprite.png"],
      ["boss", "assets/boss-sprite.png"],
      ["base", "assets/base-sprite.png"],
      ["wall", "assets/upgrade-wall-sprite.png"],
      ["aura", "assets/upgrade-aura-sprite.png"],
      ["turret", "assets/upgrade-turret-sprite.png"],
    ];
    for (const key of ["vera", "roxie", "lila", "nyx", "sable", "wren", "zombie", "brute", "boss", "runner", "crawler", "spitter", "shrieker", "bloater"]) {
      const sheet = new Image();
      sheet.decoding = "async";
      sheet.onload = () => { walks[key] = sheet; };
      sheet.onerror = () => { walks[key] = null; };
      sheet.src = "assets/" + key + "-walk.png";
    }
    for (const row of files) {
      const key = row[0];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { sprites[key] = img; };
      img.onerror = () => { sprites[key] = null; };
      img.src = row[1];
    }
  }

  const units = [];
  const enemies = [];
  const bolts = [];
  const lobs = [];
  const patches = [];
  const flashes = [];
  const sweeps = [];
  const rings = [];
  const particles = [];
  const floaters = [];
  const spits = [];
  const marks = [];   // telegraphs on the ground (boss attacks, breaches, mortar)
  const pools = [];   // acid / plague puddles that slow heroines
  const drops = [];   // tappable pickups (supply drop, ammo cache)
  const fxs = [];     // ability visuals
  const bursts = [];  // queued corpse bursts (Exploding Dead)
  let uid = 1;
  let eid = 1;

  function freshState() {
    return {
      phase: "shop",
      wave: 1,
      cash: START_CASH,
      earned: 0,
      baseHp: BASE_HP0,
      baseMax: BASE_HP0,
      ups: { wall: 0, aura: 0, turret: 0, spikes: 0, mend: 0, mines: 0, ammo: 0, squad: 0 },
      lossAsh: 0,
      dmgMult: 1, rateMult: 1, moveMult: 1, rangeMult: 1,
      sale: 0,
      mods: {},
      kills: 0, spawned: 0, shots: 0, travel: 0,
      closest: 1e9, baseHurt: 0,
      log: [],
      time: 0, fightT: 0,
      shake: 0, baseFlash: 0, banner: null,
      muted: false, sent: false, runLive: false,
      pausedFrom: null,
      perkDue: false, perkPicked: true,
      crateDue: false, crateTaken: true, crateOffer: "",
      spawnQ: [], offer: [],
      turretCd: 0.2, turretAng: -Math.PI / 2, turretFlash: 0,
      mineCd: 2.6,
      armedMines: 0, armedCd: 0.4,
      toldSable: false,
      toldWren: false,
      skills: { vera: 0, roxie: 0, lila: 0, nyx: 0, sable: 0, wren: 0 },
      fork: { vera: "", roxie: "", lila: "", nyx: "", sable: "", wren: "" },
      toldMarsh: false,
      toldChapel: false,
      startRegion: "yard",
      // Twists for the current stage, and how long since the last twisted stage.
      twists: [], tw: {}, twistWave: 0, twistSince: 0, lastTwist: "", ironArmor: 0,
      spawnSides: null,
      // Boss reward cards.
      cards: [], cardSet: {}, cardDue: false, cardPicked: true,
      // Tap abilities.
      abil: { vera: 0, roxie: 0, lila: 0, nyx: 0, sable: 0, wren: 0 },
      fireWall: null, freezeT: 0, rallyT: 0, spreeT: 0, streak: 0, streakT: 0,
      mortarCd: 6, windUsed: false,
      // Mid-stage events.
      event: null, eventAt: -1, eventKind: "", lastEvent: "", breachT: 0,
      abilMax: {},
    };
  }
  const state = freshState();
  state.phase = "title";

  let view = { ox: 0, oy: 0, s: 1 };
  let audioCtx = null;
  let music = null;
  let musicSrc = "";
  let noiseBuf = null;
  let meta = loadMeta();
  let pickedRegion = "yard";
  let toastTimer = 0;
  const rosterButtons = {};
  const upButtons = {};
  // Shop drawer. While open the simulation is frozen; phase stays "shop"/"fight" so buying works.
  let shopOpen = false;
  let drag = null;
  let lastTap = { id: 0, t: 0 };
  let shopFromPause = false;

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
    const rank = (state.skills && state.skills[u.kind]) || 0;
    const fork = (state.fork && state.fork[u.kind]) || "";
    const skillDmg = rank >= 1 ? 1.18 : 1;
    const skillRate = rank >= 2 && fork === "tempo" ? 1.16 : 1;
    const ammoDmg = Math.pow(1.08, (state.ups && state.ups.ammo) || 0);
    const labDmg = 1 + (meta.power || 0) * 0.07;
    const labRate = 1 + (meta.tempo || 0) * 0.05;
    let range = h.range * (u.named ? 1 : 0.88) * state.rangeMult;
    if (rank >= 2 && fork === "range") range *= 1.14;
    let seek = h.seek * state.rangeMult;
    let patchTime = (h.patchTime || 2.4) * (u.named ? 1 : 0.75);
    let slow = h.slow || 0.5;
    let slowTime = (h.slowTime || 2) * (u.named ? 1 : 0.8);
    let stun = u.named ? (h.stun || 0) : (h.stunExtra || 0);
    let cap = u.named ? (h.cap || 5) : (h.capExtra || 3);
    let volley = 3;
    let cleave = u.named ? 1.25 : 1;
    if (rank >= 3 && u.kind === "vera") {
      range *= 1.12;
      seek *= 1.12;
    }
    if (rank >= 3 && u.kind === "roxie") cap += 1;
    if (rank >= 3 && u.kind === "lila") patchTime *= 1.45;
    if (rank >= 3 && u.kind === "nyx") {
      slow = Math.max(0.18, slow * 0.8);
      stun *= 1.35;
      slowTime *= 1.2;
    }
    if (rank >= 3 && u.kind === "sable") volley = 4;
    if (rank >= 3 && u.kind === "wren") cleave *= 1.2;
    // Short-lived buffs and debuffs: rally cache, killing spree, acid / plague slow.
    let tempRate = 1;
    if (state.rallyT > 0) tempRate *= 1.4;
    if (state.spreeT > 0) tempRate *= 1.35;
    if (u.slowT > 0) tempRate *= 0.5;
    const tempMove = u.slowT > 0 ? 0.55 : 1;
    return {
      kind: h.attack,
      accent: h.accent,
      dmg: h.dmg * low * state.dmgMult * skillDmg * labDmg * ammoDmg,
      range: range,
      rate: h.rate * (u.named ? 1 : 0.9) * state.rateMult * skillRate * labRate * tempRate,
      move: h.move * (u.named ? 1 : 0.92) * state.moveMult * tempMove,
      leash: h.leash,
      seek: seek,
      post: h.post,
      aoe: (h.aoe || 0) * (u.named ? 1 : 0.78),
      patch: (h.patch || 0) * low * state.dmgMult * skillDmg * labDmg * ammoDmg,
      patchTime: patchTime,
      slow: slow,
      slowTime: slowTime,
      stun: stun,
      cap: cap,
      volley: volley,
      cleave: cleave,
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
      lunge: 0,
      step: 0,
      combat: false,
      hold: null,
      dazeT: 0, slowT: 0,
      stormT: 0, stormCd: 0,
      whirlT: 0, whirlCd: 0,
      knockId: 0,
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

  function squadCap() {
    return CAP + ((state.ups && state.ups.squad) || 0) * 2;
  }

  function buy(id) {
    if (!canShop()) return;
    const hero = HEROES[id];
    if (!hero) return;
    if (state.wave < (hero.unlock || 1)) { toast("Locked until stage " + hero.unlock); return; }
    if (units.length >= squadCap()) { toast("Squad is full"); return; }
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
    const sides = state.spawnSides;
    const side = sides && sides.length ? sides[(Math.random() * sides.length) | 0] : (Math.random() * 4) | 0;
    if (side === 0) return { x: rand(pad, WORLD_W - pad), y: pad };
    if (side === 1) return { x: WORLD_W - pad, y: rand(pad, WORLD_H - pad) };
    if (side === 2) return { x: rand(pad, WORLD_W - pad), y: WORLD_H - pad };
    return { x: pad, y: rand(pad, WORLD_H - pad) };
  }

  function markElites(q, n) {
    if (n < 11) return;
    const pool = [];
    for (let i = 0; i < q.length; i++) if (q[i].type !== "boss") pool.push(i);
    let want = 1;
    if (n >= 75) want = 4;
    else if (n >= 50) want = 3;
    else if (n >= 30) want = 2;
    if (n >= 51) want += 1;
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    const k = Math.min(want, pool.length);
    for (let i = 0; i < k; i++) q[pool[i]].elite = true;
  }

  const NO_OPTS = {};
  function spawnEnemy(type, elite, opts) {
    const proto = ENEMIES[type];
    if (!proto) return null;
    opts = opts || NO_OPTS;
    const spec = stageSpec(state.wave);
    const p = opts.x != null ? { x: opts.x, y: opts.y } : edgePoint();
    let mul = proto.boss ? spec.bossHp : spec.hpMul;
    if (opts.hpMul) mul *= opts.hpMul;
    const hp = Math.max(1, Math.round(proto.hp * mul));
    const foe = {
      id: ++eid,
      type: type,
      sprite: proto.sprite,
      boss: !!proto.boss,
      runner: !!proto.runner,
      armored: !!proto.armored,
      crawler: !!proto.crawler,
      spitter: !!proto.spitter,
      shrieker: !!proto.shrieker,
      bloater: !!proto.bloater,
      egg: !!proto.egg,
      elite: false,
      x: p.x, y: p.y, r: proto.r,
      hp: hp, max: hp,
      speed: proto.speed * spec.speed,
      reward: proto.reward,
      bite: proto.bite,
      biteEvery: proto.biteEvery,
      biteCd: 0.3 + Math.random() * 0.35,
      armor: proto.armor,
      slowRes: proto.slowRes,
      slowFactor: 1, slowT: 0, stunT: 0,
      walk: Math.random() * 8,
      side: Math.random() < 0.5 ? -1 : 1,
      flash: 0, dead: false, dying: 0, dyingMax: 0.42, lunge: 0,
      spitDmg: proto.spit ? Math.max(1, Math.round(proto.spit * (1 + (state.wave - 1) * 0.012))) : 0,
      spitEvery: proto.spitEvery || 2.45,
      spitRange: proto.spitRange || 28,
      spitSpeed: proto.spitSpeed || 8.2,
      spitCd: proto.spitter ? rand(0.35, proto.spitEvery || 2.45) : 0,
      shriek: proto.shriek || 1.42,
      shriekR: proto.shriekR || 12,
      explode: proto.explode ? Math.max(1, Math.round(proto.explode * (1 + (state.wave - 1) * 0.015))) : 0,
      explodeR: proto.explodeR || 13,
      // Twists, cards, bosses and events.
      scale: 1, gold: false, small: false, giant: false,
      bounty: 0, bname: "", minionOf: 0,
      bossKind: "", patT: 0, patStep: 0, charge: null, shielded: false, eggCd: 0,
      burnT: 0, burnDps: 0, spreadCd: 0, hexT: 0, hexDps: 0,
      hatchT: proto.egg ? 4.6 : 0,
      lit: true, plagueCd: rand(1.5, 4.5), reached: false,
    };
    if (state.tw.bloodmoon) foe.speed *= 1.25;
    if (opts.small) {
      foe.small = true;
      foe.hp = foe.max = Math.max(1, Math.round(foe.hp * 0.55));
      foe.speed *= 1.15;
      foe.scale = 0.82;
      foe.r *= 0.82;
      foe.reward = Math.max(1, Math.round(foe.reward * 0.6));
    }
    if (opts.giant) {
      foe.giant = true;
      foe.hp = foe.max = Math.round(foe.hp * 1.35);
      foe.scale = 1.25;
      foe.r *= 1.25;
      foe.speed *= 0.92;
      foe.reward = Math.round(foe.reward * 1.6);
      foe.bite = Math.round(foe.bite * 1.3);
    }
    if (elite && !proto.boss) {
      foe.elite = true;
      foe.hp = Math.max(1, Math.round(foe.hp * 2.15));
      foe.max = foe.hp;
      foe.reward = Math.max(1, Math.round(foe.reward * 1.85));
      foe.speed *= 1.06;
      foe.armor = Math.min(0.58, (foe.armor || 0) + 0.1);
      foe.bite = Math.max(1, Math.round(foe.bite * 1.25));
      foe.r *= 1.06;
    }
    if (opts.gold && !proto.boss) {
      foe.gold = true;
      foe.hp = foe.max = Math.round(foe.hp * 1.3);
      foe.reward = foe.reward * 5;
    }
    if (opts.minion) {
      foe.minionOf = opts.minion;
      foe.reward = 2;
    }
    if (proto.boss) {
      foe.bossKind = bossKindFor(state.wave);
      foe.patT = 3.5;
      foe.eggCd = 5;
      if (foe.bossKind === "juggernaut") { foe.hp = foe.max = Math.round(foe.hp * 1.1); foe.speed *= 0.9; }
      if (foe.bossKind === "brood") foe.speed *= 0.92;
    }
    if (proto.boss && state.wave === FINALE) foe.r *= 1.1;
    if (state.freezeT > 0) foe.stunT = state.freezeT * (proto.boss ? 0.5 : 1);
    enemies.push(foe);
    state.spawned++;
    if (!opts.quiet) playGroan(!!proto.boss);
    return foe;
  }

  function hasTwist(id) { return !!state.tw[id]; }

  function setTwists(list) {
    state.twists = list.slice();
    state.twistWave = state.wave;
    state.tw = {};
    for (const id of state.twists) state.tw[id] = true;
  }

  // The stage's groups, bent by its twists.
  function twistGroups(spec) {
    const n = spec.n;
    const groups = [];
    for (const g of spec.groups) groups.push({ type: g.type, n: g.n, every: g.every, delay: g.delay || 0, small: false, giant: false });
    if (spec.finale) return groups;
    if (hasTwist("giants")) {
      let tanks = false;
      for (const g of groups) {
        if (g.type === "walker" || g.type === "crawler") g.n = Math.max(1, Math.round(g.n * 0.4));
        else if (g.type === "runner") g.n = Math.max(1, Math.round(g.n * 0.5));
        else if (g.type === "tank") { g.n = Math.max(3, Math.round(g.n * 2)); g.giant = true; tanks = true; }
        else if (g.type === "brute") { g.n = Math.max(2, Math.round(g.n * 1.6)); g.giant = true; }
      }
      if (!tanks) groups.push({ type: "tank", n: Math.round(3 + n / 14), every: 1.7, delay: 1, small: false, giant: true });
    }
    if (hasTwist("swarm")) {
      for (const g of groups) if (g.type === "runner") g.n = Math.round(g.n * 1.2);
      groups.push({ type: "crawler", n: Math.round(Math.min(42, 14 + n * 0.3)), every: 0.15, delay: 0.5, small: true, giant: false });
    }
    if (hasTwist("onesided")) {
      for (const g of groups) if (g.type !== "boss") g.n = Math.max(1, Math.round(g.n * 1.25));
    }
    return groups;
  }

  function startWave() {
    if (state.phase !== "shop") return;
    const spec = stageSpec(state.wave);
    if (state.twistWave !== state.wave) setTwists([]);
    state.phase = "fight";
    state.fightT = 0;
    state.sent = true;
    state.spawnQ = [];
    state.spawnSides = null;
    if (hasTwist("onesided")) {
      const a = (Math.random() * 4) | 0;
      state.spawnSides = Math.random() < 0.5 ? [a] : [a, (a + 1 + ((Math.random() * 3) | 0)) % 4];
    }
    state.ironArmor = 3 + state.wave * 0.14;
    const groups = twistGroups(spec);
    let lastT = 0;
    for (const g of groups) {
      for (let i = 0; i < g.n; i++) {
        const t = 0.35 + (g.delay || 0) + i * g.every;
        if (t > lastT) lastT = t;
        state.spawnQ.push({ t: t, type: g.type, elite: false, gold: false, small: g.small, giant: g.giant });
      }
    }
    state.spawnQ.sort((a, b) => a.t - b.t);
    markElites(state.spawnQ, state.wave);
    if (hasTwist("goldrush")) {
      for (const job of state.spawnQ) if (job.type !== "boss" && Math.random() < 0.13) job.gold = true;
    }
    // Abilities come back ready at the start of every stage. Buffs end.
    for (const k of ORDER) state.abil[k] = 0;
    state.fireWall = null;
    state.freezeT = 0;
    state.rallyT = 0;
    state.spreeT = 0;
    state.streak = 0;
    state.mortarCd = 4;
    state.windUsed = false;
    state.event = null;
    state.breachT = 0;
    drops.length = 0;
    pools.length = 0;
    marks.length = 0;
    bursts.length = 0;
    fxs.length = 0;
    scheduleEvent(spec, lastT);
    const kind = spec.finale ? "FINALE" : spec.boss ? "BOSS" : spec.challenge ? "CHALLENGE" : "STAGE";
    let twistNames = "";
    for (const id of state.twists) twistNames += (twistNames ? " + " : "") + TWISTS[id].name;
    toast(kind + " " + state.wave + " — " + spec.name + (twistNames ? "  ·  " + twistNames : ""));
    state.banner = { title: spec.name, sub: twistNames, life: 2.3 };
    if (spec.boss) bossSting();
    else blip(170, 0.09, "square", 0.03);
    showTips();
  }

  function critFloat(e) {
    if (floaters.length < 22) floaters.push({ x: e.x + rand(-1, 1), y: e.y - e.r * 2.2, text: "CRIT", life: 0.5, color: "#ffe36a" });
  }

  // src: 0 = gate / turret / mines / bursts, 1 = heroine hit (can crit), 2 = damage over time (ignores flat armor).
  function hurtEnemy(e, raw, src) {
    if (!e || e.dead || state.phase !== "fight") return;
    let amt = raw;
    if (src === 1 && state.cardSet.precision && Math.random() < 0.15) {
      amt *= 2.5;
      if (Math.random() < 0.35) critFloat(e);
    }
    if (src !== 2 && state.tw.ironhide) amt = Math.max(amt * 0.2, amt - state.ironArmor);
    let dealt = amt * (1 - (e.armor || 0));
    if (e.shielded) dealt *= 0.25;
    if (dealt <= 0) return;
    e.hp -= dealt;
    if (src !== 2 || e.flash <= 0) e.flash = src === 2 ? 0.06 : 0.18;
    if (e.hp <= 0) killEnemy(e);
  }

  function killEnemy(e) {
    if (!e || e.dead) return;
    e.dead = true;
    e.hp = 0;
    e.dyingMax = reduceMotion ? 0.16 : 0.42;
    e.dying = e.dyingMax;
    let reward = e.reward;
    if (state.tw.bloodmoon) reward *= 2;
    if (state.cardSet.goldteeth) reward = Math.round(reward * 1.25);
    if (e.bounty) {
      reward += e.bounty;
      meta.ash = (meta.ash || 0) + 2;
      saveMeta();
      toast("Bounty: " + e.bname + " down  +$" + e.bounty + "  +2 ash", 2200);
      burst(e.x, e.y, "#ffd56a", 18, 9);
      if (state.event && state.event.kind === "bounty") state.event = null;
    }
    state.cash += reward;
    state.earned += reward;
    state.kills++;
    if (state.cardSet.triage && state.baseHp > 0) state.baseHp = Math.min(state.baseMax, state.baseHp + 0.5);
    if (state.cardSet.spree) {
      state.streak++;
      state.streakT = 1.6;
      if (state.streak >= 12) {
        state.streak = 0;
        if (state.spreeT <= 0 && floaters.length < 24) floaters.push({ x: BASE.x, y: BASE.y - BASE.r - 6, text: "SPREE", life: 0.9, color: "#ff8ad0" });
        state.spreeT = 5;
      }
    }
    if (e.bloater) {
      const dist = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      burst(e.x, e.y, "#e39a45", 16, 7);
      rings.push({ x: e.x, y: e.y, r: 0.4, max: e.explodeR, life: 0.4, color: "#ffb15a" });
      if (dist <= e.explodeR) hurtBase(e.explode);
    }
    if (state.tw.exploding && !e.egg && !e.boss && bursts.length < 48) {
      bursts.push({ x: e.x, y: e.y, t: 0.16, r: 5.2 + e.r * 0.5, dmg: Math.min(e.max * 0.3, 26 + state.wave * 3.5) });
    }
    if (e.egg) {
      burst(e.x, e.y, "#d6f08a", 10, 5);
    } else {
      burst(e.x, e.y, e.gold ? "#ffe066" : e.elite ? "#ffd56a" : e.boss ? "#d7c4ff" : "#8a9474", e.boss ? 14 : e.gold ? 12 : 6, e.boss ? 7 : 4.5);
    }
    if (floaters.length < 24) {
      floaters.push({ x: e.x, y: e.y - e.r, text: "+$" + reward, life: e.gold ? 1.1 : 0.78, color: e.gold ? "#fff07a" : "#ffc857" });
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
    if (state.cardSet.secondwind && !state.windUsed && state.baseHp > 0 && state.baseHp < state.baseMax * 0.3) {
      state.windUsed = true;
      state.baseHp = Math.min(state.baseMax, state.baseHp + state.baseMax * 0.35);
      freezeAll(2);
      rings.push({ x: BASE.x, y: BASE.y, r: BASE.r, max: 40, life: 0.6, color: "#7dffb3" });
      toast("Second Wind", 1600);
    }
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
      if (particles.length > 140) particles.shift();
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random());
      const life = 0.28 + Math.random() * 0.32;
      particles.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: life, max: life, color: color, r: 0.22 + Math.random() * 0.4,
      });
    }
  }

  function launchSpit(e, dist) {
    if (spits.length > 36) return;
    const nx = (BASE.x - e.x) / dist;
    const ny = (BASE.y - e.y) / dist;
    spits.push({
      x: e.x + nx * (e.r + 0.35),
      y: e.y + ny * (e.r + 0.35),
      vx: nx * e.spitSpeed,
      vy: ny * e.spitSpeed,
      dmg: e.spitDmg,
      life: 8,
    });
    e.lunge = 0.65;
  }

  function fire(u, target, s) {
    u.cooldown = 1 / s.rate;
    u.muzzle = 0.1;
    u.lunge = 1;
    u.facing = Math.atan2(target.y - u.y, target.x - u.x);
    state.shots++;
    playShot(s.kind);
    if (s.kind === "snipe") {
      let dmg = s.dmg;
      if (target.max > 0 && target.hp > target.max * 0.5) dmg *= u.named ? 1.35 : 1.15;
      bolts.push({ x: u.x, y: u.y, ox: u.x, oy: u.y, targetId: target.id, dmg: dmg, color: s.accent, src: 1, pierce: state.cardSet.hollowpoint ? 2 : 0, prev: 0 });
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
      const capHit = s.cap || 4;
      const n = Math.min(capHit, victims.length);
      const ignite = !!state.cardSet.dragonshells;
      for (let i = 0; i < n; i++) {
        if (ignite) igniteEnemy(victims[i].e, s.dmg * 0.5, 2.2);
        hurtEnemy(victims[i].e, s.dmg, 1);
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
      rings.push({
        x: target.x, y: target.y, ox: u.x, oy: u.y,
        r: 0.4, max: s.aoe, life: 0.32, color: s.accent, hex: true,
      });
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.hypot(e.x - target.x, e.y - target.y) <= s.aoe + e.r * 0.2) {
          if (state.cardSet.hexthorns) {
            e.hexDps = Math.max(e.hexDps, s.dmg * 1.4);
            e.hexT = Math.max(e.hexT, s.slowTime);
          }
          hurtEnemy(e, s.dmg, 1);
          applySlow(e, s.slow, s.slowTime);
          const stun = s.stun * (1 - e.slowRes);
          if (stun > 0.05) e.stunT = Math.max(e.stunT, stun);
        }
      }
    } else if (s.kind === "volley") {
      const ang = Math.atan2(target.y - u.y, target.x - u.x);
      const px = -Math.sin(ang);
      const py = Math.cos(ang);
      const nShots = s.volley || 3;
      const spreads = [];
      const span = 3.2;
      for (let i = 0; i < nShots; i++) {
        spreads.push(nShots === 1 ? 0 : -span / 2 + (span * i) / (nShots - 1));
      }
      for (let i = 0; i < spreads.length; i++) {
        const off = spreads[i];
        const bx = u.x + px * off;
        const by = u.y + py * off;
        bolts.push({ x: bx, y: by, ox: bx, oy: by, targetId: target.id, dmg: s.dmg, color: s.accent, src: 1, pierce: state.cardSet.ricochet ? 1 : 0, prev: 0 });
      }
    } else if (s.kind === "cleave") {
      const mult = s.cleave || (u.named ? 1.25 : 1);
      const ang = Math.atan2(target.y - u.y, target.x - u.x);
      let n = 0;
      for (const e of enemies) {
        if (e.dead) continue;
        const nearT = Math.hypot(e.x - target.x, e.y - target.y) <= s.aoe;
        const nearU = Math.hypot(e.x - u.x, e.y - u.y) <= s.range + 1;
        if (nearT && nearU) {
          if (state.cardSet.shockhaft && !e.boss) {
            knockEnemy(e, u.x, u.y, 3.2);
            e.stunT = Math.max(e.stunT, 0.3 * (1 - e.slowRes));
          }
          hurtEnemy(e, s.dmg * mult, 1);
          flashes.push({ x: e.x, y: e.y, sx: u.x, sy: u.y, life: 0.12, max: 0.12, color: s.accent });
          n++;
        }
      }
      if (!n) flashes.push({ x: target.x, y: target.y, sx: u.x, sy: u.y, life: 0.1, max: 0.1, color: s.accent });
      sweeps.push({
        x: u.x, y: u.y, a0: ang - 1.05, a1: ang + 1.05,
        r: Math.max(3.2, Math.min(s.range, (s.aoe || 4) + 1.4)),
        life: 0.18, max: 0.18, color: s.accent,
      });
    }
  }

  function explodeLob(p) {
    patches.push({ x: p.tx, y: p.ty, r: p.aoe, dps: p.patch, life: p.patchTime, max: p.patchTime });
    for (const e of enemies) {
      if (e.dead) continue;
      if (Math.hypot(e.x - p.tx, e.y - p.ty) <= p.aoe + e.r * 0.3) {
        if (state.cardSet.wildfire) igniteEnemy(e, p.patch * 0.6, 2.4);
        hurtEnemy(e, p.dmg, 1);
      }
    }
    burst(p.tx, p.ty, "#ff9a3c", 8, 5);
  }

  function pickTarget(u, s) {
    let best = null;
    let bestScore = Infinity;
    let bestHp = -1;
    const held = !!u.hold;
    for (const e of enemies) {
      if (e.dead || !e.lit) continue;
      const d = Math.hypot(e.x - u.x, e.y - u.y);
      if (held && d > s.range + 1.5) continue;
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
        if (e.elite) score -= 4;
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
    u.step = (u.step || 0) + step;
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
          // A heroine parked on her flag does not get shoved off it.
          const ah = a.hold && !a.dazeT ? 1 : 0;
          const bh = b.hold && !b.dazeT ? 1 : 0;
          const wa = ah && !bh ? 0 : bh && !ah ? 1 : 0.5;
          const push = (min - d);
          dx /= d; dy /= d;
          a.x -= dx * push * wa; a.y -= dy * push * wa;
          b.x += dx * push * (1 - wa); b.y += dy * push * (1 - wa);
        }
      }
    }
  }

  function updateUnits(dt) {
    const fighting = state.phase === "fight";
    for (const u of units) {
      const s = statsOf(u);
      u.idle += dt;
      u.step = 0;
      u.slowT = Math.max(0, u.slowT - dt);
      if (u.dazeT > 0) {
        // Knocked flat by a boss: no moving, no shooting.
        u.dazeT -= dt;
        u.combat = false;
        clampUnit(u);
        continue;
      }
      if (fighting && u.whirlT > 0) { updateWhirl(u, s, dt); clampUnit(u); continue; }
      if (fighting && u.stormT > 0) updateStorm(u, s, dt);
      const target = fighting ? pickTarget(u, s) : null;
      u.combat = !!target;
      if (u.hold) {
        // Held by the player: walk to the flag and stay. Still shoots anything in range.
        const hd = Math.hypot(u.hold.x - u.x, u.hold.y - u.y);
        if (hd > 0.5) moveToward(u, u.hold.x, u.hold.y, s.move * dt);
        if (target) {
          u.facing = Math.atan2(target.y - u.y, target.x - u.x);
          u.cooldown -= dt;
          const d = Math.hypot(target.x - u.x, target.y - u.y);
          if (d <= s.range && u.cooldown <= 0) fire(u, target, s);
        } else {
          u.cooldown = Math.max(0, u.cooldown - dt);
        }
      } else if (target) {
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

  function shriekMul(e, howlers) {
    if (!howlers.length || e.shrieker) return 1;
    let best = 1;
    for (let i = 0; i < howlers.length; i++) {
      const s = howlers[i];
      if (Math.hypot(s.x - e.x, s.y - e.y) <= s.shriekR) {
        const boost = 1 + (s.shriek - 1) * (1 - (e.slowRes || 0));
        if (boost > best) best = boost;
      }
    }
    return best;
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

  function isLit(e) {
    const bx = e.x - BASE.x, by = e.y - BASE.y;
    if (bx * bx + by * by < 30 * 30) return true;
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const dx = e.x - u.x, dy = e.y - u.y;
      if (dx * dx + dy * dy < 16.5 * 16.5) return true;
    }
    return false;
  }

  function igniteEnemy(e, dps, time) {
    if (!e || e.dead || e.egg) return;
    if (e.burnT <= 0 || dps > e.burnDps) e.burnDps = dps;
    e.burnT = Math.max(e.burnT, time);
  }

  function knockEnemy(e, fx, fy, dist) {
    if (!e || e.dead || e.egg) return;
    const k = e.boss ? 0.12 : e.giant ? 0.5 : 1;
    const dx = e.x - fx, dy = e.y - fy;
    const d = Math.hypot(dx, dy) || 1;
    e.x = clamp(e.x + (dx / d) * dist * k, 0.4, WORLD_W - 0.4);
    e.y = clamp(e.y + (dy / d) * dist * k, 0.4, WORLD_H - 0.4);
  }

  function updateEnemies(dt) {
    const howlers = [];
    for (const e of enemies) if (!e.dead && e.shrieker) howlers.push(e);
    const fog = !!state.tw.fog;
    const frenzy = !!state.tw.frenzy;
    const plague = !!state.tw.plague;
    const wild = !!state.cardSet.wildfire;
    const ev = state.event;
    const surv = ev && ev.kind === "survivor" ? ev : null;
    for (const e of enemies) {
      if (e.dead) continue;
      e.flash = Math.max(0, e.flash - dt);
      e.stunT = Math.max(0, e.stunT - dt);
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.slowFactor = 1;
      }
      e.lit = fog ? isLit(e) : true;
      if (e.burnT > 0) {
        e.burnT -= dt;
        hurtEnemy(e, e.burnDps * dt, 2);
        if (e.dead) continue;
        if (wild) {
          e.spreadCd -= dt;
          if (e.spreadCd <= 0) {
            e.spreadCd = 0.7;
            let lit = 0;
            for (const o of enemies) {
              if (o === e || o.dead || o.burnT > 0.4) continue;
              if (Math.abs(o.x - e.x) < 5 && Math.abs(o.y - e.y) < 5) {
                igniteEnemy(o, e.burnDps * 0.85, 2);
                if (++lit >= 2) break;
              }
            }
          }
        }
      }
      if (e.hexT > 0) {
        e.hexT -= dt;
        hurtEnemy(e, e.hexDps * dt, 2);
        if (e.dead) continue;
      }
      if (e.egg) {
        if (e.stunT <= 0) e.hatchT -= dt;
        if (e.hatchT <= 0) hatchEgg(e);
        continue;
      }
      if (e.boss) {
        const handled = updateBoss(e, dt);
        if (state.phase !== "fight") return;
        if (handled) continue;
      }
      if (e.spitter && e.stunT <= 0) e.spitCd -= dt;
      let pace = (e.stunT > 0 ? 0 : e.slowFactor) * auraMul(e) * shriekMul(e, howlers);
      if (frenzy) pace *= 1 + (e.boss ? 0.35 : 0.85) * (1 - e.hp / e.max);
      if (plague && !e.boss && e.stunT <= 0) {
        e.plagueCd -= dt;
        if (e.plagueCd <= 0) {
          e.plagueCd = rand(3.2, 5.5);
          if (pools.length < 20 && distBase(e.x, e.y) > BASE.r + 7) pools.push({ kind: "plague", x: e.x, y: e.y, r: 3.1, life: 7, max: 7, acc: 0 });
        }
      }
      // A survivor on the field pulls the nearby dead off the gate.
      if (surv && !e.boss) {
        const sx = surv.x - e.x, sy = surv.y - e.y;
        const sd = Math.hypot(sx, sy);
        if (sd < 15) {
          if (sd > e.r * 0.5 + 1.3) {
            const step = e.speed * pace * dt;
            e.x += (sx / sd) * step;
            e.y += (sy / sd) * step;
            e.walk += Math.max(step, dt);
          } else if (e.stunT <= 0) {
            surv.hp -= 15 * dt;
            e.walk += dt * 2;
            if (Math.random() < dt * 2) e.lunge = 1;
          }
          continue;
        }
      }
      const dx = BASE.x - e.x;
      const dy = BASE.y - e.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      if (dist < state.closest) state.closest = dist;
      const stop = BASE.r + e.r * 0.62;
      const hold = e.spitter && dist <= e.spitRange && dist > stop + 0.35;
      if (hold) {
        e.walk += dt * 1.15;
        if (e.stunT <= 0 && e.spitCd <= 0) {
          e.spitCd = e.spitEvery;
          launchSpit(e, dist);
        }
      } else if (dist > stop) {
        const step = e.speed * pace * dt;
        const nx = dx / dist, ny = dy / dist;
        const wobAmp = e.crawler ? 1.35 : 0.45;
        const wob = Math.sin(e.walk * (e.crawler ? 1.4 : 0.8)) * wobAmp * e.side;
        e.x += nx * step + (-ny) * wob * dt * 2.2;
        e.y += ny * step + nx * wob * dt * 2.2;
        e.walk += Math.max(step, dt);
        e.x = clamp(e.x, 0.4, WORLD_W - 0.4);
        e.y = clamp(e.y, 0.4, WORLD_H - 0.4);
      } else {
        e.walk += dt * 2;
        if (e.bounty && !e.reached) {
          e.reached = true;
          e.bounty = 0;
          toast("Bounty lost: " + e.bname + " reached the gate", 1800);
          if (state.event && state.event.kind === "bounty") state.event = null;
        }
        if (e.stunT <= 0) {
          e.biteCd -= dt;
          if (e.biteCd <= 0) {
            e.biteCd = e.biteEvery;
            e.lunge = 1;
            let spike = SPIKE_DMG[state.ups.spikes] || 0;
            if (state.cardSet.thorngate) spike = spike * 2 + 14 + state.wave * 0.6;
            if (spike > 0) hurtEnemy(e, spike);
            hurtBase(e.bite);
            if (state.phase !== "fight") return;
          }
        }
        const spin = e.stunT > 0 ? 0 : e.side * dt * 0.35;
        const ang = Math.atan2(e.y - BASE.y, e.x - BASE.x) + spin;
        e.x = BASE.x + Math.cos(ang) * stop;
        e.y = BASE.y + Math.sin(ang) * stop;
      }
    }
    if (state.phase === "fight") separateEnemies();
  }

  function updatePatches(dt) {
    const wild = !!state.cardSet.wildfire;
    for (const p of patches) {
      p.life -= dt;
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) <= p.r + e.r * 0.35) {
          if (wild && e.burnT < 0.5) igniteEnemy(e, p.dps * 0.5, 2);
          hurtEnemy(e, p.dps * dt, 2);
        }
      }
    }
  }

  function updateSpits(dt) {
    if (state.freezeT > 0) return;
    for (let i = spits.length - 1; i >= 0; i--) {
      const p = spits[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const hit = Math.hypot(p.x - BASE.x, p.y - BASE.y) <= BASE.r + 0.7;
      if (p.life <= 0 || hit) {
        if (hit) {
          hurtBase(p.dmg);
          burst(p.x, p.y, "#d6ff6a", 4, 3);
        }
        spits.splice(i, 1);
        if (state.phase !== "fight") return;
      }
    }
  }

  function updateMend(dt) {
    const rate = MEND_RATE[state.ups.mend] || 0;
    if (rate <= 0) return;
    if (state.phase !== "shop" && state.phase !== "fight") return;
    if (state.baseHp >= state.baseMax) return;
    state.baseHp = Math.min(state.baseMax, state.baseHp + rate * dt);
  }

  function detonateMine(spec, chained) {
    let best = null;
    let bestD = spec.range;
    for (const e of enemies) {
      if (e.dead || !e.lit) continue;
      const d = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      if (d < bestD) { bestD = d; best = e; }
    }
    if (!best) return false;
    const bx = best.x, by = best.y, firstId = best.id;
    hurtEnemy(best, spec.dmg);
    rings.push({ x: bx, y: by, r: 0.3, max: 2.4, life: 0.22, color: "#ff5d6c" });
    burst(bx, by, "#ff5d6c", 6, 5);
    if (state.cardSet.chainmines && !chained) {
      // Area blast round the first mine, then a second mine on the next zombie out.
      rings.push({ x: bx, y: by, r: 0.6, max: 6.5, life: 0.3, color: "#ffb15a" });
      let next = null, nd = 1e9;
      for (const e of enemies) {
        if (e.dead || e.id === firstId || !e.lit) continue;
        const d = Math.hypot(e.x - bx, e.y - by);
        if (d <= 6.5) hurtEnemy(e, spec.dmg * 0.6);
        else if (d < nd && d < 20) { nd = d; next = e; }
      }
      if (next) {
        hurtEnemy(next, spec.dmg);
        rings.push({ x: next.x, y: next.y, r: 0.3, max: 3.4, life: 0.25, color: "#ff5d6c" });
        burst(next.x, next.y, "#ff5d6c", 5, 5);
      }
    }
    return true;
  }

  function updateMines(dt) {
    const spec = MINES[state.ups.mines];
    if (!spec || state.phase !== "fight") return;
    state.mineCd -= dt;
    if (state.mineCd <= 0) {
      state.mineCd = spec.every;
      detonateMine(spec);
    }
    if ((state.armedMines | 0) > 0) {
      state.armedCd -= dt;
      if (state.armedCd <= 0) {
        if (detonateMine(spec)) state.armedMines -= 1;
        state.armedCd = 0.4;
      }
    }
  }

  function updateTurret(dt) {
    const spec = TURRET[state.ups.turret];
    if (!spec || state.phase !== "fight") return;
    let best = null, second = null;
    let bestD = spec.range, secondD = spec.range;
    for (const e of enemies) {
      if (e.dead || !e.lit) continue;
      const d = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      if (d < bestD) { second = best; secondD = bestD; bestD = d; best = e; }
      else if (d < secondD) { secondD = d; second = e; }
    }
    if (!best) return;
    state.turretAng = Math.atan2(best.y - BASE.y, best.x - BASE.x);
    state.turretCd -= dt;
    if (state.turretCd <= 0) {
      state.turretCd = 1 / spec.rate;
      state.turretFlash = 0.08;
      const ang = state.turretAng;
      bolts.push({
        x: BASE.x + Math.cos(ang) * (BASE.r * 0.85),
        y: BASE.y + Math.sin(ang) * (BASE.r * 0.85),
        ox: BASE.x, oy: BASE.y,
        targetId: best.id, dmg: spec.dmg, color: "#d5e6ff", src: 0, pierce: 0, prev: 0,
      });
      if (state.cardSet.twinbarrel) {
        const t2 = second || best;
        const a2 = Math.atan2(t2.y - BASE.y, t2.x - BASE.x);
        bolts.push({
          x: BASE.x + Math.cos(a2) * (BASE.r * 0.85),
          y: BASE.y + Math.sin(a2) * (BASE.r * 0.85),
          ox: BASE.x, oy: BASE.y,
          targetId: t2.id, dmg: spec.dmg, color: "#ffe2a8", src: 0, pierce: 0, prev: 0,
        });
      }
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
        bolts.splice(i, 1);
        if (p.pierce > 0) {
          // Pierce / ricochet: carry on to the next zombie close by.
          let next = null;
          let bestD = 15;
          for (const e of enemies) {
            if (e.dead || e === t || e.id === p.prev || !e.lit) continue;
            const dd = Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
            if (dd < bestD) { bestD = dd; next = e; }
          }
          if (next) bolts.push({ x: t.x, y: t.y, ox: t.x, oy: t.y, targetId: next.id, dmg: p.dmg * 0.8, color: p.color, src: p.src, pierce: p.pierce - 1, prev: t.id });
        }
        hurtEnemy(t, p.dmg, p.src || 0);
        burst(t.x, t.y, p.color, 3, 3);
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

  // ---------- Bosses ----------
  let chargeSeq = 1;

  function bossAlive(id) {
    for (const e of enemies) if (e.id === id && !e.dead) return e;
    return null;
  }

  function fieldSpot(x, y) {
    let px = clamp(x, 4, WORLD_W - 4);
    let py = clamp(y, 5, WORLD_H - 4);
    const d = distBase(px, py);
    const min = BASE.r + 6;
    if (d < min) {
      const a = d < 0.01 ? 0 : Math.atan2(py - BASE.y, px - BASE.x);
      px = BASE.x + Math.cos(a) * min;
      py = BASE.y + Math.sin(a) * min;
    }
    return { x: px, y: py };
  }

  function updateBoss(e, dt) {
    if (e.bossKind === "graveking" || e.bossKind === "lastking") {
      let m = 0;
      for (const o of enemies) if (!o.dead && o.minionOf === e.id) m++;
      e.shielded = m > 0;
    }
    if (e.stunT > 0) return !!e.charge;
    if (e.charge) return updateCharge(e, dt);
    if (e.bossKind === "brood" || e.bossKind === "lastking") {
      e.eggCd -= dt;
      if (e.eggCd <= 0) {
        e.eggCd = e.bossKind === "brood" ? 5.2 : 9;
        layEgg(e);
      }
    }
    e.patT -= dt;
    if (!(e.patT <= 0)) return false;
    let kind = "raise";
    if (e.bossKind === "lastking") kind = ["raise", "acid", "charge", "brood"][(e.patStep++) % 4];
    else if (e.bossKind === "brood") kind = "brood";
    else if (e.bossKind === "juggernaut") kind = "charge";
    else if (e.bossKind === "bile") kind = "acid";
    const last = e.bossKind === "lastking";
    if (kind === "raise") { bossRaise(e); e.patT = last ? 5 : 8; }
    else if (kind === "brood") { bossBrood(e); e.patT = last ? 5 : 8.5; }
    else if (kind === "charge") { startCharge(e); e.patT = last ? 5 : 7; }
    else { bossAcid(e); e.patT = last ? 5 : 4.6; }
    return !!e.charge;
  }

  function bossRaise(e) {
    let alive = 0;
    for (const o of enemies) if (!o.dead && o.minionOf === e.id) alive++;
    const want = Math.min(4 + Math.floor(state.wave / 30), 11 - alive);
    for (let i = 0; i < want; i++) {
      const a = Math.random() * TAU;
      const r = rand(5, 12);
      const p = fieldSpot(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r);
      marks.push({ kind: "raise", x: p.x, y: p.y, r: 2.6, life: 1.3, max: 1.3, boss: e.id });
    }
    if (want > 0) playGroan(true);
  }

  function bossBrood(e) {
    marks.push({ kind: "brood", x: e.x, y: e.y, r: 7, life: 0.9, max: 0.9, boss: e.id });
  }

  function layEgg(e) {
    let eggs = 0;
    for (const o of enemies) if (!o.dead && o.egg) eggs++;
    if (eggs >= 6) return;
    const p = fieldSpot(e.x + rand(-3, 3), e.y + rand(-3, 3));
    spawnEnemy("egg", false, { x: p.x, y: p.y, quiet: true, hpMul: 0.9 });
  }

  function hatchEgg(egg) {
    egg.dead = true;
    egg.hp = 0;
    egg.dyingMax = 0.2;
    egg.dying = 0.2;
    const n = 3 + Math.floor(state.wave / 30);
    for (let i = 0; i < n; i++) {
      const c = spawnEnemy("crawler", false, { x: clamp(egg.x + rand(-1.5, 1.5), 1, WORLD_W - 1), y: clamp(egg.y + rand(-1.5, 1.5), 1, WORLD_H - 1), quiet: true });
      if (c) c.reward = 1;
    }
    burst(egg.x, egg.y, "#c6e86a", 10, 6);
  }

  function startCharge(e) {
    const db = distBase(e.x, e.y);
    if (db < BASE.r + e.r + 7) {
      marks.push({ kind: "slam", x: e.x, y: e.y, r: 13, life: 1.15, max: 1.15, boss: e.id });
      e.charge = { phase: "slam", t: 1.15, id: ++chargeSeq };
      return;
    }
    let tx = BASE.x, ty = BASE.y, best = 52;
    for (const u of units) {
      const d = Math.hypot(u.x - e.x, u.y - e.y);
      if (d < best && u.dazeT <= 0) { best = d; tx = u.x; ty = u.y; }
    }
    const ang = Math.atan2(ty - e.y, tx - e.x);
    const len = clamp(Math.hypot(tx - e.x, ty - e.y) + 12, 24, 70);
    marks.push({ kind: "lane", x: e.x, y: e.y, ang: ang, len: len, w: 7, life: 1.4, max: 1.4, boss: e.id });
    e.charge = { phase: "wind", t: 1.4, ang: ang, len: len, done: 0, id: ++chargeSeq };
    blip(110, 0.25, "sawtooth", 0.025);
  }

  function knockUnit(u, nx, ny, dist, daze) {
    u.x += nx * dist;
    u.y += ny * dist;
    u.dazeT = Math.max(u.dazeT, daze);
    clampUnit(u);
    burst(u.x, u.y - 4, "#fff4cc", 6, 5);
    if (floaters.length < 24) floaters.push({ x: u.x, y: u.y - 17, text: "DAZED", life: 0.9, color: "#ffdf8a" });
  }

  function updateCharge(e, dt) {
    const c = e.charge;
    if (c.phase === "wind" || c.phase === "slam") {
      c.t -= dt;
      e.walk += dt * 4;
      e.lunge = 0.35;
      if (c.t <= 0) {
        if (c.phase === "slam") {
          for (const u of units) {
            const dx = u.x - e.x, dy = u.y - e.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d <= 14) knockUnit(u, dx / d, dy / d, 7, 1.3);
          }
          rings.push({ x: e.x, y: e.y, r: 1, max: 13, life: 0.4, color: "#ff6a4a" });
          burst(e.x, e.y, "#c8a070", 16, 9);
          state.shake = Math.min(1.6, state.shake + 1);
          e.charge = { phase: "rest", t: 0.8 };
        } else {
          c.phase = "dash";
          playGroan(true);
        }
      }
      return true;
    }
    if (c.phase === "dash") {
      const step = 46 * dt;
      const nx = Math.cos(c.ang), ny = Math.sin(c.ang);
      e.x += nx * step;
      e.y += ny * step;
      c.done += step;
      e.walk += step;
      for (const u of units) {
        if (u.knockId === c.id) continue;
        const dx = u.x - e.x, dy = u.y - e.y;
        if (dx * dx + dy * dy < (e.r + 3.6) * (e.r + 3.6)) {
          u.knockId = c.id;
          const side = (dx * ny - dy * nx) >= 0 ? -1 : 1;
          knockUnit(u, -ny * side, nx * side, 9, 1.5);
        }
      }
      for (const o of enemies) {
        if (o === e || o.dead || o.boss) continue;
        if (Math.abs(o.x - e.x) < e.r + 2 && Math.abs(o.y - e.y) < e.r + 2) knockEnemy(o, e.x - nx * 2, e.y - ny * 2, 3);
      }
      if (particles.length < 120 && !reduceMotion) burst(e.x, e.y + 1, "#8a7458", 1, 3);
      if (distBase(e.x, e.y) <= BASE.r + e.r * 0.62) {
        const a = Math.atan2(e.y - BASE.y, e.x - BASE.x);
        e.x = BASE.x + Math.cos(a) * (BASE.r + e.r * 0.62);
        e.y = BASE.y + Math.sin(a) * (BASE.r + e.r * 0.62);
        e.charge = { phase: "rest", t: 1 };
        burst(e.x, e.y, "#c8a070", 14, 8);
        state.shake = Math.min(1.8, state.shake + 1.2);
        hurtBase(e.bite * 2.2);
        return true;
      }
      if (c.done >= c.len || e.x < 1 || e.x > WORLD_W - 1 || e.y < 1 || e.y > WORLD_H - 1) e.charge = { phase: "rest", t: 1 };
      e.x = clamp(e.x, 1, WORLD_W - 1);
      e.y = clamp(e.y, 1, WORLD_H - 1);
      return true;
    }
    c.t -= dt;
    if (c.t <= 0) e.charge = null;
    return true;
  }

  function bossAcid(e) {
    const picks = [];
    const pool = units.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    const want = state.wave >= 60 ? 4 : 3;
    for (let i = 0; i < pool.length && picks.length < want - 1; i++) picks.push({ x: pool[i].x, y: pool[i].y });
    for (let guard = 0; picks.length < want && guard < 8; guard++) {
      const a = Math.random() * TAU;
      picks.push(fieldSpot(BASE.x + Math.cos(a) * rand(12, 20), BASE.y + Math.sin(a) * rand(12, 20)));
    }
    for (const p of picks) marks.push({ kind: "acid", x: p.x, y: p.y, r: 5.6, life: 1.25, max: 1.25, sx: e.x, sy: e.y - enemyHeight(e) * 0.6 });
    blip(300, 0.12, "triangle", 0.02);
  }

  function updateMarks(dt) {
    for (let i = marks.length - 1; i >= 0; i--) {
      if (i >= marks.length) continue;
      const m = marks[i];
      m.life -= dt;
      if (m.life > 0) continue;
      marks.splice(i, 1);
      if (m.kind === "raise") {
        const b = bossAlive(m.boss);
        if (b) {
          spawnEnemy("walker", false, { x: m.x, y: m.y, minion: b.id, hpMul: 0.75, quiet: true });
          burst(m.x, m.y, "#b88cff", 8, 5);
        }
      } else if (m.kind === "brood") {
        const b = bossAlive(m.boss);
        if (b) {
          const n = 4 + Math.floor(state.wave / 25);
          for (let k = 0; k < n; k++) {
            const a = (k / n) * TAU;
            const c = spawnEnemy("crawler", false, { x: clamp(b.x + Math.cos(a) * 3, 1, WORLD_W - 1), y: clamp(b.y + Math.sin(a) * 3, 1, WORLD_H - 1), quiet: true });
            if (c) c.reward = 1;
          }
          burst(b.x, b.y, "#c6e86a", 12, 7);
        }
      } else if (m.kind === "acid") {
        pools.push({ kind: "acid", x: m.x, y: m.y, r: m.r, life: 6.5, max: 6.5, acc: 0 });
        burst(m.x, m.y, "#9cff5a", 10, 6);
      } else if (m.kind === "breach") {
        state.breachT = 0;
        const n = Math.round(6 + state.wave * 0.14);
        const types = state.wave >= 6 ? ["walker", "crawler", "runner"] : ["walker", "runner"];
        for (let k = 0; k < n; k++) {
          const p = fieldSpot(m.x + rand(-3, 3), m.y + rand(-3, 3));
          spawnEnemy(types[k % types.length], false, { x: p.x, y: p.y, quiet: k > 0 });
        }
        burst(m.x, m.y, "#6a5236", 18, 8);
        state.shake = Math.min(1.4, state.shake + 0.6);
      } else if (m.kind === "mortar") {
        const dmg = (40 + state.wave * 5) * (1 + (meta.power || 0) * 0.07) * Math.pow(1.08, state.ups.ammo || 0);
        for (const e of enemies) {
          if (e.dead) continue;
          if (Math.hypot(e.x - m.x, e.y - m.y) <= m.r + e.r * 0.3) hurtEnemy(e, dmg);
        }
        rings.push({ x: m.x, y: m.y, r: 0.8, max: m.r, life: 0.35, color: "#ffb15a" });
        burst(m.x, m.y, "#ff9a3c", 14, 8);
        state.shake = Math.min(1.3, state.shake + 0.35);
        playShot("blast");
      }
      if (state.phase !== "fight") return;
    }
  }

  function updatePools(dt) {
    for (let i = pools.length - 1; i >= 0; i--) {
      const p = pools[i];
      p.life -= dt;
      if (p.life <= 0) { pools.splice(i, 1); continue; }
      for (const u of units) {
        const dx = u.x - p.x, dy = u.y - p.y;
        if (dx * dx + dy * dy < (p.r + 0.8) * (p.r + 0.8)) u.slowT = Math.max(u.slowT, 0.3);
      }
      if (p.kind === "acid" && distBase(p.x, p.y) < BASE.r + p.r * 0.6) {
        p.acc += 2.5 * dt;
        if (p.acc >= 2) { p.acc -= 2; hurtBase(2); if (state.phase !== "fight") return; }
      }
    }
  }

  function updateBursts(dt) {
    // Bursts queued during this pass wait for the next frame, so chains ripple out instead of recursing.
    const n0 = bursts.length;
    let done = 0;
    for (let i = 0; i < n0; i++) {
      const b = bursts[i];
      b.t -= dt;
      if (b.t > 0) continue;
      b.done = true;
      done++;
      rings.push({ x: b.x, y: b.y, r: 0.6, max: b.r, life: 0.3, color: "#ffcf5a" });
      burst(b.x, b.y, "#ffb04a", 5, 6);
      let hit = 0;
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.abs(e.x - b.x) < b.r && Math.abs(e.y - b.y) < b.r && Math.hypot(e.x - b.x, e.y - b.y) <= b.r) {
          hurtEnemy(e, b.dmg);
          if (++hit >= 6) break;
        }
      }
      if (distBase(b.x, b.y) <= BASE.r + b.r * 0.8) {
        hurtBase(2 + state.wave * 0.06);
        if (state.phase !== "fight") return;
      }
    }
    if (done) {
      let w = 0;
      for (let i = 0; i < bursts.length; i++) if (!bursts[i].done) bursts[w++] = bursts[i];
      bursts.length = w;
    }
  }

  function updateFireWall(dt) {
    const w = state.fireWall;
    if (!w) return;
    w.t -= dt;
    if (w.t <= 0) { state.fireWall = null; return; }
    for (const e of enemies) {
      if (e.dead || e.egg) continue;
      const d = distBase(e.x, e.y);
      if (Math.abs(d - w.r) <= w.w + e.r * 0.4 || d < w.r - w.w) {
        const k = d < w.r - w.w ? 0.35 : 1;
        hurtEnemy(e, w.dps * k * dt, 2);
        igniteEnemy(e, w.burn, 1.5);
        applySlow(e, 0.6, 0.3);
      }
    }
  }

  function updateMortar(dt) {
    if (!state.cardSet.mortar) return;
    state.mortarCd -= dt;
    if (state.mortarCd > 0) return;
    state.mortarCd = 6;
    let best = null, bestN = 0;
    for (const e of enemies) {
      if (e.dead || !e.lit || e.egg) continue;
      let n = 0;
      for (const o of enemies) {
        if (o.dead) continue;
        if (Math.abs(o.x - e.x) < 6 && Math.abs(o.y - e.y) < 6) n++;
      }
      if (n > bestN) { bestN = n; best = e; }
    }
    if (best) marks.push({ kind: "mortar", x: best.x, y: best.y, r: 7, life: 0.7, max: 0.7 });
  }

  function freezeAll(t) {
    state.freezeT = Math.max(state.freezeT, t);
    for (const e of enemies) {
      if (e.dead) continue;
      e.stunT = Math.max(e.stunT, e.boss ? t * 0.5 : t);
    }
  }

  function updateBuffs(dt) {
    state.freezeT = Math.max(0, state.freezeT - dt);
    state.rallyT = Math.max(0, state.rallyT - dt);
    state.spreeT = Math.max(0, state.spreeT - dt);
    if (state.streakT > 0) {
      state.streakT -= dt;
      if (state.streakT <= 0) state.streak = 0;
    }
    for (const k of ORDER) if (state.abil[k] > 0) state.abil[k] = Math.max(0, state.abil[k] - dt);
  }

  // ---------- Mid-stage events ----------
  function scheduleEvent(spec, lastT) {
    state.eventAt = -1;
    state.eventKind = "";
    if (spec.boss || spec.finale || spec.n < 3) return;
    const chance = spec.n < 8 ? 0.3 : 0.38;
    if (Math.random() >= chance) return;
    const pool = [];
    for (const k of EVENT_KINDS) {
      if (k === state.lastEvent) continue;
      if (k === "bounty" && spec.n < 8) continue;
      if (k === "breach" && spec.n < 6) continue;
      pool.push(k);
    }
    state.eventKind = pool[(Math.random() * pool.length) | 0];
    state.eventAt = rand(6, Math.max(8, Math.min(26, lastT * 0.65)));
  }

  function startEvent(kind) {
    state.lastEvent = kind;
    const n = state.wave;
    if (kind === "survivor") {
      const p = edgePoint();
      state.event = { kind: "survivor", x: p.x, y: p.y, hp: 100, max: 100, walk: 0, speed: 8.4, face: 1 };
      toast("Survivor! Keep the dead off her until she reaches the gate", 2600);
    } else if (kind === "drop" || kind === "rally") {
      const a = Math.random() * TAU;
      const r = rand(17, 34);
      const p = fieldSpot(BASE.x + Math.cos(a) * r, BASE.y + Math.sin(a) * r * 1.3);
      drops.push({ kind: kind, x: p.x, y: Math.max(10, p.y), fall: 1.1, life: kind === "drop" ? 9 : 10, max: kind === "drop" ? 9 : 10, trample: 0 });
      toast(kind === "drop" ? "Supply drop! Tap the crate before the dead trample it" : "Ammo cache! Tap it (or walk a heroine over) for a fire-rate rally", 2600);
    } else if (kind === "bounty") {
      const e = spawnEnemy(n < 25 ? "tank" : "brute", true, { hpMul: 1.6 });
      if (e) {
        e.bounty = 60 + n * 3;
        e.bname = BOUNTY_NAMES[(Math.random() * BOUNTY_NAMES.length) | 0];
        e.speed *= 1.08;
        state.event = { kind: "bounty", id: e.id };
        toast("Bounty: " + e.bname + "  $" + e.bounty + " if dropped before the gate", 2600);
      }
    } else if (kind === "breach") {
      const a = Math.random() * TAU;
      const r = rand(24, 42);
      const p = fieldSpot(BASE.x + Math.cos(a) * r, BASE.y + Math.sin(a) * r * 1.4);
      marks.push({ kind: "breach", x: p.x, y: p.y, r: 6, life: 2.3, max: 2.3 });
      state.breachT = 2.4;
      toast("Grave breach! The ground is opening", 2200);
      blip(70, 0.4, "sawtooth", 0.03);
    }
  }

  function rescueSurvivor() {
    const cash = 35 + state.wave * 2;
    state.cash += cash;
    state.earned += cash;
    meta.ash = (meta.ash || 0) + 3;
    saveMeta();
    state.baseHp = Math.min(state.baseMax, state.baseHp + 15);
    toast("Survivor safe  +$" + cash + "  +3 ash  +15 HP", 2200);
    blip(660, 0.12, "triangle", 0.035);
    state.event = null;
  }

  function claimDrop(d) {
    const n = state.wave;
    burst(d.x, d.y, d.kind === "rally" ? "#ffe36a" : "#ffc857", 16, 7);
    rings.push({ x: d.x, y: d.y, r: 0.5, max: 8, life: 0.35, color: "#ffe9a0" });
    blip(740, 0.09, "triangle", 0.035);
    if (d.kind === "rally") {
      state.rallyT = 8;
      toast("Rally! Heroines fire 40% faster for 8s", 1800);
      return;
    }
    const roll = (Math.random() * 3) | 0;
    if (roll === 0) {
      const cash = 45 + Math.round(n * 2.5);
      state.cash += cash;
      state.earned += cash;
      toast("Supply drop  +$" + cash, 1800);
    } else if (roll === 1) {
      const heal = Math.round(state.baseMax * 0.25);
      state.baseHp = Math.min(state.baseMax, state.baseHp + heal);
      toast("Supply drop  gate +" + heal + " HP", 1800);
    } else {
      for (const k of ORDER) state.abil[k] = 0;
      toast("Supply drop  all abilities ready", 1800);
    }
  }

  function updateEvents(dt) {
    if (state.eventAt >= 0 && state.fightT >= state.eventAt) {
      state.eventAt = -1;
      if (state.eventKind) startEvent(state.eventKind);
    }
    if (state.breachT > 0) state.breachT = Math.max(0, state.breachT - dt);
    const ev = state.event;
    if (ev && ev.kind === "survivor") {
      const dx = BASE.x - ev.x, dy = BASE.y - ev.y;
      const d = Math.hypot(dx, dy) || 1;
      if (ev.hp <= 0) {
        burst(ev.x, ev.y, "#ff5d6c", 14, 6);
        toast("The survivor was lost", 1800);
        state.event = null;
      } else if (d <= BASE.r + 2.5) {
        rescueSurvivor();
      } else {
        const step = ev.speed * dt;
        const weave = Math.sin(ev.walk * 0.6) * dt * 1.2;
        ev.x += (dx / d) * step - (dy / d) * weave;
        ev.y += (dy / d) * step + (dx / d) * weave;
        ev.walk += step;
        ev.face = dx >= 0 ? 1 : -1;
      }
    }
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      if (d.fall > 0) { d.fall -= dt; continue; }
      d.life -= dt;
      let near = false;
      for (const e of enemies) {
        if (e.dead || e.egg) continue;
        if (Math.abs(e.x - d.x) < 3.4 && Math.abs(e.y - d.y) < 3.4) { near = true; break; }
      }
      if (near) d.trample += dt;
      let claimed = false;
      for (const u of units) {
        if (Math.abs(u.x - d.x) < 4.5 && Math.abs(u.y - d.y) < 4.5) { claimed = true; break; }
      }
      if (claimed) { drops.splice(i, 1); claimDrop(d); continue; }
      if (d.trample >= 1.3 || d.life <= 0) {
        drops.splice(i, 1);
        burst(d.x, d.y, "#7a6040", 10, 5);
        toast(d.trample >= 1.3 ? "The crate got trampled" : "The drop was lost", 1400);
      }
    }
  }

  function tapPickup(wx, wy) {
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      const dy = d.fall > 0 ? d.y - d.fall * 14 : d.y;
      if (Math.hypot(d.x - wx, dy - 2 - wy) <= 8.5) {
        drops.splice(i, 1);
        claimDrop(d);
        return true;
      }
    }
    return false;
  }

  // ---------- Tap abilities ----------
  function abilityCd(kind) {
    let cd = ABILITIES[kind].cd;
    if (state.cardSet.quickhands) cd *= 0.75;
    if (((state.skills && state.skills[kind]) | 0) >= 3) cd *= 0.88;
    return cd;
  }

  function unitsOf(kind) {
    const out = [];
    for (const u of units) if (u.kind === kind) out.push(u);
    return out;
  }

  function useAbility(kind) {
    if (!ABILITIES[kind]) return false;
    if (state.phase !== "fight" || shopOpen) return false;
    if (state.abil[kind] > 0) return false;
    const list = unitsOf(kind);
    if (!list.length) return false;
    let lead = list[0];
    for (const u of list) if (u.named) lead = u;
    const ls = statsOf(lead);
    const oc = state.cardSet.overcharge ? 1.5 : 1;
    const dur = state.cardSet.overcharge ? 1.25 : 1;
    if (kind === "vera") {
      const alive = [];
      for (const e of enemies) if (!e.dead) alive.push(e);
      if (!alive.length) { toast("No targets", 700); return false; }
      alive.sort((a, b) => b.hp - a.hp);
      const n = Math.min(alive.length, 3 + list.length, 7);
      for (let i = 0; i < n; i++) {
        const shooter = list[i % list.length];
        fxs.push({ kind: "mark", id: alive[i].id, x: alive[i].x, y: alive[i].y, t: 0.55 + i * 0.1, max: 0.55 + i * 0.1, dmg: ls.dmg * 8 * oc, sx: shooter.x, sy: shooter.y - 8 });
      }
    } else if (kind === "roxie") {
      for (const u of list) {
        const s = statsOf(u);
        for (const e of enemies) {
          if (e.dead) continue;
          if (Math.hypot(e.x - u.x, e.y - u.y) <= 15 + e.r * 0.3) {
            knockEnemy(e, u.x, u.y, 7);
            igniteEnemy(e, s.dmg * 1.1 * oc, 3 * dur);
            hurtEnemy(e, s.dmg * 6 * oc, 1);
          }
        }
        fxs.push({ kind: "nova", x: u.x, y: u.y - 3, r: 1, max: 15, life: 0.5, total: 0.5 });
        burst(u.x, u.y - 3, "#ff8a2a", 22, 14);
        burst(u.x, u.y - 3, "#ffd36a", 12, 10);
      }
    } else if (kind === "lila") {
      const extra = 1 + 0.25 * (list.length - 1);
      state.fireWall = { t: 7 * dur, max: 7 * dur, r: 20, w: 3.4, dps: (ls.dmg * 5 + 8) * oc * extra, burn: ls.dmg * 0.8 * oc };
      burst(BASE.x, BASE.y, "#ff9a3c", 18, 12);
    } else if (kind === "nyx") {
      freezeAll(3.2 * dur);
      fxs.push({ kind: "freeze", x: lead.x, y: lead.y - 6, r: 1, max: 70, life: 0.7, total: 0.7 });
    } else if (kind === "sable") {
      for (const u of list) {
        u.stormT = 4 * dur;
        u.stormCd = 0;
        u.stormDmg = statsOf(u).dmg * 0.9 * oc;
      }
    } else if (kind === "wren") {
      for (const u of list) {
        const s = statsOf(u);
        u.whirlT = 3 * dur;
        u.whirlCd = 0;
        u.whirlDmg = s.dmg * (s.cleave || 1) * 1.4 * oc;
      }
    }
    state.abil[kind] = abilityCd(kind);
    state.abilMax[kind] = state.abil[kind];
    state.shake = Math.min(1.6, state.shake + (reduceMotion ? 0 : 0.7));
    abilitySfx(kind);
    toast(HEROES[kind].short + " · " + ABILITIES[kind].name, 1000);
    return true;
  }

  function updateStorm(u, s, dt) {
    u.stormT -= dt;
    u.stormCd -= dt;
    for (let guard = 0; u.stormCd <= 0 && guard < 4; guard++) {
      u.stormCd += 0.075;
      const reach = s.range * 1.6;
      const len = enemies.length;
      if (!len) break;
      const off = (Math.random() * len) | 0;
      let t = null;
      for (let k = 0; k < len; k++) {
        const e = enemies[(off + k) % len];
        if (e.dead || !e.lit) continue;
        if (Math.abs(e.x - u.x) < reach && Math.abs(e.y - u.y) < reach) { t = e; break; }
      }
      if (!t) break;
      u.facing = Math.atan2(t.y - u.y, t.x - u.x);
      u.muzzle = 0.06;
      bolts.push({ x: u.x, y: u.y - 6, ox: u.x, oy: u.y - 6, targetId: t.id, dmg: u.stormDmg || s.dmg, color: "#9fd8ff", src: 1, pierce: state.cardSet.ricochet ? 1 : 0, prev: 0 });
      playShot("volley");
    }
    if (u.stormCd < -1) u.stormCd = 0;
  }

  function updateWhirl(u, s, dt) {
    u.whirlT -= dt;
    let best = null, bd = 1e9;
    for (const e of enemies) {
      if (e.dead || !e.lit) continue;
      const d = Math.abs(e.x - u.x) + Math.abs(e.y - u.y);
      if (d < bd) { bd = d; best = e; }
    }
    if (best && bd > 2.5) {
      let tx = best.x, ty = best.y;
      const db = distBase(tx, ty);
      if (db > 38) { tx = BASE.x + ((tx - BASE.x) / db) * 38; ty = BASE.y + ((ty - BASE.y) / db) * 38; }
      moveToward(u, tx, ty, s.move * 1.9 * dt);
    } else {
      u.step = 0.05;
      u.walk += dt * 6;
    }
    u.facing = (u.facing + dt * 18) % TAU;
    u.lunge = 0.6;
    u.whirlCd -= dt;
    if (u.whirlCd <= 0) {
      u.whirlCd = 0.2;
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.abs(e.x - u.x) < 8 && Math.abs(e.y - u.y) < 8 && Math.hypot(e.x - u.x, e.y - u.y) <= 7.5 + e.r * 0.3) {
          hurtEnemy(e, u.whirlDmg || s.dmg, 1);
          knockEnemy(e, u.x, u.y, 1.6);
        }
      }
      sweeps.push({ x: u.x, y: u.y - 4, a0: u.facing, a1: u.facing + 4.2, r: 7.2, life: 0.2, max: 0.2, color: "#c8ff9a" });
      playShot("cleave");
    }
  }

  function updateAbilityFx(dt) {
    for (let i = fxs.length - 1; i >= 0; i--) {
      const f = fxs[i];
      if (f.kind === "mark") {
        const e = findEnemy(f.id);
        if (e) { f.x = e.x; f.y = e.y; }
        f.t -= dt;
        if (f.t <= 0) {
          if (e && state.phase === "fight") {
            hurtEnemy(e, f.dmg, 1);
            burst(f.x, f.y - 4, "#ffe9a0", 10, 8);
            state.shake = Math.min(1.5, state.shake + 0.25);
            playShot("snipe");
          }
          fxs[i] = { kind: "beam", sx: f.sx, sy: f.sy, x: f.x, y: f.y - 4, life: 0.28, total: 0.28 };
        }
        continue;
      }
      f.life -= dt;
      if (f.r != null && f.max) f.r = f.max * (1 - Math.max(0, f.life) / f.total);
      if (f.life <= 0) fxs.splice(i, 1);
    }
  }

  function abilitySfx(kind) {
    if (!sfxOk()) return;
    const now = audioCtx.currentTime || 0;
    try {
      if (kind === "vera") {
        sfxOsc(now, 1200, 0.25, 0.05, "sine", 2400);
        sfxOsc(now + 0.05, 1800, 0.2, 0.04, "sine", 3000);
      } else if (kind === "roxie" || kind === "lila") {
        sfxNoise(now, 0.6, 0.4, "lowpass", 900, 0.7, 180, 0.03);
        sfxOsc(now, 80, 0.4, 0.2, "sawtooth", 40);
      } else if (kind === "nyx") {
        sfxOsc(now, 900, 0.6, 0.07, "triangle", 120);
        sfxOsc(now + 0.08, 1350, 0.5, 0.04, "sine", 200);
      } else if (kind === "sable") {
        sfxOsc(now, 220, 0.3, 0.08, "square", 660);
      } else {
        sfxNoise(now, 0.5, 0.25, "bandpass", 500, 0.9, 1800, 0.05);
      }
    } catch (err) { /* ignore */ }
  }

  // ---------- Twists and cards ----------
  function rollTwists(n) {
    const spec = stageSpec(n);
    if (n < 5 || spec.finale || (spec.boss && n < 60)) { state.twistSince++; return []; }
    let chance = n < 30 ? 0.34 : n < 60 ? 0.46 : 0.58;
    if (spec.boss) chance = 0.5;
    const force = !spec.boss && state.twistSince >= 2;
    if (!force && Math.random() >= chance) { state.twistSince++; return []; }
    const pool = [];
    for (const id of TWIST_IDS) {
      if (id === state.lastTwist) continue;
      if (spec.boss && !TWISTS[id].boss) continue;
      pool.push(id);
    }
    const first = pool[(Math.random() * pool.length) | 0];
    const out = [first];
    if (!spec.boss && n >= 60 && Math.random() < 0.38) {
      const rest = [];
      for (const id of pool) {
        if (id === first) continue;
        if ((first === "giants" && id === "swarm") || (first === "swarm" && id === "giants")) continue;
        rest.push(id);
      }
      if (rest.length) out.push(rest[(Math.random() * rest.length) | 0]);
    }
    state.lastTwist = first;
    state.twistSince = 0;
    return out;
  }

  function rollCards() {
    const pool = [];
    for (const c of CARDS) {
      if (state.cardSet[c.id]) continue;
      if (c.kind && !units.some((u) => u.kind === c.kind)) continue;
      pool.push(c);
    }
    const out = [];
    while (out.length < 3 && pool.length) {
      let total = 0;
      for (const c of pool) total += RARITY[c.rarity].weight;
      let r = Math.random() * total;
      let idx = 0;
      for (; idx < pool.length - 1; idx++) {
        r -= RARITY[pool[idx].rarity].weight;
        if (r <= 0) break;
      }
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }

  function applyCard(id) {
    const c = CARD_BY_ID[id];
    if (!c || state.cardSet[id]) return false;
    state.cards.push(id);
    state.cardSet[id] = true;
    if (id === "chainmines" && !(state.ups.mines | 0)) { state.ups.mines = 1; state.mineCd = MINES[1].every; }
    if (id === "twinbarrel" && !(state.ups.turret | 0)) state.ups.turret = 1;
    renderBuild();
    return true;
  }

  function cardTagText(c) {
    return RARITY[c.rarity].name.toUpperCase() + (c.kind ? "  ·  " + HEROES[c.kind].short.toUpperCase() : "");
  }

  function renderCards() {
    const box = $("ovChoices");
    box.innerHTML = "";
    const choices = rollCards();
    state.offer = choices;
    for (const card of choices) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice card r-" + card.rarity;
      b.dataset.card = card.id;
      const tag = document.createElement("em");
      tag.className = "rar";
      tag.textContent = cardTagText(card);
      const strong = document.createElement("b");
      strong.textContent = card.name;
      const span = document.createElement("span");
      span.textContent = card.desc;
      b.appendChild(tag);
      b.appendChild(strong);
      b.appendChild(span);
      b.addEventListener("click", () => {
        if (state.cardPicked) return;
        applyCard(card.id);
        state.cardPicked = true;
        $("ovBtn").disabled = false;
        const kids = box.children;
        for (let i = 0; i < kids.length; i++) kids[i].disabled = true;
        b.disabled = false;
        b.classList.add("picked");
        toast(card.name);
        blip(620, 0.09, "triangle", 0.035);
      });
      box.appendChild(b);
    }
    if (!choices.length) state.cardPicked = true;
  }

  function renderBuild() {
    const row = $("buildRow");
    if (!row) return;
    row.innerHTML = "";
    if (!state.cards.length) {
      const p = document.createElement("span");
      p.className = "buildEmpty";
      p.textContent = "Beat a boss to pick your first card.";
      row.appendChild(p);
      return;
    }
    for (const id of state.cards) {
      const c = CARD_BY_ID[id];
      const chip = document.createElement("span");
      chip.className = "buildChip r-" + c.rarity;
      chip.title = c.desc;
      const b = document.createElement("b");
      b.textContent = c.name;
      const s = document.createElement("small");
      s.textContent = c.desc;
      chip.appendChild(b);
      chip.appendChild(s);
      row.appendChild(chip);
    }
  }

  function fillTwist() {
    const box = $("ovTwist");
    if (!box) return;
    box.innerHTML = "";
    if (!state.twists.length) { box.hidden = true; return; }
    box.hidden = false;
    for (const id of state.twists) {
      const t = TWISTS[id];
      const row = document.createElement("div");
      row.className = "twist";
      row.style.setProperty("--tw", t.color);
      const k = document.createElement("em");
      k.textContent = "TWIST";
      const b = document.createElement("b");
      b.textContent = t.name;
      const s = document.createElement("span");
      s.textContent = t.desc;
      const pay = document.createElement("i");
      pay.textContent = t.pay;
      row.appendChild(k);
      row.appendChild(b);
      row.appendChild(s);
      row.appendChild(pay);
      box.appendChild(row);
    }
  }

  // ---------- One-time tips (the only new thing saved) ----------
  function showTips() {
    let tips = {};
    try { tips = JSON.parse(localStorage.getItem(TIPS_KEY) || "{}") || {}; } catch (err) { tips = {}; }
    if (!tips.abil) {
      tips.abil = 1;
      setTimeout(() => toast("Tap a face in the bottom bar to fire her ability", 3200), 2600);
    } else if (!tips.drag && state.wave >= 2) {
      tips.drag = 1;
      setTimeout(() => toast("Drag a heroine to move her. Double-tap her to let her roam", 3400), 2600);
    } else return;
    try { localStorage.setItem(TIPS_KEY, JSON.stringify(tips)); } catch (err) { /* fine */ }
  }

  function compact() {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.dead && e.dying <= 0) enemies.splice(i, 1);
    }
    for (let i = patches.length - 1; i >= 0; i--) if (patches[i].life <= 0) patches.splice(i, 1);
  }

  function checkClear() {
    if (state.phase !== "fight") return;
    if (state.spawnQ.length) return;
    if (spits.length) return;
    for (let i = 0; i < enemies.length; i++) if (!enemies[i].dead) return;
    if (state.breachT > 0 || bursts.length) return;
    for (let i = 0; i < marks.length; i++) {
      const k = marks[i].kind;
      if (k === "raise" || k === "brood" || k === "breach") return;
    }
    if (state.event && state.event.kind === "survivor") rescueSurvivor();
    for (const d of drops) claimDrop(d);
    drops.length = 0;
    state.event = null;
    state.eventAt = -1;
    marks.length = 0;
    pools.length = 0;
    fxs.length = 0;
    state.fireWall = null;
    state.freezeT = 0;
    state.rallyT = 0;
    state.spreeT = 0;
    state.streak = 0;
    for (const u of units) { u.stormT = 0; u.whirlT = 0; u.dazeT = 0; u.slowT = 0; }
    const cleared = state.wave;
    const bonus = 8 + cleared * 3;
    const specCleared = stageSpec(cleared);
    state.cash += bonus;
    state.earned += bonus;
    if (specCleared.challenge) {
      state.cash += 35;
      state.earned += 35;
    }
    let ashGain = 3;
    if (specCleared.boss) ashGain = 8;
    else if (specCleared.challenge) ashGain = 5;
    meta.ash = (meta.ash || 0) + ashGain;
    if (cleared >= 20) meta.regions.marsh = true;
    if (cleared >= 50) meta.regions.chapel = true;
    if (cleared === 20 || cleared === 50 || cleared === FINALE) meta.veteran = pickVeteranKind();
    saveMeta();
    state.log.push("w" + cleared + " hp" + Math.round(state.baseHp) + " $" + state.cash + " u" + units.length);
    let twBonus = 0, twAsh = 0;
    for (const id of state.twists) { twBonus += TWISTS[id].bonus; twAsh += TWISTS[id].ash; }
    const twCash = Math.round(twBonus * bonus);
    if (twCash > 0 || twAsh > 0) {
      state.cash += twCash;
      state.earned += twCash;
      meta.ash = (meta.ash || 0) + twAsh;
      saveMeta();
    }
    let interest = 0;
    if (state.cardSet.interest) {
      interest = Math.min(60, Math.floor(state.cash * 0.05));
      state.cash += interest;
      state.earned += interest;
    }
    let msg = "Stage " + cleared + " down +$" + bonus + " +" + ashGain + " ash";
    if (specCleared.challenge) msg += "  challenge +$35";
    if (twCash > 0 || twAsh > 0) msg += "  twist +$" + twCash + (twAsh ? " +" + twAsh + " ash" : "");
    if (interest > 0) msg += "  interest +$" + interest;
    toast(msg);
    blip(240, 0.08, "sine", 0.03);
    if (cleared >= FINALE) { win(); return; }
    state.wave = cleared + 1;
    setTwists(rollTwists(state.wave));
    openBrief(cleared % 3 === 0, specCleared.boss);
  }

  function updateFx(dt) {
    for (const e of enemies) {
      if (e.dead) e.dying -= dt;
      e.lunge = Math.max(0, (e.lunge || 0) - dt * 3.1);
    }
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
    for (let i = sweeps.length - 1; i >= 0; i--) {
      sweeps[i].life -= dt;
      if (sweeps[i].life <= 0) sweeps.splice(i, 1);
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].life -= dt;
      rings[i].r += dt * 16;
      if (rings[i].life <= 0) rings.splice(i, 1);
    }
    for (const u of units) {
      u.muzzle = Math.max(0, u.muzzle - dt);
      u.lunge = Math.max(0, u.lunge - dt * 3.2);
    }
    state.turretFlash = Math.max(0, state.turretFlash - dt);
  }

  function update(dt) {
    if (state.phase === "paused" || state.phase === "title") return;
    if (shopOpen) { musicTick(dt); return; }
    state.time += dt;
    state.shake = Math.max(0, state.shake - dt * 1.8);
    state.baseFlash = Math.max(0, state.baseFlash - dt);
    if (state.banner) {
      state.banner.life -= dt;
      if (state.banner.life <= 0) state.banner = null;
    }
    if (state.phase === "fight") {
      state.fightT += dt;
      while (state.spawnQ.length && state.spawnQ[0].t <= state.fightT && state.phase === "fight") {
        const job = state.spawnQ.shift();
        spawnEnemy(job.type, job.elite, job);
      }
      updateBuffs(dt);
      updateEvents(dt);
      updateEnemies(dt);
      if (state.phase === "fight") updateSpits(dt);
      if (state.phase === "fight") updatePatches(dt);
      if (state.phase === "fight") updateMarks(dt);
      if (state.phase === "fight") updatePools(dt);
      if (state.phase === "fight") updateBursts(dt);
      if (state.phase === "fight") updateFireWall(dt);
      if (state.phase === "fight") updateMortar(dt);
      if (state.phase === "fight") updateUnits(dt);
      if (state.phase === "fight") updateTurret(dt);
      if (state.phase === "fight") updateMines(dt);
      if (state.phase === "fight") updateMend(dt);
      if (state.phase === "fight") updateBolts(dt);
      if (state.phase === "fight") updateLobs(dt);
      if (state.phase === "fight") updateAbilityFx(dt);
      if (state.phase === "fight") checkClear();
    } else if (state.phase === "shop") {
      updateMend(dt);
      updateUnits(dt);
    } else if (state.phase === "brief") {
      updateUnits(dt);
    }
    updateFx(dt);
    compact();
    musicTick(dt);
  }

  // Whole cutout. No circular clip. Feet sit on (x, y) unless anchor is "center".
  // size is sprite height for figures, or the longer side for centered props.
  function drawSprite(key, x, y, size, opts) {
    opts = opts || {};
    const img = sprites[key];
    const sheet = opts.frame != null ? walks[key] : null;
    const framed = sheet && sheet.complete && sheet.naturalWidth > 0;
    const staticReady = img && img.complete && img.naturalWidth > 0;
    if (!framed && !staticReady) {
      return false;
    }
    const src = framed ? sheet : img;
    const frames = framed ? WALK_FRAMES : 1;
    const frame = framed ? ((opts.frame % frames) + frames) % frames : 0;
    const fw = src.naturalWidth / frames;
    const fh = src.naturalHeight;
    const aspect = fw / fh;
    let dw, dh, ox, oy;
    if (opts.anchor === "center") {
      if (aspect >= 1) { dw = size; dh = size / aspect; }
      else { dh = size; dw = size * aspect; }
      ox = -dw / 2;
      oy = -dh / 2;
    } else {
      dh = size;
      dw = size * aspect;
      ox = -dw / 2;
      oy = -dh;
    }
    const flash = opts.flash || 0;
    ctx.save();
    ctx.translate(x, y + (opts.bob || 0));
    if (opts.rot) ctx.rotate(opts.rot);
    ctx.scale(opts.sx == null ? 1 : opts.sx, opts.sy == null ? 1 : opts.sy);
    const alpha = opts.alpha == null ? ctx.globalAlpha : opts.alpha;
    ctx.globalAlpha = alpha;
    if (opts.filter && opts.filter !== "none") ctx.filter = opts.filter;
    ctx.drawImage(src, frame * fw, 0, fw, fh, ox, oy, dw, dh);
    if (flash > 0.02) {
      ctx.filter = "brightness(0) invert(1)";
      ctx.globalAlpha = alpha * Math.min(0.85, flash);
      ctx.drawImage(src, frame * fw, 0, fw, fh, ox, oy, dw, dh);
      if (opts.hit) {
        ctx.filter = "sepia(1) saturate(6) hue-rotate(-18deg) brightness(1.35)";
        ctx.globalAlpha = alpha * Math.min(0.62, flash);
        ctx.drawImage(src, frame * fw, 0, fw, fh, ox, oy, dw, dh);
      }
    }
    ctx.restore();
    return true;
  }

  function spriteFilter(e) {
    if (e.boss) return (BOSS_KINDS[e.bossKind] || BOSS_KINDS.graveking).filter;
    let f = "";
    if (e.type === "tank") f = "brightness(0.78)";
    if (e.elite) f = (f ? f + " " : "") + "sepia(0.55) saturate(1.7) brightness(1.12)";
    return f || "none";
  }

  const RING = {
    walker: "#6e3038", runner: "#e6dc78", tank: "#8aa0b8", brute: "#c8b498", boss: "#c49bff",
    crawler: "#9be36a", spitter: "#d2f25a", shrieker: "#d7b3ff", bloater: "#e0a15c",
  };

  function heroHeight(u) {
    return u.named ? 16.4 : 14.6;
  }

  function drawUnit(u) {
    const h = HEROES[u.kind];
    const height = heroHeight(u);
    const moving = (u.step || 0) > 0.04;
    const strideLen = 7;
    const cycle = moving ? u.walk / strideLen : state.time * 0.45;
    const stride = reduceMotion ? 0 : Math.sin(cycle * Math.PI);
    const bob = reduceMotion ? 0 : -Math.abs(stride) * (moving ? 0.55 : 0.12);
    const attack = u.lunge || 0;
    const lean = (moving ? 0.2 : 0) * Math.cos(u.facing || 0);
    const squash = moving ? Math.abs(stride) : 0;
    const x = u.x;
    const y = u.y;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y + 0.35, height * 0.16, height * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    const face = Math.cos(u.facing || 0) >= 0 ? 1 : -1;
    const frame = Math.floor(moving ? u.walk / strideLen : state.time * 0.45) % WALK_FRAMES;
    drawSprite(u.kind, x, y, height, {
      frame: frame,
      bob: reduceMotion ? 0 : -Math.abs(Math.sin((moving ? u.walk / strideLen : state.time * 0.45) * Math.PI)) * (moving ? 0.45 : 0.2),
      rot: attack * 0.22 * face,
      sx: face,
      sy: 1,
    });
    if (u.named) {
      ctx.fillStyle = h.accent;
      ctx.beginPath();
      ctx.arc(x + height * 0.16, y - height - 0.35, 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
    const fx = Math.cos(u.facing), fy = Math.sin(u.facing);
    const gx = x + fx * height * 0.18;
    const gy = y - height * 0.46 + fy * height * 0.08;
    ctx.strokeStyle = h.accent;
    ctx.lineWidth = 0.35;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + fx * 1.7, gy + fy * 1.7);
    ctx.stroke();
    if (u.muzzle > 0) {
      const a = Math.min(1, u.muzzle / 0.1);
      ctx.globalAlpha = a;
      ctx.fillStyle = "#fff6d4";
      ctx.beginPath();
      ctx.arc(gx + fx * 2.1, gy + fy * 2.1, 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function enemyHeight(e) {
    const table = {
      walker: 12.4, runner: 11.2, crawler: 8.8, spitter: 12.6, shrieker: 13,
      tank: 15.4, brute: 15.8, bloater: 16.2, boss: 22.5,
    };
    return (table[e.type] || 12.4) * (e.elite ? 1.06 : 1) * (e.scale || 1);
  }

  function drawEnemy(e) {
    const dx = BASE.x - e.x;
    const dy = BASE.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    const height = enemyHeight(e) * (e.bloater && !e.dead && !reduceMotion ? 1 + Math.sin(state.time * 3 + e.id) * 0.03 : 1);
    if (e.dead) {
      const k = Math.max(0, e.dying / (e.dyingMax || 0.42));
      drawSprite(e.sprite, e.x, e.y + (1 - k) * 0.8, height, {
        alpha: Math.min(1, k * 1.25),
        rot: reduceMotion ? 0 : (1 - k) * (Math.PI / 2) * (e.side || 1),
        filter: spriteFilter(e),
      });
      return;
    }
    const bobF = e.crawler ? 3.1 : e.runner ? 2.7 : 2.05;
    const cycle = e.walk * bobF;
    const stride = reduceMotion ? 0 : Math.sin(cycle);
    const bobAmp = e.crawler ? 0.7 : e.runner ? 0.62 : 0.5;
    const bob = reduceMotion ? 0 : -Math.abs(stride) * bobAmp;
    const attack = e.lunge || 0;
    const lean = reduceMotion ? 0 : (dx / dist) * (e.crawler ? 0.16 : 0.12);
    const squash = Math.abs(stride);
    const x = e.x;
    const y = e.y;
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath();
    ctx.ellipse(x, y + 0.4, height * 0.18, height * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    if ((e.gold || e.bounty) && glowSprite) {
      ctx.globalAlpha = 0.55 + (reduceMotion ? 0 : Math.sin(state.time * 5 + e.id) * 0.15);
      ctx.drawImage(glowSprite, x - height * 0.4, y - height * 0.8, height * 0.8, height * 0.8);
      ctx.globalAlpha = 1;
    }
    if (e.minionOf) {
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = "#b88cff";
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.ellipse(x, y + 0.3, height * 0.2, height * 0.065, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (e.shrieker) {
      const glow = reduceMotion ? 0.22 : 0.16 + Math.sin(state.time * 3 + e.id) * 0.05;
      ctx.beginPath();
      ctx.arc(x, y, e.shriekR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196,155,255," + glow + ")";
      ctx.lineWidth = 0.18;
      ctx.setLineDash([0.8, 0.75]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    const flash = e.flash > 0 ? Math.min(1, e.flash / 0.18) : 0;
    const face = dx >= 0 ? 1 : -1;
    const rate = e.crawler ? 4.5 : e.runner ? 4.0 : e.boss ? 2.2 : 3.0;
    const frame = Math.floor(state.time * rate + (e.walk || 0)) % WALK_FRAMES;
    drawSprite(e.sprite, x, y, height, {
      frame: frame,
      bob: reduceMotion ? 0 : -Math.abs(Math.sin(state.time * rate * Math.PI)) * (e.crawler ? 0.85 : 0.55),
      rot: attack * 0.22 * face,
      sx: face * (1 + flash * 0.03),
      sy: 1,
      filter: spriteFilter(e),
      flash: flash,
      hit: true,
    });
    if (e.spitter && e.spitCd < 0.45) {
      ctx.fillStyle = "#eaff9a";
      ctx.beginPath();
      ctx.arc(x + (dx / dist) * (height * 0.22), y - height * 0.42, 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    const frozen = state.freezeT > 0 && e.stunT > 0;
    if (frozen) {
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = "#bcd4ff";
      ctx.beginPath();
      ctx.ellipse(x, y - height * 0.45, height * 0.24, height * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 0.15;
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (e.slowT > 0 || e.stunT > 0) drawHexMark(x, y - height * 0.55, height * 0.2, e.stunT > 0);
    if (e.burnT > 0) {
      for (let i = 0; i < 2; i++) {
        const fx = x + (i ? 0.9 : -0.8) * height * 0.12;
        const fh = 1.4 + (reduceMotion ? 0.3 : Math.abs(Math.sin(state.time * 11 + e.id + i * 2)) * 1.1);
        ctx.fillStyle = i ? "#ffb347" : "#ff6a1a";
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(fx - 0.6, y - height * 0.35);
        ctx.quadraticCurveTo(fx, y - height * 0.35 - fh * 1.2, fx + 0.6, y - height * 0.35);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    if (e.shielded) {
      ctx.globalAlpha = 0.22 + (reduceMotion ? 0 : Math.sin(state.time * 4) * 0.06);
      ctx.fillStyle = "#9a7cff";
      ctx.beginPath();
      ctx.arc(x, y - height * 0.48, height * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = "#d8c4ff";
      ctx.lineWidth = 0.3;
      strokeHex(x, y - height * 0.48, height * 0.52, state.time * 0.6);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    const barW = Math.min(height * 0.7, 8);
    const hx = x - barW / 2;
    const hy = y - height - 1.05;
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(hx, hy, barW, 0.48);
    ctx.fillStyle = e.bounty ? "#ff9a3c" : e.gold ? "#fff07a" : e.elite ? "#ffd56a" : e.boss ? "#ff6b8a" : "#c5e38a";
    ctx.fillRect(hx, hy, barW * Math.max(0, e.hp / e.max), 0.48);
    if (e.boss || e.bounty) {
      ctx.fillStyle = e.boss ? "#f3e9ff" : "#ffd9a0";
      ctx.font = "700 " + (e.boss ? 2.4 : 1.9) + "px Passion One, Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      const label = e.boss ? (BOSS_KINDS[e.bossKind] || BOSS_KINDS.graveking).label : e.bname.toUpperCase() + "  $" + e.bounty;
      ctx.fillText(label, x, hy - 0.2);
    }
  }

  function strokeHex(x, y, rad, rot) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = rot + (i / 6) * Math.PI * 2;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawHexMark(x, y, rad, stun) {
    const rot = reduceMotion ? -Math.PI / 2 : state.time * (stun ? 3.1 : 1.35);
    ctx.save();
    ctx.globalAlpha = stun ? 0.92 : 0.74;
    ctx.strokeStyle = stun ? "rgba(255,255,255,0.95)" : "rgba(196,155,255,0.92)";
    ctx.lineWidth = 0.15;
    strokeHex(x, y, rad, rot);
    ctx.stroke();
    ctx.globalAlpha = 0.82;
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 0.07;
    strokeHex(x, y, rad * 0.55, rot + Math.PI / 6);
    ctx.stroke();
    ctx.fillStyle = stun ? "#ffffff" : "#efe4ff";
    ctx.beginPath();
    ctx.arc(x, y, rad * 0.16, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      const a = rot * 1.6 + i * 2.094;
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = i === 1 ? "#ffffff" : "#c49bff";
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * rad * 0.78, y + Math.sin(a) * rad * 0.78, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMagicRing(ring) {
    const lifeA = Math.max(0, ring.life / 0.4);
    const rad = Math.max(0.35, Math.min(ring.max, ring.r));
    const rot = reduceMotion ? 0 : state.time * 2.4;
    ctx.save();
    ctx.globalAlpha = lifeA * 0.32;
    ctx.strokeStyle = "rgba(196,155,255,0.85)";
    ctx.lineWidth = 0.18;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, rad * 1.14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = lifeA * 0.9;
    ctx.strokeStyle = "#f3eaff";
    ctx.lineWidth = 0.26;
    strokeHex(ring.x, ring.y, rad, rot);
    ctx.stroke();
    ctx.globalAlpha = lifeA * 0.8;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.1;
    strokeHex(ring.x, ring.y, rad * 0.58, -rot * 0.65);
    ctx.stroke();
    ctx.globalAlpha = lifeA * 0.88;
    ctx.fillStyle = "#f7f2ff";
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, Math.max(0.16, rad * 0.07), 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      const a = rot * 1.7 + i * (Math.PI / 2);
      const sr = rad * (0.38 + 0.42 * (0.5 + 0.5 * Math.sin(state.time * 6 + i)));
      ctx.globalAlpha = lifeA * 0.78;
      ctx.fillStyle = i % 2 ? "#ffffff" : "#c49bff";
      ctx.beginPath();
      ctx.arc(ring.x + Math.cos(a) * sr, ring.y + Math.sin(a) * sr, 0.14, 0, Math.PI * 2);
      ctx.fill();
    }
    if (ring.ox != null) {
      const dx = ring.x - ring.ox;
      const dy = ring.y - ring.oy;
      const dist = Math.hypot(dx, dy) || 1;
      const len = Math.min(3.1, dist);
      const nx = dx / dist;
      const ny = dy / dist;
      for (let i = 1; i <= 4; i++) {
        const k = i / 4;
        const spin = Math.sin(state.time * 14 + i * 1.25) * 0.32 * (1 - k);
        const px = ring.x - nx * len * (1 - k) - ny * spin;
        const py = ring.y - ny * len * (1 - k) + nx * spin;
        ctx.globalAlpha = lifeA * (0.18 + k * 0.5);
        ctx.fillStyle = k > 0.7 ? "#ffffff" : "#b794f6";
        ctx.beginPath();
        ctx.arc(px, py, 0.1 + k * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawPatch(p) {
    const life = Math.max(0, Math.min(1, p.life / (p.max || 1)));
    const t = state.time;
    const sway = reduceMotion ? 0 : 1;
    const tall = 0.28 + 0.72 * life;
    const dim = 0.22 + 0.78 * life;
    const r = p.r * (0.7 + 0.3 * life);
    ctx.save();
    ctx.globalAlpha = 0.68 * dim;
    ctx.fillStyle = "#4a1608";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, r * 1.12, r * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.38 * dim;
    ctx.fillStyle = "#c2410c";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, r * 0.72, r * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    const tongues = 6;
    for (let i = 0; i < tongues; i++) {
      const phase = t * (6.4 + i * 0.33) + i * 1.27 + p.x * 0.17;
      const s1 = Math.sin(phase);
      const s2 = Math.sin(phase * 0.63 + 1.4);
      const ang = (i / tongues) * Math.PI * 2;
      const bx = p.x + Math.cos(ang) * r * 0.34 + s2 * 0.25 * sway;
      const by = p.y + Math.sin(ang) * r * 0.16;
      const lean = s1 * r * 0.18 * sway;
      const h = r * (0.55 + 0.85 * tall) * (0.72 + 0.28 * (0.5 + 0.5 * s2));
      const half = r * (0.1 + 0.06 * (0.5 + 0.5 * s1));
      const tipX = bx + lean;
      const tipY = by - h;
      const midY = by - h * 0.48;
      ctx.beginPath();
      ctx.moveTo(bx - half, by);
      ctx.quadraticCurveTo(bx - half * 0.2 + lean * 0.3, midY, tipX, tipY);
      ctx.quadraticCurveTo(bx + half * 0.2 + lean * 0.3, midY, bx + half, by);
      ctx.closePath();
      ctx.globalAlpha = (0.32 + 0.2 * (0.5 + 0.5 * s1)) * dim;
      ctx.fillStyle = "#9a1c0e";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(bx - half * 0.62, by - h * 0.08);
      ctx.quadraticCurveTo(bx + lean * 0.45, midY - h * 0.05, tipX, tipY + h * 0.18);
      ctx.quadraticCurveTo(bx + lean * 0.2, midY, bx + half * 0.62, by - h * 0.08);
      ctx.closePath();
      ctx.globalAlpha = 0.4 * dim;
      ctx.fillStyle = "#ff6a1a";
      ctx.fill();
      ctx.globalAlpha = 0.48 * dim;
      ctx.fillStyle = "#ffd15a";
      ctx.beginPath();
      ctx.ellipse(tipX, tipY + h * 0.22, half * 0.28, Math.max(0.08, h * 0.1), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const pulse = 0.85 + (reduceMotion ? 0.15 : 0.15 * Math.sin(t * 12 + p.y));
    ctx.globalAlpha = 0.52 * dim;
    ctx.fillStyle = "#ff9a32";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - r * 0.12 * tall, r * 0.22 * pulse, r * 0.34 * tall * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.7 * dim;
    ctx.fillStyle = "#fff1b0";
    ctx.beginPath();
    ctx.arc(p.x, p.y - r * 0.22 * tall, Math.max(0.12, r * 0.08 * pulse), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLob(p) {
    const dur = p.dur || 0.2;
    const k = Math.min(1, p.t / dur);
    const n = 4;
    ctx.save();
    for (let i = n; i >= 1; i--) {
      const kk = Math.max(0, k - i * 0.07);
      const x = p.sx + (p.tx - p.sx) * kk;
      const y = p.sy + (p.ty - p.sy) * kk - Math.sin(kk * Math.PI) * 5;
      const fade = 1 - i / (n + 1);
      ctx.globalAlpha = 0.16 + fade * 0.42;
      ctx.fillStyle = i >= 3 ? "#8e160c" : i === 2 ? "#ff5a18" : "#ffb04a";
      ctx.beginPath();
      ctx.arc(x, y, 0.22 + fade * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#ff7a22";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 0.82, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffe7a0";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawProp(key, x, y, size, rot) {
    return drawSprite(key, x, y, size, { anchor: "center", rot: rot || 0 });
  }

  function sandbagSpots() {
    const lv = state.ups.wall;
    if (!lv) return [];
    const spots = [];
    const n = lv <= 1 ? 4 : lv === 2 ? 6 : 8 + Math.max(0, lv - 3) * 2;
    const size = 4.6 + lv * 0.85;
    const rad = BASE.r + 2.8 + lv * 0.35;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + ((i + 0.5) / n) * Math.PI * 2;
      spots.push({
        x: BASE.x + Math.cos(a) * rad,
        y: BASE.y + Math.sin(a) * rad * 0.92,
        size: size,
        rot: a + Math.PI / 2,
        front: Math.sin(a) > 0.05,
      });
    }
    if (lv >= 3) {
      spots.push({ x: BASE.x - rad - 2.4, y: BASE.y + 1.6, size: size * 0.95, rot: -0.35, front: true });
      spots.push({ x: BASE.x + rad + 2.4, y: BASE.y + 1.6, size: size * 0.95, rot: 0.35, front: true });
    }
    if (lv >= 5) {
      spots.push({ x: BASE.x, y: BASE.y - rad - 2.2, size: size * 0.9, rot: 0, front: false });
      spots.push({ x: BASE.x, y: BASE.y + rad + 2.2, size: size * 0.9, rot: 0, front: true });
    }
    return spots;
  }

  function drawSandbags(front) {
    const spots = sandbagSpots();
    for (let i = 0; i < spots.length; i++) {
      const s = spots[i];
      if (s.front !== front) continue;
      if (!drawProp("wall", s.x, s.y, s.size, s.rot)) {
        ctx.fillStyle = "#c2a36a";
        ctx.fillRect(s.x - 1.2, s.y - 0.7, 2.4, 1.4);
      }
    }
  }

  function drawAura() {
    const aura = AURA[state.ups.aura];
    if (!aura) return;
    const pulse = reduceMotion ? 1 : 1 + Math.sin(state.time * 2.4) * 0.04;
    const size = aura.r * 2.25 * pulse;
    ctx.save();
    ctx.globalAlpha = 0.92;
    if (!drawProp("aura", BASE.x, BASE.y, size, reduceMotion ? 0 : state.time * 0.4)) {
      ctx.beginPath();
      ctx.arc(BASE.x, BASE.y, aura.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180,80,255,0.8)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawTurrets() {
    const lv = state.ups.turret;
    if (!lv) return;
    const size = lv === 1 ? 7.2 : lv === 2 ? 9.2 : lv >= 5 ? 9.6 : lv >= 4 ? 9 : 8.4;
    const dist = BASE.r + 5.6;
    const ang = state.turretAng || -Math.PI / 2;
    const spots = [{ a: ang, sc: 1 }];
    if (lv >= 3) spots.push({ a: ang + Math.PI * 0.85, sc: 0.78 });
    if (lv >= 5) spots.push({ a: ang + Math.PI * 1.55, sc: 0.7 });
    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      const x = BASE.x + Math.cos(spot.a) * dist;
      const y = BASE.y + Math.sin(spot.a) * dist;
      if (!drawProp("turret", x, y, size * spot.sc, spot.a + Math.PI / 2)) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(spot.a);
        ctx.fillStyle = "#9aa8bc";
        ctx.fillRect(0, -0.5, 2.2, 1);
        ctx.restore();
      }
      if (i === 0 && state.turretFlash > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, state.turretFlash / 0.08);
        ctx.fillStyle = "#fff4cc";
        ctx.beginPath();
        ctx.arc(x + Math.cos(spot.a) * 1.6, y + Math.sin(spot.a) * 1.6, 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  function drawSpikes() {
    const lv = state.ups.spikes;
    if (!lv) return;
    const n = 10 + lv * 4;
    const inner = BASE.r + 0.35;
    const outer = inner + 1.15 + lv * 0.28;
    ctx.strokeStyle = "rgba(214, 196, 160, 0.9)";
    ctx.lineWidth = 0.28;
    ctx.lineCap = "butt";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.15;
      ctx.beginPath();
      ctx.moveTo(BASE.x + Math.cos(a) * inner, BASE.y + Math.sin(a) * inner);
      ctx.lineTo(BASE.x + Math.cos(a) * outer, BASE.y + Math.sin(a) * outer);
      ctx.stroke();
    }
  }

  function drawMend() {
    const lv = state.ups.mend;
    if (!lv) return;
    const pulse = reduceMotion ? 1 : 1 + Math.sin(state.time * 2.1) * 0.05;
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, (BASE.r + 2.4) * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(125, 255, 179, " + (0.16 + lv * 0.07) + ")";
    ctx.lineWidth = 0.55;
    ctx.stroke();
  }

  function drawMines() {
    const lv = state.ups.mines;
    if (!lv) return;
    const n = lv >= 5 ? 6 : lv >= 4 ? 5 : lv >= 3 ? 4 : 3;
    const rad = BASE.r + 7.2;
    for (let i = 0; i < n; i++) {
      const a = -0.55 + (i / n) * Math.PI * 2;
      const x = BASE.x + Math.cos(a) * rad;
      const y = BASE.y + Math.sin(a) * rad * 0.86;
      ctx.fillStyle = "#14160f";
      ctx.beginPath();
      ctx.arc(x, y, 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c42e36";
      ctx.beginPath();
      ctx.arc(x, y, 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawBase() {
    drawSandbags(false);
    drawMines();
    const built = drawSprite("base", BASE.x, BASE.y + BASE.r * 0.15, BASE.r * 2.7, {
      anchor: "center",
      flash: state.baseFlash > 0 ? Math.min(0.85, state.baseFlash / 0.18) : 0,
    });
    if (!built) {
      ctx.beginPath();
      ctx.arc(BASE.x, BASE.y, BASE.r, 0, Math.PI * 2);
      ctx.fillStyle = state.baseFlash > 0 ? "#6a3038" : "#2a261c";
      ctx.fill();
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "#6a6254";
      ctx.stroke();
    }
    if (state.baseFlash > 0 && !built) {
      ctx.save();
      ctx.globalAlpha = Math.min(0.5, state.baseFlash / 0.18);
      ctx.fillStyle = "#ff5d6c";
      ctx.beginPath();
      ctx.arc(BASE.x, BASE.y, BASE.r * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawSandbags(true);
    drawTurrets();
    const frac = Math.max(0, state.baseHp / state.baseMax);
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, BASE.r + 4.2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
    ctx.strokeStyle = frac < 0.3 ? "#ff5d6c" : "#7dffb3";
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.font = "700 2.3px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = frac < 0.3 ? "#ff8d98" : "#d9ffe8";
    ctx.fillText(String(Math.max(0, Math.ceil(state.baseHp))), BASE.x, BASE.y + BASE.r + 5.6);
    drawSpikes();
    drawMend();
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

  function drawThreatBar() {
    const counts = { n: 0, e: 0, s: 0, w: 0 };
    let total = 0;
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (!e || e.dead) continue;
      const dN = e.y;
      const dE = WORLD_W - e.x;
      const dS = WORLD_H - e.y;
      const dW = e.x;
      let side = "n";
      let best = dN;
      if (dE < best) { best = dE; side = "e"; }
      if (dS < best) { best = dS; side = "s"; }
      if (dW < best) side = "w";
      counts[side] += 1;
      total += 1;
    }
    const order = ["n", "e", "s", "w"];
    const seg = WORLD_W / 4;
    const h = 1.8;
    for (let i = 0; i < order.length; i++) {
      const c = counts[order[i]];
      const hot = total > 0 ? c / total : 0;
      ctx.globalAlpha = c <= 0 ? 0.14 : Math.min(0.86, 0.32 + hot * 0.54);
      ctx.fillStyle = c <= 0 ? "#4a2832" : "#ff3d5c";
      ctx.fillRect(i * seg + 0.15, 0.12, seg - 0.3, h);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- Terrain ----------
  // Static ground is painted once per region + canvas size into an offscreen canvas (seeded, so it
  // never reshuffles), then blitted every frame. Only ripples, candle flicker and fog draw live.
  const TAU = Math.PI * 2;
  const terrain = { canvas: null, key: "", x0: 0, y0: 0, x1: WORLD_W, y1: WORLD_H, layout: null };
  const terrainLayouts = {};
  let fogSprite = null;
  let glowSprite = null;

  function seeded(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rr(rng, a, b) { return a + rng() * (b - a); }
  function pick(rng, list) { return list[(rng() * list.length) | 0]; }
  function distBase(x, y) { return Math.hypot(x - BASE.x, y - BASE.y); }

  function makeSprite(size, paint) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    paint(c.getContext("2d"), size);
    return c;
  }
  function ensureFxSprites() {
    if (!fogSprite) {
      fogSprite = makeSprite(128, (g, n) => {
        const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        grad.addColorStop(0, "rgba(200,220,205,1)");
        grad.addColorStop(0.45, "rgba(200,220,205,0.45)");
        grad.addColorStop(1, "rgba(200,220,205,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, n, n);
      });
    }
    if (!glowSprite) {
      glowSprite = makeSprite(64, (g, n) => {
        const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        grad.addColorStop(0, "rgba(255,206,120,0.9)");
        grad.addColorStop(0.3, "rgba(255,160,70,0.35)");
        grad.addColorStop(1, "rgba(255,140,60,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, n, n);
      });
    }
  }

  // Wobbly polyline from the base out to the world edge along angle a.
  function radialPath(rng, a, start, wobble) {
    const pts = [];
    const dx = Math.cos(a), dy = Math.sin(a);
    const tx = dx > 0 ? (WORLD_W + 2 - BASE.x) / dx : dx < 0 ? (-2 - BASE.x) / dx : 1e9;
    const ty = dy > 0 ? (WORLD_H + 2 - BASE.y) / dy : dy < 0 ? (-2 - BASE.y) / dy : 1e9;
    const len = Math.min(tx, ty);
    const steps = Math.max(6, Math.round((len - start) / 6));
    let off = 0;
    for (let i = 0; i <= steps; i++) {
      const d = start + (len - start) * (i / steps);
      if (i > 0) off += rr(rng, -wobble, wobble);
      off *= 0.85;
      pts.push({ x: BASE.x + dx * d - dy * off, y: BASE.y + dy * d + dx * off });
    }
    return pts;
  }
  function strokePts(g, pts, offset) {
    g.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      let x = p.x, y = p.y;
      if (offset) {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        x += (-(b.y - a.y) / l) * offset;
        y += ((b.x - a.x) / l) * offset;
      }
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  function nearPath(paths, x, y, w) {
    for (const pts of paths) {
      for (let i = 0; i < pts.length; i++) {
        if (Math.abs(pts[i].x - x) < w && Math.abs(pts[i].y - y) < w + 3) return true;
      }
    }
    return false;
  }
  function blobPath(g, rng, x, y, r, rough, n) {
    const pts = n || 12;
    g.beginPath();
    const rs = [];
    for (let i = 0; i < pts; i++) rs.push(r * (1 - rough + rng() * rough * 2));
    for (let i = 0; i <= pts; i++) {
      const k = i % pts;
      const a = (k / pts) * TAU;
      const px = x + Math.cos(a) * rs[k], py = y + Math.sin(a) * rs[k];
      if (i === 0) g.moveTo(px, py);
      else {
        const pa = ((k - 0.5) / pts) * TAU;
        const pr = (rs[k] + rs[(k + pts - 1) % pts]) / 2 * 1.04;
        g.quadraticCurveTo(x + Math.cos(pa) * pr, y + Math.sin(pa) * pr, px, py);
      }
    }
    g.closePath();
  }
  function scatter(rng, n, minBase, maxTry, ok) {
    const out = [];
    let tries = 0;
    while (out.length < n && tries < n * (maxTry || 20)) {
      tries++;
      const x = rr(rng, 3, WORLD_W - 3), y = rr(rng, 4, WORLD_H - 3);
      if (distBase(x, y) < minBase) continue;
      if (ok && !ok(x, y, out)) continue;
      out.push({ x: x, y: y });
    }
    return out;
  }
  function apart(list, x, y, d) {
    for (const p of list) if (Math.hypot(p.x - x, p.y - y) < d) return false;
    return true;
  }

  // Layout is size-independent (world units only), cached per region.
  function terrainLayout(region) {
    if (terrainLayouts[region]) return terrainLayouts[region];
    const rng = seeded(hashStr("last-gate-" + region));
    const L = { region: region, paths: [], pools: [], candles: [], fog: [] };
    if (region === "yard") {
      const n = 7;
      const a0 = rng() * TAU;
      for (let i = 0; i < n; i++) L.paths.push(radialPath(rng, a0 + (i / n) * TAU + rr(rng, -0.25, 0.25), BASE.r + 2, 1.6));
    } else if (region === "marsh") {
      const pools = scatter(rng, 11, 22, 40, (x, y, out) => apart(out, x, y, 22));
      for (const p of pools) {
        const r = rr(rng, 5, 10.5);
        const ripples = [];
        const k = 1 + ((rng() * 2) | 0);
        for (let i = 0; i < k; i++) {
          const a = rng() * TAU, d = rng() * r * 0.35;
          ripples.push({ x: p.x + Math.cos(a) * d, y: p.y + Math.sin(a) * d * 0.7, max: r * rr(rng, 0.35, 0.55), speed: rr(rng, 0.22, 0.38), ph: rng() });
        }
        L.pools.push({ x: p.x, y: p.y, r: r, seed: (rng() * 1e9) | 0, ripples: ripples });
      }
      const a0 = rng() * TAU;
      L.paths.push(radialPath(rng, a0, BASE.r + 4, 1.2));
      L.paths.push(radialPath(rng, a0 + Math.PI + rr(rng, -0.5, 0.5), BASE.r + 4, 1.2));
      for (let i = 0; i < 6; i++) {
        L.fog.push({ y: rr(rng, 8, WORLD_H - 8), w: rr(rng, 40, 64), h: rr(rng, 16, 26), speed: rr(rng, 0.6, 1.4) * (rng() < 0.5 ? -1 : 1), ph: rng() * 200, a: rr(rng, 0.05, 0.085) });
      }
    } else {
      L.plazaR = 25;
      const a0 = -Math.PI / 2 + rr(rng, -0.2, 0.2);
      for (let i = 0; i < 4; i++) L.paths.push(radialPath(rng, a0 + i * Math.PI / 2 + rr(rng, -0.12, 0.12), L.plazaR - 2, 0.6));
      // Graves on a loose grid, kept off the plaza and the cobble paths.
      L.graves = [];
      for (let gy = 8; gy < WORLD_H - 6; gy += 11) {
        for (let gx = 7; gx < WORLD_W - 5; gx += 9.5) {
          const x = gx + rr(rng, -2, 2), y = gy + rr(rng, -2, 2);
          if (distBase(x, y) < L.plazaR + 6) continue;
          if (nearPath(L.paths, x, y, 5)) continue;
          if (rng() < 0.42) continue;
          L.graves.push({ x: x, y: y, w: rr(rng, 2.6, 3.4), h: rr(rng, 3.2, 4.4), rot: rr(rng, -0.22, 0.22), cross: rng() < 0.22, broken: rng() < 0.15, shade: (rng() * 3) | 0 });
        }
      }
      for (const gr of L.graves) {
        if (rng() < 0.2) L.candles.push({ x: gr.x + rr(rng, -1.8, 1.8), y: gr.y + gr.h * 0.25 + rr(rng, 0.6, 1.6), ph: rng() * TAU });
      }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + 0.3 + rr(rng, -0.1, 0.1);
        L.candles.push({ x: BASE.x + Math.cos(a) * (L.plazaR - 3), y: BASE.y + Math.sin(a) * (L.plazaR - 3), ph: rng() * TAU });
      }
    }
    terrainLayouts[region] = L;
    return L;
  }

  function paintMottle(g, rng, x0, y0, x1, y1, colors, density, rmin, rmax, amin, amax) {
    const n = Math.round((x1 - x0) * (y1 - y0) / density);
    for (let i = 0; i < n; i++) {
      g.globalAlpha = rr(rng, amin, amax);
      g.fillStyle = pick(rng, colors);
      g.beginPath();
      g.arc(rr(rng, x0, x1), rr(rng, y0, y1), rr(rng, rmin, rmax), 0, TAU);
      g.fill();
    }
    g.globalAlpha = 1;
  }
  function paintTufts(g, rng, x, y, n, colors, len) {
    g.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + rr(rng, -0.75, 0.75);
      const l = len * rr(rng, 0.55, 1.1);
      const bx = x + rr(rng, -0.5, 0.5);
      g.strokeStyle = pick(rng, colors);
      g.lineWidth = rr(rng, 0.14, 0.24);
      g.beginPath();
      g.moveTo(bx, y);
      g.quadraticCurveTo(bx + Math.cos(a) * l * 0.4, y + Math.sin(a) * l * 0.6, bx + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
  }
  function paintShadow(g, x, y, rx, ry, a) {
    g.fillStyle = "rgba(0,0,0," + (a || 0.3) + ")";
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, TAU);
    g.fill();
  }
  function paintBranch(g, rng, x, y, a, len, w, depth) {
    const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(ex, ey);
    g.stroke();
    if (depth <= 0) return;
    const k = 2 + ((rng() * 2) | 0);
    for (let i = 0; i < k; i++) paintBranch(g, rng, ex, ey, a + rr(rng, -0.8, 0.8), len * rr(rng, 0.5, 0.72), w * 0.62, depth - 1);
  }
  function paintFence(g, color) {
    g.strokeStyle = color;
    g.lineWidth = 0.28;
    const gap = 7.5;
    for (let x = 3; x < WORLD_W - 2; x += gap) {
      if (Math.round(x / gap) % 4 === 2) continue;
      g.beginPath();
      g.moveTo(x, 1.1); g.lineTo(x, 3.1);
      g.moveTo(x, WORLD_H - 1.1); g.lineTo(x, WORLD_H - 3.1);
      g.stroke();
    }
    for (let y = 3; y < WORLD_H - 2; y += gap) {
      if (Math.round(y / gap) % 4 === 1) continue;
      g.beginPath();
      g.moveTo(1.1, y); g.lineTo(3.1, y);
      g.moveTo(WORLD_W - 1.1, y); g.lineTo(WORLD_W - 3.1, y);
      g.stroke();
    }
  }

  function paintYard(g, rng, L, ext) {
    g.fillStyle = "#17190f";
    g.fillRect(ext.x0, ext.y0, ext.x1 - ext.x0, ext.y1 - ext.y0);
    paintMottle(g, rng, ext.x0, ext.y0, ext.x1, ext.y1, ["#2a2a1a", "#1d2614", "#232c17", "#2e281b", "#101208"], 9, 1.5, 6, 0.12, 0.3);
    // Grass patches.
    for (let i = 0; i < 46; i++) {
      const x = rr(rng, -4, WORLD_W + 4), y = rr(rng, -4, WORLD_H + 4);
      g.fillStyle = pick(rng, ["rgba(36,54,22,0.42)", "rgba(44,60,26,0.36)", "rgba(30,44,18,0.45)"]);
      blobPath(g, rng, x, y, rr(rng, 3, 9), 0.35, 10);
      g.fill();
    }
    // Worn dirt paths from the gate to the fence.
    g.lineCap = "round";
    g.lineJoin = "round";
    for (const pts of L.paths) {
      g.strokeStyle = "rgba(66,54,36,0.42)"; g.lineWidth = 7.5; strokePts(g, pts);
      g.strokeStyle = "rgba(86,72,50,0.34)"; g.lineWidth = 4.6; strokePts(g, pts);
      g.strokeStyle = "rgba(40,32,22,0.35)"; g.lineWidth = 0.5; strokePts(g, pts, 1.3); strokePts(g, pts, -1.3);
    }
    // Packed dirt round the gate.
    const clear = g.createRadialGradient(BASE.x, BASE.y, 2, BASE.x, BASE.y, 26);
    clear.addColorStop(0, "rgba(92,80,56,0.55)");
    clear.addColorStop(0.6, "rgba(72,62,42,0.3)");
    clear.addColorStop(1, "rgba(60,50,34,0)");
    g.fillStyle = clear;
    g.fillRect(BASE.x - 30, BASE.y - 30, 60, 60);
    paintMottle(g, rng, ext.x0, ext.y0, ext.x1, ext.y1, ["#d9d3c4", "#a89c84"], 22, 0.1, 0.32, 0.08, 0.22);
    // Blood stains.
    for (const p of scatter(rng, 9, 15)) {
      g.fillStyle = "rgba(84,10,14,0.4)";
      blobPath(g, rng, p.x, p.y, rr(rng, 1, 2.4), 0.4, 9);
      g.fill();
      for (let i = 0; i < 5; i++) {
        g.beginPath();
        g.arc(p.x + rr(rng, -3.5, 3.5), p.y + rr(rng, -3, 3), rr(rng, 0.15, 0.5), 0, TAU);
        g.fill();
      }
    }
    // Tufts (not on the gate apron).
    for (let i = 0; i < 300; i++) {
      const x = rr(rng, -2, WORLD_W + 2), y = rr(rng, -2, WORLD_H + 2);
      if (distBase(x, y) < 16 || nearPath(L.paths, x, y, 2.2)) continue;
      paintTufts(g, rng, x, y, 3 + ((rng() * 4) | 0), ["rgba(78,102,44,0.6)", "rgba(96,110,52,0.55)", "rgba(58,80,34,0.6)", "rgba(120,112,64,0.45)"], rr(rng, 0.9, 1.7));
    }
    // Rubble.
    for (let i = 0; i < 80; i++) {
      const x = rr(rng, 2, WORLD_W - 2), y = rr(rng, 2, WORLD_H - 2);
      if (distBase(x, y) < 12) continue;
      const r = rr(rng, 0.3, 0.95);
      g.fillStyle = pick(rng, ["#4a4740", "#3c3a34", "#55504a", "#3a342c"]);
      g.globalAlpha = 0.75;
      blobPath(g, rng, x, y, r, 0.45, 5);
      g.fill();
      g.globalAlpha = 0.25;
      g.fillStyle = "#c8c0ae";
      g.beginPath(); g.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
    const props = scatter(rng, 26, 20, 40, (x, y, out) => apart(out, x, y, 9) && !nearPath(L.paths, x, y, 4));
    let pi = 0;
    // Dead trees near the edges.
    for (; pi < 5 && pi < props.length; pi++) {
      const p = props[pi];
      paintShadow(g, p.x + 1.5, p.y + 1.2, 5.5, 2.4, 0.22);
      g.strokeStyle = "rgba(38,30,22,0.92)";
      g.lineCap = "round";
      const k = 4 + ((rng() * 3) | 0);
      const a0 = rng() * TAU;
      for (let i = 0; i < k; i++) paintBranch(g, rng, p.x, p.y, a0 + (i / k) * TAU + rr(rng, -0.3, 0.3), rr(rng, 2.6, 4.2), 0.75, 2);
      g.fillStyle = "#2c2219";
      g.beginPath(); g.arc(p.x, p.y, 0.95, 0, TAU); g.fill();
    }
    // Tires.
    for (let n = 0; n < 6 && pi < props.length; n++, pi++) {
      const p = props[pi];
      const stack = rng() < 0.4 ? 2 : 1;
      for (let s = 0; s < stack; s++) {
        const x = p.x + s * 1.1, y = p.y - s * 0.6;
        paintShadow(g, x + 0.3, y + 0.5, 1.9, 1.1, 0.3);
        g.strokeStyle = "#0f0f10"; g.lineWidth = 0.8;
        g.beginPath(); g.ellipse(x, y, 1.45, 1.1, 0, 0, TAU); g.stroke();
        g.strokeStyle = "rgba(90,90,90,0.5)"; g.lineWidth = 0.14;
        g.beginPath(); g.ellipse(x, y, 1.05, 0.75, 0, 0, TAU); g.stroke();
      }
    }
    // Crates.
    for (let n = 0; n < 6 && pi < props.length; n++, pi++) {
      const p = props[pi];
      const s = rr(rng, 2.4, 3.3);
      g.save();
      g.translate(p.x, p.y);
      g.rotate(rr(rng, -0.5, 0.5));
      g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-s / 2 + 0.5, -s / 2 + 0.6, s, s);
      g.fillStyle = pick(rng, ["#4a3a26", "#544130", "#3f3222"]); g.fillRect(-s / 2, -s / 2, s, s);
      g.strokeStyle = "rgba(24,18,10,0.85)"; g.lineWidth = 0.2;
      g.strokeRect(-s / 2, -s / 2, s, s);
      g.beginPath();
      g.moveTo(-s / 2, -s / 2); g.lineTo(s / 2, s / 2);
      g.moveTo(-s / 2, 0); g.lineTo(s / 2, 0);
      g.stroke();
      g.restore();
    }
    // Broken fence runs.
    for (let n = 0; n < 6 && pi < props.length; n++, pi++) {
      const p = props[pi];
      const a = rng() * TAU;
      const posts = 3 + ((rng() * 3) | 0);
      g.lineCap = "round";
      for (let i = 0; i < posts; i++) {
        const x = p.x + Math.cos(a) * i * 2.6, y = p.y + Math.sin(a) * i * 2.6;
        if (i < posts - 1 && rng() < 0.7) {
          g.strokeStyle = "rgba(92,74,52,0.8)"; g.lineWidth = 0.4;
          const sag = rng() < 0.3 ? rr(rng, 0.6, 1.4) : 0;
          g.beginPath();
          g.moveTo(x, y - 0.3);
          g.lineTo(x + Math.cos(a) * 2.6, y + Math.sin(a) * 2.6 - 0.3 + sag);
          g.stroke();
        }
        if (rng() < 0.85) {
          g.fillStyle = "#3a2c1e";
          g.beginPath(); g.arc(x, y, 0.42, 0, TAU); g.fill();
        }
      }
    }
    // Leftover slots: scattered planks.
    for (; pi < props.length; pi++) {
      const p = props[pi];
      g.save();
      g.translate(p.x, p.y);
      g.rotate(rng() * TAU);
      g.fillStyle = "rgba(80,64,44,0.7)";
      g.fillRect(-1.6, -0.25, 3.2, 0.5);
      g.restore();
    }
    paintFence(g, "rgba(180,170,150,0.28)");
  }

  function paintMarsh(g, rng, L, ext) {
    g.fillStyle = "#111814";
    g.fillRect(ext.x0, ext.y0, ext.x1 - ext.x0, ext.y1 - ext.y0);
    paintMottle(g, rng, ext.x0, ext.y0, ext.x1, ext.y1, ["#1c261c", "#26281a", "#162019", "#2a2418", "#0c120e"], 8, 1.5, 6, 0.15, 0.35);
    // Mud flats.
    for (let i = 0; i < 30; i++) {
      g.fillStyle = pick(rng, ["rgba(54,44,28,0.38)", "rgba(46,40,26,0.42)", "rgba(36,32,22,0.45)"]);
      blobPath(g, rng, rr(rng, -4, WORLD_W + 4), rr(rng, -4, WORLD_H + 4), rr(rng, 3, 8), 0.4, 10);
      g.fill();
    }
    // Wet mud round the gate.
    const clear = g.createRadialGradient(BASE.x, BASE.y, 2, BASE.x, BASE.y, 24);
    clear.addColorStop(0, "rgba(70,60,40,0.5)");
    clear.addColorStop(1, "rgba(50,44,30,0)");
    g.fillStyle = clear;
    g.fillRect(BASE.x - 26, BASE.y - 26, 52, 52);
    // Pools: dark water with muddy banks.
    for (const p of L.pools) {
      const pr = seeded(p.seed);
      g.fillStyle = "rgba(40,36,24,0.55)";
      blobPath(g, seeded(p.seed), p.x, p.y, p.r * 1.18, 0.22, 14);
      g.fill();
      blobPath(g, pr, p.x, p.y, p.r, 0.22, 14);
      const water = g.createRadialGradient(p.x - p.r * 0.2, p.y - p.r * 0.25, p.r * 0.1, p.x, p.y, p.r * 1.1);
      water.addColorStop(0, "#1a3434");
      water.addColorStop(0.7, "#0f2224");
      water.addColorStop(1, "#0a1617");
      g.fillStyle = water;
      g.fill();
      g.strokeStyle = "rgba(90,104,70,0.32)";
      g.lineWidth = 0.45;
      g.stroke();
      g.strokeStyle = "rgba(170,210,200,0.08)";
      g.lineWidth = 0.3;
      for (let i = 0; i < 3; i++) {
        const sx = p.x + rr(pr, -p.r * 0.5, p.r * 0.3), sy = p.y + rr(pr, -p.r * 0.5, p.r * 0.4);
        g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + rr(pr, 1.5, 3.5), sy - 0.2); g.stroke();
      }
      // Lily pads.
      const pads = 2 + ((pr() * 4) | 0);
      for (let i = 0; i < pads; i++) {
        const a = pr() * TAU, d = pr() * p.r * 0.7;
        const x = p.x + Math.cos(a) * d, y = p.y + Math.sin(a) * d * 0.8;
        const r = rr(pr, 0.55, 1.05);
        const notch = pr() * TAU;
        g.fillStyle = pick(pr, ["#2c4a24", "#365a2a", "#24401e"]);
        g.beginPath();
        g.moveTo(x, y);
        g.arc(x, y, r, notch + 0.45, notch + TAU - 0.15);
        g.closePath();
        g.fill();
        if (pr() < 0.18) {
          g.fillStyle = "rgba(230,170,200,0.7)";
          g.beginPath(); g.arc(x + r * 0.2, y - r * 0.1, 0.28, 0, TAU); g.fill();
        }
      }
      // Reeds round the bank.
      const clumps = 3 + ((pr() * 4) | 0);
      for (let i = 0; i < clumps; i++) {
        const a = pr() * TAU;
        const x = p.x + Math.cos(a) * p.r * 1.02, y = p.y + Math.sin(a) * p.r * 1.02;
        const k = 4 + ((pr() * 5) | 0);
        g.lineCap = "round";
        for (let j = 0; j < k; j++) {
          const bx = x + rr(pr, -0.9, 0.9), lean = rr(pr, -0.35, 0.35), l = rr(pr, 2, 3.8);
          g.strokeStyle = pick(pr, ["rgba(86,100,48,0.85)", "rgba(70,86,40,0.85)", "rgba(104,108,58,0.8)"]);
          g.lineWidth = 0.2;
          g.beginPath(); g.moveTo(bx, y); g.lineTo(bx + lean * l, y - l); g.stroke();
          if (pr() < 0.35) {
            g.fillStyle = "#3b2a1a";
            g.beginPath(); g.ellipse(bx + lean * l * 0.92, y - l * 0.92, 0.22, 0.55, lean, 0, TAU); g.fill();
          }
        }
      }
    }
    // Duckboards across the mud.
    for (const pts of L.paths) {
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const seg = Math.hypot(b.x - a.x, b.y - a.y);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        for (let d = 0; d < seg; d += 1.45) {
          if (rng() < 0.09) continue;
          const x = a.x + Math.cos(ang) * d, y = a.y + Math.sin(ang) * d;
          g.save();
          g.translate(x, y);
          g.rotate(ang + Math.PI / 2 + rr(rng, -0.12, 0.12));
          g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-1.6, -0.35, 3.2, 0.95);
          g.fillStyle = pick(rng, ["#4a3c2a", "#3e3324", "#54442e"]);
          g.fillRect(-1.6 + rr(rng, -0.2, 0.2), -0.5, 3.2, 0.85);
          g.restore();
        }
      }
    }
    // Rotting logs.
    for (const p of scatter(rng, 4, 20, 40, (x, y) => !nearPath(L.paths, x, y, 4))) {
      g.save();
      g.translate(p.x, p.y);
      g.rotate(rng() * TAU);
      const l = rr(rng, 4, 7);
      g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-l / 2 + 0.4, -0.4, l, 1.6);
      g.fillStyle = "#3a2c1e"; g.fillRect(-l / 2, -0.75, l, 1.5);
      g.fillStyle = "#5a4630"; g.beginPath(); g.ellipse(l / 2, 0, 0.35, 0.75, 0, 0, TAU); g.fill();
      g.fillStyle = "rgba(60,90,40,0.6)"; g.fillRect(-l / 4, -0.75, l / 3, 0.4);
      g.restore();
    }
    for (let i = 0; i < 220; i++) {
      const x = rr(rng, -2, WORLD_W + 2), y = rr(rng, -2, WORLD_H + 2);
      if (distBase(x, y) < 15) continue;
      paintTufts(g, rng, x, y, 3 + ((rng() * 3) | 0), ["rgba(70,92,46,0.55)", "rgba(56,76,40,0.6)", "rgba(92,96,52,0.45)"], rr(rng, 0.9, 1.8));
    }
    paintFence(g, "rgba(150,160,130,0.26)");
  }

  function paintChapel(g, rng, L, ext) {
    g.fillStyle = "#121318";
    g.fillRect(ext.x0, ext.y0, ext.x1 - ext.x0, ext.y1 - ext.y0);
    paintMottle(g, rng, ext.x0, ext.y0, ext.x1, ext.y1, ["#1a1f1a", "#1e1e24", "#151a15", "#22222a", "#0c0d10"], 8, 1.5, 6, 0.18, 0.38);
    // Overgrowth.
    for (let i = 0; i < 40; i++) {
      g.fillStyle = pick(rng, ["rgba(30,42,28,0.4)", "rgba(26,36,26,0.45)"]);
      blobPath(g, rng, rr(rng, -4, WORLD_W + 4), rr(rng, -4, WORLD_H + 4), rr(rng, 3, 8), 0.35, 10);
      g.fill();
    }
    // Cobble paths out to the fence.
    for (const pts of L.paths) {
      g.lineCap = "round"; g.lineJoin = "round";
      g.strokeStyle = "rgba(20,20,24,0.6)"; g.lineWidth = 6; strokePts(g, pts);
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const seg = Math.hypot(b.x - a.x, b.y - a.y);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const nx = -Math.sin(ang), ny = Math.cos(ang);
        for (let d = 0; d < seg; d += 1.35) {
          for (let w = -2.1; w <= 2.15; w += 1.4) {
            if (rng() < 0.12) continue;
            const off = w + rr(rng, -0.25, 0.25) + ((Math.round(d / 1.35) % 2) ? 0.7 : 0);
            if (Math.abs(off) > 2.5) continue;
            const x = a.x + Math.cos(ang) * d + nx * off, y = a.y + Math.sin(ang) * d + ny * off;
            g.fillStyle = pick(rng, ["#2c2c33", "#33333a", "#27272c", "#38363a"]);
            blobPath(g, rng, x, y, rr(rng, 0.5, 0.68), 0.2, 6);
            g.fill();
          }
        }
      }
    }
    // Flagstone plaza round the gate.
    const R = L.plazaR;
    g.fillStyle = "rgba(14,14,18,0.85)";
    blobPath(g, rng, BASE.x, BASE.y, R + 0.6, 0.06, 24);
    g.fill();
    const rowH = 3.1;
    for (let y = BASE.y - R; y < BASE.y + R; y += rowH) {
      const shift = ((Math.round((y - BASE.y) / rowH) % 2) + 2) % 2 ? 2 : 0;
      for (let x = BASE.x - R - shift; x < BASE.x + R; ) {
        const w = rr(rng, 3, 4.8);
        const cx = x + w / 2, cy = y + rowH / 2;
        const edge = R - 1.2 + Math.sin(Math.atan2(cy - BASE.y, cx - BASE.x) * 5) * 0.9;
        if (distBase(cx, cy) < edge && rng() > 0.05) {
          g.fillStyle = pick(rng, ["#2e2e35", "#29292f", "#333339", "#25252a", "#302e32"]);
          g.fillRect(x + 0.14, y + 0.14, w - 0.28, rowH - 0.28);
          g.fillStyle = "rgba(255,255,255,0.035)";
          g.fillRect(x + 0.14, y + 0.14, w - 0.28, 0.35);
          if (rng() < 0.28) {
            g.strokeStyle = "rgba(12,12,16,0.8)";
            g.lineWidth = 0.14;
            g.beginPath();
            let px = x + rr(rng, 0.4, w - 0.4), py = y + 0.2;
            g.moveTo(px, py);
            for (let k = 0; k < 4; k++) { px += rr(rng, -0.7, 0.7); py += (rowH - 0.4) / 4; g.lineTo(px, py); }
            g.stroke();
          }
          if (rng() < 0.12) paintTufts(g, rng, x + rr(rng, 0, w), y + rowH - 0.1, 3, ["rgba(64,84,48,0.6)", "rgba(52,72,40,0.6)"], 0.9);
        }
        x += w;
      }
    }
    // Weeds.
    for (let i = 0; i < 240; i++) {
      const x = rr(rng, -2, WORLD_W + 2), y = rr(rng, -2, WORLD_H + 2);
      if (distBase(x, y) < R + 1) continue;
      paintTufts(g, rng, x, y, 3 + ((rng() * 4) | 0), ["rgba(62,80,48,0.6)", "rgba(50,66,40,0.62)", "rgba(80,86,58,0.45)"], rr(rng, 0.9, 1.9));
    }
    // Gravestones and crosses.
    const shades = [["#34343b", "#42424a"], ["#313337", "#3e4045"], ["#383434", "#45403f"]];
    for (const gr of L.graves) {
      g.fillStyle = "rgba(34,28,22,0.55)";
      g.beginPath(); g.ellipse(gr.x, gr.y + gr.h * 0.55, gr.w * 0.7, gr.h * 0.38, 0, 0, TAU); g.fill();
      paintShadow(g, gr.x + 0.8, gr.y + 0.4, gr.w * 0.6, 0.6, 0.35);
      g.save();
      g.translate(gr.x, gr.y);
      g.rotate(gr.rot);
      const sh = shades[gr.shade];
      const h = gr.broken ? gr.h * 0.55 : gr.h;
      if (gr.cross) {
        g.fillStyle = sh[0];
        g.fillRect(-0.4, -h, 0.8, h);
        g.fillRect(-1.35, -h * 0.75, 2.7, 0.75);
        g.fillStyle = sh[1];
        g.fillRect(-0.4, -h, 0.3, h);
      } else {
        const w = gr.w;
        g.fillStyle = sh[0];
        g.beginPath();
        g.moveTo(-w / 2, 0);
        g.lineTo(-w / 2, -h + w / 2);
        if (gr.broken) { g.lineTo(-w / 6, -h + 0.2); g.lineTo(w / 5, -h + 0.9); g.lineTo(w / 2, -h + 0.4); }
        else g.arc(0, -h + w / 2, w / 2, Math.PI, 0);
        g.lineTo(w / 2, 0);
        g.closePath();
        g.fill();
        g.fillStyle = sh[1];
        g.fillRect(-w / 2, -h + w / 2, 0.35, h - w / 2);
        g.strokeStyle = "rgba(20,20,24,0.7)";
        g.lineWidth = 0.16;
        g.beginPath();
        g.moveTo(-w * 0.25, -h * 0.55); g.lineTo(w * 0.25, -h * 0.55);
        g.moveTo(-w * 0.2, -h * 0.4); g.lineTo(w * 0.2, -h * 0.4);
        g.stroke();
        if (rng() < 0.5) {
          g.fillStyle = "rgba(70,96,52,0.5)";
          g.beginPath(); g.arc(rr(rng, -w / 3, w / 3), -rr(rng, 0.3, 1.2), rr(rng, 0.3, 0.6), 0, TAU); g.fill();
        }
      }
      g.restore();
      paintTufts(g, rng, gr.x + rr(rng, -1.2, 1.2), gr.y + 0.2, 4, ["rgba(62,80,48,0.7)", "rgba(80,90,56,0.6)"], 1.1);
    }
    // Candle stubs (flames draw live).
    for (const c of L.candles) {
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.beginPath(); g.ellipse(c.x + 0.2, c.y + 0.1, 0.5, 0.2, 0, 0, TAU); g.fill();
      g.fillStyle = "#d8ccb0";
      g.fillRect(c.x - 0.22, c.y - 0.9, 0.44, 0.9);
      g.fillStyle = "#f0e6cc";
      g.fillRect(c.x - 0.22, c.y - 0.9, 0.44, 0.14);
    }
    paintFence(g, "rgba(160,160,180,0.3)");
  }

  function paintLighting(g, ext, region) {
    // Red-tinged danger strip along the fence line (as before).
    g.fillStyle = "rgba(80,16,28,0.14)";
    g.fillRect(0, 0, WORLD_W, 5);
    g.fillRect(0, WORLD_H - 5, WORLD_W, 5);
    g.fillRect(0, 0, 5, WORLD_H);
    g.fillRect(WORLD_W - 5, 0, 5, WORLD_H);
    // Warm light pooled on the gate.
    const tint = region === "marsh" ? "190,220,170" : region === "chapel" ? "255,200,140" : "255,214,150";
    const lit = g.createRadialGradient(BASE.x, BASE.y, 0, BASE.x, BASE.y, 34);
    lit.addColorStop(0, "rgba(" + tint + ",0.10)");
    lit.addColorStop(1, "rgba(" + tint + ",0)");
    g.fillStyle = lit;
    g.fillRect(BASE.x - 36, BASE.y - 36, 72, 72);
    // Vignette: edges fall into the dark.
    const far = Math.hypot(Math.max(BASE.x - ext.x0, ext.x1 - BASE.x), Math.max(BASE.y - ext.y0, ext.y1 - BASE.y));
    const vig = g.createRadialGradient(BASE.x, BASE.y, 18, BASE.x, BASE.y, Math.max(far, 120));
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(0.42, "rgba(0,0,0,0.2)");
    vig.addColorStop(0.75, "rgba(0,0,0,0.48)");
    vig.addColorStop(1, "rgba(0,0,0,0.72)");
    g.fillStyle = vig;
    g.fillRect(ext.x0, ext.y0, ext.x1 - ext.x0, ext.y1 - ext.y0);
    // Off-field margins (wide screens) stay dim so the fence reads as the edge.
    g.fillStyle = "rgba(3,4,8,0.55)";
    if (ext.x0 < 0) g.fillRect(ext.x0, ext.y0, -ext.x0, ext.y1 - ext.y0);
    if (ext.x1 > WORLD_W) g.fillRect(WORLD_W, ext.y0, ext.x1 - WORLD_W, ext.y1 - ext.y0);
    if (ext.y0 < 0) g.fillRect(0, ext.y0, WORLD_W, -ext.y0);
    if (ext.y1 > WORLD_H) g.fillRect(0, WORLD_H, WORLD_W, ext.y1 - WORLD_H);
  }

  function ensureTerrain(region) {
    const s = view.s;
    const key = region + "|" + canvas.width + "x" + canvas.height;
    if (terrain.key === key && terrain.canvas) return terrain;
    // Cover the whole canvas (letterbox margins too), plus a little slack for screen shake.
    const pad = 2;
    const ext = {
      x0: Math.min(0, -view.ox / s) - pad,
      y0: Math.min(0, -view.oy / s) - pad,
      x1: Math.max(WORLD_W, (canvas.width - view.ox) / s) + pad,
      y1: Math.max(WORLD_H, (canvas.height - view.oy) / s) + pad,
    };
    const w = Math.max(1, Math.ceil((ext.x1 - ext.x0) * s));
    const h = Math.max(1, Math.ceil((ext.y1 - ext.y0) * s));
    const c = terrain.canvas || document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    g.setTransform(s, 0, 0, s, -ext.x0 * s, -ext.y0 * s);
    const L = terrainLayout(region);
    const rng = seeded(hashStr("paint-" + region));
    if (region === "marsh") paintMarsh(g, rng, L, ext);
    else if (region === "chapel") paintChapel(g, rng, L, ext);
    else paintYard(g, rng, L, ext);
    g.globalAlpha = 1;
    paintLighting(g, ext, region);
    terrain.canvas = c;
    terrain.key = key;
    terrain.x0 = ext.x0; terrain.y0 = ext.y0;
    terrain.x1 = ext.x0 + w / s; terrain.y1 = ext.y0 + h / s;
    terrain.layout = L;
    return terrain;
  }

  function drawTerrainLive(region) {
    const L = terrain.layout;
    if (!L || L.region !== region) return;
    const t = state.time;
    if (region === "marsh") {
      ctx.lineWidth = 0.18;
      for (const p of L.pools) {
        for (const rp of p.ripples) {
          const f = reduceMotion ? 0.5 : (t * rp.speed + rp.ph) % 1;
          ctx.strokeStyle = "rgba(180,220,210," + (0.22 * (1 - f)).toFixed(3) + ")";
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, 0.3 + f * rp.max, (0.3 + f * rp.max) * 0.62, 0, 0, TAU);
          ctx.stroke();
        }
      }
      if (fogSprite && !reduceMotion) {
        const span = WORLD_W + 70;
        for (const f of L.fog) {
          const x = ((((f.ph + t * f.speed) % span) + span) % span) - 35;
          ctx.globalAlpha = f.a;
          ctx.drawImage(fogSprite, x - f.w / 2, f.y - f.h / 2 + Math.sin(t * 0.3 + f.ph) * 1.5, f.w, f.h);
        }
        ctx.globalAlpha = 1;
      }
    } else if (region === "chapel" && glowSprite) {
      ctx.globalCompositeOperation = "lighter";
      for (const c of L.candles) {
        const fl = reduceMotion ? 0.8 : 0.72 + Math.sin(t * 9 + c.ph) * 0.14 + Math.sin(t * 23.7 + c.ph * 2.3) * 0.09;
        ctx.globalAlpha = 0.32 * fl;
        const gs = 7 * (0.9 + fl * 0.15);
        ctx.drawImage(glowSprite, c.x - gs / 2, c.y - 1 - gs / 2, gs, gs);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      for (const c of L.candles) {
        const fl = reduceMotion ? 0 : Math.sin(t * 13 + c.ph) * 0.06;
        ctx.fillStyle = "#ffd27a";
        ctx.beginPath();
        ctx.ellipse(c.x + fl, c.y - 1.15, 0.17, 0.34, fl, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#fff4d6";
        ctx.beginPath();
        ctx.arc(c.x + fl * 0.5, c.y - 1.05, 0.08, 0, TAU);
        ctx.fill();
      }
    }
  }

  // ---------- Feature drawing (all canvas, no new images) ----------
  let fogLayer = null;
  let lightSprite = null;

  function drawFogOverlay(jx, jy) {
    if (!lightSprite) {
      lightSprite = makeSprite(128, (g, n) => {
        const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        grad.addColorStop(0, "rgba(0,0,0,1)");
        grad.addColorStop(0.62, "rgba(0,0,0,0.92)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, n, n);
      });
    }
    const w = Math.max(1, Math.ceil(canvas.width / 4));
    const h = Math.max(1, Math.ceil(canvas.height / 4));
    if (!fogLayer) fogLayer = document.createElement("canvas");
    if (fogLayer.width !== w || fogLayer.height !== h) { fogLayer.width = w; fogLayer.height = h; }
    const g = fogLayer.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = "source-over";
    g.clearRect(0, 0, w, h);
    g.fillStyle = "rgba(9,12,18,0.93)";
    g.fillRect(0, 0, w, h);
    g.setTransform(view.s / 4, 0, 0, view.s / 4, (view.ox + jx) / 4, (view.oy + jy) / 4);
    g.globalCompositeOperation = "destination-out";
    const light = (x, y, r) => g.drawImage(lightSprite, x - r, y - r, r * 2, r * 2);
    light(BASE.x, BASE.y, 38);
    for (const u of units) light(u.x, u.y - 3, 21);
    const ev = state.event;
    if (ev && ev.kind === "survivor") light(ev.x, ev.y - 3, 10);
    for (const d of drops) light(d.x, d.y, 9);
    if (state.fireWall) {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        light(BASE.x + Math.cos(a) * state.fireWall.r, BASE.y + Math.sin(a) * state.fireWall.r, 9);
      }
    }
    g.globalCompositeOperation = "source-over";
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(fogLayer, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function drawPools() {
    for (const p of pools) {
      const fade = Math.min(1, p.life / 1.2, (p.max - p.life) / 0.25 + 0.2);
      const wob = reduceMotion ? 0 : Math.sin(state.time * 2 + p.x) * 0.15;
      ctx.globalAlpha = 0.42 * fade;
      ctx.fillStyle = "#5fd13a";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r + wob, p.r * 0.62, 0, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.75 * fade;
      ctx.strokeStyle = "#b8ff6a";
      ctx.lineWidth = 0.28;
      ctx.stroke();
      ctx.globalAlpha = 0.55 * fade;
      ctx.fillStyle = "#d8ff9a";
      for (let i = 0; i < 3; i++) {
        const a = state.time * 1.3 + i * 2.1 + p.x;
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(a) * p.r * 0.5, p.y + Math.sin(a) * p.r * 0.3, 0.35 + ((state.time * 2 + i) % 1) * 0.3, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  const MARK_COLORS = { raise: "#b88cff", brood: "#c6e86a", acid: "#9cff5a", slam: "#ff5a3c", breach: "#ff9a4a", mortar: "#ffb15a" };

  function drawMarks() {
    for (const m of marks) {
      const prog = 1 - Math.max(0, m.life) / m.max;
      const pulse = reduceMotion ? 0.7 : 0.55 + Math.sin(state.time * 16) * 0.25;
      if (m.kind === "lane") {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.ang);
        ctx.globalAlpha = 0.22 + prog * 0.25;
        ctx.fillStyle = "#ff2a2a";
        ctx.fillRect(0, -m.w / 2, m.len, m.w);
        ctx.globalAlpha = 0.55 + pulse * 0.4;
        ctx.strokeStyle = "#ff6a5a";
        ctx.lineWidth = 0.35;
        ctx.strokeRect(0, -m.w / 2, m.len, m.w);
        ctx.fillStyle = "#ffd0c0";
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, -m.w / 2, m.len * prog, 0.45);
        ctx.fillRect(0, m.w / 2 - 0.45, m.len * prog, 0.45);
        ctx.strokeStyle = "#ffe0d0";
        ctx.lineWidth = 0.5;
        const off = (state.time * 14) % 6;
        for (let d = off; d < m.len - 2; d += 6) {
          ctx.beginPath();
          ctx.moveTo(d, -m.w * 0.28);
          ctx.lineTo(d + 2, 0);
          ctx.lineTo(d, m.w * 0.28);
          ctx.stroke();
        }
        ctx.restore();
        continue;
      }
      const col = MARK_COLORS[m.kind] || "#ffffff";
      ctx.globalAlpha = 0.16 + prog * 0.22;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.r, m.r * 0.7, 0, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.6 + pulse * 0.35;
      ctx.strokeStyle = col;
      ctx.lineWidth = 0.32;
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 0.22;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.r * prog, m.r * 0.7 * prog, 0, 0, TAU);
      ctx.stroke();
      if (m.kind === "breach") {
        ctx.strokeStyle = "#2a1a0e";
        ctx.lineWidth = 0.45;
        for (let i = 0; i < 5; i++) {
          const a = i * 1.257 + 0.4;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x + Math.cos(a) * m.r * 0.5 * (0.4 + prog), m.y + Math.sin(a) * m.r * 0.35 * (0.4 + prog));
          ctx.lineTo(m.x + Math.cos(a + 0.3) * m.r * 0.85 * (0.3 + prog), m.y + Math.sin(a + 0.3) * m.r * 0.6 * (0.3 + prog));
          ctx.stroke();
        }
        ctx.fillStyle = "#ffcf7a";
        ctx.font = "700 4px Passion One, Impact, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = pulse + 0.2;
        ctx.fillText("!", m.x, m.y - m.r - 2);
      } else if (m.kind === "mortar") {
        ctx.strokeStyle = "#ffe0a0";
        ctx.lineWidth = 0.25;
        ctx.beginPath();
        ctx.moveTo(m.x - m.r * 0.5, m.y); ctx.lineTo(m.x + m.r * 0.5, m.y);
        ctx.moveTo(m.x, m.y - m.r * 0.4); ctx.lineTo(m.x, m.y + m.r * 0.4);
        ctx.stroke();
      } else if (m.kind === "acid" && m.sx != null) {
        const gx = m.sx + (m.x - m.sx) * prog;
        const gy = m.sy + (m.y - m.sy) * prog - Math.sin(prog * Math.PI) * 16;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#b8ff6a";
        ctx.beginPath();
        ctx.arc(gx, gy, 1.1, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#efffc8";
        ctx.beginPath();
        ctx.arc(gx - 0.3, gy - 0.3, 0.4, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawFireWall() {
    const w = state.fireWall;
    if (!w) return;
    const fade = Math.min(1, w.t / 0.6, (w.max - w.t) / 0.25);
    ctx.globalAlpha = 0.28 * fade;
    ctx.strokeStyle = "#ff6a1a";
    ctx.lineWidth = w.w * 1.6;
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, w.r, 0, TAU);
    ctx.stroke();
    const n = 34;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const flick = reduceMotion ? 0.7 : 0.55 + Math.abs(Math.sin(state.time * 9 + i * 1.7)) * 0.6;
      const x = BASE.x + Math.cos(a) * w.r;
      const y = BASE.y + Math.sin(a) * w.r;
      const hgt = 3.6 * flick;
      ctx.globalAlpha = 0.85 * fade;
      ctx.fillStyle = i % 2 ? "#ff8a2a" : "#ffb347";
      ctx.beginPath();
      ctx.moveTo(x - 1.2, y);
      ctx.quadraticCurveTo(x - 0.4, y - hgt * 0.6, x, y - hgt);
      ctx.quadraticCurveTo(x + 0.4, y - hgt * 0.6, x + 1.2, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff0a0";
      ctx.globalAlpha = 0.7 * fade;
      ctx.beginPath();
      ctx.arc(x, y - 0.6, 0.5 * flick, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDrop(d) {
    const falling = d.fall > 0;
    const y = falling ? d.y - d.fall * 14 : d.y;
    const rally = d.kind === "rally";
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(d.x, d.y + 0.3, 2.2 * (1 - d.fall * 0.5), 0.7, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (falling) {
      ctx.fillStyle = rally ? "#ffe36a" : "#e8e2d0";
      ctx.beginPath();
      ctx.arc(d.x, y - 6, 3.6, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#5a5040";
      ctx.lineWidth = 0.15;
      ctx.beginPath();
      ctx.moveTo(d.x - 3.4, y - 6); ctx.lineTo(d.x - 1, y - 2);
      ctx.moveTo(d.x + 3.4, y - 6); ctx.lineTo(d.x + 1, y - 2);
      ctx.stroke();
    } else {
      const left = d.life / d.max;
      const pulse = reduceMotion ? 0.8 : 0.6 + Math.sin(state.time * 7) * 0.3;
      ctx.globalAlpha = 0.35 * pulse;
      ctx.fillStyle = rally ? "#ffe36a" : "#ffc857";
      ctx.beginPath();
      ctx.arc(d.x, y - 1.2, 4.6, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = d.trample > 0 ? "#ff5d6c" : "#fff2c0";
      ctx.lineWidth = 0.35;
      ctx.beginPath();
      ctx.arc(d.x, y - 1.2, 4.2, -Math.PI / 2, -Math.PI / 2 + left * TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff4cc";
      ctx.font = "700 1.7px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("TAP", d.x, y - 6.2);
    }
    ctx.fillStyle = rally ? "#c89a2a" : "#8a6034";
    ctx.fillRect(d.x - 1.6, y - 2.6, 3.2, 2.6);
    ctx.strokeStyle = rally ? "#fff0a0" : "#d8b070";
    ctx.lineWidth = 0.22;
    ctx.strokeRect(d.x - 1.6, y - 2.6, 3.2, 2.6);
    ctx.beginPath();
    ctx.moveTo(d.x - 1.6, y - 1.3); ctx.lineTo(d.x + 1.6, y - 1.3);
    ctx.stroke();
    if (rally) {
      ctx.fillStyle = "#3a2a08";
      ctx.font = "700 1.5px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AMMO", d.x, y - 1.9);
    }
    ctx.globalAlpha = 1;
  }

  function drawSurvivor() {
    const ev = state.event;
    if (!ev || ev.kind !== "survivor") return;
    const x = ev.x, y = ev.y;
    const st = reduceMotion ? 0 : Math.sin(ev.walk * 1.1);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x, y + 0.3, 1.8, 0.55, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 0.65 + (reduceMotion ? 0 : Math.sin(state.time * 6) * 0.25);
    ctx.strokeStyle = "#6af0ff";
    ctx.lineWidth = 0.25;
    ctx.beginPath();
    ctx.ellipse(x, y, 2.8, 1.1, 0, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#2a3040";
    ctx.lineWidth = 0.75;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y - 4); ctx.lineTo(x - 0.5 + st * 0.9, y);
    ctx.moveTo(x, y - 4); ctx.lineTo(x + 0.5 - st * 0.9, y);
    ctx.stroke();
    ctx.fillStyle = "#c86a3a";
    ctx.beginPath();
    ctx.ellipse(x, y - 5.6, 1.15, 1.9, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#e6c0a0";
    ctx.lineWidth = 0.45;
    ctx.beginPath();
    ctx.moveTo(x - 0.9, y - 6.6); ctx.lineTo(x - 1.4 - st * 0.5, y - 4.4);
    ctx.moveTo(x + 0.9, y - 6.6); ctx.lineTo(x + 1.4 + st * 0.5, y - 4.4);
    ctx.stroke();
    ctx.lineCap = "butt";
    ctx.fillStyle = "#f0d0b0";
    ctx.beginPath();
    ctx.arc(x, y - 8.1, 0.85, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#3a2418";
    ctx.beginPath();
    ctx.arc(x, y - 8.4, 0.85, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(x - 2.5, y - 10.6, 5, 0.45);
    ctx.fillStyle = "#6af0ff";
    ctx.fillRect(x - 2.5, y - 10.6, 5 * Math.max(0, ev.hp / ev.max), 0.45);
    ctx.fillStyle = "#bff6ff";
    ctx.font = "700 1.5px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("SURVIVOR", x, y - 10.9);
  }

  function drawFlag(x, y, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y, 1.6, 0.55, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#f2ecdc";
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 5.4);
    ctx.stroke();
    const wave = reduceMotion ? 0 : Math.sin(state.time * 6) * 0.35;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - 5.4);
    ctx.quadraticCurveTo(x + 1.6, y - 5.2 + wave, x + 3.2, y - 4.6);
    ctx.lineTo(x, y - 3.4);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawHolds() {
    const dragging = drag && drag.moved ? drag : null;
    for (const u of units) {
      const isDrag = dragging && dragging.id === u.id;
      const spot = isDrag ? { x: dragging.x, y: dragging.y } : u.hold;
      if (!spot) continue;
      const col = HEROES[u.kind].accent;
      if (Math.hypot(spot.x - u.x, spot.y - u.y) > 1.5) {
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = col;
        ctx.lineWidth = 0.25;
        ctx.setLineDash([0.9, 0.7]);
        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(spot.x, spot.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (isDrag) {
        const s = statsOf(u);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, s.range, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = col;
        ctx.lineWidth = 0.2;
        ctx.stroke();
      }
      drawFlag(spot.x, spot.y, col, isDrag ? 1 : 0.85);
    }
    ctx.globalAlpha = 1;
  }

  function drawUnitStatus(u) {
    const h = heroHeight(u);
    if (u.dazeT > 0) {
      for (let i = 0; i < 3; i++) {
        const a = state.time * 5 + i * 2.094;
        const sx = u.x + Math.cos(a) * 2.2;
        const sy = u.y - h - 0.6 + Math.sin(a) * 0.6;
        ctx.fillStyle = i === 1 ? "#ffffff" : "#ffe36a";
        ctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const b = k * 1.2566 - Math.PI / 2;
          ctx.lineTo(sx + Math.cos(b) * 0.65, sy + Math.sin(b) * 0.65);
          ctx.lineTo(sx + Math.cos(b + 0.628) * 0.27, sy + Math.sin(b + 0.628) * 0.27);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
    if (u.slowT > 0) {
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = "#9cff5a";
      ctx.lineWidth = 0.25;
      ctx.beginPath();
      ctx.ellipse(u.x, u.y, 2.6, 0.9, 0, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (u.whirlT > 0) {
      const a = state.time * 20;
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = "#c8ff9a";
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.arc(u.x, u.y - 4, 6.5, a, a + 2.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(u.x, u.y - 4, 6.5, a + Math.PI, a + Math.PI + 2.4);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (u.stormT > 0) {
      ctx.globalAlpha = 0.25 + (reduceMotion ? 0 : Math.sin(state.time * 30) * 0.1);
      ctx.drawImage(glowSprite, u.x - 5, u.y - 11, 10, 10);
      ctx.globalAlpha = 1;
    }
  }

  function drawAbilityFx() {
    for (const f of fxs) {
      if (f.kind === "mark") {
        const k = 1 - Math.max(0, f.t) / f.max;
        const r = 4.2 - k * 2.2;
        const rot = state.time * 3;
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "#ffe36a";
        ctx.lineWidth = 0.28;
        ctx.beginPath();
        ctx.arc(f.x, f.y - 4, r, 0, TAU);
        ctx.stroke();
        for (let i = 0; i < 4; i++) {
          const a = rot + i * Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(f.x + Math.cos(a) * r * 0.5, f.y - 4 + Math.sin(a) * r * 0.5);
          ctx.lineTo(f.x + Math.cos(a) * r * 1.3, f.y - 4 + Math.sin(a) * r * 1.3);
          ctx.stroke();
        }
      } else if (f.kind === "beam") {
        const k = Math.max(0, f.life / f.total);
        ctx.globalAlpha = k;
        ctx.strokeStyle = "#ffe9a0";
        ctx.lineWidth = 0.9 * k + 0.2;
        ctx.beginPath();
        ctx.moveTo(f.sx, f.sy);
        ctx.lineTo(f.x, f.y);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.25;
        ctx.stroke();
      } else if (f.kind === "nova") {
        const k = Math.max(0, f.life / f.total);
        ctx.globalAlpha = k * 0.5;
        ctx.fillStyle = "#ff7a1a";
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(0.5, f.r), 0, TAU);
        ctx.fill();
        ctx.globalAlpha = k;
        ctx.strokeStyle = "#ffd36a";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (f.kind === "freeze") {
        const k = Math.max(0, f.life / f.total);
        ctx.globalAlpha = k * 0.85;
        ctx.strokeStyle = "#d8c4ff";
        ctx.lineWidth = 0.6;
        strokeHex(f.x, f.y, Math.max(0.5, f.r), state.time);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.25;
        strokeHex(f.x, f.y, Math.max(0.5, f.r * 0.7), -state.time);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawBossBar() {
    if (state.phase !== "fight" && state.phase !== "paused") return;
    let b = null;
    for (const e of enemies) if (e.boss && !e.dead) { b = e; break; }
    if (!b) return;
    const info = BOSS_KINDS[b.bossKind] || BOSS_KINDS.graveking;
    const x0 = 12, x1 = 88, y = 2.5, h = 2.4;
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = "#0a0a10";
    ctx.fillRect(x0 - 0.3, y - 0.3, x1 - x0 + 0.6, h + 0.6);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#3a1420";
    ctx.fillRect(x0, y, x1 - x0, h);
    const frac = Math.max(0, b.hp / b.max);
    ctx.fillStyle = b.shielded ? "#9a7cff" : "#ff3d5c";
    ctx.fillRect(x0, y, (x1 - x0) * frac, h);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x0, y, (x1 - x0) * frac, h * 0.4);
    ctx.strokeStyle = "#c49bff";
    ctx.lineWidth = 0.18;
    ctx.strokeRect(x0, y, x1 - x0, h);
    ctx.fillStyle = "#fff4f6";
    ctx.font = "700 1.9px Passion One, Impact, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let label = info.label;
    if (b.shielded) label += "  ·  SHIELDED";
    else if (b.charge && b.charge.phase !== "rest") label += "  ·  CHARGING";
    ctx.fillText(label, x0 + 0.8, y + h / 2 + 0.1);
    ctx.textAlign = "right";
    ctx.fillText(Math.ceil(frac * 100) + "%", x1 - 0.8, y + h / 2 + 0.1);
  }

  function drawEgg(e) {
    const k = e.dead ? Math.max(0, e.dying / (e.dyingMax || 0.2)) : 1;
    const pulse = reduceMotion ? 1 : 1 + Math.sin(state.time * (4 + (e.hatchT < 1.5 ? 10 : 0)) + e.id) * 0.06;
    ctx.globalAlpha = 0.35 * k;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(e.x, e.y + 0.2, 1.8, 0.6, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = k;
    ctx.fillStyle = e.flash > 0 ? "#ffffff" : "#b6c98a";
    ctx.beginPath();
    ctx.ellipse(e.x, e.y - 1.6, 1.5 * pulse, 1.9 * pulse, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#6a7a3a";
    ctx.lineWidth = 0.18;
    ctx.stroke();
    ctx.fillStyle = "#e8ff9a";
    ctx.globalAlpha = 0.6 * k;
    ctx.beginPath();
    ctx.arc(e.x - 0.4, e.y - 2.3, 0.4, 0, TAU);
    ctx.fill();
    if (!e.dead) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(e.x - 1.8, e.y - 4.4, 3.6, 0.4);
      ctx.fillStyle = "#c6e86a";
      ctx.fillRect(e.x - 1.8, e.y - 4.4, 3.6 * Math.max(0, e.hp / e.max), 0.4);
    }
    ctx.globalAlpha = 1;
  }

  function draw() {
    resize();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#05060a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sh = reduceMotion ? 0 : state.shake;
    const jx = Math.sin(state.time * 46) * sh * 0.35 * view.s;
    const jy = Math.cos(state.time * 33) * sh * 0.28 * view.s;
    ctx.setTransform(view.s, 0, 0, view.s, view.ox + jx, view.oy + jy);
    const region = regionOf(state.wave);
    ensureFxSprites();
    const ground = ensureTerrain(region);
    if (ground.canvas) ctx.drawImage(ground.canvas, ground.x0, ground.y0, ground.x1 - ground.x0, ground.y1 - ground.y0);
    drawTerrainLive(region);
    drawAura();
    drawPools();
    for (const p of patches) drawPatch(p);
    drawMarks();
    drawFireWall();
    for (const d of drops) if (d.fall <= 0) drawDrop(d);
    drawHolds();
    for (const e of enemies) {
      if (e.dead && e.dying <= 0) continue;
      if (e.egg) drawEgg(e);
      else drawEnemy(e);
    }
    drawBase();
    for (const b of bolts) {
      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(b.ox, b.oy);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = "#fff4dc";
      ctx.lineWidth = 0.22;
      ctx.beginPath();
      ctx.moveTo(b.ox, b.oy);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const p of lobs) drawLob(p);
    for (const p of spits) {
      ctx.fillStyle = "rgba(214,255,106,0.35)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eaff9a";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.55, 0, Math.PI * 2);
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
    for (const sw of sweeps) {
      ctx.globalAlpha = Math.max(0, sw.life / sw.max);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, sw.a0, sw.a1);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const ring of rings) {
      if (ring.hex) drawMagicRing(ring);
      else {
        ctx.globalAlpha = Math.max(0, ring.life / 0.4);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 0.32;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, Math.min(ring.max, ring.r), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    for (const u of units) {
      drawUnit(u);
      drawUnitStatus(u);
    }
    drawSurvivor();
    for (const d of drops) if (d.fall > 0) drawDrop(d);
    drawAbilityFx();
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
      ctx.font = "700 1.85px sans-serif";
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    if (state.tw.bloodmoon && (state.phase === "fight" || state.phase === "paused")) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "rgba(120,0,16,0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(glowSprite, 76, 5, 16, 16);
      ctx.fillStyle = "#ff4a4a";
      ctx.beginPath();
      ctx.arc(84, 13, 2.6, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (state.freezeT > 0) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "rgba(150,170,255," + Math.min(0.16, state.freezeT * 0.08) + ")";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    if (state.tw.fog && (state.phase === "fight" || state.phase === "paused")) drawFogOverlay(jx, jy);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    drawThreatBar();
    drawBossBar();
    if (state.banner && state.banner.life > 0) {
      ctx.globalAlpha = Math.min(1, state.banner.life * 2);
      ctx.fillStyle = "#f7f3ea";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 4px Passion One, Impact, sans-serif";
      ctx.fillText(state.banner.title, WORLD_W / 2, 8.2);
      if (state.banner.sub) {
        ctx.fillStyle = "#ffd36a";
        ctx.font = "700 2.2px Passion One, Impact, sans-serif";
        ctx.fillText("TWIST: " + state.banner.sub.toUpperCase(), WORLD_W / 2, 11.4);
      }
      ctx.globalAlpha = 1;
    }
  }

  function upEffect(id, lv) {
    if (!lv) return "Not built";
    if (id === "wall") return "Hits on the base are " + Math.round((WALL_CUT[lv] || 0) * 100) + "% softer";
    if (id === "aura") return AURA[lv] ? "Nearby dead move at " + Math.round(AURA[lv].slow * 100) + "% speed" : "Not built";
    if (id === "turret") return TURRET[lv] ? "Sentry hits for " + TURRET[lv].dmg : "Not built";
    if (id === "spikes") return "Biters take " + SPIKE_DMG[lv] + " when they hit";
    if (id === "mend") return "Gate heals " + MEND_RATE[lv] + " HP/s";
    if (id === "mines") return MINES[lv] ? "A mine every " + MINES[lv].every + "s" : "Not built";
    if (id === "ammo") return "Heroine damage x" + Math.pow(1.08, lv).toFixed(2);
    if (id === "squad") return "Squad cap " + (CAP + lv * 2);
    return "Not built";
  }

  function modLine() {
    const parts = [];
    for (const p of PERKS) {
      const c = state.mods[p.id] || 0;
      if (!c) continue;
      parts.push(c > 1 ? p.short + " x" + c : p.short);
    }
    return parts.join("  ·  ");
  }

  function announceHires() {
    if (state.phase !== "shop") return;
    if (state.wave >= 6 && !state.toldWren) {
      state.toldWren = true;
      state.toldSable = true;
      toast("Wren can be hired");
      return;
    }
    if (state.wave >= 4 && !state.toldSable) {
      state.toldSable = true;
      toast("Sable can be hired");
    }
  }

  function syncHud() {
    const hpNow = Math.max(0, Math.ceil(state.baseHp));
    $("hp").textContent = String(hpNow);
    $("hpLabel").textContent = "/" + state.baseMax + " HP";
    $("cash").textContent = String(state.cash);
    $("ash").textContent = String(meta.ash || 0);
    $("waveNum").textContent = String(state.wave);
    $("waveOf").textContent = "/ " + FINALE;
    const frac = state.baseMax > 0 ? Math.max(0, state.baseHp / state.baseMax) : 0;
    $("hpFill").style.transform = "scaleX(" + frac + ")";
    $("hpPill").classList.toggle("low", frac < 0.3);
    const spec = stageSpec(state.wave);
    $("waveName").textContent = spec.name;
    const tag = $("waveTag");
    if (spec.finale) { tag.textContent = "FINALE"; tag.className = "tag boss"; }
    else if (spec.boss) { tag.textContent = "BOSS"; tag.className = "tag boss"; }
    else if (spec.challenge) { tag.textContent = "CHALLENGE"; tag.className = "tag chal"; }
    else { tag.textContent = ""; tag.className = "tag"; }
    if (state.phase === "fight") {
      let left = state.spawnQ.length + spits.length;
      for (const e of enemies) if (!e.dead) left++;
      $("waveBlurb").textContent = left + " still in the stage";
    } else if (state.phase === "paused") $("waveBlurb").textContent = "Paused";
    else if (state.phase === "brief") $("waveBlurb").textContent = "Between stages";
    else if (state.phase === "won") $("waveBlurb").textContent = "The gate held.";
    else if (state.phase === "lost") $("waveBlurb").textContent = "The gate fell.";
    else if (state.phase === "shop") $("waveBlurb").textContent = spec.blurb;
    else $("waveBlurb").textContent = "";
    $("mods").textContent = modLine();
    const next = $("next");
    const canStart = state.phase === "shop" && state.runLive;
    next.disabled = !canStart;
    if (next.hidden === canStart) next.hidden = !canStart;
    const locked = state.phase === "won" || state.phase === "lost" || state.phase === "brief" || state.phase === "paused" || state.phase === "title" || state.phase === "pick";
    for (const id of ORDER) {
      const btn = rosterButtons[id];
      const cost = priceOf(id);
      const need = HEROES[id].unlock || 1;
      const gated = state.wave < need;
      btn.disabled = gated;
      btn.classList.toggle("locked", gated);
      btn.querySelector(".price").textContent = gated ? "Stage " + need : (state.sale ? "SALE $" + cost : "$" + cost);
      const owned = units.filter((u) => u.kind === id);
      const named = owned.some((u) => u.named);
      const extras = owned.length - (named ? 1 : 0);
      let own = "Not hired";
      if (named && extras) own = "Hero + " + extras + " lower rank";
      else if (named) own = "Hero on field";
      else if (extras) own = extras + " on field";
      const ownEl = btn.querySelector(".own");
      ownEl.textContent = own;
      ownEl.classList.toggle("has", owned.length > 0);
      btn.classList.toggle("broke", !gated && (locked || units.length >= squadCap() || state.cash < cost));
    }
    announceHires();
    for (const id of UP_IDS) {
      const btn = upButtons[id];
      const lv = state.ups[id];
      const up = BASE_UPS[id];
      const maxed = lv >= up.max;
      btn.querySelector(".lv").textContent = maxed ? "LV " + lv + "/" + up.max + " · MAX" : "LV " + lv + "/" + up.max + " · $" + up.costs[lv];
      btn.querySelector(".fx").textContent = upEffect(id, lv);
      btn.classList.toggle("maxed", maxed);
      btn.classList.toggle("broke", !maxed && (locked || state.cash < up.costs[lv]));
    }
    const paused = state.phase === "paused";
    const pb = $("pauseBtn");
    if (pb.classList.contains("on") !== paused) {
      pb.classList.toggle("on", paused);
      pb.setAttribute("aria-label", paused ? "Resume" : "Pause");
    }
    const sb = $("shopBtn");
    sb.disabled = !state.runLive || !(state.phase === "shop" || state.phase === "fight" || state.phase === "paused");
    if (shopOpen) {
      $("shopCash").textContent = String(state.cash);
      $("shopAsh").textContent = String(meta.ash || 0);
      $("squadCount").textContent = "Squad " + units.length + " / " + squadCap();
      $("shopKicker").textContent = (state.phase === "fight" ? "WAVE PAUSED" : "BETWEEN WAVES") + "  ·  STAGE " + state.wave;
      const tl = $("twistLine");
      const names = state.twists.map((id) => TWISTS[id].name + ": " + TWISTS[id].desc);
      const txt = names.length ? "TWIST  ·  " + names.join("  ·  ") : "";
      if (tl.textContent !== txt) tl.textContent = txt;
      if (tl.hidden === !!txt) tl.hidden = !txt;
    }
    syncAbilBar();
  }

  function toast(msg, ms) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), ms || 1500);
  }

  function unlock() {
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

  function pickTrack(avoid) {
    const pool = [];
    for (let i = 0; i < TRACKS.length; i++) {
      if (TRACKS[i] !== avoid) pool.push(TRACKS[i]);
    }
    const choices = pool.length ? pool : TRACKS;
    return choices[(Math.random() * choices.length) | 0];
  }

  function ensureMusicEl() {
    if (music) return music;
    music = new Audio();
    music.preload = "auto";
    music.loop = false;
    music.addEventListener("ended", () => {
      const next = pickTrack(musicSrc);
      cueTrack(next, true);
    });
    return music;
  }

  function cueTrack(src, autoplay) {
    const el = ensureMusicEl();
    musicSrc = src;
    el.src = src;
    el.volume = state.muted ? 0 : 0.5;
    if (!autoplay || state.muted || state.phase === "title" || state.phase === "paused") {
      el.pause();
      return;
    }
    const pending = el.play();
    if (pending && typeof pending.catch === "function") pending.catch(() => {});
  }

  function setMusicMuted(muted) {
    if (!music) return;
    music.volume = muted ? 0 : 0.5;
    if (muted) music.pause();
  }

  function startMusic() {
    if (state.muted) return;
    if (!music || !musicSrc) {
      cueTrack(pickTrack(""), true);
      return;
    }
    music.volume = 0.5;
    if (state.phase === "title" || state.phase === "paused") {
      music.pause();
      return;
    }
    const pending = music.play();
    if (pending && typeof pending.catch === "function") pending.catch(() => {});
  }

  function playTone(freq, when, dur, peak) {
    if (!audioCtx || state.muted) return;
    try {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const f = audioCtx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 1700;
      o.type = "sine";
      o.frequency.value = freq;
      const dest = audioCtx.destination;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + Math.min(0.12, dur * 0.25));
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.connect(f);
      f.connect(g);
      g.connect(dest);
      o.start(when);
      o.stop(when + dur + 0.02);
    } catch (err) { /* ignore */ }
  }

  function softTone() {
    const notes = [523.25, 622.25, 698.46, 783.99, 932.33];
    const freq = notes[(Math.random() * notes.length) | 0];
    playTone(freq, audioCtx.currentTime || 0, 2.8, 0.12);
  }

  function bossSting() {
    if (!audioCtx || state.muted) return;
    const now = audioCtx.currentTime || 0;
    playTone(196, now, 0.55, 0.16);
    playTone(155.56, now + 0.2, 0.7, 0.13);
    playTone(130.81, now + 0.4, 0.95, 0.11);
    playTone(880, now + 0.12, 0.32, 0.045);
  }

  let shotBusy = [];
  let groanAt = 0;

  function sfxOk() {
    return !!(audioCtx && !state.muted);
  }

  function reserveShot() {
    const now = audioCtx.currentTime || 0;
    let live = 0;
    const keep = [];
    for (let i = 0; i < shotBusy.length; i++) {
      if (shotBusy[i] > now) { keep.push(shotBusy[i]); live++; }
    }
    shotBusy = keep;
    if (live >= 8) return false;
    shotBusy.push(now + 0.16);
    return true;
  }

  function sfxEnv(g, when, dur, peak, attack) {
    const atk = Math.max(0.004, Math.min(attack == null ? Math.min(0.012, dur * 0.28) : attack, dur * 0.6));
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  }

  function sfxOsc(when, freq, dur, peak, type, dropTo, attack) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(Math.max(1, freq), when);
    if (dropTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, dropTo), when + dur);
    sfxEnv(g, when, dur, peak, attack);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(when);
    o.stop(when + dur + 0.02);
  }

  function ensureNoise() {
    if (noiseBuf || !audioCtx) return noiseBuf;
    try {
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noiseBuf = buf;
    } catch (err) { noiseBuf = null; }
    return noiseBuf;
  }

  function sfxNoise(when, dur, peak, filterType, freq, q, sweepTo, attack) {
    const buf = ensureNoise();
    if (!buf) {
      sfxOsc(when, freq > 1500 ? 1200 : 180, Math.min(0.1, dur), peak * 0.65, "triangle");
      return;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const f = audioCtx.createBiquadFilter();
    f.type = filterType;
    f.Q.value = q;
    if (sweepTo) {
      f.frequency.setValueAtTime(Math.max(30, freq), when);
      f.frequency.exponentialRampToValueAtTime(Math.max(30, sweepTo), when + dur);
    } else {
      f.frequency.value = freq;
    }
    const g = audioCtx.createGain();
    sfxEnv(g, when, dur, peak, attack);
    src.connect(f);
    f.connect(g);
    g.connect(audioCtx.destination);
    src.start(when);
    src.stop(when + dur + 0.02);
  }

  function playShot(kind) {
    if (!sfxOk() || !reserveShot()) return;
    const now = audioCtx.currentTime || 0;
    try {
      if (kind === "snipe") {
        sfxNoise(now, 0.028, 0.22, "highpass", 2800, 0.85);
        sfxOsc(now, 168, 0.07, 0.16, "sine", 52);
      } else if (kind === "blast") {
        sfxNoise(now, 0.15, 0.36, "lowpass", 360, 0.55);
        sfxOsc(now, 96, 0.1, 0.1, "triangle", 40);
      } else if (kind === "patch") {
        sfxNoise(now, 0.16, 0.3, "bandpass", 1680, 0.7, 420, 0.04);
      } else if (kind === "volley") {
        sfxOsc(now, 1880 + Math.random() * 160, 0.02, 0.14, "square");
        sfxNoise(now, 0.016, 0.06, "highpass", 4200, 0.8);
      } else if (kind === "cleave") {
        sfxOsc(now, 96, 0.11, 0.32, "sine", 46);
        sfxNoise(now, 0.05, 0.08, "lowpass", 240, 0.5);
      } else {
        sfxNoise(now, 0.04, 0.3, "highpass", 1800, 0.6);
      }
    } catch (err) { /* ignore */ }
  }

  function playGroan(deep) {
    if (!sfxOk()) return;
    const now = audioCtx.currentTime || 0;
    if (!deep && now < groanAt) return;
    if (!deep) groanAt = now + 0.7;
    try {
      const freq = deep ? rand(46, 64) : rand(70, 110);
      const dur = deep ? 0.22 : 0.14;
      sfxOsc(now, freq, dur, deep ? 0.09 : 0.072, "sawtooth");
      sfxNoise(now, dur, 0.028, "lowpass", 220, 0.6);
    } catch (err) { /* ignore */ }
  }

  function musicTick() {
    if (!music || !musicSrc) return;
    if (state.phase === "title" || state.phase === "paused") {
      if (!music.paused) music.pause();
      return;
    }
    const audible = state.phase === "shop" || state.phase === "fight" || state.phase === "brief" || state.phase === "won" || state.phase === "lost";
    if (!audible) return;
    if (state.muted) {
      music.volume = 0;
      if (!music.paused) music.pause();
      return;
    }
    music.volume = shopOpen ? 0.22 : 0.5;
    if (music.paused) {
      const pending = music.play();
      if (pending && typeof pending.catch === "function") pending.catch(() => {});
    }
  }

  function syncSoundLabels() {
    $("mute").classList.toggle("off", state.muted);
    $("mute").setAttribute("aria-label", state.muted ? "Sound off. Tap to turn on" : "Sound on. Tap to mute");
    $("titleMute").textContent = state.muted ? "SOUND OFF" : "SOUND ON";
  }

  function onMute() {
    state.muted = !state.muted;
    syncSoundLabels();
    if (state.muted) { setMusicMuted(true); return; }
    unlock();
    if (state.runLive && state.phase !== "title") startMusic();
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
    } else if (id === "cash") {
      state.cash += 45;
      state.earned += 45;
    }
  }

  function crateOfferCopy(kind) {
    if (kind === "scavenge") return { name: "Scavenge", desc: "+$40 cash" };
    if (kind === "mend") return { name: "Mend", desc: "Heal the gate 40 HP." };
    if ((state.ups.mines | 0) > 0) return { name: "Cache", desc: "Arm 2 extra yard mines." };
    return { name: "Cache", desc: "Yard Mines, level 1." };
  }

  function applyCrate(kind) {
    if (kind === "scavenge") {
      state.cash += 40;
      state.earned += 40;
      toast("Scavenge +$40");
      return;
    }
    if (kind === "mend") {
      state.baseHp = Math.min(state.baseMax, state.baseHp + 40);
      toast("Mend");
      return;
    }
    const lv = state.ups.mines | 0;
    if (lv > 0 && MINES[lv]) {
      state.armedMines = (state.armedMines | 0) + 2;
      state.armedCd = 0.35;
      toast("Cache armed 2 mines");
      return;
    }
    if (lv <= 0 && BASE_UPS.mines && MINES[1]) {
      state.ups.mines = 1;
      state.mineCd = MINES[1].every;
      toast("Yard Mines LV 1");
      return;
    }
    state.cash += 40;
    state.earned += 40;
    toast("Scavenge +$40");
  }

  function renderCrate() {
    const kinds = ["scavenge", "mend", "cache"];
    const kind = kinds[(Math.random() * kinds.length) | 0];
    state.crateOffer = kind;
    const copy = crateOfferCopy(kind);
    const box = $("ovChoices");
    box.innerHTML = "";
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice";
    const strong = document.createElement("b");
    strong.textContent = copy.name;
    const span = document.createElement("span");
    span.textContent = copy.desc;
    b.appendChild(strong);
    b.appendChild(span);
    b.addEventListener("click", () => {
      if (!state.crateDue || state.crateTaken) return;
      applyCrate(kind);
      state.crateTaken = true;
      b.disabled = true;
      b.classList.add("picked");
      $("ovBtn").disabled = false;
      blip(520, 0.07, "square", 0.03);
    });
    box.appendChild(b);
  }

  function rollPerks() {
    const pool = PERKS.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    return pool.slice(0, 3);
  }

  function renderPerks() {
    const box = $("ovChoices");
    box.innerHTML = "";
    const choices = rollPerks();
    state.offer = choices;
    for (const perk of choices) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      const strong = document.createElement("b");
      strong.textContent = perk.name;
      const span = document.createElement("span");
      span.textContent = perk.desc;
      b.appendChild(strong);
      b.appendChild(span);
      b.addEventListener("click", () => {
        if (state.perkPicked) return;
        applyPerk(perk.id);
        state.mods[perk.id] = (state.mods[perk.id] || 0) + 1;
        state.perkPicked = true;
        $("ovBtn").disabled = false;
        const kids = box.children;
        for (let i = 0; i < kids.length; i++) kids[i].disabled = true;
        b.disabled = false;
        b.classList.add("picked");
        toast(perk.name);
        blip(520, 0.07, "square", 0.03);
      });
      box.appendChild(b);
    }
  }

  function fillDebuts(list) {
    const box = $("ovDebut");
    box.innerHTML = "";
    if (!list.length) { box.hidden = true; return; }
    box.hidden = false;
    for (const d of list) {
      const row = document.createElement("div");
      row.className = "debut";
      const b = document.createElement("b");
      b.textContent = "New · " + d.name;
      const s = document.createElement("span");
      s.textContent = d.line;
      row.appendChild(b);
      row.appendChild(s);
      box.appendChild(row);
    }
  }

  function fillSummary() {
    const box = $("ovSummary");
    box.hidden = false;
    box.innerHTML = "";
    const rows = [
      [String(state.wave), "Stage reached"],
      [String(state.kills), "Kills"],
      ["$" + state.earned, "Cash earned"],
    ];
    for (const pair of rows) {
      const d = document.createElement("div");
      d.className = "sum";
      const b = document.createElement("b");
      b.textContent = pair[0];
      const s = document.createElement("span");
      s.textContent = pair[1];
      d.appendChild(b);
      d.appendChild(s);
      box.appendChild(d);
    }
  }

  function announceRegion(n) {
    if (n >= 51) {
      if (state.toldChapel) return false;
      state.toldChapel = true;
      state.toldMarsh = true;
      toast("The Chapel");
      state.banner = { title: "The Chapel", sub: "Shriekers, brutes, and gold elites.", life: 2.6 };
      return true;
    }
    if (n >= 21) {
      if (state.toldMarsh) return false;
      state.toldMarsh = true;
      toast("The Marsh");
      state.banner = { title: "The Marsh", sub: "Crawlers, spitters, and bloaters.", life: 2.6 };
      return true;
    }
    return false;
  }

  let lastSplash = 0;

  function setRandomSplash(ov) {
    let splash = 1 + Math.floor(Math.random() * SPLASH_COUNT);
    if (splash === lastSplash) splash = splash % SPLASH_COUNT + 1;
    lastSplash = splash;
    const file = "splash-" + String(splash).padStart(2, "0") + ".jpg";
    // Absolute URL: a relative url() inside a custom property resolves against css/style.css, not the page.
    const href = new URL("assets/splashes/" + file, document.baseURI).href;
    ov.querySelector(".panel").style.setProperty("--splash", 'url("' + href + '")');
  }

  function openBrief(withPerk, withCard) {
    const spec = stageSpec(state.wave);
    const entered = announceRegion(state.wave);
    const card = !!withCard;
    const perk = !card && !!withPerk;
    const crate = !perk && !card && !spec.boss && !spec.finale && Math.random() < 0.4;
    hideMenus();
    forceCloseShop();
    state.phase = "brief";
    state.perkDue = perk;
    state.perkPicked = !perk;
    state.crateDue = crate;
    state.crateTaken = !crate;
    state.crateOffer = "";
    state.cardDue = card;
    state.cardPicked = !card;
    const kind = spec.finale ? "FINALE" : spec.boss ? "BOSS" : spec.challenge ? "CHALLENGE" : "NEXT";
    if (entered && state.wave >= 51) $("ovKicker").textContent = "THE CHAPEL  ·  STAGE " + state.wave;
    else if (entered && state.wave >= 21) $("ovKicker").textContent = "THE MARSH  ·  STAGE " + state.wave;
    else $("ovKicker").textContent = "STAGE " + state.wave + "  ·  " + kind;
    $("ovTitle").textContent = spec.name;
    $("ovBody").textContent = spec.blurb;
    fillDebuts(debutsOn(state.wave));
    fillTwist();
    $("ovPerk").hidden = !perk && !crate && !card;
    if (card) $("ovPerk").textContent = "Boss down. Pick a reward card. It stays for the run.";
    else if (perk) $("ovPerk").textContent = "Pick one. It stays for the run.";
    else if (crate) $("ovPerk").textContent = "Supply crate. Tap once to take it. Free.";
    $("ovSummary").hidden = true;
    $("ovHint").hidden = false;
    $("ovHint").textContent = "Continue, gear up, then start the wave. It will not start on its own.";
    $("ovChoices").innerHTML = "";
    if (card) renderCards();
    else if (perk) renderPerks();
    else if (crate) renderCrate();
    $("ovBtn").hidden = false;
    $("ovBtn").disabled = perk || crate || (card && !state.cardPicked);
    $("ovBtn").textContent = "CONTINUE";
    $("ovRestart").hidden = false;
    bolts.length = 0;
    lobs.length = 0;
    patches.length = 0;
    $("pauseScreen").classList.add("hidden");
    const ov = $("overlay");
    ov.dataset.art = (spec.boss || spec.finale) ? "boss" : state.wave >= 51 ? "chapel" : state.wave >= 21 ? "marsh" : "yard";
    setRandomSplash(ov);
    ov.classList.add("splash");
    ov.classList.remove("hidden");
  }

  function clearSplashArt() {
    const ov = $("overlay");
    if (ov.classList.contains("hidden") || !ov.classList.contains("splash")) delete ov.dataset.art;
  }

  function dismissBrief() {
    if (state.phase !== "brief") return;
    if (state.perkDue && !state.perkPicked) return;
    if (state.crateDue && !state.crateTaken) return;
    if (state.cardDue && !state.cardPicked) return;
    state.phase = "shop";
    $("overlay").classList.add("hidden");
    clearSplashArt();
  }

  function showEnd(kind) {
    hideMenus();
    forceCloseShop();
    spits.length = 0;
    bolts.length = 0;
    lobs.length = 0;
    patches.length = 0;
    $("ovKicker").textContent = kind === "won" ? "CLEARED" : "BREACHED";
    $("ovTitle").textContent = kind === "won" ? "The gate holds" : "Gate breached";
    $("ovBody").textContent = kind === "won"
      ? "One hundred stages. The Graveking is down. The center is still yours."
      : "The center fell on stage " + state.wave + ", " + stageSpec(state.wave).name + ". +" + (state.lossAsh || 0) + " ash";
    $("ovDebut").hidden = true;
    $("ovDebut").innerHTML = "";
    $("ovTwist").hidden = true;
    $("ovTwist").innerHTML = "";
    $("ovPerk").hidden = true;
    $("ovChoices").innerHTML = "";
    $("ovHint").hidden = true;
    fillSummary();
    $("ovBtn").hidden = false;
    $("ovBtn").disabled = false;
    $("ovBtn").textContent = "PLAY AGAIN";
    $("ovRestart").hidden = true;
    $("pauseScreen").classList.add("hidden");
    const ov = $("overlay");
    ov.dataset.art = kind === "won" ? "boss" : "yard";
    setRandomSplash(ov);
    ov.classList.add("splash");
    ov.classList.remove("hidden");
  }

  function win() {
    if (state.phase === "won" || state.phase === "lost") return;
    state.phase = "won";
    showEnd("won");
  }

  function lose() {
    if (state.phase === "lost" || state.phase === "won") return;
    const ashGain = Math.max(4, Math.floor(state.wave * 0.5));
    meta.ash = (meta.ash || 0) + ashGain;
    saveMeta();
    state.lossAsh = ashGain;
    state.phase = "lost";
    state.baseHp = 0;
    showEnd("lost");
  }

  function resetRun() {
    const muted = state.muted;
    const live = state.runLive;
    units.length = 0;
    enemies.length = 0;
    bolts.length = 0;
    lobs.length = 0;
    patches.length = 0;
    flashes.length = 0;
    sweeps.length = 0;
    rings.length = 0;
    particles.length = 0;
    floaters.length = 0;
    spits.length = 0;
    marks.length = 0;
    pools.length = 0;
    drops.length = 0;
    fxs.length = 0;
    bursts.length = 0;
    drag = null;
    const next = freshState();
    next.muted = muted;
    next.runLive = live;
    Object.assign(state, next);
    applyMetaStats();
    addUnit("vera");
    addUnit("roxie");
    layoutHomes();
    syncSoundLabels();
    renderBuild();
  }

  function pickVeteranKind() {
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (u.named && u.kind !== "vera" && u.kind !== "roxie" && HEROES[u.kind]) return u.kind;
    }
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (u.kind !== "vera" && u.kind !== "roxie" && HEROES[u.kind]) return u.kind;
    }
    for (let i = 0; i < units.length; i++) {
      if (units[i].named && HEROES[units[i].kind]) return units[i].kind;
    }
    return "vera";
  }

  function applyMetaStats() {
    const gate = clamp(meta.gate || 0, 0, LAB_MAX);
    state.baseMax = BASE_HP0 + gate * 20;
    state.baseHp = state.baseMax;
    state.cash = START_CASH + gate * 2;
  }

  function hideMenus() {
    $("skillScreen").classList.add("hidden");
    $("labScreen").classList.add("hidden");
  }

  function requestRestart() {
    if (state.phase === "title" || !state.runLive) return;
    const confirm = $("restartConfirm");
    if (!confirm.classList.contains("hidden")) return;
    confirm.classList.remove("hidden");
  }

  function confirmRestart() {
    const confirm = $("restartConfirm");
    if (confirm.classList.contains("hidden")) return;
    confirm.classList.add("hidden");
    unlock();
    startRun();
  }

  function cancelRestart() {
    $("restartConfirm").classList.add("hidden");
  }

  function startRun(region) {
    let safe = "yard";
    const which = region || pickedRegion || "yard";
    if (which === "marsh" && meta.regions.marsh) safe = "marsh";
    if (which === "chapel" && meta.regions.chapel) safe = "chapel";
    pickedRegion = safe;
    resetRun();
    const startN = safe === "chapel" ? 51 : safe === "marsh" ? 21 : 1;
    state.wave = startN;
    setTwists(rollTwists(startN));
    state.startRegion = safe;
    state.runLive = true;
    if (startN >= 4) state.toldSable = true;
    if (startN >= 6) state.toldWren = true;
    state.mineCd = 2.6;
    if ((startN === 21 || startN === 51) && meta.veteran && meta.veteran !== "vera" && meta.veteran !== "roxie" && HEROES[meta.veteran]) {
      addUnit(meta.veteran);
      layoutHomes();
    }
    hideMenus();
    forceCloseShop();
    $("titleScreen").classList.add("hidden");
    $("overlay").classList.add("hidden");
    clearSplashArt();
    $("pauseScreen").classList.add("hidden");
    if (startN >= 51) announceRegion(startN);
    else if (startN >= 21) announceRegion(startN);
    else toast("Vera and Roxie hold the yard.");
  }

  function showTitle() {
    pickedRegion = "yard";
    state.phase = "title";
    state.runLive = false;
    if (music) music.pause();
    hideMenus();
    forceCloseShop();
    $("overlay").classList.add("hidden");
    clearSplashArt();
    $("pauseScreen").classList.add("hidden");
    $("titleScreen").classList.remove("hidden");
    renderRegions();
  }

  function enterPause() {
    if (state.phase !== "fight" && state.phase !== "shop") return;
    hideMenus();
    state.pausedFrom = state.phase;
    state.phase = "paused";
    $("pauseScreen").classList.remove("hidden");
  }

  function togglePause() {
    if (shopOpen) {
      // Pausing from inside the shop: fold the shop away and land on the pause screen.
      const stayPaused = shopFromPause;
      closeShop();
      if (!stayPaused) enterPause();
      return;
    }
    if (state.phase === "paused") {
      state.phase = state.pausedFrom || "fight";
      state.pausedFrom = null;
      $("pauseScreen").classList.add("hidden");
      return;
    }
    enterPause();
  }

  function setShopUi(open) {
    $("shopPanel").classList.toggle("hidden", !open);
    const sb = $("shopBtn");
    sb.classList.toggle("on", open);
    sb.setAttribute("aria-expanded", open ? "true" : "false");
    sb.setAttribute("aria-label", open ? "Close shop" : "Open shop");
    sb.querySelector(".lbl").textContent = open ? "CLOSE" : "SHOP";
  }

  function openShop() {
    if (shopOpen || !state.runLive) return;
    if (!$("restartConfirm").classList.contains("hidden")) return;
    if (state.phase === "paused") {
      // Opened from the pause screen: shop with the run frozen, and go back to paused on close.
      const from = state.pausedFrom || "fight";
      if (from !== "fight" && from !== "shop") return;
      state.phase = from;
      state.pausedFrom = null;
      $("pauseScreen").classList.add("hidden");
      shopFromPause = true;
    } else if (state.phase === "fight" || state.phase === "shop") {
      shopFromPause = false;
    } else {
      return;
    }
    shopOpen = true;
    drag = null;
    renderBuild();
    setShopUi(true);
    $("shopDone").textContent = shopFromPause ? "CLOSE · STAY PAUSED" : state.phase === "fight" ? "CLOSE · RESUME" : "CLOSE";
    const scroller = document.querySelector("#shopPanel .shopScroll");
    if (scroller) scroller.scrollTop = 0;
    syncHud();
    blip(420, 0.05, "triangle", 0.025);
  }

  function closeShop() {
    if (!shopOpen) return;
    hideMenus();
    shopOpen = false;
    setShopUi(false);
    if (shopFromPause) {
      shopFromPause = false;
      if (state.phase === "fight" || state.phase === "shop") {
        state.pausedFrom = state.phase;
        state.phase = "paused";
        $("pauseScreen").classList.remove("hidden");
      }
    }
  }

  function forceCloseShop() {
    shopOpen = false;
    shopFromPause = false;
    setShopUi(false);
  }

  function toggleShop() {
    if (shopOpen) closeShop();
    else openShop();
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
      const img = document.createElement("img");
      img.className = "face";
      img.alt = "";
      img.draggable = false;
      img.onerror = () => { img.style.display = "none"; };
      img.src = "assets/" + id + ".png";
      const metaEl = document.createElement("span");
      metaEl.className = "meta";
      const name = document.createElement("b");
      name.textContent = JOBS[id] || h.short;
      const small = document.createElement("small");
      small.textContent = h.short;
      const price = document.createElement("em");
      price.className = "price";
      const own = document.createElement("i");
      own.className = "own";
      metaEl.appendChild(name);
      metaEl.appendChild(small);
      metaEl.appendChild(price);
      metaEl.appendChild(own);
      b.appendChild(img);
      b.appendChild(metaEl);
      b.addEventListener("click", () => buy(id));
      root.appendChild(b);
      rosterButtons[id] = b;
    }
  }

  function buildUps() {
    const root = $("baseShop");
    root.innerHTML = "";
    for (const id of UP_IDS) {
      const up = BASE_UPS[id];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "up";
      b.dataset.id = id;
      const label = { wall: "Wall", aura: "Aura", turret: "Turret", spikes: "Spikes", mend: "Mend", mines: "Mines", ammo: "Ammo", squad: "Squad" }[id] || up.name;
      b.title = up.blurb;
      b.innerHTML = '<span class="mark">' + up.mark + '</span><span class="meta"><b>' + label +
        '</b><em class="lv"></em><i class="fx"></i></span>';
      b.addEventListener("click", () => buyUp(id));
      root.appendChild(b);
      upButtons[id] = b;
    }
  }

  function renderRegions() {
    const row = $("regionRow");
    if (!row) return;
    const options = [{ id: "yard", name: "The Yard" }];
    if (meta.regions.marsh) options.push({ id: "marsh", name: "The Marsh" });
    if (meta.regions.chapel) options.push({ id: "chapel", name: "The Chapel" });
    row.innerHTML = "";
    if (options.length < 2) {
      row.hidden = true;
      renderVeteran();
      return;
    }
    row.hidden = false;
    renderVeteran();
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "regionPick" + (opt.id === pickedRegion ? " on" : "");
      b.textContent = opt.name;
      b.addEventListener("click", () => {
        pickedRegion = opt.id;
        renderRegions();
      });
      row.appendChild(b);
    }
  }

  function renderVeteran() {
    const el = $("veteranLine");
    if (!el) return;
    const kind = meta.veteran;
    const hero = kind && HEROES[kind];
    if (!hero) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = "Veteran: " + hero.name;
  }

  function renderSkills() {
    const box = $("skillList");
    box.innerHTML = "";
    for (const id of ORDER) {
      const hero = HEROES[id];
      const hired = units.some((u) => u.kind === id);
      const open = state.wave >= (hero.unlock || 1);
      if (!hired && !open) continue;
      const rank = (state.skills && state.skills[id]) || 0;
      const picked = (state.fork && state.fork[id]) || "";
      const card = document.createElement("div");
      card.className = "skillCard";
      const title = document.createElement("b");
      title.textContent = hero.short + (hired ? "" : "  ·  not hired");
      card.appendChild(title);
      const nodes = document.createElement("div");
      nodes.className = "skillNodes";
      const tree = SKILL_NODES[id];
      const first = document.createElement("div");
      first.className = rank >= 1 ? "got" : "";
      first.textContent = "1. " + tree[0].name + " — " + tree[0].blurb + " (" + (rank >= 1 ? "owned" : "$" + SKILL_COST[0]) + ")";
      nodes.appendChild(first);
      const forkRow = document.createElement("div");
      forkRow.className = "skillFork";
      const keys = ["range", "tempo"];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const spec = SKILL_FORK[key];
        const chosen = picked === key;
        const lockedOut = rank >= 2 && !chosen;
        if (rank === 1) {
          const forkBtn = document.createElement("button");
          forkBtn.type = "button";
          forkBtn.className = "miniBuy forkBtn";
          forkBtn.textContent = spec.name + " · " + spec.blurb + " · $" + SKILL_COST[1];
          forkBtn.disabled = !canShop() || state.cash < SKILL_COST[1];
          forkBtn.addEventListener("click", () => buySkill(id, key));
          forkRow.appendChild(forkBtn);
        } else {
          const line = document.createElement("div");
          line.className = "forkOpt" + (chosen ? " got" : "") + (lockedOut ? " locked" : "");
          const tag = chosen ? "owned" : lockedOut ? "locked" : "or $" + SKILL_COST[1];
          line.textContent = spec.name + " — " + spec.blurb + " (" + tag + ")";
          forkRow.appendChild(line);
        }
      }
      nodes.appendChild(forkRow);
      const sig = document.createElement("div");
      sig.className = rank >= 3 ? "got" : "";
      sig.textContent = "3. " + tree[2].name + " — " + tree[2].blurb + " (" + (rank >= 3 ? "owned" : "$" + SKILL_COST[2]) + ")";
      nodes.appendChild(sig);
      card.appendChild(nodes);
      if (rank !== 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "miniBuy";
        if (rank >= 3) {
          btn.disabled = true;
          btn.textContent = "MAXED";
        } else if (rank === 0) {
          btn.textContent = "BUY " + tree[0].name + "  ·  $" + SKILL_COST[0];
          btn.disabled = !canShop() || state.cash < SKILL_COST[0];
          btn.addEventListener("click", () => buySkill(id));
        } else {
          btn.textContent = "BUY " + tree[2].name + "  ·  $" + SKILL_COST[2];
          btn.disabled = !canShop() || state.cash < SKILL_COST[2];
          btn.addEventListener("click", () => buySkill(id));
        }
        card.appendChild(btn);
      }
      box.appendChild(card);
    }
    if (!box.children.length) {
      const empty = document.createElement("p");
      empty.textContent = "Nobody to train yet.";
      box.appendChild(empty);
    }
  }

  function buySkill(kind, forkKey) {
    if (!canShop()) { toast("Not during this screen"); return; }
    const rank = (state.skills && state.skills[kind]) || 0;
    if (rank >= 3) return;
    if (rank === 1) {
      if (forkKey !== "range" && forkKey !== "tempo") return;
      if (state.fork && state.fork[kind]) return;
    }
    const cost = SKILL_COST[rank];
    if (state.cash < cost) { toast("Need $" + cost); return; }
    state.cash -= cost;
    if (rank === 1) state.fork[kind] = forkKey;
    state.skills[kind] = rank + 1;
    const nodeName = rank === 1 ? SKILL_FORK[forkKey].name : SKILL_NODES[kind][rank].name;
    toast(HEROES[kind].short + " · " + nodeName);
    blip(480, 0.06, "triangle", 0.03);
    renderSkills();
  }

  function renderLab() {
    const box = $("labList");
    box.innerHTML = "";
    const ash = document.createElement("p");
    ash.className = "ashLine";
    ash.textContent = meta.ash + " ash";
    box.appendChild(ash);
    for (let i = 0; i < LAB_TRACKS.length; i++) {
      const track = LAB_TRACKS[i];
      const lv = meta[track.id] || 0;
      const card = document.createElement("div");
      card.className = "skillCard";
      const title = document.createElement("b");
      title.textContent = track.name + "  ·  LV " + lv + " / " + LAB_MAX;
      card.appendChild(title);
      const blurb = document.createElement("p");
      blurb.textContent = track.blurb;
      card.appendChild(blurb);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "miniBuy";
      if (lv >= LAB_MAX) {
        btn.disabled = true;
        btn.textContent = "MAXED";
      } else {
        const cost = labCost(lv);
        btn.textContent = "BUY  ·  " + cost + " ASH";
        btn.disabled = meta.ash < cost;
        btn.addEventListener("click", () => buyLab(track.id));
      }
      card.appendChild(btn);
      box.appendChild(card);
    }
  }

  function buyLab(id) {
    const lv = meta[id] || 0;
    if (lv >= LAB_MAX) return;
    const cost = labCost(lv);
    if ((meta.ash || 0) < cost) { toast("Need " + cost + " ash"); return; }
    meta.ash -= cost;
    meta[id] = lv + 1;
    saveMeta();
    let label = id;
    for (let i = 0; i < LAB_TRACKS.length; i++) if (LAB_TRACKS[i].id === id) label = LAB_TRACKS[i].name;
    toast(label + " LV " + meta[id]);
    blip(360, 0.07, "triangle", 0.03);
    renderLab();
  }

  function openSkills() {
    if (state.phase === "title" || state.phase === "won" || state.phase === "lost" || state.phase === "brief") return;
    $("labScreen").classList.add("hidden");
    renderSkills();
    $("skillScreen").classList.remove("hidden");
  }

  function openLab() {
    $("skillScreen").classList.add("hidden");
    renderLab();
    $("labScreen").classList.remove("hidden");
  }

  // ---------- Ability strip (outside the field) ----------
  const abilButtons = {};
  let abilKey = "";
  let tagKey = "";

  function hiredKinds() {
    const out = [];
    for (const k of ORDER) if (units.some((u) => u.kind === k)) out.push(k);
    return out;
  }

  function buildAbilBar(kinds) {
    const row = $("abilRow");
    row.innerHTML = "";
    for (const k in abilButtons) delete abilButtons[k];
    for (const k of kinds) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "abil";
      b.dataset.kind = k;
      b.style.setProperty("--ac", HEROES[k].accent);
      b.setAttribute("aria-label", HEROES[k].short + ": " + ABILITIES[k].name + " (key " + (ORDER.indexOf(k) + 1) + ")");
      b.title = HEROES[k].short + " · " + ABILITIES[k].name + " — " + ABILITIES[k].desc;
      const img = document.createElement("img");
      img.src = "assets/" + k + ".png";
      img.alt = "";
      img.draggable = false;
      const cd = document.createElement("i");
      cd.className = "cd";
      const key = document.createElement("span");
      key.className = "k";
      key.textContent = String(ORDER.indexOf(k) + 1);
      b.appendChild(img);
      b.appendChild(cd);
      b.appendChild(key);
      b.addEventListener("pointerdown", (ev) => { ev.preventDefault(); unlock(); fireAbilityButton(k); });
      b.addEventListener("click", (ev) => ev.preventDefault());
      row.appendChild(b);
      abilButtons[k] = { btn: b, cd: cd, p: -1, cls: "" };
    }
  }

  function fireAbilityButton(kind) {
    const slot = abilButtons[kind];
    if (!useAbility(kind)) {
      if (slot && state.phase === "fight" && !shopOpen && state.abil[kind] > 0) toast(ABILITIES[kind].name + " ready in " + Math.ceil(state.abil[kind]) + "s", 700);
      return false;
    }
    if (slot) {
      slot.btn.classList.remove("fired");
      void slot.btn.offsetWidth;
      slot.btn.classList.add("fired");
    }
    return true;
  }

  function syncAbilBar() {
    const bar = $("abilBar");
    const show = state.runLive && state.phase !== "title";
    if (bar.hidden === show) bar.hidden = !show;
    if (!show) return;
    const kinds = hiredKinds();
    const key = kinds.join(",");
    if (key !== abilKey) { abilKey = key; buildAbilBar(kinds); }
    const live = state.phase === "fight" && !shopOpen;
    for (const k of kinds) {
      const slot = abilButtons[k];
      if (!slot) continue;
      const left = state.abil[k] || 0;
      const max = state.abilMax[k] || abilityCd(k);
      const p = left > 0 ? Math.round((left / max) * 100) / 100 : 0;
      if (p !== slot.p) { slot.p = p; slot.cd.style.setProperty("--p", String(p)); }
      const cls = !live ? "idle" : left > 0 ? "cool" : "ready";
      if (cls !== slot.cls) {
        slot.cls = cls;
        slot.btn.classList.toggle("ready", cls === "ready");
        slot.btn.classList.toggle("idle", cls === "idle");
        slot.btn.disabled = cls === "idle";
      }
    }
    const spec = stageSpec(state.wave);
    const boss = spec.boss ? BOSS_KINDS[bossKindFor(state.wave)].name : "";
    const tkey = state.twists.join(",") + "|" + boss;
    if (tkey !== tagKey) {
      tagKey = tkey;
      const box = $("twistTags");
      box.innerHTML = "";
      if (boss) {
        const t = document.createElement("span");
        t.className = "twTag boss";
        t.style.setProperty("--tw", "#c49bff");
        t.textContent = boss;
        box.appendChild(t);
      }
      for (const id of state.twists) {
        const t = document.createElement("span");
        t.className = "twTag";
        t.style.setProperty("--tw", TWISTS[id].color);
        t.textContent = TWISTS[id].name;
        t.title = TWISTS[id].desc + " " + TWISTS[id].pay;
        box.appendChild(t);
      }
    }
  }

  // ---------- Drag to move ----------
  function worldFromEvent(ev) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / Math.max(1, rect.width);
    const sy = canvas.height / Math.max(1, rect.height);
    const px = (ev.clientX - rect.left) * sx;
    const py = (ev.clientY - rect.top) * sy;
    return { x: (px - view.ox) / view.s, y: (py - view.oy) / view.s, px: ev.clientX, py: ev.clientY };
  }

  function unitAt(wx, wy) {
    let best = null, bd = 8.5;
    for (const u of units) {
      const cy = u.y - heroHeight(u) * 0.45;
      const d = Math.hypot(wx - u.x, (wy - cy) * 0.7);
      if (d < bd) { bd = d; best = u; }
    }
    return best;
  }

  function clampHold(x, y) {
    let px = clamp(x, 3, WORLD_W - 3);
    let py = clamp(y, 4, WORLD_H - 3);
    const bx = px - BASE.x, by = py - BASE.y;
    const bd = Math.hypot(bx, by);
    const minR = BASE.r + 4;
    if (bd < minR) {
      const k = bd < 0.001 ? 1 : minR / bd;
      px = BASE.x + (bd < 0.001 ? minR : bx * k);
      py = BASE.y + (bd < 0.001 ? 0 : by * k);
    }
    return { x: px, y: py };
  }

  function fieldInputOk() {
    if (shopOpen || !state.runLive) return false;
    if (state.phase !== "fight" && state.phase !== "shop") return false;
    if (!$("restartConfirm").classList.contains("hidden")) return false;
    return true;
  }

  canvas.addEventListener("pointerdown", (ev) => {
    if (ev.button != null && ev.button > 0) return;
    ev.preventDefault();
    unlock();
    if (!fieldInputOk()) return;
    const w = worldFromEvent(ev);
    if (state.phase === "fight" && tapPickup(w.x, w.y)) return;
    const u = unitAt(w.x, w.y);
    if (!u) return;
    const now = performance.now();
    if (lastTap.id === u.id && now - lastTap.t < 360) {
      lastTap = { id: 0, t: 0 };
      if (u.hold) {
        u.hold = null;
        if (floaters.length < 24) floaters.push({ x: u.x, y: u.y - heroHeight(u) - 1, text: "FREE", life: 0.8, color: "#c8ffda" });
        blip(520, 0.06, "triangle", 0.025);
      }
      drag = null;
      return;
    }
    lastTap = { id: u.id, t: now };
    drag = { id: u.id, pid: ev.pointerId, ox: u.x - w.x, oy: u.y - w.y, x: u.x, y: u.y, sx: w.px, sy: w.py, moved: false };
    try { canvas.setPointerCapture(ev.pointerId); } catch (err) { /* fine */ }
  }, { passive: false });

  canvas.addEventListener("pointermove", (ev) => {
    if (!drag || ev.pointerId !== drag.pid) return;
    ev.preventDefault();
    if (!fieldInputOk()) { drag = null; return; }
    const w = worldFromEvent(ev);
    if (!drag.moved && Math.hypot(w.px - drag.sx, w.py - drag.sy) > 9) drag.moved = true;
    const p = clampHold(w.x + drag.ox, w.y + drag.oy);
    drag.x = p.x;
    drag.y = p.y;
  }, { passive: false });

  function endDrag(ev, commit) {
    if (!drag || ev.pointerId !== drag.pid) return;
    ev.preventDefault();
    const d = drag;
    drag = null;
    try { canvas.releasePointerCapture(ev.pointerId); } catch (err) { /* fine */ }
    if (!commit || !d.moved || !fieldInputOk()) return;
    const u = units.find((x) => x.id === d.id);
    if (!u) return;
    u.hold = { x: d.x, y: d.y };
    lastTap = { id: 0, t: 0 };
    blip(380, 0.05, "triangle", 0.022);
  }
  canvas.addEventListener("pointerup", (ev) => endDrag(ev, true), { passive: false });
  canvas.addEventListener("pointercancel", (ev) => endDrag(ev, false), { passive: false });
  canvas.addEventListener("contextmenu", (ev) => ev.preventDefault());
  canvas.addEventListener("touchstart", (ev) => { if (ev.cancelable) ev.preventDefault(); }, { passive: false });
  canvas.addEventListener("touchmove", (ev) => { if (ev.cancelable) ev.preventDefault(); }, { passive: false });

  $("play").addEventListener("click", () => {
    unlock();
    startRun(pickedRegion);
    if (audioCtx && audioCtx.state === "suspended") {
      const pending = audioCtx.resume();
      if (pending && typeof pending.catch === "function") pending.catch(() => {});
    }
    startMusic();
  });
  $("titleMute").addEventListener("click", () => { unlock(); onMute(); });
  $("next").addEventListener("click", () => {
    unlock();
    if (shopOpen) closeShop();
    startWave();
  });
  $("shopBtn").addEventListener("click", () => { unlock(); toggleShop(); });
  $("shopClose").addEventListener("click", () => closeShop());
  $("shopDone").addEventListener("click", () => closeShop());
  $("shopPanel").addEventListener("click", (ev) => { if (ev.target === $("shopPanel")) closeShop(); });
  $("pauseShop").addEventListener("click", () => { unlock(); openShop(); });
  $("restart").addEventListener("click", () => {
    unlock();
    requestRestart();
  });
  $("ovBtn").addEventListener("click", () => {
    unlock();
    if (state.phase === "brief") dismissBrief();
    else if (state.phase === "won" || state.phase === "lost") showTitle();
  });
  $("ovRestart").addEventListener("click", () => { unlock(); requestRestart(); });
  $("restartConfirmYes").addEventListener("click", () => confirmRestart());
  $("restartConfirmNo").addEventListener("click", () => cancelRestart());
  $("pauseBtn").addEventListener("click", () => togglePause());
  $("resumeBtn").addEventListener("click", () => togglePause());
  $("pauseRestart").addEventListener("click", () => {
    unlock();
    requestRestart();
  });
  $("mute").addEventListener("click", () => { unlock(); onMute(); });
  $("skillsBtn").addEventListener("click", () => { unlock(); openSkills(); });
  $("labBtn").addEventListener("click", () => { unlock(); openLab(); });
  $("titleLab").addEventListener("click", () => { unlock(); openLab(); });
  $("skillClose").addEventListener("click", () => { $("skillScreen").classList.add("hidden"); });
  $("labClose").addEventListener("click", () => { $("labScreen").classList.add("hidden"); });
  document.addEventListener("pointerdown", (ev) => {
    unlock();
    if (state.muted || !state.runLive) return;
    const title = $("titleScreen");
    if (title && !title.classList.contains("hidden") && title.contains(ev.target)) return;
    startMusic();
  }, { passive: true });
  window.addEventListener("keydown", (ev) => {
    if (ev.repeat) return;
    if (ev.target && ev.target.tagName === "BUTTON" && (ev.key === " " || ev.code === "Space")) return;
    if (ev.key === "Escape") {
      if (!$("restartConfirm").classList.contains("hidden")) { cancelRestart(); return; }
      if (!$("labScreen").classList.contains("hidden") || !$("skillScreen").classList.contains("hidden")) { hideMenus(); return; }
      if (shopOpen) { closeShop(); return; }
      togglePause();
      return;
    }
    if (ev.key === "b" || ev.key === "B" || ev.key === "u" || ev.key === "U") { unlock(); toggleShop(); return; }
    if (ev.key === " " || ev.code === "Space") {
      ev.preventDefault();
      if (shopOpen) {
        if (shopFromPause || state.phase !== "shop") return;
        closeShop();
      }
      startWave();
    }
    else if (state.phase === "fight" && !shopOpen && ev.key >= "1" && ev.key <= "6") fireAbilityButton(ORDER[+ev.key - 1]);
    else if (ev.key === "1") buy("vera");
    else if (ev.key === "2") buy("roxie");
    else if (ev.key === "3") buy("lila");
    else if (ev.key === "4") buy("nyx");
    else if (ev.key === "5") buyUp("wall");
    else if (ev.key === "6") buyUp("aura");
    else if (ev.key === "7") buyUp("turret");
    else if (ev.key === "r" || ev.key === "R") { requestRestart(); }
    else if (ev.key === "m" || ev.key === "M") onMute();
    else if (ev.key === "p" || ev.key === "P") togglePause();
  });
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => resize()).observe(stage);
  else window.addEventListener("resize", resize);

  loadSprites();
  buildRoster();
  buildUps();
  renderRegions();
  syncSoundLabels();

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
