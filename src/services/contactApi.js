import apiClient from './apiClient.js'

export const sendContactInquiry = async (payload) => {
  const response = await apiClient.post('/contact', payload)

  return response.data
}
