import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { CodeBoard, lineAt } from '../../scene/CodeBoard';
import { quizScene } from '../../scene/quizScene';
import { Code } from '../../book/ui';

/* =====================================================================
   PART 1 · Chapter "learning": How a network learns.
   Running idea: guess → check how wrong (loss) → nudge weights downhill → repeat.
   ===================================================================== */

const CH = 'learning';

/* ============ 1. Loss: how wrong am I? ============ */

const DAYS = [
  { d: 'Mon', g: 0.9, t: 1 },
  { d: 'Tue', g: 0.8, t: 0 },
  { d: 'Wed', g: 0.3, t: 0 },
];

function LossDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="38" textAnchor="middle" className="slabel">Did I really go to the beach?</text>
      <text x="110" y="74" textAnchor="middle" className="lab-t">day</text>
      <text x="240" y="74" textAnchor="middle" className="lab-t">network guessed</text>
      <text x="380" y="74" textAnchor="middle" className="lab-t">truth</text>
      {step >= 2 && <text x="500" y="74" textAnchor="middle" className="lab-t">error²</text>}
      {DAYS.map((r, i) => {
        const e = (r.g - r.t) ** 2;
        return (
          <g key={r.d}>
            <rect x={40} y={86 + i * 52} width={520} height={42} rx="8" className={`row-b ${step === 2 && i === 1 ? 'hot-row' : ''}`} />
            <text x={110} y={113 + i * 52} textAnchor="middle" className="tcell-t">{r.d}</text>
            <text x={240} y={113 + i * 52} textAnchor="middle" className="tcell-t">{r.g}</text>
            {step >= 1 && <motion.text x={380} y={113 + i * 52} textAnchor="middle" className="tcell-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{r.t ? '1 (went)' : '0 (stayed)'}</motion.text>}
            {step >= 2 && <motion.text x={500} y={113 + i * 52} textAnchor="middle" className={e > 0.3 ? 'warn' : 'ok'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>{e.toFixed(2)}</motion.text>}
          </g>
        );
      })}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <text x="300" y="282" textAnchor="middle" className="big-rule">loss = average error = 0.25</text>
          <text x="300" y="314" textAnchor="middle" className="cap">one number that says: how wrong am I?</text>
        </motion.g>
      )}
      {step >= 4 && <text x="300" y="360" textAnchor="middle" className="ok">Goal of learning: make the loss small.</text>}
    </g>
  );
}

const lossScene = scene({
  id: 'lr-loss', chapter: CH, stage: 'imagine', kicker: 'Part 1 · How a network learns', title: 'Loss: how wrong am I?',
  cues: [
    { say: 'Last chapter I picked the weights myself. Now the network must find them alone. Step one: it guesses. Here are its guesses for three days.', point: [240, 140], bubble: 'just guessing 🤔' },
    { say: 'Then we check the truth. Did I actually go? Monday yes, Tuesday and Wednesday no.', point: [380, 140], bubble: 'the real answer' },
    { say: 'For each day: guess minus truth, then squared, so it’s always positive. Tuesday is the big mistake: it said zero point eight, but I stayed home.', point: [500, 164], bubble: 'Tuesday = oops' },
    { say: 'Average the errors and you get one number: the loss. It means: how wrong am I, right now?', point: [300, 286], bubble: 'loss 📉' },
    { say: 'And here’s the whole goal of learning: make that number small. That’s it.', point: [300, 356], bubble: 'small loss = smart' },
  ],
  draw: (step) => <LossDiagram step={step} />,
  details: <p>This one is called <b>mean squared error</b> (MSE): (0.01 + 0.64 + 0.09) / 3 ≈ 0.25. LLMs use a cousin called <b>cross-entropy</b>: it punishes the model when it gave the right next word a low chance. Different formula, same job: one number for “how wrong”.</p>,
});

/* ============ 2. Gradient descent: walk downhill ============ */

const BALL = [[110, 110], [175, 205], [225, 262], [262, 285], [300, 292]];

function DescentDiagram({ step }: { step: number }) {
  const b = BALL[Math.min(Math.max(step - 1, 0), 4)];
  return (
    <g>
      <text x="300" y="36" textAnchor="middle" className="slabel">The loss is a hill. We want the bottom.</text>
      <path d="M80 80 C160 300 220 300 300 300 C380 300 440 300 520 80" fill="none" stroke="#2f7f88" strokeWidth={3} />
      <text x="70" y="330" className="lab-t">weight →</text>
      <text x="40" y="70" className="lab-t">loss ↑</text>
      {step >= 1 && <motion.circle r={14} fill="#c4974a" initial={false} animate={{ cx: b[0], cy: b[1] - 14 }} transition={{ duration: 0.8 }} />}
      {step === 2 && <text x="200" y="130" className="cap">which way is down? ↘</text>}
      {step === 3 && <text x="330" y="200" className="cap">small steps (learning rate)</text>}
      {step >= 4 && <text x="300" y="350" textAnchor="middle" className="ok">bottom = best weight ✓</text>}
      {step >= 5 && <text x="300" y="390" textAnchor="middle" className="big-rule">Gradient descent = walk downhill.</text>}
    </g>
  );
}

const descentScene = scene({
  id: 'lr-descent', chapter: CH, stage: 'visualize', kicker: 'Gradient descent', title: 'Gradient descent: walk downhill.',
  cues: [
    { say: 'Picture the loss as a hill. Left and right is a weight. Up and down is how wrong we are. We want the bottom of the valley.', point: [300, 300], bubble: 'find the bottom' },
    { say: 'Our network starts somewhere random, high on the hill. Very wrong.', point: [110, 96], bubble: 'random start 🎲' },
    { say: 'Imagine standing on a hill in fog. You can’t see the bottom, but your feet feel which way is down. That feeling is the gradient.', point: [200, 140], bubble: 'gradient = slope' },
    { say: 'So we take a small step downhill. How big a step? That’s the learning rate. Too big and you jump over the valley. Too small and it takes forever.', point: [330, 196], bubble: 'step size 👣' },
    { say: 'Step, check the slope, step again, until we reach the bottom. There the loss is smallest, so the weight is the best one.', point: [300, 344], bubble: 'made it ✓' },
    { say: 'That’s gradient descent. Fancy name for: walk downhill, step by step.', point: [300, 384], bubble: 'downhill 🏔️' },
  ],
  draw: (step) => <DescentDiagram step={step} />,
  details: <p>The update rule is <b>w = w − learning_rate × gradient</b>. Real networks have millions of weights, so the “hill” has millions of directions, but the rule is the same for every weight. Tools like <b>Adam</b> are smarter ways of choosing the step size.</p>,
});

/* ============ 3. Backpropagation: share the blame ============ */

const NODES = [
  { x: 110, ys: [130, 230] },
  { x: 300, ys: [100, 180, 260] },
  { x: 490, ys: [180] },
];

function BackDiagram({ step }: { step: number }) {
  const lit = (layer: number) => step >= 2 && 2 - (step - 2) <= layer;
  return (
    <g>
      {NODES.slice(0, 2).map((a, li) => a.ys.flatMap((y1) => NODES[li + 1].ys.map((y2) => (
        <motion.line key={`${li}-${y1}-${y2}`} x1={a.x + 20} y1={y1} x2={NODES[li + 1].x - 20} y2={y2} stroke={lit(li + 1) ? '#b5533c' : 'currentColor'} initial={false} animate={{ opacity: lit(li + 1) ? 0.85 : 0.25 }} strokeWidth={lit(li + 1) ? 2 : 1} />
      ))))}
      {NODES.map((a, li) => a.ys.map((y) => <circle key={`${li}-${y}`} cx={a.x} cy={y} r={20} className={`sbox ${li === 1 ? 'night' : li === 2 ? 'teal' : 'paper'}`} />))}
      {step >= 1 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}><text x="490" y="230" textAnchor="middle" className="warn">wrong! loss 0.64</text></motion.g>}
      {step >= 2 && <text x="400" y="320" textAnchor="middle" className="cap">← the blame flows backwards</text>}
      {step >= 4 && <text x="300" y="362" textAnchor="middle" className="ok">every weight: nudge a little downhill</text>}
      {step >= 5 && <text x="300" y="400" textAnchor="middle" className="big-rule">guess → loss → blame → nudge → repeat</text>}
    </g>
  );
}

const backScene = scene({
  id: 'lr-backprop', chapter: CH, stage: 'behind', kicker: 'Backpropagation', title: 'Backpropagation: share the blame.',
  cues: [
    { say: 'One problem. A network has tons of weights. When the answer is wrong, whose fault is it?', point: [300, 180], bubble: 'who did it? 🕵️' },
    { say: 'Start at the end. The output was wrong, so we know the loss.', point: [490, 224], bubble: 'the mistake' },
    { say: 'Now walk backwards. Each weight just before the output gets its share of the blame: a big share if it pushed hard in the wrong direction.', point: [400, 314], bubble: 'backwards ⬅️' },
    { say: 'And keep going, layer by layer, all the way back to the start. That backwards walk is backpropagation.', point: [200, 180], bubble: 'layer by layer' },
    { say: 'Now every weight knows its slope, so every weight takes a tiny step downhill.', point: [300, 356], bubble: 'nudge 👉' },
    { say: 'Guess, measure the loss, share the blame, nudge, repeat. Millions of times. That loop is how every network learns, even ChatGPT.', point: [300, 394], bubble: 'the learning loop 🔁' },
  ],
  draw: (step) => <BackDiagram step={step} />,
  details: <p>Backpropagation is the <b>chain rule</b> from calculus applied layer by layer: it computes the gradient for every weight in one backward pass. Libraries like PyTorch do it for you with one line: <b>loss.backward()</b>. One full round over the training data is called an <b>epoch</b>.</p>,
});

/* ============ 4. Python, with John at the board ============ */

const CODE = [
  'import numpy as np',
  'x = np.array([1, 2, 3])',
  'y = np.array([2, 4, 6])   # secret rule: y = 2 * x',
  'w = 0.0                   # start with a bad guess',
  'lr = 0.01                 # learning rate: step size',
  'for step in range(30):',
  '    guess = w * x                      # forward',
  '    loss = np.mean((guess - y) ** 2)   # how wrong?',
  '    grad = np.mean(2 * (guess - y) * x)  # which way?',
  '    w = w - lr * grad                  # step downhill',
  '    if step % 10 == 0:',
  '        print(step, round(w, 2), round(loss, 2))',
  'print("learned w:", round(w, 2))',
];

const codeScene = scene({
  id: 'lr-python', chapter: CH, stage: 'python', kicker: 'Implement with Python', title: 'Watch a network learn, in thirteen lines.',
  cues: [
    { say: 'Code time! The smallest learner ever: one weight. The data hides a secret rule: y is two times x. The network doesn’t know that.', point: lineAt(2), bubble: 'secret: × 2', step: -1 },
    { say: 'It starts with a bad guess, zero. And a small learning rate.', point: lineAt(3), bubble: 'bad start', step: 0 },
    { say: 'Inside the loop: guess, then the loss. How wrong?', point: lineAt(7), bubble: 'guess + loss', step: 1 },
    { say: 'The gradient says which way is downhill, and this line takes the step. That’s gradient descent in two lines!', point: lineAt(9), bubble: 'downhill 🏔️', step: 2 },
    { say: 'Real output: the loss drops from eighteen, to two, to almost nothing. And w climbs to one point nine, almost two. It found the secret rule by itself!', point: [300, 360], bubble: 'it learned! 🎉', step: 3 },
  ],
  draw: (step) => {
    const hot = [[], [1, 2, 3, 4], [5, 6, 7], [8, 9], []][step + 1];
    return <CodeBoard title="learn.py" lines={CODE} hot={hot} output={step >= 3 ? ['0 0.19 18.67', '10 1.32 2.63', '20 1.74 0.37', 'learned w: 1.89'] : undefined} outNote="real output, numpy 1.26" />;
  },
  details: <><Code title="learn.py" code={CODE.join('\n')} /><p className="muted">Try lr = 0.2: the steps are too big, it jumps over the valley and the loss explodes. Try range(100): w gets to 2.0.</p></>,
});

/* ============ 5. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'lr-test', chapter: CH, title: 'Quick check: learning.',
  outro: 'Brilliant! You now know how every neural network learns. Turn the page!',
  items: [
    { ask: 'Quiz time! First one: what is the loss?', q: 'What is the loss?', options: ['How many weights the model has', 'One number for how wrong the model is', 'The speed of the computer'], answer: 1,
      explain: 'The loss is one number for how wrong we are. Learning means making it small.' },
    { ask: 'Question two. In gradient descent, what does the learning rate control?', q: 'What does the learning rate control?', options: ['The size of each step downhill', 'How much data we have', 'The number of layers'], answer: 0,
      explain: 'It’s the step size. Too big jumps over the valley, too small takes forever.' },
    { ask: 'Question three. Backpropagation walks through the network in which direction?', q: 'Backpropagation goes…', options: ['Input to output', 'Output back to input', 'Randomly'], answer: 1,
      explain: 'Backwards, from the mistake at the output back to the start, sharing the blame.' },
    { ask: 'Last one. Put the learning loop in order.', q: 'The learning loop is…', options: ['Nudge, guess, delete', 'Guess, loss, blame, nudge, repeat', 'Loss, stop'], answer: 1,
      explain: 'Guess, loss, blame, nudge, repeat. Millions of times.' },
  ],
});

/* ============ 6. What's next ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['Loss: one number for “how wrong”', 'Gradient descent: walk downhill', 'Learning rate: the step size', 'Backpropagation: share the blame', 'The loop: guess → loss → nudge'];
  return (
    <g>
      <text x="40" y="44" className="slabel">✓ Learning: what you now know</text>
      {done.map((d, i) => (
        <motion.text key={d} x="52" y={80 + i * 30} className="ok" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>✓ {d}</motion.text>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M300 270 L350 270" />
          <Box x={355} y={225} w={220} h={90} label="Next: is it any good?" sub="learned, or memorised?" tone="night" hot />
          <text x="465" y="342" textAnchor="middle" className="cap">next page →</text>
        </motion.g>
      )}
    </g>
  );
}

const nextScene = scene({
  id: 'lr-next', chapter: CH, kicker: 'What’s next?', title: 'What’s next?',
  cues: [
    { say: 'Look at that. You know the loop behind every AI: guess, loss, gradient, backprop, nudge.', point: [150, 140], bubble: 'Learning ✓' },
    { say: 'But careful. A low loss doesn’t always mean the model is smart. Maybe it just memorised the answers, like a student before an exam. Next chapter: how do we know it really learned? Turn the page, bro!', point: [465, 270], bubble: 'next page →' },
  ],
  draw: (step) => <NextDiagram step={step} />,
});

export const learningScenes = [lossScene, descentScene, backScene, codeScene, quiz, nextScene];
