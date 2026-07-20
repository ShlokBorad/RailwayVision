import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTrainStore } from '../../store/useTrainStore';
import { getSimulatedTrainTelemetry } from '../../services/railRadarApi';
import type { TrainTelemetry } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { StationTimeline } from '../dashboard/StationTimeline';
import { TelemetryGrid } from '../dashboard/TelemetryGrid';
import { AiInsightsCard } from '../dashboard/AiInsightsCard';
import { TrainMap } from '../map/TrainMap';
import {
  Star, RefreshCw, Download, AlertTriangle,
  Train, Clock, Loader2, CheckCircle,
} from 'lucide-react';

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen: React.FC<{ trainNumber: string }> = ({ trainNumber }) => {
  const steps = [
    'Fetching schedule data...',
    'Loading station halts...',
    'Computing live position...',
    'Building route polyline...',
    'Applying telemetry feed...',
  ];
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, steps.length - 1));
      setProgress((p) => Math.min(p + 18, 90));
    }, 400);
    return () => clearInterval(ticker);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      {/* Radar pulse icon */}
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-[#00E5FF]/30 animate-pulse" />
        <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.3)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Loading Train #{trainNumber}
        </h2>
        <p className="text-xs font-mono text-[#00E5FF] animate-pulse">{steps[stepIdx]}</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-full"
          initial={{ width: '5%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
};

// ─── Main TrackPage ───────────────────────────────────────────────────────────
export const TrackPage: React.FC = () => {
  const { activeTrainNumber, favorites, toggleFavorite } = useTrainStore();

  const trainNum = activeTrainNumber || '12919';
  const [telemetry, setTelemetry] = useState<TrainTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mountedRef = useRef(true);

  // Load data for the given train number
  const loadData = (num: string, showFullLoader = false) => {
    if (showFullLoader) setIsLoading(true);
    else setIsRefreshing(true);

    // Simulate realistic fetch delay so UI feels like real API call
    const delay = showFullLoader ? 1800 : 600;

    setTimeout(() => {
      if (!mountedRef.current) return;
      const data = getSimulatedTrainTelemetry(num);
      setTelemetry(data);
      setIsLoading(false);
      setIsRefreshing(false);
    }, delay);
  };

  // Reload when activeTrainNumber changes
  useEffect(() => {
    mountedRef.current = true;
    setTelemetry(null);
    loadData(trainNum, true);

    // Live refresh every 8 seconds (quiet update — no loader)
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      const fresh = getSimulatedTrainTelemetry(trainNum);
      setTelemetry(fresh);
    }, 8000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [trainNum]);

  if (isLoading || !telemetry) {
    return <LoadingScreen trainNumber={trainNum} />;
  }

  const isFav = favorites.includes(telemetry.train.number);

  const handleExportCSV = () => {
    const rows = ['Station Code,Station Name,Scheduled Arrival,Actual Arrival,Platform,Delay Minutes']
      .concat(
        telemetry.allStations.map(
          (s) => `${s.code},${s.name},${s.scheduledArrival},${s.actualArrival || s.scheduledArrival},${s.platform || '1'},${s.delayMinutes}`
        )
      )
      .join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(rows);
    link.download = `Train_${telemetry.train.number}_Schedule.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <GlassCard className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[#050816] via-[#0b132b]/80 to-[#050816]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-mono font-bold">
                TRAIN #{telemetry.train.number}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/40 text-xs font-medium">
                {telemetry.train.type}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono border flex items-center gap-1.5 ${
                  telemetry.status === 'RUNNING'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    telemetry.status === 'RUNNING' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                {telemetry.status === 'RUNNING' ? 'LIVE TRACKING ACTIVE' : 'STOPPED'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {telemetry.train.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <Train className="w-4 h-4 text-[#00E5FF]" />
                <span>{telemetry.train.origin} → {telemetry.train.destination}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Updated: {telemetry.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <CheckCircle className="w-3 h-3" />
                <span>Data loaded successfully</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <button
              onClick={() => toggleFavorite(telemetry.train.number)}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                isFav
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Saved' : 'Favourite'}</span>
            </button>

            <button
              onClick={() => loadData(trainNum, false)}
              disabled={isRefreshing}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 text-[#00E5FF] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="p-3 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* ── Delay Alert ─────────────────────────────────────────────────── */}
      {telemetry.delayMinutes > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-300">Delay Alert: </span>
              <span>
                Running +{telemetry.delayMinutes} mins behind schedule near{' '}
                {telemetry.currentStation?.name || 'en-route'}.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-400 flex-shrink-0">ETD updated</span>
        </div>
      )}

      {/* ── Main Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Map + Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-1 h-[450px] sm:h-[500px] relative overflow-hidden">
            <TrainMap telemetry={telemetry} />
          </GlassCard>
          <TelemetryGrid telemetry={telemetry} />
        </div>

        {/* Right: AI Insights + Station Timeline */}
        <div className="space-y-6">
          <AiInsightsCard insights={telemetry.aiInsights} />
          <StationTimeline stations={telemetry.allStations} />
        </div>
      </div>
    </motion.div>
  );
};
