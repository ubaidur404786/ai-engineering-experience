import { motion } from 'motion/react';

export default function Cover({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.main
      className="cover-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, rotateY: -80, transformOrigin: 'left center' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="cover"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="cover-spine" aria-hidden="true" />
        <div className="cover-frame">
          <p className="cover-kicker">Volume I · An interactive book</p>
          <h1 className="cover-title">
            The AI<br />Engineering<br /><em>Experience</em>
          </h1>
          <CoverEmblem />
          <p className="cover-sub">
            An interactive journey from understanding artificial intelligence to building real-world AI applications.
          </p>
          <button className="btn-primary" onClick={onOpen} autoFocus>
            Begin your journey
          </button>
        </div>
      </motion.div>
    </motion.main>
  );
}

/** Emblem: the book's core mental model. Builder side ⟷ AI Engineering ⟷ User side. */
function CoverEmblem() {
  return (
    <svg className="cover-emblem" viewBox="0 0 240 90" role="img" aria-label="Two sides joined: the builder side and the user side meet in AI engineering">
      <circle cx="50" cy="45" r="30" className="em-a" />
      <circle cx="190" cy="45" r="30" className="em-b" />
      <path d="M80 45 H160" className="em-link" />
      <circle cx="120" cy="45" r="7" className="em-core" />
      <text x="50" y="49" textAnchor="middle">model</text>
      <text x="190" y="49" textAnchor="middle">app</text>
    </svg>
  );
}
