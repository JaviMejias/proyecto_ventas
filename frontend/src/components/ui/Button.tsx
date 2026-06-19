import { ButtonHTMLAttributes, ReactNode, useState, MouseEvent } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'dashed' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 outline-none focus:ring-4 focus:ring-primary-500/30';

  const variants = {
    primary:
      'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5',
    secondary:
      'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5',
    danger:
      'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-0.5',
    outline:
      'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-primary-500 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20',
    dashed:
      'border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 w-full',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-xs rounded-full gap-1.5',
    md: 'py-2.5 px-5 text-sm rounded-xl gap-2',
    lg: 'py-3.5 px-6 text-base rounded-2xl gap-2.5',
  };

  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} relative overflow-hidden`}
      disabled={disabled || isLoading}
      {...props}
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: Math.max(100, 100), // Size will be controlled by scale
            height: Math.max(100, 100),
          }}
        />
      ))}
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0 relative z-10">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
