'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PaletteMode } from '@mui/material';

type ColorModeContextType = {
    mode: PaletteMode;
    toggleColorMode: () => void;
    setMode: (mode: PaletteMode) => void;
};

const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'light',
    toggleColorMode: () => { },
    setMode: () => { },
});

const STORAGE_KEY = 'gorent-color-mode';

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
    // Always start with 'light' — matches the server render, avoiding hydration mismatches.
    // We sync to the real preference (localStorage / prefers-color-scheme) after mount.
    const [mode, setModeState] = useState<PaletteMode>('light');

    useEffect(() => {
        const saved = window.localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
        if (saved === 'light' || saved === 'dark') {
            setModeState(saved);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setModeState('dark');
        }
    }, []);

    const setMode = (newMode: PaletteMode) => {
        setModeState(newMode);
        window.localStorage.setItem(STORAGE_KEY, newMode);
    };

    const toggleColorMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    const value = useMemo(() => ({ mode, toggleColorMode, setMode }), [mode]);

    return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
    return useContext(ColorModeContext);
}
