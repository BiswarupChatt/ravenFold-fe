import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e2952',
      light: '#3f4d7c',
      dark: '#121936',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d9461f',
      light: '#ef7956',
      dark: '#9f2f14',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f4ef',
      paper: '#ffffff',
    },
    text: {
      primary: '#18181b',
      secondary: '#5f6368',
    },
    divider: '#e6dfd5',
  },
  typography: {
    fontFamily:
      '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
      lineHeight: 1,
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.9rem, 3vw, 3rem)',
      lineHeight: 1.08,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.15,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
          paddingInline: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          border: '1px solid #e6dfd5',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
})

export default theme
