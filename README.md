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
4. During a wave, tap a face in the slim strip under the field to fire that heroine's ability. Drag a heroine to move her; double-tap her to let her roam again.
5. Clear stage 100 to win. Every 10th stage is a boss (four bosses rotate). Stage 100 is the Last King. Pause, mute, and restart sit in the top bar. Restart asks first.

Keyboard: during a wave `1`–`6` fire abilities (Vera, Roxie, Lila, Nyx, Sable, Wren). Between waves `1`–`4` hire and `5` Wall, `6` Aura, `7` Turret. `B` or `U` opens or closes the shop, Space starts the wave, `P` pauses, `Esc` closes the top menu (or pauses), `R` restarts, `M` mutes. With a mouse, drag and double-click work like touch.

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

Health climbs a little faster after stage 25 to keep late stages hard with the new tools.

Only one new thing is saved locally: a flag so the one-time tips are not repeated.

## Art

Heroines and zombies are the pngs in `assets/`, drawn as circles so the dark photo background is not a rectangle. New enemy types reuse those sprites and are tinted in play. Do not replace those files from the game. Display type is Passion One (`assets/OFL-PassionOne.txt`). The center building is `assets/base.png`; owned Wall, Aura, and Turret show `upgrade-wall.png`, `upgrade-aura.png`, and `upgrade-turret.png` on the yard. The ground for each region (Yard, Marsh, Chapel) is drawn in code on a seeded offscreen canvas, with only ripples, fog, and candle flames animated live.
