import React from 'react';
import { Train, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore';

export const Footer: React.FC = () => {
  const { setActiveTab } = useTrainStore();

  return (
    <footer className="w-full bg-[#03050d] border-t border-white/10 pt-12 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-16">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent blur-sm" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] p-[1px]">
              <div className="w-full h-full bg-[#050816] rounded-[7px] flex items-center justify-center">
                <Train className="w-4 h-4 text-[#00E5FF]" />
              </div>
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              RailwayVisIon <span className="text-xs font-mono text-[#00E5FF] font-semibold">By ShlokXd</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Next-generation real-time train radar platform. Satellite GPS location tracking, AI delay predictions, speed profiles, and live station updates.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#7C3AED]/10 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-pulse" />
            DEVELOPED BY @SHLOKXD
          </div>
        </div>

        {/* Radar navigation */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Radar Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li>
              <button onClick={() => setActiveTab('landing')} className="hover:text-[#00E5FF] transition-colors">
                Radar Home
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('track')} className="hover:text-[#00E5FF] transition-colors">
                Live Telemetry Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('live-map')} className="hover:text-[#00E5FF] transition-colors">
                Interactive Satellite Radar
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('stations')} className="hover:text-[#00E5FF] transition-colors">
                Station Arrival Boards
              </button>
            </li>
          </ul>
        </div>

        {/* Train Express Systems */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Tracked Express Fleets</h4>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li>Malwa Superfast Express (12919)</li>
            <li>Vande Bharat Express (20901 / 22436)</li>
            <li>Tejas Rajdhani Express (12951)</li>
            <li>Shatabdi Express (12002)</li>
          </ul>
        </div>

        {/* Radar Network System Status */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">System Health</h4>
          <div className="glass-panel p-3.5 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Network:</span>
              <span className="text-[#00E5FF] font-bold">Satellite Radar</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Developer:</span>
              <span className="text-[#00E5FF] font-bold">shlokxd</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Telemetry SLA:</span>
              <span className="text-[#22C55E]">99.98% Realtime</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
          <span>© 2026 RailVision AI Radar System. Developed by <strong>shlokxd</strong>. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#7C3AED]" /> Engineered with React 19 & Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
};
