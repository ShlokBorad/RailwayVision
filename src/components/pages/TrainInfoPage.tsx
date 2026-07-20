import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { useTrainStore } from '../../store/useTrainStore';
import { POPULAR_TRAINS } from '../../services/railRadarApi';
import { ShieldCheck, Gauge, Calendar, MapPin, Cpu } from 'lucide-react';

export const TrainInfoPage: React.FC = () => {
  const { activeTrainNumber, setActiveTrainNumber } = useTrainStore();

  const train = POPULAR_TRAINS.find((t) => t.number === activeTrainNumber) || POPULAR_TRAINS[0];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <GlassCard glow="cyan" className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="cyan">{train.type.toUpperCase()}</Badge>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
              <span>{train.number}</span>
              <span className="text-[#00E5FF]">{train.name}</span>
            </h1>
            <p className="text-xs text-slate-300">
              {train.origin} ➔ {train.destination}
            </p>
          </div>

          {/* Train Selector */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {POPULAR_TRAINS.map((t) => (
              <button
                key={t.number}
                onClick={() => setActiveTrainNumber(t.number)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  train.number === t.number
                    ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_15px_#00E5FF]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {t.number}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow="cyan" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-[#00E5FF]" /> Speed Profile
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{train.maxSpeedKmH} KM/H</div>
          <div className="text-xs text-slate-400">Max Permissible Speed</div>
        </GlassCard>

        <GlassCard glow="purple" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#7C3AED]" /> Route Distance
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{train.totalDistanceKm} KM</div>
          <div className="text-xs text-slate-400">Duration: {train.totalDurationHours} hrs</div>
        </GlassCard>

        <GlassCard glow="green" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Operator Zone
          </div>
          <div className="text-xl font-extrabold text-white truncate">{train.zone}</div>
          <div className="text-xs text-slate-400 truncate">{train.operator}</div>
        </GlassCard>

        <GlassCard glow="cyan" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#00E5FF]" /> Running Days
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const runs = train.runningDays.includes(day);
              return (
                <span
                  key={day}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    runs ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40' : 'bg-white/5 text-slate-600'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Engine & Rake Specs */}
      <GlassCard glow="cyan" className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00E5FF]" /> Locomotive & Rake Specifications
        </h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="text-xs text-slate-400">LOCOMOTIVE ENGINE CLASS:</div>
          <div className="text-base font-bold text-[#00E5FF] font-mono">{train.engineType}</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase">Coach Rake Listing ({train.coaches.length} Coaches):</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {train.coaches.map((c) => (
              <div key={c.id} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                <div className="font-mono font-bold text-[#00E5FF]">{c.code}</div>
                <div className="text-slate-300 font-medium">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
