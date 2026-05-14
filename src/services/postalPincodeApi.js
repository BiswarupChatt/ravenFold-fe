const POSTAL_PINCODE_API_URL = 'https://api.postalpincode.in/pincode'

export const getPostalPincodeDetails = async (pincode) => {
  const response = await fetch(`${POSTAL_PINCODE_API_URL}/${pincode}`)

  if (!response.ok) {
    throw new Error('Unable to verify this pincode. Try again.')
  }

  const payload = await response.json()
  const pincodeResult = Array.isArray(payload) ? payload[0] : null
  const postOffice = pincodeResult?.PostOffice?.[0]

  if (pincodeResult?.Status !== 'Success' || !postOffice) {
    throw new Error(pincodeResult?.Message || 'No records found for this pincode.')
  }

  return {
    city: postOffice.District || postOffice.Block || postOffice.Name || '',
    country: postOffice.Country || 'India',
    postOffice,
    state: postOffice.State || '',
  }
}
