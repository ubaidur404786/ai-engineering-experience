import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Avatar from './Avatar';
import { getController, useScene, useVoice, voiceStore, type Controller, type Cue } from './store';
import type { Spread, Stage } from '../book/types';
import './scene.css';

export const W = 600, H = 420; // stage coordinate system shared by diagrams and the pointer

export interface SceneDef {
  id: string;
  chapter: string;
  stage?: Stage;
  kicker: string;
  title: string;
  cues: Cue[];
  /** Draws the diagram for the current step. Must use the 600×420 coordinate system. */
  draw: (step: number) => ReactNode;
  /** Optional deeper explanation, hidden behind "Show the details". */
  details?: ReactNode;
  /** Optional extra content under the stage (e.g. a lab launcher). */
  below?: ReactNode;
}

export function scene(def: SceneDef): Spread {
  const c = getController(def.id, def.cues);
  return {
    id: def.id, chapter: def.chapter, stage: def.stage, title: def.title,
    left: <GuidePanel c={c} def={def} />,
    right: <StagePanel c={c} def={def} />,
    visualFirst: true,
  };
}

function GuidePanel({ c, def }: { c: Controller; def: SceneDef }) {
  const s = useScene(c);
  const { voiceOn, rate } = useVoice();
  const cue = def.cues[s.idx];
  const [open, setOpen] = useState(false);
  return (
    <div className="guide">
      <p className="kicker">{def.kicker}</p>
      <h1 className="guide-title">{def.title}</h1>
      <div className="guide-body">
        <Avatar talking={s.speaking} gesture={!!cue.point && s.idx > 0} />
        <motion.blockquote key={s.idx} className="speech" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} aria-live="polite">
          {cue.say}
        </motion.blockquote>
      </div>
      <Controls c={c} cues={def.cues} />
      <div className="voice-row">
        <button className={`chip-btn ${voiceOn ? 'on' : ''}`} onClick={() => voiceStore.setVoice(!voiceOn)} aria-pressed={voiceOn}>{voiceOn ? '🔊 Voice on' : '🔇 Subtitles only'}</button>
        <select className="chip-btn" value={rate} onChange={(e) => voiceStore.setRate(+e.target.value)} aria-label="Speed">
          <option value={0.8}>0.8×</option><option value={1}>1×</option><option value={1.25}>1.25×</option><option value={1.5}>1.5×</option>
        </select>
        {def.details && <button className="chip-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? 'Hide details' : '📖 Show the details'}</button>}
      </div>
      <AnimatePresence>
        {open && def.details && (
          <motion.div className="details" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{def.details}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Controls({ c, cues }: { c: Controller; cues: Cue[] }) {
  const s = useScene(c);
  const atEnd = s.idx === cues.length - 1 && !s.playing && c.finished;
  return (
    <div className="scene-ctrl">
      <button className="round" onClick={() => c.goto(s.idx - 1)} disabled={s.idx === 0} aria-label="Previous">⏮</button>
      <button className="round big" onClick={() => (s.playing ? c.pause() : c.play())} aria-label={s.playing ? 'Pause' : 'Play'}>
        {s.playing ? '❚❚' : atEnd ? '↺' : '▶'}
      </button>
      <button className="round" onClick={() => c.goto(s.idx + 1)} disabled={s.idx === cues.length - 1} aria-label="Next">⏭</button>
      <div className="cue-track" role="group" aria-label="Scene steps">
        {cues.map((_, i) => <button key={i} className={i === s.idx ? 'on' : i < s.idx ? 'done' : ''} onClick={() => c.goto(i)} aria-label={`Step ${i + 1}`} />)}
      </div>
      {!s.playing && s.idx === 0 && <span className="hint">Press ▶ and I’ll explain</span>}
    </div>
  );
}

function StagePanel({ c, def }: { c: Controller; def: SceneDef }) {
  const s = useScene(c);
  const cue = def.cues[s.idx];
  const step = cue.step ?? s.idx;
  return (
    <div className="stage-panel">
      <div className="stage-box">
        <svg viewBox={`0 0 ${W} ${H}`} className="stage-svg" role="img" aria-label={cue.say}>
          {def.draw(step)}
        </svg>
        <Pointer cue={cue} k={s.idx} />
        <div className="stage-sub" aria-hidden="true">{cue.say}</div>
        <div className="mini-ctrl"><Controls c={c} cues={def.cues} /></div>
      </div>
      {def.below}
    </div>
  );
}

/** Animated pointer + "thought" bubble anchored to a point on the diagram. */
function Pointer({ cue, k }: { cue: Cue; k: number }) {
  if (!cue.point) return null;
  const [x, y] = cue.point;
  const left = (x / W) * 100, top = (y / H) * 100;
  const flip = x > W * 0.6; // keep the bubble inside the stage
  const below = y < H * 0.28;
  return (
    <motion.div className="pointer" initial={false} animate={{ left: `${left}%`, top: `${top}%` }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
      <span className="pulse" />
      <motion.svg className="hand" viewBox="0 0 24 24" width="30" height="30" animate={{ y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
        <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10h.5V8.5a1.5 1.5 0 0 1 3 0V10h.5V9a1.5 1.5 0 0 1 3 0v5.5c0 3.6-2.4 6.5-6 6.5h-1c-2 0-3.4-.8-4.6-2.4L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15V11z" fill="#f2ebdd" stroke="#1c222a" strokeWidth="1.2" />
      </motion.svg>
      {cue.bubble && (
        <motion.div key={k} className={`thought ${flip ? 'flip' : ''} ${below ? 'below' : ''}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 18 }}>
          {cue.bubble}
          <span className="dots"><i /><i /></span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ---------- small SVG helpers diagrams reuse ---------- */

export function Box({ x, y, w, h, label, sub, hot, dim, tone = 'paper' }: { x: number; y: number; w: number; h: number; label: string; sub?: string; hot?: boolean; dim?: boolean; tone?: 'paper' | 'night' | 'brass' | 'teal' }) {
  return (
    <motion.g animate={{ opacity: dim ? 0.3 : 1 }}>
      <motion.rect x={x} y={y} width={w} height={h} rx={10} className={`sbox ${tone} ${hot ? 'hot' : ''}`} animate={{ scale: hot ? 1.04 : 1 }} style={{ originX: `${x + w / 2}px`, originY: `${y + h / 2}px` }} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} textAnchor="middle" className={`slabel ${tone}`}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className={`ssub ${tone}`}>{sub}</text>}
    </motion.g>
  );
}

/** Dashed path with particles flowing along it: "data moving". */
export function Flow({ d, active = true, color = '#2f7f88', count = 3, dur = 1.6 }: { d: string; active?: boolean; color?: string; count?: number; dur?: number }) {
  return (
    <g>
      <path d={d} className={`flow ${active ? 'on' : ''}`} />
      {active && Array.from({ length: count }, (_, i) => (
        <circle key={i} r="4" fill={color}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${(i * dur) / count}s`} path={d} />
        </circle>
      ))}
    </g>
  );
}
