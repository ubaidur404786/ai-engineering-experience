import { useEffect, useRef } from 'react';

/**
 * DECORATIVE ONLY. Slow-drifting technical glyphs behind the book.
 * - Plain 2D canvas, ~40 sprites: cheap enough for laptops and phones.
 * - Stops rendering when the tab is hidden, and draws one static frame under prefers-reduced-motion.
 * - aria-hidden: it carries no information.
 */
const GLYPHS = [
  'Σ', '∇', 'softmax(QKᵀ/√d)', 'def train():', 'import torch', '[2437, 466, 356]', '∂L/∂w', 'GPU',
  'ŷ = σ(Wx + b)', 'tok', 'cos θ', 'KV$', 'λ', '{ "role": "user" }', '01001', '⊗', 'loss ↓', 'emb ∈ ℝ⁷⁶⁸',
  'p(xₜ | x<ₜ)', '▦', 'top_k=5', 'LoRA r=8', 'INT4', 'RAG',
];

export default function Ambient({ dimmed }: { dimmed: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const count = w < 700 ? 18 : 38;
    const items = Array.from({ length: count }, (_, i) => ({
      text: GLYPHS[i % GLYPHS.length],
      x: Math.random() * w, y: Math.random() * h,
      vy: 4 + Math.random() * 8, depth: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
    }));
    // A faint node graph: points + nearest links, suggests a network without being one.
    const nodes = Array.from({ length: w < 700 ? 14 : 26 }, () => ({ x: Math.random() * w, y: Math.random() * h, p: Math.random() * 6 }));

    let last = performance.now();
    const draw = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]; const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 180) { ctx.strokeStyle = `rgba(120,170,200,${0.07 * (1 - d / 180)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const pulse = 0.25 + 0.2 * Math.sin(t / 1400 + a.p);
        ctx.fillStyle = `rgba(150,200,225,${pulse})`; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 7); ctx.fill();
      }
      for (const it of items) {
        if (!reduce) { it.y -= it.vy * it.depth * dt; if (it.y < -30) { it.y = h + 30; it.x = Math.random() * w; } }
        ctx.font = `${Math.round(11 + it.depth * 7)}px "JetBrains Mono", Consolas, monospace`;
        const alpha = 0.06 + it.depth * 0.12 + 0.04 * Math.sin(t / 2000 + it.phase);
        ctx.fillStyle = `rgba(214,190,140,${alpha})`;
        ctx.fillText(it.text, it.x, it.y);
      }
      if (!reduce && !document.hidden) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onVis = () => { if (!document.hidden && !reduce) { last = performance.now(); raf = requestAnimationFrame(draw); } };
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  return <canvas ref={ref} className={`ambient ${dimmed ? 'dim' : ''}`} aria-hidden="true" />;
}
