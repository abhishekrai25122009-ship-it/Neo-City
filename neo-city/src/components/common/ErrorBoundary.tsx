import { Component, type ErrorInfo, type ReactNode } from 'react';
import { NeoCityLogo } from './NeoCityLogo';
import { AlertTriangle, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  isCanvasBoundary?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NEO CITY OS] Critical Unhandled Runtime Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleSafeReload = () => {
    try {
      localStorage.removeItem('neo_city_save_v3');
      localStorage.removeItem('neo_city_save_v2');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Storage clear warning:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.isCanvasBoundary) {
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050b14] text-slate-200 p-6 z-30 font-mono">
            <div className="max-w-md w-full p-6 rounded-2xl bg-[#09101d] border border-cyan-500/40 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col items-center text-center gap-4">
              <NeoCityLogo size="sm" variant="full" />
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-['Chakra_Petch'] font-black text-lg text-white">
                  3D HARDWARE VIEWPORT RECOVERY
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  WebGL subsystem encountered an unexpected initialization event. Restoring safe hardware profile...
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-white/10 w-full text-left font-mono text-[10px] text-rose-400 max-h-24 overflow-y-auto">
                {this.state.error?.message || 'Unknown WebGL pipeline exception'}
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> RETRY VIEWPORT
                </button>
                <button
                  onClick={this.handleSafeReload}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer border border-white/10"
                >
                  SAFE RESET
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Root Application Level Error Screen (Replaces Black Screen with Premium Futuristic Recovery)
      return (
        <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-[#040812] text-slate-100 p-6 z-50 font-mono select-none overflow-y-auto">
          {/* Subtle Ambient Background Cyber Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 max-w-xl w-full p-8 rounded-3xl bg-[#09101d]/90 backdrop-blur-xl border border-cyan-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,255,0.2)] flex flex-col items-center text-center gap-5">
            {/* Full Master Logo */}
            <NeoCityLogo size="lg" variant="full" />

            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] font-bold text-cyan-400 uppercase block">
                METROPOLITAN CORE DEFENSE PROTOCOL
              </span>
              <h2 className="font-['Chakra_Petch'] font-black text-2xl text-white mt-1">
                SYSTEM RECOVERY CONSOLE
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                An anomaly occurred during metropolitan runtime execution. NEO CITY has prevented a total shutdown and isolated the error.
              </p>
            </div>

            {/* Diagnostic Information */}
            <div className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 text-left font-mono text-[11px] text-rose-300 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>FAULT: {this.state.error?.name || 'Exception'}</span>
              </div>
              <div className="text-[10px] text-slate-300 break-all leading-tight">
                {this.state.error?.message}
              </div>
            </div>

            {/* Recovery Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_18px_rgba(0,240,255,0.5)]"
              >
                <RefreshCw className="w-4 h-4" /> RESUME SIMULATION
              </button>
              <button
                onClick={this.handleSafeReload}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
              >
                RESET CACHE & RELOAD
              </button>
            </div>

            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              NEO CITY OS // SAFE STARTUP ACTIVE • NO DATA CORRUPTED
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
