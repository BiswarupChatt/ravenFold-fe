import AppRoutes from './routes/index.jsx'
import AuthModalProvider from './context/AuthModalProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'

export default function App() {
  return (
    <AuthModalProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthModalProvider>
  )
}
