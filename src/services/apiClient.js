import axios from 'axios'
import { getStoredAuthToken } from './authStorage.js'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.ravenfold.in/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getApiErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.details?.[0]?.message ||
    error?.message ||
    'Unable to complete the request. Try again.'
  )
}

export default apiClient

