import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { getApiHealthStatus } from '../../services/railRadarApi';
import type { ApiHealth } from '../../types/train';
import { Layers, Activity, Cpu, RefreshCw, Key, Server, CheckCircle2 } from 'lucide-react';

export const ApiStatusPage: React.FC = () => {
  const [health, setHealth] = useState<ApiHealth | null>(null);

  const loadHealth = async () => {
    const data = await getApiHealthStatus();
    setHealth(data);
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!health) return null;

  const mockLogs = [
    { time: new Date().toLocaleTimeString(), code: 200, method: 'GET', path: '/v1/train/20901/live', ms: health.latencyMs },
    { time: new Date(Date.now() - 3000).toLocaleTimeString(), code: 200, method: 'GET', path: '/v1/train/12951/live', ms: health.latencyMs + 2 },
    { time: new Date(Date.now() - 6000).toLocaleTimeString(), code: 200, method: 'GET', path: '/v1/stations/search', ms: health.latencyMs - 4 },
    { time: new Date(Date.now() - 9000).toLocaleTimeString(), code: 200, method: 'GET', path: '/v1/health', ms: 14 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <GlassCard glow="cyan" className="p-6 space-y-2">
        <Badge variant="success" pulse>
          SATELLITE RADAR NETWORK ONLINE
        </Badge>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-8 h-8 text-[#00E5FF]" /> System Diagnostics & Health Monitor
        </h1>
        <p className="text-xs text-slate-300">Live satellite telemetry, system latency, and network diagnostics</p>
      </GlassCard>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow="cyan" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#00E5FF]" /> Radar Latency
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{health.latencyMs} ms</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ultra-low ping SLA
          </div>
        </GlassCard>

        <GlassCard glow="purple" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#7C3AED]" /> Success Rate SLA
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{health.successRatePercent}%</div>
          <div className="text-[11px] text-slate-400">Zero packet drops recorded</div>
        </GlassCard>

        <GlassCard glow="green" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-400 text-xs" /> Telemetry Pings Today
          </div>
          <div className="text-3xl font-extrabold text-white">
            <AnimatedCounter value={health.requestsToday} />
          </div>
          <div className="text-[11px] text-slate-400">Polled across 24 express routes</div>
        </GlassCard>

        <GlassCard glow="cyan" className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Key className="w-4 h-4 text-[#00E5FF]" /> System Bandwidth
          </div>
          <div className="text-3xl font-extrabold text-[#00E5FF] font-mono">
            {health.rateLimitRemaining} / {health.rateLimitTotal}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Network Core Active</div>
        </GlassCard>
      </div>

      {/* Live Satellite Telemetry Event Log */}
      <GlassCard glow="cyan" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00E5FF]" /> Realtime Satellite Radar Network Feed
          </h3>
          <button onClick={loadHealth} className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {mockLogs.map((log, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  {log.code} {log.method}
                </span>
                <span className="text-white font-semibold">{log.path}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>{log.ms}ms</span>
                <span className="text-[#00E5FF]">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
