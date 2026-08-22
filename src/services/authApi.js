import apiClient from './apiClient.js'

const unwrapAuthResponse = (response) => {
  const authData = response.data?.data

  if (!authData?.token || !authData?.user) {
    throw new Error(response.data?.message || 'Invalid authentication response.')
  }

  return authData
}

export const loginWithPassword = async ({ email, password }) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  })

  return unwrapAuthResponse(response)
}

export const registerWithPassword = async ({ email, password, name }) => {
  const response = await apiClient.post('/auth/register', {
    email,
    name,
    password,
  })

  return unwrapAuthResponse(response)
}

export const loginWithGoogle = async (accessToken) => {
  const response = await apiClient.post('/auth/google', {
    accessToken,
  })

  return unwrapAuthResponse(response)
}

export const loginWithFacebook = async (accessToken) => {
  const response = await apiClient.post('/auth/facebook', {
    accessToken,
  })

  return unwrapAuthResponse(response)
}

export const requestPasswordReset = async ({ email }) => {
  const response = await apiClient.post('/auth/request-password-reset', {
    email,
  })

  return response.data?.data || {
    delivery: 'log',
    message:
      response.data?.message ||
      'Request received. If this email is registered with RavenFold, we will send a password reset link. The link can also set a password for accounts created with Google.',
  }
}

export const resetPassword = async ({ token, newPassword }) => {
  const response = await apiClient.post('/auth/reset-password', {
    token,
    newPassword,
  })

  return response.data?.data || {
    message: response.data?.message || 'Password reset successfully.',
  }
}
