import React, { useState, useEffect } from 'react';
import { NeoCityLogo } from './NeoCityLogo';
import { ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface GameOpeningExperienceProps {
  onComplete?: () => void;
}

export const GameOpeningExperience: React.FC<GameOpeningExperienceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('INITIALIZING METROPOLITAN RUNTIME...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const steps = [
      { p: 35, text: 'SYNCHRONIZING 228 METROPOLITAN ARCOLOGY NODES...' },
      { p: 60, text: 'CALIBRATING SMART MOBILITY & MAGLEV GUIDES...' },
      { p: 85, text: 'ALIGNING ATMOSPHERIC & ACES FILMIC OPTICS...' },
      { p: 100, text: 'NOVA PRIME ONLINE // ACCESS GRANTED' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 600);
        }, 350);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleImmediateEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsDismissed(true);
      onComplete?.();
    }, 300);
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#040812] select-none transition-opacity duration-600 font-mono ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Background Cyber Grid & Radiant Neon Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Top Header Tagline */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <span className="tracking-[0.25em] text-[10px] text-cyan-300 font-bold uppercase">
            NEO CITY ARCHITECTURE CORE v9.1
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SAFE STARTUP ACTIVE</span>
        </div>
      </div>

      {/* Centerpiece: Magnificent Animated Neo City Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 my-auto">
        <div className="relative p-6 rounded-3xl bg-[#08101d]/60 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-md">
          <NeoCityLogo size="xl" variant="full" animated={true} />
        </div>

        <div className="flex flex-col items-center gap-2 max-w-md">
          <h2 className="font-['Chakra_Petch'] text-sm sm:text-base font-bold text-slate-200 tracking-wider">
            NEXT-GENERATION AUTONOMOUS MEGACITY
          </h2>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Deep living civic economy, autonomous district evolution, dynamic intelligent transportation, and 35 distinct futuristic architectural styles.
          </p>
        </div>
      </div>

      {/* Bottom Loading Telemetry Bar & Fast Bypass Button */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-cyan-400 font-bold tracking-wider">{statusText}</span>
          <span className="text-slate-300 font-bold">{progress}%</span>
        </div>

        {/* Progress Bar with Cyan Neon Glow */}
        <div className="w-full h-1.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ec4899] shadow-[0_0_12px_#00f0ff] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[9px] text-slate-500">PRESS SPACE OR CLICK TO ENTER</span>
          <button
            onClick={handleImmediateEnter}
            className="py-1 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>ENTER NOW</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
