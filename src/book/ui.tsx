import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useLab } from './Lab';

/** Reusable building blocks every chapter page uses. */

export function Kicker({ children }: { children: ReactNode }) { return <p className="kicker">{children}</p>; }

export function Narration({ children }: { children: ReactNode }) {
  // Text narration. Voice narration can later attach to these blocks (see docs/ARCHITECTURE.md → Narration).
  return <div className="narration">{children}</div>;
}

export function Callout({ kind = 'note', title, children }: { kind?: 'note' | 'warn' | 'key'; title: string; children: ReactNode }) {
  return <aside className={`callout ${kind}`}><b>{title}</b><div>{children}</div></aside>;
}

export function Analogy({ children }: { children: ReactNode }) {
  return <aside className="callout analogy"><b>Analogy</b><div>{children}</div></aside>;
}

export function LabLauncher({ title, blurb, children, preview }: { title: string; blurb: string; children: ReactNode; preview?: ReactNode }) {
  const openLab = useLab();
  return (
    <motion.div className="lab-launch" whileHover={{ y: -2 }}>
      {preview && <div className="lab-preview">{preview}</div>}
      <div className="lab-launch-text"><b>{title}</b><p>{blurb}</p></div>
      <button className="btn-primary" onClick={() => openLab({ title, body: children })}>Open the laboratory ⤢</button>
    </motion.div>
  );
}

export function Code({ code, lang = 'python', title }: { code: string; lang?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="code">
      <figcaption><span>{title ?? lang}</span>
        <button className="btn-ghost xs" onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? 'Copied' : 'Copy'}</button>
      </figcaption>
      <pre><code>{code}</code></pre>
    </figure>
  );
}

export function Output({ children, note }: { children: string; note?: string }) {
  return <figure className="code out"><figcaption><span>Output</span>{note && <small>{note}</small>}</figcaption><pre><code>{children}</code></pre></figure>;
}

export interface QuizQ { q: string; options: string[]; answer: number; why: string }
export function Quiz({ items }: { items: QuizQ[] }) {
  return <div className="quiz">{items.map((it, i) => <QuizItem key={i} n={i + 1} {...it} />)}</div>;
}
function QuizItem({ n, q, options, answer, why }: QuizQ & { n: number }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <fieldset className="quiz-item">
      <legend>{n}. {q}</legend>
      {options.map((o, i) => (
        <button key={i} className={`quiz-opt ${pick === null ? '' : i === answer ? 'right' : i === pick ? 'wrong' : 'dim'}`} onClick={() => setPick(i)} aria-pressed={pick === i}>{o}</button>
      ))}
      {pick !== null && (
        <motion.p className="quiz-why" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          {pick === answer ? '✓ Correct. ' : '✗ Not quite. '}{why}
        </motion.p>
      )}
    </fieldset>
  );
}

export function Refs({ items }: { items: { label: string; href: string; kind: string }[] }) {
  return (
    <ul className="refs">
      {items.map((r) => <li key={r.href}><span className="ref-kind">{r.kind}</span><a href={r.href} target="_blank" rel="noreferrer">{r.label}</a></li>)}
    </ul>
  );
}
