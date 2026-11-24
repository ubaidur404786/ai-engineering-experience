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
   - **Code pages are scenes too** (John never leaves): `CodeBoard` from `src/scene/CodeBoard.tsx` draws ≤ 13–15 short lines (≤ 58 chars) on the stage, `hot` highlights the lines of the current cue, `point: lineAt(i)` aims the stick at the right margin of line i, and the final cue shows the real `output`. The full copyable code goes in `details` (`<Code>` + `<Output>`). Example: `data-python`.
   - **Quizzes are hosted by John:** `quizScene({ id, chapter, title, outro, items: [{ ask, q, options, answer, explain }] })` from `src/scene/quizScene.tsx`. He reads `ask`, waits for the tap (stepwise scene), reacts in his bubble (✓/✗) and speaks `explain`, then "Next question ›", then a score page. The first `ask` says the quiz can be skipped. `ask`/`explain`/`outro` are recorded by make_voice.py.
4. `npx tsc -b`, check in the browser (`npm run dev`, port 5173), commit, push.

## Layout rules for diagrams (checked in Chrome, laptop 1536×674 and phone 375×812)
- **No page ever scrolls.** Every page is wrapped in `src/book/Fit.tsx`: content taller than the page is scaled down to fit (minimum 62%; below that it scrolls as a last resort). If a page needs < ~80%, split it into another spread (e.g. `tok-python` + `tok-python-out`).
- Phones show one page per screen: a scene = stage + subtitle + controls ("📝 Text" swaps to John's page); other spreads = left page, then right page.
- `below` (lab launchers) goes on John's text page, never under the stage.
- Stage = 600×590 SVG on laptops (diagram y 0–420, floor below); on phones John is smaller and the stage is 600×545 (`stageHeight()` in Teacher.tsx). The stage always fits the page height on desktop (no scrolling, no cropped legs).
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
| Part 1 · Data | why data, structured vs unstructured, features & labels, cleaning, train/val/test, Python at the board (pandas + scikit-learn, real output), John-hosted quiz, What's next |
| Part 1 · Ways a machine learns | the question (who writes the answers?), supervised, unsupervised (clustering), self-supervised (next-word quiz = how GPT learns), side by side + RL teaser, Python at the board (LogisticRegression, KMeans, next-word pairs; real output), John-hosted quiz, What's next |
| Part 1 · One neuron, then a network | beach-decision example throughout: a neuron (clues in, one answer out), weights + bias, activation (step, sigmoid, ReLU), layers + forward propagation, Python at the board (numpy neuron + tiny network; real output), John-hosted quiz, What's next |
| Part 1 · How a network learns | loss (beach guesses, MSE), gradient descent (ball on a hill, learning rate), backpropagation (blame flows backwards), Python: one-weight learner (real output), quiz, What's next |
| Part 1 · Is the model any good? | three students (underfit / good / overfit), train vs validation loss + early stopping, accuracy / precision / recall (spam filter), Python grading (real output), quiz, Part 1 complete |
| Part 2 · Planning a foundation model | four decisions (domain, size, data, budget), pre-training overview, quiz |
| Part 2 · Pre-training data | collection (web, books, code; 15T tokens), cleaning line (strip, dedup, quality filter, PII), Python cleaner (real output), quiz, What's next → Tokenization |
| Tokenization (Part 2) | 5 scenes + Tokenizer Lab (real GPT-2/cl100k/o200k in browser), BPE trainer lab, Python at the board, John-hosted quiz, references |

## Next chapter
Reading order is now continuous up to Tokenization. Next to write: Part 2 `embeddings-in` (after `tokenizationEnd`/`tok-explore` in registry.ts).
After Part 1, continue Part 2 with `embeddings-in` (token IDs → vectors); the tokenization chapter already ends by promising it.

## Known gaps / ideas
- Harmless console warnings ("attribute cx: Expected length") from motion SVG elements on first render.
- John's face is a simple side-view cartoon; could be more detailed.
- Narration player has no captions download / transcript page yet.
- Presentation claims to re-check before reuse: see `docs/ACCURACY_LOG.md`.
