# Last Gate

A phone-first compound defense. The gate sits in the center. The dead walk in from every edge. Your heroines move and shoot. The yard is the whole screen. One slim top bar holds base HP, cash, ash, stage, SHOP, START WAVE (between waves only), pause, mute, and restart. SHOP drops a menu over the field with hires, base upgrades, Skills, and Lab. The game is paused while it is open. PLAY on the title screen starts the run and the music. Open `index.html` offline. No build, no CDN, no network.

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Or just open `index.html` in a browser.

## How to play

1. Tap PLAY. You start with Vera, Roxie, and $100. Hire the others when you can. The first of each name is the hero. Further copies are the same kit at a lower rank. They walk and shoot on their own. Squad cap is 10.
2. Tap SHOP to hire and upgrade (the run freezes while the menu is open; new hires appear beside the gate). Close it, then press START WAVE in the top bar. Zombies come from all four edges toward the gate. Base HP is on the top of the yard and on the gate itself. If it hits 0, the run ends.
3. After a stage, a card names the next one and any new enemy. Pick a perk when it is offered (every 3 stages). Continue, spend cash, then start the wave yourself. It does not auto-start.
4. Clear stage 100 to win. Every 10th stage is the Graveking. Stage 100 is the finale. Pause, mute, and restart sit in the top bar. Restart asks first.

Keyboard: `B` or `U` opens or closes the shop, `1`–`4` hire, `5` Wall, `6` Aura, `7` Turret, Space starts the wave, `P` pauses, `Esc` closes the top menu (or pauses), `R` restarts, `M` mutes.

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
| Graveking | 10, then every 10th | Boss. Huge, hard to slow, brings a court. |
| Crawler | 12 | Small, fast, and they swarm. |
| Elite | 16 | Not a species. A tougher tinted copy mixed into later waves. |
| Spitter | 18 | Stops short of the gate and fires a slow glob at it. |
| Shrieker | 26 | A wail that speeds up nearby zombies. |
| Bloater | 34 | Bursts on death. Hurts the gate if it pops close. |

Perks show up on the between-stage card after stages 3, 6, 9, and so on. The same perk can be taken again later in a long run. A loss or a win shows stage reached, kills, and cash earned.

## Art

Heroines and zombies are the pngs in `assets/`, drawn as circles so the dark photo background is not a rectangle. New enemy types reuse those sprites and are tinted in play. Do not replace those files from the game. Display type is Passion One (`assets/OFL-PassionOne.txt`). The center building is `assets/base.png`; owned Wall, Aura, and Turret show `upgrade-wall.png`, `upgrade-aura.png`, and `upgrade-turret.png` on the yard. The ground for each region (Yard, Marsh, Chapel) is drawn in code on a seeded offscreen canvas, with only ripples, fog, and candle flames animated live.
