import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthModal from '../hooks/useAuthModal.js'
import { selectIsAuthenticated } from '../store/authSlice.js'

/*
 * Usage guide:
 * - Protect a route:
 *   const ProtectedProfile = withAuthRequired(Profile)
 *
 * - Protect only specific user actions:
 *   const ProductListWithAuth = withAuthRequired(ProductList, {
 *     protectOnMount: false,
 *   })
 *
 *   Inside ProductList, call:
 *   props.requireAuthAction(() => doProtectedWork())
 */

function getComponentName(Component) {
  return Component.displayName || Component.name || 'Component'
}

function withAuthRequired(WrappedComponent, options = {}) {
  const {
    authActionProp = 'requireAuthAction',
    fallback = null,
    protectOnMount = true,
    redirectTo = -1,
  } = options

  function AuthRequiredRoute(props) {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const { openLoginModal } = useAuthModal()
    const location = useLocation()
    const navigate = useNavigate()

    const requireAuthAction = useCallback(
      (action, actionOptions = {}) => {
        const {
          onClose,
          onLoginSuccess,
          runAfterLogin = true,
        } = actionOptions

        if (isAuthenticated) {
          action?.()
          return true
        }

        openLoginModal({
          onClose,
          onLoginSuccess: (authData) => {
            onLoginSuccess?.(authData)

            if (runAfterLogin) {
              action?.()
            }
          },
        })

        return false
      },
      [isAuthenticated, openLoginModal],
    )

    useEffect(() => {
      if (!protectOnMount || isAuthenticated) {
        return
      }

      openLoginModal({
        onClose: () => {
          if (typeof redirectTo === 'number') {
            navigate(redirectTo)
            return
          }

          navigate(redirectTo, { replace: true })
        },
      })
    }, [
      isAuthenticated,
      location.pathname,
      location.search,
      navigate,
      openLoginModal,
    ])

    if (protectOnMount && !isAuthenticated) {
      return fallback
    }

    return (
      <WrappedComponent
        {...props}
        {...{ [authActionProp]: requireAuthAction }}
      />
    )
  }

  AuthRequiredRoute.displayName = `withAuthRequired(${getComponentName(WrappedComponent)})`

  return AuthRequiredRoute
}

export default withAuthRequired
