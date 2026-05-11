import apiClient from './apiClient.js'

const unwrapUserResponse = (response) => {
  const user = response.data?.data

  if (!user) {
    throw new Error(response.data?.message || 'Invalid user response.')
  }

  return user
}

export const getCurrentUserProfile = async () => {
  const response = await apiClient.get('/users/me')

  return unwrapUserResponse(response)
}

export const updateCurrentUserProfile = async (profileData) => {
  const response = await apiClient.patch('/users/me', profileData)

  return unwrapUserResponse(response)
}
