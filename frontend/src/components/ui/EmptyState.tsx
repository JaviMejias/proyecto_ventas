import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-white/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
      <div className="w-20 h-20 bg-primary-100 dark:bg-primary-500/10 text-primary-500 flex items-center justify-center rounded-full mb-6 animate-bounce shadow-xl shadow-primary-500/20">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
