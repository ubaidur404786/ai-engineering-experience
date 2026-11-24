# Handoff: how to continue this book (read this first in a new session)

**Live:** https://ubaidur404786.github.io/ai-engineering-experience/
**Repo:** github.com/ubaidur404786/ai-engineering-experience. Push to `main` = automatic deploy (GitHub Actions, ~40 s).
**Commits:** authored by Ubaid only. No AI/Claude attribution anywhere. `LLM_presentation.pptx` is gitignored (private).

## What the user wants (non-negotiable style)
- **Little reading.** Every topic is a *narrated scene*: John (the guide) speaks; the left page shows his words as subtitles; the right page is an animated diagram where John walks along the floor and points with a stick. Depth goes behind "📖 Show the details".
- **John:** young, friendly teacher. Navy shirt, black trousers, black formal shoes, pointer stick, no beard. Talks casually with light humor ("check the next page, bro"). Speaks to *any* reader (no greeting to Ubaid by name): "I'm here to guide you, you're not alone".
- **Auto-start:** when a page opens, its voice clips download with a "Page is loading… %" bar, then John starts by himself (toggle: ⏯ Auto-start). If the browser blocks sound before the first click, a "Tap ▶ once" prompt appears. While playing the hint says "Stop me anytime".
- **End of every part:** last scene says "now you know these, next page is a quick test, take it or skip it"; the quiz page has a skip note; then a "What's next" scene points to the next chapter.
- **Phones:** floating ‹ › buttons, "📝 Hide/Show text" toggle in the top bar (hidden text = stage + subtitle + controls only).
- **Voice:** pre-recorded neural voice (edge-tts `en-US-AndrewMultilingualNeural`, rate +8%, pitch +3Hz). Should feel like ChatGPT/Gemini voice. No autoplay; starts on ▶.
- **No delay:** keep cue gaps short, preload next clip.
- **Accuracy:** real tokenizer/numbers where possible; anything simplified is labelled "Simulation" or "Illustrative". Log facts in `docs/ACCURACY_LOG.md`.
- Story first, then visual, then interaction, then Python with real output, then quiz, then references (see the original 9-stage teaching model).

## How to add a chapter (recipe)
1. Create `src/chapters/<topic>/scenes.tsx`. Each scene:
   ```tsx
   scene({ id, chapter, stage, kicker, title,
     cues: [{ say: '…spoken line…', point: [x, y], bubble: 'short comment' }, …],
     draw: (step) => <MyDiagram step={step} />,   // SVG, 600×420 coords; John stands below y=420
     details: <p>…</p>, below: <LabLauncher …/> })
   ```
   - `say` must use single quotes in source and curly apostrophes (’) inside, so `scripts/make_voice.py` can find it.
   - `point` = where the stick tip goes. `step` (optional) = diagram state, defaults to cue index.
   - Reuse `Box`, `Flow` (moving data particles) from `src/scene/Scene.tsx`; styles in `src/scene/scene.css`.
2. Add the scenes to `SPREADS` in `src/chapters/registry.ts` (order = reading order). The chapter id must exist in `src/data/curriculum.ts` (then Contents marks it ready).
3. Record the voice: `python scripts/make_voice.py` (records only new lines, deletes stale clips) → `public/audio/*.mp3`.
4. `npx tsc -b`, check in the browser (`npm run dev`, port 5173), commit, push.

## Layout rules for diagrams (checked in Chrome, laptop 1536×674 and phone 375×812)
- Stage = 600×590 SVG: diagram board y 0–420, John's floor y 420–590 (`STAGE_H` in Teacher.tsx). The stage always fits the page height on desktop (no scrolling, no cropped legs).
- Keep every label inside x 20–580, y 20–410. Long bars/charts: compute widths so the value label still ends before x 590.
- Text classes: `slabel` (titles), `ssub paper` / `ssub night` (sub-lines on light / dark boxes), `chip-t sm`, `cap`, `ok`/`warn`. Light-background classes get a paper halo automatically so dashed flows and the stick don't cut through words. Never put halo classes on dark fills (use `ssub night`).
- Small circles (r < 60) hold at most a 1-word label + 2 short lines; check that they don't overlap.
- After a new chapter: step through every cue at both sizes (Chrome window + phone emulation) before pushing. Test links like `#p/<id>` work (hashchange is handled).

## Status
| Done | Notes |
|---|---|
| Book engine | cover, 3D page flip, Contents drawer, progress, mobile swipe (diagram first on phones), lab overlay |
| Welcome (3 scenes) | Meet John (not alone, two pages, stop me anytime) · Why this book isn't boring · Skill journey (what you can do at the end) |
| Part 0 complete | two sides, four roles, AI⊃ML⊃DL⊃GenAI, foundation models + LLM/SLM sizes, open vs closed, model → app layers, lifecycle loop, quiz (skippable), What's next scene |
| Tokenization (Part 2) | 5 scenes + Tokenizer Lab (real GPT-2/cl100k/o200k in browser), BPE trainer lab, Python page, quiz, references |

## Next chapter
Reading order next: **Part 1 · Foundations**, starting with chapter `data` ("Data: the raw material"), then `learning-types`, `neuron`, `learning`, `fit`.
After Part 1, continue Part 2 with `embeddings-in` (token IDs → vectors); the tokenization chapter already ends by promising it.

## Known gaps / ideas
- Harmless console warnings ("attribute cx: Expected length") from motion SVG elements on first render.
- John's face is a simple side-view cartoon; could be more detailed.
- Narration player has no captions download / transcript page yet.
- Presentation claims to re-check before reuse: see `docs/ACCURACY_LOG.md`.
