import apiClient from './apiClient.js'
import { uploadImages } from './uploadApi.js'

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

export const uploadReviewImages = async (files = []) => {
  return uploadImages(files, 'review')
}
