import { useEffect, useState } from 'react';

/** True on phones / narrow windows (the one-column book). */
export function useIsNarrow() {
  const q = '(max-width: 900px)';
  const [narrow, set] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const mq = matchMedia(q); const on = () => set(mq.matches);
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}
