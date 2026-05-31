import apiClient from './apiClient.js'

const unwrapOrderResponse = (response) => {
  const order = response.data?.data

  if (!order?.id) {
    throw new Error(response.data?.message || 'Invalid order response.')
  }

  return order
}

export const createCheckoutOrder = async (orderData) => {
  const response = await apiClient.post('/orders/checkout', orderData)

  return unwrapOrderResponse(response)
}
