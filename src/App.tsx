import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainStore } from './store/useTrainStore';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { VoiceSearchModal } from './components/common/VoiceSearchModal';
import { GoogleAuthModal } from './components/common/GoogleAuthModal';

import { LandingPage } from './components/pages/LandingPage';
import { TrackPage } from './components/pages/TrackPage';
import { LiveMapPage } from './components/pages/LiveMapPage';
import { StationsPage } from './components/pages/StationsPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { ApiStatusPage } from './components/pages/ApiStatusPage';
import { TrainInfoPage } from './components/pages/TrainInfoPage';
import { AuthLoginPage } from './components/pages/AuthLoginPage';

import { ClickAnimationProvider } from './components/common/ClickAnimationProvider';
import { initSecurityShield } from './utils/securityShield';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  const { activeTab, user } = useTrainStore();

  React.useEffect(() => {
    const cleanup = initSecurityShield();
    return () => cleanup();
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'track':
        return <TrackPage />;
      case 'live-map':
        return <LiveMapPage />;
      case 'stations':
        return <StationsPage />;
      case 'history':
        return <HistoryPage />;
      case 'api-status':
        return <ApiStatusPage />;
      case 'train-info':
        return <TrainInfoPage />;
      default:
        return <LandingPage />;
    }
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <ClickAnimationProvider>
          <AuthLoginPage />
        </ClickAnimationProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClickAnimationProvider>
        <div className="min-h-screen bg-[#030712] cyber-grid animate-aurora text-white selection:bg-[#00E5FF] selection:text-black flex flex-col justify-between">
        <Navbar />

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <CommandPalette />
        <VoiceSearchModal />
        <GoogleAuthModal />

        <Footer />
      </div>
      </ClickAnimationProvider>
    </QueryClientProvider>
  );
};

export default App;
