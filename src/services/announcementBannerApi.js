import apiClient from './apiClient.js'

export const getActiveAnnouncementBanners = async () => {
  const response = await apiClient.get('/announcement-banners/active')
  const banners = response.data?.data

  if (!Array.isArray(banners)) {
    throw new Error(response.data?.message || 'Invalid announcement banner response.')
  }

  return banners
}
