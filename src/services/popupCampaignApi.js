import apiClient from './apiClient.js'

export const getActivePopupCampaigns = async (params = {}) => {
  const response = await apiClient.get('/popup-campaigns/active', { params })
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Invalid popup campaign response.')
  }
  return Array.isArray(response.data?.data) ? response.data.data : []
}

export const createLead = async (payload) => {
  const response = await apiClient.post('/leads', payload)
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Unable to save lead.')
  }
  return response.data?.data || null
}
