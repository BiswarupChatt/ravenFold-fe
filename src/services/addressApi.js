import apiClient from './apiClient.js'

const unwrapAddressResponse = (response) => {
  const address = response.data?.data

  if (!address) {
    throw new Error(response.data?.message || 'Invalid address response.')
  }

  return address
}

const unwrapAddressListResponse = (response) => {
  const addressData = response.data?.data

  if (!addressData?.items || !addressData?.pagination) {
    throw new Error(response.data?.message || 'Invalid address list response.')
  }

  return addressData
}

export const getUserAddresses = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/users/addresses', {
    params: {
      page,
      limit,
    },
  })

  return unwrapAddressListResponse(response)
}

export const createUserAddress = async (addressData) => {
  const response = await apiClient.post('/users/addresses', addressData)

  return unwrapAddressResponse(response)
}

export const updateUserAddress = async (addressId, addressData) => {
  const response = await apiClient.patch(`/users/addresses/${addressId}`, addressData)

  return unwrapAddressResponse(response)
}

export const deleteUserAddress = async (addressId) => {
  const response = await apiClient.delete(`/users/addresses/${addressId}`)

  return unwrapAddressResponse(response)
}
