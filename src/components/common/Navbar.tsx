import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Train,
  Search,
  Map,
  Activity,
  Building2,
  Clock,
  Info,
  Mic,
  Command,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useTrainStore, type ActiveTab } from '../../store/useTrainStore';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setCommandPaletteOpen,
    setVoiceSearchOpen,
    user,
    setAuthModalOpen,
    logout,
  } = useTrainStore();
  const { scrollDirection, isTop } = useScrollDirection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Train className="w-4 h-4 text-[#00E5FF]" /> },
    { id: 'track', label: 'Track Train', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'live-map', label: 'Live Map', icon: <Map className="w-4 h-4 text-purple-400" /> },
    { id: 'stations', label: 'Stations', icon: <Building2 className="w-4 h-4 text-amber-400" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4 text-blue-400" /> },
    { id: 'train-info', label: 'Specs', icon: <Info className="w-4 h-4 text-pink-400" /> },
  ];

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: scrollDirection === 'down' && !isTop ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${
        isTop
          ? 'bg-transparent py-4'
          : 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 py-2.5 shadow-2xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Creator Credit */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] p-[1px] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-all">
              <Train className="w-4 h-4 text-[#00E5FF] group-hover:text-white transition-colors" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E5FF]" />
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              RailwayVisIon
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              By ShlokXd
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 glass-panel px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/25 to-[#7C3AED]/35 border border-[#00E5FF]/40 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 text-slate-300 hover:text-white text-xs font-medium transition-all group"
          >
            <Search className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Search</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-slate-400 font-mono group-hover:text-slate-200">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          <button
            onClick={() => setVoiceSearchOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all"
            title="Voice Search"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          {/* User Profile / Google Sign-In */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 transition-all active:scale-95"
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full bg-slate-800" />
                  <span className="text-xs font-semibold text-white max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-panel p-2.5 rounded-2xl border border-white/10 shadow-2xl bg-[#050816]/95 z-[9999]"
                    >
                      <div className="px-3 py-2 border-b border-white/10 space-y-0.5">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-bold mt-1"
                      >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-1 rounded-full border border-white/20"
            >
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" />
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-2 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Login</span>
            </button>
          )}

          <button
            onClick={() => setVoiceSearchOpen(true)}
            className="p-2 rounded-xl bg-white/5 text-[#00E5FF]"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/5 text-slate-200 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel border-b border-white/10 px-4 py-4 space-y-2 mt-2 bg-slate-900/95"
          >
            {user ? (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-mono text-xs font-bold flex items-center justify-between">
                <span>RailwayVisIon</span>
                <span>By ShlokXd</span>
              </div>
            )}

            <button
              onClick={() => { setCommandPaletteOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#00E5FF]" />
                <span>Search train or station...</span>
              </div>
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-left ${
                    activeTab === item.id
                      ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                      : 'bg-white/5 text-slate-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
