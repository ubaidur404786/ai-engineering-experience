import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { quizScene } from '../../scene/quizScene';

/* =====================================================================
   PART 2 · Chapter "planning": Planning a foundation model.
   Running idea: building a ChatGPT is like building a house — plan first.
   ===================================================================== */

const CH = 'planning';

/* ============ 1. Four decisions before training ============ */

const DECISIONS = [
  { l: '🎯 What for?', s: 'chat, code, medicine…', x: 40, y: 80 },
  { l: '📏 How big?', s: 'number of parameters', x: 320, y: 80 },
  { l: '📚 Which data?', s: 'what it will read', x: 40, y: 200 },
  { l: '💰 What budget?', s: 'GPUs, time, money', x: 320, y: 200 },
];

function PlanDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="44" textAnchor="middle" className="slabel">Before training: four big decisions 🏗️</text>
      {DECISIONS.map((d, i) => step >= i + 1 && (
        <motion.g key={d.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box x={d.x} y={d.y} w={240} h={90} label={d.l} sub={d.s} tone={i % 2 ? 'teal' : 'night'} hot={step === i + 1} />
        </motion.g>
      ))}
      {step >= 5 && <text x="300" y="340" textAnchor="middle" className="big-rule">Plan first. A training run costs millions.</text>}
    </g>
  );
}

const planScene = scene({
  id: 'pl-decide', chapter: CH, stage: 'imagine', kicker: 'Part 2 · How LLMs are created', title: 'Plan first, train later.',
  cues: [
    { say: 'Welcome to Part two! Now we build a ChatGPT-style model. But like building a house, you don’t start digging without a plan. Four decisions first.', point: [300, 50], bubble: 'the blueprint 📐' },
    { say: 'One: what’s it for? A chat helper? A coding model? A medical model? That’s called choosing the domain.', point: [160, 125], bubble: 'the domain' },
    { say: 'Two: how big? Size means the number of parameters, all those weights. Small ones are cheap and fast. Big ones are smarter, but hungry.', point: [440, 125], bubble: 'size 📏' },
    { say: 'Three: what will it read? A coding model reads lots of code. A medical model reads medical text. You are what you read!', point: [160, 245], bubble: 'you are what you read' },
    { say: 'Four: the budget. Thousands of GPUs, running for weeks. Sometimes months.', point: [440, 245], bubble: '💸💸💸' },
    { say: 'Why so careful? One big training run can cost millions. Finding a mistake halfway through really hurts. So: plan first.', point: [300, 334], bubble: 'measure twice' },
  ],
  draw: (step) => <PlanDiagram step={step} />,
  details: <p>Teams run small <b>scaling-law</b> experiments first: train tiny models, see how loss falls with more parameters and data, then predict how a big model will do before paying for it. A popular rule of thumb (Chinchilla): about <b>20 tokens of text per parameter</b>.</p>,
});

/* ============ 2. Pre-training overview ============ */

function PretrainDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="slabel">Pre-training in one picture</text>
      <Box x={20} y={90} w={160} h={90} label="📚 huge text" sub="most of the internet" tone="paper" hot={step === 1} />
      {step >= 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Flow d="M182 135 L218 135" />
          <Box x={220} y={90} w={160} h={90} label="🙈 hide next word" sub="guess it, check it" tone="night" hot={step === 2} />
          <text x="300" y="222" textAnchor="middle" className="tcell-t">“The sun is very ___” → hot</text>
        </motion.g>
      )}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Flow d="M382 135 L418 135" />
          <Box x={420} y={90} w={160} h={90} label="🧱 base model" sub="knows language" tone="teal" hot={step === 3} />
        </motion.g>
      )}
      {step >= 3 && <text x="300" y="268" textAnchor="middle" className="cap">trillions of guesses · weeks on thousands of GPUs</text>}
      {step >= 4 && <text x="300" y="318" textAnchor="middle" className="ok">Self-supervised: the text is its own answer key.</text>}
      {step >= 5 && <text x="300" y="366" textAnchor="middle" className="big-rule">First stop on the road: the data.</text>}
    </g>
  );
}

const pretrainScene = scene({
  id: 'pl-pretrain', chapter: CH, stage: 'visualize', kicker: 'Pre-training overview', title: 'Pre-training: read everything, guess the next word.',
  cues: [
    { say: 'Here’s all of pre-training, in one picture. It starts with a mountain of text.', point: [100, 135], bubble: 'a mountain of text' },
    { say: 'The game is simple. Hide the next word, let the model guess, check, and learn from the mistake. The same learning loop from Part one.', point: [300, 216], bubble: 'guess the word 🙈' },
    { say: 'Do that trillions of times, and you get a base model. It knows grammar, facts and style. But it can’t chat yet.', point: [500, 135], bubble: 'base model 🧱' },
    { say: 'Remember self-supervised learning? Here it is! Nobody writes labels. The next word is the answer.', point: [300, 312], bubble: 'no labels needed' },
    { say: 'So where does all that text come from? And is it clean? That’s our next stop: the data.', point: [300, 360], bubble: 'next: data' },
  ],
  draw: (step) => <PretrainDiagram step={step} />,
  details: <p>After pre-training comes <b>post-training</b> (Part 3): teaching the base model to follow instructions and chat (SFT), then to prefer better answers (RLHF, DPO). Pre-training is by far the most expensive step.</p>,
});

/* ============ 3. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'pl-test', chapter: CH, title: 'Quick check: planning.',
  outro: 'Nice! The plan’s ready. Next, we go collect some data.',
  items: [
    { ask: 'Quick quiz! Why do teams plan so carefully before training?', q: 'Why plan carefully before training?', options: ['A big training run can cost millions', 'Planning makes the model smaller', 'There is no reason'], answer: 0,
      explain: 'Big runs cost millions and take months. Mistakes are expensive.' },
    { ask: 'Question two. In pre-training, what’s the model’s game?', q: 'In pre-training, the model learns by…', options: ['Chatting with users', 'Guessing the next word in huge amounts of text', 'Reading labels written by humans'], answer: 1,
      explain: 'Guess the next word, check, learn. Trillions of times.' },
    { ask: 'Last one. What comes out of pre-training?', q: 'What comes out of pre-training?', options: ['A finished chatbot', 'A base model that knows language but can’t chat yet', 'A database'], answer: 1,
      explain: 'A base model. Teaching it to chat comes later, in Part three.' },
  ],
});

export const planningScenes = [planScene, pretrainScene, quiz];
