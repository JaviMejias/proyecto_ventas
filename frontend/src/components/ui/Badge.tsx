import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'blue' | 'purple' | 'gray' | 'primary' | 'orange';
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'gray', icon, className = '' }: BadgeProps) {
  const variants = {
    green:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    purple:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    primary:
      'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-md shadow-primary-500/20',
    gray: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${variants[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
