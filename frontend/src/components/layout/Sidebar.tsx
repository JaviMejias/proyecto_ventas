import { Link, useLocation } from 'react-router-dom';
import {
  Utensils,
  ClipboardList,
  ShoppingCart,
  Vault,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Carta', path: '/', icon: Utensils },
    { name: 'Ventas', path: '/sells', icon: ShoppingCart },
    { name: 'Historial', path: '/history', icon: ClipboardList },
    { name: 'Cierre', path: '/cash_closes', icon: Vault },
    { name: 'Ajustes', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-r border-white/20 dark:border-slate-800 sticky top-0 shadow-sm transition-colors duration-300 z-50">
        <div className="p-6 shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer mb-2">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-primary-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 transform group-hover:scale-105 transition-all duration-300">
              <Utensils size={24} />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gestión<span className="text-primary-500">Food</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group overflow-hidden ${isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(var(--color-primary-500),0.5)]" />
                )}
                <Icon
                  size={20}
                  className={`transition-transform duration-300 ${isActive ? 'text-primary-500 scale-110' : 'text-slate-400 group-hover:text-slate-500 group-hover:scale-110'}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 shrink-0 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-10 h-10 rounded-[1rem] bg-primary-100 dark:bg-primary-500/20 text-primary-500 flex items-center justify-center font-extrabold text-sm shadow-inner shadow-white/50 dark:shadow-none border border-white/50 dark:border-primary-500/20">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs font-medium text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isActive ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
              >
                <Icon size={isActive ? 24 : 20} className={`transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`} />
                {isActive && <span className="text-[10px] font-bold leading-none">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
