import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import FacebookIcon from '@mui/icons-material/Facebook'
import GoogleIcon from '@mui/icons-material/Google'
import {
  Alert,
  Box,
  ButtonBase,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import { getApiErrorMessage } from '../services/apiClient.js'
import {
  loginWithFacebook,
  loginWithGoogle,
  loginWithPassword,
  registerWithPassword,
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
  name: '',
  password: '',
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || ''
const facebookGraphVersion =
  import.meta.env.VITE_FACEBOOK_GRAPH_VERSION || 'v25.0'

const policyLinks = {
  privacy: '/policies/privacy-and-cookie-policy',
  terms: '/policies/terms-and-conditions',
}

const authSurfaceSx = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: { xs: 0, sm: 2 },
  boxShadow: '0 24px 80px rgba(15, 23, 42, 0.2)',
  color: 'text.primary',
  m: { xs: 0, sm: 2 },
  maxHeight: { xs: '100dvh', sm: 'calc(100dvh - 64px)' },
  overflow: 'hidden',
  width: { xs: '100%', sm: 460 },
}

const authButtonSx = {
  alignItems: 'center',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1.5,
  color: 'text.primary',
  display: 'flex',
  fontSize: '0.9rem',
  fontWeight: 800,
  justifyContent: 'center',
  minHeight: 48,
  position: 'relative',
  px: 6,
  textAlign: 'center',
  transition: 'border-color 160ms ease, background-color 160ms ease',
  width: 1,
  '&:hover': {
    bgcolor: 'rgba(30, 41, 82, 0.04)',
    borderColor: 'primary.light',
  },
  '&.Mui-disabled': {
    color: 'text.disabled',
  },
  '& .auth-option-icon': {
    alignItems: 'center',
    display: 'inline-flex',
    left: 16,
    position: 'absolute',
  },
}

const themedInputSx = (hasError = false) => ({
  '& .MuiOutlinedInput-root': {
    bgcolor: 'background.paper',
    '& fieldset': {
      borderColor: hasError ? 'error.main' : 'divider',
    },
    '&:hover fieldset': {
      borderColor: hasError ? 'error.main' : 'text.secondary',
    },
    '&.Mui-focused fieldset': {
      borderColor: hasError ? 'error.main' : 'primary.main',
    },
  },
})

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

const validateName = (value) => {
  if (!value.trim()) {
    return 'Full name is required.'
  }

  return ''
}

const validatePassword = (value, authMode) => {
  if (!value) {
    return 'Password is required.'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (
    authMode === 'signup' &&
    (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value))
  ) {
    return 'Use uppercase, lowercase, and a number.'
  }

  return ''
}

function AuthOptionButton({
  children,
  disabled,
  icon,
  loading,
  loadingText = 'Signing in...',
  onClick,
}) {
  return (
    <ButtonBase
      disabled={disabled || loading}
      onClick={onClick}
      sx={authButtonSx}
      type="button"
    >
      <Box className="auth-option-icon">
        {loading ? (
          <CircularProgress color="inherit" size={22} thickness={5} />
        ) : (
          icon
        )}
      </Box>
      {loading ? loadingText : children}
    </ButtonBase>
  )
}

function PolicyNotice({ onNavigate }) {
  const linkSx = {
    color: 'primary.main',
    fontWeight: 800,
    '&:hover': {
      color: 'primary.dark',
    },
  }

  return (
    <Typography
      sx={{
        color: 'text.secondary',
        fontSize: '0.86rem',
        lineHeight: 1.55,
      }}
    >
      By continuing, you agree to Raven Fold&apos;s{' '}
      <Link
        component={RouterLink}
        onClick={onNavigate}
        sx={linkSx}
        to={policyLinks.terms}
        underline="hover"
      >
        Terms and Conditions
      </Link>
      . Read our{' '}
      <Link
        component={RouterLink}
        onClick={onNavigate}
        sx={linkSx}
        to={policyLinks.privacy}
        underline="hover"
      >
        Privacy and Cookie Policy
      </Link>
      .
    </Typography>
  )
}

function AuthModePrompt({ isSignup, onChangeMode }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 2,
        py: 1.25,
        textAlign: 'center',
      }}
    >
      <Typography
        component="span"
        sx={{ color: 'text.secondary', fontSize: '0.9rem' }}
      >
        {isSignup ? 'Already have an account?' : 'New to Raven Fold?'}
      </Typography>{' '}
      <Link
        component="button"
        onClick={() => onChangeMode(isSignup ? 'login' : 'signup')}
        sx={{
          color: 'primary.main',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 800,
          p: 0,
          verticalAlign: 'baseline',
          '&:hover': {
            color: 'primary.dark',
          },
        }}
        type="button"
        underline="hover"
      >
        {isSignup ? 'Log in' : 'Create an account'}
      </Link>
    </Box>
  )
}

function LoginModal({ open, onClose, onLoginSuccess }) {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [authStep, setAuthStep] = useState('options')
  const [authMode, setAuthMode] = useState('login')
  const [credentials, setCredentials] = useState(initialCredentials)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [providerLoading, setProviderLoading] = useState('')

  const isBusy = isSubmitting || Boolean(providerLoading)
  const isSignup = authMode === 'signup'

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
    setAuthStep('options')
    setAuthMode('login')
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
    (authData, message = 'Logged in successfully.') => {
      saveAuthSession(authData)
      dispatch(setAuthSession(authData))
      successToast(message)
      resetModalState()
      onLoginSuccess?.(authData)
      onClose?.()
    },
    [dispatch, onClose, onLoginSuccess, resetModalState],
  )

  const handleOpenEmailStep = () => {
    setAuthStep('email')
    setFormError('')
  }

  const handleBackToOptions = () => {
    setAuthStep('options')
    setErrors({})
    setFormError('')
  }

  const handleModeChange = (nextMode) => {
    setAuthMode(nextMode)
    setErrors({})
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = credentials.email.trim()
    const name = credentials.name.trim()
    const nextErrors = {
      email: validateEmail(email),
      name: isSignup ? validateName(name) : '',
      password: validatePassword(credentials.password, authMode),
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.name || nextErrors.password) {
      return
    }

    setFormError('')
    setIsSubmitting(true)

    try {
      const authData = isSignup
        ? await registerWithPassword({
            email,
            name,
            password: credentials.password,
          })
        : await loginWithPassword({
            email,
            password: credentials.password,
          })

      handleAuthSuccess(
        authData,
        isSignup ? 'Account created successfully.' : 'Logged in successfully.',
      )
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

  const renderHeader = () => {
    const headerContent = (
      <Box sx={{ minWidth: 0, pr: authStep === 'email' ? 0 : 5 }}>
        <Typography
          component="h2"
          sx={{
            color: 'text.primary',
          fontSize: { xs: '1.6rem', sm: '1.75rem' },
          fontWeight: 900,
          lineHeight: 1.18,
          }}
        >
          {authStep === 'email'
            ? isSignup
              ? 'Create your account'
              : 'Log in with email'
            : 'Log in or sign up in a blink'}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            mt: 1.25,
          }}
        >
          {authStep === 'email'
            ? 'Use your email and password to continue with Raven Fold.'
            : 'Use your email or another service to continue with Raven Fold.'}
        </Typography>
      </Box>
    )

    if (authStep !== 'email') {
      return headerContent
    }

    return (
      <Stack spacing={1.75}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            aria-label="Back to sign in options"
            disabled={isBusy}
            onClick={handleBackToOptions}
            sx={{
              color: 'text.primary',
              height: 40,
              ml: -1,
              width: 40,
            }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>

          <IconButton
            aria-label="Close login"
            disabled={isBusy}
            onClick={handleClose}
            sx={{
              color: 'text.primary',
              height: 40,
              mr: -1,
              width: 40,
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {headerContent}
      </Stack>
    )
  }

  const renderProviderOptions = ({ includeEmail = false } = {}) => (
    <Stack spacing={1.1}>
      <AuthOptionButton
        disabled={isSubmitting || providerLoading === 'facebook'}
        icon={<GoogleIcon sx={{ color: '#4285f4' }} />}
        loading={providerLoading === 'google'}
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </AuthOptionButton>

      <AuthOptionButton
        disabled={isSubmitting || providerLoading === 'google'}
        icon={<FacebookIcon sx={{ color: '#1877f2' }} />}
        loading={providerLoading === 'facebook'}
        onClick={handleFacebookLogin}
      >
        Continue with Facebook
      </AuthOptionButton>

      {includeEmail ? (
        <AuthOptionButton
          disabled={isBusy}
          icon={<EmailOutlinedIcon />}
          onClick={handleOpenEmailStep}
        >
          Continue with email
        </AuthOptionButton>
      ) : null}
    </Stack>
  )

  const renderOptionsStep = () => (
    <Stack spacing={2.25}>
      {formError ? (
        <Alert severity="error" sx={{ borderRadius: 1.5 }}>
          {formError}
        </Alert>
      ) : null}

      {renderProviderOptions({ includeEmail: true })}

      <PolicyNotice onNavigate={handleClose} />
    </Stack>
  )

  const renderEmailStep = () => (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit}
      spacing={2}
    >
      {formError ? (
        <Alert severity="error" sx={{ borderRadius: 1.5 }}>
          {formError}
        </Alert>
      ) : null}

      {isSignup ? (
        <AppInput
          autoComplete="name"
          disabled={isBusy}
          error={Boolean(errors.name)}
          errorText={errors.name}
          fieldSx={themedInputSx(Boolean(errors.name))}
          label="Full name"
          name="name"
          onChange={handleFieldChange('name')}
          placeholder="Your name"
          required
          value={credentials.name}
        />
      ) : null}

      <AppInput
        autoComplete="email"
        autoFocus
        disabled={isBusy}
        error={Boolean(errors.email)}
        errorText={errors.email}
        fieldSx={themedInputSx(Boolean(errors.email))}
        label="Email"
        name="email"
        onChange={handleFieldChange('email')}
        placeholder="email@address.com"
        required
        type="email"
        value={credentials.email}
      />

      <AppInput
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        disabled={isBusy}
        error={Boolean(errors.password)}
        errorText={errors.password}
        fieldSx={themedInputSx(Boolean(errors.password))}
        label="Password"
        name="password"
        onChange={handleFieldChange('password')}
        placeholder={isSignup ? 'Create a password' : 'Enter your password'}
        required
        type="password"
        value={credentials.password}
      />

      {authMode === 'login' ? (
        <Link
          component={RouterLink}
          onClick={handleClose}
          sx={{
            alignSelf: 'flex-end',
            color: 'primary.main',
            fontSize: '0.85rem',
            fontWeight: 800,
            '&:hover': {
              color: 'primary.dark',
            },
          }}
          to="/forgot-password"
          underline="hover"
        >
          Forgot password?
        </Link>
      ) : null}

      <AppButton
        disabled={Boolean(providerLoading)}
        fullWidth
        loading={isSubmitting}
        loadingText={isSignup ? 'Creating account...' : 'Signing in...'}
        size="medium"
        sx={{
          borderRadius: 1.5,
        }}
        type="submit"
        variant="contained"
      >
        {isSignup ? 'Create account' : 'Log in'}
      </AppButton>

      <AuthModePrompt
        isSignup={isSignup}
        onChangeMode={handleModeChange}
      />

      <Divider sx={{ color: 'text.secondary' }}>
        or continue with
      </Divider>

      {renderProviderOptions()}

      <PolicyNotice onNavigate={handleClose} />
    </Stack>
  )

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      keepMounted
      maxWidth="xs"
      onClose={handleClose}
      open={open}
      scroll="paper"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(6px)',
            bgcolor: 'rgba(17, 24, 39, 0.56)',
          },
        },
        paper: {
          sx: authSurfaceSx,
        },
      }}
    >
      <Box
        sx={{
          maxHeight: { xs: '100dvh', sm: 'calc(100dvh - 64px)' },
          overflowY: 'auto',
          p: { xs: 2.5, sm: 3 },
          position: 'relative',
        }}
      >
        {authStep === 'email' ? null : (
          <IconButton
            aria-label="Close login"
            disabled={isBusy}
            onClick={handleClose}
            sx={{
              color: 'text.primary',
              position: 'absolute',
              right: { xs: 16, sm: 20 },
              top: { xs: 16, sm: 20 },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        )}

        <Stack spacing={2.4}>
          {renderHeader()}
          {authStep === 'email' ? renderEmailStep() : renderOptionsStep()}
        </Stack>
      </Box>
    </Dialog>
  )
}

export default LoginModal
