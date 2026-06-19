import { InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function DatePicker({ label, error, className = '', ...props }: DatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
          <Calendar size={20} />
        </div>
        <input
          type="date"
          className={`w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500'} rounded-2xl focus:ring-4 outline-none text-slate-900 dark:text-white transition-all duration-300 placeholder:text-slate-400 shadow-inner [color-scheme:light] dark:[color-scheme:dark] ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-sm text-red-500 font-medium animate-fade-in-up">{error}</p>
      )}
    </div>
  );
}
