# Last Gate

A phone-first compound defense. The gate sits in the center. The dead walk in from every edge. Your heroines move and shoot. The yard is the whole screen. One slim top bar holds base HP, cash, ash, stage, SHOP, START WAVE (between waves only), pause, mute, and restart. SHOP drops a menu over the field with this stage's stock (a few hires and base upgrades, with REROLL and LOCK), your build (tag sets, relics, cards), Skills, and Lab. The game is paused while it is open. PLAY on the title screen starts the run and the music. Open `index.html` offline. No build, no CDN, no network.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Or just open `index.html` in a browser.

## How to play

1. Pick a LOADOUT on the title screen (Default is Vera, Roxie and $100), then tap PLAY. Hire the others when they show up in the shop stock. The first of each name is the hero. Further copies are the same kit at a lower rank. They walk and shoot on their own. Squad cap is 10.
2. Tap SHOP to hire and upgrade (the run freezes while the menu is open; new hires appear beside the gate). Close it, then press START WAVE in the top bar. Zombies come from all four edges toward the gate. Base HP is on the top of the yard and on the gate itself. If it hits 0, the run ends.
3. After every stage: pick a card (or skip it for cash), maybe a relic, then choose the next stop on the map. A card then names the next stage, any new enemy, and any twist. Continue, spend cash, then start the wave yourself. It does not auto-start.
4. During a wave, tap a face in the slim strip under the field to fire that heroine's ability. Hold it to open her card instead. Drag a heroine to move her; double-tap her to let her roam again; quick-tap her to open her card.
5. Clear stage 100 to win, then keep going in Endless if you like. Every 10th stage is a boss (four bosses rotate). Stage 100 is the Last King. Pause, mute, and restart sit in the top bar. Restart asks first.

Keyboard: during a wave `1`–`6` fire abilities (Vera, Roxie, Lila, Nyx, Sable, Wren). Outside a wave `1`–`9` buy the matching offer in the shop stock and `X` rerolls. `B` or `U` opens or closes the shop, Space starts the wave, `P` pauses, `Esc` closes the top menu or card (or pauses), `F` flips an open card and the arrow keys browse cards, `R` restarts, `M` mutes. With a mouse, drag and double-click work like touch.

Sound is a drone made in the browser with the Web Audio API. It starts on PLAY, and on the first tap if the title is skipped, unless sound is off. No music files.

## Roster

| Heroine | Cost | Ability |
| --- | --- | --- |
| Vera Voss, rifle sniper | $110 | Deadeye. She aims at the strongest zombie in range and hits harder while it is still healthy. Long range, slow. Extras are Spotters. |
| Roxie Kane, shotgun brawler | $80 | Buckshot. A short, fast blast hits several zombies in the spread (5 for Roxie, 3 for a Brawler). |
| Lila Marsh, firebug | $140 | Burn patch. She lobs fire that stays on the ground and cooks whoever stands in it. Extras are Torches (smaller, shorter patch). |
| Nyx Calder, hex warden | $120 | Hex pulse. Slows a pack. Nyx herself also stuns; a Hexer copy's stun is shorter. |

## Base upgrades

Bought with cash, in the shop or during a wave. Each has 3 levels.

| Upgrade | Costs | Effect |
| --- | --- | --- |
| Sandbag Wall | $65 / $95 / $140 | Base takes 18% / 32% / 46% less damage. |
| Dread Aura | $75 / $110 / $155 | Zombies near the gate move at 80% / 66% / 52% speed. |
| Sentry Turret | $85 / $125 / $175 | The compound shoots the nearest zombie for 11 / 18 / 28 damage. |

## Stages and enemies

There are 100 generated stages. Counts, health, and speed climb as you go. A boss or challenge lands every 10th stage (10, 20, … 100). Stage 100 is the finale. Beating it wins the run. From stage 16, a few elites (gold tint, much more health) are mixed into each wave.

| Enemy | First appears | Behavior |
| --- | --- | --- |
| Walker | 1 | The basic dead. Walks in and bites the gate. |
| Runner | 3 | Lighter and much faster. |
| Tank | 5 | High health, slow. |
| Brute | 7 | Armored. Shots glance off. |
| Bosses | 10, then every 10th | See Bosses below. |
| Crawler | 12 | Small, fast, and they swarm. |
| Elite | 16 | Not a species. A tougher tinted copy mixed into later waves. |
| Spitter | 18 | Stops short of the gate and fires a slow glob at it. |
| Shrieker | 26 | A wail that speeds up nearby zombies. |
| Bloater | 34 | Bursts on death. Hurts the gate if it pops close. |

## Bosses

Every boss has a name, a slim HP bar at the top of the field, and telegraphs on the ground before each attack. Heroines have no HP: boss attacks daze (stars over her head, no moving or shooting), slow, or knock them aside. Move them out of the marked areas.

| Stage | Boss | Pattern |
| --- | --- | --- |
| 10, 50, 90 | Graveking | Purple rings rise into risen dead. While any risen stands he is shielded and takes a quarter damage. Kill the risen to break it. |
| 20, 60 | Brood Mother | Lays eggs as she walks (they hatch into crawlers, so shoot them) and bursts out a brood of crawlers from a green ring. |
| 30, 70 | Juggernaut | Marks a red lane toward a heroine (or the gate), then charges down it. Heroines in the lane are knocked aside and dazed. Next to the gate he slams a red circle instead. |
| 40, 80 | Bile Queen | Lobs acid at heroines and around the gate. Green rings become acid pools that slow heroines and eat at the gate. |
| 100 | Last King | The finale. Cycles all of it: risen dead and shield, acid, the charge or slam, broods and eggs. |

## Wave twists

From stage 5, about every 2–3 stages (more often later), a stage gets a twist. From stage 60 two can stack. Bosses only get a twist from stage 60, and stage 100 never does. Twists show on the stage card, as a TWIST line on the field banner, as a pill at the right of the ability strip, and in the shop. Risky twists pay extra when the stage is cleared.

| Twist | Effect | Pays |
| --- | --- | --- |
| Fog | The field is dark. Zombies are hidden (and cannot be shot) until they reach the light of the gate or a heroine. | +40% clear cash, +2 ash |
| Blood Moon | Zombies move 25% faster. | Every kill pays double |
| One-Sided Horde | Everything comes from one or two edges, and more of it. | +35%, +1 ash |
| Ironhide | Flat armor on every zombie. Small hits barely scratch. | +45%, +2 ash |
| The Swarm | A flood of small, fast, weak crawlers on top of the wave. | +30%, +1 ash |
| Frenzy | Hurt zombies speed up as they get close to death. | +35%, +1 ash |
| Exploding Dead | Corpses burst, hurting zombies nearby and the gate if they pop close to it. | +30%, +1 ash |
| Night of Giants | Fewer small dead, many more huge tanks and brutes. | +45%, +2 ash |
| Gold Rush | Some zombies glow gold: tougher, and they drop five times the cash. | Gold zombies pay x5 |
| Plague | The dead leave toxic puddles that slow heroines. | +35%, +1 ash |

## The roguelike layer

Every run plays differently: the shop stock is random, you build a deck one card per stage, relics bend the rules, and you choose your own road.

### Shop stock, reroll and lock

The shop no longer lists everything. Each stage it rolls fresh **stock**: about 2 hire offers and 3 base-upgrade offers (the next level of that upgrade). More slots open later: +1 base offer at stage 30 and 60, +1 hire offer at stage 40, and a Shop stop on the map adds one of each at 25% off. Maxed upgrades never show up. A full squad turns hire slots into an extra base slot. The first stock of a run always has hires in it.

- **REROLL** replaces every unlocked, unsold offer. It costs $15, then $25, $35 and so on (+$10 each), and goes back to $15 at the next stage. Lucky Coin cards and the Bone Dice relic give free rerolls.
- **LOCK** (the strip under each offer) keeps that offer for the next stage. It shows up again marked KEPT, then the lock is used up. Tap again to unlock.
- Bought offers stay greyed out until the next stage. Skills and Lab are unchanged.

### Cards after every stage

Clear a stage and pick 1 of 3 cards (4 with the Treasure Chart relic), or **SKIP** for a little cash ($10 + 0.8 x stage). Rarity weights are common 65 / rare 28 / epic 7, and epics get more common as the stages climb. Bosses and Elite stops offer rare-or-better. Cards for a heroine only show up once she is hired, and cards that need mines or a turret wait until you own one. Many cards stack: the same card can come back, and the pick shows the stack (x1 → x2). The old every-3-stages perks are gone; their effects are in the pool now (Hot Barrels, Hair Trigger, Quick Step, Field Medic, Surplus, Spotter Kit, Reinforced Gate, Scavenge).

Every card carries 0–2 **tags**. Holding 3 or 5 cards of a tag (copies count) turns on its set bonus with a callout. Tags show as colored pills on each card, and the pick tells you when a card would complete a set. The BUILD row in the shop shows each tag's progress.

| Tag | 3 cards | 5 cards |
| --- | --- | --- |
| Fire | Burns spread to nearby zombies. | Fire deals +40%, and zombies that die burning burst. |
| Hex | Ability cooldowns 15% shorter. | Abilities hit 25% harder and freeze the field for 1.2s. |
| Gun | +10% crit chance. | +15% attack rate. Crits deal 3x. |
| Blade | +12% heroine damage. | Hits finish off normal zombies under 15% health. Roxie and Wren +20% damage. |
| Gate | +40 max gate HP. The gate takes 8% less damage. | The gate regenerates 2 HP/s in waves, and biters take thorn damage. |
| Gold | +$1 cash per kill. | +$2 more per kill. Shop prices 15% off. |
| Mine | Mines hit 25% harder. 1 extra mine arms each stage. | Every mine chains into a second blast. Mines trigger 40% faster. |

| Card | Rarity | Tags | Stacks | Effect |
| --- | --- | --- | --- | --- |
| Hot Barrels | Common | Gun | x6 | +10% heroine damage. |
| Hair Trigger | Common | Gun | x5 | +8% heroine attack rate. |
| Spotter Kit | Common | Gun | x4 | +8% heroine range. |
| Longshot | Common (Vera) | Gun | x3 | Vera: +15% damage and +6% range. |
| Double Ought | Common (Roxie) | Gun | x2 | Roxie's blast hits 1 more zombie and deals +8%. |
| Quickdraw | Common (Sable) | Gun | x3 | Sable: +12% attack rate. |
| Gun Oil | Common | Gun, Gate | x3 | Turret: +25% damage and +10% fire rate. |
| Hollow Points | Rare (Vera) | Gun | - | Vera's shots pierce through to 2 more zombies. |
| Ricochet | Rare (Sable) | Gun | - | Sable's bullets bounce to a second zombie. |
| Deadly Precision | Rare | Gun | - | Heroine hits: +15% crit chance. Crits deal 2.5x. |
| Twin Barrel | Rare | Gun, Gate | - | The turret fires a second barrel at another zombie. Grants Turret LV 1 if you have none. |
| Jellied Fuel | Common (Lila) | Fire | x3 | Lila: fire patches burn 25% hotter and last 20% longer. |
| Accelerant | Common | Fire | x3 | All burns and fire patches deal +15%. |
| Dragon Shells | Rare (Roxie) | Fire, Gun | - | Roxie's pellets set zombies on fire. |
| Ember Rounds | Rare (Sable) | Fire, Gun | - | Sable's bullets set zombies on fire. |
| Pyre | Rare | Fire | - | Burning zombies take +25% damage from heroine hits. |
| Wildfire | Epic (Lila) | Fire | - | Lila's fire ignites zombies, and burning zombies spread it to their neighbours. |
| Mortar Team | Epic | Mine, Fire | - | Every 6 seconds a shell lands on the biggest crowd. |
| Hex Coil | Common (Nyx) | Hex | x2 | Nyx: +20% pulse radius and +10% damage. |
| Quick Hands | Common | Hex | - | Ability cooldowns are 25% shorter. |
| Refocus | Common | Hex | x3 | Ability cooldowns 8% shorter. |
| Field Notes | Common | Hex | x2 | Heroines earn 30% more XP. |
| Hex Thorns | Rare (Nyx) | Hex | - | Zombies slowed by Nyx take damage every second. |
| Witchfire | Rare (Nyx) | Hex, Fire | - | Nyx's pulse sets zombies alight. |
| Doom Mark | Rare | Hex | - | Elites, bounties and bosses take +20% damage from everything. |
| Battle Trance | Rare | Hex | - | Firing an ability makes every heroine attack 30% faster for 5s. |
| Overcharge | Epic | Hex | - | Abilities hit 50% harder and last 25% longer. |
| Shock Haft | Common (Wren) | Blade | - | Wren's cleave knocks zombies back and staggers them. |
| Spearhead | Common (Wren) | Blade | x3 | Wren: +18% damage. |
| Quick Step | Common | Blade | x3 | Heroines move 15% faster. |
| Butcher's Edge | Common | Blade | x3 | +12% heroine damage to zombies near the gate. |
| Bloodlust | Rare | Blade | - | Roxie and Wren attack 20% faster. |
| Killing Spree | Rare | Blade | - | 12 kills in a quick streak: heroines attack 35% faster for 5 seconds. |
| Execution | Rare | Blade | - | Heroine hits finish off normal zombies under 15% health. |
| Reinforced Gate | Common | Gate | x5 | Max gate HP +30, and heal 30. |
| Field Medic | Common | Gate | x99 | Repair the gate by 35% of its max HP now. |
| Bulwark | Common | Gate | x3 | The gate takes 8% less damage. |
| Patch Kit | Common | Gate | x3 | The gate regenerates 1 HP/s during waves. |
| Field Triage | Common | Gate | x3 | Every kill heals the gate 0.5 HP. |
| Thorned Gate | Common | Gate, Blade | - | Biters take heavy thorn damage on every bite. Spikes hit twice as hard. |
| Second Wind | Rare | Gate | - | Once per stage, when the gate drops below 30%, it heals 35% and the dead freeze for 2s. |
| Scavenge | Common | Gold | x99 | Pocket $40 plus $2 per stage now. |
| Surplus | Common | Gold | x99 | Your next hire is 40% off. |
| Gold Teeth | Common | Gold | x3 | Kills pay 20% more cash. |
| Compound Interest | Common | Gold | - | Earn 5% of your banked cash after each stage (up to $60). |
| Bounty Board | Common | Gold | x2 | Elites pay +$20 more. |
| Lucky Coin | Common | Gold | x2 | One free shop reroll every stage. |
| War Chest | Rare | Gold | - | Stage clear bonus +50%. |
| Blasting Caps | Common | Mine | x3 | Mines hit 30% harder. |
| Sapper Kit | Common | Mine | x3 | Start every stage with 2 armed mines. Grants Mines LV 1 if you have none. |
| Chain Mines | Rare | Mine | - | Mines blast an area and set off a second mine. Grants Mines LV 1 if you have none. |
| Minelayer | Rare | Mine | - | Mines trigger 30% faster. Grants Mines LV 1 if you have none. |
| Cluster Charge | Epic | Mine, Fire | - | Every mine blast leaves a fire patch. |

### Cursed cards

About 15% of card picks swap one card for a cursed one (25% after an Elite stop, 30% after a Mystery). Cursed cards are purple and red with a striped back, say CURSED, and spell out the downside in red. They are strong, but each costs you something for the rest of the run. You can only hold one of each. The Old Shrine mystery can burn one away, and the Black Cat relic halves every curse downside.

| Curse | Upside | Downside |
| --- | --- | --- |
| Blood Pact | +40% heroine damage. | Gate max HP -25%. |
| Glass Gate | Turret damage x2. Grants Turret LV 1 if you have none. | The gate takes +20% damage. |
| Greed | Kill cash x1.5. | Zombies have +15% HP. |
| Haste Hex | Heroines attack 30% faster. | Ability cooldowns +40%. |
| Powder Keg | Mines deal double and blast an area. Grants Mines LV 1 if you have none. | Gate max HP -15%. |
| Pyromania | All fire damage +60%. | Heroine range -15%. |
| Blood Money | +$4 cash per kill. | All gate healing is halved. |
| Berserker | +25% heroine damage and +15% attack rate. | The Sandbag Wall works at half strength. |
| Dark Pact | Abilities hit 60% harder and last 25% longer. | Zombies move 10% faster. |
| Fool's Gold | +$60 after every stage. | Card picks offer one card fewer. |

### The map

After the card (and any relic), a compact map shows the road ahead: 4 rows, 2–3 choices per stage, with lines showing where each stop leads. Every stop is still the next stage number. Tap a node on the map or the bigger card under it. The map is seeded per run, and Endless keeps it going.

- **Fight**: a normal stage.
- **Elite**: extra elites and +20% health on the wave. Pays 50% more, then a rare+ card and a 40% chance at a relic.
- **Shop**: a normal wave, but the stock has an extra hire and base offer at 25% off.
- **Rest**: heal the gate 35% now, a shorter wave, no twist.
- **Mystery**: an encounter before the stage. The Gambler (double or nothing), Blood Altar (bleed the gate for a rare card), Cursed Idol (a relic and a curse), Abandoned Cache (cash or a medkit), Wandering Merchant (buy a relic), Old Shrine (pray for a card, or pay to cleanse a curse), The Deserter (a free heroine for 10 max gate HP).
- **Treasure**: only a handful of dead guard a chest. Clear them and pick a relic. No twist.
- **Boss**: every 10th stage and stage 100 are fixed boss nodes, shown ahead on the map.

### Relics

Relics are rule-benders. Bosses offer a pick of 2, Treasure offers 2, Elite stops sometimes drop 1, and two mysteries trade for them. They show as small lettered badges in the BUILD row; tap one for its details. They reset every run.

| Relic | Badge | Effect |
| --- | --- | --- |
| Sapper's Pouch | SP | Mines re-arm: start every stage with 3 armed mines. Grants Mines LV 1. |
| Golden Trigger | GT | Every heroine crit drops $1. |
| Iron Ward | IW | The first hit on the gate each stage is negated. |
| Tally Counter | TC | Every 10th kill fires a free turret volley at up to 6 zombies. |
| Hourglass | HG | The first ability you fire each stage recharges twice as fast. |
| War Drum | WD | Heroines attack 12% faster. |
| Vampire Fang | VF | Every 20 kills heal the gate 8 HP. |
| Ember Heart | EH | Zombies that die burning set their neighbours alight. |
| Hex Doll | HD | Elites, bounties and bosses take +25% damage. Elites arrive slowed. |
| Bone Dice | BD | Two free shop rerolls every stage. |
| Merchant's Ledger | ML | Shop prices 15% off. |
| Treasure Chart | TM | Card picks offer one card more. |
| Gilded Tooth | GD | +$1 cash per kill. |
| Medic Bag | MB | The gate heals 15% of its max HP after every stage. |
| Spare Barrel | SB | The turret fires 25% faster. Grants Turret LV 1. |
| Rally Flag | RF | Heroines holding a flag (dragged into place) deal +18% damage. |
| Thorn Crown | CR | Biters take 20 + 1 per stage thorn damage on every bite. |
| Storm Lantern | SL | Fog cannot hide the dead from your squad. |
| Siege Plating | PL | The gate takes 12% less damage. |
| Recruit Papers | RP | A free random heroine joins now, and the squad cap is +1. |
| Black Cat | BC | Curse downsides are halved (Fool's Gold's is lifted). |
| Last Rites | LR | Once per run, when the gate would fall, it holds at 30% HP and the dead freeze for 3s. |

### Loadouts

LOADOUT on the title screen picks who walks out with you. Locked loadouts are greyed out with their ash cost; unlocking is permanent and saved. In the Marsh or Chapel the veteran still joins on top of the loadout (never twice).

| Loadout | Ash | Start |
| --- | --- | --- |
| Default | free | Vera and Roxie. $100. |
| Firestarters | 30 | Lila and Roxie. Starts with Dragon Shells, a Fire card. |
| Hex Lab | 40 | Nyx and Vera. Starts with the Hex Doll relic. |
| Gunline | 40 | Sable and Vera. Starts with Hot Barrels and Spotter Kit, two Gun cards. |
| Spearwall | 30 | Wren and Roxie. The Sandbag Wall starts at LV 1. |
| Gambler | 60 | One random heroine and +$200, plus a random cursed card and a random relic. |

## Tap abilities

One button per hired heroine in the strip under the field: her face, a cooldown sweep, and a glow when ready. Only usable during a wave, not while the shop or pause is open. All come back ready at the start of each stage.

| Heroine | Ability | Cooldown | Effect |
| --- | --- | --- | --- |
| Vera | Deadeye | 32 s | Crosshairs lock on the toughest zombies (3 plus one per Vera, up to 7), then each takes a huge shot. |
| Roxie | Dragon's Breath | 24 s | A fire nova around each Roxie: heavy damage, knockback, burning. |
| Lila | Fire Wall | 36 s | A ring of fire around the gate for 7 s. Burns and slows whatever crosses it. |
| Nyx | Time Freeze | 42 s | Every zombie freezes for about 3 s (bosses for half). Spit globs stop too. |
| Sable | Bullet Storm | 28 s | Each Sable sprays rapid fire at everything in reach for 4 s. |
| Wren | Whirlwind | 26 s | Each Wren spins into the nearest crowd for 3 s, cutting and knocking back. |

## Mid-stage events

About a third of normal stages (from stage 3) get one event, announced by a toast:

- **Survivor**: a survivor runs for the gate. Keep the dead off her. Reaching it pays cash, 3 ash, and 15 gate HP.
- **Supply Drop**: a crate parachutes in. Tap it (or walk a heroine over it) before it times out or the dead trample it. Cash, a gate heal, or all abilities ready.
- **Bounty Elite**: a named elite with a price on its head. Kill it before it reaches the gate for a big payout and 2 ash.
- **Ammo Cache**: tap it for a rally. Heroines fire 40% faster for 8 s.
- **Grave Breach**: a cracked ring with a warning marker. A pack of the dead claws out of it after two seconds.

## Moving heroines

Drag a heroine (touch or mouse) and drop her anywhere on the field. A flag marks the spot and her range shows while you drag. She walks there at her normal speed and holds it, still shooting anything in range. Double-tap her to release her back to roaming. Tapping a crate always claims the crate first. The field never scrolls.

A loss or a win shows stage reached, kills, and cash earned.

Health climbs a little faster after stage 25 to keep late stages hard with cards and abilities, and again from stage 20 (about +1.1% per stage on top of that) because levels, traits, bonds, and synergies add power. With a card every stage, sets and relics, zombie health also ramps about +3.6% per stage past stage 8 (up to 5x).

Saved locally (localStorage): ash and Lab upgrades, tips already seen, and the card collection: each heroine's lifetime kills, runs, best stage and bond, plus medals, the best Endless stage, and unlocked loadouts. Nothing leaves the device.

## Heroine cards

Every heroine has a collectible card: her full portrait, a frame, a foil shine that follows your finger, and a back side.

Open a card three ways. Each one pauses the game, just like the shop:

- **Shop:** tap her face (the small `i`) in the HIRE grid. The price button under it still hires, separately.
- **Ability strip:** hold her ability button for half a second (or right-click it). A quick tap still fires the ability.
- **Field:** quick-tap a heroine. Dragging still moves her, and double-tap still releases her.
- Title screen: CARDS opens the deck.

Drag across the card to tilt it (phones with motion sensors also tilt with the phone where the browser allows it; iOS asks for permission, so it falls back to drag). Tap the art or press FLIP to turn it over. The arrows browse the six heroines. Keyboard: `F` flips, left/right browse, `Esc` closes.

**Front:** name, title, role, a short bio, live stats for this run (damage, attacks per second, range, kills), her level and XP bar, her ability and its cooldown, her signature skill rank, the traits she has picked, active synergies, and the reward cards that boost her. **Back:** lifetime kills, runs, best stage, her bond level and progress to the next, the frame ladder, and a quote.

| Heroine | Title |
| --- | --- |
| Vera Voss | The Spotter |
| Roxie Kane | The Wrecking Ball |
| Lila Marsh | The Torch |
| Nyx Calder | The Hex Warden |
| Sable | The Quickdraw |
| Wren | The Lancer |

## Levels and traits

During a run each heroine levels from 1 to 10 on her own kills. Each level adds +2% damage and +1% attack rate. At LV 3, 6, and 9 she earns a trait: a toast fires, her ability button gets a glowing star, and a pip floats over her on the field. Open her card (the game pauses) and pick one of two. Levels and traits reset every run.

| Heroine | LV 3 | LV 6 | LV 9 |
| --- | --- | --- | --- |
| Vera | Headhunter (+40% vs elites, bounties, giants, bosses) or Overwatch (+20% range, clears Fog) | Executioner (double damage under 35% HP) or Rapid Bolt (+25% rate) | Penetrator (+1 pierce) or Kill Confirmed (kills cut Deadeye cooldown 1 s) |
| Roxie | Slug Rounds (2 fewer targets, +60% damage) or Wide Choke (+2 targets, wider spread) | Point Blank (+50% up close) or Pump Action (+22% rate) | Knockdown (shove and stagger) or Shredder (ignores armor) |
| Lila | Napalm (patches hotter and longer) or Heat Wave (+35% radius) | Firestarter (direct hits ignite) or Quick Fuse (+25% rate) | Inferno (Fire Wall longer and hotter) or Fireball (every 4th throw: double radius, triple damage) |
| Nyx | Chronomancer (Time Freeze +1.5 s, 20% faster recharge) or Plaguecaller (pulse rots zombies) | Deep Freeze (longer stuns, deeper slow) or Wide Hex (+35% radius) | Curse of Frailty (hexed zombies take +15% from all) or Soul Siphon (hexed kills cut Time Freeze cooldown) |
| Sable | Gunslinger (+30% rate) or Trick Shot (+1 ricochet) | Hollow Tips (+25% damage) or Fan the Hammer (+1 bullet per volley) | Dead Eye (+15% crit, 2.5x crits) or Bullet Hell (Bullet Storm longer and harder) |
| Wren | Vanguard (shove and stagger) or Reaper (kills heal the gate 1) | Long Haft (+30% reach) or Fury (+25% rate) | Impale (+60% vs elites and bosses) or Whirling Death (Whirlwind longer and harder) |

## Bonds and frames

Bonds are saved. Each heroine's lifetime kills raise her bond: 100, 400, 1,200, 3,000, and 7,000 kills reach Bond 1 to 5. Each bond adds +3% damage forever. Higher bonds unlock card frames that also show on her face in the shop: Bronze at Bond 2, Silver at 3, Gold at 4, and animated Holo at 5. Progress is on the back of her card.

## Duo synergies

Hire both heroines of a pair and a synergy turns on. A callout announces it, both cards list it, and the BUILD row in the shop shows it.

| Synergy | Pair | Effect |
| --- | --- | --- |
| Pinned | Vera + Nyx | Zombies slowed by Nyx take +20% from Vera. |
| Scorched Earth | Roxie + Lila | Roxie's pellets set zombies alight briefly. |
| Crossfire | Sable + Wren | Sable hits 25% harder on zombies within Wren's reach. |
| Hexfire | Lila + Nyx | Nyx's pulse ignites, and slowed zombies burn 30% hotter. |
| Sharpshooters | Vera + Sable | Both gain +10% crit chance. |
| Front Line | Roxie + Wren | Both attack 12% faster and hit gate-biters 20% harder. |

## Medals

17 medals, saved. Each pays ash once and pops a callout. See them from MEDALS on the title screen or in the shop.

Holdout (clear 25), Deep Water (50), The Last Gate (100), Kingslayer, Egg Breaker, Immovable, and Acid Test (beat each boss), Thousand Cuts (1,000 kills in a run), Double Trouble (clear a stage with two twists), Iron Gate (clear a boss stage above 50% gate), Fully Trained (a heroine at LV 10), Collector (5 epic cards across runs), Massacre (50-kill streak), Full House (all six hired), Chemistry (3 synergies at once), Kindred (Bond 3), No End (clear Endless stage 110).

## Endless

Clearing stage 100 wins the run and offers ENDLESS. Stage 101 and on keep going: health rises another 3% per stage on top of the normal climb, and twists stack (one, then two from 105, sometimes three from 120). The best Endless stage is shown on the title screen.

## Combat juice

- A kill streak counter sits at the top left of the field with a timer bar. Keep killing to keep it alive.
- Big bursts call out MULTI-KILL or MASSACRE.
- Critical hits pop bigger numbers (only a few at once so the field stays readable).
- Huge hits shake the screen a little. Reduced-motion settings turn the shake off.
- Killing a boss slows time for a moment and calls it out.

## Art

Heroines and zombies are the pngs in `assets/`, drawn as circles so the dark photo background is not a rectangle. New enemy types reuse those sprites and are tinted in play. Do not replace those files from the game. Display type is Passion One (`assets/OFL-PassionOne.txt`). The center building is `assets/base.png`; owned Wall, Aura, and Turret show `upgrade-wall.png`, `upgrade-aura.png`, and `upgrade-turret.png` on the yard. The ground for each region (Yard, Marsh, Chapel) is drawn in code on a seeded offscreen canvas, with only ripples, fog, and candle flames animated live.
