import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import useAuthModal from '../hooks/useAuthModal.js'
import { selectIsAuthenticated } from '../store/authSlice.js'

function getComponentName(Component) {
  return Component.displayName || Component.name || 'Component'
}

function withAuthRequired(WrappedComponent, options = {}) {
  const { fallback = null } = options

  function AuthRequiredRoute(props) {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const { openLoginModal } = useAuthModal()
    const location = useLocation()

    useEffect(() => {
      if (!isAuthenticated) {
        openLoginModal()
      }
    }, [
      isAuthenticated,
      location.pathname,
      location.search,
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
