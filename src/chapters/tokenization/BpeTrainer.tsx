import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { bpeApply, bpeInit, bpePairCounts, bpeStep, charTokenize, wordTokenize, WORD_VOCAB, type BpeState } from './tokenizers';

const CORPUS = 'low lower lowest newer newest wider widest tea teapot teacup teaching low low lower newest newest';

/** SIMULATION: train a tiny BPE, merge by merge, and watch how a test word's split changes. */
export function BpeTrainer() {
  const [corpus, setCorpus] = useState(CORPUS);
  const [history, setHistory] = useState<BpeState[]>(() => [bpeInit(CORPUS)]);
  const [probe, setProbe] = useState('lowest teapots');
  const cur = history[history.length - 1];
  const pairs = useMemo(() => bpePairCounts(cur).slice(0, 5), [cur]);
  const next = () => { const n = bpeStep(cur); if (n) setHistory((h) => [...h, n]); };
  const reset = (c = corpus) => setHistory([bpeInit(c)]);

  return (
    <div className="bpe">
      <p className="sim-banner"><span className="tag sim">Simulation</span> A real BPE algorithm on a toy corpus of letters (real GPT tokenizers do this on bytes, over billions of words, for ~50k–200k merges). <code>_</code> marks the end of a word.</p>
      <label className="field"><span>Training corpus</span>
        <textarea rows={2} value={corpus} onChange={(e) => { setCorpus(e.target.value); reset(e.target.value); }} />
      </label>

      <div className="bpe-grid">
        <div>
          <h4>Most frequent adjacent pairs</h4>
          <ol className="pairs">
            {pairs.map((p, i) => (
              <motion.li key={p.pair.join('|')} layout className={i === 0 ? 'top' : ''}>
                <code>{p.pair[0]}</code> + <code>{p.pair[1]}</code> <span className="muted">× {p.n}</span>
              </motion.li>
            ))}
            {!pairs.length && <li className="muted">No pairs left.</li>}
          </ol>
          <div className="row">
            <button className="btn-primary sm" onClick={next} disabled={!pairs.length || pairs[0].n < 2}>Merge top pair</button>
            <button className="btn-ghost" onClick={() => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))} disabled={history.length < 2}>Undo</button>
            <button className="btn-ghost" onClick={() => reset()}>Reset</button>
          </div>
          <p className="muted">Merges learned: {cur.merges.length} · Vocabulary size: {cur.vocab.length}</p>
        </div>
        <div>
          <h4>Corpus right now</h4>
          <div className="flow-wrap tight">
            {cur.words.map((w, i) => (
              <span key={i} className="bpe-word">
                {w.symbols.map((s, j) => <motion.span layout key={j} className="bpe-sym">{s}</motion.span>)}
                <small>×{w.count}</small>
              </span>
            ))}
          </div>
        </div>
      </div>

      <label className="field"><span>Encode a new word with the merges learned so far</span><input value={probe} onChange={(e) => setProbe(e.target.value)} /></label>
      <div className="flow-wrap tight">
        {(probe.match(/\p{L}+/gu) ?? []).map((w, i) => (
          <span key={i} className="bpe-word">{bpeApply(cur.merges, w).map((s, j) => <span key={j} className="bpe-sym">{s}</span>)}</span>
        ))}
      </div>
      <p className="muted">Notice: "teapots" was never in the corpus, yet it is still encoded, from pieces BPE did learn. That is why subword tokenizers have no "unknown word" problem.</p>
    </div>
  );
}

/** SIMULATION: character vs word vs (real) subword on the same text. */
export function ThreeApproaches() {
  const [text, setText] = useState('How do we make chai tea?');
  const chars = charTokenize(text), words = wordTokenize(text);
  return (
    <div className="compare">
      <label className="field"><span>Try a sentence (include an unusual word)</span><input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} /></label>
      <div className="cmp-row">
        <div className="cmp-label"><b>Character-level</b><small>{chars.length} tokens · tiny vocab</small></div>
        <div className="flow-wrap tight">{chars.map((t, i) => <span key={i} className="tok sm c1"><span className="tok-text">{t.text === ' ' ? '·' : t.text}</span></span>)}</div>
      </div>
      <div className="cmp-row">
        <div className="cmp-label"><b>Word-level</b><small>{words.length} tokens · vocab of {WORD_VOCAB.length} words</small></div>
        <div className="flow-wrap tight">{words.map((t, i) => <span key={i} className={`tok sm ${t.id === 0 ? 'unk' : 'c3'}`}><span className="tok-text">{t.text}</span></span>)}</div>
      </div>
      <p className="sim-banner"><span className="tag sim">Simulation</span> Both rows are teaching toys: the word vocabulary is deliberately tiny so you can see <code>&lt;unk&gt;</code> appear. Real word-level vocabularies hold tens of thousands of words and still miss names, typos and new words.</p>
    </div>
  );
}
