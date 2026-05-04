import { Button, Stack, TextField, Typography } from '@mui/material'
import AppModal from '../components/AppModal.jsx'

function LoginModal({ open, onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <AppModal
      description="Use this temporary login modal to test spacing, layout, and flow."
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title="Login"
    >
      <Stack
        component="form"
        noValidate
        onSubmit={handleSubmit}
        spacing={2.5}
      >
        <TextField
          autoComplete="email"
          autoFocus
          fullWidth
          label="Email Address"
          placeholder="you@example.com"
          type="email"
        />
        <TextField
          autoComplete="current-password"
          fullWidth
          label="Password"
          placeholder="Enter your password"
          type="password"
        />

        <Button fullWidth size="large" type="submit" variant="contained">
          Sign In
        </Button>

        <Typography color="text.secondary" variant="body2">
          This is a dummy modal for now. No authentication is connected yet.
        </Typography>
      </Stack>
    </AppModal>
  )
}

export default LoginModal
