import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthModal from '../hooks/useAuthModal.js'
import { selectIsAuthenticated } from '../store/authSlice.js'

function getComponentName(Component) {
  return Component.displayName || Component.name || 'Component'
}

function withAuthRequired(WrappedComponent, options = {}) {
  const { fallback = null, redirectTo = -1 } = options

  function AuthRequiredRoute(props) {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const { openLoginModal } = useAuthModal()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
      if (!isAuthenticated) {
        openLoginModal({
          onClose: () => {
            if (typeof redirectTo === 'number') {
              navigate(redirectTo)
              return
            }

            navigate(redirectTo, { replace: true })
          },
        })
      }
    }, [
      isAuthenticated,
      location.pathname,
      location.search,
      navigate,
      openLoginModal,
    ])

    if (!isAuthenticated) {
      return fallback
    }

    return <WrappedComponent {...props} />
  }

  AuthRequiredRoute.displayName = `withAuthRequired(${getComponentName(WrappedComponent)})`

  return AuthRequiredRoute
}

export default withAuthRequired
