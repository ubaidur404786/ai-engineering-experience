/**
 * Tokenizers used by the Tokenization chapter.
 *
 * REAL tokenizers: GPT-2 (r50k-style, 50,257 tokens), cl100k_base (GPT-3.5/4), o200k_base (GPT-4o family).
 * They run the actual byte-level BPE with the published merge ranks, via js-tiktoken, entirely in the browser.
 * The IDs they produce are the same IDs the Python `tiktoken` library produces (checked: "How do we make tea?"
 * → [2437, 466, 356, 787, 8887, 30] with gpt2 in both).
 * Rank files are 1–4 MB each, so each one is lazy-loaded only when the reader selects it.
 *
 * SIMULATIONS: character-level, word-level and the tiny BPE trainer below are teaching tools, labelled as such in the UI.
 */
import type { Tiktoken } from 'js-tiktoken/lite';

export type RealName = 'gpt2' | 'cl100k_base' | 'o200k_base';
export const REAL_INFO: Record<RealName, { label: string; vocab: string; usedBy: string }> = {
  gpt2: { label: 'GPT-2', vocab: '50,257', usedBy: 'GPT-2 (2019)' },
  cl100k_base: { label: 'cl100k_base', vocab: '≈100k', usedBy: 'GPT-3.5 / GPT-4' },
  o200k_base: { label: 'o200k_base', vocab: '≈200k', usedBy: 'GPT-4o family' },
};

const cache = new Map<RealName, Promise<Tiktoken>>();
export function loadReal(name: RealName): Promise<Tiktoken> {
  if (!cache.has(name)) {
    cache.set(name, (async () => {
      const { Tiktoken } = await import('js-tiktoken/lite');
      const ranks =
        name === 'gpt2' ? (await import('js-tiktoken/ranks/gpt2')).default
        : name === 'cl100k_base' ? (await import('js-tiktoken/ranks/cl100k_base')).default
        : (await import('js-tiktoken/ranks/o200k_base')).default;
      return new Tiktoken(ranks);
    })());
  }
  return cache.get(name)!;
}

export interface Tok { text: string; id: number; bytes: number[] }

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8', { fatal: false });

/** Encode and recover each token's own bytes (a token can be part of a multi-byte character, e.g. half an emoji). */
export function encodeReal(t: Tiktoken, text: string): Tok[] {
  const ids = t.encode(text);
  // textMap (id → the token's exact bytes) is an internal field of js-tiktoken; fall back to decode() if it changes.
  const textMap = (t as unknown as { textMap?: Map<number, Uint8Array> }).textMap;
  return ids.map((id) => {
    const raw = textMap?.get(id);
    const bytes = raw ? [...raw] : [...enc.encode(t.decode([id]))];
    // A token holding only part of a multi-byte character decodes to U+FFFD; the UI then shows its raw bytes.
    return { id, text: dec.decode(new Uint8Array(bytes)), bytes };
  });
}

/** Display form of a token: make spaces and newlines visible, flag partial characters. */
export function showToken(s: string, bytes?: number[]) {
  if (s.includes('�')) return bytes ? bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ').replace(/^20 /, '· ') + ' (bytes)' : '⟨partial⟩';
  return s.replace(/ /g, '·').replace(/\n/g, '↵').replace(/\t/g, '⇥');
}

export const utf8 = (s: string) => [...enc.encode(s)];
export const utf8decode = (b: number[]) => dec.decode(new Uint8Array(b));

/** GPT-2's real pre-tokenization pattern (from the GPT-2 source). Splits text before BPE runs inside each piece. */
export const GPT2_PATTERN = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
export const preTokenize = (s: string) => s.match(GPT2_PATTERN) ?? [];

/* ---------------- Simulations ---------------- */

/** SIMULATION. A word-level tokenizer with a small fixed vocabulary, to show the out-of-vocabulary problem. */
export const WORD_VOCAB = ['<unk>', 'how', 'do', 'we', 'make', 'tea', 'coffee', 'the', 'a', 'is', 'what', 'i', 'you', 'to', 'of', 'and', 'in', 'it', 'model', 'token', '?', '.', ',', '!'];
export function wordTokenize(s: string): Tok[] {
  const pieces = s.toLowerCase().match(/\p{L}+|\p{N}+|[^\s\p{L}\p{N}]/gu) ?? [];
  return pieces.map((p) => { const id = WORD_VOCAB.indexOf(p); return { text: id < 0 ? `${p} → <unk>` : p, id: id < 0 ? 0 : id, bytes: utf8(p) }; });
}

/** Character level: here the "ID" is the Unicode code point. Real char-level models use their own small vocab. */
export function charTokenize(s: string): Tok[] {
  return [...s].map((c) => ({ text: c, id: c.codePointAt(0)!, bytes: utf8(c) }));
}

/**
 * SIMULATION: a tiny, honest BPE trainer.
 * Same algorithm as real BPE (count adjacent pairs, merge the most frequent, repeat), but on a toy corpus
 * of characters instead of bytes, and without the regex pre-tokenizer details. Ties broken alphabetically.
 */
export interface BpeState { words: { symbols: string[]; count: number }[]; merges: [string, string][]; vocab: string[] }

export function bpeInit(corpus: string): BpeState {
  const counts = new Map<string, number>();
  for (const w of corpus.toLowerCase().match(/\p{L}+/gu) ?? []) counts.set(w, (counts.get(w) ?? 0) + 1);
  const words = [...counts].map(([w, count]) => ({ symbols: [...w, '_'], count })); // "_" marks end of word
  const vocab = [...new Set(words.flatMap((w) => w.symbols))].sort();
  return { words, merges: [], vocab };
}

export function bpePairCounts(s: BpeState) {
  const m = new Map<string, number>();
  for (const w of s.words) for (let i = 0; i < w.symbols.length - 1; i++) {
    const k = w.symbols[i] + '\u0000' + w.symbols[i + 1];
    m.set(k, (m.get(k) ?? 0) + w.count);
  }
  return [...m].map(([k, n]) => ({ pair: k.split('\u0000') as [string, string], n }))
    .sort((a, b) => b.n - a.n || (a.pair.join('') < b.pair.join('') ? -1 : 1));
}

export function bpeStep(s: BpeState): BpeState | null {
  const top = bpePairCounts(s)[0];
  if (!top || top.n < 2) return null;
  const [a, b] = top.pair; const ab = a + b;
  const words = s.words.map((w) => {
    const out: string[] = [];
    for (let i = 0; i < w.symbols.length; i++) {
      if (i < w.symbols.length - 1 && w.symbols[i] === a && w.symbols[i + 1] === b) { out.push(ab); i++; } else out.push(w.symbols[i]);
    }
    return { symbols: out, count: w.count };
  });
  return { words, merges: [...s.merges, [a, b]], vocab: [...s.vocab, ab] };
}

/** Apply learned merges, in order, to a new word (this is how BPE encodes text it has never seen). */
export function bpeApply(merges: [string, string][], word: string): string[] {
  let sym = [...word.toLowerCase(), '_'];
  for (const [a, b] of merges) {
    const out: string[] = [];
    for (let i = 0; i < sym.length; i++) {
      if (i < sym.length - 1 && sym[i] === a && sym[i + 1] === b) { out.push(a + b); i++; } else out.push(sym[i]);
    }
    sym = out;
  }
  return sym;
}
