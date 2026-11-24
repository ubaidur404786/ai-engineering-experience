import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SPREADS, CHAPTER_TITLES } from '../chapters/registry';
import { CURRICULUM } from '../data/curriculum';
import { STAGE_LABEL } from './types';
import { LabContext, LabOverlay } from './Lab';
import { startScene, stopAllScenes } from '../scene/store';
import { useIsNarrow } from './useIsNarrow';
import Fit from './Fit';

const FLIP_MS = 900;

function indexFromHash() {
  const m = location.hash.match(/^#p\/(.+)$/);
  const i = m ? SPREADS.findIndex((s) => s.id === m[1]) : -1;
  return i < 0 ? 0 : i;
}

export default function Book({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(indexFromHash);
  const [half, setHalf] = useState(0);   // phones: 0 = left page, 1 = right page of a two-page spread
  const [flip, setFlip] = useState<{ from: number; to: number } | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [lab, setLab] = useState<{ title: string; body: ReactNode } | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem('visited') || '[]')));
  const narrow = useIsNarrow();
  const [showText, setShowText] = useState(() => localStorage.getItem('showText') === 'on');
  const toggleText = () => setShowText((v) => { localStorage.setItem('showText', v ? 'off' : 'on'); return !v; });
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const spread = SPREADS[index];

  useEffect(() => {
    stopAllScenes();
    startScene(spread.id);   // load this page's voice, then John starts explaining by himself
    history.replaceState(null, '', `#p/${spread.id}`);
    setVisited((v) => {
      const n = new Set(v); n.add(spread.id);
      localStorage.setItem('visited', JSON.stringify([...n])); return n;
    });
    document.querySelector('.page-scroll')?.scrollTo(0, 0);
  }, [spread.id]);

  // links like #p/roles (or the browser's back button) open that page
  useEffect(() => {
    const on = () => setIndex(indexFromHash());
    addEventListener('hashchange', on); return () => removeEventListener('hashchange', on);
  }, []);

  const go = useCallback((to: number, toHalf = 0) => {
    if (to < 0 || to >= SPREADS.length || to === index || flip) return;
    setHalf(toHalf);
    if (narrow || reduce) { setIndex(to); return; }   // mobile + reduced motion: simple slide/fade instead of a 3D flip
    setFlip({ from: index, to });
    setTimeout(() => { setIndex(to); setFlip(null); }, FLIP_MS);
  }, [index, flip, narrow, reduce]);

  // Phones show one page at a time: scenes are one screen, other spreads are two pages (left, then right).
  const twoPages = narrow && !spread.visualFirst;
  const next = useCallback(() => { if (twoPages && half === 0) setHalf(1); else go(index + 1); }, [twoPages, half, go, index]);
  const prev = useCallback(() => {
    if (twoPages && half === 1) { setHalf(0); return; }
    const p = SPREADS[index - 1]; if (p) go(index - 1, narrow && !p.visualFirst ? 1 : 0);
  }, [twoPages, half, go, index, narrow]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lab || (e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);
  }, [next, prev, lab]);

  const chapterSpreads = SPREADS.filter((s) => s.chapter === spread.chapter);
  const posInChapter = chapterSpreads.indexOf(spread) + 1;

  return (
    <LabContext.Provider value={setLab}>
      <motion.div className="book-shell" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
        <nav className="topbar" aria-label="Book navigation">
          <button className="btn-ghost" onClick={onClose} title="Close the book">✕ <span className="hide-sm">Cover</span></button>
          <button className="btn-ghost" onClick={() => setTocOpen(true)} aria-expanded={tocOpen} aria-label="Contents">☰ <span className="hide-sm">Contents</span></button>
          <div className="crumb" aria-live="polite">
            <span className="crumb-ch">{CHAPTER_TITLES[spread.chapter]}</span>
            {spread.stage && <span className="crumb-stage">{STAGE_LABEL[spread.stage]}</span>}
          </div>
          {narrow && spread.visualFirst && (
            <button className={`btn-ghost text-toggle ${showText ? 'on' : ''}`} onClick={toggleText} aria-pressed={showText} title="Show or hide John’s text page">
              {showText ? '🎬 Stage' : '📝 Text'}
            </button>
          )}
          <div className="progress" role="progressbar" aria-label="Chapter progress" aria-valuemin={1} aria-valuemax={chapterSpreads.length} aria-valuenow={posInChapter}>
            {chapterSpreads.map((s) => <span key={s.id} className={`dot ${s.id === spread.id ? 'on' : visited.has(s.id) ? 'seen' : ''}`} />)}
          </div>
        </nav>

        {narrow ? (
          <MobileBook index={index} half={half} next={next} prev={prev} showText={showText} />
        ) : (
          <div className="book" aria-live="polite">
            <BookSpread index={flip ? (flip.to > flip.from ? flip.from : flip.to) : index} side="left" />
            <BookSpread index={flip ? (flip.to > flip.from ? flip.to : flip.from) : index} side="right" />
            <div className="spine" aria-hidden="true" />
            {flip && <Leaf flip={flip} />}
          </div>
        )}

        {narrow ? (
          <nav className="fab-nav" aria-label="Turn page">
            <button className="fab" onClick={prev} disabled={index === 0 && half === 0} aria-label="Previous page">‹</button>
            <span className="fab-num">{index + 1} / {SPREADS.length}</span>
            <button className="fab next" onClick={next} disabled={index === SPREADS.length - 1 && (!twoPages || half === 1)} aria-label="Next page">›</button>
          </nav>
        ) : (
          <footer className="pager">
            <button className="btn-ghost" onClick={() => go(index - 1)} disabled={index === 0}>← Previous</button>
            <span className="pager-num">{index + 1} / {SPREADS.length}</span>
            <button className="btn-primary sm" onClick={() => go(index + 1)} disabled={index === SPREADS.length - 1}>Next →</button>
          </footer>
        )}

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
      <div className="page-scroll"><Fit>{side === 'left' ? s.left : s.right}</Fit></div>
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
      <div className="leaf-face leaf-front"><div className="page-scroll"><Fit>{front}</Fit></div><div className="leaf-shade" /></div>
      <div className="leaf-face leaf-backface"><div className="page-scroll"><Fit>{back}</Fit></div><div className="leaf-shade" /></div>
    </motion.div>
  );
}

/**
 * Phones: one page fills the screen, never scrolls. A narrated scene is one page (stage + subtitle + controls;
 * "Text" swaps to John's text page). Other spreads are two pages, left then right. Swipe or ‹ › to turn.
 */
function MobileBook({ index, half, next, prev, showText }: { index: number; half: number; next: () => void; prev: () => void; showText: boolean }) {
  const s = SPREADS[index];
  const content = s.visualFirst ? (showText ? s.left : s.right) : half === 0 ? s.left : s.right;
  const key = `${s.id}-${s.visualFirst ? (showText ? 't' : 's') : half}`;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        className={`mobile-page ${s.visualFirst && !showText ? 'text-hidden' : ''}`}
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} dragDirectionLock
        onDragEnd={(_, info) => { if (info.offset.x < -80) next(); else if (info.offset.x > 80) prev(); }}
      >
        <div className="page-scroll"><Fit>{content}</Fit></div>
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
