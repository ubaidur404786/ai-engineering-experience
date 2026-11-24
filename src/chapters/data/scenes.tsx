import { motion } from 'motion/react';
import { scene, Box, Flow } from '../../scene/Scene';
import { CodeBoard, lineAt } from '../../scene/CodeBoard';
import { quizScene } from '../../scene/quizScene';
import { Code } from '../../book/ui';

/* =====================================================================
   PART 1 · Chapter "data": Data, the raw material.
   One idea per scene. John stays on every page, including the code and the quiz.
   ===================================================================== */

const CH = 'data';

/* small SVG table used by several scenes */
export type Cell = string | number;
export function Table({ x, y, cols, rows, w, hotCols = [], labelCol, strike = [], flag = [] }: {
  x: number; y: number; cols: string[]; rows: Cell[][]; w: number[];
  hotCols?: number[]; labelCol?: number; strike?: number[]; flag?: number[];
}) {
  const RH = 30;
  const xs = w.map((_, i) => x + w.slice(0, i).reduce((a, b) => a + b, 0));
  const total = w.reduce((a, b) => a + b, 0);
  return (
    <g>
      {cols.map((c, j) => (
        <g key={c}>
          <rect x={xs[j]} y={y} width={w[j]} height={RH} className={`tcell head ${hotCols.includes(j) ? 'feat' : ''} ${labelCol === j ? 'lab' : ''}`} />
          <text x={xs[j] + w[j] / 2} y={y + 20} textAnchor="middle" className="tcell-t head">{c}</text>
        </g>
      ))}
      {rows.map((r, i) => (
        <motion.g key={i} animate={{ opacity: strike.includes(i) ? 0.45 : 1 }}>
          {r.map((v, j) => (
            <g key={j}>
              <rect x={xs[j]} y={y + RH * (i + 1)} width={w[j]} height={RH} className={`tcell ${hotCols.includes(j) ? 'feat' : ''} ${labelCol === j ? 'lab' : ''} ${flag.includes(i) ? 'flag' : ''}`} />
              <text x={xs[j] + w[j] / 2} y={y + RH * (i + 1) + 20} textAnchor="middle" className="tcell-t">{v}</text>
            </g>
          ))}
          {strike.includes(i) && <motion.line x1={x - 4} x2={x + total + 4} y1={y + RH * (i + 1.5)} y2={y + RH * (i + 1.5)} className="strike" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
        </motion.g>
      ))}
    </g>
  );
}

/* ============ 1. Why data ============ */

function WhyDiagram({ step }: { step: number }) {
  const bad = step >= 3;
  return (
    <g>
      <Box x={30} y={110} w={140} h={90} label={bad ? '🗑 Messy data' : '📚 Data'} sub={bad ? 'typos, gaps, lies' : 'examples'} tone={bad ? 'brass' : 'teal'} hot={step === 1 || step === 3} />
      <Flow d="M172 155 L228 155" color={bad ? '#b5533c' : '#2f7f88'} />
      <Box x={230} y={110} w={140} h={90} label="🧠 Model" sub="learns patterns" tone="night" hot={step === 2} />
      <Flow d="M372 155 L428 155" active={step >= 2} color={bad ? '#b5533c' : '#2f7f88'} />
      <Box x={430} y={110} w={140} h={90} label={bad ? '🤡 Nonsense' : '✓ Answers'} sub={bad ? 'confidently wrong' : 'good predictions'} tone={bad ? 'brass' : 'paper'} dim={step < 2} />
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <text x="300" y="270" textAnchor="middle" className="big-rule">Garbage in, garbage out.</text>
          <text x="300" y="300" textAnchor="middle" className="cap">The oldest rule in computing, and still true for GPT.</text>
        </motion.g>
      )}
      {step === 0 && <text x="300" y="300" textAnchor="middle" className="cap">A model is a student. Data is its only textbook.</text>}
    </g>
  );
}

const whyScene = scene({
  id: 'data-why', chapter: CH, stage: 'imagine', kicker: 'Part 1 · Data', title: 'Data: the raw material.',
  cues: [
    { say: 'Welcome to Part 1! We start with the most boring-sounding word in AI: data. Trust me, it’s secretly the most important one.', point: [300, 290], bubble: 'Part 1 starts!' },
    { say: 'A model is like a student who only ever reads one textbook. That textbook is the data: lots of examples.', point: [100, 150], bubble: 'the textbook 📚' },
    { say: 'The model reads those examples and finds patterns. Nobody writes rules by hand. The patterns come from the data.', point: [300, 150], bubble: 'learns patterns' },
    { say: 'Now imagine the textbook is full of typos, missing pages and wrong answers. The student studies hard, and learns all of it.', point: [100, 150], bubble: 'uh oh…' },
    { say: 'So the model gives wrong answers, very confidently. Garbage in, garbage out. Better data beats a bigger model surprisingly often.', point: [478, 262], bubble: 'remember this one' },
  ],
  draw: (step) => <WhyDiagram step={step} />,
  details: <p>In practice, AI teams spend much of their time collecting, cleaning and labelling data, often more than on the model itself. Every chapter in this book, from tokenization to fine-tuning, starts with "what data goes in?".</p>,
});

/* ============ 2. Structured vs unstructured ============ */

function KindsDiagram({ step }: { step: number }) {
  return (
    <g>
      <motion.g animate={{ opacity: step === 2 ? 0.35 : 1 }}>
        <text x="150" y="44" textAnchor="middle" className="slabel">Structured</text>
        <text x="150" y="64" textAnchor="middle" className="ssub paper">rows and columns</text>
        <Table x={40} y={84} w={[80, 70, 70]} cols={['name', 'age', 'city']} rows={[['Sara', 29, 'Paris'], ['Ali', 34, 'Lahore'], ['Mei', 41, 'Tokyo'], ['Tom', 23, 'Oslo']]} />
        <text x="150" y="260" textAnchor="middle" className="cap">spreadsheets, databases, sensors</text>
      </motion.g>
      <motion.g animate={{ opacity: step === 1 ? 0.35 : 1 }}>
        <text x="450" y="44" textAnchor="middle" className="slabel">Unstructured</text>
        <text x="450" y="64" textAnchor="middle" className="ssub paper">no fixed columns</text>
        {[['📝', 'text', 'emails, books, chats'], ['🖼️', 'images', 'photos, scans'], ['🎙️', 'audio', 'calls, podcasts'], ['🎬', 'video', 'everything at once']].map(([e, t, s], i) => (
          <g key={t}>
            <rect x="340" y={84 + i * 44} width="220" height="38" rx="8" className={`row-b ${step >= 3 && i === 0 ? 'hot-row' : ''}`} />
            <text x="356" y={109 + i * 44} className="emoji-t">{e}</text>
            <text x="390" y={102 + i * 44} className="tcell-t head" textAnchor="start">{t}</text>
            <text x="390" y={117 + i * 44} className="ssub paper">{s}</text>
          </g>
        ))}
        <text x="450" y="280" textAnchor="middle" className="cap">most of the world’s data looks like this</text>
      </motion.g>
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Flow d="M450 300 L450 330" color="#c4974a" count={2} dur={0.9} />
          <Box x={330} y={332} w={240} h={60} label="LLMs eat this" sub="trillions of words of text" tone="night" hot />
        </motion.g>
      )}
    </g>
  );
}

const kindsScene = scene({
  id: 'data-kinds', chapter: CH, stage: 'discover', kicker: 'Data · two shapes', title: 'Structured vs unstructured.',
  cues: [
    { say: 'Data comes in two shapes. Think of a neat spreadsheet versus your phone’s photo gallery.', point: [300, 50], bubble: 'two shapes' },
    { say: 'Structured data lives in rows and columns. Every row has the same fields: name, age, city. Easy for computers, boring at parties.', point: [150, 160], bubble: 'tidy table' },
    { say: 'Unstructured data has no fixed columns: text, images, audio, video. It’s messy, it’s human, and there’s a lot of it.', point: [450, 150], bubble: 'messy but rich' },
    { say: 'And here’s the twist: large language models learn from unstructured text. Huge piles of it. That’s why this chapter matters for LLMs too.', point: [548, 362], bubble: 'LLM food 🍝' },
  ],
  draw: (step) => <KindsDiagram step={step} />,
  details: <p>There is also <b>semi-structured</b> data such as JSON, HTML and logs: it has tags or keys, but no fixed table. Classic machine learning mostly works on structured tables; deep learning made unstructured data (text, images, sound) usable.</p>,
});

/* ============ 3. Features and labels ============ */

const HOUSES: Cell[][] = [[50, 2, 'yes', 150], [90, 3, 'no', 260], [120, 4, 'yes', 340], [65, 2, 'no', 190]];

function FeatDiagram({ step }: { step: number }) {
  return (
    <g>
      <text x="300" y="40" textAnchor="middle" className="slabel">One row = one example (a house)</text>
      <Table x={70} y={60} w={[120, 100, 110, 130]} cols={['size m²', 'rooms', 'garden', 'price (k€)']} rows={HOUSES}
        hotCols={step >= 1 ? [0, 1, 2] : []} labelCol={step >= 2 ? 3 : undefined} />
      {step >= 1 && <text x="235" y="236" textAnchor="middle" className="feat-t">features = what we know</text>}
      {step >= 2 && <text x="465" y="236" textAnchor="middle" className="lab-t">label = the answer</text>}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Table x={70} y={262} w={[120, 100, 110, 130]} cols={['size m²', 'rooms', 'garden', 'price (k€)']} rows={[[80, 3, 'yes', step >= 4 ? '≈ 240 ✨' : '?']]} hotCols={[0, 1, 2]} labelCol={3} />
          <text x="300" y="352" textAnchor="middle" className="cap">a new house: features known, label unknown</text>
        </motion.g>
      )}
      {step >= 4 && <text x="300" y="384" textAnchor="middle" className="ok">the model predicts the label (illustrative)</text>}
    </g>
  );
}

const featScene = scene({
  id: 'data-features', chapter: CH, stage: 'visualize', kicker: 'Data · features and labels', title: 'Features and labels.',
  cues: [
    { say: 'Let’s predict house prices. Each row is one example: one house.', point: [300, 120], bubble: 'one row = one house' },
    { say: 'These columns are the features: size, rooms, garden. The facts we know about each house.', point: [235, 150], bubble: 'features 🔎' },
    { say: 'This last column is the label: the right answer we want the model to learn. Here, the price.', point: [465, 150], bubble: 'label 🎯' },
    { say: 'Then a new house shows up. We know its features, but not its price.', point: [548, 307], bubble: 'price = ?' },
    { say: 'The model uses the patterns it learned to guess the label. That’s it. That’s most of machine learning, in one table.', point: [548, 307], bubble: 'prediction ✨' },
  ],
  draw: (step) => <FeatDiagram step={step} />,
  details: <p>In code, features are usually called <code>X</code> (a table) and the label <code>y</code> (one column). Labels can be numbers (price: <b>regression</b>) or categories (spam / not spam: <b>classification</b>). For an LLM the "label" is simply the next token, which is why it can learn from raw text without humans labelling it (more in the next chapter).</p>,
});

/* ============ 4. Collection and cleaning ============ */

const DIRTY: Cell[][] = [[50, 2, 150], [75, 3, 210], [75, 3, 210], [40, 1, '—'], [60, -3, 180], [140, 5, 400]];

function CleanDiagram({ step }: { step: number }) {
  const flag = step === 2 ? [2] : step === 3 ? [3] : step === 4 ? [4] : [];
  const strike = [...(step >= 2 ? [2] : []), ...(step >= 3 ? [3] : []), ...(step >= 4 ? [4] : [])];
  const notes: [number, string][] = [[2, 'duplicate: same house twice'], [3, 'missing price'], [4, '-3 rooms?! 👻']];
  return (
    <g>
      <text x="40" y="40" className="slabel">houses.csv, fresh from the internet</text>
      <Table x={40} y={56} w={[90, 80, 100]} cols={['size m²', 'rooms', 'price']} rows={DIRTY} flag={flag} strike={step >= 5 ? strike : strike.filter((r) => r !== flag[0])} />
      {notes.filter(([s]) => step >= s).map(([s, t]) => (
        <motion.text key={s} x="330" y={56 + 30 * (s + 1) + 20} className="warn" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>← {t}</motion.text>
      ))}
      {step === 1 && <text x="330" y="140" className="cap">collected from forms, APIs, scraping…</text>}
      {step >= 5 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box x={330} y={300} w={240} h={70} label="✓ clean: 6 → 3 rows" sub="fewer rows, but true ones" tone="teal" hot />
        </motion.g>
      )}
    </g>
  );
}

const cleanScene = scene({
  id: 'data-cleaning', chapter: CH, stage: 'behind', kicker: 'Data · collection and cleaning', title: 'Cleaning: the unglamorous superpower.',
  cues: [
    { say: 'First we collect data: forms, databases, APIs, web scraping. Here’s a table of houses, fresh from the internet.', point: [180, 150], bubble: 'collected!' },
    { say: 'Real data is never clean. Never. If someone tells you their data is clean, they haven’t looked yet.', point: [180, 150], bubble: 'trust nobody 🕵️' },
    { say: 'Problem one: duplicates. The same house appears twice, so the model thinks it’s twice as important. Delete the copy.', point: [300, 161], bubble: 'seen it already' },
    { say: 'Problem two: a missing price. We either drop the row, or fill the gap carefully. Here we drop it.', point: [300, 191], bubble: 'empty cell' },
    { say: 'Problem three: a house with minus three rooms. Either it’s a typo or a haunted house. Both get removed.', point: [300, 221], bubble: 'spooky 👻' },
    { say: 'Fewer rows, but every row is true. A small clean dataset often beats a big dirty one.', point: [450, 335], bubble: 'quality > quantity' },
  ],
  draw: (step) => <CleanDiagram step={step} />,
  details: <p>Other common cleaning steps: fixing types ("1,200" stored as text), unifying units (m² vs ft²), removing outliers, and removing personal data (names, emails) before training. For LLM pre-training, cleaning means deduplicating web pages and filtering low-quality or harmful text (Part 2).</p>,
});

/* ============ 5. Train / validation / test ============ */

function SplitDiagram({ step }: { step: number }) {
  const parts = [
    { w: 310, label: 'Train 70%', sub: '📚 the textbook', tone: 'teal' as const, s: 1 },
    { w: 95, label: 'Val 15%', sub: '📝 practice', tone: 'paper' as const, s: 2 },
    { w: 95, label: 'Test 15%', sub: '🔒 final exam', tone: 'brass' as const, s: 3 },
  ];
  let x = 50;
  return (
    <g>
      <text x="300" y="44" textAnchor="middle" className="slabel">All your clean data</text>
      {parts.map((p) => {
        const px = x; x += p.w;
        return (
          <motion.g key={p.label} animate={{ opacity: step === 0 || step >= p.s ? 1 : 0.25 }}>
            <rect x={px} y={64} width={p.w} height={70} className={`sbox ${p.tone} ${step === p.s ? 'hot' : ''}`} />
            <text x={px + p.w / 2} y={96} textAnchor="middle" className="slabel" style={{ fontSize: 14 }}>{p.label}</text>
            <text x={px + p.w / 2} y={116} textAnchor="middle" className="ssub">{p.sub}</text>
          </motion.g>
        );
      })}
      {step >= 1 && <text x="205" y="166" textAnchor="middle" className="cap">the model learns from these</text>}
      {step >= 2 && <text x="407" y="196" textAnchor="middle" className="cap">tune settings, pick the best version</text>}
      {step >= 3 && <text x="490" y="166" textAnchor="middle" className="cap">touched once, at the end</text>}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box x={60} y={230} w={220} h={80} label="🙈 Peeking at the test" sub="= data leakage" tone="brass" />
          <Box x={320} y={230} w={220} h={80} label="Fake 99% score" sub="fails on real users" tone="night" />
          <Flow d="M282 270 L318 270" color="#b5533c" count={2} dur={0.9} />
        </motion.g>
      )}
      {step >= 5 && <text x="300" y="360" textAnchor="middle" className="ok">Next: the same idea in real Python, then a quick test.</text>}
    </g>
  );
}

const splitScene = scene({
  id: 'data-split', chapter: CH, stage: 'visualize', kicker: 'Data · train, validation, test', title: 'Train, validation, test.',
  cues: [
    { say: 'Before training, we cut the clean data into three parts. This is the single most important habit in machine learning.', point: [300, 50], bubble: 'cut in three ✂️' },
    { say: 'The biggest part is training data. The model studies these examples, like a textbook.', point: [205, 99], bubble: 'study time' },
    { say: 'The validation set is the practice exam. We use it to tune settings and pick the best version of the model.', point: [407, 99], bubble: 'practice exam' },
    { say: 'The test set is the final exam. It stays locked away, and we use it only once, at the very end, to get an honest score.', point: [502, 99], bubble: 'locked 🔒' },
    { say: 'If test examples leak into training, the model has seen the exam answers. You get a fake 99 percent, then it fails on real users. That’s called data leakage.', point: [170, 270], bubble: 'no cheating!' },
    { say: 'That’s the theory. Next page: we do all of this in ten lines of real Python, and I’ll walk you through every line. Then a quick test, take it or skip it.', point: [540, 352], bubble: 'next page →' },
  ],
  draw: (step) => <SplitDiagram step={step} />,
  details: <p>70 / 15 / 15 and 80 / 10 / 10 are common splits; with very large datasets the validation and test sets can be a much smaller percentage. Split <i>before</i> cleaning steps that learn from the data (such as filling gaps with the average), or the average leaks test information into training.</p>,
});

/* ============ 6. Python, with John at the board ============ */

const CODE = [
  'import pandas as pd',
  'from sklearn.model_selection import train_test_split',
  'df = pd.read_csv("houses.csv")      # 12 rows',
  'before = len(df)',
  'df = df.drop_duplicates()           # same house twice',
  'df = df.dropna()                    # missing price',
  'df = df[df["rooms"] > 0]            # -3 rooms? nope',
  'print("rows:", before, "->", len(df))',
  'X = df[["size_m2", "rooms"]]        # features',
  'y = df["price_k"]                   # label',
  'X_tr, X_te, y_tr, y_te = train_test_split(',
  '    X, y, test_size=0.2, random_state=42)',
  'print(len(X_tr), "train /", len(X_te), "test")',
];
const CSV = `size_m2,rooms,price_k
50,2,150
75,3,210
75,3,210
120,4,340
40,1,
90,3,260
60,-3,180
110,4,320
65,2,190
140,5,400
85,3,245
55,2,165`;

const codeScene = scene({
  id: 'data-python', chapter: CH, stage: 'python', kicker: 'Implement with Python', title: 'The whole chapter, in code.',
  cues: [
    { say: 'Code time! Don’t panic, I’m right here. We’ll go line by line.', point: lineAt(0), bubble: 'I got you 🤝', step: -1 },
    { say: 'pandas is the spreadsheet of Python. scikit-learn gives us a ready-made splitter.', point: lineAt(1), bubble: 'two tools', step: 0 },
    { say: 'read csv loads our house table into a DataFrame. Twelve rows, including the messy ones.', point: lineAt(2), bubble: 'load the table', step: 1 },
    { say: 'Three cleaning lines: drop duplicates, drop missing values, and throw out the haunted minus three rooms house.', point: lineAt(5), bubble: 'clean, clean, clean', step: 2 },
    { say: 'X holds the features, y holds the label. Capital X because it’s a table, small y because it’s one column. Programmers love traditions.', point: lineAt(8), bubble: 'features & label', step: 3 },
    { say: 'train test split cuts the data: twenty percent goes to the locked test set. random state makes the split the same every run.', point: lineAt(10), bubble: 'the big cut ✂️', step: 4 },
    { say: 'And the real output: twelve rows became nine after cleaning, then seven for training and two for testing. Copy the code from my page and try it yourself!', point: [300, 365], bubble: 'it really runs ✓', step: 5 },
  ],
  draw: (step) => {
    const hot = [[], [0, 1], [2, 3], [4, 5, 6, 7], [8, 9], [10, 11, 12], []][step + 1];
    return <CodeBoard title="clean_and_split.py" lines={CODE} hot={hot} output={step >= 5 ? ['rows: 12 -> 9', '7 train / 2 test'] : undefined} outNote="real output, pandas 2.2 + scikit-learn 1.4" />;
  },
  details: <><Code title="houses.csv" lang="csv" code={CSV} /><Code title="clean_and_split.py" code={['import pandas as pd', 'from sklearn.model_selection import train_test_split', '', ...CODE.slice(2)].join('\n')} /><p className="muted">pip install pandas scikit-learn</p></>,
});

/* ============ 7. Quiz, hosted by John ============ */

const quiz = quizScene({
  id: 'data-test', chapter: CH, title: 'Quick check: data.',
  outro: 'That’s the data chapter done! Whatever your score, you now think about data like an engineer. Turn the page for what’s next.',
  items: [
    { ask: 'Quiz time! Four questions, no pressure, you can skip by turning the page. First one: which of these is unstructured data?', q: 'Which of these is unstructured data?', options: ['A table of customer ages', 'A folder of customer support emails', 'A database of product prices'], answer: 1,
      explain: 'Emails are free text with no fixed columns, so they’re unstructured. Tables and databases are structured.' },
    { ask: 'Question two. In a spam filter, what is the label?', q: 'You build a spam filter. What is the label?', options: ['The email’s word count', 'Whether the email is spam or not', 'The sender’s address'], answer: 1,
      explain: 'The label is the answer we want predicted: spam or not spam. Word count and sender are features.' },
    { ask: 'Question three. Your model scores 99 percent on the test set, but fails on real users. What probably happened?', q: '99% on the test set, terrible on real users. Most likely cause?', options: ['The model is too small', 'Test data leaked into training', 'The validation set was too big'], answer: 1,
      explain: 'A score that’s too good to be true usually means data leakage: the model already saw the test examples while training.' },
    { ask: 'Last one. You find the same row ten times in your data. Why is that a problem?', q: 'The same row appears 10 times. Why does it matter?', options: ['It doesn’t, more data is always better', 'The model over-weights that example, and it may leak across splits', 'It only slows down training'], answer: 1,
      explain: 'Duplicates make one example count ten times, and copies can land in both train and test, which is leakage again. Deduplicate first.' },
  ],
});

/* ============ 8. What's next ============ */

function NextDiagram({ step }: { step: number }) {
  const done = ['Why data matters', 'Structured vs unstructured', 'Features and labels', 'Collecting and cleaning', 'Train / validation / test', 'It in real Python'];
  return (
    <g>
      <text x="40" y="44" className="slabel">✓ Data: what you now know</text>
      {done.map((d, i) => (
        <motion.text key={d} x="52" y={80 + i * 30} className="ok" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>✓ {d}</motion.text>
      ))}
      {step >= 1 && (
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Flow d="M300 150 L350 150" count={3} dur={1} color="#c4974a" />
          <Box x={355} y={95} w={220} h={110} label="Next: ways to learn" sub="next page →" tone="night" hot />
        </motion.g>
      )}
    </g>
  );
}

const nextScene = scene({
  id: 'data-next', chapter: CH, kicker: 'What’s next?', title: 'What’s next?',
  cues: [
    { say: 'Look at you. Six data ideas, and one real Python script. Most people skip this part, you didn’t.', point: [150, 150], bubble: 'Data ✓' },
    { say: 'Next in Part 1: the ways a machine learns. Where do the answers come from, and how can a model learn with no labels at all? Turn the page, bro!', point: [465, 150], bubble: 'next page →' },
  ],
  draw: (step) => <NextDiagram step={step} />,
});

export const dataScenes = [whyScene, kindsScene, featScene, cleanScene, splitScene, codeScene, quiz, nextScene];
