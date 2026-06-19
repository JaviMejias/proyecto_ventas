import { InputHTMLAttributes, ChangeEvent } from 'react';
import { Input } from './Input';
import { DollarSign } from 'lucide-react';

interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export function MoneyInput({
  label,
  error,
  value,
  onValueChange,
  className = '',
  ...props
}: MoneyInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');

    // Format as Chilean pesos (es-CL) if there is a number
    if (rawValue) {
      const formatted = parseInt(rawValue, 10).toLocaleString('es-CL');
      onValueChange(formatted);
    } else {
      onValueChange('');
    }
  };

  return (
    <Input
      label={label}
      error={error}
      type="text"
      value={value}
      onChange={handleChange}
      iconLeft={<DollarSign size={18} />}
      className={`font-mono text-lg font-semibold tracking-wide ${className}`}
      {...props}
    />
  );
}
