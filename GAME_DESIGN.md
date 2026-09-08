# Crown of Echoes — game design

Approved direction: fully illustrated original 2D fantasy, with MapleStory as a high-level reference for expressive characters and colorful worlds, not copied assets. Opening, heroes, arenas, map and equipment should share this direction. Do not return to 3D without user instruction.

Core loop: choose a hero, travel to a rival, win a tactical duel, choose coins OR their gear OR their signature ability, improve the character and confront regional masters. Free first; monetization later only after player validation. No claim of proven retention.

Implemented prototype: Miri Brass (72 HP, full-block bonus +3), Tovin Rook (84 HP, armor 1, stronger heavy/block), Suri Vell (64 HP, weapon +1, basic range 2, dodge bonus +5). Seven encounters, two regions, masters at encounters 4 and 7. Nine logical floor positions, six energy, enemy intent, strike/heavy/block/dodge/leap forward/leap back/recover. Three learned Echo slots.

Every victory including the final master offers one reward. Tribute: 30 + 4 × zero-based round coins. Trophy: weapon +2 or armor +1. Echo: rival signature, replacing a learned move if three slots are full. Caravan: weapon upgrade 30, armor 30, heal 25 HP for 20. Travel heals 10.

Engine state version 2 uses historical localStorage key arena-heir-v1. Saves are device-local, not synchronized through GitHub. Engine decides results; animation only consumes events.

Story proposal: a living Crown remembers champions; scattered Laurels call three heirs onto the arena roads. Current regions: Embermeadow and Murkmirror. Skyglass, Crownless Capital, Regent Veyr, dialogue and a larger campaign are future concepts, not completed content.

Art limits: three unique hero sheets, one shared boar-rival sheet, one arena, one map and an equipment atlas. Rivals reuse the same illustration with palette changes. Equipment currently affects stats and displays an icon/badge, not a modular outfit attached to the character. Unique masters, paper-doll gear and illustrated story scenes remain future work.

Priorities: readable faces/silhouettes, clear tactical feedback, coherent original art, accessible controls/reduced motion, lightweight assets and honest action forecasts. Human playtesting is required to assess enjoyment.
