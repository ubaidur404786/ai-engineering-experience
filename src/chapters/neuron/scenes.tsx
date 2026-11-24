import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { CodeBoard, lineAt } from '../../scene/CodeBoard';
import { quizScene } from '../../scene/quizScene';
import { Code } from '../../book/ui';

/* =====================================================================
   PART 1 · Chapter "neuron": One neuron, then a network.
   One running example the whole chapter: "Should I go to the beach?"
   ===================================================================== */

const CH = 'neuron';

const INPUTS = [
  { e: '☀️', t: 'sunny', v: 1, w: 3 },
  { e: '🌡️', t: 'warm', v: 1, w: 2 },
  { e: '🌧️', t: 'raining', v: 0, w: -5 },
];

/* ============ 1. One neuron = one tiny decision ============ */

function NeuronDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="slabel">Question: should I go to the beach? 🏖️</text>
      {INPUTS.map((inp, i) => (
        <motion.g key={inp.t} initial={false} animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
          <rect x={30} y={80 + i * 80} width={130} height={50} rx="8" className={`row-b ${step === 1 ? 'hot-row' : ''}`} />
          <text x={50} y={112 + i * 80} className="emoji-t">{inp.e}</text>
          <text x={120} y={104 + i * 80} textAnchor="middle" className="ssub paper">{inp.t}</text>
          <text x={120} y={122 + i * 80} textAnchor="middle" className="lab-t">{inp.v ? 'yes = 1' : 'no = 0'}</text>
          <Flow d={`M162 ${105 + i * 80} L268 185`} active={step >= 2} />
        </motion.g>
      ))}
      <motion.circle cx={310} cy={185} r={42} className={`sbox night ${step === 2 ? 'hot' : ''}`} initial={false} animate={{ opacity: step >= 2 ? 1 : 0.3 }} />
      <text x={310} y={192} textAnchor="middle" className="slabel night">🧠</text>
      {step >= 2 && <text x={310} y={250} textAnchor="middle" className="cap">add up the clues</text>}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M354 185 L418 185" />
          <Box x={420} y={150} w={150} h={70} label="✅ GO!" sub="one decision" tone="teal" hot />
        </motion.g>
      )}
      {step >= 4 && <text x="300" y="340" textAnchor="middle" className="big-rule">A neuron: clues in → one answer out.</text>}
    </g>
  );
}

const neuronScene = scene({
  id: 'nn-neuron', chapter: CH, stage: 'imagine', kicker: 'Part 1 · One neuron, then a network', title: 'A neuron is one tiny decision.',
  cues: [
    { say: 'All this time I drew the model as a little brain box. Today we open it. Inside, there are thousands of tiny pieces called neurons. Let’s meet just one.', point: [310, 185], bubble: 'open the box 📦' },
    { say: 'A neuron makes one small decision. Ours: should I go to the beach? It gets three clues as numbers. Sunny: yes, one. Warm: yes, one. Raining: no, zero.', point: [162, 180], bubble: 'clues = numbers' },
    { say: 'The neuron adds up the clues into one number.', point: [310, 230], bubble: 'add them up ➕' },
    { say: 'If the total is big enough: go! That’s the answer, one decision.', point: [495, 222], bubble: 'beach time 🏖️' },
    { say: 'That’s it. A neuron takes some numbers in, and gives one answer out. ChatGPT is just billions of these, wired together. No magic.', point: [300, 330], bubble: 'no magic ✨' },
  ],
  draw: (step) => <NeuronDiagram step={step} />,
  details: <p>The name comes from brain cells: a real neuron collects signals from its neighbours and “fires” when there are enough. An artificial neuron is a very rough copy of that idea, written in maths: just multiply, add, and decide.</p>,
});

/* ============ 2. Weights and bias ============ */

function WeightsDiagram({ step }: { step: number }) {
  const sum = 3 + 2 + 0 - 2;
  return (
    <g>
      <text x="300" y="38" textAnchor="middle" className="slabel">Not every clue matters the same</text>
      {INPUTS.map((inp, i) => (
        <g key={inp.t}>
          <rect x={40} y={60 + i * 52} width={520} height={42} rx="8" className={`row-b ${step === 1 && i < 2 ? 'hot-row' : ''} ${step === 2 && i === 2 ? 'hot-row' : ''}`} />
          <text x={58} y={88 + i * 52} className="tcell-t">{inp.e} {inp.t} = {inp.v}</text>
          {step >= 1 && <motion.text x={250} y={88 + i * 52} className="tcell-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>× weight <tspan className={inp.w < 0 ? 'warn' : 'lab-t'}>{inp.w > 0 ? '+' : ''}{inp.w}</tspan></motion.text>}
          {step >= 3 && <motion.text x={470} y={88 + i * 52} className="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>= {inp.v * inp.w}</motion.text>}
        </g>
      ))}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <rect x={40} y={216} width={520} height={42} rx="8" className="row-b hot-row" />
          <text x={58} y={244} className="tcell-t">😴 bias (my lazy mood)</text>
          <text x={470} y={244} className="warn">−2</text>
        </motion.g>
      )}
      {step >= 5 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <text x="300" y="300" textAnchor="middle" className="big-rule">3 + 2 + 0 − 2 = {sum} → bigger than 0 → GO ✅</text>
          <text x="300" y="336" textAnchor="middle" className="cap">Learning = finding good weights and bias. (That’s the next chapter.)</text>
        </motion.g>
      )}
    </g>
  );
}

const weightsScene = scene({
  id: 'nn-weights', chapter: CH, stage: 'visualize', kicker: 'Weights and bias', title: 'Weights: how much each clue matters.',
  cues: [
    { say: 'But wait. Not every clue matters the same. I love sun more than warmth, and I hate rain.', point: [300, 46], bubble: 'some clues matter more' },
    { say: 'So each clue gets a weight: a number for how much it matters. Sunny gets three, warm gets two.', point: [300, 110], bubble: 'weights ⚖️' },
    { say: 'Rain gets minus five. A negative weight means: this clue pushes me away. Rain kills the beach plan.', point: [300, 166], bubble: 'negative = no!' },
    { say: 'Multiply each clue by its weight. Sunny: three. Warm: two. Raining is zero, so it adds nothing today. Lucky!', point: [490, 120], bubble: 'multiply ✖️' },
    { say: 'And one more number: the bias. It’s my mood before I even look outside. I’m a bit lazy, so minus two.', point: [490, 238], bubble: 'bias = mood 😴' },
    { say: 'Add it all up: three plus two plus zero minus two. Three! Bigger than zero, so: go. And here’s the secret: learning just means finding good weights and bias.', point: [300, 296], bubble: 'the whole trick' },
  ],
  draw: (step) => <WeightsDiagram step={step} />,
  details: <p>The formula is <b>z = x₁·w₁ + x₂·w₂ + x₃·w₃ + b</b>, called the <b>weighted sum</b>. Weights and biases together are the model’s <b>parameters</b>. When people say “GPT-3 has 175 billion parameters”, they mean 175 billion of these little numbers.</p>,
});

/* ============ 3. Activation functions ============ */

function Curve({ x, y, title, d, sub, hot }: { x: number; y: number; title: string; d: string; sub: string; hot: boolean }) {
  return (
    <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={x} y={y} width={170} height={190} rx="10" className={`sbox paper ${hot ? 'hot' : ''}`} />
      <text x={x + 85} y={y + 26} textAnchor="middle" className="slabel paper">{title}</text>
      <line x1={x + 15} y1={y + 120} x2={x + 155} y2={y + 120} stroke="currentColor" opacity="0.3" />
      <line x1={x + 85} y1={y + 45} x2={x + 85} y2={y + 145} stroke="currentColor" opacity="0.3" />
      <path d={d} fill="none" stroke="#2f7f88" strokeWidth={3} />
      <text x={x + 85} y={y + 172} textAnchor="middle" className="ssub paper">{sub}</text>
    </motion.g>
  );
}

function ActDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="36" textAnchor="middle" className="slabel">The sum is 3. Now what? Squash it!</text>
      {step >= 1 && <Curve x={25} y={60} title="Step" sub="yes / no" hot={step === 1} d="M40 180 L110 180 L110 70 L180 70" />}
      {step >= 2 && <Curve x={215} y={60} title="Sigmoid" sub="a chance: 0 to 1" hot={step === 2} d="M230 178 C290 178 280 72 370 72" />}
      {step >= 3 && <Curve x={405} y={60} title="ReLU" sub="below 0 → 0" hot={step === 3} d="M420 180 L490 180 L560 75" />}
      {step >= 2 && <text x="300" y="282" textAnchor="middle" className="ok">sigmoid(3) = 0.95 → “95% sure: go!”</text>}
      {step >= 4 && <text x="300" y="330" textAnchor="middle" className="big-rule">Activation = the neuron’s yes-meter.</text>}
      {step >= 4 && <text x="300" y="360" textAnchor="middle" className="cap">Without it, a whole network is just one big boring sum.</text>}
    </g>
  );
}

const actScene = scene({
  id: 'nn-activation', chapter: CH, stage: 'discover', kicker: 'Activation functions', title: 'Activation: the neuron’s yes-meter.',
  cues: [
    { say: 'Our sum was three. But three what? The neuron needs a final step that turns the sum into a clear answer. That’s called an activation function.', point: [300, 44], bubble: 'squash it 🍋' },
    { say: 'The simplest: a step. Above zero, yes. Below zero, no. Like a light switch.', point: [110, 200], bubble: 'on / off 💡' },
    { say: 'Sigmoid is smoother. It squashes any number into a chance between zero and one. Our three becomes zero point nine five: ninety-five percent sure, go!', point: [300, 276], bubble: '95% sure' },
    { say: 'ReLU is the favourite in modern networks. Negative? Make it zero. Positive? Keep it. Simple and fast.', point: [490, 200], bubble: 'the popular one ⭐' },
    { say: 'Why bother? Without activations, stacking neurons would just be one big sum, and it could only learn straight lines. Activations let networks learn curvy, interesting things.', point: [300, 350], bubble: 'the secret sauce' },
  ],
  draw: (step) => <ActDiagram step={step} />,
  details: <p>Sigmoid is <b>1 / (1 + e⁻ᶻ)</b>. ReLU is <b>max(0, z)</b>. LLMs like GPT use a smooth cousin of ReLU called <b>GELU</b>. Same idea: let positive signals through, quiet the negative ones.</p>,
});

/* ============ 4. A network: forward propagation ============ */

const L = [
  { x: 90, ys: [110, 200, 290], n: 'input' },
  { x: 300, ys: [80, 160, 240, 320], n: 'hidden' },
  { x: 510, ys: [200], n: 'output' },
];

function NetDiagram({ step }: { step: number }) {
  const on = (layer: number) => step >= 2 && step - 2 >= layer;
  return (
    <g>
      {L.slice(0, 2).map((a, li) => a.ys.flatMap((y1) => L[li + 1].ys.map((y2) => (
        <motion.line key={`${li}-${y1}-${y2}`} x1={a.x + 22} y1={y1} x2={L[li + 1].x - 22} y2={y2} stroke={on(li + 1) ? '#c4974a' : 'currentColor'} initial={false} animate={{ opacity: step >= 1 ? (on(li + 1) ? 0.8 : 0.25) : 0.08 }} strokeWidth={on(li + 1) ? 2 : 1} />
      ))))}
      {L.map((a, li) => (
        <g key={a.n}>
          {a.ys.map((y) => (
            <motion.circle key={y} cx={a.x} cy={y} r={22} className={`sbox ${li === 1 ? 'night' : li === 2 ? 'teal' : 'paper'}`} initial={false} animate={{ scale: on(li) && step - 2 === li ? 1.12 : 1 }} style={{ originX: `${a.x}px`, originY: `${y}px` }} />
          ))}
          <text x={a.x} y={372} textAnchor="middle" className={`slabel ${step >= 1 ? '' : 'dim'}`}>{a.n}</text>
        </g>
      ))}
      {INPUTS.map((inp, i) => <text key={inp.t} x={90} y={L[0].ys[i] + 7} textAnchor="middle" className="emoji-t" style={{ fontSize: 18 }}>{inp.e}</text>)}
      {step >= 4 && <text x={510} y={207} textAnchor="middle" className="slabel teal">GO</text>}
      {step === 0 && <text x="300" y="400" textAnchor="middle" className="cap">one neuron = one small decision. Now: a team.</text>}
      {step >= 4 && <text x="300" y="400" textAnchor="middle" className="ok">left → right = forward propagation</text>}
    </g>
  );
}

const netScene = scene({
  id: 'nn-network', chapter: CH, stage: 'behind', kicker: 'Forward propagation', title: 'Many neurons = a network.',
  cues: [
    { say: 'One neuron is a tiny decision. Now let’s build a team.', point: [300, 200], bubble: 'teamwork 🤝' },
    { say: 'Neurons stand in layers. Input on the left: our clues. A hidden layer in the middle. An output on the right. Every neuron talks to every neuron in the next layer.', point: [300, 365], bubble: 'layers' },
    { say: 'The clues go in on the left.', point: [90, 200], bubble: 'start here' },
    { say: 'Each hidden neuron does its own little weighted sum and activation. One might notice “perfect beach weather”, another “too hot to move”.', point: [300, 160], bubble: 'each one: sum + squash' },
    { say: 'Their answers flow into the output neuron, which makes the final call: go! Numbers moving left to right like this is called forward propagation. Fancy name, simple idea.', point: [510, 230], bubble: 'forward ➡️' },
  ],
  draw: (step) => <NetDiagram step={step} />,
  details: <p>A network with many hidden layers is a <b>deep</b> network, hence <b>deep learning</b>. GPT-style models stack dozens of layers, with thousands of neurons each. But every single neuron still does the same thing you just learned: multiply, add, squash, pass it on.</p>,
});

/* ============ 5. Python, with John at the board ============ */

const CODE = [
  'import numpy as np',
  'x = np.array([1, 1, 0])       # sunny, warm, raining',
  'w = np.array([3, 2, -5])      # how much each one matters',
  'b = -2                        # bias: my lazy mood',
  'z = x @ w + b                 # multiply, add up, add bias',
  'print("sum:", z, "go?", z > 0)',
  'sig = 1 / (1 + np.exp(-z))    # sigmoid: squash to 0..1',
  'print("chance:", round(sig, 2))',
  '# a tiny network: 3 inputs -> 2 hidden -> 1 output',
  'W1 = np.array([[3, 1], [2, -1], [-5, 2]])',
  'h = np.maximum(0, x @ W1)     # ReLU: negatives become 0',
  'out = h @ np.array([1, 0.5])  # hidden -> output',
  'print("network says:", out)',
];

const codeScene = scene({
  id: 'nn-python', chapter: CH, stage: 'python', kicker: 'Implement with Python', title: 'A neuron and a network, in thirteen lines.',
  cues: [
    { say: 'Code time, I’m right here. Same beach question, now in Python with numpy, the number-crunching library.', point: lineAt(0), bubble: 'same example 🏖️', step: -1 },
    { say: 'The clues, the weights and the bias. Exactly the numbers from my table.', point: lineAt(2), bubble: 'x, w, b', step: 0 },
    { say: 'This little at sign means: multiply each pair and add them up. Plus the bias. That’s a whole neuron in one line!', point: lineAt(4), bubble: 'one neuron ✨', step: 1 },
    { say: 'The sigmoid formula, turning the sum into a chance.', point: lineAt(6), bubble: 'yes-meter', step: 2 },
    { say: 'Now a tiny network. W1 holds weights for two hidden neurons at once. np dot maximum is ReLU. Then the hidden answers flow to the output.', point: lineAt(10), bubble: 'a network', step: 3 },
    { say: 'Real output: sum three, so go. Ninety-five percent sure. And the network says five, a strong yes. Copy the code from my page and change the weather!', point: [300, 360], bubble: 'it really runs ✓', step: 4 },
  ],
  draw: (step) => {
    const hot = [[], [1, 2, 3], [4, 5], [6, 7], [8, 9, 10, 11, 12], []][step + 1];
    return <CodeBoard title="neuron.py" lines={CODE} hot={hot} output={step >= 4 ? ['sum: 3 go? True', 'chance: 0.95', 'network says: 5.0'] : undefined} outNote="real output, numpy 1.26" />;
  },
  details: <><Code title="neuron.py" code={CODE.join('\n')} /><p className="muted">pip install numpy · Try raining = 1: the sum becomes −2, and the answer flips to “no”.</p></>,
});

/* ============ 6. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'nn-test', chapter: CH, title: 'Quick check: neurons.',
  outro: 'Great job! You just took apart a neural network. Turn the page for what’s next.',
  items: [
    { ask: 'Quiz time! Four quick ones. First: what does a single neuron do?', q: 'What does a single neuron do?', options: ['Stores a whole sentence', 'Multiplies inputs by weights, adds them up, then squashes', 'Searches the internet'], answer: 1,
      explain: 'Multiply, add, squash. That’s all one neuron ever does.' },
    { ask: 'Question two. In the beach example, rain had a weight of minus five. What does a negative weight mean?', q: 'Rain has weight −5. What does a negative weight mean?', options: ['That clue pushes the answer towards “no”', 'That clue is ignored', 'The neuron is broken'], answer: 0,
      explain: 'Negative weights push against the decision. Rain says: stay home.' },
    { ask: 'Question three. What is ReLU?', q: 'What does ReLU do?', options: ['Turns negatives into 0, keeps positives', 'Always outputs 1', 'Adds the bias'], answer: 0,
      explain: 'ReLU is max of zero and z. Simple, fast, and the favourite in modern networks.' },
    { ask: 'Last one. Numbers flowing from the input layer to the output layer is called what?', q: 'Numbers flowing input → hidden → output is called…', options: ['Backpropagation', 'Forward propagation', 'Clustering'], answer: 1,
      explain: 'Forward propagation: left to right. Its partner, backpropagation, is how a network learns. Next chapter!' },
  ],
});

/* ============ 7. What's next ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['A neuron: clues in, one answer out', 'Weights: how much each clue matters', 'Bias: the mood before looking', 'Activation: the yes-meter', 'Layers + forward propagation'];
  return (
    <g>
      <text x="40" y="44" className="slabel">✓ Neurons: what you now know</text>
      {done.map((d, i) => (
        <motion.text key={d} x="52" y={80 + i * 30} className="ok" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>✓ {d}</motion.text>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Box x={355} y={95} w={220} h={110} label="Next: how it learns" sub="finding good weights" tone="night" hot />
          <text x="465" y="232" textAnchor="middle" className="cap">next page →</text>
        </motion.g>
      )}
    </g>
  );
}

const nextScene = scene({
  id: 'nn-next', chapter: CH, kicker: 'What’s next?', title: 'What’s next?',
  cues: [
    { say: 'Look at you! You opened the brain box: neurons, weights, bias, activations, and a whole network.', point: [150, 150], bubble: 'Neurons ✓' },
    { say: 'But one question is left. I picked the weights myself: three, two, minus five. How does a network find good weights on its own? That’s the next chapter. Turn the page, bro!', point: [465, 150], bubble: 'next page →' },
  ],
  draw: (step) => <NextDiagram step={step} />,
});

export const neuronScenes = [neuronScene, weightsScene, actScene, netScene, codeScene, quiz, nextScene];
