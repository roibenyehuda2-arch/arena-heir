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
