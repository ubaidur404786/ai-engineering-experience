import { motion } from 'motion/react';
import { scene, Box, Flow } from '../scene/Scene';

/* ============ Welcome: meet the guide ============ */

const STAGES = ['Imagine', 'Watch', 'Play', 'Code', 'Test'];

function WelcomeDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="cap">every chapter follows the same path</text>
      {STAGES.map((s, i) => (
        <g key={s}>
          <Box x={20 + i * 116} y={70} w={96} h={60} label={s} tone={i === 2 ? 'teal' : 'paper'} hot={step === 1} />
          {i < 4 && <Flow d={`M${118 + i * 116} 100 L${134 + i * 116} 100`} count={1} dur={0.8} active={step >= 1} />}
        </g>
      ))}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <rect x="40" y="180" width="240" height="80" rx="12" className="sbox night" />
          <text x="60" y="212" className="slabel night" textAnchor="start">✓ Real execution</text>
          <text x="60" y="238" className="ssub night" textAnchor="start">computed live by the real algorithm</text>
          <rect x="320" y="180" width="240" height="80" rx="12" className="sbox brass" />
          <text x="340" y="212" className="slabel brass" textAnchor="start">~ Simulation</text>
          <text x="340" y="238" className="ssub brass" textAnchor="start">a simplified teaching model</text>
        </motion.g>
      )}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x="150" y="300" width="300" height="70" rx="12" className="lab-tile" />
          <text x="300" y="332" textAnchor="middle" className="slabel night">Open the laboratory ⤢</text>
          <text x="300" y="354" textAnchor="middle" className="ssub night">experiment, then return to the book</text>
        </motion.g>
      )}
    </g>
  );
}

export const welcomeScene = scene({
  id: 'welcome', chapter: 'welcome', kicker: 'Before we begin', title: 'Hi, I’m Zayd. I’ll be your guide.',
  cues: [
    { say: 'Hi, I’m Zayd, an AI engineer. I’ll walk you through this book. You won’t have to read much. I’ll show you how AI really works, and point at what matters.', point: [300, 40], bubble: 'less reading, more seeing' },
    { say: 'Every chapter follows the same path. We imagine a real situation, watch the data move, play with it yourself, see the Python code, and test what we learned.', point: [300, 100], bubble: 'imagine → watch → play → code → test' },
    { say: 'I’ll always be honest about what you see. Green means the numbers were computed live by the real algorithm. Gold means a simplified simulation.', point: [440, 220], bubble: 'no fake numbers' },
    { say: 'Whenever you see Open the laboratory, a page expands into a full experiment. Press Escape to come back. Ready? Turn the page.', point: [300, 335], bubble: 'try things, break things' },
  ],
  draw: (s) => <WelcomeDiagram step={s} />,
  details: <p>Use ← → keys, the Next button, or swipe on a phone. Turn the voice off for subtitles only. “Contents” lists every chapter, including those still being written.</p>,
});

/* ============ Two sides of AI engineering ============ */

const ROWS: [string, string][] = [
  ['Pre-train a model', 'Prompt engineering'],
  ['Optimize the loss', 'RAG on our documents'],
  ['Fine-tune & release', 'Fine-tune on our data'],
  ['Benchmark the model', 'Evaluate the whole app'],
];

function SidesDiagram({ step }: { step: number }) {
  return (
    <g>
      <motion.circle cx="140" cy="110" r="78" className="side-c builder" animate={{ opacity: step === 2 ? 0.35 : 1 }} />
      <text x="140" y="104" textAnchor="middle" className="side-t">Builder side</text>
      <text x="140" y="126" textAnchor="middle" className="ssub paper">data · models · training</text>
      <motion.circle cx="460" cy="110" r="78" className="side-c user" animate={{ opacity: step === 1 ? 0.35 : 1 }} />
      <text x="460" y="104" textAnchor="middle" className="side-t">User side</text>
      <text x="460" y="126" textAnchor="middle" className="ssub paper">apps · APIs · deployment</text>
      {step >= 3 && <Flow d="M220 110 L380 110" color="#c4974a" count={4} />}
      {step >= 3 && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: '300px', originY: '110px' }}>
          <circle cx="300" cy="110" r="34" className="ai-core" />
          <text x="300" y="106" textAnchor="middle" className="core-t">AI</text>
          <text x="300" y="122" textAnchor="middle" className="core-t sm">engineer</text>
        </motion.g>
      )}
      {step >= 4 && ROWS.map(([b, u], i) => (
        <motion.g key={b} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.25 }}>
          <rect x="40" y={220 + i * 46} width="220" height="36" rx="8" className="row-b" />
          <text x="150" y={243 + i * 46} textAnchor="middle" className="chip-t sm">{b}</text>
          <path d={`M264 ${238 + i * 46} L336 ${238 + i * 46}`} className="flow on" />
          <rect x="340" y={220 + i * 46} width="220" height="36" rx="8" className="row-u" />
          <text x="450" y={243 + i * 46} textAnchor="middle" className="chip-t sm">{u}</text>
        </motion.g>
      ))}
    </g>
  );
}

export const twoSidesScene = scene({
  id: 'two-sides', chapter: 'two-sides', stage: 'imagine', kicker: 'Part 0 · The big picture', title: 'One model, two sides.',
  cues: [
    { say: 'Here’s the one idea that holds this whole book together. Every AI product has two sides.', point: [300, 110], bubble: 'the mental model' },
    { say: 'The builder side is data science: collecting data, training models, optimizing them, and evaluating them.', point: [140, 110], bubble: 'how the model is made' },
    { say: 'The user side is software engineering: taking a model and building applications, APIs, backends, and deploying them.', point: [460, 110], bubble: 'how people use it' },
    { say: 'An AI engineer stands in the middle and connects both. You understand how the model works, and you can ship it to real users.', point: [300, 110], bubble: 'that’s you!' },
    { say: 'Each builder activity has a user-side twin. We’ll cross between the two sides again and again in this book.', point: [300, 300], bubble: 'same idea, two views' },
  ],
  draw: (s) => <SidesDiagram step={s} />,
  details: <p>Parts 1–3 and 9–10 live mostly on the builder side. Parts 4–8 and 11–12 live mostly on the user side.</p>,
});
