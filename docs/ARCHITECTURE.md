# Architecture

## Stack (and why each piece is here)

| Need | Choice | Why |
|---|---|---|
| UI, components, state | **React 19 + TypeScript** | Each lab is a stateful component; TS keeps chapter data honest. |
| Build, code splitting | **Vite** | Fast dev server; dynamic `import()` gives per-vocabulary and (later) per-chapter chunks. |
| Page flip, lab expansion, step animations | **Motion** (`motion/react`) | Declarative animations, layout animations, gestures (mobile swipe), and global `reducedMotion="user"`. |
| Real tokenization in browser | **js-tiktoken** | Real byte-level BPE with published merge ranks; same IDs as Python `tiktoken`. |
| Technical diagrams | **Inline SVG + React** | Crisp, accessible, animatable; no library needed yet. |

Deliberately **not** installed yet: GSAP, Three.js/R3F, D3, Theatre.js. Add them when a chapter needs them:
- **D3** (scales/shapes only): loss curves, probability distributions, attention heatmaps (Parts 1, 2, 9).
- **React Three Fiber**: only if a 3D view clearly helps, e.g. embedding space (Part 5). Load on demand, pause when off-screen.
- **GSAP timelines**: only if a narrated sequence gets too complex for Motion.

## Structure

```
src/
  book/            the book engine: Cover, Book (spreads, flip, TOC, progress), Lab overlay, shared UI blocks
  chapters/        one folder or file per chapter; each exports Spread[]
    registry.ts    reading order; a chapter shows as "ready" in Contents once listed here
  data/curriculum  full roadmap (all 15 parts); unwritten chapters show as "planned"
```

A **Spread** = left page (story) + right page (visual/interactive). On screens under 900px wide they stack and the reader swipes.
`LabLauncher` on any page opens a full-screen laboratory; Escape returns to the same spot in the book.

## Rules the code follows

- Every visualization says **Real execution** or **Simulation** (and what is simplified).
- Decorative motion (cover, `Ambient` canvas) is `aria-hidden`, pauses when the tab is hidden, and is static under reduced motion.
- The 3D page flip is desktop-only; mobile and reduced motion get a short slide/fade.
- Heavy data (tokenizer vocabularies: 0.5–2.3 MB each) loads only when used.

## Narration (planned)

`<Narration>` blocks hold the text narration today. Plan: each block gets an optional `cue` id; a `NarrationPlayer` (play/pause/speed/captions, never autoplay) plays audio and emits cue events that lab steppers listen to. Text stays the source of truth.
