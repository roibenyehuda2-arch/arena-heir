# Project status — 2026-09-11

## Colosseum combat — published and verified

Combat was rebuilt around the user's direct feedback. The forest wallpaper and bottom action dock are gone from live duels. Fights now use the illustrated Ember colosseum with stands, walls, banners, a broad sand floor, a 30-space logical arena, dynamic close/far camera, crowd motion and dust. Fighters stay large while later boots produce longer logical jumps and visibly higher arcs.

Controls are accessible circular HTML buttons projected beside the player. At range they show Advance, Jump, Charge, Showboat, Guard and Rest; in melee they switch to Quick, Strike, Heavy, Shove, Guard and Retreat, with ranged and magic techniques in a separate nearby cluster. Energy, hit chance, disabled reason and full descriptions remain available to touch, pointer, keyboard and screen readers. The old opaque bottom strip no longer reserves or covers arena space.

Charge and Shove add the missing positional drama. Charge crosses a large distance, attacks on arrival, nudges the rival and can break Guard; Shove trades damage for strong knockback and guard break. Heavy now breaks Guard, knocks back and creates an exposed punish window on a miss. Rest and Showboat also expose the player, while Guard has a cooldown. Explicit miss/block/Aegis/knockback events now drive the correct sound and effects; recoil, dust, critical shake and a persistent two-line turn recap prevent the player's action from disappearing under the immediate AI reply.

Save compatibility is unchanged: `arena-heir-duels-v1`, version 1. Old 0–18 positions remain valid within 0–30; missing `exposed` and recap fields normalize on load. Automated coverage now includes expanded bounds, long Charge movement without crossing, late-boot jump growth, exposure accuracy, Shove guard break/knockback, miss events, Heavy exposure, contextual control markup and absence of the bottom dock. The complete npm chain passes, including all three level-9 Crown completions, market/fitting tests, retained prototypes and legacy saves. All seventeen production syntax checks and whitespace checks pass.

Cloud Chrome visual QA covered desktop 1365×936, phone 390×660 and narrow 320×568 views, including far and melee control clusters. The inspection corrected button-on-fighter, HUD/crowd/recap and narrow-screen clipping regressions. There was no horizontal action clipping in the final frames and no application console error observed. These are browser dimensions, not a physical iPhone or Safari performance test.

Verified publication: release `f292c137b803ad55cf2dbf3632aeb5e6dbade9ac` was pushed to `main` without force and deployed by the authorized GitHub Pages workflow. The public entry returned the `colosseum-combat-6` marker; `index.html`, `duel.js`, `duel-engine.mjs`, `duel.css`, `arena-art.mjs` and `woods-art.mjs` matched the release checkout byte-for-byte. Cloud Chrome opened the public URL and confirmed the live title and marker. The preserved Sites identity remains untouched.

---

# Project status — 2026-09-11

## The roaring arena — deployed; live page not independently verified this session

Duels were arithmetic: damage was computed before the click and printed on the button, the only randomness was one hit roll, and three rival names cycled forever. Research into why Swords and Sandals 2 held players identified four load-bearing hooks. Two already existed here and were left alone — three staggered unlock clocks, and legible odds on every action. Two were missing and are now built.

Every duel carries a crowd meter that starts bored at 10 and moves only on what the player does: taunts, critical blows, heavy strikes and spells wake it, while resting, retreating and missing bore it. Above 25 the crowd pays a bonus purse reaching half the base reward at 100. Taunting costs no energy, recovers 10, is barred within melee reach, holds a one-turn cooldown, and rattles the rival's next physical attack by 12 accuracy points. Critical blows land on any damaging attack at 9% plus 3 per point of stride advantage, clamped 4-30%, for 1.6x damage; the button keeps showing ordinary damage so the odds stay honest.

Rivals became a named gallery of twelve, each with an epithet, a spoken line and one of six fighting styles with its own decision ladder, so a bulwark turtles, an archer makes room and a showman spends turns working the crowd against the player. The roster cycles deterministically by serial. Wins are remembered in an optional record and surfaced in town and before a rematch. Tournament opponents gained the same identity. The city now answers the question a shop should answer, reporting how a previewed item changes the fight ahead in clean blows against the rival warming up in the arena. The nine committed CC0 clips, present since Crownlands but never played by the live game, now drive swings, impacts, blocks, footsteps and victory, with crowd ambience scaled to the meter and a Sound toggle.

Balance was measured rather than asserted. Over fourteen-fight runs per class, efficient play reaches a crowd of 21-29 and inflates gold 2-5%, while taunting whenever legal reaches 49-58 and inflates 15-17% at the cost of tempo and sometimes a win. The +50% ceiling is aspirational, not exploitable. No sixth attribute was added, deliberately: in Swords and Sandals 2 the Charisma taunt build grew strong enough that its own designer rebalanced it, so crowd favour here follows play rather than a stat. The equipment ladder, prices, gates and unlock levels are untouched.

QA before publication: the full npm chain passed locally, including nine new groups covering crowd scoring, taunt legality and cooldown, rattle accuracy, criticals, the named ladder, per-style AI, rivalry persistence, malformed rivalry records and resuming a save written before this release. All three classes still claim the crown at level 9. Syntax and whitespace checks passed. Chromium review at 1280x800, 430x740, 390x660 and 320x568 covered town, arena, rival, fight, crowd, result and all three shops, with zero horizontal overflow across 48 measured states; the win path was confirmed end to end at crowd 92, paying 139 gold as a 95 purse plus 44 from the crowd. The enlarged rival panel initially pushed the Fight button below the fold at 390 and 430; that regression was measured against an `origin/main` checkout and corrected until the button sits 8px higher than the baseline. This is browser dimension testing, not a physical iPhone or Safari test. A stale `phone-5` cache marker inside `arena-art.mjs` and `woods-art.mjs` was also aligned, because it made browsers fetch `market-art.mjs` twice and risked serving one copy from an old cache.

Saves are unchanged: the key stays `arena-heir-duels-v1` at version 1, and the new crowd, rattle and rivalry fields are optional and normalized on load, proven by a test that deletes them and resumes a fight mid-battle.

Deployment: the work was pushed to `claude/arena-heir-dev-aspwxl`, opened as pull request #1, and squash-merged to `main` as `06a71e9aed1c6c58185f7c3a840ddb3239981c87` at the user's explicit instruction. Actions run `34609777114` re-ran the complete regression suite and all seventeen production syntax checks on the merged commit, then deployed. The deploy job log records `pages_build_version: 06a71e9aed1c6c58185f7c3a840ddb3239981c87`, "Reported success!" and the environment url `https://roibenyehuda2-arch.github.io/arena-heir/`. Local `main` is clean and equal to `origin/main`.

Honest limitation, and a departure from the previous release: **the live page was not opened or byte-compared during this session.** This environment's egress policy answers 403 to CONNECT for `roibenyehuda2-arch.github.io:443`, so no HTTP client here can reach the published site. Deployment success rests on GitHub's own deploy report, not on a fetch of the live files. The `roaring-arena-1` marker and the changed production files should be confirmed against the live site from an unrestricted network before this release is described as verified. Next: human play feedback on whether the crowd actually changes how duels are played, and whether taunting feels worth the tempo it costs.

---

# Project status — 2026-09-11

## Aspirational market loop — published and verified

Based on a direct review of the Swords & Sandals 2 city/shop loop, the current illustrated market now connects browsing, duels and returning to town. Players can track any unowned item or spell; town, rival and result screens show exact gold, Crown, level and attribute gaps, and the goal button routes to the correct merchant/tab/item. Without a tracked choice, the city recommends the nearest purchase. Buying a goal clears it and selects the next unowned tier.

Economy corrections remove incentives to hoard or skip: equipment upgrades charge only the difference from the currently equipped tier, advanced passive bonuses accumulate, and higher tiers unlock gradually at levels 6/7/9/11/13/15 rather than arriving together. Ember and later items add class-relevant Strength/Speed/Magic/Defense gates. Higher-level post-Crown rivals now showcase advanced equipment. Existing `arena-heir-duels-v1` saves remain valid; missing, malformed or already-owned goals normalize safely without changing the save key.

Visual changes increase the desktop town fighter to approximately merchant size and make the fitting-room hero the dominant figure while keeping phone constraints. Accessibility copy now reports the actual unmet unlock conditions, shop category controls expose selected tab state, town navigation is labeled as destinations, and desktop/mobile browse instructions differ.

QA completed before publication: the full npm regression chain passed, including all three Crownfall classes, prior prototypes, 63 legacy reward cases, assets, saves and 96 fitting geometry cases. New checks cover goal suggestion/persistence, malformed-goal migration, exact Crown/level/attribute gaps, incremental pricing, cumulative bonuses, post-purchase clearing, direct goal routing and advanced rival gear. Live Chrome review covered desktop town/weapons, the 390×660 town plus Weaponsmith/Arcane Shop/Armory, Armor/Boots/Melee/Ranged/Spells, and a 320×568 narrow layout. No horizontal overflow or game error was observed; 320px short screens scroll vertically as intended. This is browser dimension testing, not a physical iPhone/Safari test.

Verified publication: release `9bb4e5a63090b5ae9c1ec838a671191ef3b6c68c` was published to `main` through the authorized GitHub Pages workflow. The live Pages entry exposed the new `market-goals-1` build, and `index.html`, `duel.js`, `duel.css`, `duel-engine.mjs` and `equipment-catalog.mjs` matched the release checkout byte-for-byte. Local `main` was clean and synchronized to `origin/main` before this documentation-only `[skip ci]` handoff. The previous Sites identity remains unchanged. Next: human play feedback on the revised purchase cadence and long-run balance; additional city services or later tournaments should be a separate expansion rather than blocking this focused market release.

---

# Project status — 2026-09-09

## Wildwoods action slice — published

Base: `ebbcec1203a798a22cfe53665fb403a9a1203c34`. User approved replacing the card-oriented start/combat with a small real-time dwarf/forest experience and visible purchased equipment. Implemented full-screen world, articulated dwarf, live movement/combos/dodge/slam, two regular enemy types and Thornkeeper, visible axe/armor fitting and purchases, pause/recovery/replay and independent local saves. Previous game preserved at `crownlands.html`.

QA: rule tests cover movement, single-impact timing, dodge, enemy damage, once-only rewards, purchases, malformed saves, replay, defeat persistence and a complete starter-gear trail. Browser inspection covered village and fitting at 320 pixels, 390-pixel layout (no horizontal overflow), 210 → 50 → 10 coin purchases of Emberfang/leather, visual equipment changes, reload retaining Emberfang/coins, and real-time combat building 48/60 power. Cloud-browser extension errors were observed; no application error identified. This is not physical iPhone testing. Temporary QA fixture excluded from production.

All final npm tests, production syntax checks and git diff whitespace checks passed. Published commit: `40a32002ab54305c6223ba524130629936d56ec9`. Actions run `34316183495` validated and deployed successfully. The public Pages entry was reloaded and verified as Wildwoods, with art loading and the live forge checked. Local main was clean and equal to origin/main after fetching the release. This follow-up documentation commit records the evidence without redeploying. Next: user feedback on movement/attack feel and equipment progression before expanding the action prototype. Limits: one dwarf, one linear forest, no jumping/parrying, enemies use simple sprite transforms; no claim of proven retention.

---

# Project status — 2026-09-08

## Crownlands release — published and verified

Started from verified GitHub main `5e604f027eae9ff3e282c1e88028ba5c096c46fc`. The user approved A2 bright chibi art with stern heroes and requested expanded combat, a coin-funded equipment shop and themed lands ending in masters. The redesign was committed and deployed as `2c1def2dd8cb3dd63ab17366d9c6f44422cde4ed`. GitHub Actions run `34267861389` completed successfully. The public Pages URL was opened in the cloud browser and the Crownlands entry and new hero cover were visually verified.

Implemented:
- New production entry `adventure.js`, deterministic `adventure-engine.mjs`, responsive `adventure.css` and `sprite-texture.mjs`; retained legacy modules/tests.
- Aster the white-haired mage, Rowan the ranger and Borin the bearded dwarf, with distinct attacks, real ranger multihits and class-specific projectiles/melee playback.
- Twelve encounters across forest, fire and magic, three masters, visible intent/forecasts, fractures, focus ultimates, perfect blocks, enrage and prolonged-fight pressure.
- Guaranteed victory coins plus extra rewards, three realm Echoes, three equipment tiers, healing tonics, camp and travel recovery.
- Original A2 cover and hero art, six enemy illustrations and three wide realm backgrounds. Enemy atlas background is keyed at runtime so enemies remain opaque.
- Version-3 local saves, explicit old-save import, stronger malformed-save rejection and confirmation before replacing an active journey.

Validation completed during development:
- New deterministic tests passed for 108 reward combinations, three complete class campaigns, volleys, forecasts without live-state mutation, cooldowns, fractures, focus, equipment, migration and invalid saves.
- New mock-DOM UI handler tests passed for combat playback, save/reload, rewards, purchases and travel. These are not visual browser tests.
- A full checkout has now been restored, including the seven legacy binaries previously missing. The full legacy tests passed locally; the earlier partial-checkout blocker is resolved.
- Cloud browser checks covered desktop opening, hero selection, map and live combat, plus 320/390 CSS-pixel layouts and master combat. The inspection found translucent enemies and health displays overlapping heads; fixes were applied. Final browser recheck passed: health displays no longer obscure heads, enemies are opaque, and 320/390 layouts have no horizontal overflow. A dwarf skill/ultimate victory, coin reward, Ironbark axe purchase (210 to 165 coins), save/exit and resume preserved the upgraded equipment and coins.

The temporary QA fixture and unused background atlas were removed from production. Asset tests check WebP headers, the production entry and preservation of enclosed white sprite details.

Final validation: complete `npm test`, production syntax and whitespace checks passed locally. GitHub CI repeated all tests and syntax checks successfully and deployed `dist`. Release commit was pushed through the GitHub connector without force; local staged tree matched the uploaded tree, fetch completed, and local main was clean and equal to origin/main (0 ahead, 0 behind). This follow-up documentation-only commit records deployment evidence with `[skip ci]`.

Next task: gather play feedback on pacing and difficulty; consider authored animation frames and more distinct ordinary enemies. No known release-blocking issue remains from the completed checks.

Known limits: six enemy images across twelve encounters, single-pose transform-based character animation, statistical gear rather than outfit changes, linear English-language campaign. No physical-phone performance test or external human playtest is claimed. Balance simulations do not establish enjoyment or retention.

## Last verified published version

Existing public URL: https://roibenyehuda2-arch.github.io/arena-heir/ . The previous illustrated game was deployed from `27322ebc31deedec8f43311294993be06fb0b70b`, workflow run `34227951288`, attempt 2. Validation/deployment succeeded and HTTP 200 with the previous `game2d.js` entry was verified. The following `5e604f027eae9ff3e282c1e88028ba5c096c46fc` checkpoint changed documentation only.

The user explicitly approved making the repository public and selected GitHub Actions for Pages. Future main pushes deploy after validation; no extra provider token is needed. GitHub is the source of truth. Both ChatGPT accounts should alternate after verified handoffs, not edit main concurrently.

## Preserved history and hosting

Original tracked import was verified at `5d67b392be99d7c13568f88663d0f54c5f2fa15a`; the first-account handoff referenced `91d81b839cc564dd36679efe4d5792a2ea1cce4a`. Earlier work corrected hero-aware action descriptions and added legacy journey tests. Those mechanics now remain in retained legacy code, not the Crownlands production entry.

The original Sites URL https://arena-heir.roibenyehuda2.chatgpt.site is the older 3D version. Project `appgprj_6a9e6739409c81919c47b225588b2280` is inaccessible from this account. Its `.openai/hosting.json` identity remains unchanged; no replacement Site or history merge was made. Browser saves do not automatically transfer between Sites and Pages.

Shell push authentication was historically unavailable; the supported GitHub connector can publish Git objects with a non-forced main update. Public fetch now works and the full checkout is available. Verify the actual push method and resulting HEAD at release instead of assuming credentials exist.

## Stage 1: The First Crown — 2026-09-09

Implementation: three selectable articulated classes; paired opponent selection and free reroll; class/equipment stat comparisons; real-time jumps, melee combos, ranged and magic attacks, timed parries; five-win route and master; permanent Thornkeeper unlock separate from fresh-run equipment and coins. Five shop categories with preview, purchase/equip and reward-free training. Previous forest preserved at wildwoods.html. English interface throughout.

Validation: full npm test passes, including actual six-fight timing-aware engine simulations for dwarf, ranger and mage; damage timing, jump avoidance, frontal projectile parry, magic cost/cooldown, purchases, malformed saves, unique rewards, early-master rejection, training exclusion, master unlock and fresh-run starter gear. Read-only agent audit prompted fixes for reset persistence, overlapping input sources, projectile guard direction and unused opponent names.

Browser QA: Chrome preview at 320/390 iframe widths; fighter selection, opponent reroll and countdown, purchase (500 → 475 test coins), reload retaining equipment, training magic causing damage (125 → 118), pause/retreat and fresh-run confirmation persisting after refresh. No application errors observed; browser extension metadata errors excluded. Physical iPhone/Safari and simultaneous multi-touch not tested. Full six-fight completion verified in engine simulation, not manual browser play.

Known scope: one bounded route, not multiple new realms; Thornkeeper currently reuses recolored dwarf art. Several equipment tiers share silhouettes; mage/ranger armor uses color changes rather than individual new garments. Timing/difficulty and visual progression need player feedback before expansion. Earlier prototype saves intentionally remain separate.

Deployment: published release `d2442017ba7d3a9f06a31436224ef9f5dee7bb7f` on GitHub main. Actions run `34384671885` completed both validation and deployment successfully. Live HTTP entry verified as The First Crown with arena.js. Full npm tests and production syntax/whitespace checks passed again during handoff; staged tree matched the GitHub release tree exactly and local main was synchronized cleanly. Sites manifest and inaccessible original Sites identity remain unchanged. Next task: player feedback on combat feel, then distinct equipment visuals and additional realms after approval.

## Turn-based Crownfall — 2026-09-10

Replaced the live entry with one-action turns and automatic rival replies, a larger positional arena, contextual energy/accuracy controls and distinct purchased spells. Added an original illustrated town with separate shops, single-rival selection, gold loss without run loss in ordinary duels, level/attribute allocation after every win, and a voluntary level-3 three-fight tournament. Tournament defeat ends the run; master victory unlocks higher equipment for purchase and permanent Thornkeeper selection. Dwarf starts with only an axe. Shop previews include isolated reward-free practice. Prior prototype and all prior saves remain available.

Validation: full npm test, including new rules tests and actual full duels/tournaments for dwarf, ranger and mage, plus mock-DOM UI handlers for town, single opponent, player/AI turns, saves, purchases, isolated practice and tournament entry. Tests cover invalid/out-of-turn actions, sleep/cooldowns, ordinary vs tournament loss, attribute gates, unique settlement and persistent master unlock. Production syntax and whitespace checks pass. These are automated engine/UI checks; this redesign has not received a fresh manual browser/mobile visual pass or physical-phone testing. Player feedback is still needed on balance and feel. Town art is original; character/equipment art reuses the earlier rigs, with some shared tier silhouettes. One tournament only; future lands remain out of scope.

Release: prepared for authorized GitHub main / Pages deployment; verification recorded below after release. Existing Sites manifest unchanged. Next task: player feedback on turn flow, jump usefulness, pacing, shop presentation and combat readability before expanding content.

Verified publication: release `0d2b117937dc2803699d844b9aa0545693beb3f5` on main; Actions run `34471573540` completed validation and deployment successfully. Live GitHub Pages returned HTTP 200 with byte-for-byte matches for index.html, duel.js, duel-engine.mjs, duel.css and the new town.webp. Local main was synchronized cleanly to the published release. This subsequent handoff note changes documentation only [skip ci].

## Living town and visual market — 2026-09-10

Implemented an enlarged town fighter, walking to shops/plaza positions, three separate merchant characters, ambient sparks and shop lighting. New interior scenes for weaponsmith/arcane shop/armory; named sellers with idle motion and contextual dialogue. Replaced text-only stock with illustrated tier shelves and category tabs. Selecting merchandise shows its large image, price, real stat changes and an on-character fitting; purchased appearance persists through the existing gear save. Four distinctive tiers now cover axes, swords, staffs, bows, heavy armor, boots, ranger leather and mage robes; spell icons distinguish all five spells. Required original assets were prepared by an asset-only subagent and integrated by the owning agent.

Validation: full npm test and syntax/whitespace checks pass. Extended existing mock-DOM shop flow checks for the four-tier shelf, locked-item preview without mutation, purchase, starter comparison, returning to equipped gear and ranged-category selection. Prior combat/tournament regressions also pass. Inspected generated atlases and integrated asset mappings. No fresh browser screenshots or physical-mobile playtest were performed in this iteration. Combat rules, prices and save keys are unchanged. Weapon size and costumes now share the shop illustrations; some ranged items reuse class weapon artwork. Shopkeepers use layered idle motion, not bespoke skeletal animation.

Deployment: prepared for authorized GitHub Pages release, with verification to be appended after publication. Next task: user review of city proportions, merchant presence, item readability and tier differences before moving on to combat.

Verified market release: `9c652bfb50bb55a0c244800991e4153ad2a52f57` published on main. Actions run `34474174729` completed validation and deployment successfully. After an initial usage-limit interruption, the live HTTP verification completed: index.html, duel.js, duel.css, market-art.mjs, arena-art.mjs, woods-art.mjs and all four new WebP atlases returned HTTP 200 and matched the checkout byte-for-byte. This verifies published files, not a manual browser visual/playtest. Local main was clean and synchronized to the release. This handoff note changes documentation only [skip ci].

## Phone-first expanded market — 2026-09-10

Added 16 purchasable equipment items per class (28 total equipment + five existing spells), including Ember/Tide/Storm/Dragon series, class-specific names, real passive stat bonuses, crown/level gates, and existing-save support through tier 7. Original 32-item art atlas supplied by the asset-only subagent; integrated explicit variable row crops. Reworked the mobile shop around a fitting stage, swipe shelf and visible purchase controls; shortened merchant copy, automatically previewed the next unowned item, and reduced the town fighter by about 20%. Dedicated fitting weapon pose fixes the reported weapon/body overlap and keeps wide weapons within the preview.

Validation: full npm test, syntax and whitespace checks pass. Added new-tier purchase/lock/bonus/save tests and 96 actual articulated-renderer bounding checks across three classes, eight tiers and 320/360/390/430 widths. Existing mock-DOM shelf check updated to eight entries. Previous all-class tournament regressions still pass. This verifies rules/UI handlers and rendering geometry; no fresh browser/mobile visual QA or physical-phone test was performed. Existing tier 0–3 stats/prices and save keys remain stable. Deployment verification will be recorded after the authorized main release. Next task: player review of the phone shop, fitting clarity and the expanded catalog before returning to combat.

Verified expanded-market publication: release `ad57ed68098c199a9b670d826a741e0d0ead2baf` on main; Actions run `34511228677` completed validation and deployment successfully. Live HTTP verification returned 200 and byte-for-byte checkout matches for index.html, duel.js, duel.css, duel-engine.mjs, equipment-catalog.mjs, market-art.mjs, arena-art.mjs, woods-art.mjs and equipment-legends.webp. This confirms served files, not browser/mobile visual QA. Local main was clean and synchronized to the release. This handoff entry changes documentation only [skip ci].


## iPhone screenshot corrections — 2026-09-11

Replaced conflicting accumulated market media rules with one mobile layout. Every shelf card is a nonshrinking 132px item; names and prices no longer collapse into the first three grid tracks. Selection preserves shelf scroll. The fitting stage, readable shelf and purchase panel fit the checked 390×660 and 430×740 phone frames; short 320×568 screens scroll vertically. Mobile merchants have compact name labels so dialogue cannot cover their bodies; desktop dialogue remains. Town buildings retain their aspect ratio, foreground ground is extended separately, the fighter is smaller, and four shops/arena controls use a reachable two-column bottom navigation. Other backgrounds use proportional cover cropping. Held equipment now follows the extended arm in fitting poses. English copy, gear catalog, combat, prices and saves remain intact.

Validation: full npm test, production syntax and whitespace checks pass. Actual Chrome browser screenshots reviewed at 390×660 (town, weapons and Dragonjaw preview), 320×568 (narrow shop), 430×740 (arcane and armor), and 1024×768 (desktop armor). Browser confirms all eight equipment cards and all five spell cards are 132px on phones; selecting Meteor preserves horizontal scroll (283px). No game errors observed; browser extension metadata errors are unrelated. Temporary QA iframe removed from dist before release. This is browser QA at phone dimensions, not a physical iPhone/Safari performance or touch test.

Deployment: prepared for the authorized GitHub Pages release; verification will be recorded after publication. Next task: user checks the revised shops on the actual phone before further combat work. Original inaccessible Sites identity retained.

Verified phone-fix publication: release `fe85ca2776c77f553fd0d3dc0e803d157c7273cb` on main; Actions run `34563719690` completed validation and deployment successfully. Live GitHub Pages returned HTTP 200 and byte-for-byte checkout matches for index.html, duel.css, duel.js, arena-art.mjs and woods-art.mjs. Main was clean and synchronized to the release. Local browser QA preview was stopped. This follow-up note changes documentation only [skip ci].
