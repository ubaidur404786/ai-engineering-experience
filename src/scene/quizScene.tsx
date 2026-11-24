import { useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { scene } from './Scene';
import type { Controller } from './store';

/**
 * A quiz John hosts: he reads each question, waits for your tap, then reacts and explains.
 * `ask` and `explain` are spoken (the first `ask` also greets the reader) (scripts/make_voice.py records them), so keep them in single quotes.
 */
export interface QuizItem { ask: string; q: string; options: string[]; answer: number; explain: string }

const picks = new Map<string, (number | null)[]>();
const subs = new Set<() => void>();
let ver = 0;
const usePicks = (id: string, n: number) => {
  useSyncExternalStore((l) => { subs.add(l); return () => subs.delete(l); }, () => ver);
  if (!picks.has(id)) picks.set(id, Array(n).fill(null));
  return picks.get(id)!;
};
const setPick = (id: string, i: number, v: number) => { picks.get(id)![i] = v; ver++; subs.forEach((l) => l()); };

const RIGHT = ['✓ Nailed it!', '✓ Yes! Big brain.', '✓ Correct, show-off 😄', '✓ Exactly right.'];
const WRONG = ['✗ Close, but no.', '✗ Nope, but good try.', '✗ Not this one.', '✗ Almost!'];

export function quizScene(def: { id: string; chapter: string; title: string; kicker?: string; outro: string; items: QuizItem[] }) {
  const n = def.items.length;
  const cues = [
    ...def.items.map((it, i) => ({ say: it.ask, point: [300, 52] as [number, number], bubble: `Question ${i + 1} of ${n}`, step: i })),
    { say: def.outro, point: [300, 120] as [number, number], bubble: 'see you next page →', step: n },
  ];
  return scene({
    id: def.id, chapter: def.chapter, stage: 'test', kicker: def.kicker ?? 'Test yourself', title: def.title,
    stepwise: true,
    extras: def.items.map((it) => it.explain),
    cues,
    draw: (step, c) => <QuizBoard id={def.id} items={def.items} step={step} c={c} />,
    details: <p>Not in the mood? Just turn the page to skip. John won’t tell anyone.</p>,
  });
}

function QuizBoard({ id, items, step, c }: { id: string; items: QuizItem[]; step: number; c: Controller }) {
  const p = usePicks(id, items.length);
  if (step >= items.length) {
    const score = p.filter((v, i) => v === items[i].answer).length;
    return (
      <foreignObject x="20" y="20" width="560" height="390">
        <div className="qb qb-end">
          <div className="qb-score">{score} / {items.length}</div>
          <p>{score === items.length ? 'Perfect score. John is slightly scared of you.' : score >= items.length / 2 ? 'Solid! Review the red ones and you’re golden.' : 'No stress. Replay the scenes and try again, it’s how learning works.'}</p>
          <button className="qb-next" onClick={() => { items.forEach((_, i) => { picks.get(id)![i] = null; }); ver++; subs.forEach((l) => l()); c.goto(0); }}>↺ Try again</button>
        </div>
      </foreignObject>
    );
  }
  const it = items[step], pick = p[step];
  const choose = (j: number) => {
    if (pick !== null) return;
    setPick(id, step, j);
    const ok = j === it.answer;
    c.say({ say: it.explain, bubble: (ok ? RIGHT : WRONG)[step % 4], point: [566, 150 + it.answer * 64] });
  };
  return (
    <foreignObject x="20" y="20" width="560" height="390">
      <div className="qb">
        <div className="qb-n">Question {step + 1} / {items.length}</div>
        <div className="qb-q">{it.q}</div>
        <div className="qb-opts">
          {it.options.map((o, j) => (
            <button key={j} className={`qb-opt ${pick === null ? '' : j === it.answer ? 'right' : j === pick ? 'wrong' : 'dim'}`} onClick={() => choose(j)}>
              <b>{'ABCD'[j]}</b> {o}
            </button>
          ))}
        </div>
        {pick !== null && (
          <motion.button className="qb-next" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => c.goto(step + 1)}>
            {step + 1 < items.length ? 'Next question ›' : 'See my score ›'}
          </motion.button>
        )}
      </div>
    </foreignObject>
  );
}
