import React from 'react';

export interface NeoCityLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'monochrome' | 'badge';
  className?: string;
  animated?: boolean;
}

export const NeoCityLogo: React.FC<NeoCityLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  animated = false,
}) => {
  const sizeMap = {
    xs: { h: 28, text: 'text-sm' },
    sm: { h: 36, text: 'text-base' },
    md: { h: 48, text: 'text-xl' },
    lg: { h: 68, text: 'text-2xl' },
    xl: { h: 96, text: 'text-4xl' },
  };

  const dim = sizeMap[size];

  // ========================================================
  // 1. COMPACT ICON / STANDALONE EMBLEM
  // ========================================================
  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-auto"
          style={{ height: dim.h }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neoShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="neoSkylineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="80%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="neoAccentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5a3" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>
            <filter id="neonGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Cyber Octagon Bevel Frame */}
          <polygon
            points="50,4 88,20 96,50 88,80 50,96 12,80 4,50 12,20"
            fill="#050a14"
            stroke="url(#neoShieldGrad)"
            strokeWidth="3.2"
            strokeLinejoin="round"
            className={animated ? 'animate-pulse' : ''}
          />

          {/* Inner Geometric Shield Accent */}
          <polygon
            points="50,12 80,25 86,50 80,75 50,88 20,75 14,50 20,25"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Futuristic Skyline Silhouette Inside Emblem */}
          {/* Outer Left Tower */}
          <rect x="24" y="52" width="9" height="26" fill="url(#neoSkylineGrad)" rx="1" />
          <polygon points="24,52 28.5,46 33,52" fill="#00f0ff" />

          {/* Mid-Left Stepped Arcology */}
          <polygon points="35,78 35,42 41,38 43,38 43,78" fill="url(#neoSkylineGrad)" />
          <line x1="36" y1="46" x2="42" y2="46" stroke="#00f0ff" strokeWidth="1" />
          <line x1="36" y1="54" x2="42" y2="54" stroke="#00f0ff" strokeWidth="1" />

          {/* Celestial Central Apex Spire */}
          <polygon points="45,78 45,26 50,14 55,26 55,78" fill="url(#neoSkylineGrad)" filter="url(#neonGlowFilter)" />
          <line x1="50" y1="14" x2="50" y2="78" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />

          {/* Mid-Right Quantum Research Tower */}
          <polygon points="57,78 57,38 65,42 65,78" fill="url(#neoSkylineGrad)" />
          <circle cx="61" cy="48" r="2.5" fill="#ec4899" />

          {/* Far-Right Spire */}
          <rect x="67" y="52" width="9" height="26" fill="url(#neoSkylineGrad)" rx="1" />
          <polygon points="67,52 71.5,46 76,52" fill="#8b5cf6" />

          {/* High-Altitude Skybridge Crossing */}
          <path
            d="M 28 58 Q 50 50 72 58"
            fill="none"
            stroke="url(#neoAccentGlow)"
            strokeWidth="2"
            filter="url(#neonGlowFilter)"
          />

          {/* Quantum Radiant Base Arc */}
          <circle cx="50" cy="78" r="8" fill="none" stroke="url(#neoShieldGrad)" strokeWidth="2.5" />
          <circle cx="50" cy="78" r="3" fill="#00f0ff" />
        </svg>
      </div>
    );
  }

  // ========================================================
  // 2. MONOCHROME LOGO (Clean Silver / White Variant)
  // ========================================================
  if (variant === 'monochrome') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <svg viewBox="0 0 100 100" style={{ height: dim.h }} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="50,6 86,22 94,50 86,78 50,94 14,78 6,50 14,22"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <polygon points="46,78 46,26 50,16 54,26 54,78" fill="#f8fafc" />
          <polygon points="34,78 34,42 42,36 42,78" fill="#94a3b8" />
          <polygon points="58,78 58,36 66,42 66,78" fill="#94a3b8" />
          <path d="M 28 56 Q 50 48 72 56" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className={`font-['Chakra_Petch'] font-black tracking-widest text-slate-100 ${dim.text}`}>
            NEO CITY
          </span>
          <span className="font-mono text-[9px] tracking-[0.35em] text-slate-400 mt-0.5">
            NOVA PRIME
          </span>
        </div>
      </div>
    );
  }

  // ========================================================
  // 3. FULL MASTER LOGO (Emblem + Radiant Typography + Tagline)
  // ========================================================
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-auto drop-shadow-[0_0_16px_rgba(0,240,255,0.45)]"
          style={{ height: dim.h }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fullShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="35%" stopColor="#00e5a3" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="fullSkylineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#040914" />
              <stop offset="30%" stopColor="#0369a1" />
              <stop offset="70%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="fullBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#00e5a3" />
            </linearGradient>
            <filter id="fullGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dynamic Shield Outer Frame */}
          <polygon
            points="50,4 88,20 96,50 88,80 50,96 12,80 4,50 12,20"
            fill="#050a14"
            stroke="url(#fullShieldGrad)"
            strokeWidth="3.6"
            strokeLinejoin="round"
          />

          {/* Secondary Structural Inset Line */}
          <polygon
            points="50,11 82,24 88,50 82,76 50,89 18,76 12,50 18,24"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* Left Arcology Tower */}
          <rect x="24" y="52" width="9" height="26" fill="url(#fullSkylineGrad)" rx="1" />
          <polygon points="24,52 28.5,46 33,52" fill="#00e5a3" />

          {/* Mid-Left Stepped Bio-Ziggurat */}
          <polygon points="35,78 35,42 41,37 43,37 43,78" fill="url(#fullSkylineGrad)" />
          <line x1="36" y1="46" x2="42" y2="46" stroke="#00f0ff" strokeWidth="1" />
          <line x1="36" y1="54" x2="42" y2="54" stroke="#00f0ff" strokeWidth="1" />

          {/* Celestial Central Apex Spire */}
          <polygon points="45,78 45,26 50,12 55,26 55,78" fill="url(#fullSkylineGrad)" filter="url(#fullGlow)" />
          <line x1="50" y1="12" x2="50" y2="78" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />

          {/* Mid-Right Quantum Research Tower */}
          <polygon points="57,78 57,38 65,42 65,78" fill="url(#fullSkylineGrad)" />
          <circle cx="61" cy="48" r="2.5" fill="#ec4899" filter="url(#fullGlow)" />

          {/* Far-Right Tech Spire */}
          <rect x="67" y="52" width="9" height="26" fill="url(#fullSkylineGrad)" rx="1" />
          <polygon points="67,52 71.5,46 76,52" fill="#8b5cf6" />

          {/* High-Altitude Skybridge Crossing */}
          <path
            d="M 28 58 Q 50 49 72 58"
            fill="none"
            stroke="url(#fullBridgeGrad)"
            strokeWidth="2.4"
            filter="url(#fullGlow)"
          />

          {/* Radiant Core Node */}
          <circle cx="50" cy="78" r="8" fill="#050a14" stroke="url(#fullShieldGrad)" strokeWidth="2.2" />
          <circle cx="50" cy="78" r="3.2" fill="#00f0ff" filter="url(#fullGlow)" />
        </svg>
      </div>

      {/* Futuristic Typographic Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-['Chakra_Petch'] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ec4899] drop-shadow-[0_0_18px_rgba(0,240,255,0.4)] ${dim.text}`}
          >
            NEO CITY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a3] shadow-[0_0_8px_#00e5a3] animate-pulse" />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-[9px] tracking-[0.38em] font-semibold text-slate-300 uppercase">
            NOVA PRIME
          </span>
          <span className="hidden sm:inline-block text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            METROPOLIS OS
          </span>
        </div>
      </div>
    </div>
  );
};
