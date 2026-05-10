import { useCallback, useMemo, useState } from 'react'
import LoginModal from '../modal/LoginModal.jsx'
import AuthModalContext from './authModalContext.js'

function AuthModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginSuccessHandler, setLoginSuccessHandler] = useState(null)

  const closeLoginModal = useCallback(() => {
    setIsLoginOpen(false)
    setLoginSuccessHandler(null)
  }, [])

  const openLoginModal = useCallback(({ onLoginSuccess } = {}) => {
    setLoginSuccessHandler(() => onLoginSuccess || null)
    setIsLoginOpen(true)
  }, [])

  const handleLoginSuccess = useCallback(
    (authData) => {
      loginSuccessHandler?.(authData)
    },
    [loginSuccessHandler],
  )

  const value = useMemo(
    () => ({
      closeLoginModal,
      isLoginOpen,
      openLoginModal,
    }),
    [closeLoginModal, isLoginOpen, openLoginModal],
  )

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal
        onClose={closeLoginModal}
        onLoginSuccess={handleLoginSuccess}
        open={isLoginOpen}
      />
    </AuthModalContext.Provider>
  )
}

export default AuthModalProvider
