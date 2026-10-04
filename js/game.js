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
    { stage: 10, type: "boss", name: "Graveking", line: "The Graveking. A boss. He does not come alone." },
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
    10: { name: "Graveking", blurb: "Boss: the Graveking and his court." },
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
    if (n % 10 === 0) return "Graveking";
    if (EARLY_META[n]) return EARLY_META[n].name;
    const i = n - 11;
    return NAME_A[i % NAME_A.length] + " " + NAME_B[(i * 7) % NAME_B.length];
  }

  function describe(n, groups) {
    if (n === FINALE) return "Finale. The Graveking comes for the yard, and he brings everyone.";
    if (EARLY_META[n]) return EARLY_META[n].blurb;
    const bits = [];
    const debut = debutsOn(n);
    if (debut.length) {
      const lines = [];
      for (const d of debut) lines.push(d.line);
      bits.push(lines.join(" "));
    }
    if (n % 10 === 0) bits.push("The Graveking again, with a thicker court.");
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
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const canvas = $("game");
  const ctx = canvas.getContext("2d");
  const stage = $("stage");

  // Field art is the cutout PNGs (real alpha). Drawn whole with drawSprite.
  //   assets/vera-sprite.png assets/roxie-sprite.png assets/lila-sprite.png assets/nyx-sprite.png
  //   assets/zombie-sprite.png assets/zombie-brute-sprite.png assets/boss-sprite.png
  //   assets/base-sprite.png assets/upgrade-wall-sprite.png assets/upgrade-aura-sprite.png assets/upgrade-turret-sprite.png
  // Walk sheets are 4-frame strips. Missing sheets fall back to the static sprite, then the drawn backup.
  const sprites = {};
  const walks = {};
  const WALK_FRAMES = 4;
  function loadSprites() {
    const files = [
      ["vera", "assets/vera-sprite.png"],
      ["roxie", "assets/roxie-sprite.png"],
      ["lila", "assets/lila-sprite.png"],
      ["nyx", "assets/nyx-sprite.png"],
      ["sable", "assets/sable-sprite.png"],
      ["wren", "assets/wren-sprite.png"],
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
    };
  }
  const state = freshState();
  state.phase = "title";

  const SPECKS = Array.from({ length: 70 }, (_, i) => ({
    x: ((i * 53) % 997) / 997 * WORLD_W,
    y: ((i * 97) % 991) / 991 * WORLD_H,
    r: 0.12 + (i % 4) * 0.08,
    a: 0.1 + (i % 5) * 0.04,
  }));

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
    return {
      kind: h.attack,
      accent: h.accent,
      dmg: h.dmg * low * state.dmgMult * skillDmg * labDmg * ammoDmg,
      range: range,
      rate: h.rate * (u.named ? 1 : 0.9) * state.rateMult * skillRate * labRate,
      move: h.move * (u.named ? 1 : 0.92) * state.moveMult,
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
    const side = (Math.random() * 4) | 0;
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

  function spawnEnemy(type, elite) {
    const proto = ENEMIES[type];
    if (!proto) return;
    const spec = stageSpec(state.wave);
    const p = edgePoint();
    const mul = proto.boss ? spec.bossHp : spec.hpMul;
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
    };
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
    if (proto.boss && state.wave === FINALE) foe.r *= 1.1;
    enemies.push(foe);
    state.spawned++;
    playGroan(!!proto.boss);
  }

  function startWave() {
    if (state.phase !== "shop") return;
    const spec = stageSpec(state.wave);
    state.phase = "fight";
    state.fightT = 0;
    state.sent = true;
    state.spawnQ = [];
    for (const g of spec.groups) {
      for (let i = 0; i < g.n; i++) {
        state.spawnQ.push({ t: 0.35 + (g.delay || 0) + i * g.every, type: g.type, elite: false });
      }
    }
    state.spawnQ.sort((a, b) => a.t - b.t);
    markElites(state.spawnQ, state.wave);
    const kind = spec.finale ? "FINALE" : spec.boss ? "BOSS" : spec.challenge ? "CHALLENGE" : "STAGE";
    toast(kind + " " + state.wave + " — " + spec.name);
    state.banner = { title: spec.name, sub: spec.blurb, life: 2.3 };
    if (spec.boss) bossSting();
    else blip(170, 0.09, "square", 0.03);
  }

  function hurtEnemy(e, raw) {
    if (!e || e.dead || state.phase !== "fight") return;
    const dealt = raw * (1 - (e.armor || 0));
    if (dealt <= 0) return;
    e.hp -= dealt;
    e.flash = 0.18;
    if (e.hp <= 0) killEnemy(e);
  }

  function killEnemy(e) {
    if (!e || e.dead) return;
    e.dead = true;
    e.hp = 0;
    e.dyingMax = reduceMotion ? 0.16 : 0.42;
    e.dying = e.dyingMax;
    state.cash += e.reward;
    state.earned += e.reward;
    state.kills++;
    if (e.bloater) {
      const dist = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      burst(e.x, e.y, "#e39a45", 16, 7);
      rings.push({ x: e.x, y: e.y, r: 0.4, max: e.explodeR, life: 0.4, color: "#ffb15a" });
      if (dist <= e.explodeR) hurtBase(e.explode);
    }
    burst(e.x, e.y, e.elite ? "#ffd56a" : e.boss ? "#d7c4ff" : "#8a9474", e.boss ? 14 : 6, e.boss ? 7 : 4.5);
    if (floaters.length < 24) {
      floaters.push({ x: e.x, y: e.y - e.r, text: "+$" + e.reward, life: 0.78, color: "#ffc857" });
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
      const capHit = s.cap || 4;
      const n = Math.min(capHit, victims.length);
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
        bolts.push({ x: bx, y: by, ox: bx, oy: by, targetId: target.id, dmg: s.dmg, color: s.accent });
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
          hurtEnemy(e, s.dmg * mult);
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
      u.step = 0;
      const target = fighting ? pickTarget(u, s) : null;
      u.combat = !!target;
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

  function updateEnemies(dt) {
    const howlers = [];
    for (const e of enemies) if (!e.dead && e.shrieker) howlers.push(e);
    for (const e of enemies) {
      if (e.dead) continue;
      e.flash = Math.max(0, e.flash - dt);
      e.stunT = Math.max(0, e.stunT - dt);
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.slowFactor = 1;
      }
      if (e.spitter && e.stunT <= 0) e.spitCd -= dt;
      const dx = BASE.x - e.x;
      const dy = BASE.y - e.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      if (dist < state.closest) state.closest = dist;
      const stop = BASE.r + e.r * 0.62;
      const pace = (e.stunT > 0 ? 0 : e.slowFactor) * auraMul(e) * shriekMul(e, howlers);
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
        if (e.stunT <= 0) {
          e.biteCd -= dt;
          if (e.biteCd <= 0) {
            e.biteCd = e.biteEvery;
            e.lunge = 1;
            const spike = SPIKE_DMG[state.ups.spikes] || 0;
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
    for (const p of patches) {
      p.life -= dt;
      for (const e of enemies) {
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) <= p.r + e.r * 0.35) hurtEnemy(e, p.dps * dt);
      }
    }
  }

  function updateSpits(dt) {
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

  function detonateMine(spec) {
    let best = null;
    let bestD = spec.range;
    for (const e of enemies) {
      if (e.dead) continue;
      const d = Math.hypot(e.x - BASE.x, e.y - BASE.y);
      if (d < bestD) { bestD = d; best = e; }
    }
    if (!best) return false;
    hurtEnemy(best, spec.dmg);
    rings.push({ x: best.x, y: best.y, r: 0.3, max: 2.4, life: 0.22, color: "#ff5d6c" });
    burst(best.x, best.y, "#ff5d6c", 6, 5);
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
      state.turretFlash = 0.08;
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
    let msg = "Stage " + cleared + " down +$" + bonus + " +" + ashGain + " ash";
    if (specCleared.challenge) msg += "  challenge +$35";
    toast(msg);
    blip(240, 0.08, "sine", 0.03);
    if (cleared >= FINALE) { win(); return; }
    state.wave = cleared + 1;
    openBrief(cleared % 3 === 0);
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
        spawnEnemy(job.type, job.elite);
      }
      updateEnemies(dt);
      if (state.phase === "fight") updateSpits(dt);
      if (state.phase === "fight") updatePatches(dt);
      if (state.phase === "fight") updateUnits(dt);
      if (state.phase === "fight") updateTurret(dt);
      if (state.phase === "fight") updateMines(dt);
      if (state.phase === "fight") updateMend(dt);
      if (state.phase === "fight") updateBolts(dt);
      if (state.phase === "fight") updateLobs(dt);
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
      if (opts.backup) {
        ctx.save();
        ctx.translate(x, opts.anchor === "center" ? y : y - size * 0.45);
        opts.backup(size * 0.42);
        ctx.restore();
      }
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
    ctx.fillStyle = e.boss ? "#5c4d6e" : e.bloater ? "#6a5a32" : e.crawler ? "#4e6a38" : "#6a7264";
    ctx.beginPath();
    ctx.ellipse(0, r * 0.18, r * 0.52, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = e.spitter ? "#d6e27a" : "#9aa18c";
    ctx.beginPath();
    ctx.arc(0, -r * 0.32, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff2a3a";
    ctx.fillRect(-r * 0.18, -r * 0.4, r * 0.1, r * 0.08);
    ctx.fillRect(r * 0.08, -r * 0.38, r * 0.1, r * 0.08);
  }

  function spriteFilter(e) {
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
    const cycle = u.walk * 2.8;
    const stride = reduceMotion ? 0 : Math.sin(cycle);
    const bob = reduceMotion ? 0 : -Math.abs(stride) * (moving ? 0.85 : 0.12);
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
    const rate = moving ? 4.2 : 2.0;
    const frame = Math.floor(state.time * rate + u.walk * 3) % WALK_FRAMES;
    drawSprite(u.kind, x, y, height, {
      frame: frame,
      bob: reduceMotion ? 0 : -Math.abs(Math.sin(state.time * rate * Math.PI)) * (moving ? 0.7 : 0.28),
      rot: attack * 0.22 * face,
      sx: face,
      sy: 1,
      backup: (rr) => drawHeroFallback(h, rr),
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
    return (table[e.type] || 12.4) * (e.elite ? 1.06 : 1);
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
        backup: (rr) => drawZombieFallback(e, rr),
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
      backup: (rr) => drawZombieFallback(e, rr),
    });
    if (e.spitter && e.spitCd < 0.45) {
      ctx.fillStyle = "#eaff9a";
      ctx.beginPath();
      ctx.arc(x + (dx / dist) * (height * 0.22), y - height * 0.42, 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    if (e.slowT > 0 || e.stunT > 0) {
      ctx.strokeStyle = e.stunT > 0 ? "rgba(255,255,255,0.9)" : "rgba(196,155,255,0.9)";
      ctx.lineWidth = 0.28;
      ctx.beginPath();
      ctx.arc(x, y - height * 0.5, height * 0.22, 0, Math.PI * 2);
      ctx.stroke();
    }
    const barW = Math.min(height * 0.7, 8);
    const hx = x - barW / 2;
    const hy = y - height - 1.05;
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(hx, hy, barW, 0.48);
    ctx.fillStyle = e.elite ? "#ffd56a" : e.boss ? "#ff6b8a" : "#c5e38a";
    ctx.fillRect(hx, hy, barW * Math.max(0, e.hp / e.max), 0.48);
    if (e.boss) {
      ctx.fillStyle = "#f3e9ff";
      ctx.font = "700 2.4px Passion One, Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(state.wave === FINALE ? "LAST KING" : "GRAVEKING", x, hy - 0.2);
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
    drawAura();
    for (const p of patches) drawPatch(p);
    for (const e of enemies) {
      if (e.dead && e.dying <= 0) continue;
      drawEnemy(e);
    }
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
      ctx.globalAlpha = Math.max(0, ring.life / 0.4);
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
      ctx.font = "700 1.85px sans-serif";
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    drawThreatBar();
    if (state.banner && state.banner.life > 0) {
      ctx.globalAlpha = Math.min(1, state.banner.life * 2);
      ctx.fillStyle = "#f7f3ea";
      ctx.font = "700 4px Passion One, Impact, sans-serif";
      ctx.fillText(state.banner.title, WORLD_W / 2, 7.2);
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
    $("hpLabel").textContent = "/ " + state.baseMax + " HP";
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
    next.disabled = state.phase !== "shop";
    next.textContent = state.phase === "fight" ? "HOLDING" : "START WAVE";
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
      btn.querySelector(".own").textContent = own;
      btn.classList.toggle("broke", !gated && (locked || units.length >= squadCap() || state.cash < cost));
    }
    announceHires();
    for (const id of UP_IDS) {
      const btn = upButtons[id];
      const lv = state.ups[id];
      const up = BASE_UPS[id];
      const maxed = lv >= up.max;
      btn.querySelector(".lv").textContent = maxed ? "LV " + lv + " · MAX" : "LV " + lv + " · $" + up.costs[lv];
      btn.querySelector(".fx").textContent = upEffect(id, lv);
      btn.classList.toggle("broke", locked || maxed || state.cash < (maxed ? 1e9 : up.costs[lv]));
    }
    $("pauseBtn").textContent = state.phase === "paused" ? "RESUME" : "PAUSE";
  }

  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1500);
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
    if (live >= 4) return false;
    shotBusy.push(now + 0.12);
    return true;
  }

  function sfxEnv(g, when, dur, peak) {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + Math.min(0.015, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  }

  function sfxOsc(when, freq, dur, peak, type) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, when);
    sfxEnv(g, when, dur, peak);
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

  function sfxNoise(when, dur, peak, filterType, freq, q) {
    const buf = ensureNoise();
    if (!buf) {
      sfxOsc(when, freq > 1500 ? 1200 : 180, Math.min(0.1, dur), peak * 0.65, "triangle");
      return;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const f = audioCtx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = audioCtx.createGain();
    sfxEnv(g, when, dur, peak);
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
        sfxOsc(now, 1420 + Math.random() * 180, 0.04, 0.07, "square");
        sfxNoise(now, 0.035, 0.045, "highpass", 2400, 0.7);
      } else if (kind === "blast") {
        sfxNoise(now, 0.1, 0.08, "lowpass", 420, 0.55);
        sfxOsc(now, 96, 0.08, 0.045, "triangle");
      } else if (kind === "patch") {
        sfxNoise(now, 0.11, 0.055, "bandpass", 640, 0.45);
      } else if (kind === "volley") {
        sfxOsc(now, 1040 + Math.random() * 90, 0.028, 0.06, "square");
      } else if (kind === "cleave") {
        sfxOsc(now, 74, 0.09, 0.08, "sine");
      } else {
        sfxNoise(now, 0.04, 0.07, "highpass", 1500, 0.5);
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
      sfxOsc(now, freq, dur, deep ? 0.055 : 0.045, "sawtooth");
      sfxNoise(now, dur, 0.03, "lowpass", 220, 0.6);
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
    music.volume = 0.5;
    if (music.paused) {
      const pending = music.play();
      if (pending && typeof pending.catch === "function") pending.catch(() => {});
    }
  }

  function syncSoundLabels() {
    $("mute").textContent = state.muted ? "OFF" : "SND";
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

  function openBrief(withPerk) {
    const spec = stageSpec(state.wave);
    const entered = announceRegion(state.wave);
    const perk = !!withPerk;
    const crate = !perk && !spec.boss && !spec.finale && Math.random() < 0.4;
    hideMenus();
    state.phase = "brief";
    state.perkDue = perk;
    state.perkPicked = !perk;
    state.crateDue = crate;
    state.crateTaken = !crate;
    state.crateOffer = "";
    const kind = spec.finale ? "FINALE" : spec.boss ? "BOSS" : spec.challenge ? "CHALLENGE" : "NEXT";
    if (entered && state.wave >= 51) $("ovKicker").textContent = "THE CHAPEL  ·  STAGE " + state.wave;
    else if (entered && state.wave >= 21) $("ovKicker").textContent = "THE MARSH  ·  STAGE " + state.wave;
    else $("ovKicker").textContent = "STAGE " + state.wave + "  ·  " + kind;
    $("ovTitle").textContent = spec.name;
    $("ovBody").textContent = spec.blurb;
    fillDebuts(debutsOn(state.wave));
    $("ovPerk").hidden = !perk && !crate;
    if (perk) $("ovPerk").textContent = "Pick one. It stays for the run.";
    else if (crate) $("ovPerk").textContent = "Supply crate. Tap once to take it. Free.";
    $("ovSummary").hidden = true;
    $("ovHint").hidden = false;
    $("ovHint").textContent = "Continue, gear up, then start the wave. It will not start on its own.";
    $("ovChoices").innerHTML = "";
    if (perk) renderPerks();
    else if (crate) renderCrate();
    $("ovBtn").hidden = false;
    $("ovBtn").disabled = perk || crate;
    $("ovBtn").textContent = "CONTINUE";
    $("ovRestart").hidden = false;
    bolts.length = 0;
    lobs.length = 0;
    patches.length = 0;
    $("pauseScreen").classList.add("hidden");
    const ov = $("overlay");
    ov.dataset.art = (spec.boss || spec.finale) ? "boss" : state.wave >= 51 ? "chapel" : state.wave >= 21 ? "marsh" : "yard";
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
    state.phase = "shop";
    $("overlay").classList.add("hidden");
    clearSplashArt();
  }

  function showEnd(kind) {
    hideMenus();
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
    const next = freshState();
    next.muted = muted;
    next.runLive = live;
    Object.assign(state, next);
    applyMetaStats();
    addUnit("vera");
    addUnit("roxie");
    layoutHomes();
    syncSoundLabels();
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

  function startRun(region) {
    let safe = "yard";
    const which = region || pickedRegion || "yard";
    if (which === "marsh" && meta.regions.marsh) safe = "marsh";
    if (which === "chapel" && meta.regions.chapel) safe = "chapel";
    pickedRegion = safe;
    resetRun();
    const startN = safe === "chapel" ? 51 : safe === "marsh" ? 21 : 1;
    state.wave = startN;
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
    $("titleScreen").classList.add("hidden");
    $("overlay").classList.add("hidden");
    clearSplashArt();
    $("pauseScreen").classList.add("hidden");
    $("pauseBtn").textContent = "PAUSE";
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
    $("overlay").classList.add("hidden");
    clearSplashArt();
    $("pauseScreen").classList.add("hidden");
    $("titleScreen").classList.remove("hidden");
    renderRegions();
  }

  function togglePause() {
    if (state.phase === "paused") {
      state.phase = state.pausedFrom || "fight";
      state.pausedFrom = null;
      $("pauseScreen").classList.add("hidden");
      $("pauseBtn").textContent = "PAUSE";
      return;
    }
    if (state.phase !== "fight" && state.phase !== "shop") return;
    hideMenus();
    state.pausedFrom = state.phase;
    state.phase = "paused";
    $("pauseScreen").classList.remove("hidden");
    $("pauseBtn").textContent = "RESUME";
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
      img.src = "assets/" + id + ".png";
      const metaEl = document.createElement("span");
      metaEl.className = "meta";
      const name = document.createElement("b");
      name.textContent = JOBS[id] || h.short;
      const small = document.createElement("small");
      small.textContent = h.tag;
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
      b.innerHTML = '<span class="mark">' + up.mark + '</span><em class="lv"></em><span class="meta"><b>' + label +
        '</b><small>' + up.blurb + '</small><i class="fx"></i></span>';
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
  $("next").addEventListener("click", () => { unlock(); startWave(); });
  $("restart").addEventListener("click", () => {
    unlock();
    if (state.phase === "title") return;
    startRun();
  });
  $("ovBtn").addEventListener("click", () => {
    unlock();
    if (state.phase === "brief") dismissBrief();
    else if (state.phase === "won" || state.phase === "lost") showTitle();
  });
  $("ovRestart").addEventListener("click", () => { unlock(); startRun(); });
  $("pauseBtn").addEventListener("click", () => togglePause());
  $("resumeBtn").addEventListener("click", () => togglePause());
  $("pauseRestart").addEventListener("click", () => {
    unlock();
    if (state.phase === "title") return;
    startRun();
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
    if (ev.key === " " || ev.code === "Space") { ev.preventDefault(); startWave(); }
    else if (ev.key === "1") buy("vera");
    else if (ev.key === "2") buy("roxie");
    else if (ev.key === "3") buy("lila");
    else if (ev.key === "4") buy("nyx");
    else if (ev.key === "5") buyUp("wall");
    else if (ev.key === "6") buyUp("aura");
    else if (ev.key === "7") buyUp("turret");
    else if (ev.key === "r" || ev.key === "R") { if (state.phase !== "title") startRun(); }
    else if (ev.key === "m" || ev.key === "M") onMute();
    else if (ev.key === "p" || ev.key === "P" || ev.key === "Escape") togglePause();
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
