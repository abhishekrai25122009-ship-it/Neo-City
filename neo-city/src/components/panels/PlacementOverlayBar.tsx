import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import { RotateCw, Check, X } from 'lucide-react';

export const PlacementOverlayBar: React.FC = () => {
  const placement = useCityStore((state) => state.placement);
  const rotatePlacement = useCityStore((state) => state.rotatePlacement);
  const confirmPlacement = useCityStore((state) => state.confirmPlacement);
  const cancelPlacement = useCityStore((state) => state.cancelPlacement);

  if (!placement.active || !placement.blueprint) return null;

  const bp = placement.blueprint;

  return (
    <div className="fixed bottom-20 inset-x-0 z-50 flex justify-center pointer-events-none px-4 select-none font-mono text-xs">
      <div className="orbital-surface-elevated px-6 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-4 pointer-events-auto border border-[#ff5500]/60 shadow-[0_0_40px_rgba(255,85,0,0.35)] max-w-2xl w-full">
        {/* Structure Info & Status */}
        <div className="flex items-center gap-3">
          <div
            className="w-3.5 h-3.5 rounded-full animate-ping"
            style={{ backgroundColor: placement.isValid ? '#00e676' : '#ef4444' }}
          />
          <div>
            <div className="text-[10px] text-[#94a3b8] uppercase font-semibold">
              ORBITAL CAD ZONING // {placement.isValid ? 'VALID FOUNDATION MATRIX' : 'OBSTRUCTED: WATERWAY OR OCCUPIED'}
            </div>
            <div className="font-['Chakra_Petch'] font-black text-base text-[#fcfaf6] tracking-wide">
              {bp.name} <span className="text-[#ff8533] font-mono">(₡{bp.cost.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Rotate Button */}
          <button
            onClick={rotatePlacement}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d1017] hover:bg-[#161b26] border border-white/20 text-[#ede5d8] text-xs font-bold transition-all cursor-pointer"
            title="Rotate structure 90° (Hotkey: R)"
          >
            <RotateCw className="w-4 h-4 text-[#ff5500]" />
            <span>ROTATE [R]</span>
          </button>

          {/* Confirm Button */}
          <button
            onClick={confirmPlacement}
            disabled={!placement.isValid}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              placement.isValid
                ? 'bg-[#00e676] hover:bg-[#2be67d] text-[#05070a] shadow-[0_0_15px_#00e676]'
                : 'bg-[#121620] text-[#64748b] border border-white/5 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>CONSTRUCT [CLICK]</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={cancelPlacement}
            className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-[#ef4444] transition-all cursor-pointer"
            title="Cancel Placement (Hotkey: Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
