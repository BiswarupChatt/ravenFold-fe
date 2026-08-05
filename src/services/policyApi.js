import apiClient from './apiClient.js'

const unwrapPolicyResponse = (response) => {
  const policyData = response.data?.data

  if (!policyData?.slug) {
    throw new Error(response.data?.message || 'Invalid policy response.')
  }

  return policyData
}

export const getPublishedPolicy = async (slug) => {
  const response = await apiClient.get(`/policies/${slug}`)

  return unwrapPolicyResponse(response)
}

export const getPublishedPolicies = async () => {
  const response = await apiClient.get('/policies')

  return Array.isArray(response.data?.data) ? response.data.data : []
}
