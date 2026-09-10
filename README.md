# Arena Heir: The First Crown

The current entry is Stage 1: choose a dwarf, ranger or mage, compare opponents, fight in real time, upgrade equipment and unlock Thornkeeper. See the current playable slice below. Earlier Wildwoods and Crownlands prototypes remain at `wildwoods.html` and `crownlands.html`.

## Source of truth and release

Repository: https://github.com/roibenyehuda2-arch/arena-heir — branch `main`. Read `AGENTS.md`, `GAME_DESIGN.md` and `PROJECT_STATUS.md` before working. Both ChatGPT accounts use this repository and alternate only after a verified pushed handoff.

Existing public game URL: https://roibenyehuda2-arch.github.io/arena-heir/ . See PROJECT_STATUS.md for the latest Wildwoods publication status; see PROJECT_STATUS.md for the verified release commit and workflow evidence. The user enabled GitHub Actions as the Pages source and approved the public repository. Main pushes run the full tests and syntax checks, then deploy only `dist` through `.github/workflows/pages.yml`.

The old Sites URL https://arena-heir.roibenyehuda2.chatgpt.site is an earlier 3D version. Preserve `.openai/hosting.json`; no replacement Sites project is needed.

## Run and validate

Node 22.12+ and npm (CI uses Node 24):

```sh
npm ci
npm run dev
```

Open Vite's printed URL. Production is static `dist/`, with no build step. Use HTTP rather than opening files directly.

```sh
npm test
node --check dist/woods.js
node --check dist/woods-engine.mjs
node --check dist/woods-art.mjs
node --check dist/adventure.js
node --check dist/adventure-engine.mjs
node --check dist/sprite-texture.mjs
node --check dist/game2d.js
node --check dist/action-info.mjs
node --check dist/combat.js
node --check dist/engine.mjs
git diff --check
```

Tests cover Crownlands rules and UI handlers, as well as retained legacy engines, presentation, rigs, 3D and assets. Mock DOM checks and deterministic campaigns do not replace visual browser QA or human playtesting.

## Previous Wildwoods action slice

`woods.js` owns Canvas rendering, keyboard/touch input, native pause dialogs and the equipment fitting screen. `woods-engine.mjs` runs fixed 60 Hz updates; `woods-art.mjs` animates separate generated head, torso, arm, leg, axe and armor layers from `assets/crownlands/dwarf-parts.webp`. `woods.css` fills the viewport without a card-based start screen.

Use A/D or arrows to move, J to attack, K/Space to dodge, L for the 60-power slam, E for the forge and Escape to pause. Touch controls support simultaneous movement and attacks. Hold Attack for a three-hit combo; the third hit and slam interrupt enemies. Normal hits do not automatically cancel a telegraphed attack.

Three axes (starter, Ironheart, Emberfang) and two purchasable armor upgrades (leather, steel) are visible before purchase and on the hero afterwards. The short forest contains five regular foes of two types and one Thornkeeper. Returning home restores health; clearing the trail enables another run with retained gear.

Wildwoods saves use a separate `arena-heir-wildwoods-v1` key. They preserve coins, gear, defeated enemies and position; closing after defeat safely resumes in the village. Old campaign saves remain untouched and can be opened through the pause menu.

## Previous adventure files

- `dist/crownlands.html`, `dist/adventure.js`: screens, controls, persistence and event-driven combat playback.
- `dist/adventure-engine.mjs`: deterministic campaign, combat, forecasts, rewards, shop and save migration.
- `dist/adventure.css`: responsive layout, character motion and reduced-motion treatment.
- `dist/sprite-texture.mjs`: removes edge-connected white enemy-atlas background at runtime while retaining enclosed white details.
- `dist/assets/crownlands/`: optimized original generated WebP cover, hero/enemy sheets and three wide realm backgrounds.

Legacy illustrated and 3D modules/assets remain checked in for regression coverage and history. They are not loaded by the new entry. Keep existing third-party licenses with their assets.

## Previous campaign: playing and saving

Three realms each contain three rivals followed by a master. Each hero has distinct attacks and skills. Six primary actions have keyboard shortcuts 1–6; enemy intent and action forecasts expose the upcoming tradeoff. Fractures, perfect guards, focus-powered ultimates and three learnable realm Echoes add tactical choices. Coins earned on every victory fund three tiers of weapons, armor and health charms, plus healing tonics.

Progress saves locally after actions, purchases, reward choices and travel. The new key is `arena-heir-crownlands-v3`. Existing `arena-heir-v1` saves are imported when no new save exists; the old key remains untouched. Earlier coins and aggregate upgrades are preserved, but active fights restart at the map and old learned moves become Ironroot rather than preserving incompatible mechanics. See GAME_DESIGN.md for migration details. Starting over an active run requires confirmation.

Saves are browser/device/origin-local. GitHub synchronizes code, not player saves. There are no player accounts, backend, ads or payments. Audio is optional synthesized sound.

## Limits

Wildwoods is one linear ground-level forest slice with one playable dwarf, not all three heroes/realms. The hero uses articulated bitmap parts; enemies use simpler single-sprite motion. No jump/platforming, shield/parry system, new story or physical-phone performance test is claimed. Human feedback on the feel is the next step.

Previous campaign limits:

Twelve encounters use six enemy illustrations: one regular-enemy silhouette per realm and one unique master per realm. Characters have one illustrated pose animated with transforms, projectiles and impact effects; this is not a full authored frame-animation system. Gear changes statistics and its shop/equipment display, not the character's outfit. The campaign is linear and the UI is English. Physical-phone performance and external human enjoyment/retention remain unverified. Browser emulation is not physical-device testing.

## Current playable slice: The First Crown

Entry: `dist/index.html` / `arena.js`; rules: `arena-engine.mjs`; canvas art: `arena-art.mjs`; styling: `arena.css`.
Choose a class, compare two opponents or reroll, win five arena fights, then defeat and unlock Thornkeeper. Shop previews and a training partner let you test upgrades without spending coins. English UI; touch controls and A/D, Space, J/U/L/K keyboard bindings (help in pause menu).

Validation: `npm test`, `node --check dist/arena.js`, `node --check dist/arena-engine.mjs`, `node --check dist/arena-art.mjs`. Browser QA should cover 320/390 widths, purchase/reload, training, pause/retreat and new-run confirmation. Preserve the older forest at `wildwoods.html` and the previous adventure at `crownlands.html`.

## Current release: Turn-based Crownfall

Open `dist/index.html`: illustrated town, one-rival duels, one action per turn and class-specific shops. Every victory grants gold, a level and three attribute points. Enter the optional First Crown tournament from level 3; only tournament defeat ends a journey. Win its master to unlock higher equipment and Thornkeeper for a fresh run. Dwarf begins with an axe, and must buy ranged attacks and spells. The previous real-time prototype remains at `realtime.html`.

Validation: `npm test`, `node --check dist/duel.js`, `node --check dist/duel-engine.mjs`, `git diff --check`. New tests include all-class tournament simulations and mock-DOM UI handlers; these do not replace manual browser/mobile playtesting. Saves remain in this browser; older prototype saves are retained under their original keys.

The current market uses `market-art.mjs` with original merchant, interior, equipment and spell atlases. Browse visual tier shelves, preview items on your fighter, and purchase with the existing gold/crown rules. `npm test` includes the market handler checks; `node --check dist/market-art.mjs` is part of release validation. Earlier prototypes retain their original renderer behavior unless passed the new market costume option.
