import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const MIN = 0.62; // never shrink text below ~62%; past that the page may scroll inside itself as a last resort

/**
 * Fits a page's content into the page, like print: if it is taller than the page,
 * it is scaled down (and laid out wider by the same factor) until it fits. No scrolling.
 */
export default function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const cur = useRef(1);

  useLayoutEffect(() => {
    const o = outer.current!, i = inner.current!;
    let raf = 0;
    const fit = () => {
      const H = o.clientHeight;
      if (!H) return;
      let s = 1;
      i.style.minHeight = '0px';
      for (let k = 0; k < 6; k++) {            // height depends on width, so iterate a few times
        i.style.width = `${100 / s}%`;
        const next = Math.max(MIN, Math.min(1, (H / i.scrollHeight) * 0.995));
        const done = Math.abs(next - s) < 0.004;
        s = next;
        if (done) break;
      }
      i.style.width = `${100 / s}%`;
      i.style.minHeight = `${100 / s}%`;
      if (Math.abs(s - cur.current) > 0.004) { cur.current = s; setScale(s); }
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    fit();
    const ro = new ResizeObserver(schedule);
    ro.observe(o);
    const mo = new MutationObserver(schedule);
    mo.observe(i, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'open', 'aria-expanded'] });
    return () => { ro.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={outer} className={`fit ${scale <= MIN ? 'fit-scroll' : ''}`}>
      <div ref={inner} className="fit-inner" style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}>
        {children}
      </div>
    </div>
  );
}
