import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  searchable?: boolean;
  className?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  iconLeft?: React.ReactNode;
}

export function Select({
  label,
  options,
  value,
  onChange,
  searchable = false,
  className = '',
  required,
  placeholder = 'Selecciona...',
  error,
  iconLeft,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(target);
      const clickedOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

      if (clickedOutsideWrapper && clickedOutsideDropdown) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      const updatePosition = () => {
        const rect = wrapperRef.current!.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownMaxHeight = 320; // Search bar + max-h-64 (256px) + padding

        let newStyle: React.CSSProperties = {
          position: 'fixed',
          left: rect.left,
          width: rect.width,
        };

        if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
          // No hay espacio abajo, abrir hacia arriba
          newStyle.bottom = window.innerHeight - rect.top;
          newStyle.transformOrigin = 'bottom';
          newStyle.marginBottom = '8px';
        } else {
          // Abrir hacia abajo (por defecto)
          newStyle.top = rect.bottom;
          newStyle.transformOrigin = 'top';
          newStyle.marginTop = '8px';
        }

        setDropdownStyle(newStyle);
      };

      updatePosition();

      // Close on scroll outside to prevent floating detached menus
      const handleScroll = (e: Event) => {
        const target = e.target as Node;
        if (dropdownRef.current && dropdownRef.current.contains(target)) return;
        setIsOpen(false);
      };

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className="z-[9999] bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up"
      style={{ ...dropdownStyle, animationDuration: '0.2s' }}
    >
      {searchable && (
        <div className="p-3 border-b border-slate-100 dark:border-slate-700/50 sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md z-10">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      <ul className="max-h-64 overflow-y-auto p-2 space-y-1">
        {filteredOptions.length === 0 ? (
          <li className="px-4 py-3 text-sm text-slate-500 text-center">
            No se encontraron resultados
          </li>
        ) : (
          filteredOptions.map((opt) => {
            const isSelected = opt.value === value;
            if (opt.value === '' && searchable) return null;

            return (
              <li
                key={opt.value}
                className={`px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-between text-sm transition-colors ${isSelected ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={16} className="text-primary-500 flex-shrink-0 ml-2" />}
              </li>
            );
          })
        )}
      </ul>
    </div>
  ) : null;

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700'} rounded-2xl cursor-pointer flex justify-between items-center shadow-inner transition-all duration-300 ${isOpen ? (error ? 'ring-4 ring-red-500/20' : 'ring-4 ring-primary-500/20 border-primary-500') : error ? '' : 'hover:border-slate-300 dark:hover:border-slate-600'} ${iconLeft ? 'pl-11' : ''} ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {iconLeft && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
            {iconLeft}
          </div>
        )}
        <span
          className={`truncate ${!selectedOption || selectedOption.value === '' ? 'text-slate-400' : 'text-slate-900 dark:text-white font-medium'}`}
        >
          {selectedOption && selectedOption.value !== '' ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && createPortal(dropdownContent, document.body)}
      {error && (
        <p className="mt-1.5 ml-1 text-sm text-red-500 font-medium animate-fade-in-up">{error}</p>
      )}
    </div>
  );
}
