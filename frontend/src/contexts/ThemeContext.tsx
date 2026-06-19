import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'orange' | 'blue' | 'emerald' | 'violet' | 'pastel-pink';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_PALETTES: Record<ThemeColor, { 50: string; 100: string; 400: string; 500: string; 600: string }> = {
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
  },
  'pastel-pink': {
    50: '#fff0f3',
    100: '#ffe5ec',
    400: '#ffb3c6',
    500: '#ff8fab', // Pastel pink
    600: '#fb6f92',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    return (localStorage.getItem('theme-color') as ThemeColor) || 'orange';
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    localStorage.setItem('theme-color', newColor);
  };

  // Apply Mode
  useEffect(() => {
    const applyMode = (currentMode: ThemeMode) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (currentMode === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemPrefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(currentMode);
      }
    };

    applyMode(mode);

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyMode('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  // Apply Color
  useEffect(() => {
    const root = window.document.documentElement;
    const palette = COLOR_PALETTES[color];
    
    // Apply CSS Variables globally
    root.style.setProperty('--color-primary-50', palette[50]);
    root.style.setProperty('--color-primary-100', palette[100]);
    root.style.setProperty('--color-primary-400', palette[400]);
    root.style.setProperty('--color-primary-500', palette[500]);
    root.style.setProperty('--color-primary-600', palette[600]);
  }, [color]);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
