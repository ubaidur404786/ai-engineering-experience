import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { CodeBoard, lineAt } from '../../scene/CodeBoard';
import { quizScene } from '../../scene/quizScene';
import { Code } from '../../book/ui';

/* =====================================================================
   PART 1 · Chapter "fit": Is the model any good?
   Running idea: the student before an exam — memorise vs understand.
   ===================================================================== */

const CH = 'fit';

/* ============ 1. Underfit, good fit, overfit ============ */

const DOTS = [[30, 120], [55, 95], [80, 100], [105, 70], [130, 78], [150, 45]];

function Panel({ x, title, sub, d, hot, tone }: { x: number; title: string; sub: string; d: string; hot: boolean; tone: string }) {
  return (
    <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={x} y={60} width={170} height={220} rx="10" className={`sbox paper ${hot ? 'hot' : ''}`} />
      <text x={x + 85} y={86} textAnchor="middle" className="slabel paper">{title}</text>
      {DOTS.map(([dx, dy]) => <circle key={dx} cx={x + dx} cy={110 + dy} r={4} fill="currentColor" opacity={0.6} />)}
      <path d={d} transform={`translate(${x} 110)`} fill="none" stroke="#2f7f88" strokeWidth={3} />
      <text x={x + 85} y={262} textAnchor="middle" className={tone}>{sub}</text>
    </motion.g>
  );
}

function FitDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="36" textAnchor="middle" className="slabel">Three students, one exam 📝</text>
      {step >= 1 && <Panel x={25} title="😴 Underfit" sub="too simple" tone="warn" hot={step === 1} d="M20 95 L160 95" />}
      {step >= 2 && <Panel x={405} title="🤓 Overfit" sub="memorised the noise" tone="warn" hot={step === 2} d="M30 120 L55 95 L80 100 L105 70 L130 78 L150 45" />}
      {step >= 3 && <Panel x={215} title="😎 Good fit" sub="got the pattern" tone="ok" hot={step === 3} d="M20 130 L160 40" />}
      {step >= 4 && <text x="300" y="330" textAnchor="middle" className="big-rule">Learn the pattern, not the answers.</text>}
      {step >= 4 && <text x="300" y="362" textAnchor="middle" className="cap">the real test: questions it has never seen</text>}
    </g>
  );
}

const fitScene = scene({
  id: 'fit-memorise', chapter: CH, stage: 'imagine', kicker: 'Part 1 · Is the model any good?', title: 'Did it learn, or memorise?',
  cues: [
    { say: 'Three students, same exam. The dots are practice questions. Each student draws a line through them: their idea of the rule.', point: [300, 44], bubble: 'exam time 📝' },
    { say: 'Student one barely studied. A flat line. Too simple, misses the pattern. That’s underfitting.', point: [110, 262], bubble: 'underfit 😴' },
    { say: 'Student two memorised every practice question. Zigzag, mistakes and all. Perfect on practice, lost on anything new. That’s overfitting.', point: [490, 262], bubble: 'overfit 🤓' },
    { say: 'Student three got the trend. Not perfect on every dot, but ready for new questions. A good fit.', point: [300, 262], bubble: 'just right 😎' },
    { say: 'So a good model learns the pattern, not the answers. And the only fair test is questions it’s never seen.', point: [300, 336], bubble: 'the golden rule' },
  ],
  draw: (step) => <FitDiagram step={step} />,
  details: <p>Overfitting often happens when the model is very big and the data is small. Fixes: <b>more data</b>, a <b>simpler model</b>, <b>regularisation</b> (punish huge weights), <b>dropout</b> (switch off random neurons while training), and <b>early stopping</b> (next page).</p>,
});

/* ============ 2. Train vs validation loss ============ */

function CurvesDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="36" textAnchor="middle" className="slabel">Watch two losses while training</text>
      <line x1="70" y1="300" x2="540" y2="300" stroke="currentColor" opacity="0.4" />
      <line x1="70" y1="60" x2="70" y2="300" stroke="currentColor" opacity="0.4" />
      <text x="540" y="324" textAnchor="end" className="lab-t">training time →</text>
      <text x="80" y="62" className="lab-t">loss</text>
      {step >= 1 && <motion.path d="M80 90 C180 230 330 270 530 285" fill="none" stroke="#2f7f88" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />}
      {step >= 1 && <text x="530" y="276" textAnchor="end" className="lab-t">practice (train)</text>}
      {step >= 2 && <motion.path d="M80 100 C170 230 260 220 300 215 C380 205 450 150 530 110" fill="none" stroke="#b5533c" strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />}
      {step >= 2 && <text x="530" y="100" textAnchor="end" className="warn">new questions (validation)</text>}
      {step >= 3 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}><line x1="300" y1="70" x2="300" y2="300" stroke="#c4974a" strokeWidth={2} strokeDasharray="6 5" /><text x="300" y="356" textAnchor="middle" className="ok">⏹ stop here: early stopping</text></motion.g>}
      {step >= 4 && <text x="430" y="200" textAnchor="middle" className="cap">memorising zone</text>}
    </g>
  );
}

const curvesScene = scene({
  id: 'fit-curves', chapter: CH, stage: 'visualize', kicker: 'Spot overfitting', title: 'Two losses tell the truth.',
  cues: [
    { say: 'Remember splitting data into train, validation and test? Here’s why we bothered.', point: [300, 44], bubble: 'the split pays off' },
    { say: 'The training loss, on practice data, keeps dropping. Looks amazing!', point: [400, 270], bubble: 'practice: better and better' },
    { say: 'But the validation loss, on questions it never trained on, drops, then turns around and climbs. The model has started memorising.', point: [460, 130], bubble: 'uh-oh 📈' },
    { say: 'The sweet spot is right here, where validation was lowest. Stop training there. That’s called early stopping.', point: [300, 350], bubble: 'stop! ✋' },
    { say: 'After that, more training just makes a better memoriser. Not a smarter model.', point: [430, 196], bubble: 'memorising zone' },
  ],
  draw: (step) => <CurvesDiagram step={step} />,
  details: <p>The <b>validation set</b> is used while you build and tune the model. The <b>test set</b> stays locked away until the very end, for one honest final score. If you peek at the test set while tuning, the score is no longer honest.</p>,
});

/* ============ 3. Metrics: accuracy, precision, recall ============ */

function MetricsDiagram({ step }: { step: number }) {
  const rows = [
    { t: '✅ spam, caught', n: 3, c: 'ok' },
    { t: '😬 good email flagged as spam', n: 1, c: 'warn' },
    { t: '🕳️ spam that slipped through', n: 1, c: 'warn' },
    { t: '✅ good email, left alone', n: 5, c: 'ok' },
  ];
  return (
    <g>
      <text x="300" y="36" textAnchor="middle" className="slabel">A spam filter checks 10 emails 📧</text>
      {rows.map((r, i) => (
        <motion.g key={r.t} initial={false} animate={{ opacity: step >= 1 ? 1 : 0.15 }}>
          <rect x={40} y={56 + i * 44} width={520} height={36} rx="8" className={`row-b ${(step === 3 && i === 1) || (step === 4 && i === 2) ? 'hot-row' : ''}`} />
          <text x={58} y={80 + i * 44} className="tcell-t">{r.t}</text>
          <text x={530} y={80 + i * 44} textAnchor="end" className={r.c}>{r.n}</text>
        </motion.g>
      ))}
      {step >= 2 && <motion.text x="300" y="262" textAnchor="middle" className="tcell-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Accuracy: 8 of 10 right = 80%</motion.text>}
      {step >= 3 && <motion.text x="300" y="296" textAnchor="middle" className="tcell-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Precision: of 4 flagged, 3 really spam = 75%</motion.text>}
      {step >= 4 && <motion.text x="300" y="330" textAnchor="middle" className="tcell-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Recall: of 4 real spams, caught 3 = 75%</motion.text>}
      {step >= 5 && <text x="300" y="376" textAnchor="middle" className="big-rule">Pick the score for the mistake you fear.</text>}
    </g>
  );
}

const metricsScene = scene({
  id: 'fit-metrics', chapter: CH, stage: 'discover', kicker: 'Evaluation metrics', title: 'Scores: accuracy, precision, recall.',
  cues: [
    { say: 'Okay, how do we grade a model? Let’s test a spam filter on ten emails it’s never seen.', point: [300, 44], bubble: 'report card 📋' },
    { say: 'Four kinds of results. Spam caught: good. A normal email wrongly flagged: bad. Spam that slipped through: bad. A normal email left alone: good.', point: [300, 140], bubble: '4 outcomes' },
    { say: 'Accuracy: how many were right overall. Eight out of ten. Eighty percent.', point: [300, 256], bubble: 'accuracy' },
    { say: 'Precision: when it yells spam, how often is it right? It flagged four, and three really were. Seventy-five percent. Low precision means your boss’s email ends up in spam. Awkward.', point: [300, 290], bubble: 'precision 🎯' },
    { say: 'Recall: of all the real spam, how much did it catch? Three of four. Low recall means spam floods your inbox.', point: [300, 324], bubble: 'recall 🎣' },
    { say: 'So there’s no single best score. Pick the one for the mistake you fear most. For a cancer test, you want high recall. Never miss a sick patient.', point: [300, 370], bubble: 'it depends 🤷' },
  ],
  draw: (step) => <MetricsDiagram step={step} />,
  details: <p>The four boxes are called the <b>confusion matrix</b>: true positives (3), false positives (1), false negatives (1), true negatives (5). The <b>F1 score</b> combines precision and recall into one number. Accuracy can lie: if only 1 email in 100 is spam, a filter that never flags anything is 99% accurate and completely useless.</p>,
});

/* ============ 4. Python, with John at the board ============ */

const CODE = [
  '# 10 emails: 1 = spam, 0 = good',
  'truth = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0]',
  'guess = [1, 1, 1, 0, 1, 0, 0, 0, 0, 0]',
  'pairs = list(zip(guess, truth))',
  'tp = pairs.count((1, 1))   # spam, caught',
  'fp = pairs.count((1, 0))   # good email, flagged',
  'fn = pairs.count((0, 1))   # spam that slipped by',
  'right = sum(g == t for g, t in pairs)',
  'print("accuracy: ", right / len(pairs))',
  'print("precision:", tp / (tp + fp))',
  'print("recall:   ", tp / (tp + fn))',
];

const codeScene = scene({
  id: 'fit-python', chapter: CH, stage: 'python', kicker: 'Implement with Python', title: 'Grade a model in eleven lines.',
  cues: [
    { say: 'Code time, still here! Same ten emails. Truth is what they really were. Guess is what our filter said.', point: lineAt(2), bubble: 'same emails', step: -1 },
    { say: 'zip pairs each guess with its truth. Then we count the three kinds that matter.', point: lineAt(5), bubble: 'count them', step: 0 },
    { say: 'Then the three formulas, same as my table.', point: lineAt(9), bubble: 'the scores', step: 1 },
    { say: 'Real output: eighty, seventy-five, seventy-five. Same as we got by hand. Change a guess and watch the scores move!', point: [300, 360], bubble: 'it matches ✓', step: 2 },
  ],
  draw: (step) => {
    const hot = [[], [1, 2], [3, 4, 5, 6, 7], [8, 9, 10], []][step + 1];
    return <CodeBoard title="grade.py" lines={CODE} hot={hot} output={step >= 2 ? ['accuracy:  0.8', 'precision: 0.75', 'recall:    0.75'] : undefined} outNote="real output, Python 3" />;
  },
  details: <><Code title="grade.py" code={CODE.join('\n')} /><p className="muted">In real projects: from sklearn.metrics import accuracy_score, precision_score, recall_score.</p></>,
});

/* ============ 5. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'fit-test', chapter: CH, title: 'Quick check: is it any good?',
  outro: 'Wow. That’s Part 1 done! You understand the foundations of every AI model.',
  items: [
    { ask: 'Quiz time! A model is perfect on training data, but bad on new data. What’s that called?', q: 'Perfect on training data, bad on new data:', options: ['Underfitting', 'Overfitting', 'Good fit'], answer: 1,
      explain: 'Overfitting. It memorised the practice questions instead of learning the pattern.' },
    { ask: 'Question two. Validation loss starts climbing while training loss keeps dropping. What do we do?', q: 'Validation loss starts rising. What do we do?', options: ['Train much longer', 'Stop early, at the lowest validation loss', 'Delete the validation set'], answer: 1,
      explain: 'Early stopping. After that point, it only gets better at memorising.' },
    { ask: 'Question three. A cancer test must never miss a sick patient. Which score matters most?', q: 'Never miss a sick patient. Which score matters most?', options: ['Recall', 'Precision', 'Speed'], answer: 0,
      explain: 'Recall. Of all the real cases, how many did we catch?' },
  ],
});

/* ============ 6. Part 1 done ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['Data: the raw material', 'Ways a machine learns', 'Neurons and networks', 'How a network learns', 'Is the model any good?'];
  return (
    <g>
      <text x="40" y="44" className="slabel">🏆 Part 1 complete: Foundations</text>
      {done.map((d, i) => (
        <motion.text key={d} x="52" y={80 + i * 30} className="ok" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>✓ {d}</motion.text>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M300 270 L350 270" />
          <Box x={355} y={225} w={220} h={90} label="Part 2: how LLMs are made" sub="let’s build a ChatGPT" tone="night" hot />
          <text x="465" y="342" textAnchor="middle" className="cap">next page →</text>
        </motion.g>
      )}
    </g>
  );
}

const nextScene = scene({
  id: 'fit-next', chapter: CH, kicker: 'Part 1 complete', title: 'Part 1: done!',
  cues: [
    { say: 'Look how far you’ve come! Data, ways to learn, neurons, learning, and grading a model. That’s the foundation of every AI on the planet.', point: [150, 140], bubble: 'Part 1 ✓ 🏆' },
    { say: 'Now the fun part. Part two: how is a giant model like ChatGPT actually made? We start with the plan.', point: [465, 270], bubble: 'next page →' },
  ],
  draw: (step) => <NextDiagram step={step} />,
});

export const fitScenes = [fitScene, curvesScene, metricsScene, codeScene, quiz, nextScene];
