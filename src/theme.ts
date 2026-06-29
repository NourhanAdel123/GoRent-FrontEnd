import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const tokens = {
  light: {
    primary: { main: '#0F766E', light: '#14B8A6', dark: '#0B5D57', contrastText: '#FFFFFF' },
    secondary: { main: '#F97316', light: '#FB923C', dark: '#C2570F', contrastText: '#FFFFFF' },
    error: { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: '#16A34A' },
    info: { main: '#0284C7' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
    divider: '#E2E8F0',
  },
  dark: {
    primary: { main: '#2DD4BF', light: '#5EEAD4', dark: '#14B8A6', contrastText: '#0F172A' },
    secondary: { main: '#FB923C', light: '#FDBA74', dark: '#F97316', contrastText: '#0F172A' },
    error: { main: '#F87171' },
    warning: { main: '#FBBF24' },
    success: { main: '#4ADE80' },
    info: { main: '#38BDF8' },
    background: { default: '#0F172A', paper: '#1E293B' },
    text: { primary: '#F1F5F9', secondary: '#94A3B8' },
    divider: '#334155',
  },
};

const shape = { borderRadius: 10 };

const typography: ThemeOptions['typography'] = {
  fontFamily: ['Cairo', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  h1: { fontWeight: 700, fontSize: '2.75rem' },
  h2: { fontWeight: 700, fontSize: '2.25rem' },
  h3: { fontWeight: 600, fontSize: '1.875rem' },
  h4: { fontWeight: 600, fontSize: '1.5rem' },
  h5: { fontWeight: 600, fontSize: '1.25rem' },
  h6: { fontWeight: 600, fontSize: '1.0625rem' },
  subtitle1: { fontWeight: 500 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  button: { fontWeight: 600, textTransform: 'none' },
};

function getComponents(mode: PaletteMode): ThemeOptions['components'] {
  return {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 18, paddingBlock: 9 },
        sizeLarge: { paddingInline: 24, paddingBlock: 12, fontSize: '1rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(15, 23, 42, 0.06)'
            : '0 2px 8px rgba(0, 0, 0, 0.4)',
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: 'inherit',
        }),
      },
    },

    
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },

    
    MuiListItemText: {
      styleOverrides: {
        primary: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
        secondary: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
      },
    },

    
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          '&:hover': {
            backgroundColor: theme.palette.action?.hover,
          },
          '&.Mui-selected': {
            backgroundColor:
              mode === 'light'
                ? 'rgba(15, 118, 110, 0.08)'
                : 'rgba(45, 212, 191, 0.12)',
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor:
                mode === 'light'
                  ? 'rgba(15, 118, 110, 0.12)'
                  : 'rgba(45, 212, 191, 0.16)',
            },
          },
        }),
      },
    },

    
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `2px solid ${theme.palette.divider}`,
        }),
      },
    },

    
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: theme.palette.action?.hover,
            color: theme.palette.primary.main,
          },
        }),
      },
    },

    
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.text.primary,
          color: theme.palette.background.paper,
          fontSize: '0.75rem',
        }),
      },
    },
  };
}

export function getTheme(mode: PaletteMode) {
  const colors = tokens[mode];

  return createTheme({
    direction: 'rtl',
    palette: {
      mode,
      ...colors,
    },
    shape,
    typography,
    components: getComponents(mode),
  });
}