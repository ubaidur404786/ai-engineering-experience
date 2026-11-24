import { motion } from 'motion/react';

/**
 * "Professor Zayd": the book's guide. A friendly bearded engineer drawn in SVG.
 * - talking: the mouth opens and closes, the head nods slightly
 * - gesture: the right hand rises to point toward the diagram (the right page)
 * Pure SVG + Motion: no image assets, scales to any screen, themable.
 */
export default function Avatar({ talking, gesture = false, size = 220 }: { talking: boolean; gesture?: boolean; size?: number }) {
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 240 240" role="img" aria-label="Zayd, your guide">
      <defs>
        <radialGradient id="av-bg" cx="50%" cy="40%" r="60%"><stop offset="0" stopColor="#24394a" /><stop offset="1" stopColor="#121c26" /></radialGradient>
        <linearGradient id="av-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2b48c" /><stop offset="1" stopColor="#c99470" /></linearGradient>
        <linearGradient id="av-beard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2e211a" /><stop offset="1" stopColor="#1c1410" /></linearGradient>
        <clipPath id="av-clip"><circle cx="120" cy="120" r="116" /></clipPath>
      </defs>
      <circle cx="120" cy="120" r="116" fill="url(#av-bg)" />
      <circle cx="120" cy="120" r="115" fill="none" stroke="#c4974a" strokeOpacity=".5" />
      <g clipPath="url(#av-clip)">
        {/* body: navy blazer over a light shirt */}
        <path d="M30 240 C40 188 78 172 120 170 C162 172 200 188 210 240 Z" fill="#1f3550" />
        <path d="M98 172 L120 214 L142 172 C134 168 106 168 98 172 Z" fill="#e9e4d8" />
        <path d="M98 172 L120 214 L108 240 L84 240 Z" fill="#18293f" />
        <path d="M142 172 L120 214 L132 240 L156 240 Z" fill="#18293f" />
        {/* pointing arm */}
        <motion.g style={{ originX: '190px', originY: '230px' }} animate={{ rotate: gesture ? -38 : 0, y: gesture ? -6 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <path d="M176 240 C186 214 196 196 206 184" stroke="#1f3550" strokeWidth="26" strokeLinecap="round" fill="none" />
          <circle cx="208" cy="178" r="11" fill="url(#av-skin)" />
          <path d="M212 170 L226 152" stroke="#d7a67f" strokeWidth="7" strokeLinecap="round" />
        </motion.g>
        {/* neck */}
        <path d="M104 150 L104 176 C112 182 128 182 136 176 L136 150 Z" fill="#c08a66" />
        {/* head, nods while talking */}
        <motion.g style={{ originX: '120px', originY: '150px' }} animate={talking ? { rotate: [0, -2.5, 1.5, -1, 0] } : { rotate: 0 }} transition={talking ? { duration: 2.2, repeat: Infinity } : {}}>
          <ellipse cx="73" cy="104" rx="8" ry="12" fill="#c99470" />
          <ellipse cx="167" cy="104" rx="8" ry="12" fill="#c99470" />
          <path d="M76 92 C76 56 96 40 120 40 C144 40 164 56 164 92 L164 116 C164 146 144 160 120 160 C96 160 76 146 76 116 Z" fill="url(#av-skin)" />
          {/* hair: short, swept */}
          <path d="M74 96 C70 58 92 32 122 32 C150 32 172 52 166 98 C162 80 156 68 146 62 C130 70 104 70 86 62 C80 70 76 82 74 96 Z" fill="#241913" />
          <path d="M86 62 C100 50 130 46 150 58 C138 52 112 52 96 60 Z" fill="#3a2a20" />
          {/* eyebrows */}
          <motion.g animate={talking ? { y: [0, -2, 0] } : { y: 0 }} transition={{ duration: 1.6, repeat: talking ? Infinity : 0 }}>
            <path d="M92 86 C98 81 108 81 113 85" stroke="#241913" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M127 85 C132 81 142 81 148 86" stroke="#241913" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </motion.g>
          {/* eyes, blink */}
          <motion.g style={{ originY: '98px' }} animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4, times: [0, 0.92, 0.95, 1], repeat: Infinity }}>
            <ellipse cx="103" cy="98" rx="5" ry="5.5" fill="#fff" /><circle cx="104" cy="98.5" r="3.4" fill="#3b2a1e" /><circle cx="105" cy="97" r="1" fill="#fff" />
            <ellipse cx="137" cy="98" rx="5" ry="5.5" fill="#fff" /><circle cx="138" cy="98.5" r="3.4" fill="#3b2a1e" /><circle cx="139" cy="97" r="1" fill="#fff" />
          </motion.g>
          {/* nose */}
          <path d="M120 100 C118 110 115 116 118 119 C120 120 123 120 125 118" stroke="#a87458" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* full, well-groomed beard + moustache */}
          <path d="M78 110 C80 136 96 166 120 168 C144 166 160 136 162 110 C158 122 152 128 146 130 C138 124 102 124 94 130 C88 128 82 122 78 110 Z" fill="url(#av-beard)" />
          <path d="M102 128 C110 122 130 122 138 128 C132 126 126 127 120 129 C114 127 108 126 102 128 Z" fill="#1c1410" />
          {/* mouth (inside the beard) */}
          <motion.ellipse cx="120" cy="136" rx="9" fill="#5a2a22" style={{ originY: '136px' }}
            animate={talking ? { ry: [1.5, 5, 2, 6, 1.5, 4, 1.5] } : { ry: 1.5 }}
            transition={talking ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }} />
        </motion.g>
      </g>
    </svg>
  );
}
