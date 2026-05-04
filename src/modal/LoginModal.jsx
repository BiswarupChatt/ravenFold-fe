import { Stack } from '@mui/material'
import { useState } from 'react'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import AppModal from '../components/AppModal.jsx'

const initialCredentials = {
  email: '',
  password: '',
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

function LoginModal({ open, onClose }) {
  const [credentials, setCredentials] = useState(initialCredentials)
  const [errors, setErrors] = useState({})

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
  }

  const handleClose = (...args) => {
    setCredentials(initialCredentials)
    setErrors({})
    onClose?.(...args)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {
      email: validateEmail(credentials.email),
      password: validatePassword(credentials.password),
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      return
    }
  }

  return (
    <AppModal
      description="Use this temporary login modal to test spacing, layout, and flow."
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
        <AppInput
          autoComplete="email"
          autoFocus
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

        <AppButton fullWidth loadingText="Signing In..." size="medium" type="submit" variant="contained">
          Sign In
        </AppButton>

      </Stack>
    </AppModal>
  )
}

export default LoginModal
