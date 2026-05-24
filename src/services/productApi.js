import apiClient from './apiClient.js'

const unwrapProductListResponse = (response) => {
  const productData = response.data?.data

  if (!Array.isArray(productData?.items) || !productData?.pagination) {
    throw new Error(response.data?.message || 'Invalid product list response.')
  }

  return productData
}

const unwrapProductResponse = (response) => {
  const productData = response.data?.data

  if (!productData?.id) {
    throw new Error(response.data?.message || 'Invalid product response.')
  }

  return productData
}

export const getProducts = async ({
  page = 1,
  limit = 12,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
} = {}) => {
  const response = await apiClient.get('/products', {
    params: {
      page,
      limit,
      search: search || undefined,
      sortBy,
      sortOrder,
    },
  })

  return unwrapProductListResponse(response)
}

export const getProduct = async (productIdOrSlug) => {
  const response = await apiClient.get(`/products/${productIdOrSlug}`)

  return unwrapProductResponse(response)
}

export const getProductVariants = async (productId, {
  page = 1,
  limit = 12,
} = {}) => {
  const response = await apiClient.get(`/products/${productId}/variants`, {
    params: {
      page,
      limit,
    },
  })

  return unwrapProductListResponse(response)
}
