# Alternating-account workflow

## Source of truth

GitHub origin/main, once configured and verified, is the sole source of truth. Work alternately, never concurrently. Read GAME_DESIGN.md and PROJECT_STATUS.md, not chat history. Do not use the unrelated My Home Priority repository.

## Start every task

1. Inspect git status --short --branch, git remote -v, branch and HEAD.
2. If origin is missing, authentication fails or the previous handoff was not pushed, stop implementation and report the blocker. Do not guess a repository.
3. Preserve dirty work. Do not automatically stash, discard, reset or pull over it. Resolve ownership and synchronization first.
4. On clean main: git fetch origin; inspect git rev-list --left-right --count HEAD...origin/main. If only behind, git pull --ff-only origin main.
5. If ahead, synchronize the previous task first. If diverged or push rejected, stop and resolve explicitly. Never force-push or reset to conceal divergence.
6. Read updated design/status documents. Confirm no unsynchronized changes and that the other account has stopped.

## End every task

1. Run README validation commands and test affected game flows. Report unavailable browser/mobile checks honestly.
2. Update PROJECT_STATUS.md: changes, checks/results, remaining bugs, next task, deployment status. Record lasting decisions in GAME_DESIGN.md.
3. Review diffs; commit task-owned code, assets and docs with a clear message. No credentials, node_modules or unrelated edits.
4. Fetch again. If origin advanced, resolve before handoff; do not overwrite it.
5. Push normally to origin main, fetch, verify HEAD equals origin/main and git status --porcelain is empty.
6. Report repository URL, branch, full HEAD, verified push, QA and blockers. Never declare handoff ready with unpushed commits or local changes.

Both ChatGPT accounts need access to the same GitHub repository. GitHub permissions, Sites permissions and in-game saves are separate. A shared branch cannot prevent concurrent edits by itself; no automatic lock is implemented. Switch accounts only after a verified pushed handoff.

## Architecture and deployment

The user authorized the repository becoming public and GitHub Pages publishing on 2026-09-08. Existing target: https://roibenyehuda2-arch.github.io/arena-heir/ . Pages uses GitHub Actions. `.github/workflows/pages.yml` validates the full checkout and deploys `dist` on main pushes or manual dispatch. A requested development release to main includes that configured deployment. Verify Actions success and the live entry before calling a release published. Do not change visibility or hosting targets implicitly.

Previous Crownlands entry: `dist/crownlands.html` → `dist/adventure.js`; deterministic rules: `dist/adventure-engine.mjs`; styles: `dist/adventure.css`; enemy texture compositor: `dist/sprite-texture.mjs`; art: `dist/assets/crownlands/`. Legacy `game2d.js`, `engine.mjs`, `combat.js`, 3D code and their tests remain for compatibility/history and are not the production entry. Do not apply legacy seven-fight or positional rules to Crownlands. Preserve saves through explicit migrations and keep indexing disabled.

Preserve `.openai/hosting.json` and its existing Sites identity. The old Sites project is inaccessible from this account; do not create a replacement Site or merge its old history. GitHub Pages is the authorized publishing path. Browser saves belong to an origin and do not automatically transfer from Sites to Pages or between devices/accounts.

Deploy-only requests authorize deployment of the approved synchronized version, not redesign or unrelated changes. Follow Sites skills when handling its manifest or hosting, while respecting the user's approved GitHub Pages target.

## Wildwoods action prototype (2026-09-09)

Current entry is `dist/index.html` → `woods.js`, with deterministic fixed-step combat in `woods-engine.mjs`, modular sprite rendering in `woods-art.mjs`, and `woods.css`. User rejected card-style combat and approved a bounded real-time dwarf/forest/visible-gear slice before expanding the full game. Keep the previous adventure reachable at `crownlands.html`; do not erase its saves. New saves use `arena-heir-wildwoods-v1`. This is a first action slice, not a completed multi-realm conversion.

## Current Stage 1 entry (2026-09-09)

Production now uses `dist/index.html` → `arena.js`, `arena-engine.mjs`, `arena-art.mjs` and `arena.css`. Read the latest Stage 1 section of GAME_DESIGN.md. Five ordinary wins plus Thornkeeper; three starter classes and one persistent master unlock. Preserve `wildwoods.html` and `crownlands.html` and all older save keys. `npm test` includes the new six-fight simulations for all three classes. New runtime art uses `class-parts.webp` plus existing modular dwarf art. Do not promise unique art per item tier yet.

## Current turn-based entry (2026-09-10)

Production now uses `dist/duel.js`, `dist/duel-engine.mjs` and `dist/duel.css`. Read the latest Crownfall design/status sections, which supersede the real-time Stage 1 rules. One action per turn; ordinary duels cost gold on defeat; optional level-3 tournament ends the run on defeat. New saves use `arena-heir-duels-v1`; preserve all earlier keys and `arena-heir-unlocks`. Prior real-time entry is `realtime.html`. New rules and mock-DOM UI tests are in the npm test chain. Keep GitHub Pages publishing and existing Sites identity as described above.
