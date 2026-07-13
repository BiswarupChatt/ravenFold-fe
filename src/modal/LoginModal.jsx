import FacebookIcon from '@mui/icons-material/Facebook'
import GoogleIcon from '@mui/icons-material/Google'
import { Alert, Divider, Link, Stack } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import AppModal from '../components/AppModal.jsx'
import { getApiErrorMessage } from '../services/apiClient.js'
import {
  loginWithFacebook,
  loginWithGoogle,
  loginWithPassword,
} from '../services/authApi.js'
import { saveAuthSession } from '../services/authStorage.js'
import { successToast } from '../services/toast.js'
import {
  requestFacebookLogin,
  requestGoogleLogin,
} from '../services/oauthProviders.js'
import { setAuthSession } from '../store/authSlice.js'

const initialCredentials = {
  email: '',
  password: '',
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || ''
const facebookGraphVersion =
  import.meta.env.VITE_FACEBOOK_GRAPH_VERSION || 'v25.0'

const providerButtonSx = {
  borderColor: '#dadce0',
  borderRadius: 1,
  color: '#3c4043',
  fontSize: '0.875rem',
  fontWeight: 500,
  justifyContent: 'center',
  minHeight: 44,
  position: 'relative',
  '& .MuiButton-startIcon': {
    left: 16,
    m: 0,
    position: 'absolute',
  },
  '&:hover': {
    backgroundColor: 'rgba(60, 64, 67, 0.04)',
    borderColor: '#dadce0',
  },
}

const validateEmail = (value) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'Email is required.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(trimmedValue)) {
    return 'Enter a valid email address.'
  }

  return ''
}

const validatePassword = (value) => {
  if (!value) {
    return 'Password is required.'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  return ''
}

function LoginModal({ open, onClose, onLoginSuccess }) {
  const dispatch = useDispatch()
  const [credentials, setCredentials] = useState(initialCredentials)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [providerLoading, setProviderLoading] = useState('')

  const isBusy = isSubmitting || Boolean(providerLoading)

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [field]: nextValue,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: '',
    }))
    setFormError('')
  }

  const resetModalState = useCallback(() => {
    setCredentials(initialCredentials)
    setErrors({})
    setFormError('')
    setIsSubmitting(false)
    setProviderLoading('')
  }, [])

  const handleClose = (...args) => {
    resetModalState()
    onClose?.(...args)
  }

  const handleAuthSuccess = useCallback(
    (authData) => {
      saveAuthSession(authData)
      dispatch(setAuthSession(authData))
      successToast('Logged in successfully.')
      resetModalState()
      onLoginSuccess?.(authData)
      onClose?.()
    },
    [dispatch, onClose, onLoginSuccess, resetModalState],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = credentials.email.trim()
    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(credentials.password),
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      return
    }

    setFormError('')
    setIsSubmitting(true)

    try {
      const authData = await loginWithPassword({
        email,
        password: credentials.password,
      })

      handleAuthSuccess(authData)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setFormError('')
    setProviderLoading('google')

    try {
      const accessToken = await requestGoogleLogin({
        clientId: googleClientId,
      })
      const authData = await loginWithGoogle(accessToken)

      handleAuthSuccess(authData)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setProviderLoading('')
    }
  }

  const handleFacebookLogin = async () => {
    setFormError('')
    setProviderLoading('facebook')

    try {
      const accessToken = await requestFacebookLogin({
        appId: facebookAppId,
        version: facebookGraphVersion,
      })
      const authData = await loginWithFacebook(accessToken)

      handleAuthSuccess(authData)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setProviderLoading('')
    }
  }

  return (
    <AppModal
      description="Sign in to manage your account, wishlist, and orders."
      maxWidth="xs"
      onClose={handleClose}
      open={open}
      title="Login"
    >
      <Stack
        component="form"
        noValidate
        onSubmit={handleSubmit}
        spacing={1.5}
      >
        {formError ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {formError}
          </Alert>
        ) : null}

        <AppInput
          autoComplete="email"
          autoFocus
          disabled={isBusy}
          label="Your Email"
          name="email"
          placeholder="email@address.com"
          required
          type="email"
          error={Boolean(errors.email)}
          errorText={errors.email}
          value={credentials.email}
          onChange={handleFieldChange('email')}
        />

        <AppInput
          autoComplete="current-password"
          disabled={isBusy}
          label="Password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
          error={Boolean(errors.password)}
          errorText={errors.password}
          value={credentials.password}
          onChange={handleFieldChange('password')}
        />

        <Link
          component={RouterLink}
          onClick={handleClose}
          sx={{ alignSelf: 'flex-end', fontSize: '0.85rem', fontWeight: 600 }}
          to="/forgot-password"
          underline="hover"
        >
          Forgot password?
        </Link>

        <AppButton
          disabled={Boolean(providerLoading)}
          fullWidth
          loading={isSubmitting}
          loadingText="Signing In..."
          size="medium"
          type="submit"
          variant="contained"
        >
          Sign In
        </AppButton>

        <Divider sx={{ color: 'text.secondary', fontSize: '0.75rem', my: 0.25 }}>
          or
        </Divider>

        <Stack spacing={1}>
          <AppButton
            disabled={isSubmitting || providerLoading === 'facebook'}
            fullWidth
            loading={providerLoading === 'google'}
            loadingText="Signing In..."
            onClick={handleGoogleLogin}
            size="medium"
            startIcon={<GoogleIcon sx={{ color: '#4285f4' }} />}
            sx={providerButtonSx}
            type="button"
            variant="outlined"
          >
            Sign in with Google
          </AppButton>

          <AppButton
            disabled={isSubmitting || providerLoading === 'google'}
            fullWidth
            loading={providerLoading === 'facebook'}
            loadingText="Signing In..."
            onClick={handleFacebookLogin}
            size="medium"
            startIcon={<FacebookIcon sx={{ color: '#1877f2' }} />}
            sx={providerButtonSx}
            type="button"
            variant="outlined"
          >
            Sign in with Facebook
          </AppButton>
        </Stack>
      </Stack>
    </AppModal>
  )
}

export default LoginModal
