'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PaletteMode } from '@mui/material';

type ColorModeContextType = {
    mode: PaletteMode;
    toggleColorMode: () => void;
    setMode: (mode: PaletteMode) => void;
};

const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'dark',
    toggleColorMode: () => { },
    setMode: () => { },
});

const STORAGE_KEY = 'gorent-color-mode';

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<PaletteMode>('dark');

    useEffect(() => {
        const saved = window.localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
        if (saved === 'light' || saved === 'dark') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setModeState(saved);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            setModeState('light');
        } else {
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