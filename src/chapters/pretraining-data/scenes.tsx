import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { CodeBoard, lineAt } from '../../scene/CodeBoard';
import { quizScene } from '../../scene/quizScene';
import { Code } from '../../book/ui';

/* =====================================================================
   PART 2 · Chapter "pretraining-data": Pre-training data.
   Running idea: a giant library — collect the books, throw out junk, hide secrets.
   ===================================================================== */

const CH = 'pretraining-data';

/* ============ 1. Collection ============ */

const SOURCES = [
  { l: '🌐 web pages', s: 'billions of pages', x: 30, y: 70 },
  { l: '📖 books', s: 'stories, science', x: 310, y: 70 },
  { l: '💻 code', s: 'public repositories', x: 30, y: 170 },
  { l: '🧠 Wikipedia & papers', s: 'facts, research', x: 310, y: 170 },
];

function CollectDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="slabel">Where does the text come from?</text>
      {SOURCES.map((s, i) => (
        <motion.g key={s.l} initial={false} animate={{ opacity: step >= 1 ? 1 : 0.15 }}>
          <Box x={s.x} y={s.y} w={260} h={80} label={s.l} sub={s.s} tone={i === 0 ? 'night' : 'paper'} hot={step === 1 && i === 0} />
        </motion.g>
      ))}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <text x="300" y="300" textAnchor="middle" className="big-rule">≈ 15 trillion tokens</text>
          <text x="300" y="332" textAnchor="middle" className="cap">a person reading all day would need ~100,000 years</text>
        </motion.g>
      )}
      {step >= 3 && <text x="300" y="380" textAnchor="middle" className="warn">Problem: most raw web text is junk. 🗑️</text>}
    </g>
  );
}

const collectScene = scene({
  id: 'pd-collect', chapter: CH, stage: 'imagine', kicker: 'Part 2 · Pre-training data', title: 'Collect a giant library.',
  cues: [
    { say: 'Our model learns from what it reads. So first we build a giant library.', point: [300, 46], bubble: 'the library 📚' },
    { say: 'Web pages are the biggest part, collected by crawlers that visit billions of pages. Then books, code, Wikipedia and research papers.', point: [160, 110], bubble: 'crawl the web 🕷️' },
    { say: 'How much? Modern models read about fifteen trillion tokens. A person reading all day long would need around a hundred thousand years.', point: [300, 296], bubble: 'that’s a LOT' },
    { say: 'But there’s a catch. Raw web text is mostly junk: ads, menus, spam, copies. Garbage in, garbage out. So we clean.', point: [300, 374], bubble: 'garbage in, garbage out' },
  ],
  draw: (step) => <CollectDiagram step={step} />,
  details: <p>A famous free source is <b>Common Crawl</b>, a monthly snapshot of billions of web pages. Cleaned versions of it, like <b>FineWeb</b> and <b>C4</b>, are used by many open models. A token is roughly ¾ of an English word (more in the next chapter!).</p>,
});

/* ============ 2. Cleaning: junk, duplicates, privacy ============ */

const STEPS = [
  { l: '🧹 strip HTML', s: 'remove menus, ads', tone: 'paper' as const },
  { l: '👯 remove copies', s: 'deduplication', tone: 'paper' as const },
  { l: '⭐ quality filter', s: 'drop spam, gibberish', tone: 'paper' as const },
  { l: '🔒 hide private info', s: 'emails, phones → [PII]', tone: 'teal' as const },
];

function CleanDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="slabel">The cleaning line 🏭</text>
      {STEPS.map((s, i) => step >= i + 1 && (
        <motion.g key={s.l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Box x={30} y={62 + i * 76} w={300} h={62} label={s.l} sub={s.s} tone={s.tone} hot={step === i + 1} />
          {i < 3 && <Flow d={`M180 ${126 + i * 76} L180 ${136 + i * 76}`} />}
        </motion.g>
      ))}
      {step === 1 && <text x="460" y="100" textAnchor="middle" className="tcell-t">&lt;div&gt;Menu | Login&lt;/div&gt; ❌</text>}
      {step === 2 && <text x="460" y="176" textAnchor="middle" className="tcell-t">same page × 1,000 → keep 1</text>}
      {step === 3 && <text x="460" y="252" textAnchor="middle" className="tcell-t">“BUY!!! CHEAP!!!” ❌</text>}
      {step >= 4 && <text x="460" y="328" textAnchor="middle" className="tcell-t">bob@mail.com → [EMAIL]</text>}
      {step >= 5 && <text x="300" y="400" textAnchor="middle" className="big-rule">Less, but better data = a smarter model.</text>}
    </g>
  );
}

const cleanScene = scene({
  id: 'pd-clean', chapter: CH, stage: 'visualize', kicker: 'Cleaning, dedup, filtering, PII', title: 'Clean it: the four-step line.',
  cues: [
    { say: 'The raw text goes down a cleaning line, like a factory. Four stations.', point: [300, 46], bubble: 'factory time 🏭' },
    { say: 'Station one: strip the web code. Menus, buttons, ads, login boxes. Keep only the real text.', point: [460, 96], bubble: 'just the words' },
    { say: 'Station two: remove copies. The same page can appear a thousand times. If the model reads it a thousand times, it memorises it. Remember overfitting? Keep one.', point: [460, 172], bubble: 'deduplication 👯' },
    { say: 'Station three: a quality filter. Spam, gibberish and very low quality pages get thrown out. Often a small model does the judging!', point: [460, 248], bubble: 'quality check ⭐' },
    { say: 'Station four, very important: privacy. Emails, phone numbers, addresses, personal stuff. We find it and hide it. That’s called P I I removal: personally identifiable information.', point: [460, 324], bubble: 'privacy 🔒' },
    { say: 'At the end, often more than half the text is gone. And that’s good: less, but better data makes a smarter model.', point: [300, 394], bubble: 'quality > quantity' },
  ],
  draw: (step) => <CleanDiagram step={step} />,
  details: <p>Teams also filter <b>toxic or harmful</b> content, check <b>languages</b>, and remove copies of <b>benchmark test questions</b> so the model can’t cheat on its exams later. Exact copies are found with hashes; near-copies with a trick called <b>MinHash</b>.</p>,
});

/* ============ 3. Python, with John at the board ============ */

const CODE = [
  'import re',
  'docs = ["Buy pills!!! Cheap!!!",',
  '        "The sun is a star.",',
  '        "The sun is a star.",',
  '        "Notes from bob@mail.com or 555-123-4567."]',
  'clean = []',
  'for d in docs:',
  '    if d in clean: continue            # duplicate: skip',
  '    if "!!!" in d: continue            # junk: skip',
  '    d = re.sub(r"\\S+@\\S+", "[EMAIL]", d)  # hide emails',
  '    d = re.sub(r"\\d{3}-\\d{3}-\\d{4}", "[PHONE]", d)',
  '    clean.append(d)',
  'print(len(docs), "in ->", len(clean), "out:")',
  'for d in clean: print(" ", d)',
];

const codeScene = scene({
  id: 'pd-python', chapter: CH, stage: 'python', kicker: 'Implement with Python', title: 'A tiny cleaning line, in fourteen lines.',
  cues: [
    { say: 'Code time! Our tiny web: four documents. One is spam, two are copies, one has private info.', point: lineAt(2), bubble: 'a tiny internet', step: -1 },
    { say: 'Station: copies. If we already kept it, skip. Station: junk. Too many exclamation marks? Skip.', point: lineAt(8), bubble: 'dedup + filter', step: 0 },
    { say: 'These are regular expressions: little search patterns. One finds emails, one finds phone numbers, and both get hidden.', point: lineAt(10), bubble: 'privacy 🔒', step: 1 },
    { say: 'Real output: four in, two out. The spam and the copy are gone, and Bob’s email and phone are safe. Real pipelines do this for trillions of tokens!', point: [300, 370], bubble: 'it works ✓', step: 2 },
  ],
  draw: (step) => {
    const hot = [[], [1, 2, 3, 4], [7, 8], [9, 10], []][step + 1];
    return <CodeBoard title="clean.py" lines={CODE} hot={hot} output={step >= 2 ? ['4 in -> 2 out:', '  The sun is a star.', '  Notes from [EMAIL] or [PHONE].'] : undefined} outNote="real output, Python 3" />;
  },
  details: <><Code title="clean.py" code={CODE.join('\n')} /><p className="muted">Real pipelines use tools like datatrove (FineWeb) or Microsoft Presidio for PII.</p></>,
});

/* ============ 4. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'pd-test', chapter: CH, title: 'Quick check: pre-training data.',
  outro: 'Perfect! Our library is clean. Now the model has to read it. Turn the page!',
  items: [
    { ask: 'Quiz time! Where does most pre-training text come from?', q: 'Most pre-training text comes from…', options: ['The web', 'Phone calls', 'Handwritten letters'], answer: 0,
      explain: 'Web pages, collected by crawlers. Plus books, code and papers.' },
    { ask: 'Question two. Why remove duplicate pages?', q: 'Why remove duplicate pages?', options: ['To make the files prettier', 'So the model doesn’t memorise repeated text', 'Duplicates are illegal'], answer: 1,
      explain: 'Reading the same text a thousand times leads to memorising. Remember overfitting!' },
    { ask: 'Last one. What does P I I removal protect?', q: 'PII removal protects…', options: ['The GPUs', 'People’s private info like emails and phone numbers', 'The model’s weights'], answer: 1,
      explain: 'Personally identifiable information. The model should never learn your phone number.' },
  ],
});

/* ============ 5. What's next ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['Plan: domain, size, data, budget', 'Pre-training: guess the next word', 'Collect: web, books, code', 'Clean: strip, dedup, filter', 'Privacy: hide PII'];
  return (
    <g>
      <text x="40" y="44" className="slabel">✓ So far in Part 2</text>
      {done.map((d, i) => (
        <motion.text key={d} x="52" y={80 + i * 30} className="ok" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>✓ {d}</motion.text>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M300 270 L350 270" />
          <Box x={355} y={225} w={220} h={90} label="Next: Tokenization" sub="text → numbers" tone="night" hot />
          <text x="465" y="342" textAnchor="middle" className="cap">next page →</text>
        </motion.g>
      )}
    </g>
  );
}

const nextScene = scene({
  id: 'pd-next', chapter: CH, kicker: 'What’s next?', title: 'What’s next?',
  cues: [
    { say: 'We have a plan and a clean library of text. Great work!', point: [150, 140], bubble: 'data ✓' },
    { say: 'But wait. A neural network only understands numbers, remember? So how does text become numbers? That’s tokenization, and it’s the next page. Turn the page, bro!', point: [465, 270], bubble: 'next page →' },
  ],
  draw: (step) => <NextDiagram step={step} />,
});

export const pretrainingDataScenes = [collectScene, cleanScene, codeScene, quiz, nextScene];
