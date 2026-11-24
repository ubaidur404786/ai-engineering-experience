import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { LabLauncher } from '../../book/ui';
import { encodeReal, loadReal, preTokenize, showToken, utf8, bpeInit, bpeStep, bpePairCounts, type Tok } from './tokenizers';
import TokenizerLab, { CompareTokenizers } from './TokenizerLab';
import { BpeTrainer } from './BpeTrainer';

const CH = 'tokenization';
const TEA = 'How do we make tea?';

/** Real GPT-2 tokens for a text (loads the vocabulary once). */
function useGpt2(text: string): Tok[] {
  const [t, set] = useState<Tok[]>([]);
  useEffect(() => { let ok = true; loadReal('gpt2').then((tk) => ok && set(encodeReal(tk, text))); return () => { ok = false; }; }, [text]);
  return t;
}

/** A row of token chips laid out in SVG, optional IDs underneath. */
function Chips({ toks, x, y, showIds, gap = 6, size = 15, highlight }: { toks: Tok[]; x: number; y: number; showIds?: boolean; gap?: number; size?: number; highlight?: number }) {
  const widths = toks.map((t) => Math.max(26, showToken(t.text, t.bytes).length * size * 0.62 + 14));
  let cx = x;
  return (
    <g>
      {toks.map((t, i) => {
        const w = widths[i]; const px = cx; cx += w + gap;
        return (
          <motion.g key={i + t.text} initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 160, damping: 14 }}>
            <rect x={px} y={y} width={w} height={30} rx={6} className={`chip-r c${i % 6} ${highlight === i ? 'hot' : ''}`} />
            <text x={px + w / 2} y={y + 20} textAnchor="middle" className="chip-t" style={{ fontSize: size }}>{showToken(t.text, t.bytes)}</text>
            {showIds && (
              <motion.text x={px + w / 2} y={y + 52} textAnchor="middle" className="chip-id" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>{t.id}</motion.text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

/* ============ Scene 1: the journey of a message ============ */

function JourneyDiagram({ step }: { step: number }) {
  const toks = useGpt2(TEA);
  return (
    <g>
      {/* chat bubble */}
      <motion.g animate={{ opacity: 1 }}>
        <rect x="30" y="40" width="230" height="64" rx="18" className={`chat ${step === 0 ? 'hot' : ''}`} />
        <text x="145" y="80" textAnchor="middle" className="chat-t">{TEA}</text>
        <text x="40" y="30" className="cap">you, pressing Enter ↵</text>
      </motion.g>
      {/* model */}
      <Box x={420} y={36} w={150} h={120} label="LLM" sub="math on numbers" tone="night" hot={step === 1 || step === 5} />
      {step === 5 && <motion.circle cx="495" cy="96" r="70" className="glow" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.2] }} transition={{ duration: 1.5 }} />}
      {/* direct path that fails */}
      {step === 1 && (
        <g>
          <Flow d="M262 72 L416 72" color="#b4533f" count={2} />
          <motion.text x="340" y="62" textAnchor="middle" className="nope" initial={{ scale: 0 }} animate={{ scale: 1 }}>✕</motion.text>
        </g>
      )}
      {/* tokenizer */}
      <Box x={60} y={180} w={170} h={64} label="Tokenizer" sub="text → numbers" tone="brass" hot={step === 2 || step === 3} dim={step < 2} />
      {step >= 2 && <Flow d="M145 106 L145 176" />}
      {/* tokens + ids */}
      {step >= 3 && toks.length > 0 && <Chips toks={toks} x={40} y={290} showIds={step >= 4} />}
      {step >= 3 && <text x="40" y="280" className="cap">tokens{step >= 4 ? ' and their IDs' : ''}</text>}
      {step >= 5 && <Flow d="M330 335 C440 335 495 260 495 160" color="#c4974a" />}
    </g>
  );
}

const journey = scene({
  id: 'tok-imagine', chapter: CH, stage: 'imagine', kicker: 'Part 2 · Tokenization', title: 'What happens after you press Enter?',
  cues: [
    { say: 'Imagine you type: How do we make tea? And you press Enter. Let’s follow your message on its journey.', point: [145, 72], bubble: 'your message' },
    { say: 'Can the model read your sentence directly? No. Inside, a model is a giant math formula. It multiplies numbers. It has no idea what a letter is.', point: [495, 96], bubble: '🤔 letters? I only know numbers…' },
    { say: 'So first, your text visits a translator called the tokenizer.', point: [145, 212], bubble: 'the translator' },
    { say: 'The tokenizer cuts your text into pieces called tokens. Look: six tokens, not five words. And the space sticks to the front of the word.', point: [100, 305], bubble: '“·do” includes the space!' },
    { say: 'Each token is replaced by its number in a fixed list called the vocabulary. These numbers are token IDs.', point: [300, 342], bubble: '8887 means “·tea” in GPT-2' },
    { say: 'Only this list of numbers enters the model. That is tokenization: turning text into numbers the model can compute with.', point: [495, 140], bubble: '✓ numbers! now I can work' },
  ],
  draw: (s) => <JourneyDiagram step={s} />,
  details: <p>Everything on this page is real GPT-2 output, computed in your browser: <code>[2437, 466, 356, 787, 8887, 30]</code>. A different model uses a different vocabulary, so it gets different IDs.</p>,
});

/* ============ Scene 2: inside the tokenizer ============ */

function PipelineDiagram({ step }: { step: number }) {
  const toks = useGpt2(TEA);
  const bytes = useMemo(() => utf8(TEA), []);
  const pieces = useMemo(() => preTokenize(TEA), []);
  const rows = ['Text', 'Bytes', 'Pieces', 'Tokens', 'IDs'];
  const Y = [36, 106, 176, 246, 326];
  return (
    <g>
      {rows.map((r, i) => (
        <motion.g key={r} animate={{ opacity: step >= i ? 1 : 0.18 }}>
          <text x="16" y={Y[i] + 20} className={`rowlab ${step === i ? 'on' : ''}`}>{r}</text>
          {i < 4 && step > i && <Flow d={`M300 ${Y[i] + 36} L300 ${Y[i + 1] - 6}`} count={2} dur={1} />}
        </motion.g>
      ))}
      <text x="90" y={Y[0] + 22} className="bigline">{TEA}</text>
      {step >= 1 && bytes.map((b, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <rect x={90 + i * 26} y={Y[1]} width="23" height="30" rx="4" className="byte-r" />
          <text x={90 + i * 26 + 11.5} y={Y[1] + 19} textAnchor="middle" className="byte-t">{b}</text>
        </motion.g>
      ))}
      {step >= 2 && (() => { let x = 90; return pieces.map((p, i) => { const w = p.length * 10 + 16; const px = x; x += w + 8; return (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
          <rect x={px} y={Y[2]} width={w} height="30" rx="6" className="piece-r" />
          <text x={px + w / 2} y={Y[2] + 20} textAnchor="middle" className="chip-t">{showToken(p)}</text>
        </motion.g>); }); })()}
      {step >= 3 && <Chips toks={toks} x={90} y={Y[3]} showIds={false} highlight={step === 3 ? 4 : undefined} />}
      {step >= 4 && <Chips toks={toks} x={90} y={Y[4] - 22} showIds />}
    </g>
  );
}

const pipeline = scene({
  id: 'tok-pipeline', chapter: CH, stage: 'visualize', kicker: 'Visualize', title: 'Inside the tokenizer',
  cues: [
    { say: 'Let’s open the tokenizer and watch what happens inside, one step at a time.', point: [220, 50], bubble: 'start: plain text' },
    { say: 'First, every character becomes bytes: numbers from zero to two hundred fifty-five. Any language, even emoji, can be written as bytes. So nothing is ever unknown.', point: [102, 121], bubble: '“H” is byte 72' },
    { say: 'Next, a pattern cuts the text into rough pieces: words with their leading space, and punctuation.', point: [180, 191], bubble: 'cut at spaces & punctuation' },
    { say: 'Inside each piece, the BPE algorithm merges bytes that it learned belong together. Common words like tea become a single token.', point: [300, 261], bubble: '“·tea” is common → 1 token' },
    { say: 'Finally, a vocabulary lookup turns every token into its ID. This list of integers is what the model receives.', point: [300, 345], bubble: 'ID = row number in the vocabulary' },
  ],
  draw: (s) => <PipelineDiagram step={s} />,
  below: (
    <LabLauncher title="Tokenizer Lab" blurb="Type your own sentence. Three real tokenizers run right in your browser.">
      <TokenizerLab />
    </LabLauncher>
  ),
  details: <p>The cutting pattern shown is GPT-2’s real regular expression. Newer tokenizers (cl100k, o200k) use different patterns, for example splitting numbers into groups of up to three digits.</p>,
});

/* ============ Scene 3: common vs rare words ============ */

function RareDiagram({ step }: { step: number }) {
  const tea = useGpt2(' tea');
  const name = useGpt2(' Ubaid');
  const shelf = ['·the', '·make', '·tea', '·do', '·we', 'aid', '·Ub', '?'];
  return (
    <g>
      <text x="300" y="30" textAnchor="middle" className="cap">the vocabulary: a shelf of known pieces</text>
      {shelf.map((s, i) => {
        const hit = (step === 1 && s === '·tea') || (step >= 3 && (s === '·Ub' || s === 'aid'));
        return (
          <g key={s}>
            <motion.rect x={40 + i * 66} y="42" width="60" height="34" rx="5" className={`shelf ${hit ? 'hot' : ''}`} animate={{ y: hit ? 36 : 42 }} />
            <text x={70 + i * 66} y="64" textAnchor="middle" className="chip-t sm">{s}</text>
          </g>
        );
      })}
      <text x="560" y="98" textAnchor="end" className="cap">…50,257 pieces in GPT-2</text>
      {/* tea */}
      <g>
        <text x="140" y="150" textAnchor="middle" className="word">“tea”</text>
        {step >= 1 && <Flow d="M140 160 L140 210" count={2} dur={1} />}
        {step >= 1 && tea.length > 0 && <Chips toks={tea} x={110} y={225} showIds />}
        {step >= 1 && <text x="140" y="310" textAnchor="middle" className="ok">✓ 1 token</text>}
      </g>
      {/* name */}
      <g>
        <text x="430" y="150" textAnchor="middle" className="word">“Ubaid”</text>
        {step === 2 && <motion.text x="430" y="200" textAnchor="middle" className="nope" initial={{ scale: 0 }} animate={{ scale: 1 }}>not on the shelf</motion.text>}
        {step >= 3 && <Flow d="M430 160 L430 210" count={2} dur={1} color="#c4974a" />}
        {step >= 3 && name.length > 0 && <Chips toks={name} x={380} y={225} showIds gap={14} />}
        {step >= 3 && <text x="430" y="310" textAnchor="middle" className="warn">{name.length} tokens</text>}
      </g>
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <rect x="120" y="340" width="360" height="50" rx="10" className="sbox night" />
          <text x="300" y="370" textAnchor="middle" className="slabel night">more pieces → more cost, less context</text>
        </motion.g>
      )}
    </g>
  );
}

const rare = scene({
  id: 'tok-interact', chapter: CH, stage: 'interact', kicker: 'Discover', title: 'Why does my name break into pieces?',
  cues: [
    { say: 'Here is a puzzle. Why does a common word stay whole, but a name gets broken into pieces?', point: [300, 58], bubble: 'the vocabulary' },
    { say: 'The word tea appears so often in training text that it earned its own place in the vocabulary. One token.', point: [140, 240], bubble: 'found on the shelf ✓' },
    { say: 'The name Ubaid is much rarer. There is no single entry for it on the shelf.', point: [430, 195], bubble: 'hmm… not found' },
    { say: 'So the tokenizer builds it from pieces it does have: U b, and a i d. A tokenizer never fails. It just uses smaller pieces.', point: [430, 240], bubble: 'built from known pieces' },
    { say: 'This matters. Rare words, other languages and code often need more tokens. And you pay per token, and context limits count tokens.', point: [300, 365], bubble: 'tokens = money + memory' },
  ],
  draw: (s) => <RareDiagram step={s} />,
  below: (
    <LabLauncher title="Compare three real tokenizers" blurb="Same sentence through GPT-2, GPT-4 and GPT-4o vocabularies. Try your own name.">
      <CompareTokenizers text="Ubaid asked: how do we make chai? 🫖" />
    </LabLauncher>
  ),
  details: <p>Rough rule for English with GPT-4-era tokenizers: about 4 characters per token. Urdu, Chinese or Arabic text usually needs more tokens for the same meaning, which is one reason newer tokenizers use larger vocabularies (≈200k in o200k_base).</p>,
});

/* ============ Scene 4: how BPE learns ============ */

const BPE_CORPUS = 'low lower lowest low newest newer low lowest';
const BPE_STATES = (() => { const out = [bpeInit(BPE_CORPUS)]; for (let i = 0; i < 5; i++) out.push(bpeStep(out[out.length - 1])!); return out; })();

function BpeDiagram({ step }: { step: number }) {
  const st = BPE_STATES[Math.min(step, 5)];
  const top = bpePairCounts(st)[0];
  return (
    <g>
      <text x="20" y="30" className="cap">training text (×count) · “_” marks the end of a word</text>
      {st.words.map((w, wi) => {
        let x = 20; const y = 50 + wi * 52;
        return (
          <g key={wi}>
            {w.symbols.map((s, si) => {
              const isPair = step < 5 && top && si < w.symbols.length - 1 && s === top.pair[0] && w.symbols[si + 1] === top.pair[1];
              const isPair2 = step < 5 && top && si > 0 && w.symbols[si - 1] === top.pair[0] && s === top.pair[1];
              const wpx = s.length * 13 + 18; const px = x; x += wpx + 4;
              return (
                <motion.g key={si + s} layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
                  <rect x={px} y={y} width={wpx} height="34" rx="6" className={`bsym ${isPair || isPair2 ? 'hot' : ''} ${s.length > 1 ? 'merged' : ''}`} />
                  <text x={px + wpx / 2} y={y + 22} textAnchor="middle" className="chip-t">{s}</text>
                </motion.g>
              );
            })}
            <text x={x + 6} y={y + 22} className="cap">×{w.count}</text>
          </g>
        );
      })}
      <g>
        <text x="430" y="30" className="cap">merges learned</text>
        {st.merges.map(([a, b], i) => (
          <motion.text key={i} x="430" y={58 + i * 30} className="merge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{i + 1}. {a} + {b} → {a + b}</motion.text>
        ))}
        <text x="430" y="230" className="cap">vocabulary size: {st.vocab.length}</text>
      </g>
      {top && step < 5 && <text x="20" y="400" className="cap">most frequent pair now: “{top.pair[0]}” + “{top.pair[1]}” (×{top.n})</text>}
    </g>
  );
}

const bpe = scene({
  id: 'tok-bpe', chapter: CH, stage: 'behind', kicker: 'Behind the scenes', title: 'How does the tokenizer learn its pieces?',
  cues: [
    { say: 'Where does the vocabulary come from? It is learned from text, by an algorithm called Byte Pair Encoding. We start with single letters.', point: [80, 66], bubble: 'start: single letters' },
    { say: 'Count every pair of neighbours. L and O appear together most often, so they are merged into one new piece: L O.', point: [60, 66], bubble: '“l”+“o” → “lo”', step: 1 },
    { say: 'Count again, merge again. L O plus W becomes low. Now the whole word low is a single piece.', point: [70, 66], bubble: '“lo”+“w” → “low”', step: 2 },
    { say: 'Next, E and S, then E S and T. The ending “est” appears in lowest and newest, so it becomes a piece too.', point: [130, 170], bubble: 'shared endings get merged', step: 4 },
    { say: 'Every merge adds one piece to the vocabulary. GPT-2 repeated this about fifty thousand times on a huge amount of text. That is why common words end up as single tokens.', point: [480, 150], bubble: 'GPT-2: 50,257 pieces', step: 5 },
  ],
  draw: (s) => <BpeDiagram step={s} />,
  below: (
    <LabLauncher title="BPE Training Lab" blurb="Merge pairs yourself on your own text, then encode a word the tokenizer has never seen.">
      <BpeTrainer />
    </LabLauncher>
  ),
  details: (
    <>
      <p><b>Simulation:</b> this is the real BPE algorithm on a toy text of letters. Real GPT tokenizers run it on bytes, over billions of words.</p>
      <p><b>Other methods:</b> WordPiece (BERT) picks merges that most raise the data likelihood and marks word continuations with <code>##</code>. Unigram (T5, via SentencePiece) starts big and prunes. Character-level needs very long sequences; word-level can’t handle unseen words (<code>&lt;unk&gt;</code>).</p>
    </>
  ),
});

/* ============ Scene 5: token ID is not meaning ============ */

const VEC = [0.42, -0.31, 0.77, -0.12, 0.25, -0.58, 0.64, 0.08, -0.36, 0.51, -0.21, 0.33]; // ILLUSTRATIVE

function EmbedDiagram({ step }: { step: number }) {
  return (
    <g>
      <rect x="30" y="60" width="90" height="40" rx="7" className="chip-r c2" />
      <text x="75" y="86" textAnchor="middle" className="chip-t">·tea</text>
      <Flow d="M122 80 L168 80" count={2} dur={1} />
      <rect x="172" y="60" width="80" height="40" rx="7" className={`idbox ${step <= 1 ? 'hot' : ''}`} />
      <text x="212" y="86" textAnchor="middle" className="chip-id big">8887</text>
      {step === 1 && <motion.text x="212" y="130" textAnchor="middle" className="cap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>an address, not a meaning</motion.text>}
      {/* embedding matrix */}
      <motion.g animate={{ opacity: step >= 2 ? 1 : 0.25 }}>
        <text x="300" y="40" className="cap">embedding matrix (50,257 rows)</text>
        {Array.from({ length: 11 }, (_, r) => (
          <rect key={r} x="300" y={52 + r * 18} width="260" height="14" rx="2" className={`mrow ${r === 5 && step >= 2 ? 'hot' : ''}`} />
        ))}
        {step >= 2 && <text x="292" y="153" textAnchor="end" className="cap">row 8887 →</text>}
        {step >= 2 && <Flow d="M254 80 C280 80 270 150 298 150" count={2} dur={1} color="#c4974a" />}
      </motion.g>
      {/* vector */}
      {step >= 3 && (
        <g>
          <text x="300" y="275" className="cap">the vector for “·tea” (first 12 of 768 numbers)</text>
          <line x1="300" x2="570" y1="340" y2="340" className="axis" />
          {VEC.map((v, i) => (
            <motion.rect key={i} x={304 + i * 22} width="16" rx="2" className={v >= 0 ? 'bar pos' : 'bar neg'}
              initial={{ height: 0, y: 340 }} animate={{ height: Math.abs(v) * 55, y: v >= 0 ? 340 - v * 55 : 340 }} transition={{ delay: i * 0.05 }} />
          ))}
          <Flow d="M430 210 L430 262" count={2} dur={1} color="#c4974a" />
        </g>
      )}
      {step >= 4 && <motion.text x="30" y="250" className="next" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>next chapter →</motion.text>}
    </g>
  );
}

const embed = scene({
  id: 'tok-misconceptions', chapter: CH, stage: 'behind', kicker: 'Common trap', title: 'A token ID is not the meaning',
  cues: [
    { say: 'One last trap that confuses many people. Is the token ID the meaning of the word?', point: [212, 80], bubble: '8887… is that “tea”-ness?' },
    { say: 'No. The ID is just an address, like a shelf number in a library. 8887 is not more tea-like than 30. The numbers themselves mean nothing.', point: [212, 80], bubble: 'just an address' },
    { say: 'The model uses that address to open one row of a big table called the embedding matrix.', point: [430, 150], bubble: 'open row 8887' },
    { say: 'That row is a vector: a list of hundreds of learned numbers. GPT-2 small uses 768. This is where meaning starts to live.', point: [430, 320], bubble: 'these bar values are illustrative' },
    { say: 'How those vectors are learned, and how they capture meaning, is our next chapter. Well done. You now know what happens after you press Enter.', point: [90, 245], bubble: 'see you there!' },
  ],
  draw: (s) => <EmbedDiagram step={s} />,
  details: <p><b>Illustrative values:</b> the ID 8887 is GPT-2’s real ID for “·tea”. The bar heights are invented for display; real embedding values are learned during training.</p>,
});

export const tokenizationScenes = [journey, pipeline, rare, bpe, embed];
