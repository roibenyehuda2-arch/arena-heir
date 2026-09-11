# Wildwoods — current approved action direction

The user rejected card-based starts and turn-based action selection, and approved a small real-time dwarf/forest slice with visible equipment progression. Start directly in the village. The dwarf begins in simple work clothes with a worn axe. All axes and torso upgrades are previewed on the articulated character and remain visible in combat.

Current slice: horizontal movement, three-hit attack combo, dodge with invulnerability and timing reward, 60-power ground slam, five regular enemies (guard/wisp) and a final Thornkeeper. Enemy windups are visible; third combo hits and slams stagger, ordinary hits do not. Coins are granted once per foe (25 normal, 65 master), with small victory healing. A timing-aware starter-gear simulation completes the trail. Gear prices: Ironheart 60, Emberfang 160, leather 40, steel 110. Higher tiers replace lower tiers; trying items never spends money.

Art uses one modular 4×3 generated atlas for the dwarf and equipment. Separate arms/legs/weapon animate, helmet appears with steel armor. Existing forest/enemy art is reused. This is a first playable slice to evaluate before expanding heroes, lands, animation and content. Preserve the previous game at `crownlands.html` and its save keys.

Save key `arena-heir-wildwoods-v1` is independent of the old journey. Purchases and defeat rewards save immediately, progress periodically and on exit; a saved defeat resumes healed in the village with equipment and coins intact. Pause on loss of focus prevents unattended combat.

---

# Crownlands — retained previous design

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

## The First Crown — Stage 1 (2026-09-09)

The approved direction is a structured real-time arena journey, superseding free-roaming Wildwoods. Choose Borin (slow, sturdy dwarf), Rowan (fast ranged ranger), or Aster (fragile, powerful mage). Start with zero gold and tier-zero gear. Shared comparable stats are health, melee, ranged, armor, magic and speed, derived from class plus equipment. Ranger melee upgrades reinforce the bow grip for close strikes; her ranged upgrades improve arrows.

Before each normal fight, choose between two visible opponents with their class, equipment, stats and differences from your own. Reroll free. Five wins lead to Thornkeeper. Defeating him permanently unlocks him for subsequent fresh journeys; his magic slows targets that actually take damage. New journeys reset coins and equipment, retaining unlocks.

Combat uses movement, jumps, three-hit melee chains, ranged attacks, magic energy/cooldown and a short parry window. Enemy wind-ups announce melee, shot or spell. Short victory badges: Untouchable!, Perfect Dodge!, Giant Slayer!, otherwise Victory! Giant Slayer compares actual derived fighting power. No result analytics wall. Health restores between fights; defeat/retreat loses no coins and earns none.

Each class has five shop categories with five tiers (including starter). Preview equipment and test it on a stationary training partner before purchasing. Training never awards coins or unlocks. Master uses a recolored dwarf rig in this bounded slice; distinct master art, richer realm content and unique illustration for every equipment tier remain subsequent work. Current weapon silhouettes share some tiers; armor/boot upgrades use some color treatments. Do not describe the current art as a complete unique item catalog.

New save keys: arena-heir-season-one (run) and arena-heir-unlocks (persistent master unlock). Old saves remain untouched; Wildwoods remains at wildwoods.html and Crownlands at crownlands.html. Saves remain browser-local. Reloading during combat returns to opponent selection, without a partial-fight reward.

## Turn-based Crownfall — 2026-09-10 (current, supersedes real-time Stage 1)

Production is index.html → duel.js / duel-engine.mjs / duel.css. The original illustrated town has clickable Weaponsmith, Arena, Arcane Shop and Armory entrances. Preserve three class identities and permanent Thornkeeper selection. Dwarf starts with only his axe; ranger starts with blade/bow; mage starts with staff/Lightning. Each class buys its own named equipment through shared slots. Existing articulated art is reused; some tiers still share silhouettes.

Each accepted action consumes one turn, followed by one rival action. Sleep explicitly skips the rival's next turn. An 18-space arena supports advance, jump, retreat, guard, rest, quick/normal/heavy melee, purchased ranged attacks and learned spells. Reach, energy, accuracy, armor and cooldowns affect real outcomes. Buttons show cost and hit chance; unavailable moves explain range/cooldown/energy. Lightning deals direct damage; Frost also reduces movement for two turns; Sleep skips one turn; Aegis absorbs the next hit; Meteor unlocks after the crown. Health and energy refill between fights. Deterministic random state and active fights persist across refresh.

Only one rival is offered at a time; freely find another. Every win gives gold, a level and three freely allocated points in strength, speed, defense, vitality or magic. Regular defeat subtracts the listed gold up to the available balance and never ends the run. At level 3, enter the optional three-fight First Crown tournament when ready; the last rival is Thornkeeper. Shops are unavailable during the tournament, but earned attribute points can be spent between rounds. Any tournament loss ends the run. Winning the master awards 300 gold, permanently unlocks Thornkeeper, and opens Moonsteel/Royal equipment and Meteor for purchase. More ordinary duels remain available after the crown; further tournaments/lands are not built yet.

Shop previews and free practice use an isolated copy, with no rewards or purchases applied to the real run. The new save key is arena-heir-duels-v1; shared arena-heir-unlocks preserves masters earned previously. Older saves remain untouched, and realtime.html keeps the prior Stage 1 prototype available. Art source for town is an original generated illustration, not the reference game's assets.

## Living town and visual market — 2026-09-10

Town/shops are the focus of this iteration; combat rules, prices, progression and save schema stay as in turn-based Crownfall. The fighter is larger in the town, can walk across the plaza, and walks to selected shop entrances. Separate animated merchant sprites stand near the shops. Forge embers and arcane particles give subtle ambient movement.

Each shop has its own illustrated interior and named merchant: Bram the weaponsmith, Mira the arcane merchant and Tilda the armorer. Merchants sway/breathe and react through short English greetings and purchase/locked-item responses. Equipment is browsed through illustrated shelves, with melee/ranged or armor/boots tabs, a large selected-item preview, actual stat changes, and a live fitting on the fighter. Free practice remains available. Previewing locked equipment is permitted; purchasing it still requires the crown.

New original atlases provide four distinct tiers of axes, swords, staffs, bows, heavy armor, boots, ranger leather and mage robes, plus five spell emblems. Worn items are deliberately small and modest; Royal items have substantially larger silhouettes and ornament. These same equipment images are attached to the existing articulated character rigs, with held weapon sizes increasing from 74 to 235 model units. Armor and boots use class-appropriate fitted overlays. Dwarf thrown axes and mage wands reuse their class's axe/staff art. Existing character bodies remain unchanged; this is layered sprite animation, not fully animated 3D shopkeepers.

## Phone-first expanded market — 2026-09-10

The equipment catalog now has seven purchasable tiers in each of four slots: 28 equipment offers per class, plus the five existing spells. Old tier IDs, names, prices and stats remain intact. New Ember/Tide/Storm/Dragon tiers add original themed art and class-specific names (Cinder Cleaver, Coral Reaver, Thunderfang, Dragonjaw; corresponding blades, staffs, bows, wands, thrown axes and clothing). Their base prices are 360/520/800/1200 gold; ranged costs 15 more. They require the First Crown plus levels 6/9/12/15. All are visible and can be previewed from the beginning. Each equipped Ember item grants +3 spell power, Tide +12 HP, Storm +12 energy and Dragon +2 armor; the slot's normal improvement also applies. Later boots cap movement growth at +5 spaces. New gear IDs 4–7 round-trip through the existing save key without erasing earlier runs.

Phone layout takes priority: fitting scene, category tabs, a horizontally swipeable shelf and the purchase panel share the viewport. Short-height phones use page scrolling instead of clipping. Desktop uses a four-column stock grid beside the fitting room. The next unowned item is previewed automatically. The merchant remains present at smaller scale while the player's fitting occupies the center. World character size is reduced by roughly 20% from the previous market release.

Fitting uses a dedicated outward weapon pose, with aspect-preserving size limits, keeping equipment to the right of the body rather than across the face. The same catalog icons have their own large stock/selection previews. The new variable-row atlas is sliced with explicit row bands. Combat action rules and the five existing spells are not redesigned in this iteration; new equipment benefits feed the existing shared stats.


## Mobile layout correction — 2026-09-11

Phone stock uses fixed-width horizontal cards, preserving its scroll position when selecting an item. Town building artwork must keep its natural proportions; mobile town navigation sits below the scene in a two-column group. Shopkeeper name tags replace longer dialogue on narrow screens so the merchant stays visible. Desktop retains dialogue and a four-column shelf. Very short screens may scroll vertically rather than clipping purchase controls.

## Aspirational market loop — 2026-09-11

The city now carries one explicit purchase objective between visits. A player may set any unowned equipment piece or spell as the goal, including locked prestige stock. When no goal is selected, the city recommends the closest useful purchase, prioritizing unlocked items and the hero's melee weapon. Town, rival and result views show the same objective. Its progress is derived from live catalog data rather than stored prices: remaining gold, First Crown, level and relevant attribute requirements are shown independently. Entering from the goal opens the correct merchant, category and exact item. Fulfilling the goal clears it and automatically previews the next unowned item.

Equipment prices are total slot values, but an upgrade charges only the difference between the equipped tier and the target tier. Buying Ironbark before Moonsteel therefore costs the same total as saving and buying Moonsteel directly; early purchases are never punished. Advanced equipment perks are cumulative through the equipped tier, so Tide retains Ember's spell-power benefit and later tiers never silently remove earlier milestone bonuses.

The ladder is deliberately staggered: Ironbark is open immediately; Moonsteel requires the First Crown and level 6; Royal level 7; Ember level 9; Tide level 11; Storm level 13; Dragon level 15. Ember and later equipment also require a class-relevant attribute: dwarf weapons use Strength, ranger weapons use Speed, mage weapons use Magic, armor uses Defense and boots use Speed. Required values are 8/10/12/14 for Ember/Tide/Storm/Dragon. Ordinary post-Crown rivals increasingly display these higher tiers so the arena advertises future city goals.

Desktop ownership hierarchy is intentional: the town fighter is approximately merchant-sized, and the fitting-room fighter is larger than the keeper. Phone proportions remain width-constrained, with 390px layouts keeping all shop actions visible and 320px short screens scrolling vertically rather than clipping them.
