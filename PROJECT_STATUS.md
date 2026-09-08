# Project status — 2026-09-08

## Crownlands development checkpoint — release pending

Started from verified GitHub main `5e604f027eae9ff3e282c1e88028ba5c096c46fc`. The user approved A2 bright chibi art with stern heroes and requested expanded combat, a coin-funded equipment shop and themed lands ending in masters. The current redesign is in the working tree; final QA, commit, synchronization and deployment are in progress. Do not describe Crownlands as published until the release evidence below is updated.

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

Remaining before release: run final complete tests/syntax/whitespace checks, commit/push normally, verify a clean local tree equal to origin/main, then verify the Pages workflow and live entry/assets. Record final evidence rather than treating earlier checks as proof of the final revision.

Known limits: six enemy images across twelve encounters, single-pose transform-based character animation, statistical gear rather than outfit changes, linear English-language campaign. No physical-phone performance test or external human playtest is claimed. Balance simulations do not establish enjoyment or retention.

## Last verified published version

Existing public URL: https://roibenyehuda2-arch.github.io/arena-heir/ . The previous illustrated game was deployed from `27322ebc31deedec8f43311294993be06fb0b70b`, workflow run `34227951288`, attempt 2. Validation/deployment succeeded and HTTP 200 with the previous `game2d.js` entry was verified. The following `5e604f027eae9ff3e282c1e88028ba5c096c46fc` checkpoint changed documentation only.

The user explicitly approved making the repository public and selected GitHub Actions for Pages. Future main pushes deploy after validation; no extra provider token is needed. GitHub is the source of truth. Both ChatGPT accounts should alternate after verified handoffs, not edit main concurrently.

## Preserved history and hosting

Original tracked import was verified at `5d67b392be99d7c13568f88663d0f54c5f2fa15a`; the first-account handoff referenced `91d81b839cc564dd36679efe4d5792a2ea1cce4a`. Earlier work corrected hero-aware action descriptions and added legacy journey tests. Those mechanics now remain in retained legacy code, not the Crownlands production entry.

The original Sites URL https://arena-heir.roibenyehuda2.chatgpt.site is the older 3D version. Project `appgprj_6a9e6739409c81919c47b225588b2280` is inaccessible from this account. Its `.openai/hosting.json` identity remains unchanged; no replacement Site or history merge was made. Browser saves do not automatically transfer between Sites and Pages.

Shell push authentication was historically unavailable; the supported GitHub connector can publish Git objects with a non-forced main update. Public fetch now works and the full checkout is available. Verify the actual push method and resulting HEAD at release instead of assuming credentials exist.
