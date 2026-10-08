# Last Gate

A phone-first compound defense. The gate sits in the center. The dead walk in from every edge. Your heroines move and shoot. The yard is the whole screen. One slim top bar holds base HP, cash, ash, stage, SHOP, START WAVE (between waves only), pause, mute, and restart. SHOP drops a menu over the field with hires, base upgrades, Skills, and Lab. The game is paused while it is open. PLAY on the title screen starts the run and the music. Open `index.html` offline. No build, no CDN, no network.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Or just open `index.html` in a browser.

## How to play

1. Tap PLAY. You start with Vera, Roxie, and $100. Hire the others when you can. The first of each name is the hero. Further copies are the same kit at a lower rank. They walk and shoot on their own. Squad cap is 10.
2. Tap SHOP to hire and upgrade (the run freezes while the menu is open; new hires appear beside the gate). Close it, then press START WAVE in the top bar. Zombies come from all four edges toward the gate. Base HP is on the top of the yard and on the gate itself. If it hits 0, the run ends.
3. After a stage, a card names the next one, any new enemy, and any twist. Pick a perk when it is offered (every 3 stages), or a reward card after a boss. Continue, spend cash, then start the wave yourself. It does not auto-start.
4. During a wave, tap a face in the slim strip under the field to fire that heroine's ability. Hold it to open her card instead. Drag a heroine to move her; double-tap her to let her roam again; quick-tap her to open her card.
5. Clear stage 100 to win, then keep going in Endless if you like. Every 10th stage is a boss (four bosses rotate). Stage 100 is the Last King. Pause, mute, and restart sit in the top bar. Restart asks first.

Keyboard: during a wave `1`–`6` fire abilities (Vera, Roxie, Lila, Nyx, Sable, Wren). Between waves `1`–`4` hire and `5` Wall, `6` Aura, `7` Turret. `B` or `U` opens or closes the shop, Space starts the wave, `P` pauses, `Esc` closes the top menu or card (or pauses), `F` flips an open card and the arrow keys browse cards, `R` restarts, `M` mutes. With a mouse, drag and double-click work like touch.

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

## Boss reward cards

After every boss, pick one of three cards. Border color shows rarity: grey common, blue rare, purple epic. Cards for a heroine only show up if she is hired. Picked cards are listed under BUILD in the shop and reset on a new run. Perks still come every 3 stages.

| Card | Rarity | Effect |
| --- | --- | --- |
| Dragon Shells | Rare (Roxie) | Roxie's pellets set zombies on fire. |
| Wildfire | Epic (Lila) | Lila's fire ignites zombies, and burning zombies spread it. |
| Hex Thorns | Rare (Nyx) | Zombies slowed by Nyx take damage every second. |
| Hollow Points | Rare (Vera) | Vera's shots pierce 2 more zombies. |
| Ricochet | Rare (Sable) | Sable's bullets bounce to a second zombie. |
| Shock Haft | Common (Wren) | Wren's cleave knocks back and staggers. |
| Chain Mines | Rare | Mines blast an area and set off a second mine. Grants Mines LV 1. |
| Thorned Gate | Common | Biters take heavy thorn damage. Spikes hit twice as hard. |
| Twin Barrel | Rare | The turret fires a second barrel. Grants Turret LV 1. |
| Field Triage | Common | Every kill heals the gate 0.5 HP. |
| Deadly Precision | Rare | +15% crit chance on heroine hits, crits deal 2.5x. |
| Quick Hands | Common | Ability cooldowns 25% shorter. |
| Killing Spree | Rare | 12 quick kills: heroines attack 35% faster for 5 s. |
| Compound Interest | Common | 5% of banked cash after each stage (up to $60). |
| Overcharge | Epic | Abilities hit 50% harder and last 25% longer. |
| Mortar Team | Epic | Every 6 s a shell lands on the biggest crowd. |
| Gold Teeth | Common | Kills pay 25% more cash. |
| Second Wind | Rare | Once per stage, below 30% the gate heals 35% and the dead freeze for 2 s. |

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

Perks show up on the between-stage card after stages 3, 6, 9, and so on. The same perk can be taken again later in a long run. A loss or a win shows stage reached, kills, and cash earned.

Health climbs a little faster after stage 25 to keep late stages hard with cards and abilities, and again from stage 20 (about +1.1% per stage on top of that) because levels, traits, bonds, and synergies add power.

Saved locally (localStorage): ash and Lab upgrades, tips already seen, and the card collection: each heroine's lifetime kills, runs, best stage and bond, plus medals and the best Endless stage. Nothing leaves the device.

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
