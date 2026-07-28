import apiClient from './apiClient.js'

const unwrapPayload = (response, fallbackMessage) => {
  const data = response.data?.data

  if (data === undefined) {
    throw new Error(response.data?.message || fallbackMessage)
  }

  return data
}

const normalizeImageAsset = (asset) => {
  if (!asset?.url) {
    return null
  }

  return {
    publicId: String(asset.publicId || asset.public_id || '').trim(),
    url: String(asset.url).trim(),
  }
}

export const uploadImages = async (files = [], folderKey = 'review') => {
  const fileList = Array.from(files)

  if (!fileList.length) {
    return []
  }

  const formData = new FormData()

  fileList.forEach((file) => formData.append('images', file))
  formData.append('folderKey', folderKey)

  const response = await apiClient.post('/uploads/images/multiple', formData)

  const payload = unwrapPayload(response, 'Image upload failed.')

  return Array.isArray(payload)
    ? payload.map(normalizeImageAsset).filter(Boolean)
    : []
}
