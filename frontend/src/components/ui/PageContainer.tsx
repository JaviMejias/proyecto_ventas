import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageContainerProps {
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  backTo?: string;
  tabs?: ReactNode;
  noCard?: boolean;
}

export function PageContainer({ 
  title, 
  description, 
  action, 
  children, 
  icon, 
  backTo, 
  tabs,
  noCard = false 
}: PageContainerProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              {icon && (
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-500 shrink-0">
                  {icon}
                </div>
              )}
              {title}
            </h1>
            {description && <p className="text-slate-500 dark:text-slate-400 mt-1 pl-[3.75rem]">{description}</p>}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
          {tabs && <div>{tabs}</div>}
          {action && <div>{action}</div>}
        </div>
      </div>

      {noCard ? (
        children
      ) : (
        <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-slate-700/50 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden">
          {/* Subtle glow effect behind the content */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10">{children}</div>
        </div>
      )}
    </div>
  );
}
