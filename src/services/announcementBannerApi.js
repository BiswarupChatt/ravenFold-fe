import apiClient from './apiClient.js'

export const getActiveAnnouncementBanners = async (params = {}) => {
  const response = await apiClient.get('/announcement-banners/active', { params })
  const banners = response.data?.data

  if (!Array.isArray(banners)) {
    throw new Error(response.data?.message || 'Invalid announcement banner response.')
  }

  return banners
}
