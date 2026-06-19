import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  hoverShadowClass?: string;
}

export function Card({ 
  children, 
  className = '', 
  hoverEffect = false,
  hoverShadowClass = 'hover:shadow-primary-500/20 dark:hover:shadow-primary-500/30'
}: CardProps) {
  const hoverStyles = hoverEffect
    ? `hover:-translate-y-1.5 hover:shadow-2xl ${hoverShadowClass} transition-all duration-500 ease-out group`
    : 'transition-all duration-300 ease-out';

  return (
    <div
      className={`relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-700/50 overflow-hidden ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
