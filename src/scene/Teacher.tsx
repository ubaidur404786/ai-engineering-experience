import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

/**
 * "John": a young teacher, full body, drawn in SVG inside the stage.
 * He stands on a "floor" strip BELOW the diagram, so he never covers any text or drawing.
 * He walks to the spot under what he is explaining and reaches up with a telescopic pointer stick.
 *
 * Coordinates: the stage is 600 wide; the diagram uses y 0–420, the floor is y 420–590.
 */
export const FLOOR_TOP = 420;
/** Body size + floor height. Phones use a smaller John so the diagram gets more of the screen. */
const SIZES = { normal: { S: 1.15, FEET_Y: 580, H: 590 }, compact: { S: 0.8, FEET_Y: 535, H: 545 } };
export const stageHeight = (compact: boolean) => SIZES[compact ? 'compact' : 'normal'].H;

export default function Teacher({ target, talking, comment, compact = false }: { target?: [number, number]; talking: boolean; comment?: string; compact?: boolean }) {
  const { S, FEET_Y } = SIZES[compact ? 'compact' : 'normal'];
  const SHOULDER_DY = -94 * S; // shoulder height above feet
  // Stand beside the target, not under it, so the stick comes in at an angle.
  const tx = target?.[0] ?? 300;
  const faceRight = tx > 300 ? true : false;
  const desired = clamp(faceRight ? tx - 120 : tx + 120, 46, 554);
  const [x, setX] = useState(desired);
  const [walking, setWalking] = useState(false);
  const prev = useRef(desired);

  useEffect(() => {
    const dist = Math.abs(desired - prev.current);
    prev.current = desired;
    if (dist < 4) return;
    setWalking(true); setX(desired);
    const t = setTimeout(() => setWalking(false), Math.min(1400, 300 + dist * 3));
    return () => clearTimeout(t);
  }, [desired]);

  const walkDur = 0.3 + Math.abs(desired - x) * 0.003;
  const dir = faceRight ? 1 : -1;
  const pointing = !!target && !walking;

  // Everything for the arm is computed in BODY-LOCAL coordinates (origin = feet centre x),
  // and drawn inside the moving group, so arm, hand and stick always travel with the body.
  const shoulder: [number, number] = [dir * 15 * S, FEET_Y + SHOULDER_DY];
  const aimW = target ?? [x + dir * 60, FEET_Y - 40];
  const aim: [number, number] = pointing ? [aimW[0] - desired, aimW[1]] : [dir * 70, FEET_Y - 10]; // idle: stick held low
  const ang = Math.atan2(aim[1] - shoulder[1], aim[0] - shoulder[0]);
  const UA = 23 * S, FA = 21 * S;                       // upper arm, forearm
  const reach = pointing ? (UA + FA) * 0.92 : (UA + FA) * 0.7;
  const hand: [number, number] = [shoulder[0] + Math.cos(ang) * reach, shoulder[1] + Math.sin(ang) * reach];
  // two-bone IK: elbow bends downward like a real arm
  const bend = Math.acos(Math.min(1, (UA * UA + reach * reach - FA * FA) / (2 * UA * reach)));
  const ea = ang + (dir > 0 ? bend : -bend) * (Math.sin(ang) < 0 ? 1 : -1) * dir;
  const elbow: [number, number] = [shoulder[0] + Math.cos(ea) * UA, shoulder[1] + Math.sin(ea) * UA];
  const len = pointing ? Math.max(30, Math.hypot(aim[0] - hand[0], aim[1] - hand[1]) - 22) : 70;
  const tip: [number, number] = [hand[0] + Math.cos(ang) * len, hand[1] + Math.sin(ang) * len];
  const spring = { type: 'spring' as const, stiffness: 110, damping: 17 };

  // comment bubble sits on the floor, on the side away from the stick
  const bubbleW = 200;
  const bx = clamp(faceRight ? x - 50 - bubbleW : x + 50, 4, 600 - bubbleW - 4);

  return (
    <g className="teacher" aria-hidden="true">
      {/* floor line */}
      <line x1="0" x2="600" y1={FEET_Y + 4} y2={FEET_Y + 4} className="floor" />
      <ellipse cx={x} cy={FEET_Y + 4} rx="44" ry="5" className="shadow" style={{ transition: `cx ${walkDur}s` }} />

      {pointing && <circle cx={aimW[0]} cy={aimW[1]} r="14" className="tip-ring" />}

      <motion.g initial={false} animate={{ x }} transition={{ duration: walkDur, ease: 'easeInOut' }}>
        <g transform={`translate(0 ${FEET_Y}) scale(${dir * S} ${S})`}>
          <Body walking={walking} talking={talking} />
        </g>
        {/* stick (behind the hand), upper arm, forearm, joints, hand */}
        <motion.line initial={false} animate={{ x1: hand[0], y1: hand[1], x2: tip[0], y2: tip[1] }} transition={spring} className="stick" />
        {pointing && <motion.circle initial={false} animate={{ cx: tip[0], cy: tip[1], scale: [1, 1.5, 1] }} transition={{ ...spring, scale: { duration: 1.2, repeat: Infinity } }} r="4" className="stick-tip" />}
        <motion.line initial={false} animate={{ x1: shoulder[0], y1: shoulder[1], x2: elbow[0], y2: elbow[1] }} transition={spring} className="arm-sleeve" style={{ strokeWidth: 9.5 * S }} />
        <motion.line initial={false} animate={{ x1: elbow[0], y1: elbow[1], x2: hand[0], y2: hand[1] }} transition={spring} className="arm-sleeve fore" style={{ strokeWidth: 8.5 * S }} />
        <motion.circle initial={false} animate={{ cx: hand[0], cy: hand[1] }} transition={spring} r={5.2 * S} className="hand" />
      </motion.g>

      {/* what he's saying about this spot */}
      {comment && (
        <motion.g key={comment} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <foreignObject x={bx} y={FEET_Y - (compact ? 95 : 120)} width={bubbleW} height="90">
            <div style={{ textAlign: faceRight ? 'right' : 'left' }}>
              <div className={`say-bubble ${faceRight ? 'tail-right' : 'tail-left'}`} style={{ textAlign: 'left' }}>{comment}</div>
            </div>
          </foreignObject>
        </motion.g>
      )}
    </g>
  );
}

/** Body drawn facing right, feet at (0, FEET_Y). Mirrored by the parent when facing left. */
function Body({ walking, talking }: { walking: boolean; talking: boolean }) {
  const Y = 0;
  const swing = walking ? { rotate: [18, -18, 18] } : { rotate: 0 };
  const swingB = walking ? { rotate: [-18, 18, -18] } : { rotate: 0 };
  const legT = { duration: 0.55, repeat: walking ? Infinity : 0, ease: 'easeInOut' as const };
  return (
    <motion.g animate={walking ? { y: [0, -2, 0] } : { y: [0, -1, 0] }} transition={{ duration: walking ? 0.28 : 3, repeat: Infinity }}>
      {/* legs: black trousers + black formal shoes */}
      <motion.g style={{ originX: '0px', originY: `${Y - 46}px` }} animate={swingB} transition={legT}>
        <rect x="-9" y={Y - 48} width="11" height="44" rx="4" className="pants" />
        <path d={`M-10 ${Y - 6} h14 q8 0 9 6 h-23 z`} className="shoe" />
      </motion.g>
      <motion.g style={{ originX: '0px', originY: `${Y - 46}px` }} animate={swing} transition={legT}>
        <rect x="-1" y={Y - 48} width="11" height="44" rx="4" className="pants front" />
        <path d={`M-2 ${Y - 6} h14 q8 0 9 6 h-23 z`} className="shoe" />
      </motion.g>
      {/* belt + torso: navy shirt */}
      <rect x="-14" y={Y - 52} width="28" height="6" rx="2" className="belt" />
      <path d={`M-15 ${Y - 52} L-21 ${Y - 94} Q0 ${Y - 104} 21 ${Y - 94} L15 ${Y - 52} Z`} className="shirt" />
      <path d={`M-5 ${Y - 99} L0 ${Y - 90} L5 ${Y - 99}`} className="collar" />
      <line x1="0" y1={Y - 90} x2="0" y2={Y - 54} className="placket" />
      {/* back arm resting (the pointing arm is drawn by the parent) */}
      <motion.g style={{ originX: '-12px', originY: `${Y - 94}px` }} animate={talking ? { rotate: [4, 14, 4] } : { rotate: 6 }} transition={{ duration: 1.4, repeat: talking ? Infinity : 0 }}>
        <rect x="-18" y={Y - 96} width="9" height="38" rx="4.5" className="shirt sleeve" />
        <circle cx="-13.5" cy={Y - 56} r="5" className="skin" />
      </motion.g>
      {/* neck + head */}
      <rect x="-4" y={Y - 108} width="8" height="10" className="skin" />
      <motion.g style={{ originX: '0px', originY: `${Y - 106}px` }} animate={talking ? { rotate: [0, -4, 3, 0] } : { rotate: -2 }} transition={{ duration: 1.8, repeat: talking ? Infinity : 0 }}>
        <ellipse cx="1" cy={Y - 122} rx="13" ry="15" className="skin" />
        <ellipse cx="-11" cy={Y - 121} rx="2.6" ry="4" className="skin" />
        {/* neat young haircut, side part */}
        <path d={`M-13 ${Y - 124} Q-15 ${Y - 141} 2 ${Y - 141} Q17 ${Y - 141} 15 ${Y - 126} Q12 ${Y - 134} 4 ${Y - 133} Q-4 ${Y - 136} -9 ${Y - 129} Z`} className="hair" />
        <path d={`M2 ${Y - 141} Q14 ${Y - 143} 16 ${Y - 132}`} className="hair-shine" />
        {/* eyebrow, eye (blinks), nose, smile */}
        <path d={`M5 ${Y - 128} q4 -2 8 0`} className="brow" />
        <motion.g style={{ originY: `${Y - 123}px` }} animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 3.6, times: [0, 0.9, 0.94, 1], repeat: Infinity }}>
          <ellipse cx="0" cy={Y - 123} rx="1.7" ry="2.1" className="eye" />
          <ellipse cx="9" cy={Y - 123} rx="1.8" ry="2.2" className="eye" />
        </motion.g>
        <path d={`M-6 ${Y - 128} q3 -2 6 0`} className="brow" />
        <ellipse cx="-3" cy={Y - 116} rx="2.6" ry="1.4" className="blush" />
        <path d={`M13 ${Y - 121} q3 4 -1 5`} className="nose" />
        <motion.ellipse cx="6" cy={Y - 112} rx="4.2" ry="0.9" className="mouth" animate={talking ? { ry: [0.8, 2.8, 1.2, 3.2, 0.8] } : { ry: 0.9 }} transition={{ duration: 0.7, repeat: talking ? Infinity : 0 }} />
      </motion.g>
    </motion.g>
  );
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
