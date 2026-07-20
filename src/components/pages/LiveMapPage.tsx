import React, { useState, useEffect } from 'react';
import { useTrainStore } from '../../store/useTrainStore';
import { fetchLiveTrainTelemetry, POPULAR_TRAINS } from '../../services/railRadarApi';
import type { TrainTelemetry } from '../../types/train';
import { TrainMap } from '../map/TrainMap';
import { GlassCard } from '../ui/GlassCard';
import { Train } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const { activeTrainNumber, setActiveTrainNumber } = useTrainStore();
  const [telemetry, setTelemetry] = useState<TrainTelemetry | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await fetchLiveTrainTelemetry(activeTrainNumber);
      if (mounted) setTelemetry(data);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeTrainNumber]);

  if (!telemetry) {
    return (
      <div className="min-h-screen pt-32 text-center text-sm font-mono text-[#00E5FF]">
        INITIALIZING FULLSCREEN RADAR ENGINE...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-4 px-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Map Control Bar */}
      <GlassCard glow="cyan" className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg">{telemetry.train.number}</span>
              <span className="text-sm text-[#00E5FF] font-semibold">{telemetry.train.name}</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Speed: {telemetry.currentSpeed} KM/H | Delay: +{telemetry.delayMinutes}m | Signal: {telemetry.signalAspect}
            </div>
          </div>
        </div>

        {/* Quick Train Selector */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-xs text-slate-400 font-mono flex-shrink-0">Active Train:</span>
          {POPULAR_TRAINS.map((t) => (
            <button
              key={t.number}
              onClick={() => setActiveTrainNumber(t.number)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex-shrink-0 transition-all ${
                activeTrainNumber === t.number
                  ? 'bg-[#00E5FF] text-slate-950 font-bold shadow-[0_0_15px_#00E5FF]'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {t.number}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Fullscreen Map */}
      <TrainMap telemetry={telemetry} height="calc(100vh - 180px)" isFullscreenMode />
    </div>
  );
};
