import { useCallback, useMemo, useRef, useState } from 'react'
import LoginModal from '../modal/LoginModal.jsx'
import AuthModalContext from './authModalContext.js'

function AuthModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginSuccessHandler, setLoginSuccessHandler] = useState(null)
  const [loginCloseHandler, setLoginCloseHandler] = useState(null)
  const loginSucceededRef = useRef(false)

  const closeLoginModal = useCallback(() => {
    if (!loginSucceededRef.current) {
      loginCloseHandler?.()
    }

    loginSucceededRef.current = false
    setIsLoginOpen(false)
    setLoginSuccessHandler(null)
    setLoginCloseHandler(null)
  }, [loginCloseHandler])

  const openLoginModal = useCallback(({ onClose, onLoginSuccess } = {}) => {
    setLoginSuccessHandler(() => onLoginSuccess || null)
    setLoginCloseHandler(() => onClose || null)
    setIsLoginOpen(true)
  }, [])

  const handleLoginSuccess = useCallback(
    (authData) => {
      loginSucceededRef.current = true
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
