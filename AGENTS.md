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

The user approved GitHub Pages as the new hosting target, with a new URL, on 2026-09-08. `.github/workflows/pages.yml` runs tests on a full checkout and deploys `dist` on pushes to main or manual dispatch. Once Pages is enabled, a push to main also authorizes that configured deployment. Preserve repository privacy; never make the repository public without explicit permission. Pages must be enabled in repository Settings > Pages with Source: GitHub Actions; availability for this private repository depends on the GitHub plan. Verify Actions deployment success before calling the game live. Existing Sites identity and deployment remain untouched. Browser saves belong to an origin and will not automatically transfer to the new Pages URL.

Production entry: dist/game2d.js; deterministic rules: dist/engine.mjs; presentation: dist/combat.js. Preserve saves through explicit migrations. Do not change mechanics merely to pass tests. Keep indexing disabled.

Deploy-only requests: no redesign, review, upgrades or source changes. Deploy the approved synchronized commit to the existing .openai/hosting.json project, following Sites instructions and preserving access settings. If Site access is missing, report it; never create a replacement Site. Editing alone does not authorize deployment.
