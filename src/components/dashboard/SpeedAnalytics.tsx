import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { SpeedDataPoint } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { Activity, TrendingUp, Mountain } from 'lucide-react';

interface SpeedAnalyticsProps {
  data: SpeedDataPoint[];
}

export const SpeedAnalytics: React.FC<SpeedAnalyticsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Speed Profile Over Time */}
      <GlassCard glow="cyan" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00E5FF]" /> Telemetry Speed Profile
            </h3>
            <p className="text-xs text-slate-400">Velocity trends over last 30 minutes (KM/H)</p>
          </div>
          <span className="text-xs font-mono text-[#00E5FF] px-2 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Dynamic
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 180]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#00E5FF',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="#00E5FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#speedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* 2. Route Elevation Profile */}
      <GlassCard glow="purple" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mountain className="w-5 h-5 text-[#7C3AED]" /> Route Elevation Topology
            </h3>
            <p className="text-xs text-slate-400">Track altitude profile (Meters above sea level)</p>
          </div>
          <span className="text-xs font-mono text-purple-300 px-2 py-1 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/30">
            GPS Topology
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#7C3AED',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="elevation"
                stroke="#7C3AED"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#elevGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
