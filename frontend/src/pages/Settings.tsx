import { Settings as SettingsIcon, Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { PageContainer } from '../components/ui/PageContainer';
import { Card } from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { mode, color, setMode, setColor } = useTheme();

  const themeOptions = [
    { id: 'light', label: 'Claro', icon: <Sun size={24} /> },
    { id: 'dark', label: 'Oscuro', icon: <Moon size={24} /> },
    { id: 'system', label: 'Sistema', icon: <Monitor size={24} /> },
  ] as const;

  const colorOptions = [
    { id: 'orange', label: 'Naranja', class: 'bg-[#f97316]' },
    { id: 'blue', label: 'Azul', class: 'bg-[#3b82f6]' },
    { id: 'emerald', label: 'Verde', class: 'bg-[#10b981]' },
    { id: 'violet', label: 'Morado', class: 'bg-[#8b5cf6]' },
    { id: 'pastel-pink', label: 'Rosa Pastel', class: 'bg-[#ff8fab]' },
  ] as const;

  return (
    <PageContainer title="Configuración" icon={<SettingsIcon size={24} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Aspecto */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor size={20} className="text-primary-500" /> Apariencia
          </h2>
          <Card className="p-6 border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-md">
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
              Selecciona el tema de la aplicación. Automático usará el tema de tu dispositivo.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    mode === opt.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700/50'
                  }`}
                >
                  <div className={`mb-2 ${mode === opt.id ? 'text-primary-500 scale-110' : ''} transition-transform`}>
                    {opt.icon}
                  </div>
                  <span className="font-semibold text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Color Principal */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette size={20} className="text-primary-500" /> Color Principal
          </h2>
          <Card className="p-6 border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-md">
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
              Personaliza el color de acento de la aplicación.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              {colorOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setColor(opt.id)}
                  title={opt.label}
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${opt.class} ${
                    color === opt.id ? 'ring-4 ring-offset-4 ring-offset-white dark:ring-offset-slate-900 ring-primary-500' : 'ring-2 ring-transparent'
                  }`}
                >
                  {color === opt.id && <Check size={24} className="text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
            
            {/* Visual Preview */}
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Vista Previa</span>
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 text-primary-500 flex items-center justify-center">
                  <Palette size={20} />
                </div>
                <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-2/3 rounded-full transition-colors duration-300"></div>
                </div>
                <div className="px-3 py-1.5 bg-primary-500 text-white text-xs font-bold rounded-lg shadow-sm shadow-primary-500/30 transition-colors duration-300">
                  Botón
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
