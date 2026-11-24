import { motion } from 'motion/react';
import type { Spread } from '../../book/types';
import { Analogy, Callout, Code, Kicker, LabLauncher, Narration, Output, Quiz, Refs } from '../../book/ui';
import TokenizerLab, { CompareTokenizers, TokenPreview } from './TokenizerLab';
import { BpeTrainer, ThreeApproaches } from './BpeTrainer';

const CH = 'tokenization';

/** Decorative-but-explanatory: the message leaves the chat box and hits a wall labelled "numbers only". */
function MessageJourney() {
  const steps = ['You type', 'Enter ↵', 'Tokenizer', 'Token IDs', 'Model'];
  return (
    <svg className="journey" viewBox="0 0 520 150" role="img" aria-label="Your message goes from the chat box through a tokenizer, becomes token IDs, and only then enters the model">
      {steps.map((s, i) => (
        <g key={s} transform={`translate(${10 + i * 104},48)`}>
          <motion.rect width="92" height="44" rx="8" className={i === 2 ? 'j-box hot' : 'j-box'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.35 }} />
          <text x="46" y="27" textAnchor="middle">{s}</text>
          {i < steps.length - 1 && <motion.path d="M94 22 H102" className="j-arrow" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.35 + 0.2 }} />}
        </g>
      ))}
      <motion.circle r="6" className="j-dot" initial={{ cx: 20, cy: 70 }} animate={{ cx: [20, 470], cy: 70 }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }} />
      <text x="260" y="130" textAnchor="middle" className="j-cap">The model never sees letters. It only ever sees numbers.</text>
    </svg>
  );
}

/** Text → token IDs → embedding vectors. Vector values are ILLUSTRATIVE (labelled). */
function IdsVsEmbeddings() {
  const rows = [
    { tok: 'How', id: 2437, v: [0.12, -0.48, 0.33, 0.05] },
    { tok: '·tea', id: 8887, v: [-0.27, 0.61, 0.09, -0.14] },
    { tok: '?', id: 30, v: [0.02, 0.17, -0.55, 0.40] },
  ];
  return (
    <div className="ids-emb">
      <div className="ie-col"><h4>Token</h4>{rows.map((r) => <span key={r.id} className="tok sm c2"><span className="tok-text">{r.tok}</span></span>)}</div>
      <div className="ie-arrow">→</div>
      <div className="ie-col"><h4>Token ID <small>(an integer, an address)</small></h4>{rows.map((r) => <code key={r.id} className="ie-id">{r.id}</code>)}</div>
      <div className="ie-arrow">→ row of the<br />embedding matrix →</div>
      <div className="ie-col"><h4>Embedding <small>(a vector of learned numbers)</small></h4>
        {rows.map((r) => <code key={r.id} className="ie-vec">[{r.v.map((x) => x.toFixed(2)).join(', ')}, … ]</code>)}
      </div>
      <p className="sim-banner"><span className="tag sim">Illustrative values</span> The token IDs are real GPT-2 IDs. The vector numbers are made up for display; GPT-2 small’s real vectors have 768 numbers each and are learned during training. You will compute real ones in the next chapter.</p>
    </div>
  );
}

export const tokenization: Spread[] = [
  {
    id: 'tok-imagine', chapter: CH, stage: 'imagine', title: 'Tokenization: what happens after you press Enter?',
    left: (
      <>
        <Kicker>Part 2 · How LLMs are created</Kicker>
        <h1>What happens after you press Enter?</h1>
        <Narration>
          <p>Imagine you open a chat assistant and type:</p>
          <blockquote className="typed">How do we make tea?</blockquote>
          <p>You press Enter.</p>
          <p>But wait. Does the model read your sentence the way you do? Does your text travel straight into a neural network, letter by letter?</p>
          <p>It can’t. A neural network is, at heart, a very large mathematical expression. It multiplies and adds <b>numbers</b>. “tea” is not a number.</p>
          <p>So before anything else happens, something has to turn your sentence into numbers. Let’s follow your message and see how.</p>
        </Narration>
      </>
    ),
    right: (
      <>
        <h2>The journey of a message</h2>
        <MessageJourney />
        <Callout kind="key" title="The question of this chapter">How does text become the list of numbers a model can read, and why does the way we cut it matter so much?</Callout>
      </>
    ),
  },
  {
    id: 'tok-discover', chapter: CH, stage: 'visualize', title: 'Meet the tokenizer',
    left: (
      <>
        <Kicker>Discover</Kicker>
        <h1>Meet the tokenizer.</h1>
        <Narration>
          <p>The first stop is a program called a <b>tokenizer</b>. It cuts your text into pieces called <b>tokens</b>, and replaces each piece with its number in a fixed list, the <b>vocabulary</b>.</p>
          <p>Here is the real result for your sentence, from the tokenizer GPT-2 used. Each coloured box is one token; the small number is its <b>token ID</b>.</p>
        </Narration>
        <TokenPreview text="How do we make tea?" />
        <Callout title="Look closely">Six tokens, not five words. The question mark is its own token. And “·do” has the space <em>attached in front</em> (· shows the space). Tokens are not words.</Callout>
      </>
    ),
    right: (
      <>
        <h2>Follow it step by step</h2>
        <p>The lab replays the whole trip in six stages: text, bytes, pre-tokenization, BPE tokens, vocabulary lookup, IDs. Pause on any step, change the sentence, switch between three real vocabularies.</p>
        <LabLauncher title="Tokenizer Lab" blurb="A real byte-level BPE tokenizer, running in your browser. No API, no server." preview={<TokenPreview text="Let’s follow your message." />}>
          <TokenizerLab />
        </LabLauncher>
        <Analogy>A tokenizer is like a postal sorting office. Your letter (the text) is cut into standard parcels (tokens), and each parcel gets a shelf number (token ID). The model only ever sees shelf numbers.</Analogy>
      </>
    ),
  },
  {
    id: 'tok-interact', chapter: CH, stage: 'interact', title: 'Common words, rare words, names',
    left: (
      <>
        <Kicker>Interact</Kicker>
        <h1>Why does my name break into pieces?</h1>
        <Narration>
          <p>Type <code>Ubaid</code> into a GPT-2 tokenizer and you get two tokens: <code>·Ub</code> and <code>aid</code>. The vocabulary has no single entry for the name, so the tokenizer builds it from pieces it does have.</p>
          <p>Common words like “the” or “make” got their own token during training because they appear millions of times. Rare words, names, typos and long technical words are split into smaller pieces.</p>
          <p>Try it in the comparison panel. Type a long word, your own name, a misspelling, some Python code, or a sentence in another language, and compare three real vocabularies.</p>
        </Narration>
        <Callout kind="warn" title="Why this matters in practice">You pay per token, context windows are measured in tokens, and a model “sees” a rare word as fragments. A rough rule for English with GPT-4-era tokenizers: about 4 characters per token. Other languages often need many more tokens for the same meaning.</Callout>
      </>
    ),
    right: (
      <>
        <h2>Same text, three vocabularies</h2>
        <CompareTokenizers text="Ubaid asked: how do we make chai? 🫖" />
      </>
    ),
  },
  {
    id: 'tok-approaches', chapter: CH, stage: 'behind', title: 'Characters, words or subwords?',
    left: (
      <>
        <Kicker>Behind the scenes</Kicker>
        <h1>Where should we cut?</h1>
        <Narration>
          <p>There are three natural ideas.</p>
          <p><b>Characters.</b> Tiny vocabulary, never an unknown symbol. But sequences become very long, and each step carries little meaning. Attention cost grows with sequence length, so long sequences are expensive.</p>
          <p><b>Words.</b> Short sequences, each token meaningful. But the vocabulary explodes (every name, typo, plural, new word), and anything outside it becomes <code>&lt;unk&gt;</code>: information lost.</p>
          <p><b>Subwords.</b> The compromise modern LLMs use: frequent words stay whole, rare words split into reusable pieces, and nothing is ever unknown.</p>
        </Narration>
      </>
    ),
    right: (
      <>
        <h2>See the trade-off</h2>
        <ThreeApproaches />
        <p className="muted">Compare with the subword results on the previous page: fewer tokens than characters, and no <code>&lt;unk&gt;</code>.</p>
      </>
    ),
  },
  {
    id: 'tok-bpe', chapter: CH, stage: 'behind', title: 'How BPE learns its vocabulary',
    left: (
      <>
        <Kicker>Behind the scenes</Kicker>
        <h1>How does the tokenizer learn its pieces?</h1>
        <Narration>
          <p><b>Byte Pair Encoding (BPE)</b> learns its vocabulary from data, before the model is trained:</p>
          <ol>
            <li>Start with the smallest units (bytes, or characters).</li>
            <li>Count every adjacent pair in the training text.</li>
            <li>Merge the most frequent pair into a new token. Record the merge.</li>
            <li>Repeat until the vocabulary reaches its target size (50,257 for GPT-2).</li>
          </ol>
          <p>To encode new text later, the tokenizer replays the learned merges in order. Watch it in the lab.</p>
        </Narration>
        <Callout title="The family of subword methods">
          <p><b>Byte-level BPE</b> (GPT-2, GPT-4, Llama 3): BPE on UTF-8 bytes, so any text is representable.</p>
          <p><b>WordPiece</b> (BERT): merges the pair that most increases training-data likelihood, marks continuations with <code>##</code>.</p>
          <p><b>Unigram</b> (T5, via SentencePiece): starts from a large vocabulary and prunes pieces, choosing the most probable split.</p>
          <p><b>SentencePiece</b> is a library, not an algorithm: it runs BPE or Unigram on raw text, treating spaces as <code>▁</code>.</p>
        </Callout>
      </>
    ),
    right: (
      <>
        <h2>Train a tiny BPE yourself</h2>
        <LabLauncher title="BPE Training Lab" blurb="Merge pairs one at a time and watch the vocabulary grow, then encode a word the tokenizer has never seen.">
          <BpeTrainer />
        </LabLauncher>
        <Analogy>Like inventing shorthand. If you write “th” a thousand times a day, you invent one symbol for it. Then “the” becomes common enough to get its own symbol too.</Analogy>
      </>
    ),
  },
  {
    id: 'tok-misconceptions', chapter: CH, stage: 'behind', title: 'Token, ID, embedding: three different things',
    left: (
      <>
        <Kicker>Common misconceptions</Kicker>
        <h1>Three things people mix up.</h1>
        <Narration>
          <p><b>A token is not necessarily a word.</b> It may be a whole word, part of a word, a space plus a word, punctuation, or even part of an emoji’s bytes.</p>
          <p><b>A token ID is not an embedding.</b> The ID is just a row number. 8887 is not “bigger” or “more tea-like” than 30. The numbers carry no meaning by themselves.</p>
          <p><b>An embedding is a vector.</b> The model looks up row 8887 of its <em>embedding matrix</em> and gets a list of hundreds of learned numbers. Meaning lives there, not in the ID.</p>
        </Narration>
        <Callout kind="key" title="Coming next">From token IDs to vectors: the embedding matrix, and how the model also learns where each token sits in the sentence.</Callout>
      </>
    ),
    right: (
      <>
        <h2>Text → IDs → vectors</h2>
        <IdsVsEmbeddings />
      </>
    ),
  },
  {
    id: 'tok-python', chapter: CH, stage: 'python', title: 'Tokenization in Python',
    left: (
      <>
        <Kicker>Implement with Python</Kicker>
        <h1>The same thing, in code.</h1>
        <Narration>
          <p>We use Hugging Face <code>transformers</code>. <code>AutoTokenizer</code> downloads the exact tokenizer files a model was trained with, so the IDs match what the model expects.</p>
          <p><code>tokenize()</code> shows the token strings (stage 4 of the lab). <code>encode()</code> does the vocabulary lookup and returns IDs (stages 5–6). <code>decode()</code> goes back to text.</p>
          <p>GPT-2 writes a leading space as <code>Ġ</code> in its token strings; the lab shows it as <code>·</code>. Same byte, different display.</p>
        </Narration>
        <Code title="pip install transformers tiktoken" lang="shell" code="pip install transformers tiktoken" />
      </>
    ),
    right: (
      <>
        <Code title="tokenize_tea.py" code={`from transformers import AutoTokenizer

# Load GPT-2's real tokenizer (vocabulary + merge rules)
tokenizer = AutoTokenizer.from_pretrained("gpt2")

text = "How do we make tea?"
tokens = tokenizer.tokenize(text)   # text -> token strings
ids = tokenizer.encode(text)        # token strings -> token IDs

print("Tokens:", tokens)
print("IDs:   ", ids)
print("Back to text:", tokenizer.decode(ids))
print("Ubaid ->", tokenizer.tokenize(" Ubaid"))
print("Vocabulary size:", tokenizer.vocab_size)

# Other algorithms, same sentence
bert = AutoTokenizer.from_pretrained("bert-base-uncased")   # WordPiece
t5 = AutoTokenizer.from_pretrained("t5-small")              # Unigram
print("WordPiece:", bert.tokenize("How do we make tea? Tokenization"))
print("Unigram:  ", t5.tokenize("How do we make tea? Tokenization"))

# OpenAI's tiktoken: the GPT-4o vocabulary
import tiktoken
enc = tiktoken.get_encoding("o200k_base")
print("o200k IDs:", enc.encode(text))`} />
      </>
    ),
  },
  {
    id: 'tok-python-out', chapter: CH, stage: 'python', title: 'Tokenization in Python: the output',
    left: (
      <>
        <Kicker>Implement with Python</Kicker>
        <h1>What it prints.</h1>
        <Output note="real output, run with transformers + tiktoken">{`Tokens: ['How', 'Ġdo', 'Ġwe', 'Ġmake', 'Ġtea', '?']
IDs:    [2437, 466, 356, 787, 8887, 30]
Back to text: How do we make tea?
Ubaid -> ['ĠUb', 'aid']
Vocabulary size: 50257
WordPiece: ['how', 'do', 'we', 'make', 'tea', '?', 'token', '##ization']
Unigram:   ['▁How', '▁do', '▁we', '▁make', '▁tea', '?', '▁To', 'ken', 'ization']
o200k IDs: [5299, 621, 581, 1520, 17966, 30]`}</Output>
              </>
    ),
    right: (
      <>
        <Narration>
          <p className="muted">Open the Tokenizer Lab with GPT-2 selected: the IDs in stage 6 are the same numbers. <code>bert.encode()</code> would also add special tokens <code>[CLS]</code>=101 and <code>[SEP]</code>=102 around the sentence.</p>
        </Narration>
      </>
    ),
  },
  {
    id: 'tok-when', chapter: CH, stage: 'when', title: 'Which tokenizer, when?',
    left: (
      <>
        <Kicker>When should we use it?</Kicker>
        <h1>Choosing, and the rule you can’t break.</h1>
        <Narration>
          <p>As an AI engineer using a model, you almost never choose a tokenizer. <b>You must use the exact tokenizer the model was trained with.</b> A different vocabulary produces different IDs, and the model would read nonsense.</p>
          <p>You choose a tokenizer when you <em>build</em> a model (the builder side), and even then most teams reuse a proven design.</p>
          <p>On the user side, tokenization still shapes your work every day: cost, context limits, latency, and odd failures such as miscounting letters in a word the model only sees as two tokens.</p>
        </Narration>
      </>
    ),
    right: (
      <table className="cmp-table">
        <thead><tr><th>Approach</th><th>Solves</th><th>Weak at</th><th>Seen in</th></tr></thead>
        <tbody>
          <tr><td>Character</td><td>No unknowns, tiny vocab</td><td>Very long sequences</td><td>Some early/char-level models, research</td></tr>
          <tr><td>Word</td><td>Short sequences</td><td>Huge vocab, <code>&lt;unk&gt;</code></td><td>Classic NLP (word2vec era)</td></tr>
          <tr><td>BPE (byte-level)</td><td>Any text, any language, compact</td><td>Splits depend on training data; non-English often costs more tokens</td><td>GPT-2/3/4, Llama 3</td></tr>
          <tr><td>WordPiece</td><td>Good subwords for encoders</td><td>Needs <code>[UNK]</code> for unseen characters</td><td>BERT family</td></tr>
          <tr><td>Unigram (SentencePiece)</td><td>Language-agnostic, no pre-split needed</td><td>Probabilistic splits are harder to reason about</td><td>T5, ALBERT, many multilingual models</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'tok-test', chapter: CH, stage: 'test', title: 'Test your understanding',
    left: (
      <>
        <Kicker>Test your understanding</Kicker>
        <h1>Check yourself.</h1>
        <Quiz items={[
          { q: 'You switch an app from Model A to Model B but keep Model A’s tokenizer. What happens?', options: ['Nothing, tokenizers are interchangeable', 'Model B receives IDs that point to the wrong vocabulary rows, so its output degrades badly', 'It only affects cost'], answer: 1, why: 'Token ID 8887 means “ tea” only in GPT-2’s vocabulary. In another vocabulary it is a different token, so the model reads the wrong text.' },
          { q: 'Which statement is true?', options: ['Token ID 8887 is close in meaning to token ID 8888', 'A token ID is an address; the meaning is in the embedding vector it points to', 'Embeddings are lists of token IDs'], answer: 1, why: 'IDs are row numbers. Neighbouring IDs are not related in meaning; embedding vectors are where learned meaning lives.' },
        ]} />
      </>
    ),
    right: (
      <Quiz items={[
        { q: 'You are building a multilingual model (English, Urdu, Chinese, code). Which tokenizer design fits best?', options: ['Word-level with a 50k English vocabulary', 'A byte-level (or byte-fallback) subword tokenizer trained on multilingual data with a large vocabulary', 'Character-level only'], answer: 1, why: 'Bytes guarantee any script is representable; training on multilingual data gives each language efficient merges; a larger vocabulary (like o200k) reduces token counts for non-English text.' },
        { q: 'Why does “Ubaid” become two tokens in GPT-2?', options: ['The tokenizer is broken', 'The name was not frequent enough in GPT-2’s tokenizer training data to earn its own merge', 'Names are always split'], answer: 1, why: 'BPE only creates tokens for frequent pairs. A rarer name is built from smaller pieces that were frequent.' },
      ]} />
    ),
  },
  {
    id: 'tok-explore', chapter: CH, stage: 'explore', title: 'Explore further',
    left: (
      <>
        <Kicker>Explore further</Kicker>
        <h1>Go deeper.</h1>
        <Refs items={[
          { kind: 'Paper', label: 'Sennrich et al. (2016), Neural Machine Translation of Rare Words with Subword Units (BPE for NLP)', href: 'https://arxiv.org/abs/1508.07909' },
          { kind: 'Paper', label: 'Radford et al. (2019), Language Models are Unsupervised Multitask Learners (GPT-2, byte-level BPE)', href: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf' },
          { kind: 'Paper', label: 'Kudo (2018), Subword Regularization (Unigram LM tokenizer)', href: 'https://arxiv.org/abs/1804.10959' },
          { kind: 'Paper', label: 'Kudo & Richardson (2018), SentencePiece', href: 'https://arxiv.org/abs/1808.06226' },
          { kind: 'Docs', label: 'Hugging Face LLM Course: Tokenizers chapter (BPE, WordPiece, Unigram)', href: 'https://huggingface.co/learn/llm-course/chapter6/1' },
          { kind: 'Docs', label: 'Hugging Face Transformers: Tokenizer', href: 'https://huggingface.co/docs/transformers/main_classes/tokenizer' },
          { kind: 'Code', label: 'openai/tiktoken', href: 'https://github.com/openai/tiktoken' },
          { kind: 'Code', label: 'js-tiktoken (used by this page’s lab)', href: 'https://github.com/dqbd/tiktoken' },
          { kind: 'Video', label: 'Andrej Karpathy, Let’s build the GPT Tokenizer', href: 'https://www.youtube.com/watch?v=zduSFxRajkE' },
        ]} />
      </>
    ),
    right: (
      <>
        <h2>Where you are now</h2>
        <p>You can follow a sentence from text to bytes, to tokens, to IDs, and you know why modern LLMs use byte-level subwords.</p>
        <p>But a list of integers still has no meaning. In the next chapter the IDs open the <b>embedding matrix</b>, and numbers start to carry meaning.</p>
        <Callout kind="key" title="Next chapter">From token IDs to vectors (in progress).</Callout>
      </>
    ),
  },
];
