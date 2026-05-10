import AppRoutes from './routes/index.jsx'
import AuthModalProvider from './context/AuthModalProvider.jsx'

export default function App() {
  return (
    <AuthModalProvider>
      <AppRoutes />
    </AuthModalProvider>
  )
}
