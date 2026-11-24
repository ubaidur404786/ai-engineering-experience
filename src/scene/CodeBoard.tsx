import { motion } from 'motion/react';

/**
 * Code drawn on John's board, so he can stand under it and point at the line he is explaining.
 * Coordinates: the 600×420 stage. Keep lines ≤ 58 characters and ≤ 17 lines (or fewer with output).
 */
export const CODE_X = 34, CODE_Y = 58, LINE_H = 19;
/** Where John's stick points for line i: the empty right margin, so the stick doesn't cover code. */
export const lineAt = (i: number, x = 535): [number, number] => [x, CODE_Y + i * LINE_H - 5];

export function CodeBoard({ title, lines, hot = [], output, outNote }: {
  title: string; lines: string[]; hot?: number[]; output?: string[]; outNote?: string;
}) {
  const outY = CODE_Y + lines.length * LINE_H + 8;
  return (
    <g className="codeboard">
      <rect x="18" y="16" width="564" height={output ? outY - 10 : lines.length * LINE_H + 50} rx="10" className="cb-bg" />
      <text x="34" y="36" className="cb-title">{title}</text>
      {lines.map((l, i) => {
        const on = hot.includes(i);
        return (
          <g key={i}>
            {on && <motion.rect layoutId={undefined} x="24" y={CODE_Y + i * LINE_H - 14} width="552" height={LINE_H} rx="4" className="cb-hot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
            <text x={CODE_X} y={CODE_Y + i * LINE_H} className={`cb-line ${l.trimStart().startsWith('#') ? 'cmt' : ''} ${hot.length && !on ? 'dim' : ''}`} xmlSpace="preserve">{l}</text>
          </g>
        );
      })}
      {output && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <rect x="18" y={outY} width="564" height={output.length * 18 + 36} rx="10" className="cb-out" />
          <text x="34" y={outY + 20} className="cb-title">Output {outNote && <tspan className="cb-note">· {outNote}</tspan>}</text>
          {output.map((l, i) => <text key={i} x={CODE_X} y={outY + 40 + i * 18} className="cb-line out" xmlSpace="preserve">{l}</text>)}
        </motion.g>
      )}
    </g>
  );
}
