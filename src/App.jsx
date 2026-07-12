import { Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import AppRoutes from './routes/index.jsx'
import AuthModalProvider from './context/AuthModalProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import useCartSessionSync from './hooks/useCartSessionSync.js'

export default function App() {
  useCartSessionSync()

  const loadingFallback = (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={28} />
    </Box>
  )

  return (
    <AuthModalProvider>
      <ToastProvider>
        <Suspense fallback={loadingFallback}>
          <AppRoutes />
        </Suspense>
      </ToastProvider>
    </AuthModalProvider>
  )
}
