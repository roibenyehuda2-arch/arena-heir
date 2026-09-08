# Project status — 2026-09-08

## Latest development checkpoint — second account

Started from verified GitHub main 91d81b839cc564dd36679efe4d5792a2ea1cce4a after the first account stopped. GitHub remains the only source of truth; no Sites history was merged.

Changes:
- Added dist/action-info.mjs for hero-aware Strike/Crush damage descriptions, range, Guard amounts/counter bonuses and Dodge bonuses. Updated buttons, accessible labels, contextual range hint, arena reach label and help. Combat rules are unchanged.
- Forecasts now distinguish incoming hits from poison and recoil health loss.
- Added action-info and journey regressions; existing presentation test imports the new presentation helpers.

Validation:
- Hero-specific copy/forecast tests passed for all three heroes, including preservation of live state and stronger stored bonuses.
- Journey tests passed: 63 hero/round/reward combinations; final-master Echo replacement/cancel; duplicate reward rejection; weapon/armor/healing purchases; insufficient funds; travel; save/exit/reload; invalid JSON/basic invalid save rejection; legacy save migration. These run the real game UI handlers against a minimal DOM stub, not a browser.
- Existing engine (300 seeded simulations, 260 completions), rig, presentation and 3D suites passed.
- Full npm test is NOT green in this environment: legacy asset validation stops at missing knight.glb. All seven illustrated WebP assets and other downloaded files were byte-length/Git-blob-SHA verified.
- Browser/mobile QA at 320/390 remains incomplete. The supervised preview briefly became healthy, but browser transport reset and subsequent navigation was refused; preview status then reported stopped. No visual pass is claimed. Do not infer physical-device testing from simulated layout tests.

Synchronization method/limitations:
- Shell Git authentication is unavailable. The authenticated GitHub connector supplied a hash-verified partial checkout: 55 of the original 62 blobs, all tree objects and the exact main commit (original timezone +0300). History is shallow at the handoff commit.
- Seven unchanged legacy binaries could not be fetched: dist/arena.png, dist/fighters.png, dist/hero-combat.png, dist/rig-parts.png, dist/rival-combat.png, dist/assets/models/barbarian.glb, dist/assets/models/knight.glb. They remain in the Git index with skip-worktree and must remain unchanged in the remote tree. A clean status is for this partial checkout, not proof of a complete clone. Do not remove those files or mark their tests passed. Prefer a full authenticated clone when available.
- Publish task-owned files using a tree based on the existing GitHub tree, a single-parent commit, and non-forced main update. Recheck the remote before and after publication; require the local index tree and remote tree to match. No shell push success is claimed.

Next: complete actual 320/390 browser QA for combat/rewards/shop/save; run full npm test from a complete checkout. Known deeper malformed-save validation and new-run overwrite confirmation remain unresolved, as do the map/art issues below.

Deployment: no deployment requested or performed. sites_get_site returned project not found for appgprj_6a9e6739409c81919c47b225588b2280 in this account. Existing hosting.json is unchanged; no replacement Site was created. Published URL remains recorded as the older 3D version, not reverified here.

## Previous handoff checkpoint

Complete import verified at GitHub main commit 5d67b392be99d7c13568f88663d0f54c5f2fa15a: all 62 tracked blobs matched local SHA values; root tree matched 4953099bb55c222ba37a855757714d0b17e1c704. This documentation completion commit follows that import. Use current GitHub main HEAD for the handoff SHA.

Local main now uses the same GitHub commit objects and origin/main upstream; earlier internal history is safely retained in local archive/pre-github-import. No gameplay files are left uncommitted. Upload used the authenticated GitHub connector, not shell git push. npm test and git diff --check passed again. No new deployment occurred.

NEXT TASK: with the second account connected to this private GitHub repo, clone main and follow AGENTS.md. Resume hero-aware action descriptions and 320/390px reward/shop/save QA when asked to develop. No need to repeat repository setup. The older blocker notes below are historical and do not override this READY section.

## GitHub import checkpoint

The user created private https://github.com/roibenyehuda2-arch/arena-heir and granted the connector write access. The complete tracked snapshot is being imported via GitHub Git objects with blob/tree hash verification, because shell Git credentials are not configured. The published main commit is the canonical handoff; consult GitHub main for its SHA. Older local history remains preserved locally. No deployment or gameplay changes are part of this import.

Both accounts must connect this same private repository. A fresh clone of GitHub main is the recommended starting point. Do not merge the earlier internal Sites history into it. If shell authentication is absent, use an authenticated supported GitHub workflow; do not fabricate a successful git push.

## Historical synchronization blockers (resolved by new target access)

Follow-up verification: connected GitHub lists only my-home-priority and Photonicom; neither is the game target. Available connector has no repository-creation operation. Plugin discovery found only that already-installed connector. No gh executable, GH_TOKEN, GITHUB_TOKEN or Git credential helper is configured. User authorized repository creation, but the required capability is unavailable. Ask for an empty private arena-heir repository connected to the integration; do not reuse unrelated repositories or claim a push succeeded.

Latest checkpoint validation rerun: npm test (all suites), three production syntax checks and git diff --check passed. No gameplay changes in this follow-up. Local checkpoint remains unpushed; do not begin second-account work yet.

Main branch: main. No origin remote exists. Only the internal Sites source remote named site exists; it is not GitHub. Search user:roibenyehuda2-arch arena returned no repositories (not proof that a private repository does not exist). git fetch site failed for unavailable HTTPS authentication. Do not switch accounts until GitHub push and matching remote HEAD are verified.

Prior committed baseline: 4ce363f1d9872096cbe68a8520788ff6027771c6. This task checkpoints the already-existing illustrated work and synchronization documentation locally. Obtain the checkpoint SHA with git rev-parse HEAD; a file cannot embed its own commit hash.

Required next input: accessible GitHub repository URL, or an empty repository connected to both accounts. Inspect any nonempty target before import. Do not use My Home Priority. No remote push completed in this task.

## Implemented

Illustrated production entry game2d.js; opening, three selectable heroes, map, seven fights/two masters, Tribute/Trophy/Echo rewards, caravan and ending. Seven optimized WebP illustrations (~2.5 MB). CombatDirector supports sprite sheets without trying to construct a missing skeleton. Distinct hero mechanics, final-master reward before ending, and coins only through Tribute. Legacy 3D code remains for rollback, unused by production entry.

No gameplay edits were made for this docs/synchronization request; existing work was preserved.

## QA evidence

npm test passed: engine, legacy rig, presentation, legacy 3D and assets. 300 seeded bot simulations: 260 completions, all seven encounters reachable. This is not evidence of human enjoyment or approved balance. Syntax checks for game2d/combat/engine and diff whitespace passed before handoff.

Earlier cloud browser QA inspected desktop opening, character choices, map and battle, and played leap/enemy retaliation plus four actions through the first victory/reward screen. Transparent-art layering bug fixed. No app error observed in checked flow; extension errors were unrelated. Current mobile, all heroes, full campaign, reward/shop/save and reduced-motion QA remain incomplete. Standalone Chromium was unavailable; cloud Sites preview worked.

## Known issues / next development

1. All rivals share boar art and one arena; unique masters/regions missing.
2. Gear is a stat upgrade plus badge, not interchangeable equipment on the fighter.
3. Hero-specific BASIC copy/forecasts corrected in the latest checkpoint; actual mobile browser inspection remains pending.
4. Map copy overlaps some nodes; map geography and route order need alignment.
5. CSS contains stale PNG declarations overridden by WebP rules; consolidate and inspect requests.
6. Verify rival facing, all poses, animation pacing, mute/audio disposal and reduced motion.
7. New-run save replacement lacks confirmation; strengthen malformed-save validation.
8. Story scenes, branching routes, full campaign and external playtesting are not implemented.

FIRST resolve GitHub synchronization and validate a clean clone with all source/assets/docs. Then, only when development resumes, fix hero-specific copy and finish 320/390px plus reward/shop/save QA before expanding content.

## Published version

Existing URL: https://arena-heir.roibenyehuda2.chatgpt.site

Last recorded publication: Sites version 7, older 3D baseline; live deployment was not reverified in this documentation task. Illustrated work is NOT deployed. Preserve project ID appgprj_6a9e6739409c81919c47b225588b2280. GitHub access does not grant the second account permission to deploy that Site.
