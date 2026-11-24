import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { CodeBoard, lineAt } from '../../scene/CodeBoard';
import { quizScene } from '../../scene/quizScene';
import { Code } from '../../book/ui';
import { Table } from '../data/scenes';

/* =====================================================================
   PART 1 · Chapter "learning-types": Ways a machine learns.
   One question: where do the "answers" come from? Three answers, one per scene.
   ===================================================================== */

const CH = 'learning-types';

const WAYS = [
  { e: '👩‍🏫', t: 'Supervised', s: 'a teacher gives the answers', tone: 'teal' as const },
  { e: '🧭', t: 'Unsupervised', s: 'no answers: find groups', tone: 'paper' as const },
  { e: '🧩', t: 'Self-supervised', s: 'the data quizzes itself', tone: 'brass' as const },
];

/* ============ 1. The question ============ */

function WhyDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="48" textAnchor="middle" className="slabel">Where do the answers come from?</text>
      {WAYS.map((w, i) => (
        <motion.g key={w.t} initial={false} animate={{ opacity: step > i ? 1 : 0.15, y: step > i ? 0 : 8 }}>
          <Box x={30 + i * 190} y={110} w={160} h={100} label={`${w.e} ${w.t}`} sub={w.s} tone={w.tone} hot={step === i + 1} />
        </motion.g>
      ))}
      {step === 0 && <text x="300" y="270" textAnchor="middle" className="cap">Last chapter: features + a label (the answer). But who writes the label?</text>}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <text x="300" y="280" textAnchor="middle" className="big-rule">Three ways. Same goal: learn patterns.</text>
          <text x="300" y="310" textAnchor="middle" className="cap">ChatGPT uses mostly the third one. Let’s see each, one per page.</text>
        </motion.g>
      )}
    </g>
  );
}

const whyScene = scene({
  id: 'lt-why', chapter: CH, stage: 'imagine', kicker: 'Part 1 · Ways a machine learns', title: 'Where do the answers come from?',
  cues: [
    { say: 'Last chapter, every house came with its price: the answer. But in real life, who writes all those answers? That one question splits machine learning into three families.', point: [300, 262], bubble: 'who writes the answers?' },
    { say: 'Way one: supervised. A teacher gives the model examples with the answers already written on them.', point: [110, 214], bubble: 'teacher 👩‍🏫' },
    { say: 'Way two: unsupervised. No answers at all. The model just looks at the data and finds groups by itself.', point: [300, 214], bubble: 'explorer 🧭' },
    { say: 'Way three: self-supervised. The data hides a piece of itself, and the model guesses it. The data is its own teacher. Sneaky, right?', point: [490, 214], bubble: 'self-quiz 🧩' },
    { say: 'Three ways, same goal: learn patterns. And ChatGPT? Mostly way three. Let’s look at each one, one per page.', point: [300, 300], bubble: 'one per page →' },
  ],
  draw: (step) => <WhyDiagram step={step} />,
  details: <p>There is a fourth family, <b>reinforcement learning</b>: no answers, only rewards ("good move" / "bad move"), like training a dog with treats. It is how chatbots are polished to be helpful (RLHF), and gets its own chapter in Part 3.</p>,
});

/* ============ 2. Supervised ============ */

const CARDS = [['🐱', 'cat'], ['🐶', 'dog'], ['🐱', 'cat'], ['🐶', 'dog']];

function SupDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="110" y="40" textAnchor="middle" className="slabel">Flashcards</text>
      {CARDS.map(([e, l], i) => (
        <g key={i}>
          <rect x={40} y={56 + i * 56} width={140} height={46} rx="8" className={`row-b ${step === 1 ? 'hot-row' : ''}`} />
          <text x={62} y={88 + i * 56} className="emoji-t">{e}</text>
          {step >= 1 && <motion.text x={130} y={85 + i * 56} textAnchor="middle" className="lab-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }}>“{l}”</motion.text>}
        </g>
      ))}
      <Flow d="M184 170 L238 170" active={step >= 2} />
      <Box x={240} y={130} w={130} h={80} label="🧠 Model" sub="learns: ears, nose…" tone="night" hot={step === 2} />
      {step >= 2 && (
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M372 170 L418 170" />
          <rect x={420} y={130} width={150} height={80} rx="8" className="row-b hot-row" />
          <text x={440} y={180} className="emoji-t">🐶</text>
          <text x={520} y={166} textAnchor="middle" className="ssub paper">new photo</text>
          <text x={520} y={188} textAnchor="middle" className="ok">“dog” ✓</text>
        </motion.g>
      )}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box x={240} y={270} w={330} h={60} label="✍️ Catch: humans wrote every label" sub="slow and expensive for millions of photos" tone="brass" />
        </motion.g>
      )}
      {step >= 4 && <text x="405" y="370" textAnchor="middle" className="cap">used for: spam filters, house prices, face unlock</text>}
    </g>
  );
}

const supScene = scene({
  id: 'lt-supervised', chapter: CH, stage: 'visualize', kicker: 'Way 1 · Supervised', title: 'Supervised: learning with an answer key.',
  cues: [
    { say: 'Supervised learning is like studying with flashcards. A picture on the front.', point: [110, 40], bubble: 'flashcards' },
    { say: 'And the answer on the back: cat, dog, cat, dog. These answers are the labels from last chapter.', point: [184, 110], bubble: 'labels 🎯' },
    { say: 'After enough cards, the model spots the patterns. Pointy ears, long nose. Show it a new photo, and it says: dog.', point: [495, 214], bubble: 'it learned!' },
    { say: 'The catch: a human wrote every single label. For a million photos, that’s a lot of very bored humans.', point: [405, 334], bubble: 'expensive 💸' },
    { say: 'Still, when you have the answers, supervised learning is the most reliable way. Spam filters, house prices, face unlock: all supervised.', point: [405, 362], bubble: 'everywhere' },
  ],
  draw: (step) => <SupDiagram step={step} />,
  details: <p>Two kinds of supervised task: <b>classification</b> (pick a category: cat / dog, spam / not spam) and <b>regression</b> (predict a number: a price, a temperature).</p>,
});

/* ============ 3. Unsupervised ============ */

const DOTS: [number, number, number][] = [
  [90, 290, 0], [115, 310, 0], [130, 280, 0], [100, 325, 0],
  [270, 200, 1], [300, 225, 1], [285, 180, 1], [320, 195, 1],
  [450, 90, 2], [480, 110, 2], [500, 80, 2], [465, 130, 2],
];
const GROUP = [
  { c: '#2f7f88', cx: 110, cy: 302, n: 'bargain hunters' },
  { c: '#c4974a', cx: 295, cy: 200, n: 'weekend shoppers' },
  { c: '#b5533c', cx: 474, cy: 102, n: 'big spenders' },
];

function UnsupDiagram({ step }: { step: number }) {
  return (
    <g>
      <line x1="60" y1="360" x2="560" y2="360" className="axis" stroke="currentColor" opacity="0.4" />
      <line x1="60" y1="360" x2="60" y2="40" className="axis" stroke="currentColor" opacity="0.4" />
      <text x="310" y="384" textAnchor="middle" className="cap">visits per month →</text>
      <text x="40" y="200" textAnchor="middle" className="cap" transform="rotate(-90 40 200)">money spent →</text>
      {step >= 2 && GROUP.map((g, i) => (
        <motion.circle key={i} cx={g.cx} cy={g.cy} r={46} fill={g.c} opacity={0.15} stroke={g.c} strokeWidth={2} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: `${g.cx}px`, originY: `${g.cy}px` }} />
      ))}
      {DOTS.map(([x, y, k], i) => (
        <motion.circle key={i} cx={x} cy={y} r={8} initial={false} animate={{ fill: step >= 2 ? GROUP[k].c : '#8a8578' }} />
      ))}
      {step === 1 && <text x="420" y="300" textAnchor="middle" className="warn">no labels anywhere!</text>}
      {step >= 2 && step < 3 && GROUP.map((g, i) => <text key={i} x={g.cx} y={g.cy + 66} textAnchor="middle" className="slabel" style={{ fontSize: 13 }}>group {'ABC'[i]}</text>)}
      {step >= 3 && GROUP.map((g, i) => <motion.text key={i} x={g.cx} y={g.cy + 66} textAnchor="middle" className="slabel" style={{ fontSize: 13 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{g.n}</motion.text>)}
    </g>
  );
}

const unsupScene = scene({
  id: 'lt-unsupervised', chapter: CH, stage: 'discover', kicker: 'Way 2 · Unsupervised', title: 'Unsupervised: no answers, just patterns.',
  cues: [
    { say: 'Here’s a shop’s customers. Each dot is one person: how often they visit, and how much they spend.', point: [300, 230], bubble: 'one dot = one customer' },
    { say: 'Notice: no labels. Nobody told the model what kinds of customers exist. It gets the dots, and that’s it.', point: [420, 280], bubble: 'no answer key' },
    { say: 'The model notices that some dots sit close together, and forms groups: A, B and C. This is called clustering.', point: [340, 250], bubble: 'clustering ✨' },
    { say: 'The model can’t name the groups. A human looks and says: bargain hunters, weekend shoppers, big spenders. Now the shop can send each group the right offer.', point: [520, 160], bubble: 'humans name them' },
  ],
  draw: (step) => <UnsupDiagram step={step} />,
  details: <p>Other unsupervised jobs: <b>anomaly detection</b> (a credit-card payment that fits no normal group might be fraud) and <b>dimensionality reduction</b> (squeezing 100 columns into 2 so you can plot them). The most famous clustering method is <b>K-means</b>; you'll see it in the code page.</p>,
});

/* ============ 4. Self-supervised ============ */

const WORDS = ['The', 'cat', 'sat', 'on', 'the', 'mat'];

function SelfDiagram({ step }: { step: number }) {
  const hide = step >= 1;
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="slabel">Just a sentence. No human labels.</text>
      {WORDS.map((w, i) => {
        const last = i === 5;
        return (
          <g key={i}>
            <rect x={45 + i * 87} y={60} width={78} height={42} rx="8" className={`row-b ${hide && last ? 'hot-row' : ''}`} />
            <text x={84 + i * 87} y={87} textAnchor="middle" className="tcell-t head">{hide && last ? (step >= 2 ? 'mat ✓' : '?') : w}</text>
          </g>
        );
      })}
      {step >= 2 && <text x="300" y="130" textAnchor="middle" className="ok">the answer was in the text all along</text>}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <text x="60" y="166" className="cap">one sentence = many free quizzes:</text>
          {[1, 2, 3].map((n, i) => (
            <text key={n} x="70" y={194 + i * 26} className="cb-line" style={{ fill: 'currentColor' }}>{WORDS.slice(0, n).join(' ')} → <tspan className="lab-t">{WORDS[n]}</tspan></text>
          ))}
        </motion.g>
      )}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M330 230 L368 230" color="#c4974a" count={3} dur={1} />
          <Box x={370} y={180} w={200} h={100} label="🌍 the whole internet" sub="= trillions of free quizzes" tone="night" hot />
          <text x="300" y="340" textAnchor="middle" className="big-rule">That’s how GPT learns.</text>
        </motion.g>
      )}
    </g>
  );
}

const selfScene = scene({
  id: 'lt-self', chapter: CH, stage: 'behind', kicker: 'Way 3 · Self-supervised', title: 'Self-supervised: the data is its own teacher.',
  cues: [
    { say: 'Now the clever one. Here’s an ordinary sentence. No teacher, no labels.', point: [300, 108], bubble: 'just text' },
    { say: 'Hide the last word, and ask the model to guess it. The cat sat on the… what?', point: [519, 108], bubble: 'guess! 🤔' },
    { say: 'Mat! And we didn’t need a human to tell us. The answer was sitting in the text all along. The data labelled itself.', point: [519, 108], bubble: 'free label 🎁' },
    { say: 'Even better: one sentence gives many quizzes. The, then cat. The cat, then sat. Every word is the answer to the words before it.', point: [300, 220], bubble: 'many quizzes' },
    { say: 'Now do that with the whole internet: trillions of free quizzes. Guess the next word, over and over. That’s exactly how GPT is pre-trained. You just learned the big secret.', point: [470, 284], bubble: 'the big secret 🤫' },
  ],
  draw: (step) => <SelfDiagram step={step} />,
  details: <p>Guessing the next word is called <b>next-token prediction</b> (tokens are coming in the Tokenization chapter). BERT uses a cousin: hide a word in the <i>middle</i> and guess it (masked language modelling). Images work too: hide part of a photo and predict the missing patch.</p>,
});

/* ============ 5. Side by side ============ */

function CompareDiagram({ step }: { step: number }) {
  return (
    <g>
      <Table x={30} y={40} w={[150, 200, 190]} cols={['way', 'answers come from', 'example']}
        rows={[['👩‍🏫 supervised', 'humans label them', 'spam filter'], ['🧭 unsupervised', 'nowhere: no answers', 'customer groups'], ['🧩 self-supervised', 'the data itself', 'GPT, BERT']]}
        flag={step >= 1 && step <= 3 ? [step - 1] : []} />
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box x={30} y={200} w={250} h={80} label="🍪 Bonus: rewards" sub="reinforcement learning · Part 3" tone="paper" />
          <Box x={320} y={200} w={250} h={80} label="ChatGPT = 🧩 then 👩‍🏫 then 🍪" sub="read, then study, then polish" tone="night" hot />
          <text x="300" y="320" textAnchor="middle" className="ok">Next: the same three ways in real Python.</text>
        </motion.g>
      )}
    </g>
  );
}

const compareScene = scene({
  id: 'lt-compare', chapter: CH, stage: 'visualize', kicker: 'Ways to learn · side by side', title: 'All three, side by side.',
  cues: [
    { say: 'Let’s put them side by side. One column matters most: where do the answers come from?', point: [355, 56], bubble: 'the key column' },
    { say: 'Supervised: humans write the answers. Reliable, but expensive.', point: [355, 86], bubble: 'humans ✍️' },
    { say: 'Unsupervised: there are no answers. The model just finds structure.', point: [355, 116], bubble: 'no answers' },
    { say: 'Self-supervised: the data hides its own answers. Cheap, and it scales to the whole internet.', point: [355, 146], bubble: 'free answers' },
    { say: 'Fun fact: ChatGPT uses them in a row. First it reads the internet, self-supervised. Then it studies human examples, supervised. Then it gets polished with rewards. Next page: all three in Python.', point: [445, 284], bubble: 'the recipe 🍳' },
  ],
  draw: (step) => <CompareDiagram step={step} />,
});

/* ============ 6. Python, with John at the board ============ */

const CODE = [
  'from sklearn.linear_model import LogisticRegression',
  'from sklearn.cluster import KMeans',
  'X = [[1], [2], [8], [9]]        # hours studied',
  'y = [0, 0, 1, 1]                # answers: fail/pass',
  'clf = LogisticRegression().fit(X, y)',
  'print("7 hours ->", clf.predict([[7]])[0])',
  'pts = [[1, 2], [1, 1], [9, 8], [8, 9]]  # no answers',
  'km = KMeans(2, n_init=10, random_state=0).fit(pts)',
  'print("groups:", km.labels_)',
  'words = "the cat sat on the mat".split()',
  'for i in range(1, 3):          # text quizzes itself',
  '    print(words[:i], "->", words[i])',
];

const codeScene = scene({
  id: 'lt-python', chapter: CH, stage: 'python', kicker: 'Implement with Python', title: 'Three ways to learn, in twelve lines.',
  cues: [
    { say: 'Code time, and I’m right here with you. Three tiny programs, one for each way of learning.', point: lineAt(0), bubble: 'three in one 🤝', step: -1 },
    { say: 'Two ready-made tools from scikit-learn: one learns from answers, one finds groups.', point: lineAt(1), bubble: 'two tools', step: 0 },
    { say: 'Supervised. X is hours studied, y is the answer: fail or pass. fit means: learn from these flashcards. Then we ask about someone who studied seven hours.', point: lineAt(4), bubble: 'with answers', step: 1 },
    { say: 'Unsupervised. Just points, no y at all. K-means, asked for two groups, sorts them out by itself.', point: lineAt(7), bubble: 'no answers', step: 2 },
    { say: 'Self-supervised. No library needed! We cut a sentence and use the next word as the answer. That’s the training data of an LLM, in two lines.', point: lineAt(10), bubble: 'free answers', step: 3 },
    { say: 'Real output: seven hours means pass. The first two points are one group, the last two another. And the sentence turned into its own quiz. Copy the code from my page and try it!', point: [300, 350], bubble: 'it really runs ✓', step: 4 },
  ],
  draw: (step) => {
    const hot = [[], [0, 1], [2, 3, 4, 5], [6, 7, 8], [9, 10, 11], []][step + 1];
    return <CodeBoard title="three_ways.py" lines={CODE} hot={hot} output={step >= 4 ? ['7 hours -> 1', 'groups: [1 1 0 0]', "['the'] -> cat", "['the', 'cat'] -> sat"] : undefined} outNote="real output, scikit-learn 1.4" />;
  },
  details: <><Code title="three_ways.py" code={CODE.join('\n')} /><p className="muted">pip install scikit-learn · "1" means pass. The group numbers 0 and 1 are just names K-means picks; only "same number = same group" matters.</p></>,
});

/* ============ 7. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'lt-test', chapter: CH, title: 'Quick check: ways to learn.',
  outro: 'Done! You now know the three ways machines learn, and the secret behind GPT. Turn the page for what’s next.',
  items: [
    { ask: 'Quiz time! Four quick ones, skip by turning the page if you like. First: you have ten thousand photos, each tagged cat or dog by a person. Which way of learning is that?', q: '10,000 photos, each tagged “cat” or “dog” by a person. Which way?', options: ['Supervised', 'Unsupervised', 'Self-supervised'], answer: 0,
      explain: 'Humans wrote the answers on every photo, so it’s supervised. Flashcards with an answer key.' },
    { ask: 'Question two. A shop wants to find groups of similar customers, but nobody knows what the groups are yet. Which way?', q: 'Find groups of similar customers, with no groups known in advance. Which way?', options: ['Supervised', 'Unsupervised', 'Self-supervised'], answer: 1,
      explain: 'No answers exist, the model finds the groups itself. That’s unsupervised clustering.' },
    { ask: 'Question three. How does GPT get the answers it learns from during pre-training?', q: 'During pre-training, where do GPT’s “answers” come from?', options: ['People label every sentence', 'The next word in the text itself', 'It doesn’t use any answers'], answer: 1,
      explain: 'The next word is the answer, and it’s already in the text. Self-supervised: free labels, trillions of them.' },
    { ask: 'Last one. What is the biggest downside of supervised learning?', q: 'The biggest downside of supervised learning?', options: ['It can’t make predictions', 'Someone has to label lots of data', 'It only works on text'], answer: 1,
      explain: 'Labels cost human time and money. That’s exactly why self-supervised learning was such a big deal.' },
  ],
});

/* ============ 8. What's next ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['Where answers come from', 'Supervised: answer key', 'Unsupervised: find groups', 'Self-supervised: data quizzes itself', 'All three in real Python'];
  return (
    <g>
      <text x="40" y="44" className="slabel">✓ Ways to learn: what you now know</text>
      {done.map((d, i) => (
        <motion.text key={d} x="52" y={80 + i * 30} className="ok" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>✓ {d}</motion.text>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Box x={355} y={95} w={220} h={110} label="Next: one neuron" sub="what’s inside the 🧠 box" tone="night" hot />
          <text x="465" y="232" textAnchor="middle" className="cap">next page →</text>
        </motion.g>
      )}
    </g>
  );
}

const nextScene = scene({
  id: 'lt-next', chapter: CH, kicker: 'What’s next?', title: 'What’s next?',
  cues: [
    { say: 'Nice work! Three ways to learn, plus the secret of how GPT reads the internet.', point: [150, 150], bubble: 'Ways to learn ✓' },
    { say: 'All this time I drew the model as a little brain box. Next chapter, we open the box and meet one neuron. Turn the page, bro!', point: [465, 150], bubble: 'next page →' },
  ],
  draw: (step) => <NextDiagram step={step} />,
});

export const learningTypesScenes = [whyScene, supScene, unsupScene, selfScene, compareScene, codeScene, quiz, nextScene];
