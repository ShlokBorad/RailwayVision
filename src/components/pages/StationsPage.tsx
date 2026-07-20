import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Building2, Search, Train } from 'lucide-react';
import { POPULAR_TRAINS, getSimulatedTrainTelemetry } from '../../services/railRadarApi';
import { useTrainStore } from '../../store/useTrainStore';

export const StationsPage: React.FC = () => {
  const { setActiveTrainNumber } = useTrainStore();
  const [query, setQuery] = useState('');

  // Collect all stations across registered trains
  const allStationEntries = POPULAR_TRAINS.flatMap((train) => {
    const tel = getSimulatedTrainTelemetry(train.number);
    return tel.allStations.map((st) => ({
      ...st,
      trainNumber: train.number,
      trainName: train.name,
      trainSpeed: tel.currentSpeed,
    }));
  });

  const filteredStations = allStationEntries.filter(
    (st) =>
      st.name.toLowerCase().includes(query.toLowerCase()) ||
      st.code.toLowerCase().includes(query.toLowerCase()) ||
      st.trainNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <GlassCard glow="cyan" className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="cyan">LIVE ARRIVAL & DEPARTURE BOARD</Badge>
            <h1 className="text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-[#00E5FF]" /> Station Radar Board
            </h1>
            <p className="text-xs text-slate-300">Live platform assignments and arrival timers across express corridors</p>
          </div>

          <div className="w-full md:w-80">
            <div className="glass-panel p-2 rounded-xl border border-white/10 flex items-center gap-2 bg-slate-900/80">
              <Search className="w-4 h-4 text-[#00E5FF] ml-2" />
              <input
                type="text"
                placeholder="Filter station (e.g. Surat, Borivali, NDLS)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white text-xs placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((st, i) => (
          <GlassCard
            key={`${st.code}-${st.trainNumber}-${i}`}
            glow={st.delayMinutes > 5 ? 'amber' : 'cyan'}
            className="space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{st.name}</span>
                <span className="text-xs font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10">
                  {st.code}
                </span>
              </div>
              <Badge variant="neutral">PF {st.platform || '1'}</Badge>
            </div>

            <div className="text-xs space-y-1">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-[#00E5FF]" />
                <button
                  onClick={() => setActiveTrainNumber(st.trainNumber)}
                  className="hover:underline text-white font-bold"
                >
                  {st.trainNumber} - {st.trainName}
                </button>
              </div>
              <div className="text-slate-400">Distance: {st.distanceKm} KM | State: {st.state || 'IN'}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">SCHEDULED</div>
                <div className="font-mono font-bold text-white">{st.scheduledArrival}</div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px]">EXPECTED</div>
                <div className="font-mono font-bold text-[#00E5FF]">{st.actualArrival || st.scheduledArrival}</div>
              </div>

              <div>
                {st.delayMinutes > 0 ? (
                  <Badge variant="warning">+{st.delayMinutes}m</Badge>
                ) : (
                  <Badge variant="success">ON TIME</Badge>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
