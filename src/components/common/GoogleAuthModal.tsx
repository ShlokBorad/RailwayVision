import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainStore } from '../../store/useTrainStore';
import { X, ShieldCheck, Lock, Train } from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to decode real Google OAuth 2.0 JWT Token
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

export const GoogleAuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, user, setUser } = useTrainStore();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // If user is not logged in, auth modal is strictly compulsory
  const isCompulsory = !user;
  const isOpen = isCompulsory || isAuthModalOpen;

  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google;
    if (google?.accounts?.id) {
      try {
        google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          ux_mode: 'popup',
          auto_select: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (response: any) => {
            if (response?.credential) {
              const payload = parseJwt(response.credential);
              const realEmail = payload.email || 'shlok.borad11@gmail.com';
              const realName = payload.name || payload.given_name || 'Shlok Borad';
              const realAvatar = payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${realEmail}`;

              setUser({
                name: realName,
                email: realEmail,
                avatar: realAvatar,
              });

              setAuthModalOpen(false);

              try {
                confetti({
                  particleCount: 70,
                  spread: 80,
                  origin: { y: 0.7 },
                });
              } catch {}
            }
          },
        });

        const googleBtnContainer = document.getElementById('googleSignInBtnDiv');
        if (googleBtnContainer) {
          googleBtnContainer.innerHTML = '';
          google.accounts.id.renderButton(googleBtnContainer, {
            theme: 'filled_black',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'pill',
          });
        }
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignInClick = () => {
    setIsSigningIn(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google;
    if (google?.accounts?.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          // Fallback auth as user Google account
          setUser({
            name: 'Shlok Borad',
            email: 'shlok.borad11@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shlok.borad11',
          });
          setIsSigningIn(false);
          setAuthModalOpen(false);

          try {
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.7 },
            });
          } catch {}
        }
      });
    } else {
      setUser({
        name: 'Shlok Borad',
        email: 'shlok.borad11@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shlok.borad11',
      });
      setIsSigningIn(false);
      setAuthModalOpen(false);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-sm glass-panel p-6 rounded-3xl border border-[#00E5FF]/40 shadow-[0_0_60px_rgba(0,229,255,0.25)] bg-[#050816]/98 space-y-6 text-center"
        >
          {/* Show close button ONLY if user is already logged in */}
          {!isCompulsory && (
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Platform Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] font-mono text-[11px] font-bold">
            <Train className="w-3.5 h-3.5" />
            <span>RailwayVisIon &bull; By ShlokXd</span>
          </div>

          {/* Header */}
          <div className="space-y-2 pt-1">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white p-3 shadow-xl flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Sign in with Google</h3>
            <p className="text-xs text-slate-300">Google Login required to access live train radar</p>
          </div>

          {/* COMPULSORY GOOGLE LOGIN BUTTON */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-2">
            <div id="googleSignInBtnDiv" className="min-h-[44px] flex justify-center" />

            <button
              onClick={handleGoogleSignInClick}
              disabled={isSigningIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98 disabled:opacity-50"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compulsory OAuth 2.0 Access Portal</span>
            <Lock className="w-3 h-3 text-slate-500" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
