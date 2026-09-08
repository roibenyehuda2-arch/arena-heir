# Arena Heir: Crown of Echoes — current handoff

## GitHub Pages publishing

Live illustrated game: https://roibenyehuda2-arch.github.io/arena-heir/ . The user authorized making this repository public and enabled GitHub Actions as the Pages source. Full CI validation and deployment succeeded on 2026-09-08; see PROJECT_STATUS.md for evidence and outstanding mobile QA.

The user approved a new GitHub Pages URL in place of relying on cross-account Sites publishing. The existing Sites deployment is preserved.

One-time setup by a repository administrator: open Settings > Pages, select **GitHub Actions** under Build and deployment > Source, then open Actions > Test and deploy Arena Heir > Run workflow on main. If Pages is unavailable for this private repository, use a supported GitHub plan; do not change repository visibility automatically.

The workflow checks out all assets, runs the complete `npm test` suite and production syntax checks, then uploads only `dist` and deploys after validation succeeds. Future pushes to main repeat this process. No provider token or additional secret is needed. Confirm the successful deployment and its reported URL in Actions before sharing it as live. Existing local browser progress does not automatically transfer between the old Sites origin and the new Pages origin.

Read AGENTS.md, GAME_DESIGN.md and PROJECT_STATUS.md first. Central repository: https://github.com/roibenyehuda2-arch/arena-heir ; branch: main. This GitHub repository is the source of truth. The internal site remote is only a deployment mirror. Use the verified GitHub HEAD reported at handoff.

## Current installation and validation

Node 22.12+ and npm (tested on Node 24):

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Production is buildless static dist/; no build or lint script is configured. Serve over HTTP, not file://.

```sh
npm test
node --check dist/game2d.js
node --check dist/combat.js
node --check dist/engine.mjs
git diff --check
```

Production entry: dist/index.html → dist/game2d.js. Rules: dist/engine.mjs. Animation: dist/combat.js. Illustrated styles: dist/storybook.css. Art: dist/assets/art/. Hero sheets are 1536×1024, 3×2 poses (idle, windup, strike, block, hit, down); equipment atlas is 4×3. Runtime assets are checked into Git. Existing third-party licenses remain with their assets.

Browser saves are device-local and not synchronized by GitHub. No accounts/backend/ads/payments. Previous URL: https://arena-heir.roibenyehuda2.chatgpt.site — older 3D version. The illustrated game is live on GitHub Pages above. Preserve .openai/hosting.json. Publish only on explicit request from an approved synchronized commit, without development in deploy-only mode.

## Historical notes (superseded where different from the documents above)

# Arena Heir
Free single-player turn-based gladiator prototype. Static ES modules; no accounts, server, analytics, payments or ads. Progress stays in browser localStorage.

## Play
Serve `dist/` using any static HTTP server. Open index.html through HTTP (ES modules do not support direct file opening consistently).

## Validate
`node --check dist/game.js`
`node tests/engine.test.mjs`

Combat engine: dist/engine.mjs. Rendering and local persistence: dist/game.js. Seven encounters, six claimable signature moves (three equipped), reward selection, armory, victory/defeat, keyboard shortcuts, optional synthesized audio.

## Tactical arena (version 4)
Nine persistent floor positions. Leap in/back moves up to two spaces; melee needs adjacency and ranged signatures reach three spaces. Six energy points power leaps, dodge and heavy strike. Strike/guard restore one; recover restores three. Dodge has a cooldown and evades only the first hit. Enemies pursue out-of-range players instead of attacking; spell users have extended reach. Existing saves receive position and energy defaults.

The larger arena and compact action dock expose tactical controls. Tests cover boundaries, invalid actions without mutation, pursuit, energy, multihit dodge, save migration and full tournament simulations. Simulations are not human playtesting or retention measurements.

## Combat animation
Version 3 uses real nested joints, not full-body pose swapping. Original raster parts are sampled from a generated atlas and silhouette-masked in CSS. Skeleton updates shoulder, elbow, wrist, hip, knee, torso and head angles with time-based interpolation. Locomotion adds alternating leg and arm cycles. CombatDirector choreographs approach, windup, weapon swing, impact, blocking, recoil and recovery. Enemy response follows the same engine event stream; health updates at contact. Reduced-motion support and teardown prevent runaway animation loops.

Run `node tests/rig.test.mjs` for skeleton checks. Existing combat event and tournament checks remain in `tests/engine.test.mjs`.

## Limitations
Prototype balance, not playtested with external users. No claim of retention or commercial validation. Art uses a generated arena, menu atlas and articulated body-part atlas. Rivals currently share the base rig with a different palette. Earlier pose sheets are retained as source assets. Weapon upgrades currently affect statistics rather than changing character artwork. Data is local to each browser/device. Cloud Chromium QA covered an actual leap, enemy damage, a heavy strike against guard, full block and save/resume. Embedded 320px and 390px viewports were visually inspected; physical-device performance and touch testing remain unverified.

## Assets
Original generated artwork produced for this project. Google Fonts are optional; local system fallbacks work without network.

## Living arena (version 5)
Fixed a missing rival render that had left engine combat running without its opponent actor or health display. Added an animated Canvas compositor using the existing arena artwork: independently moving spectator groups, torch lighting, embers, landing dust and stronger crowd motion on impact/victory. This is a layered 2D scene, not a 3D simulation or individually AI-controlled spectators. Motion respects reduced-motion and pauses when the page is hidden. Canvas and resize observers are disposed between screens.

Screen-space fighter separation prevents overlapping silhouettes at close range without changing logical positions or combat rules. Rival palette now changes armor only, preserving natural skin. Bonus and contextual hint display were corrected.

`npm test` runs engine, articulated-rig and battle-render regressions, including both actors and rival health on a resumed run. `npm run dev` runs the optional Vite preview; production remains buildless static files in dist.

## Real 3D arena (version 6)
The default combat view now uses Three.js with actual articulated gladiator meshes, modeled swords/shields/helmets, a semicircular stone stadium, 360 instanced spectators with moving arms, directional lighting, GPU shadows, impact particles, landing dust and a distance-aware perspective camera. The deterministic turn-based engine, rewards, seven opponents and saved runs remain unchanged. The renderer and scene are reused across turns instead of creating a WebGL context for every action.

Three.js is vendored locally (MIT license included) so gameplay does not rely on a third-party CDN. If WebGL cannot initialize, a Canvas software renderer projects the same 3D models with simpler crowd meshes, flat lighting and contact shadows. This mode intentionally omits GPU shadows and targets a lower frame rate. A last-resort 2D fallback is explicitly labeled.

Validation: engine/regression tests, 3D geometry projection, spectator counts, independent joints and playback from real engine events pass. Cloud Chromium visually verified the 3D compatibility renderer, leap plus enemy damage, heavy strike plus enemy health changes, and 320/390px embedded viewport layouts. The cloud browser disables WebGL, so the hardware-rendered lighting/shadows and performance on physical phones are NOT visually verified. This is an original low-poly 3D implementation, not photorealistic art or commercially validated gameplay.

## Duel edition (version 7)
Rebuilt the combat surface around a compact, stable seven-action dock attached to the arena. Action labels include actual simulated outgoing hit damage; focus/hover descriptions include the deterministic enemy response, and movement buttons show incoming-hit risk. The combat log is collapsed. Enemy intent remains visible in the scene.

Fighters use larger faces, visible sclera/pupils/brows/nose/mouth, raised helmets, grouped finger/knuckle geometry, three-quarter facing and subtle head motion. Materials are smooth-shaded on GPU, with a darker stadium separating the models from their environment. Strike travel and recovery are shorter; contact shakes the camera unless reduced motion is enabled.

A complete turn blocked with basic Guard now primes +2 next-hit damage, never replacing a stronger bonus. Partial blocks and non-attacking turns do not earn it. This bounded combat-rule change is regression tested. Character journey/reward design is intentionally unchanged.

Browser checks: compact desktop duel, live full-block bonus and action forecasts, 320px/390px embedded mobile layouts. The cloud browser still only supports software 3D, so GPU presentation and physical-phone frame rates remain unverified. Enjoyment/retention requires user playtesting; no claim of proven addictiveness.
