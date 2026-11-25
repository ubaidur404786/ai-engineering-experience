import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/* =====================================================================
   Motion FX for showcase scenes (the welcome chapter).
   All in the shared 600×420 stage coordinates. Positions are
   deterministic (seeded), so a page looks the same on every visit.
   ===================================================================== */

const rnd = (seed: number) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

/** Gradients and glow filters used by the FX below. Render once per stage. */
export function FxDefs() {
  return (
    <defs>
      <linearGradient id="fx-brass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f3d08f" /><stop offset="1" stopColor="#c4974a" /></linearGradient>
      <linearGradient id="fx-teal" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#7cc4cb" /><stop offset="1" stopColor="#2f7f88" /></linearGradient>
      <linearGradient id="fx-night" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#1a2430" /><stop offset="1" stopColor="#0d141c" /></linearGradient>
      <linearGradient id="fx-shine" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <radialGradient id="fx-halo"><stop offset="0" stopColor="#e2bd7a" stopOpacity=".55" /><stop offset="1" stopColor="#e2bd7a" stopOpacity="0" /></radialGradient>
      <radialGradient id="fx-halo-teal"><stop offset="0" stopColor="#7cc4cb" stopOpacity=".5" /><stop offset="1" stopColor="#7cc4cb" stopOpacity="0" /></radialGradient>
      <filter id="fx-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      <filter id="fx-soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#3c2a10" floodOpacity=".18" /></filter>
    </defs>
  );
}

/** Emojis drifting and bobbing around the stage edges. */
export function FloatingIcons({ icons, seed = 1, opacity = 0.55, size = 24, avoid }: { icons: string[]; seed?: number; opacity?: number; size?: number; avoid?: [number, number, number, number] }) {
  const spots = icons.map((icon, i) => {
    let x = 0, y = 0, tries = 0;
    do {
      x = 30 + rnd(seed + i * 7 + tries) * 540;
      y = 30 + rnd(seed + i * 13 + tries * 3) * 360;
      tries++;
    } while (avoid && tries < 30 && x > avoid[0] && x < avoid[2] && y > avoid[1] && y < avoid[3]);
    return { icon, x, y, d: 3 + rnd(seed + i) * 3, r: (rnd(seed + i * 5) - 0.5) * 30, delay: rnd(seed + i * 11) * 2 };
  });
  return (
    <g pointerEvents="none" aria-hidden="true">
      {spots.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity, scale: 1, y: [0, -14, 0], rotate: [0, s.r, 0] }}
            transition={{ opacity: { delay: s.delay * 0.4, duration: 0.6 }, scale: { delay: s.delay * 0.4, type: 'spring', stiffness: 200 }, y: { duration: s.d, repeat: Infinity, ease: 'easeInOut', delay: s.delay }, rotate: { duration: s.d * 1.3, repeat: Infinity, ease: 'easeInOut' } }}>
            <text textAnchor="middle" dominantBaseline="central" fontSize={size}>{s.icon}</text>
          </motion.g>
        </g>
      ))}
    </g>
  );
}

/** Twinkling dots, a quiet "something magical is here" background. */
export function Twinkles({ n = 22, seed = 3, color = '#c4974a' }: { n?: number; seed?: number; color?: string }) {
  return (
    <g pointerEvents="none" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const x = 20 + rnd(seed + i * 3) * 560, y = 20 + rnd(seed + i * 17) * 380, r = 1 + rnd(seed + i) * 2.2;
        return <motion.circle key={i} cx={x} cy={y} r={r} fill={color} animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.6, 1.3, 0.6] }} transition={{ duration: 2 + rnd(i) * 2.5, repeat: Infinity, delay: rnd(seed + i * 9) * 3 }} />;
      })}
    </g>
  );
}

/** A one-shot burst of sparkles/confetti from a point. Change `k` to replay. */
export function Burst({ x, y, k, n = 14, spread = 90, icons }: { x: number; y: number; k: string | number; n?: number; spread?: number; icons?: string[] }) {
  const colors = ['#c4974a', '#2f7f88', '#e2bd7a', '#7cc4cb', '#b4533f', '#3c7a4a'];
  return (
    <g key={k} transform={`translate(${x} ${y})`} pointerEvents="none" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i) * 0.4, d = spread * (0.55 + rnd(i * 7) * 0.6);
        const tx = Math.cos(a) * d, ty = Math.sin(a) * d;
        return (
          <motion.g key={i} initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }} animate={{ x: tx, y: ty + 18, opacity: 0, scale: 1, rotate: rnd(i * 3) * 360 }} transition={{ duration: 1.1 + rnd(i) * 0.5, ease: [0.15, 0.8, 0.3, 1], delay: 0.05 }}>
            {icons ? <text textAnchor="middle" dominantBaseline="central" fontSize="16">{icons[i % icons.length]}</text>
              : i % 3 === 0 ? <path d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z" fill={colors[i % colors.length]} />
              : <rect x="-3" y="-1.5" width="6" height="3" rx="1" fill={colors[i % colors.length]} />}
          </motion.g>
        );
      })}
    </g>
  );
}

/** Pops its children in with a spring. */
export function Pop({ x, y, delay = 0, children }: { x: number; y: number; delay?: number; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g initial={{ scale: 0, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay }}>{children}</motion.g>
    </g>
  );
}

/** Soft pulsing halo behind something important. */
export function Halo({ x, y, r = 60, teal }: { x: number; y: number; r?: number; teal?: boolean }) {
  return <motion.circle cx={x} cy={y} r={r} fill={`url(#${teal ? 'fx-halo-teal' : 'fx-halo'})`} animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }} />;
}

/** Text that appears letter by letter with a springy bounce. */
export function SpringText({ x, y, text, className, delay = 0, stagger = 0.04 }: { x: number; y: number; text: string; className?: string; delay?: number; stagger?: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={className}>
      {Array.from(text).map((ch, i) => (
        <motion.tspan key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + i * stagger, duration: 0.25 }}>{ch}</motion.tspan>
      ))}
    </text>
  );
}

/** A light sweep across a rounded rect (for "premium" badges). */
export function Shine({ x, y, w, h, rx = 12 }: { x: number; y: number; w: number; h: number; rx?: number }) {
  const id = `clip-${x}-${y}-${w}`;
  return (
    <g pointerEvents="none">
      <clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={rx} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <motion.rect y={y} width={w * 0.35} height={h} fill="url(#fx-shine)" initial={{ x: x - w * 0.4 }} animate={{ x: [x - w * 0.4, x + w * 1.05] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }} />
      </g>
    </g>
  );
}

/** Smooth curve through points (Catmull-Rom → cubic Bézier), one segment per gap. */
export function smoothSegments(pts: { x: number; y: number }[]) {
  return pts.slice(0, -1).map((p1, i) => {
    const p0 = pts[i - 1] ?? p1, p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    return `M${p1.x} ${p1.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  });
}
