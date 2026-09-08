# Crownlands — current game design

## Approved direction

Original bright anime/chibi fantasy with MapleStory as a high-level reference, not copied characters or assets. The approved A2 direction balances childlike proportions and saturated worlds with serious expressions: a white-haired male mage, a female ranger and a bearded dwarf carrying an axe. Keep opening, characters, worlds and combat coherent; do not return to 3D without user instruction.

## Campaign and heroes

Twelve linear encounters, four per realm: Mosswhisper forest, Cinderpeak fire and Astral Isles magic. Each realm ends with its master: Thorncrown, King Cinderhorn and The Hollow Magister. Forest patterns introduce shielding; fire emphasizes telegraphed heavy blows; magic adds double attacks and life drain.

Aster (`miri`) has 100 HP and armor-piercing spells. Rowan (`suri`) has 94 HP, a two-hit skill, three-hit ultimate and +8 next damage after Evade. Borin (`tovin`) has 120 HP, 2 innate armor, stronger Guard and 8 shield from his axe skill. Historical IDs remain stable for migration. These replace the former hero identities and positional combat rules in production.

## Combat

Six primary actions: basic attack, class skill, Guard, Evade, Catch breath and ultimate. Six energy points; attack/Guard restore one, Catch breath restores three, skill/Evade cost two. Skill and Evade are unavailable for the next two actions. Intent and forecasts are computed from the same deterministic engine as real outcomes; animation consumes events and cannot change results.

Skills add a fracture; three interrupt the enemy. Attacks build 20 focus, skills 25, Guard against an actual attack 10 plus 20 for a perfect block. Catch breath and guarding a non-attack do not farm focus. Other active non-ultimate moves build 20. At 100 focus the ultimate consumes the meter, pierces defenses and interrupts. Perfect Guard primes +8 next damage; Evade avoids only the first hit and primes +5 (+8 for Rowan). Shield is shared across hits that turn; armor applies per hit.

Masters enrage at half HP, increasing attacking intent damage by 20%. Prolonged fights add +2 attack pressure every five turns, capped at +8; the intent displays this. Enemies can strike, shield, double-hit, drain life or wind up a heavy attack. Exact values live in `adventure-engine.mjs`, not this document.

## Rewards and equipment

Every win grants coins automatically: 25 + 3 × zero-based encounter index, or 65 + 3 × index for masters. Then choose one extra reward, including after the final master: coins (35/50/65 by realm), +8 maximum HP with 18 healing, or the realm Echo if not already learned. Ironroot blocks 25 and heals 12; Cinder burst deals 30 base damage, ignores half shield and fractures; Astral siphon deals 24 piercing base damage and heals 16. Up to three unique Echoes, with energy costs and cooldowns.

The shop is available on the map and at camp. One equipment tier unlocks per realm. Weapon bonuses are +4/+9/+15, armor +2/+4/+7 and health charms +12/+26/+42; higher tiers replace the slot's previous bonus rather than stacking all tiers. Prices are 45/85/135 coins; named weapons match the selected class. A tonic costs 18 and heals up to 35. New runs start with 30 coins. Travel restores 20 HP, or full health after a master.

## Persistence

State version 3 uses `arena-heir-crownlands-v3`. If absent, import the historical `arena-heir-v1` key without overwriting that backup. Migration preserves name, coins, aggregate weapon/armor bonuses and bounded HP. Old rounds 0–3 retain their index and 4–6 become 5–7. Active battle/reward saves restart from the map; camp and ended journeys retain their stage. Any previous learned move list maps to Ironroot because the new abilities differ. Old completed journeys may retain their legacy completion even before encounter 11.

New saves validate stage consistency, known heroes/Echoes, integer turn/cooldowns/equipment tiers, bounds and active health. Invalid data is rejected. New-run confirmation protects an existing active Crownlands save. Saves are local to a browser origin; neither GitHub nor switching ChatGPT accounts transfers gameplay progress.

## UX and limits

Keep intent, forecast, health and controls readable at narrow widths. Large touch controls, purchase feedback, disabled unaffordable/locked actions, save feedback, optional audio and reduced motion are part of the implementation. Visual targets include 320 and 390 CSS pixels; physical-phone testing is separate.

Three normal-enemy silhouettes are reused within their realms; three masters have unique art. Characters use single-pose transform animation with separate projectile/impact effects. Equipment is statistical and displayed in UI, not modular costume art. No branching story scenes, multiplayer, cloud saves, monetization or proven retention. The linear campaign and balance need human playtesting before claims of enjoyment or addictiveness.
