import React from 'react';
import type { Coach } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { Train, Users } from 'lucide-react';

interface CoachCompositionProps {
  coaches: Coach[];
  engineType: string;
}

export const CoachComposition: React.FC<CoachCompositionProps> = ({ coaches, engineType }) => {
  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Train className="w-5 h-5 text-[#00E5FF]" /> Coach Rake Composition & Layout
          </h3>
          <p className="text-xs text-slate-400">Loco: {engineType}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" /> High Occupancy
          <span className="w-2.5 h-2.5 rounded bg-[#00E5FF] inline-block" /> Exec/AC
        </div>
      </div>

      {/* Horizontal Scrollable Coach Layout */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 custom-scrollbar">
        {coaches.map((c) => {
          const isLoco = c.type === 'ENGINE';
          return (
            <div
              key={c.id}
              className={`flex-none w-24 p-3 rounded-xl border flex flex-col items-center justify-between transition-transform hover:-translate-y-1 ${
                isLoco
                  ? 'bg-gradient-to-b from-[#7C3AED]/20 to-[#00E5FF]/20 border-[#00E5FF]/50 text-white'
                  : 'bg-white/5 border-white/10 text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">{c.code}</div>
              <div className="my-2">
                <Train className={`w-6 h-6 ${isLoco ? 'text-[#00E5FF]' : 'text-slate-300'}`} />
              </div>
              <div className="text-[11px] font-bold text-center truncate w-full">{c.name}</div>

              {!isLoco && (
                <div className="w-full mt-2 pt-2 border-t border-white/10 text-center">
                  <div className="text-[9px] text-slate-400 flex items-center justify-center gap-1">
                    <Users className="w-2.5 h-2.5" /> {c.occupancyPercent}%
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      style={{ width: `${c.occupancyPercent}%` }}
                      className={`h-full rounded-full ${
                        c.occupancyPercent > 90 ? 'bg-emerald-400' : 'bg-[#00E5FF]'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
