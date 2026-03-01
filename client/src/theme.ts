import { createTheme, alpha } from '@mui/material/styles';

/**
 * APEX Professional Enterprise Theme - HIGH FIDELITY REPLICA
 * Specifications based on apex-dashboard.pages.dev
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Tailwind Blue 500
      light: '#eff6ff', // Blue 50
      dark: '#2563eb', // Blue 600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6b7280', // Gray 500
    },
    success: {
      main: '#10b981', // Emerald 500
    },
    warning: {
      main: '#f59e0b', // Amber 500
    },
    error: {
      main: '#ef4444', // Red 500
    },
    background: {
      default: '#f9fafb', // Gray 50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Gray 900
      secondary: '#6b7280', // Gray 500
    },
    divider: '#e5e7eb', // Gray 200
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "system-ui", "-apple-system", sans-serif',
    h1: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.025em', color: '#111827' },
    h2: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', color: '#111827' },
    h3: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.025em', color: '#111827' },
    h4: { fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.025em' },
    h6: { fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.025em' },
    subtitle1: { fontWeight: 500, fontSize: '1rem', color: '#6b7280' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem', color: '#111827' },
    body1: { fontSize: '0.875rem', lineHeight: 1.57, color: '#111827' },
    body2: { fontSize: '0.75rem', lineHeight: 1.57, color: '#6b7280' },
    button: { fontWeight: 600, textTransform: 'none', fontSize: '0.875rem' },
    overline: { fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.625rem', textTransform: 'uppercase' },
  },
  shape: {
    borderRadius: 12, // Exact Apex Dashboard card radius
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    ...Array(19).fill('none'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f9fafb',
          color: '#111827',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#e5e7eb', borderRadius: '10px' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Exact Apex Button radius
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#3b82f6',
          '&:hover': { backgroundColor: '#2563eb' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f9fafb',
          color: '#6b7280',
          fontWeight: 600,
          fontSize: '0.75rem',
          padding: '12px 24px',
          borderBottom: '1px solid #e5e7eb',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        root: {
          padding: '16px 24px',
          borderColor: '#f3f4f6',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#fff',
            '& fieldset': { borderColor: '#e5e7eb' },
            '&:hover fieldset': { borderColor: '#3b82f6' },
            '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '2px' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;
