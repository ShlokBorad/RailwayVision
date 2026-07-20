import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'success' | 'warning' | 'danger' | 'neutral';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  pulse = false,
  className = '',
}) => {
  const variantStyles = {
    cyan: 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30',
    purple: 'bg-[#7C3AED]/10 text-[#a78bfa] border-[#7C3AED]/30',
    success: 'bg-[#22C55E]/10 text-[#4ade80] border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/10 text-[#fbbf24] border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/10 text-[#f87171] border-[#EF4444]/30',
    neutral: 'bg-white/5 text-slate-300 border-white/10',
  };

  const dotColors = {
    cyan: 'bg-[#00E5FF]',
    purple: 'bg-[#7C3AED]',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
};
