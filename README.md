# Last Gate

A phone-first base defense. The compound sits in the center. Zombies walk in from every edge. Your heroines move and shoot. Open `index.html` offline (no build, no network).

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## How to play

1. The green ring is the base. If it hits 0, you lose. Zombies spawn on all four edges and path straight at it.
2. You start with Vera, Roxie, and $100. Tap a heroine to hire. The first of each name is the hero. Further copies are the same kit at a lower rank. They walk; they are not towers.
3. Kills pay cash. Buy Sandbag Wall, Dread Aura, or the Sentry Turret any time during a shop beat or a wave. Levels stick for the run.
4. Press NEXT WAVE. Clear all 10 waves, including the Graveking, to win. After waves 3, 6, and 9 you pick one free upgrade.

On a keyboard: `1`–`4` hire, `5` Wall, `6` Aura, `7` Turret, Space sends the wave, `R` restarts, `M` mutes.

## Roster

| Heroine | Cost | Ability |
| --- | --- | --- |
| Vera Voss, rifle sniper | $110 | Deadeye. She aims at the strongest zombie in range and hits harder while it is still healthy. Long range, slow. Extras are Spotters. |
| Roxie Kane, shotgun brawler | $80 | Buckshot. A short, fast blast hits several zombies in the spread (5 for Roxie, 3 for a Brawler). |
| Lila Marsh, firebug | $140 | Burn patch. She lobs fire that stays on the ground and cooks whoever stands in it. Extras are Torches (smaller, shorter patch). |
| Nyx Calder, hex warden | $120 | Hex pulse. Slows a pack. Nyx herself also stuns; a Hexer copy's stun is shorter. |

Squad cap is 10.

## Base upgrades

Bought with cash. Each has 3 levels. The button shows the level and the next cost.

| Upgrade | Costs | Effect |
| --- | --- | --- |
| Sandbag Wall | $65 / $95 / $140 | Base takes 18% / 32% / 46% less damage. |
| Dread Aura | $75 / $110 / $155 | Zombies near the gate move at 80% / 66% / 52% speed. |
| Sentry Turret | $85 / $125 / $175 | The compound shoots the nearest zombie for 11 / 18 / 28 damage. |

## Waves

1. Shamble — walkers
2. Pack — more walkers
3. Strays — walkers and runners
4. Fast Swarm — challenge: the wave moves faster
5. Bulwark — walkers and tanks
6. Crossfire — mixed
7. Armored Rush — challenge: plated brutes shrug off damage, plus runners
8. Horde — a walker flood and tanks
9. Blackout — runners and tanks
10. Graveking — boss, with an escort

After 3, 6, and 9 you pick one of three perks (damage, attack speed, move speed, a heal, a hire discount, range, more base HP, or cash).

## Art

Heroines and zombies are the pngs in `assets/`, drawn as circles so the dark photo background is not a rectangle. Do not replace those files from the game. Display type is Passion One (`assets/OFL-PassionOne.txt`).
