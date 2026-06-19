import { ReactNode } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Toaster, resolveValue, toast } from 'react-hot-toast';
import { CustomCursor } from './components/ui/CustomCursor';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden cursor-none">
      <CustomCursor />
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-rose-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      {!isAuthRoute && <Sidebar />}
      <main className={`flex-1 w-full mx-auto relative z-10 ${isAuthRoute ? 'flex items-center justify-center p-4' : 'px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-12 h-screen overflow-y-auto custom-scrollbar'}`}>
        {children}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      >
        {(t) => (
          <div
            className={`${t.visible ? 'animate-slide-in-right' : 'animate-slide-out-right'
              } max-w-sm w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl shadow-primary-500/10 dark:shadow-none rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-slate-200/60 dark:border-slate-700/60`}
          >
            <div className="flex items-start p-4">
              <div className="shrink-0 pt-0.5">{t.icon}</div>

              <div className="ml-3 flex-1 whitespace-pre-line">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {resolveValue(t.message, t)}
                </p>
              </div>

              <div className="ml-4 shrink-0 flex">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none"
                >
                  <span className="sr-only">Cerrar</span>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="h-1.5 bg-slate-100 dark:bg-slate-700/50 w-full relative">
              <div
                className={`absolute top-0 right-0 h-full ${t.type === 'error' ? 'bg-red-500' : 'bg-primary-500'
                  } animate-shrink rounded-l-full`}
                style={{ animationDuration: `${t.duration || 3000}ms` }}
              />
            </div>
          </div>
        )}
      </Toaster>
    </div>
  );
}
