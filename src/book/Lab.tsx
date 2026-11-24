import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';

/**
 * The "page expands into a laboratory" transition.
 * A book page calls openLab(...) and the lab grows out of the page into a full-screen panel.
 * Escape or "Return to the book" closes it and the book is exactly where the reader left it.
 */
export const LabContext = createContext<(lab: { title: string; body: ReactNode } | null) => void>(() => {});
export const useLab = () => useContext(LabContext);

export function LabOverlay({ title, body, onClose }: { title: string; body: ReactNode; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <motion.div
      className="lab"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={{ opacity: 0, scale: 0.92, borderRadius: 24 }}
      animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="lab-head">
        <span className="lab-badge">Laboratory</span>
        <h2>{title}</h2>
        <button ref={closeRef} className="btn-ghost" onClick={onClose}>← Return to the book</button>
      </header>
      <div className="lab-body">{body}</div>
    </motion.div>
  );
}
