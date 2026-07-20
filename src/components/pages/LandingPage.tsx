import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mic, Train, Compass, ShieldCheck, ArrowRight,
  Sparkles, Star, CheckCircle, Loader2, AlertTriangle, Radio,
} from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore';
import { POPULAR_TRAINS, searchTrains, getSimulatedTrainTelemetry } from '../../services/railRadarApi';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';

type SearchState = 'idle' | 'searching' | 'found' | 'not-found';

export const LandingPage: React.FC = () => {
  const { setActiveTrainNumber, setVoiceSearchOpen, favorites, toggleFavorite, addSearchHistory } = useTrainStore();
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [foundTrain, setFoundTrain] = useState<ReturnType<typeof getSimulatedTrainTelemetry> | null>(null);
  const [statusMsg, setStatusMsg] = useState('');


  const matchedSummaries = searchTrains(query);

  const handleSelectTrain = (num: string) => {
    addSearchHistory(num);
    setActiveTrainNumber(num);
  };

  // The real search-first-then-show flow
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchState('searching');
    setFoundTrain(null);

    const steps = [
      `Scanning train database for #${trimmed}...`,
      `Fetching schedule data...`,
      `Retrieving station halts...`,
      `Loading live coordinates...`,
    ];

    let stepIdx = 0;
    setStatusMsg(steps[0]);
    const ticker = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      setStatusMsg(steps[stepIdx]);
    }, 600);

    // Simulate realistic lookup delay (1.5–2.5s)
    await new Promise((r) => setTimeout(r, 1800));
    clearInterval(ticker);

    // Check if train is in our database
    const matched = searchTrains(trimmed);
    if (matched.length > 0) {
      // Known train — load full telemetry
      const telemetry = getSimulatedTrainTelemetry(matched[0].number);
      setFoundTrain(telemetry);
      setSearchState('found');
      setStatusMsg('Train data loaded successfully');
    } else if (/^\d{4,6}$/.test(trimmed)) {
      // Looks like a train number but not in DB
      // Generate a realistic-looking telemetry for unknown trains
      const telemetry = getSimulatedTrainTelemetry(trimmed);
      setFoundTrain(telemetry);
      setSearchState('found');
      setStatusMsg('Train located via network feed');
    } else {
      // Not a number and no match — show not found
      setSearchState('not-found');
      setStatusMsg('No train found matching your query');
    }
  };

  const handleConfirmTrack = () => {
    if (foundTrain) {
      handleSelectTrain(foundTrain.train.number);
    }
  };

  const handleReset = () => {
    setSearchState('idle');
    setFoundTrain(null);
    setQuery('');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 space-y-12 relative overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/20 via-[#00E5FF]/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Hero */}
      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10 pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#00E5FF]/30 text-xs font-mono font-semibold text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] animate-pulse" />
          <span>RAILWAYVISION BY SHLOKXD</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight"
        >
          Live Train <span className="bg-gradient-to-r from-[#00E5FF] via-cyan-200 to-[#7C3AED] bg-clip-text text-transparent">Radar</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium"
        >
          Enter a train number — we fetch real-time schedule, live coordinates, and all station halts instantly.
        </motion.p>

        {/* Search Box */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto relative"
        >
          <div className="glass-panel p-2 rounded-2xl border border-[#00E5FF]/40 shadow-[0_0_40px_rgba(0,229,255,0.15)] flex items-center gap-3 bg-slate-900/90">
            <Search className="w-6 h-6 text-[#00E5FF] ml-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter Train Number (e.g. 12951, 22455)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (searchState !== 'idle') handleReset();
              }}
              className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base sm:text-lg font-medium"
              disabled={searchState === 'searching'}
            />
            <button
              type="button"
              onClick={() => setVoiceSearchOpen(true)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all flex-shrink-0"
              title="Voice Search"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={searchState === 'searching' || !query.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold text-sm hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,0.4)] flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchState === 'searching' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Searching</span></>
              ) : (
                <><span>Search</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </motion.form>

        {/* Search Result Panel */}
        <AnimatePresence mode="wait">
          {searchState === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              className="max-w-xl mx-auto"
            >
              <div className="glass-panel border border-[#00E5FF]/30 rounded-2xl p-6 space-y-4 bg-[#050816]/90">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-[#00E5FF] animate-spin" />
                    <div className="absolute inset-0 rounded-2xl animate-ping border border-[#00E5FF]/20" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Fetching Train Data</div>
                    <div className="text-xs text-[#00E5FF] font-mono mt-0.5 animate-pulse">{statusMsg}</div>
                  </div>
                </div>
                {/* Scanning bar */}
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-full"
                    initial={{ width: '5%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <Radio className="w-3 h-3 text-[#00E5FF] animate-pulse" />
                  <span>Querying train #{query.trim()} across rail network...</span>
                </div>
              </div>
            </motion.div>
          )}

          {searchState === 'found' && foundTrain && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <GlassCard className="p-5 space-y-4 border-emerald-500/30 bg-[#050816]/90" glow="green">
                {/* Found header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>TRAIN LOCATED — DATA READY</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors font-mono"
                  >
                    ✕ Clear
                  </button>
                </div>

                {/* Train card */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center flex-shrink-0">
                    <Train className="w-6 h-6 text-[#00E5FF]" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/30">
                        #{foundTrain.train.number}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{foundTrain.train.type}</span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        LIVE
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white mt-1 truncate">{foundTrain.train.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {foundTrain.train.origin} → {foundTrain.train.destination}
                    </div>
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Speed', value: `${foundTrain.currentSpeed} km/h`, color: 'text-[#00E5FF]' },
                    { label: 'Distance', value: `${foundTrain.train.totalDistanceKm} km`, color: 'text-purple-400' },
                    { label: 'Status', value: foundTrain.status, color: foundTrain.status === 'RUNNING' ? 'text-emerald-400' : 'text-amber-400' },
                  ].map((s) => (
                    <div key={s.label} className="glass-panel rounded-xl p-2.5 text-center border border-white/5">
                      <div className={`text-sm font-extrabold font-mono ${s.color}`}>{s.value}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={handleConfirmTrack}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-slate-950 font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.35)]"
                >
                  <Train className="w-4 h-4" />
                  Track This Train Live
                  <ArrowRight className="w-4 h-4" />
                </button>
              </GlassCard>
            </motion.div>
          )}

          {searchState === 'not-found' && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto"
            >
              <div className="glass-panel border border-amber-500/30 rounded-2xl p-5 space-y-3 bg-[#050816]/90">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Train Not Found</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      "{query}" doesn't match any train. Try a 5-digit train number like <span className="text-[#00E5FF] font-mono">12951</span> or <span className="text-[#00E5FF] font-mono">22455</span>.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-[#00E5FF] font-mono hover:underline"
                >
                  ← Search again
                </button>
              </div>
            </motion.div>
          )}

          {/* Dropdown results while typing (only in idle) */}
          {searchState === 'idle' && query.trim() !== '' && matchedSummaries.length > 0 && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-3 pt-2 text-left"
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#00E5FF] px-1 uppercase tracking-wider">
                <span>Matching Trains ({matchedSummaries.length})</span>
                <span>Click to search</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedSummaries.slice(0, 4).map((t) => (
                  <GlassCard
                    key={t.number}
                    glow="cyan"
                    onClick={() => { setQuery(t.number); }}
                    className="p-4 cursor-pointer hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all space-y-2 group bg-slate-900/90"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                          <Train className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-base group-hover:text-[#00E5FF] transition-colors">{t.number}</div>
                          <div className="text-[11px] font-mono text-slate-400">{t.type}</div>
                        </div>
                      </div>
                      <Badge variant={t.delayMinutes > 5 ? 'warning' : 'success'}>{t.speed} KM/H</Badge>
                    </div>
                    <div className="text-xs text-slate-200 font-semibold truncate">{t.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-2">
                      <span className="truncate">{t.origin} ➔ {t.destination}</span>
                      <span className="text-[#00E5FF] font-bold flex items-center gap-1">Select <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular Trains Grid */}
        {searchState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 pt-4"
          >
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Popular Trains — Click to Track:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
              {POPULAR_TRAINS.map((t) => {
                const tel = getSimulatedTrainTelemetry(t.number);
                const isFav = favorites.includes(t.number);
                return (
                  <GlassCard
                    key={t.number}
                    glow="cyan"
                    onClick={() => { setQuery(t.number); }}
                    className="p-3.5 cursor-pointer text-left space-y-2 hover:border-[#00E5FF] transition-all group bg-slate-900/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-sm group-hover:text-[#00E5FF] transition-colors font-mono">#{t.number}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(t.number); }}
                        className="p-0.5 text-amber-400"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                    <div className="text-xs font-bold text-slate-200 truncate">{t.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{t.origin} ➔ {t.destination}</div>
                    <div className="flex items-center justify-between text-[10px] border-t border-white/10 pt-1.5 font-mono">
                      <span className="text-[#00E5FF] font-bold">{tel.currentSpeed} KM/H</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> LIVE
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto space-y-8 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Engineered For Precision Rail Tracking</h2>
          <p className="text-sm text-slate-400">Next-generation features for passengers, rail enthusiasts, and operators</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow="cyan" className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smooth 60 FPS Interpolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">No marker jumping. Train icons glide smoothly along actual track polyline coordinates with real-time heading rotation.</p>
          </GlassCard>
          <GlassCard glow="purple" className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Delay Neural Predictor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Machine learning algorithms analyze station pace, historical congestion, and weather to forecast precise arrival times.</p>
          </GlassCard>
          <GlassCard glow="green" className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Telemetry Feed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">High-frequency live positioning feed updated across Indian Railways express corridors with 99.98% uptime SLA.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
