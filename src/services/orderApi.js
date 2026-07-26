import apiClient, { getApiErrorMessage } from './apiClient.js'

const unwrapOrderResponse = (response) => {
  const order = response.data?.data

  if (!order?.id) {
    throw new Error(response.data?.message || 'Invalid order response.')
  }

  return order
}

const unwrapOrderListResponse = (response) => {
  const data = response.data?.data || {}
  const pagination = data.pagination || {}

  return {
    items: Array.isArray(data.items) ? data.items : [],
    pagination: {
      hasNextPage: Boolean(pagination.hasNextPage),
      hasPrevPage: Boolean(pagination.hasPrevPage),
      limit: Number(pagination.limit || 10),
      page: Number(pagination.page || 1),
      total: Number(pagination.total || 0),
      totalPages: Number(pagination.totalPages || 0),
    },
  }
}

export const createCheckoutOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders/checkout', orderData)

    return unwrapOrderResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchCustomerOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/orders/me', { params })

    return unwrapOrderListResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const fetchCustomerOrder = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/me/${orderId}`)

    return unwrapOrderResponse(response)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}

export const downloadCustomerInvoice = async (orderId, invoiceNumber = 'gst-invoice') => {
  try {
    const response = await apiClient.get(`/gst/invoices/me/${orderId}/download`, {
      responseType: 'blob',
    })
    const blobUrl = URL.createObjectURL(response.data)
    const link = document.createElement('a')

    link.href = blobUrl
    link.download = `${invoiceNumber || 'gst-invoice'}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error })
  }
}
