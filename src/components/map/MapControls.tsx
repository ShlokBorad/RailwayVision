import React, { useState } from 'react';
import type { MapStyleMode } from '../../types/train';
import { useTrainStore } from '../../store/useTrainStore';
import { Sun, Moon, Satellite, Radio, CloudRain, Locate, Maximize2, Minimize2, Layers } from 'lucide-react';

interface MapControlsProps {
  onRecenter?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onRecenter,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const { mapStyleMode, setMapStyleMode } = useTrainStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const styles: { mode: MapStyleMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'DARK_CYBER', label: 'Dark Cyber', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'LIGHT_GRID', label: 'Light Grid', icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: 'SATELLITE', label: 'Satellite', icon: <Satellite className="w-3.5 h-3.5" /> },
    { mode: 'SIGNALS', label: 'Signals', icon: <Radio className="w-3.5 h-3.5" /> },
    { mode: 'WEATHER', label: 'Weather', icon: <CloudRain className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 items-end">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="sm:hidden p-2.5 rounded-xl glass-panel bg-slate-900/90 text-[#00E5FF] border border-[#00E5FF]/40 shadow-lg flex items-center gap-1.5 text-xs font-bold"
      >
        <Layers className="w-4 h-4" />
        <span>Layers</span>
      </button>

      {/* Map layer toggle buttons */}
      <div className={`glass-panel p-1.5 rounded-xl border border-white/10 flex flex-col gap-1 shadow-2xl bg-slate-900/90 ${
        isMobileOpen ? 'flex' : 'hidden sm:flex'
      }`}>
        {styles.map((s) => {
          const isActive = mapStyleMode === s.mode;
          return (
            <button
              key={s.mode}
              onClick={() => {
                setMapStyleMode(s.mode);
                setIsMobileOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recenter & Fullscreen buttons */}
      <div className="glass-panel p-1.5 rounded-xl border border-white/10 flex flex-col gap-1 shadow-2xl bg-slate-900/90">
        {onRecenter && (
          <button
            onClick={onRecenter}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 transition-all"
            title="Center Map on Train"
          >
            <Locate className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">Center Train</span>
          </button>
        )}

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-[#00E5FF] hover:bg-white/5 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
