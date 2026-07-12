import apiClient, { getApiErrorMessage } from './apiClient.js'

const unwrapPaymentSessionResponse = (response) => {
  const data = response.data?.data

  if (!data?.provider || !data?.paymentAttempt?.id) {
    throw new Error(response.data?.message || 'Invalid payment session response.')
  }

  return data
}

const unwrapPaymentResultResponse = (response) => {
  const data = response.data?.data

  if (!data?.paymentAttempt?.id) {
    throw new Error(response.data?.message || 'Invalid payment response.')
  }

  return data
}

export const createPaymentSession = async (sessionData) => {
  try {
    const response = await apiClient.post('/payments/session', sessionData)

    return unwrapPaymentSessionResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchPaymentAttemptStatus = async (paymentAttemptId) => {
  try {
    const response = await apiClient.get(`/payments/attempts/${paymentAttemptId}/status`)

    return unwrapPaymentResultResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const verifyPaymentAttempt = async (paymentAttemptId, paymentData) => {
  try {
    const response = await apiClient.post(`/payments/attempts/${paymentAttemptId}/verify`, paymentData)

    return unwrapPaymentResultResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const recordPaymentAttemptFailure = async (paymentAttemptId, paymentData) => {
  try {
    const response = await apiClient.post(`/payments/attempts/${paymentAttemptId}/failure`, paymentData)

    return unwrapPaymentResultResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}
