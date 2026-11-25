import { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import Cover from './book/Cover';
import Book from './book/Book';
import Ambient from './book/Ambient';

export default function App() {
  const [open, setOpen] = useState(() => location.hash.startsWith('#p'));
  return (
    <MotionConfig reducedMotion="user">
    <div className="stage">
      <Ambient dimmed={open} />
      <AnimatePresence mode="wait">
        {open ? <Book key="book" onClose={() => setOpen(false)} /> : <Cover key="cover" onOpen={() => setOpen(true)} />}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
