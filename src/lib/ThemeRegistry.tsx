'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import theme from '../theme';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, stylisRTLPlugin],
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
