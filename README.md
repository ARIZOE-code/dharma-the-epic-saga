# DHARMA: The Epic Saga
Powered by STK CREATION

Phase 1 scaffold — playable end-to-end: **Intro → Main Menu → Chapter 1 (Ayodhya) → Chapter 2 (Vishwamitra + Tataka) → Chapter 3 (Mithila + Divine Bow) → Chapter 4 (Vanvas: forest/crafting) → Chapter 5 (Panchavati: Surpanakha story + Khara boss)**

## Run locally
Browsers block file:// module loads sometimes, so serve it:
```
cd DHARMA-The-Epic-Saga
python3 -m http.server 8000
```
Then open `http://localhost:8000`

## Deploy to GitHub Pages
1. Push this folder as a repo (or into an existing repo's root).
2. Repo Settings → Pages → Source: `main` branch, `/root`.
3. Done — live at `https://<username>.github.io/<repo>/`

## What's built (Phase 1)
- `BootScene.js` — loading bar + placeholder textures (no art assets needed yet)
- `IntroScene.js` — STK CREATION logo → conch cue → cinematic title → disclaimer → skip button
- `MainMenuScene.js` — Story Mode / Continue / Chapters / Collection / Settings / Credits
- `Chapter1Scene.js` — Ayodhya training ground: WASD movement, Shift sprint, click-to-shoot
  archery, camera follow, hit-3-targets to complete chapter
- `Chapter2Scene.js` — Vishwamitra: defend the Yagya Kund (has its own HP) across 2 demon
  waves, then boss fight vs Tataka (HP bar, chase AI, ranged combat). Fail state (Yagya
  destroyed or player HP hits 0) restarts the chapter.
- `Chapter3Scene.js` — Mithila: walk to the Shiv Dhanush, press E to trigger a timing
  minigame (press SPACE when the sweeping marker hits the gold sweet spot, 3 attempts).
  Success unlocks "Shiv Dhanush Broken" achievement and adds Divine Bow (Kodanda) to
  `window.DHARMA_STATE.inventory`.
- `Chapter4Scene.js` — Vanvas: large open forest (2000x1400 world). Walk into scattered
  resource nodes (Wood/Herbs/Stone) to auto-collect, press **C** to craft a "Forest
  Survival Kit" (needs 3 Wood + 2 Herbs + 1 Stone). Roaming animal NPCs wander passively.
  A side-mission villager (press E twice: once to accept, once to deliver 2 Herbs) grants
  a bonus item. Reach the green marker and press E to complete the chapter.
- `Chapter5Scene.js` — Panchavati: brief narrated cinematic (Surpanakha's proposal,
  refusal, and the conflict that follows — kept as a summarized story beat, not a graphic
  depiction), then combat: boss fight vs Khara (HP bar, chase AI, ranged combat).

## Placeholder art
All sprites (`player`, `npc`, `arrow`, `target`, `ground`) are generated in code
(`BootScene.generatePlaceholderTextures`) so the game runs with zero image assets.
Drop real PNGs into `/assets` and swap `this.load.image(...)` calls in `BootScene.preload()`
whenever art is ready — no other code changes needed.

## Next steps (Phase 2+)
- Replace placeholder textures with real character/environment art
- Chapter 6: Golden Deer chase (Maricha)
- Enemy AI base class (patrol/search/attack/dodge) to replace the simple chase logic
- Real inventory UI (data already tracked in `window.DHARMA_STATE.inventory`)
- Firebase auth + cloud save (collections already planned: users, savegames, settings,
  achievements, leaderboards, chapters, inventory)
