import { motion } from 'motion/react';
import { scene, Box, Flow } from '../scene/Scene';

/* =====================================================================
   WELCOME (first impression). Three narrated scenes:
   1. Meet John: you are not alone, how the two pages work, stop me anytime.
   2. Why this book is not boring.
   3. What you will be able to do at the end (the skill journey).
   ===================================================================== */

/* ============ 1. Meet John ============ */

function MeetDiagram({ step }: { step: number }) {
  return (
    <g>
      {step <= 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x="300" y="110" textAnchor="middle" className="hello">Hi, I’m John 👋</text>
          <text x="300" y="150" textAnchor="middle" className="cap">your guide for this whole book</text>
          {step === 1 && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ originX: '300px', originY: '240px' }}>
              <circle cx="240" cy="240" r="38" className="sbox teal" />
              <text x="240" y="248" textAnchor="middle" className="slabel">you</text>
              <circle cx="360" cy="240" r="38" className="sbox brass" />
              <text x="360" y="248" textAnchor="middle" className="slabel">me</text>
              <Flow d="M280 240 L320 240" count={2} dur={0.9} />
              <text x="300" y="320" textAnchor="middle" className="cap">a team. nobody gets lost.</text>
            </motion.g>
          )}
        </motion.g>
      )}
      {step >= 2 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <path d="M60 50 Q180 30 296 56 L296 310 Q180 284 60 304 Z" className={`mini-page ${step === 2 ? 'hot' : ''}`} />
          <path d="M304 56 Q420 30 540 50 L540 304 Q420 284 304 310 Z" className={`mini-page ${step === 3 ? 'hot' : ''}`} />
          <text x="178" y="90" textAnchor="middle" className="slabel">Left page</text>
          <text x="178" y="112" textAnchor="middle" className="ssub paper">my words, as text</text>
          {[140, 162, 184, 206].map((y) => <rect key={y} x="90" y={y} width={y === 206 ? 120 : 176} height="9" rx="4" className="txt-line" />)}
          <text x="422" y="90" textAnchor="middle" className="slabel">Right page</text>
          <text x="422" y="112" textAnchor="middle" className="ssub paper">my stage + my stick</text>
          <rect x="350" y="140" width="60" height="40" rx="6" className="sbox teal" />
          <rect x="440" y="210" width="60" height="40" rx="6" className="sbox brass" />
          <Flow d="M410 160 C440 160 470 180 470 206" active={step >= 3} />
        </motion.g>
      )}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x="70" y="336" width="460" height="62" rx="12" className="sbox night" />
          <text x="300" y="362" textAnchor="middle" className="slabel night">❚❚ stop me anytime · ⏭ skip · 🔇 mute</text>
          <text x="300" y="384" textAnchor="middle" className="ssub night">swipe or press → for the next page</text>
        </motion.g>
      )}
    </g>
  );
}

const meetScene = scene({
  id: 'welcome', chapter: 'welcome', kicker: 'Before we begin', title: 'Meet John, your guide.',
  cues: [
    { say: 'Hey there! I’m John, and I’ll guide you through every single page of this book. Every diagram, every weird word, every line of code. I’ve got you.', point: [300, 110], bubble: 'hello! 👋' },
    { say: 'So you are not alone here. No giant wall of text, no “figure it out yourself”. If something is confusing, that’s on me, not you. I’ll take the blame. I’m used to it.', point: [300, 240], bubble: 'you + me = team' },
    { say: 'Here’s how a page works. The left page is mine: everything I say shows up there as text, like subtitles in a movie.', point: [178, 170], bubble: 'my words live here' },
    { say: 'The right page is my stage. Things move, data flows, and I walk around pointing with this stick. Very professional. Very scientific.', point: [470, 230], bubble: 'my office 😎' },
    { say: 'I start talking as soon as a page opens. And you can stop me anytime: pause, skip, or mute me. I won’t be offended. Much. Now check the next page, bro. Let me show you why this book is different.', point: [300, 362], bubble: 'you’re the boss' },
  ],
  draw: (s) => <MeetDiagram step={s} />,
  details: <p>Green labels mean <b>real execution</b> (numbers computed live in your browser). Gold labels mean <b>simulation</b> (simplified, and we always say how). Use the ← → keys, or swipe on a phone. On a phone, “Hide text” shows only the animation with subtitles.</p>,
});

/* ============ 2. Why this book is not boring ============ */

const WAYS = [
  { icon: '🎬', label: 'Watch it move', sub: 'I explain, things animate' },
  { icon: '🧪', label: 'Play with it', sub: 'labs right inside the page' },
  { icon: '🐍', label: 'Real Python', sub: 'real code, real output' },
  { icon: '✅', label: 'Quick test', sub: 'check yourself, or skip' },
];

function DifferentDiagram({ step }: { step: number }) {
  return (
    <g>
      {/* the boring book */}
      <motion.g animate={{ opacity: step === 0 ? 1 : 0.45 }}>
        <rect x="30" y="40" width="230" height="300" rx="8" className="mini-page" />
        <text x="145" y="72" textAnchor="middle" className="slabel">A normal tech book</text>
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x="52" y={92 + i * 17} width={i % 4 === 3 ? 120 : 186} height="7" rx="3" className="txt-line" />)}
        <motion.text x="232" y="110" className="slabel" animate={{ y: [110, 96, 110], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.2, repeat: Infinity }}>z z z</motion.text>
        <text x="145" y="372" textAnchor="middle" className="warn">page 10: the book is now a pillow</text>
      </motion.g>
      {/* this book */}
      {WAYS.map((w, i) => step >= Math.min(i + 1, 3) && (
        <motion.g key={w.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i >= 2 && step === 3 ? (i - 2) * 0.3 : 0 }}>
          <Box x={320} y={40 + i * 76} w={250} h={62} label={`${w.icon} ${w.label}`} sub={w.sub} tone={i === 0 ? 'teal' : i === 1 ? 'brass' : 'paper'} hot={step === i + 1 || (step === 3 && i === 3)} />
          {i < 3 && <Flow d={`M445 ${104 + i * 76} L445 ${114 + i * 76}`} count={1} dur={0.6} />}
        </motion.g>
      ))}
      {step >= 4 && (
        <motion.g initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ originX: '300px', originY: '390px' }}>
          <rect x="150" y="364" width="300" height="48" rx="24" className="sbox night" />
          <text x="300" y="394" textAnchor="middle" className="slabel night">📖 a book that explains itself</text>
        </motion.g>
      )}
    </g>
  );
}

const differentScene = scene({
  id: 'why-different', chapter: 'welcome', stage: 'imagine', kicker: 'Before we begin · Why this book', title: 'Not another boring book.',
  cues: [
    { say: 'Let’s be honest. Most tech books look like this. Page one: a wall of text. Page two: a bigger wall. By page ten you’re asleep, and the book is now a very expensive pillow.', point: [145, 200], bubble: 'zzz 😴' },
    { say: 'Here, it’s the opposite. You watch, I explain, and things actually move. Data flows, numbers change, and I point at exactly the part that matters.', point: [445, 71], bubble: 'watch + listen' },
    { say: 'Then you get your hands dirty. Big ideas come with a lab where you play with them yourself. Like a real tokenizer, running right inside the page.', point: [445, 147], bubble: 'hands-on labs 🧪' },
    { say: 'Then real Python code with real output. No made-up numbers. When something is a simplified simulation, I label it. Promise. Then a quick test, which you can skip if you’re feeling brave.', point: [445, 260], bubble: 'real code, real output' },
    { say: 'As far as I know, this is the first book where the teacher lives inside the pages and explains things with a stick. If you find another one, don’t tell me. I’ll get jealous. Next page: what you’ll be able to do at the end.', point: [300, 388], bubble: 'one of a kind 😎' },
  ],
  draw: (s) => <DifferentDiagram step={s} />,
  details: <p>Every chapter follows the same rhythm: a story to imagine the problem, an animated explanation, an interactive lab, real Python with real output, a short test, and references for going deeper.</p>,
});

/* ============ 3. What you will be able to do ============ */

const JOURNEY = [
  { label: 'You, today', sub: 'curious, maybe confused', x: 70, y: 340 },
  { label: 'Inside the model', sub: 'tokens · embeddings · transformers', x: 200, y: 260 },
  { label: 'Talk to models', sub: 'prompts · structured output', x: 360, y: 300 },
  { label: 'RAG + agents', sub: 'your documents · tools', x: 500, y: 220 },
  { label: 'Ship it', sub: 'evaluate · serve · secure · monitor', x: 340, y: 130 },
  { label: 'AI Engineer 🏆', sub: 'build, measure, ship', x: 150, y: 60 },
];

function JourneyDiagram({ step }: { step: number }) {
  const path = JOURNEY.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const reached = Math.min(JOURNEY.length - 1, step);
  return (
    <g>
      <path d={path} className="flow on" />
      {JOURNEY.map((p, i) => (
        <motion.g key={p.label} animate={{ opacity: i <= reached ? 1 : 0.25 }}>
          <circle cx={p.x} cy={p.y} r={i === reached ? 13 : 9} className={i <= reached ? 'sbox brass' : 'sbox paper'} />
          <text x={p.x} y={p.y - 22} textAnchor="middle" className="chip-t sm">{p.label}</text>
          <text x={p.x} y={p.y + 30} textAnchor="middle" className="ssub paper">{p.sub}</text>
        </motion.g>
      ))}
      {/* the traveller walks along the road */}
      <motion.circle r="6" fill="#2f7f88" cx={JOURNEY[reached].x} cy={JOURNEY[reached].y} initial={false} animate={{ cx: JOURNEY[reached].x, cy: JOURNEY[reached].y }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
      {/* experience bar */}
      <text x="40" y="398" className="cap">skill</text>
      <rect x="80" y="388" width="480" height="12" rx="6" className="txt-line" />
      <motion.rect x="80" y="388" width="0" height="12" rx="6" fill="#c4974a" animate={{ width: (480 * (reached + 1)) / JOURNEY.length }} transition={{ duration: 0.9 }} />
    </g>
  );
}

const journeyScene = scene({
  id: 'what-you-gain', chapter: 'welcome', stage: 'imagine', kicker: 'Before we begin · Your journey', title: 'Where this book takes you.',
  cues: [
    { say: 'So what do you actually get out of this? Here’s the road. You start right here: curious, maybe a little confused. Perfect. That’s the best place to start.', point: [70, 340], bubble: 'level 1 👶' },
    { say: 'First, we open up the model. How it reads text as tokens, turns words into numbers, and why transformers changed everything. No magic, just clever math.', point: [200, 260], bubble: 'how LLMs work' },
    { say: 'Then you learn to talk to models properly: prompts that work, and answers in clean formats your code can use. Not just “please be smart”.', point: [360, 300], bubble: 'prompting, done right' },
    { say: 'Then the fun stuff. RAG, so a model can answer from your own documents, and agents that use tools to actually do things.', point: [500, 220], bubble: 'apps people want' },
    { say: 'Then the part most tutorials skip: testing it, serving it fast and cheap, keeping it secure, and watching it in production. This is what makes you hireable.', point: [340, 130], bubble: 'the pro part 💼' },
    { say: 'And at the end, you’re an AI engineer: you can build, measure, and ship real AI products. With projects to prove it. Okay, enough hype. Next page, bro, let’s start the real thing.', point: [150, 60], bubble: 'final boss: you 🏆' },
  ],
  draw: (s) => <JourneyDiagram step={s} />,
  details: <p>The road follows the table of contents: Parts 1–3 (how models are built), 4 (applications), 5–6 (RAG and agents), 7–12 (evaluation, LLMOps, inference, quantization, serving, production), 13 (multimodal), and 14 (projects). Open ☰ Contents to see every chapter.</p>,
});

export const welcomeScenes = [meetScene, differentScene, journeyScene];
