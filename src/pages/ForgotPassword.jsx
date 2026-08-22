import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import { Alert, Container, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import { requestPasswordReset } from '../services/authApi.js'
import { getApiErrorMessage } from '../services/apiClient.js'

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

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateEmail(email)

    setError(validationError)
    setSuccess('')

    if (validationError) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await requestPasswordReset({ email: email.trim() })
      setSuccess(
        result?.message ||
          'Request received. If this email is registered with RavenFold, we will send a password reset link. The link can also set a password for accounts created with Google.',
      )
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
              Forgot password
            </Typography>
            <Typography color="text.secondary">
              Enter your RavenFold email and we will send a secure link to reset or set your password.
            </Typography>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}

          <AppInput
            autoComplete="email"
            autoFocus
            label="Email"
            leftAdornment={<MailOutlineRoundedIcon fontSize="small" />}
            placeholder="email@address.com"
            required
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
          />

          <AppButton
            fullWidth
            loading={isSubmitting}
            loadingText="Sending..."
            type="submit"
            variant="contained"
          >
            Send reset link
          </AppButton>

          <AppButton component={RouterLink} fullWidth to="/" variant="outlined">
            Back to home
          </AppButton>
        </Stack>
      </Paper>
    </Container>
  )
}

export default ForgotPassword
