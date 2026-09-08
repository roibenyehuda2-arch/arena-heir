# Arena Heir: Crownlands

An original, colorful chibi fantasy game with stern heroes: Aster the white-haired mage, Rowan the ranger and Borin the bearded dwarven axebearer. Choose a hero, read enemy intent, win duels, collect coins and Echoes, buy stronger gear and defeat three regional masters.

## Source of truth and release

Repository: https://github.com/roibenyehuda2-arch/arena-heir — branch `main`. Read `AGENTS.md`, `GAME_DESIGN.md` and `PROJECT_STATUS.md` before working. Both ChatGPT accounts use this repository and alternate only after a verified pushed handoff.

Existing public game URL: https://roibenyehuda2-arch.github.io/arena-heir/ . Crownlands is published; see PROJECT_STATUS.md for the verified release commit and workflow evidence. The user enabled GitHub Actions as the Pages source and approved the public repository. Main pushes run the full tests and syntax checks, then deploy only `dist` through `.github/workflows/pages.yml`.

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

## Production files

- `dist/index.html`, `dist/adventure.js`: screens, controls, persistence and event-driven combat playback.
- `dist/adventure-engine.mjs`: deterministic campaign, combat, forecasts, rewards, shop and save migration.
- `dist/adventure.css`: responsive layout, character motion and reduced-motion treatment.
- `dist/sprite-texture.mjs`: removes edge-connected white enemy-atlas background at runtime while retaining enclosed white details.
- `dist/assets/crownlands/`: optimized original generated WebP cover, hero/enemy sheets and three wide realm backgrounds.

Legacy illustrated and 3D modules/assets remain checked in for regression coverage and history. They are not loaded by the new entry. Keep existing third-party licenses with their assets.

## Playing and saving

Three realms each contain three rivals followed by a master. Each hero has distinct attacks and skills. Six primary actions have keyboard shortcuts 1–6; enemy intent and action forecasts expose the upcoming tradeoff. Fractures, perfect guards, focus-powered ultimates and three learnable realm Echoes add tactical choices. Coins earned on every victory fund three tiers of weapons, armor and health charms, plus healing tonics.

Progress saves locally after actions, purchases, reward choices and travel. The new key is `arena-heir-crownlands-v3`. Existing `arena-heir-v1` saves are imported when no new save exists; the old key remains untouched. Earlier coins and aggregate upgrades are preserved, but active fights restart at the map and old learned moves become Ironroot rather than preserving incompatible mechanics. See GAME_DESIGN.md for migration details. Starting over an active run requires confirmation.

Saves are browser/device/origin-local. GitHub synchronizes code, not player saves. There are no player accounts, backend, ads or payments. Audio is optional synthesized sound.

## Current limits

Twelve encounters use six enemy illustrations: one regular-enemy silhouette per realm and one unique master per realm. Characters have one illustrated pose animated with transforms, projectiles and impact effects; this is not a full authored frame-animation system. Gear changes statistics and its shop/equipment display, not the character's outfit. The campaign is linear and the UI is English. Physical-phone performance and external human enjoyment/retention remain unverified. Browser emulation is not physical-device testing.
