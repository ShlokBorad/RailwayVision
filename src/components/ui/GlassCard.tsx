import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'green' | 'amber' | 'danger' | 'neutral' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  hoverEffect = true,
  ...props
}) => {
  const glowClasses = {
    cyan: 'hover:border-[#00E5FF]/40 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]',
    purple: 'hover:border-[#7C3AED]/40 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)]',
    green: 'hover:border-[#22C55E]/40 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]',
    amber: 'hover:border-[#F59E0B]/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]',
    danger: 'hover:border-[#EF4444]/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]',
    neutral: 'hover:border-white/20',
    none: 'hover:border-white/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hoverEffect ? { y: -3 } : undefined}
      whileTap={hoverEffect ? { scale: 0.985 } : undefined}
      className={`glass-panel rounded-2xl p-5 border border-white/10 transition-all duration-300 relative overflow-hidden backdrop-blur-xl bg-slate-900/60 ${
        hoverEffect ? glowClasses[glow] : ''
      } ${className}`}
      {...props}
    >
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      {children}
    </motion.div>
  );
};
