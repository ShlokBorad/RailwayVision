import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, Map, Activity, Clock, Star, X } from 'lucide-react';
import { useTrainStore, type ActiveTab } from '../../store/useTrainStore';
import { POPULAR_TRAINS } from '../../services/railRadarApi';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveTrainNumber,
    setActiveTab,
    setMapStyleMode,
    favorites,
  } = useTrainStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredTrains = POPULAR_TRAINS.filter(
    (t) => t.number.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectTrain = (num: string) => {
    setActiveTrainNumber(num);
    setCommandPaletteOpen(false);
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl glass-panel rounded-2xl border border-[#00E5FF]/30 overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-slate-900/95"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search className="w-5 h-5 text-[#00E5FF]" />
            <input
              type="text"
              autoFocus
              placeholder="Search train name/number, switch pages, toggle map styles... (Esc to close)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* Quick Actions */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">Quick Navigation</div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleSelectTab('track')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-lg transition-colors text-left"
                >
                  <Activity className="w-4 h-4" /> Live Dashboard
                </button>
                <button
                  onClick={() => handleSelectTab('live-map')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-lg transition-colors text-left"
                >
                  <Map className="w-4 h-4" /> Fullscreen Radar Map
                </button>
                <button
                  onClick={() => handleSelectTab('stations')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-lg transition-colors text-left"
                >
                  <Train className="w-4 h-4" /> Station Boards
                </button>
                <button
                  onClick={() => handleSelectTab('history')}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] rounded-lg transition-colors text-left"
                >
                  <Clock className="w-4 h-4" /> Journey History
                </button>
              </div>
            </div>

            {/* Popular & Search Results */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
                Express Trains ({filteredTrains.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredTrains.map((train) => {
                  const isFav = favorites.includes(train.number);
                  return (
                    <button
                      key={train.number}
                      onClick={() => handleSelectTrain(train.number)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                          <Train className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#00E5FF] transition-colors flex items-center gap-2">
                            <span>{train.number}</span>
                            <span className="text-xs text-slate-400 font-normal">{train.name}</span>
                          </div>
                          <div className="text-xs text-slate-400">{train.origin} ➔ {train.destination}</div>
                        </div>
                      </div>
                      {isFav && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map Style Toggles */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">Map Layer Presets</div>
              <div className="flex gap-2 p-1">
                <button
                  onClick={() => { setMapStyleMode('DARK_CYBER'); setCommandPaletteOpen(false); }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:border-[#00E5FF] text-slate-300"
                >
                  Dark Cyber
                </button>
                <button
                  onClick={() => { setMapStyleMode('SATELLITE'); setCommandPaletteOpen(false); }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:border-[#00E5FF] text-slate-300"
                >
                  Satellite
                </button>
                <button
                  onClick={() => { setMapStyleMode('SIGNALS'); setCommandPaletteOpen(false); }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:border-[#00E5FF] text-slate-300"
                >
                  Signals View
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
