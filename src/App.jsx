import AppRoutes from './routes/index.jsx'
import AuthModalProvider from './context/AuthModalProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import useCartSessionSync from './hooks/useCartSessionSync.js'

export default function App() {
  useCartSessionSync()

  return (
    <AuthModalProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthModalProvider>
  )
}
