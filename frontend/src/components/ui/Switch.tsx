import { HTMLAttributes } from 'react';

interface SwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled, className = '', ...props }: SwitchProps) {
  return (
    <div
      className={`inline-flex items-center cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={() => !disabled && onChange(!checked)}
      {...props}
    >
      <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700/80 rounded-full transition-colors overflow-hidden flex-shrink-0 shadow-inner">
        {/* Active Gradient Background that slides in */}
        <div
          className={`absolute inset-0 bg-primary-500 transition-opacity duration-300 ${checked ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* The Toggle Knob */}
        <div
          className={`absolute top-[2px] start-[2px] bg-white border border-slate-200 shadow-sm rounded-full h-5 w-5 transition-all duration-300 transform ${checked ? 'translate-x-5 border-white' : 'translate-x-0'}`}
        />
      </div>
    </div>
  );
}
