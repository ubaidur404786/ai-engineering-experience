import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SPREADS, CHAPTER_TITLES } from '../chapters/registry';
import { CURRICULUM } from '../data/curriculum';
import { STAGE_LABEL } from './types';
import { LabContext, LabOverlay } from './Lab';
import { stopAllScenes } from '../scene/store';

const FLIP_MS = 900;

function indexFromHash() {
  const m = location.hash.match(/^#p\/(.+)$/);
  const i = m ? SPREADS.findIndex((s) => s.id === m[1]) : -1;
  return i < 0 ? 0 : i;
}

function useIsNarrow() {
  const q = '(max-width: 900px)';
  const [narrow, set] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const mq = matchMedia(q); const on = () => set(mq.matches);
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

export default function Book({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(indexFromHash);
  const [flip, setFlip] = useState<{ from: number; to: number } | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [lab, setLab] = useState<{ title: string; body: ReactNode } | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem('visited') || '[]')));
  const narrow = useIsNarrow();
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const spread = SPREADS[index];

  useEffect(() => {
    stopAllScenes();
    history.replaceState(null, '', `#p/${spread.id}`);
    setVisited((v) => {
      const n = new Set(v); n.add(spread.id);
      localStorage.setItem('visited', JSON.stringify([...n])); return n;
    });
    document.querySelector('.page-scroll')?.scrollTo(0, 0);
  }, [spread.id]);

  const go = useCallback((to: number) => {
    if (to < 0 || to >= SPREADS.length || to === index || flip) return;
    if (narrow || reduce) { setIndex(to); return; }   // mobile + reduced motion: simple slide/fade instead of a 3D flip
    setFlip({ from: index, to });
    setTimeout(() => { setIndex(to); setFlip(null); }, FLIP_MS);
  }, [index, flip, narrow, reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lab || (e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);
  }, [go, index, lab]);

  const chapterSpreads = SPREADS.filter((s) => s.chapter === spread.chapter);
  const posInChapter = chapterSpreads.indexOf(spread) + 1;

  return (
    <LabContext.Provider value={setLab}>
      <motion.div className="book-shell" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
        <nav className="topbar" aria-label="Book navigation">
          <button className="btn-ghost" onClick={onClose} title="Close the book">✕ <span className="hide-sm">Cover</span></button>
          <button className="btn-ghost" onClick={() => setTocOpen(true)} aria-expanded={tocOpen}>☰ Contents</button>
          <div className="crumb" aria-live="polite">
            <span className="crumb-ch">{CHAPTER_TITLES[spread.chapter]}</span>
            {spread.stage && <span className="crumb-stage">{STAGE_LABEL[spread.stage]}</span>}
          </div>
          <div className="progress" role="progressbar" aria-label="Chapter progress" aria-valuemin={1} aria-valuemax={chapterSpreads.length} aria-valuenow={posInChapter}>
            {chapterSpreads.map((s) => <span key={s.id} className={`dot ${s.id === spread.id ? 'on' : visited.has(s.id) ? 'seen' : ''}`} />)}
          </div>
        </nav>

        {narrow ? (
          <MobileBook index={index} go={go} />
        ) : (
          <div className="book" aria-live="polite">
            <BookSpread index={flip ? (flip.to > flip.from ? flip.from : flip.to) : index} side="left" />
            <BookSpread index={flip ? (flip.to > flip.from ? flip.to : flip.from) : index} side="right" />
            <div className="spine" aria-hidden="true" />
            {flip && <Leaf flip={flip} />}
          </div>
        )}

        <footer className="pager">
          <button className="btn-ghost" onClick={() => go(index - 1)} disabled={index === 0}>← Previous</button>
          <span className="pager-num">{index + 1} / {SPREADS.length}</span>
          <button className="btn-primary sm" onClick={() => go(index + 1)} disabled={index === SPREADS.length - 1}>Next →</button>
        </footer>

        <AnimatePresence>
          {tocOpen && <Toc current={spread.id} visited={visited} onPick={(i) => { setTocOpen(false); go(i); }} onClose={() => setTocOpen(false)} />}
        </AnimatePresence>
        <AnimatePresence>
          {lab && <LabOverlay title={lab.title} body={lab.body} onClose={() => setLab(null)} />}
        </AnimatePresence>
      </motion.div>
    </LabContext.Provider>
  );
}

function BookSpread({ index, side }: { index: number; side: 'left' | 'right' }) {
  const s = SPREADS[index];
  return (
    <section className={`page page-${side}`} aria-label={side === 'left' ? s.title : `${s.title}, visual`}>
      <div className="page-scroll">{side === 'left' ? s.left : s.right}</div>
      <div className="page-folio" aria-hidden="true">{index * 2 + (side === 'left' ? 1 : 2)}</div>
    </section>
  );
}

/**
 * The turning leaf. Its front face is the page being lifted, its back face is the page it reveals.
 * Forward: lifted = old right page, rotates 0° → -180° around the spine, back shows new left page.
 * Backward: lifted = old left page, rotates 0° → 180°, back shows new right page.
 */
function Leaf({ flip }: { flip: { from: number; to: number } }) {
  const forward = flip.to > flip.from;
  const front = forward ? SPREADS[flip.from].right : SPREADS[flip.from].left;
  const back = forward ? SPREADS[flip.to].left : SPREADS[flip.to].right;
  return (
    <motion.div
      className={`leaf ${forward ? 'leaf-fwd' : 'leaf-back'}`}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: forward ? -180 : 180 }}
      transition={{ duration: FLIP_MS / 1000, ease: [0.45, 0.05, 0.25, 1] }}
      aria-hidden="true"
    >
      <div className="leaf-face leaf-front"><div className="page-scroll">{front}</div><div className="leaf-shade" /></div>
      <div className="leaf-face leaf-backface"><div className="page-scroll">{back}</div><div className="leaf-shade" /></div>
    </motion.div>
  );
}

/** Mobile: one column, left page then right page, swipe left/right to turn. */
function MobileBook({ index, go }: { index: number; go: (i: number) => void }) {
  const s = SPREADS[index];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={s.id}
        className="mobile-page"
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} dragDirectionLock
        onDragEnd={(_, info) => { if (info.offset.x < -80) go(index + 1); else if (info.offset.x > 80) go(index - 1); }}
      >
        <div className="page-scroll">
          {s.visualFirst ? s.right : s.left}
          <hr className="page-sep" />
          {s.visualFirst ? s.left : s.right}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Toc({ current, visited, onPick, onClose }: { current: string; visited: Set<string>; onPick: (i: number) => void; onClose: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onClose]);
  return (
    <>
      <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.aside className="toc" role="dialog" aria-label="Table of contents" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 260 }}>
        <div className="toc-head"><h2>Contents</h2><button className="btn-ghost" onClick={onClose} aria-label="Close contents">✕</button></div>
        {CURRICULUM.map((part) => (
          <section key={part.id} className="toc-part">
            <h3><span className="toc-num">Part {part.num}</span> {part.title}</h3>
            <ol>
              {part.chapters.map((ch) => {
                const first = SPREADS.findIndex((s) => s.chapter === ch.id);
                const ready = first >= 0;
                const isHere = SPREADS[first]?.chapter === SPREADS.find((s) => s.id === current)?.chapter;
                const seen = ready && SPREADS.filter((s) => s.chapter === ch.id).every((s) => visited.has(s.id));
                return (
                  <li key={ch.id}>
                    {ready ? (
                      <button className={`toc-item ${isHere ? 'here' : ''}`} onClick={() => onPick(first)}>
                        {ch.title} {seen && <span className="toc-check" aria-label="read">✓</span>}
                      </button>
                    ) : (
                      <span className="toc-item soon" title="Planned, not written yet">{ch.title} <small>planned</small></span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </motion.aside>
    </>
  );
}
