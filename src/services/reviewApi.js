import apiClient from './apiClient.js'

const unwrapPayload = (response, fallbackMessage) => {
  const data = response.data?.data

  if (data === undefined) {
    throw new Error(response.data?.message || fallbackMessage)
  }

  return data
}

export const fetchProductReviewSummary = async (productId) => {
  const response = await apiClient.get(`/reviews/products/${productId}/summary`)

  return unwrapPayload(response, 'Invalid review summary response.')
}

export const fetchProductReviews = async (productId, params = {}) => {
  const response = await apiClient.get(`/reviews/products/${productId}`, { params })

  return unwrapPayload(response, 'Invalid review list response.')
}

export const fetchMyReviews = async (params = {}) => {
  const response = await apiClient.get('/reviews/my', { params })

  return unwrapPayload(response, 'Invalid customer review response.')
}

export const fetchReviewEligibility = async (params = {}) => {
  const response = await apiClient.get('/reviews/eligibility', { params })

  return unwrapPayload(response, 'Invalid review eligibility response.')
}

export const createReview = async (payload) => {
  const response = await apiClient.post('/reviews', payload)

  return unwrapPayload(response, 'Invalid review create response.')
}

export const updateReview = async (reviewId, payload) => {
  const response = await apiClient.patch(`/reviews/${reviewId}`, payload)

  return unwrapPayload(response, 'Invalid review update response.')
}

export const deleteReview = async (reviewId) => {
  const response = await apiClient.delete(`/reviews/${reviewId}`)

  return unwrapPayload(response, 'Invalid review delete response.')
}

const getReviewImageUploadSignature = async () => {
  const response = await apiClient.post('/reviews/uploads/cloudinary-signature', {})

  return unwrapPayload(response, 'Invalid review upload signature response.')
}

export const uploadReviewImages = async (files = []) => {
  const fileList = Array.from(files)

  if (fileList.length === 0) {
    return []
  }

  const {
    apiKey,
    cloudName,
    params = {},
    signature,
  } = await getReviewImageUploadSignature()

  if (!apiKey || !cloudName || !signature) {
    throw new Error('Review image upload signature is incomplete.')
  }

  return Promise.all(fileList.map(async (file) => {
    const formData = new FormData()

    formData.append('file', file)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value)
      }
    })
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Review image upload failed.')
    }

    const payload = await response.json()

    return payload.secure_url
  }))
}
