import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Tiktoken } from 'js-tiktoken/lite';
import { encodeReal, loadReal, preTokenize, REAL_INFO, showToken, utf8, type RealName, type Tok } from './tokenizers';

/**
 * Follows one message through a REAL byte-level BPE tokenizer, one stage at a time.
 * Every value shown here is computed live by the selected tokenizer; nothing is hardcoded.
 */
const STAGES = [
  { key: 'text', title: '1 · Your text', note: 'This is exactly what you typed. To a neural network it is not usable yet: networks only do arithmetic on numbers.' },
  { key: 'bytes', title: '2 · UTF-8 bytes', note: 'Byte-level tokenizers first turn the text into bytes (numbers 0–255). Every possible text in every language becomes bytes, so nothing is ever "unknown".' },
  { key: 'pre', title: '3 · Pre-tokenization', note: 'A regular expression cuts the text into rough pieces: words with their leading space, numbers, punctuation. BPE never merges across these cuts. (Pattern shown is GPT-2’s; cl100k/o200k use their own.)' },
  { key: 'tokens', title: '4 · BPE tokens', note: 'Inside each piece, BPE repeatedly merges the byte pairs it learned during training. What is left are the tokens. Common words stay whole; rare words break into pieces.' },
  { key: 'lookup', title: '5 · Vocabulary lookup', note: 'Each token has a fixed row number in the vocabulary. That row number is the token ID.' },
  { key: 'ids', title: '6 · Token IDs', note: 'This list of integers is what the model actually receives. Next chapter: each ID picks a row of the embedding matrix, a vector of learned numbers.' },
] as const;

const EXAMPLES = ['How do we make tea?', 'Ubaid is learning tokenization.', 'antidisestablishmentarianism', 'chai ☕ چائے 茶', 'print("hello")  # Python', '1234567 + 89 = 1234656'];

export default function TokenizerLab({ initial = 'How do we make tea?' }: { initial?: string }) {
  const [text, setText] = useState(initial);
  const [name, setName] = useState<RealName>('gpt2');
  const [tk, setTk] = useState<Tiktoken | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    let alive = true; setLoading(true);
    loadReal(name).then((t) => { if (alive) { setTk(t); setLoading(false); } });
    return () => { alive = false; };
  }, [name]);

  useEffect(() => {
    if (!playing) return;
    if (stage >= STAGES.length - 1) { setPlaying(false); return; }
    const id = setTimeout(() => setStage((s) => s + 1), 2200 / speed);
    return () => clearTimeout(id);
  }, [playing, stage, speed]);

  const toks: Tok[] = useMemo(() => (tk ? encodeReal(tk, text) : []), [tk, text]);
  const bytes = useMemo(() => utf8(text), [text]);
  const pieces = useMemo(() => preTokenize(text), [text]);
  const chars = [...text].length;

  return (
    <div className="tlab">
      <div className="tlab-controls">
        <label className="field grow">
          <span>Your message</span>
          <input value={text} maxLength={400} onChange={(e) => setText(e.target.value)} spellCheck={false} />
        </label>
        <label className="field">
          <span>Tokenizer (real)</span>
          <select value={name} onChange={(e) => setName(e.target.value as RealName)}>
            {(Object.keys(REAL_INFO) as RealName[]).map((n) => <option key={n} value={n}>{REAL_INFO[n].label} · {REAL_INFO[n].vocab} tokens</option>)}
          </select>
        </label>
      </div>
      <div className="chips" role="group" aria-label="Example sentences">
        {EXAMPLES.map((e) => <button key={e} className={`chip ${e === text ? 'on' : ''}`} onClick={() => setText(e)}>{e}</button>)}
      </div>

      <div className="stepper" role="group" aria-label="Animation controls">
        <button className="btn-ghost" onClick={() => setStage((s) => Math.max(0, s - 1))} disabled={stage === 0} aria-label="Previous step">◀</button>
        <button className="btn-primary sm" onClick={() => { if (stage >= STAGES.length - 1) setStage(0); setPlaying((p) => !p); }}>
          {playing ? '❚❚ Pause' : stage >= STAGES.length - 1 ? '↺ Replay' : '▶ Play'}
        </button>
        <button className="btn-ghost" onClick={() => setStage((s) => Math.min(STAGES.length - 1, s + 1))} disabled={stage === STAGES.length - 1} aria-label="Next step">▶</button>
        <button className="btn-ghost" onClick={() => { setStage(0); setPlaying(false); }}>Reset</button>
        <label className="speed">Speed
          <select value={speed} onChange={(e) => setSpeed(+e.target.value)}>
            <option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option>
          </select>
        </label>
        <ol className="stage-dots">
          {STAGES.map((s, i) => <li key={s.key}><button className={i === stage ? 'on' : i < stage ? 'done' : ''} onClick={() => setStage(i)} aria-label={s.title} aria-current={i === stage}>{i + 1}</button></li>)}
        </ol>
      </div>

      <div className="tlab-stage" aria-live="polite">
        <h3>{STAGES[stage].title}</h3>
        <p className="stage-note">{STAGES[stage].note}</p>
        {loading && <p className="muted">Loading the {REAL_INFO[name].label} vocabulary (a few MB, first time only)…</p>}

        <div className="stage-canvas">
          <AnimatePresence mode="wait">
            <motion.div key={STAGES[stage].key + name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              {stage === 0 && <div className="bigtext">{text || <span className="muted">type something…</span>}</div>}

              {stage === 1 && (
                <div className="flow-wrap">
                  {[...text].map((c, i) => (
                    <motion.div key={i} className="charbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.03, 1.5) }}>
                      <span className="cb-char">{c === ' ' ? '·' : c}</span>
                      <span className="cb-bytes">{utf8(c).join(' ')}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {stage === 2 && (
                <div className="flow-wrap">
                  {pieces.map((p, i) => (
                    <motion.span key={i} className="piece" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.08, 1.5) }}>
                      {showToken(p)}
                    </motion.span>
                  ))}
                </div>
              )}

              {stage >= 3 && (
                <div className="flow-wrap">
                  {toks.map((t, i) => (
                    <motion.span
                      key={i}
                      className={`tok c${i % 6} ${hover === i ? 'hl' : ''}`}
                      onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stage === 3 ? Math.min(i * 0.07, 1.5) : 0 }}
                    >
                      <span className="tok-text">{showToken(t.text, t.bytes)}</span>
                      {stage >= 5 && <span className="tok-id">{t.id}</span>}
                    </motion.span>
                  ))}
                </div>
              )}

              {stage === 4 && (
                <div className="vocab-table" role="table" aria-label="Vocabulary lookup">
                  <div className="vt-row vt-head" role="row"><span role="columnheader">token (as bytes → text)</span><span role="columnheader">vocabulary row = ID</span></div>
                  {toks.slice(0, 14).map((t, i) => (
                    <motion.div key={i} role="row" className={`vt-row ${hover === i ? 'hl' : ''}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <span role="cell"><code>{JSON.stringify(t.text.includes('�') ? t.bytes : t.text)}</code></span>
                      <span role="cell" className="vt-arrow">→ <b>{t.id}</b></span>
                    </motion.div>
                  ))}
                  {toks.length > 14 && <p className="muted">…and {toks.length - 14} more</p>}
                </div>
              )}

              {stage === 5 && (
                <pre className="idseq" aria-label="Token ID sequence">[{toks.map((t) => t.id).join(', ')}]</pre>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <dl className="stats">
        <div><dt>Characters</dt><dd>{chars}</dd></div>
        <div><dt>UTF-8 bytes</dt><dd>{bytes.length}</dd></div>
        <div><dt>Pre-token pieces</dt><dd>{pieces.length}</dd></div>
        <div><dt>Tokens ({REAL_INFO[name].label})</dt><dd>{tk ? toks.length : '…'}</dd></div>
        <div><dt>Characters per token</dt><dd>{toks.length ? (chars / toks.length).toFixed(2) : '–'}</dd></div>
      </dl>
      <p className="provenance">
        <span className="tag real">Real execution</span> Tokens and IDs are produced live by the actual <b>{REAL_INFO[name].label}</b> byte-level BPE
        (used by {REAL_INFO[name].usedBy}) running in your browser via <code>js-tiktoken</code>. They match Python’s <code>tiktoken</code> for the same encoding.
      </p>
    </div>
  );
}

/** Same sentence, three real vocabularies, side by side. */
export function CompareTokenizers({ text: initial = 'Tokenization is not the same as splitting words.' }: { text?: string }) {
  const [text, setText] = useState(initial);
  const [tks, setTks] = useState<Partial<Record<RealName, Tiktoken>>>({});
  const names = Object.keys(REAL_INFO) as RealName[];
  useEffect(() => { names.forEach((n) => loadReal(n).then((t) => setTks((o) => ({ ...o, [n]: t })))); }, []); // eslint-disable-line
  return (
    <div className="compare">
      <label className="field"><span>Sentence</span><input value={text} onChange={(e) => setText(e.target.value)} maxLength={300} /></label>
      {names.map((n) => {
        const t = tks[n]; const toks = t ? encodeReal(t, text) : [];
        return (
          <div key={n} className="cmp-row">
            <div className="cmp-label"><b>{REAL_INFO[n].label}</b><small>{REAL_INFO[n].vocab} vocab · {t ? `${toks.length} tokens` : 'loading…'}</small></div>
            <div className="flow-wrap tight">{toks.map((x, i) => <span key={i} className={`tok sm c${i % 6}`}><span className="tok-text">{showToken(x.text, x.bytes)}</span></span>)}</div>
          </div>
        );
      })}
      <p className="provenance"><span className="tag real">Real execution</span> Bigger vocabularies usually need fewer tokens for the same text, especially for code and non-English languages.</p>
    </div>
  );
}

/** Small inline preview shown on the book page (before the reader opens the lab). */
export function TokenPreview({ text }: { text: string }) {
  const [toks, setToks] = useState<Tok[]>([]);
  const ref = useRef(text);
  useEffect(() => { ref.current = text; loadReal('gpt2').then((t) => ref.current === text && setToks(encodeReal(t, text))); }, [text]);
  return <div className="flow-wrap tight">{toks.map((t, i) => <span key={i} className={`tok sm c${i % 6}`}><span className="tok-text">{showToken(t.text, t.bytes)}</span><span className="tok-id">{t.id}</span></span>)}</div>;
}
