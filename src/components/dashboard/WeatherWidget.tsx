import React from 'react';
import type { WeatherInfo } from '../../types/train';
import { GlassCard } from '../ui/GlassCard';
import { Sun, Wind, Droplets, Eye, CloudRain } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherInfo;
  locationName: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, locationName }) => {
  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" /> Track Atmospheric Weather
          </h3>
          <p className="text-xs text-slate-400">Atmospheric conditions near {locationName}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white font-mono">{weather.tempC}°C</div>
          <div className="text-xs text-amber-300 font-medium">{weather.condition}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <Wind className="w-5 h-5 text-[#00E5FF]" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Wind Velocity</div>
            <div className="text-sm font-bold text-white font-mono">{weather.windKmH} km/h</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Humidity</div>
            <div className="text-sm font-bold text-white font-mono">{weather.humidity}%</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <Eye className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Visibility</div>
            <div className="text-sm font-bold text-white font-mono">{weather.visibilityKm} km</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <CloudRain className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Precipitation</div>
            <div className="text-sm font-bold text-white font-mono">{weather.rainChance}%</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
