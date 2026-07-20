import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { useTrainStore } from '../../store/useTrainStore';
import { POPULAR_TRAINS } from '../../services/railRadarApi';
import { Clock, Star, Train, Trash2, ArrowRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { favorites, toggleFavorite, searchHistory, clearSearchHistory, setActiveTrainNumber } = useTrainStore();

  const favTrains = POPULAR_TRAINS.filter((t) => favorites.includes(t.number));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <GlassCard glow="purple" className="p-6 space-y-2">
        <Badge variant="purple">PERSISTENT TELEMETRY STORAGE</Badge>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Clock className="w-8 h-8 text-[#7C3AED]" /> Journey History & Favorites
        </h1>
        <p className="text-xs text-slate-300">Quick launch bookmarked express trains and recent search queries</p>
      </GlassCard>

      {/* Bookmarked Trains Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Bookmarked Trains ({favTrains.length})
          </h2>
        </div>

        {favTrains.length === 0 ? (
          <GlassCard glow="none" className="p-8 text-center text-slate-400 text-sm">
            No bookmarked trains yet. Click the star icon on any train dashboard to save it here.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favTrains.map((t) => (
              <GlassCard key={t.number} glow="cyan" className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-[#00E5FF]" />
                    <span className="font-extrabold text-white text-lg">{t.number}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(t.number)}
                    className="p-1 text-amber-400 hover:text-amber-200"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>

                <div className="text-sm font-semibold text-[#00E5FF] truncate">{t.name}</div>
                <div className="text-xs text-slate-400">{t.origin} ➔ {t.destination}</div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">{t.type}</span>
                  <button
                    onClick={() => setActiveTrainNumber(t.number)}
                    className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-bold hover:bg-[#00E5FF] hover:text-slate-950 transition-all flex items-center gap-1"
                  >
                    <span>Radar</span> <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Search History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00E5FF]" /> Recent Searches
          </h2>
          {searchHistory.length > 0 && (
            <button
              onClick={clearSearchHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        <GlassCard glow="none" className="p-4 space-y-2">
          {searchHistory.length === 0 ? (
            <p className="text-xs text-slate-400">Search history is clear.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTrainNumber(q)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF] text-slate-300 hover:text-[#00E5FF] text-xs font-mono transition-all"
                >
                  "{q}"
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
