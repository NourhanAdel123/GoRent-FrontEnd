'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { getTheme } from '../theme';
import { ColorModeProvider, useColorMode } from './ColorModeContext';

// RTL options passed to AppRouterCacheProvider — it handles useServerInsertedHTML internally
const rtlCacheOptions = {
  key: 'muirtl',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stylisPlugins: [prefixer, stylisRTLPlugin] as any[],
};

function InnerThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useColorMode();
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={rtlCacheOptions}>
      <ColorModeProvider>
        <InnerThemeProvider>{children}</InnerThemeProvider>
      </ColorModeProvider>
    </AppRouterCacheProvider>
  );
}
