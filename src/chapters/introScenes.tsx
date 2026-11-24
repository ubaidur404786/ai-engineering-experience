import { motion } from 'motion/react';
import { scene, Box, Flow } from '../scene/Scene';
import { quizScene } from '../scene/quizScene';

/* =====================================================================
   INTRO + PART 0. Narrated by John (see src/scene/Teacher.tsx).
   Writing style for John: short spoken sentences, friendly, a little humor,
   one idea per cue. Facts must stay correct (see docs/ACCURACY_LOG.md).
   ===================================================================== */

/* ============ 0.1 Two sides of AI engineering ============ */

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
  id: 'two-sides', chapter: 'two-sides', stage: 'imagine', kicker: 'Part 0 · Enter the AI Engineering world', title: 'One model, two sides.',
  cues: [
    { say: 'Okay, here’s the one idea that holds this whole book together. Every AI product has two sides. Like a coin. A very expensive coin.', point: [300, 110], bubble: 'the big mental model' },
    { say: 'The builder side is data science: collecting data, training models, optimizing them, and testing them.', point: [140, 110], bubble: 'how the model is made' },
    { say: 'The user side is software engineering: taking a model and turning it into apps, APIs and backends that real people use.', point: [460, 110], bubble: 'how people use it' },
    { say: 'An AI engineer stands in the middle and connects both. You know how the model thinks, and you can ship it to users. Basically, you’re the translator.', point: [300, 110], bubble: 'that’s you! 🫵' },
    { say: 'And look: every builder activity has a user-side twin. We’ll jump between these two sides a lot. Don’t worry, I’ll carry the stick.', point: [300, 300], bubble: 'same idea, two views' },
  ],
  draw: (s) => <SidesDiagram step={s} />,
  details: <p>Parts 1–3 and 9–10 live mostly on the builder side. Parts 4–8 and 11–12 live mostly on the user side.</p>,
});

/* ============ 0.2 Who does what: the four roles ============ */

const ROLES = [
  { name: 'Data Scientist', does: 'analyses data, builds models, measures', x: 30, y: 60, tone: 'teal' as const },
  { name: 'ML Engineer', does: 'trains at scale, pipelines, serving', x: 320, y: 60, tone: 'teal' as const },
  { name: 'Software Engineer', does: 'apps, APIs, databases, CI/CD', x: 30, y: 230, tone: 'brass' as const },
  { name: 'AI Engineer', does: 'builds products on top of models', x: 320, y: 230, tone: 'night' as const },
];

function RolesDiagram({ step }: { step: number }) {
  return (
    <g>
      {ROLES.map((r, i) => (
        <motion.g key={r.name} animate={{ opacity: step === 0 || step - 1 === i || step === 5 ? 1 : 0.3 }}>
          <Box x={r.x} y={r.y} w={250} h={120} label={r.name} sub={r.does} tone={r.tone} hot={step - 1 === i} />
        </motion.g>
      ))}
      {step === 5 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Flow d="M155 182 L155 228" count={2} dur={1} />
          <Flow d="M445 182 L445 228" count={2} dur={1} />
          <Flow d="M282 290 L318 290" count={2} dur={1} color="#c4974a" />
        </motion.g>
      )}
    </g>
  );
}

const rolesScene = scene({
  id: 'roles', chapter: 'two-sides', stage: 'discover', kicker: 'Part 0 · Who does what', title: 'Four jobs, often confused.',
  cues: [
    { say: 'People mix up these four job titles all the time. Recruiters too. Let’s fix that in under a minute.', point: [300, 200], bubble: 'four roles' },
    { say: 'A data scientist explores data, builds models, and asks: is this actually working? Lots of notebooks. Lots of charts.', point: [155, 120], bubble: 'questions + models' },
    { say: 'An ML engineer makes training and serving work at scale: pipelines, GPUs, and keeping models alive in production.', point: [445, 120], bubble: 'models at scale' },
    { say: 'A software engineer builds the apps, APIs and databases. The stuff that users actually click on.', point: [155, 290], bubble: 'products people use' },
    { say: 'An AI engineer builds products on top of existing models: prompts, RAG, agents, evaluation, and deployment. Usually without training a giant model from scratch.', point: [445, 290], bubble: 'models → products' },
    { say: 'In real teams the lines are blurry, and that’s fine. The AI engineer borrows skills from all three. Like a Swiss army knife, but with more meetings.', point: [300, 290], bubble: 'skills overlap' },
  ],
  draw: (s) => <RolesDiagram step={s} />,
  details: <p>Titles vary between companies. The useful question is not “which title?” but “which side of the work: model-building or product-building?”</p>,
});

/* ============ 0.3 AI, ML, DL, GenAI ============ */

function NestDiagram({ step }: { step: number }) {
  const rings = [
    { r: 190, label: 'Artificial Intelligence', sub: 'machines doing “smart” tasks', cls: 'ring0' },
    { r: 140, label: 'Machine Learning', sub: 'learns rules from data', cls: 'ring1' },
    { r: 92, label: 'Deep Learning', sub: 'many-layer neural networks', cls: 'ring2' },
    { r: 46, label: 'GenAI', sub: '', cls: 'ring3' },
  ];
  return (
    <g>
      {rings.map((g, i) => (
        <motion.g key={g.label} initial={false} animate={{ opacity: step >= i ? 1 : 0.12, scale: step === i ? 1.02 : 1 }} style={{ originX: '300px', originY: '210px' }}>
          <circle cx="300" cy="210" r={g.r} className={`ring ${g.cls}`} />
          <text x="300" y={i === 3 ? 202 : 210 - g.r + 24} textAnchor="middle" className="ring-t">{g.label}</text>
          {g.sub && <text x="300" y={210 - g.r + 40} textAnchor="middle" className="ssub paper">{g.sub}</text>}
        </motion.g>
      ))}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x="300" y="222" textAnchor="middle" className="ssub night">creates text,</text>
          <text x="300" y="236" textAnchor="middle" className="ssub night">images, audio</text>
        </motion.g>
      )}
    </g>
  );
}

const nestScene = scene({
  id: 'what-is-ai', chapter: 'what-is-ai', stage: 'discover', kicker: 'Part 0 · The vocabulary', title: 'AI, ML, deep learning, GenAI.',
  cues: [
    { say: 'These four words get thrown around like confetti. But they fit inside each other, like Russian dolls. Watch.', point: [300, 30], bubble: 'four nested ideas' },
    { say: 'The biggest doll is artificial intelligence: any machine doing a task we’d call smart. Even a chess program written with hand-made rules counts.', point: [300, 42], bubble: 'even if-else rules count' },
    { say: 'Inside it is machine learning. Instead of writing the rules ourselves, we show the machine examples, and it learns the rules from data.', point: [300, 92], bubble: 'rules learned from data' },
    { say: 'Inside that is deep learning: machine learning with neural networks that have many layers. This is what made images, speech and language work so well.', point: [300, 140], bubble: 'many layers = deep' },
    { say: 'And in the middle, generative AI: deep learning models that create new things, like text, images or audio. ChatGPT lives right here. Cozy spot.', point: [300, 210], bubble: 'LLMs live here' },
  ],
  draw: (s) => <NestDiagram step={s} />,
  details: <p>Example: a spam filter with hand-written rules (“contains FREE MONEY”) is AI but not ML. A spam filter trained on 10,000 labelled emails is ML. An LLM is deep learning and generative AI.</p>,
});

/* ============ 0.4 Foundation models, LLMs and SLMs ============ */

// Parameter counts are the publicly stated model sizes.
const SIZES = [
  { name: 'GPT-2 XL (2019)', b: 1.5 },
  { name: 'Phi-3-mini', b: 3.8 },
  { name: 'Llama 3.1 8B', b: 8 },
  { name: 'Llama 3.1 70B', b: 70 },
  { name: 'Llama 3.1 405B', b: 405 },
];

function FoundationDiagram({ step }: { step: number }) {
  const tasks = ['chat', 'summarise', 'translate', 'write code', 'extract JSON'];
  return (
    <g>
      {step <= 1 && (
        <g>
          <Box x={210} y={40} w={180} h={70} label="Foundation model" sub="trained once, on huge data" tone="night" hot={step === 0} />
          {tasks.map((t, i) => (
            <g key={t}>
              {step >= 1 && <Flow d={`M300 112 L${70 + i * 115} 200`} count={1} dur={1.2} />}
              <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2 }}><Box x={20 + i * 115} y={204} w={100} h={44} label={t} tone="paper" /></motion.g>
            </g>
          ))}
          <text x="300" y="300" textAnchor="middle" className="cap">one model, many jobs, no separate model per task</text>
        </g>
      )}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x="20" y="34" className="cap">size in billions of parameters (log scale)</text>
          {SIZES.map((m, i) => {
            const w = 30 + (Math.log10(m.b) + 0.3) * 118; const slm = m.b < 10;
            return (
              <g key={m.name}>
                <text x="20" y={78 + i * 56} className="chip-t sm">{m.name}</text>
                <motion.rect x="170" y={62 + i * 56} height="26" rx="5" className={slm ? 'bar-slm' : 'bar-llm'} initial={{ width: 0 }} animate={{ width: w }} transition={{ delay: i * 0.15 }} />
                <text x={180 + w} y={80 + i * 56} className="chip-id">{m.b}B</text>
              </g>
            );
          })}
          {step >= 3 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x="160" y="50" width="420" height="160" rx="10" className="zone slm" />
            <text x="575" y="44" textAnchor="end" className="zone-t">SLMs: laptop / phone friendly</text>
          </motion.g>}
          {step >= 4 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x="160" y="214" width="420" height="106" rx="10" className="zone llm" />
            <text x="575" y="340" textAnchor="end" className="zone-t">LLMs: need serious GPUs</text>
          </motion.g>}
        </motion.g>
      )}
    </g>
  );
}

const foundationScene = scene({
  id: 'foundation', chapter: 'model-landscape', stage: 'discover', kicker: 'Part 0 · The models', title: 'Foundation models, LLMs and SLMs.',
  cues: [
    { say: 'Old-school AI: one model per task. One for translation, one for spam, one for sentiment. Exhausting. Then came foundation models.', point: [300, 75], bubble: 'train once, big' },
    { say: 'A foundation model is trained once on a huge amount of data, and then it can do many jobs: chat, summarise, translate, write code. One model, lots of hats.', point: [300, 226], bubble: 'one model, many tasks' },
    { say: 'Language foundation models come in sizes, measured in parameters: the learned numbers inside. Look at this range, from one and a half billion to four hundred and five billion.', point: [400, 300], bubble: 'parameters = learned numbers' },
    { say: 'Small language models, SLMs, have a few billion parameters. They can run on a laptop or even a phone. Cheap, fast, private.', point: [300, 130], bubble: 'small but mighty' },
    { say: 'Large language models, LLMs, have tens or hundreds of billions. Smarter on hard tasks, but they need serious GPUs. And a serious budget. My wallet just flinched.', point: [400, 270], bubble: 'big brain, big bill 💸' },
  ],
  draw: (s) => <FoundationDiagram step={s} />,
  details: <p>Sizes are the publicly stated parameter counts. “SLM” vs “LLM” has no official cut-off; roughly, models under ~10B parameters are usually called small. Bigger is not automatically better for your task: that’s what evaluation (Part 7) is for.</p>,
});

/* ============ 0.5 Open-weight vs closed ============ */

function OpenClosedDiagram({ step }: { step: number }) {
  return (
    <g>
      <motion.g animate={{ opacity: step === 2 ? 0.3 : 1 }}>
        <Box x={30} y={40} w={250} h={60} label="Open-weight" sub="Llama, Mistral, Qwen, Gemma" tone="teal" hot={step === 1} />
        {step >= 1 && <>
          <Flow d="M155 102 L155 160" count={2} dur={1} />
          <Box x={55} y={164} w={200} h={52} label="⬇ download the weights" tone="paper" />
          <Flow d="M155 218 L155 262" count={2} dur={1} />
          <Box x={55} y={266} w={200} h={52} label="💻 run on your machine" tone="paper" />
        </>}
      </motion.g>
      <motion.g animate={{ opacity: step === 1 ? 0.3 : 1 }}>
        <Box x={320} y={40} w={250} h={60} label="Closed" sub="GPT-4o, Claude, Gemini" tone="brass" hot={step === 2} />
        {step >= 2 && <>
          <Flow d="M445 102 L445 160" count={2} dur={1} color="#c4974a" />
          <Box x={345} y={164} w={200} h={52} label="🔑 API key" tone="paper" />
          <Flow d="M445 218 L445 262" count={2} dur={1} color="#c4974a" />
          <Box x={345} y={266} w={200} h={52} label="☁ runs on their servers" tone="paper" />
        </>}
      </motion.g>
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <text x="155" y="350" textAnchor="middle" className="ok">control · privacy · no per-call fee</text>
          <text x="445" y="350" textAnchor="middle" className="ok">easy · often strongest · no GPUs</text>
          <text x="155" y="374" textAnchor="middle" className="warn">you manage the hardware</text>
          <text x="445" y="374" textAnchor="middle" className="warn">pay per token · data leaves you</text>
        </motion.g>
      )}
    </g>
  );
}

const openClosedScene = scene({
  id: 'open-closed', chapter: 'model-landscape', stage: 'when', kicker: 'Part 0 · Getting a model', title: 'Open-weight or closed?',
  cues: [
    { say: 'So how do you actually get a model? Two ways. Think: buying a car versus calling a taxi.', point: [300, 70], bubble: 'own it or rent it' },
    { say: 'Open-weight models, like Llama, Mistral, Qwen or Gemma: you download the weights and run them on your own machine. You own the car.', point: [155, 240], bubble: 'download + run locally' },
    { say: 'Closed models, like GPT-4o, Claude or Gemini: the weights stay with the company. You send requests to their API with a key. You call the taxi.', point: [445, 240], bubble: 'API only' },
    { say: 'Open gives you control and privacy, but you handle the hardware. Closed is easy and often the strongest, but you pay per token and your data travels. Pick based on the job, not the hype.', point: [300, 360], bubble: 'trade-offs, not winners' },
  ],
  draw: (s) => <OpenClosedDiagram step={s} />,
  details: <p>“Open-weight” is more precise than “open source”: the weights are downloadable, but training data and code are often not released, and licences can restrict use. Always read the model licence.</p>,
});

/* ============ 0.6 From model to application ============ */

function AppDiagram({ step }: { step: number }) {
  const layers = [
    { label: '👤 User', sub: 'asks a question', y: 20 },
    { label: 'Frontend', sub: 'web or mobile UI', y: 90 },
    { label: 'Backend', sub: 'prompt, logic, safety', y: 160 },
    { label: 'LLM', sub: 'API or local model', y: 230 },
  ];
  return (
    <g>
      {layers.map((l, i) => (
        <motion.g key={l.label} animate={{ opacity: step >= Math.min(i, 2) ? 1 : 0.2 }}>
          <Box x={170} y={l.y} w={220} h={52} label={l.label} sub={l.sub} tone={i === 3 ? 'night' : i === 2 ? 'brass' : 'paper'} hot={(step === 1 && i === 2) || (step === 4 && i === 3)} />
          {i < 3 && step >= 1 && <Flow d={`M260 ${l.y + 54} L260 ${l.y + 68}`} count={1} dur={0.6} />}
          {i < 3 && step >= 4 && <Flow d={`M300 ${l.y + 68} L300 ${l.y + 54}`} count={1} dur={0.6} color="#c4974a" />}
        </motion.g>
      ))}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Box x={430} y={130} w={150} h={46} label="📚 Documents" sub="RAG (Part 5)" tone="teal" hot={step === 2} />
          <Flow d="M428 160 L392 180" count={1} dur={0.8} />
        </motion.g>
      )}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Box x={10} y={130} w={140} h={46} label="🛠 Tools" sub="SQL, APIs (Part 6)" tone="teal" hot={step === 3} />
          <Flow d="M152 160 L168 180" count={1} dur={0.8} />
        </motion.g>
      )}
      {step >= 5 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box x={120} y={310} w={360} h={44} label="📈 Evaluation + monitoring" sub="Parts 7–8" tone="paper" hot />
        </motion.g>
      )}
    </g>
  );
}

const appScene = scene({
  id: 'model-to-app', chapter: 'model-landscape', stage: 'visualize', kicker: 'Part 0 · Model → product', title: 'A model is not an app.',
  cues: [
    { say: 'Here’s a secret: a model alone is not a product. Nobody wants to talk to raw weights. Let’s build the layers around it.', point: [280, 46], bubble: 'start with the user' },
    { say: 'The user types into a frontend. The backend builds the prompt, adds rules and safety checks, and calls the model.', point: [280, 186], bubble: 'the brain of the app' },
    { say: 'Need answers from your own documents? The backend fetches the right pieces first. That’s called RAG, and it gets a whole part of this book.', point: [505, 153], bubble: 'your private knowledge' },
    { say: 'Need real actions, like checking a database or booking something? The model can call tools. That’s how agents work.', point: [80, 153], bubble: 'do things, not just talk' },
    { say: 'The model answers, and the response flows back up to the user. Usually streaming, word by word, like you see in ChatGPT.', point: [280, 256], bubble: 'answer flows back up' },
    { say: 'And finally, you measure everything: is it correct, is it fast, is it cheap? Skipping this is how apps embarrass you in production. Trust me.', point: [300, 332], bubble: 'measure everything' },
  ],
  draw: (s) => <AppDiagram step={s} />,
  details: <p>This is the “user side” from the two-sides model. Each box maps to a later part of the book: prompting (4), RAG (5), agents and tools (6), evaluation (7), monitoring (8), serving (11), security (12).</p>,
});

/* ============ 0.7 The AI engineering lifecycle ============ */

const LIFE = ['Define the problem', 'Pick a model', 'Build the app', 'Evaluate', 'Deploy', 'Monitor', 'Improve'];

function LifeDiagram({ step }: { step: number }) {
  const cx = 300, cy = 205, R = 150;
  const pos = (i: number) => { const a = -Math.PI / 2 + (i / LIFE.length) * Math.PI * 2; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; };
  const active = Math.min(LIFE.length - 1, Math.max(0, step * 2 - 1));
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} className="flow on" />
      {step >= 1 && <circle r="7" fill="#c4974a"><animateMotion dur="6s" repeatCount="indefinite" path={`M${cx} ${cy - R} a${R} ${R} 0 1 1 -0.1 0`} /></circle>}
      {LIFE.map((l, i) => {
        const [x, y] = pos(i);
        return (
          <motion.g key={l} animate={{ opacity: step === 0 || i <= active + 1 ? 1 : 0.35 }}>
            <rect x={x - 62} y={y - 20} width="124" height="40" rx="20" className={`life ${i === active && step > 0 ? 'hot' : ''}`} />
            <text x={x} y={y + 5} textAnchor="middle" className="chip-t sm">{l}</text>
          </motion.g>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" className="slabel">it never ends</text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="ssub paper">(in a good way)</text>
    </g>
  );
}

const lifeScene = scene({
  id: 'lifecycle', chapter: 'model-landscape', stage: 'behind', kicker: 'Part 0 · The big loop', title: 'The AI engineering lifecycle.',
  cues: [
    { say: 'Last stop for Part Zero: the lifecycle. Spoiler: it’s a circle, not a straight line.', point: [300, 205], bubble: 'a loop, not a line' },
    { say: 'It starts with a clear problem, not a cool model. Then you pick a model that fits: open or closed, big or small.', point: [420, 110], bubble: 'problem first!' },
    { say: 'You build the app around it, and then you evaluate it on real examples. If it fails, you fix it before users ever see it.', point: [430, 300], bubble: 'test before shipping' },
    { say: 'Then deploy, and monitor what real users do. Real users always find the one question you never tested. Always.', point: [200, 330], bubble: 'users = chaos' },
    { say: 'Every failure becomes a lesson, and you improve and go around again. That loop is the job. And boom, Part Zero done! Now that you know these ideas, next page is a quick test. Four questions. Take it, or skip it. I won’t tell anyone.', point: [170, 120], bubble: 'improve → repeat' },
  ],
  draw: (s) => <LifeDiagram step={s} />,
  details: <p>Notice the order: the problem and the evaluation plan come before any model work. Parts 7 and 8 of this book are entirely about the evaluate → monitor → improve half of this loop.</p>,
});

/* ============ Part 0 check ============ */

const part0Quiz = quizScene({
  id: 'part0-test', chapter: 'model-landscape', title: 'Part 0: quick check.',
  outro: 'Part Zero, done and tested! Turn the page, and I’ll show you what’s coming next.',
  items: [
    { ask: 'Quiz time, and I’m hosting! Four questions. Not in the mood? Just turn the page. First: a spam filter uses hand written rules, like contains free money. What is it?', q: 'A spam filter uses hand-written rules like “contains FREE MONEY”. What is it?', options: ['Deep learning', 'AI, but not machine learning', 'Generative AI'], answer: 1,
      explain: 'Rules written by a person still count as AI, but nothing was learned from data, so it isn’t machine learning.' },
    { ask: 'Question two. Your company can’t send customer data outside its own servers. Which model type fits best?', q: 'Customer data can’t leave your servers. Which model type fits best?', options: ['A closed model via API', 'An open-weight model you host yourself', 'It doesn’t matter'], answer: 1,
      explain: 'With open weights, the model runs on your own hardware, so the data never leaves the building.' },
    { ask: 'Question three. What does an AI engineer mostly do?', q: 'What does an AI engineer mostly do?', options: ['Train giant models from scratch', 'Build products on top of existing models, and evaluate them', 'Only design user interfaces'], answer: 1,
      explain: 'AI engineers connect both sides: they understand models, and they turn them into working, measured products.' },
    { ask: 'Last one. Where does the lifecycle start?', q: 'Where does the lifecycle start?', options: ['Choosing the biggest model', 'Defining the problem and how success is measured', 'Deploying quickly'], answer: 1,
      explain: 'Problem first, then the model. Otherwise you have a solution looking for a problem.' },
  ],
});

/* ============ What's next ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['Two sides of AI engineering', 'Four roles', 'AI ⊃ ML ⊃ DL ⊃ GenAI', 'LLMs vs SLMs', 'Open vs closed', 'Model → app', 'The lifecycle'];
  return (
    <g>
      <text x="40" y="44" className="slabel">✓ Part 0: what you now know</text>
      {done.map((d, i) => (
        <motion.g key={d} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <text x="52" y={78 + i * 28} className="ok">✓ {d}</text>
        </motion.g>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M290 180 L350 180" count={3} dur={1} color="#c4974a" />
          <Box x={355} y={120} w={220} h={120} label="Up next: Part 1 · Data" sub="what a model learns from" tone="night" hot />
        </motion.g>
      )}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x="465" y="278" textAnchor="middle" className="ssub paper">tables, cleaning, train / test</text>
          <text x="465" y="296" textAnchor="middle" className="ssub paper">and real Python, with me</text>
        </motion.g>
      )}
    </g>
  );
}

const part0Next = scene({
  id: 'part0-next', chapter: 'model-landscape', kicker: 'Part 0 · Done!', title: 'What’s next?',
  cues: [
    { say: 'Look at that list. Seven big ideas, and you didn’t fall asleep once. I’m proud of us.', point: [150, 160], bubble: 'Part 0 ✓' },
    { say: 'Next up: Part 1, the foundations. And we start with data, the stuff every model learns from. Spoiler: it’s messier than you think.', point: [465, 180], bubble: 'Part 1 →' },
    { say: 'We’ll clean a real table and split it in real Python, and I’ll stand next to the code the whole time. Ready? Check the next page, bro!', point: [465, 285], bubble: 'next page →' },
  ],
  draw: (s) => <NextDiagram step={s} />,
  details: <p>Part 1 covers data, the ways a machine learns, the neuron, how networks learn, and over- and underfitting. Data is ready now; the rest is being written.</p>,
});

export const part0 = [twoSidesScene, rolesScene, nestScene, foundationScene, openClosedScene, appScene, lifeScene, part0Quiz, part0Next];
