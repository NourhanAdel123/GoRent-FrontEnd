'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { PaletteMode } from '@mui/material';

type ColorModeContextType = {
  mode: PaletteMode;
  toggleColorMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  setMode: () => {},
});

const STORAGE_KEY = 'gorent-color-mode';

function getInitialMode(): PaletteMode {
  
  if (typeof window === 'undefined') return 'light';

  const saved = window.localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
  if (saved === 'light' || saved === 'dark') return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  
  const [mode, setModeState] = useState<PaletteMode>('light');

  
  useEffect(() => {
    setModeState(getInitialMode());
  }, []);

  
  const setMode = useCallback((newMode: PaletteMode) => {
    setModeState(newMode);
    window.localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, toggleColorMode, setMode }),
    [mode, toggleColorMode, setMode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}