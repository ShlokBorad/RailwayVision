import React from 'react';
import { motion } from 'framer-motion';
import type { Station } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Check, Clock, MapPin, Radio, AlertCircle } from 'lucide-react';
import { format12HourTime } from '../../utils/formatters';

interface StationTimelineProps {
  stations: Station[];
}

export const StationTimeline: React.FC<StationTimelineProps> = ({ stations }) => {
  return (
    <GlassCard glow="cyan" className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00E5FF]" /> Live Journey Stoppages
          </h3>
          <p className="text-xs text-slate-400">Chronological station arrival & departure tracking</p>
        </div>
        <Badge variant="cyan">{stations.length} STATIONS</Badge>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#22C55E] via-[#00E5FF] to-slate-700">
        {stations.map((st, idx) => {
          const isCompleted = st.status === 'COMPLETED';
          const isCurrent = st.status === 'CURRENT';

          return (
            <motion.div
              key={st.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'border-[#00E5FF] bg-[#050816] text-[#00E5FF] shadow-[0_0_15px_#00E5FF] scale-125'
                    : isCompleted
                    ? 'border-[#22C55E] bg-[#22C55E] text-[#050816]'
                    : 'border-slate-600 bg-slate-900 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                )}
              </div>

              {/* Station Row Details */}
              <div className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{st.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                        {st.code}
                      </span>
                      {st.platform && (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                          PF {st.platform}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#00E5FF]" /> {st.distanceKm} KM
                      </span>
                      {st.haltMinutes > 0 && <span>Halt: {st.haltMinutes}m</span>}
                      {st.state && <span>State: {st.state}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs text-slate-400">Sch / Act</div>
                      <div className="text-sm font-bold text-white font-mono">
                        {format12HourTime(st.scheduledArrival)} <span className="text-[#00E5FF]">/ {format12HourTime(st.actualArrival || st.scheduledArrival)}</span>
                      </div>
                    </div>
                    {st.delayMinutes > 0 ? (
                      <Badge variant="warning">
                        <AlertCircle className="w-3 h-3" /> +{st.delayMinutes}m
                      </Badge>
                    ) : (
                      <Badge variant="success">ON TIME</Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
};
