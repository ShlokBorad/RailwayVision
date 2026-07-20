import React from 'react';
import type { TrainTelemetry } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Badge } from '../ui/Badge';
import { Gauge, Navigation, Compass, Clock, CheckCircle2, AlertTriangle, Radio, Mountain } from 'lucide-react';
import { format12HourTime } from '../../utils/formatters';

interface TelemetryGridProps {
  telemetry: TrainTelemetry;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ telemetry }) => {
  const isDelayed = telemetry.delayMinutes > 5;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Live Speed Gauge Card */}
      <GlassCard glow="cyan" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-[#00E5FF]" /> Live Speed
          </span>
          <Badge variant="cyan" pulse>
            60 FPS POLLED
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter
            value={telemetry.currentSpeed}
            className="text-4xl font-extrabold text-white"
          />
          <span className="text-sm font-semibold text-[#00E5FF]">KM/H</span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10 relative">
          <div
            style={{ width: `${(telemetry.currentSpeed / telemetry.train.maxSpeedKmH) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-full transition-all duration-500 shadow-[0_0_12px_#00E5FF]"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Max: {telemetry.train.maxSpeedKmH} km/h</span>
          <span>Avg: {telemetry.train.avgSpeedKmH} km/h</span>
        </div>
      </GlassCard>

      {/* 2. Distance & Progress */}
      <GlassCard glow="purple" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#7C3AED]" /> Route Progress
          </span>
          <span className="text-xs font-mono text-purple-300 font-bold">
            {telemetry.journeyProgressPercent}%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter
            value={telemetry.coveredDistanceKm}
            className="text-4xl font-extrabold text-white"
          />
          <span className="text-sm font-semibold text-slate-400">/ {telemetry.train.totalDistanceKm} KM</span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
          <div
            style={{ width: `${telemetry.journeyProgressPercent}%` }}
            className="h-full bg-gradient-to-r from-[#7C3AED] to-[#00E5FF] rounded-full transition-all duration-500"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Remaining: {telemetry.remainingDistanceKm} KM</span>
          <span>Elev: {telemetry.elevationMeters}m</span>
        </div>
      </GlassCard>

      {/* 3. Delay & ETA Status */}
      <GlassCard glow={isDelayed ? 'amber' : 'green'} className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" /> ETA & Delay
          </span>
          <Badge variant={isDelayed ? 'warning' : 'success'}>
            {isDelayed ? (
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> +{telemetry.delayMinutes} MIN</span>
            ) : (
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> ON TIME</span>
            )}
          </Badge>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-white font-mono">{telemetry.eta}</span>
        </div>
        <div className="text-xs text-slate-300 font-medium">
          Updated at <span className="font-mono text-[#00E5FF]">{format12HourTime(telemetry.lastUpdated)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Schedule Deviation: {telemetry.delayMinutes}m</span>
        </div>
      </GlassCard>

      {/* 4. Next Station & Platform */}
      <GlassCard glow="cyan" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#00E5FF]" /> Next Station
          </span>
          <Badge variant="cyan">
            PF {telemetry.nextStation.platform || '1'}
          </Badge>
        </div>
        <div>
          <div className="text-2xl font-bold text-white truncate">{telemetry.nextStation.name}</div>
          <div className="text-xs text-[#00E5FF] font-mono mt-0.5">
            {telemetry.nextStation.code} • Scheduled {format12HourTime(telemetry.nextStation.scheduledArrival)}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-white/10 pt-2">
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400" /> Signal: {telemetry.signalAspect}
          </span>
          <span className="flex items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-purple-400" /> Heading: {telemetry.heading}°
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
