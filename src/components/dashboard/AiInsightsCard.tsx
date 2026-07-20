import React from 'react';
import type { AiInsights } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Activity, ShieldCheck, Zap, AlertCircle, Compass } from 'lucide-react';
import { format12HourTime } from '../../utils/formatters';

interface AiInsightsCardProps {
  insights: AiInsights;
}

export const AiInsightsCard: React.FC<AiInsightsCardProps> = ({ insights }) => {
  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              Route & Dispatch Metrics
            </h3>
            <p className="text-xs text-slate-400">Live corridor tracking & schedule reliability</p>
          </div>
        </div>
        <Badge variant="cyan">{insights.confidenceScore}% VERIFIED</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#00E5FF]" /> Speed Stability
          </div>
          <div className="text-sm font-bold text-emerald-400">{insights.speedConsistency}</div>
          <div className="text-[11px] text-slate-400 leading-tight">Optimal track pace across last 50 km</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Delay Risk Index
          </div>
          <div className="text-sm font-bold text-white font-mono">{insights.delayProbability}% Risk</div>
          <div className="text-[11px] text-slate-400 leading-tight">Clear signal aspect ahead</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Forecast Arrival
          </div>
          <div className="text-sm font-bold text-[#00E5FF] font-mono">{format12HourTime(insights.predictedArrival)}</div>
          <div className="text-[11px] text-slate-400 leading-tight">{insights.platformRecommendation}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed flex items-center gap-2">
        <Compass className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />
        <span><strong>Track Conditions:</strong> {insights.weatherImpact}</span>
      </div>
    </GlassCard>
  );
};
