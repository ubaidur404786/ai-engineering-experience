import { motion } from 'motion/react';
import { scene, Box, Flow } from '../scene/Scene';
import { FxDefs, FloatingIcons, Twinkles, Burst, Pop, Halo, SpringText, Shine, smoothSegments } from '../scene/fx';

/* =====================================================================
   WELCOME (first impression). Three narrated scenes:
   1. Meet John: you are not alone, how the two pages work, stop me anytime.
   2. Why this book is not boring.
   3. What you will be able to do at the end (the skill journey).
   These pages decide whether a reader stays, so they get the full
   motion treatment: floating icons, bursts, springy reveals, drawn paths.
   ===================================================================== */

/* ---------- little animated SVG icons ---------- */

/** Film clapper whose top bar claps. */
function ClapIcon() {
  return (
    <g>
      <rect x="-14" y="-4" width="28" height="18" rx="3" fill="#1a2430" />
      <motion.g style={{ originX: '-14px', originY: '-4px' }} animate={{ rotate: [0, -28, 0, 0] }} transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.2, 0.35, 1] }}>
        <rect x="-14" y="-11" width="28" height="7" rx="2" fill="#c4974a" />
        {[-8, 0, 8].map((x) => <path key={x} d={`M${x} -11 L${x + 4} -4`} stroke="#1a2430" strokeWidth="2.5" />)}
      </motion.g>
      <motion.path d="M-4 1 L5 5 L-4 9 Z" fill="#e2bd7a" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
    </g>
  );
}

/** Flask with rising bubbles. */
function FlaskIcon() {
  return (
    <g>
      <path d="M-5 -14 L-5 -4 L-13 11 Q-14 14 -10 14 L10 14 Q14 14 13 11 L5 -4 L5 -14 Z" fill="#fffaf0" stroke="#2f7f88" strokeWidth="2" />
      <path d="M-9 5 L9 5 L12 11 Q13 13 10 13 L-10 13 Q-13 13 -12 11 Z" fill="#7cc4cb" />
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={-3 + i * 3} r={1.6 + i * 0.4} fill="#2f7f88" initial={{ cy: 10, opacity: 0 }} animate={{ cy: [10, -18], opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }} />
      ))}
    </g>
  );
}

/** Terminal with code being typed. */
function CodeIcon() {
  return (
    <g>
      <rect x="-15" y="-12" width="30" height="24" rx="4" fill="#1a2430" />
      <text x="-11" y="-2" fontSize="8" fill="#e2bd7a" fontFamily="monospace">&gt;_</text>
      {[0, 1].map((i) => (
        <motion.rect key={i} x="-11" y={2 + i * 5} height="2.5" rx="1" fill={i ? '#7cc4cb' : '#8fb39a'} animate={{ width: [0, 20 - i * 6, 20 - i * 6, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4, times: [0, 0.4, 0.85, 1] }} />
      ))}
    </g>
  );
}

/** Check mark that draws itself. */
function CheckIcon() {
  return (
    <g>
      <circle r="13" fill="#c6e3bf" stroke="#3c7a4a" strokeWidth="2" />
      <motion.path d="M-6 0 L-1.5 5 L7 -5" fill="none" stroke="#3c7a4a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 2, repeat: Infinity, times: [0, 0.35, 0.85, 1] }} />
    </g>
  );
}

/* ============ 1. Meet John ============ */

function MeetDiagram({ step }: { step: number }) {
  return (
    <g>
      <FxDefs />
      <Twinkles n={18} seed={2} />
      {step <= 1 && (
        <motion.g key="hello" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FloatingIcons icons={['🧠', '🤖', '⚡', '📚', '✨', '💡', '🚀', '🔮']} seed={4} avoid={[120, 60, 480, 360]} />
          <Halo x={300} y={98} r={140} />
          <SpringText x={290} y={112} text="Hi, I’m John" className="hello" stagger={0.06} />
          {/* waving hand */}
          <g transform="translate(450 98)">
            <motion.g style={{ originX: '0px', originY: '14px' }} animate={{ rotate: [0, 22, -8, 22, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.8 }}>
              <text textAnchor="middle" dominantBaseline="central" fontSize="40">👋</text>
            </motion.g>
          </g>
          <motion.text x="300" y="152" textAnchor="middle" className="cap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>your guide for this whole book</motion.text>
          {step === 0 && <Burst x={300} y={98} k="hi" n={18} spread={130} />}
          {step === 1 && (
            <g>
              {/* you + me orbiting a shared core */}
              <motion.circle cx="300" cy="248" r="70" fill="none" stroke="#c4974a" strokeOpacity=".35" strokeDasharray="4 6" animate={{ rotate: 360 }} style={{ originX: '300px', originY: '248px' }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
              <Pop x={232} y={248}>
                <Halo x={0} y={0} r={52} teal />
                <motion.circle r="36" fill="url(#fx-teal)" filter="url(#fx-soft)" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                <text y="-4" textAnchor="middle" fontSize="20">🧑‍💻</text>
                <text y="18" textAnchor="middle" className="slabel night">you</text>
              </Pop>
              <Pop x={368} y={248} delay={0.25}>
                <Halo x={0} y={0} r={52} />
                <motion.circle r="36" fill="url(#fx-brass)" filter="url(#fx-soft)" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }} />
                <text y="-4" textAnchor="middle" fontSize="20">🎓</text>
                <text y="18" textAnchor="middle" className="slabel">me</text>
              </Pop>
              <Flow d="M270 248 L330 248" count={3} dur={0.9} color="#c4974a" />
              <Pop x={300} y={248} delay={0.6}>
                <motion.text textAnchor="middle" dominantBaseline="central" fontSize="22" animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>❤️</motion.text>
              </Pop>
              <motion.text x="300" y="342" textAnchor="middle" className="cap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>a team. nobody gets lost. 🤝</motion.text>
              <Burst x={300} y={248} k="team" n={16} spread={110} icons={['✨', '⭐', '💫']} />
            </g>
          )}
        </motion.g>
      )}
      {step >= 2 && (
        <motion.g key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* the book opens from its spine */}
          <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: '300px', originY: '180px' }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
            <path d="M60 50 Q180 30 296 56 L296 310 Q180 284 60 304 Z" className={`mini-page ${step === 2 ? 'hot' : ''}`} filter="url(#fx-soft)" />
            <path d="M304 56 Q420 30 540 50 L540 304 Q420 284 304 310 Z" className={`mini-page ${step === 3 ? 'hot' : ''}`} filter="url(#fx-soft)" />
          </motion.g>
          <text x="178" y="90" textAnchor="middle" className="slabel">📝 Left page</text>
          <text x="178" y="112" textAnchor="middle" className="ssub paper">my words, as text</text>
          {/* subtitles "typing" in */}
          {[140, 162, 184, 206, 228].map((y, i) => (
            <motion.rect key={y} x="90" y={y} height="9" rx="4" className="txt-line" fill={step === 2 ? '#b9d7d9' : undefined}
              initial={{ width: 0 }} animate={{ width: [0, i === 4 ? 100 : 176] }} transition={{ delay: 0.4 + i * 0.25, duration: 0.5 }} />
          ))}
          {step === 2 && <motion.rect x="90" y="246" width="3" height="14" fill="#2f7f88" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />}
          <text x="422" y="90" textAnchor="middle" className="slabel">🎭 Right page</text>
          <text x="422" y="112" textAnchor="middle" className="ssub paper">my stage + my stick</text>
          {/* a tiny live diagram */}
          <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <rect x="350" y="140" width="60" height="40" rx="8" fill="url(#fx-teal)" />
            <text x="380" y="166" textAnchor="middle" fontSize="18">🧠</text>
          </motion.g>
          <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
            <rect x="440" y="210" width="60" height="40" rx="8" fill="url(#fx-brass)" />
            <text x="470" y="236" textAnchor="middle" fontSize="18">💬</text>
          </motion.g>
          <Flow d="M410 160 C440 160 470 180 470 206" active={step >= 3} color="#c4974a" />
          {step === 3 && (
            <>
              <motion.g initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ delay: 0.3 }}>
                <text x="372" y="272" textAnchor="middle" fontSize="22">🪄</text>
              </motion.g>
              <Burst x={470} y={230} k="stage" n={12} spread={70} icons={['✨', '⭐']} />
            </>
          )}
        </motion.g>
      )}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
          <rect x="70" y="330" width="460" height="72" rx="16" fill="url(#fx-night)" stroke="#c4974a" strokeOpacity=".6" filter="url(#fx-soft)" />
          <Shine x={70} y={330} w={460} h={72} rx={16} />
          {[{ x: 150, i: '⏸️', t: 'pause' }, { x: 250, i: '⏭️', t: 'skip' }, { x: 350, i: '🔇', t: 'mute' }, { x: 450, i: '👉', t: 'next page' }].map((b, k) => (
            <g key={b.t} transform={`translate(${b.x} 356)`}>
              <motion.g animate={{ scale: [1, 1.3, 1], y: [0, -4, 0] }} transition={{ duration: 0.6, delay: 0.4 + k * 0.35, repeat: Infinity, repeatDelay: 1.6 }}>
                <text textAnchor="middle" dominantBaseline="central" fontSize="22">{b.i}</text>
              </motion.g>
              <text y="32" textAnchor="middle" className="ssub night">{b.t}</text>
            </g>
          ))}
          <Halo x={300} y={366} r={40} />
        </motion.g>
      )}
    </g>
  );
}

/* ============ 2. Why this book is not boring ============ */

const WAYS = [
  { icon: <ClapIcon />, label: 'Watch it move', sub: 'I explain, things animate', tone: 'teal' as const },
  { icon: <FlaskIcon />, label: 'Play with it', sub: 'labs right inside the page', tone: 'brass' as const },
  { icon: <CodeIcon />, label: 'Real Python', sub: 'real code, real output', tone: 'paper' as const },
  { icon: <CheckIcon />, label: 'Quick test', sub: 'check yourself, or skip', tone: 'paper' as const },
];

function DifferentDiagram({ step }: { step: number }) {
  return (
    <g>
      <FxDefs />
      <Twinkles n={14} seed={7} color="#2f7f88" />
      {/* the boring book: dozes off, then shrinks away into a pillow */}
      <motion.g animate={step === 0 ? { opacity: 1, scale: 1, rotate: [0, -3, 0, 3, 0] } : { opacity: 0.4, scale: 0.86, rotate: -6 }}
        transition={step === 0 ? { rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' } } : { duration: 0.8 }} style={{ originX: '145px', originY: '190px' }}>
        <rect x="30" y="40" width="230" height="300" rx="8" className="mini-page" filter="url(#fx-soft)" />
        <text x="145" y="72" textAnchor="middle" className="slabel">📕 A normal tech book</text>
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x="52" y={92 + i * 17} width={i % 4 === 3 ? 120 : 186} height="7" rx="3" className="txt-line" />)}
        {/* melting text lines */}
        <motion.rect x="52" y="314" height="7" rx="3" className="txt-line" animate={{ width: [186, 60, 186] }} transition={{ duration: 3, repeat: Infinity }} />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.text key={i} x={220 + i * 12} y={110} fontSize={14 + i * 5} className="slabel" fill="#8a8577"
          animate={{ y: [0, -40], x: [0, 18], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8 }}>Z</motion.text>
      ))}
      {step === 0 && <Pop x={145} y={200}><motion.text textAnchor="middle" dominantBaseline="central" fontSize="54" animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 2.5, repeat: Infinity }}>😴</motion.text></Pop>}
      {step >= 1 && <Pop x={145} y={200}><text textAnchor="middle" dominantBaseline="central" fontSize="44">🛏️</text></Pop>}
      <motion.text x="145" y="372" textAnchor="middle" className="warn" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>page 10: the book is now a pillow</motion.text>

      {/* this book: four living cards */}
      {WAYS.map((w, i) => step >= Math.min(i + 1, 3) && (
        <motion.g key={w.label} initial={{ opacity: 0, x: 60, rotate: 6 }} animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 14, delay: i >= 2 && step === 3 ? (i - 2) * 0.35 : 0 }}>
          <Box x={320} y={40 + i * 76} w={250} h={62} label={w.label} sub={w.sub} tone={w.tone} hot={step === i + 1 || (step === 3 && i === 3)} />
          <g transform={`translate(${352} ${71 + i * 76})`}>{w.icon}</g>
          {(step === i + 1 || (step === 3 && i === 3)) && <Shine x={320} y={40 + i * 76} w={250} h={62} rx={10} />}
          {i < 3 && <Flow d={`M445 ${104 + i * 76} L445 ${114 + i * 76}`} count={1} dur={0.6} />}
        </motion.g>
      ))}
      {step >= 1 && step < 4 && <Burst x={445} y={71 + (step === 3 ? 228 : (step - 1) * 76)} k={`card${step}`} n={10} spread={60} />}

      {step >= 4 && (
        <g>
          <motion.g initial={{ scale: 0.4, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} style={{ originX: '300px', originY: '388px' }}>
            <rect x="140" y="362" width="320" height="52" rx="26" fill="url(#fx-night)" stroke="#e2bd7a" strokeWidth="1.5" filter="url(#fx-glow)" />
            <Shine x={140} y={362} w={320} h={52} rx={26} />
            <text x="300" y="394" textAnchor="middle" className="slabel night">📖 a book that explains itself</text>
          </motion.g>
          <Burst x={300} y={388} k="badge" n={22} spread={150} />
          <Burst x={300} y={388} k="badge2" n={8} spread={110} icons={['🎉', '✨', '🏅']} />
        </g>
      )}
    </g>
  );
}

/* ============ 3. What you will be able to do ============ */

const JOURNEY = [
  { label: 'You, today', sub: 'curious, maybe confused', icon: '🌱', x: 70, y: 340 },
  { label: 'Inside the model', sub: 'tokens · embeddings · transformers', icon: '🧠', x: 200, y: 260 },
  { label: 'Talk to models', sub: 'prompts · structured output', icon: '💬', x: 360, y: 300 },
  { label: 'RAG + agents', sub: 'your documents · tools', icon: '🤖', x: 500, y: 220 },
  { label: 'Ship it', sub: 'evaluate · serve · secure · monitor', icon: '🚀', x: 340, y: 130 },
  { label: 'AI Engineer 🏆', sub: 'build, measure, ship', icon: '🏆', x: 150, y: 60 },
];
const ROAD = smoothSegments(JOURNEY);

function JourneyDiagram({ step }: { step: number }) {
  const reached = Math.min(JOURNEY.length - 1, step);
  const here = JOURNEY[reached];
  const done = reached === JOURNEY.length - 1;
  return (
    <g>
      <FxDefs />
      <Twinkles n={26} seed={11} />
      <FloatingIcons icons={['📈', '🧩', '⚙️', '🔍', '📦']} seed={21} opacity={0.3} size={20} avoid={[40, 40, 560, 380]} />
      {/* the road: faint all the way, then drawn in gold as you travel */}
      {ROAD.map((d, i) => <path key={`b${i}`} d={d} fill="none" stroke="#e2d8c3" strokeWidth="10" strokeLinecap="round" />)}
      {ROAD.map((d, i) => <path key={`f${i}`} d={d} className="flow" />)}
      {ROAD.map((d, i) => i < reached && (
        <motion.path key={`g${i}`} d={d} fill="none" stroke="url(#fx-brass)" strokeWidth="6" strokeLinecap="round" filter="url(#fx-glow)"
          initial={{ pathLength: i === reached - 1 ? 0 : 1 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
      ))}
      {JOURNEY.map((p, i) => {
        const on = i <= reached, cur = i === reached;
        return (
          <motion.g key={p.label} animate={{ opacity: on ? 1 : 0.35 }}>
            {cur && <Halo x={p.x} y={p.y} r={44} />}
            <g transform={`translate(${p.x} ${p.y})`}>
              <motion.g animate={{ scale: cur ? [1, 1.12, 1] : 1 }} transition={{ duration: 1.4, repeat: cur ? Infinity : 0 }}>
                <circle r={cur ? 19 : 15} fill={on ? 'url(#fx-brass)' : '#fffaf0'} stroke={on ? '#c4974a' : '#d9ccb0'} strokeWidth="2" filter="url(#fx-soft)" />
                <text textAnchor="middle" dominantBaseline="central" fontSize={cur ? 18 : 14} opacity={on ? 1 : 0.5}>{p.icon}</text>
              </motion.g>
            </g>
            <text x={p.x} y={p.y - 28} textAnchor="middle" className="chip-t sm">{p.label}</text>
            <text x={p.x} y={p.y + 36} textAnchor="middle" className="ssub paper">{p.sub}</text>
          </motion.g>
        );
      })}
      {/* the traveller, a little spark that hops along the road */}
      <motion.g initial={false} animate={{ x: here.x + 22, y: here.y - 20 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
        <motion.g animate={{ y: [0, -6, 0], rotate: [-6, 6, -6] }} transition={{ duration: 1, repeat: Infinity }}>
          <text textAnchor="middle" dominantBaseline="central" fontSize="20">🧑‍🚀</text>
        </motion.g>
      </motion.g>
      <Burst x={here.x} y={here.y} k={`stop${reached}`} n={done ? 26 : 10} spread={done ? 140 : 55} />
      {done && (
        <>
          <g transform={`translate(${here.x} ${here.y})`}>
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
              {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 -28 L4 -60 L-4 -60 Z" fill="#e2bd7a" opacity=".35" transform={`rotate(${i * 30})`} />)}
            </motion.g>
          </g>
          <Burst x={here.x} y={here.y} k="fin" n={10} spread={120} icons={['🎉', '🎊', '⭐']} />
        </>
      )}
      {/* experience bar */}
      <text x="30" y="398" className="cap">XP ⚡</text>
      <rect x="80" y="388" width="480" height="12" rx="6" className="txt-line" />
      <motion.rect x="80" y="388" width="0" height="12" rx="6" fill="url(#fx-brass)" animate={{ width: (480 * (reached + 1)) / JOURNEY.length }} transition={{ duration: 0.9 }} />
      <Shine x={80} y={388} w={480} h={12} rx={6} />
      <motion.text key={reached} x={80 + (480 * (reached + 1)) / JOURNEY.length} y="380" textAnchor="end" className="chip-t sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>lvl {reached + 1}</motion.text>
    </g>
  );
}

const meetScene = scene({
  id: 'welcome', chapter: 'welcome', kicker: 'Before we begin', title: 'Meet John, your guide.',
  cues: [
    { say: 'Hey! I’m John, your guide for this whole book. Every diagram, every weird word, every line of code. I’ve got you.', point: [300, 110], bubble: 'hello! 👋' },
    { say: 'No giant walls of text. No “figure it out yourself.” If something’s confusing, that’s my fault, not yours.', point: [300, 240], bubble: 'you + me = team' },
    { say: 'Here’s how it works. The left page is mine. Everything I say shows up there, like subtitles.', point: [178, 170], bubble: 'my words live here' },
    { say: 'The right page is my stage. Things move, data flows, and I point at stuff with this stick. Highly scientific stick.', point: [470, 230], bubble: 'my office 😎' },
    { say: 'I start talking when a page opens, and you can pause, skip, or mute me anytime. I won’t be hurt. Okay, a little. Next page: why this book is different.', point: [300, 362], bubble: 'you’re the boss' },
  ],
  draw: (s) => <MeetDiagram step={s} />,
  details: <p>Green labels mean <b>real execution</b> (numbers computed live in your browser). Gold labels mean <b>simulation</b> (simplified, and we always say how). Use the ← → keys, or swipe on a phone. On a phone, “Hide text” shows only the animation with subtitles.</p>,
});

/* ---------- */
const differentScene = scene({
  id: 'why-different', chapter: 'welcome', stage: 'imagine', kicker: 'Before we begin · Why this book', title: 'Not another boring book.',
  cues: [
    { say: 'Be honest. Most tech books look like this. Page one: a wall of text. Page ten: you’re asleep, and the book is now a pillow.', point: [145, 200], bubble: 'zzz 😴' },
    { say: 'Here, it’s the opposite. You watch, I explain, and things actually move. I point right at the part that matters.', point: [445, 71], bubble: 'watch + listen' },
    { say: 'Then you play with it yourself. Big ideas come with a little lab, like a real tokenizer running right inside the page.', point: [445, 147], bubble: 'hands-on labs 🧪' },
    { say: 'Then real Python, with real output. No made-up numbers. If something’s a simulation, I’ll say so. Then a quick quiz, which you can skip if you’re feeling brave.', point: [445, 260], bubble: 'real code, real output' },
    { say: 'As far as I know, this is the first book with a teacher living inside it. If you find another one, don’t tell me. Next page: where all this takes you.', point: [300, 388], bubble: 'one of a kind 😎' },
  ],
  draw: (s) => <DifferentDiagram step={s} />,
  details: <p>Every chapter follows the same rhythm: a story to imagine the problem, an animated explanation, an interactive lab, real Python with real output, a short test, and references for going deeper.</p>,
});

const journeyScene = scene({
  id: 'what-you-gain', chapter: 'welcome', stage: 'imagine', kicker: 'Before we begin · Your journey', title: 'Where this book takes you.',
  cues: [
    { say: 'So what do you get out of this? Here’s the road. You start right here: curious, maybe a bit confused. Perfect starting point.', point: [70, 340], bubble: 'level 1 👶' },
    { say: 'First, we open up the model. How it reads text, turns words into numbers, and why transformers changed everything. No magic, just clever math.', point: [200, 260], bubble: 'how LLMs work' },
    { say: 'Then you learn to talk to models properly. Prompts that work, and answers your code can actually use. Not just “please be smart.”', point: [360, 300], bubble: 'prompting, done right' },
    { say: 'Then the fun stuff. RAG, so a model can answer from your own documents. And agents, models that use tools to get things done.', point: [500, 220], bubble: 'apps people want' },
    { say: 'Then the part most tutorials skip: testing, serving it fast and cheap, keeping it secure, and watching it live. This is the part that gets you hired.', point: [340, 130], bubble: 'the pro part 💼' },
    { say: 'And at the end, you’re an AI engineer. You can build it, measure it, and ship it, with projects to prove it. Okay, enough hype. Let’s go.', point: [150, 60], bubble: 'final boss: you 🏆' },
  ],
  draw: (s) => <JourneyDiagram step={s} />,
  details: <p>The road follows the table of contents: Parts 1–3 (how models are built), 4 (applications), 5–6 (RAG and agents), 7–12 (evaluation, LLMOps, inference, quantization, serving, production), 13 (multimodal), and 14 (projects). Open ☰ Contents to see every chapter.</p>,
});

export const welcomeScenes = [meetScene, differentScene, journeyScene];
