import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import { Alert, Container, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import { resetPassword as resetPasswordRequest } from '../services/authApi.js'
import { getApiErrorMessage } from '../services/apiClient.js'

const validatePassword = (value) => {
  if (!value) {
    return 'New password is required.'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must include uppercase, lowercase, and a number.'
  }

  return ''
}

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState(() => searchParams.get('token') || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedToken = token.trim()
    const validationError = validatePassword(password)

    setError('')
    setSuccess('')

    if (!trimmedToken) {
      setError('Reset token is required.')
      return
    }

    if (validationError) {
      setError(validationError)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await resetPasswordRequest({
        token: trimmedToken,
        newPassword: password,
      })
      setSuccess(result?.message || 'Password reset successfully. You can now sign in.')
      setPassword('')
      setConfirmPassword('')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
      <Paper sx={{ borderRadius: 3, p: { xs: 3, md: 4 } }}>
        <Stack component="form" noValidate onSubmit={handleSubmit} spacing={2.5}>
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Reset password
            </Typography>
            <Typography color="text.secondary">
              Set a new password for your account. Use at least 8 characters with uppercase, lowercase, and a number.
            </Typography>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}

          <AppInput
            autoComplete="one-time-code"
            autoFocus={!token}
            label="Reset token"
            leftAdornment={<KeyRoundedIcon fontSize="small" />}
            placeholder="Paste the reset token"
            required
            value={token}
            onChange={(event) => {
              setToken(event.target.value)
              setError('')
            }}
          />

          <AppInput
            autoComplete="new-password"
            label="New password"
            leftAdornment={<LockOpenRoundedIcon fontSize="small" />}
            placeholder="Enter your new password"
            required
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
          />

          <AppInput
            autoComplete="new-password"
            label="Confirm new password"
            leftAdornment={<LockOpenRoundedIcon fontSize="small" />}
            placeholder="Re-enter your new password"
            required
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setError('')
            }}
          />

          <AppButton
            fullWidth
            loading={isSubmitting}
            loadingText="Updating..."
            type="submit"
            variant="contained"
          >
            Reset password
          </AppButton>

          <AppButton component={RouterLink} fullWidth to="/" variant="outlined">
            Back to home
          </AppButton>
        </Stack>
      </Paper>
    </Container>
  )
}

export default ResetPassword
