import { Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import AppRoutes from './routes/index.jsx'
import AuthModalProvider from './context/AuthModalProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import useCartSessionSync from './hooks/useCartSessionSync.js'
import featureFlag from './config/featureFlag.js'
import ComingSoon from './pages/ComingSoon.jsx'

function CommerceApp() {
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
        <ScrollToTop />
        <Suspense fallback={loadingFallback}>
          <AppRoutes />
        </Suspense>
      </ToastProvider>
    </AuthModalProvider>
  )
}

export default function App() {
  if (featureFlag.showComingSoonLanding) {
    return <ComingSoon />
  }

  return <CommerceApp />
}
