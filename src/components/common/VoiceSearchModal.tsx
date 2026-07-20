import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Volume2, Search } from 'lucide-react';
import { useTrainStore } from '../../store/useTrainStore';

export const VoiceSearchModal: React.FC = () => {
  const { isVoiceSearchOpen, setVoiceSearchOpen, setActiveTrainNumber } = useTrainStore();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isVoiceSearchOpen) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscript('Speech recognition is not supported in this browser. Please type train number.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(text);

      // Check if train number detected
      const numberMatch = text.match(/\d{5}/);
      if (numberMatch) {
        setActiveTrainNumber(numberMatch[0]);
        setVoiceSearchOpen(false);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }

    return () => {
      try {
        recognition.stop();
      } catch {
        // cleanup
      }
    };
  }, [isVoiceSearchOpen, setActiveTrainNumber, setVoiceSearchOpen]);

  return (
    <AnimatePresence>
      {isVoiceSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-panel p-6 rounded-3xl border border-[#00E5FF]/30 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.2)] bg-slate-900/90"
          >
            <button
              onClick={() => setVoiceSearchOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="my-6 flex flex-col items-center">
              <div className="relative mb-6">
                {isListening && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -inset-4 rounded-full bg-[#00E5FF]/30 blur-xl"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                      className="absolute -inset-8 rounded-full bg-[#7C3AED]/20 blur-2xl"
                    />
                  </>
                )}
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all ${
                    isListening
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.5)]'
                      : 'bg-slate-800 border-white/10 text-slate-400'
                  }`}
                >
                  <Mic className="w-10 h-10 animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#00E5FF]" />
                {isListening ? 'Listening for Train Name or Number...' : 'Voice Search Idle'}
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mb-4">
                Say something like <span className="text-[#00E5FF] font-mono">"Track Vande Bharat 20901"</span> or <span className="text-[#00E5FF] font-mono">"Rajdhani Express"</span>
              </p>

              {transcript && (
                <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-mono flex items-center justify-center gap-2">
                  <Search className="w-4 h-4 text-[#00E5FF]" />
                  "{transcript}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
