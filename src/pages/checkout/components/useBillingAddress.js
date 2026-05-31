import { useRef, useState } from 'react'
import { getPostalPincodeDetails } from '../../../services/postalPincodeApi.js'
import {
  getNumericInputValue,
  initialAddressFormState,
  validateAddress,
  validateAddressField,
} from './checkoutAddressUtils.js'

function useBillingAddress() {
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [formState, setFormState] = useState(initialAddressFormState)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isPincodeLookupLoading, setIsPincodeLookupLoading] = useState(false)
  const pincodeRequestRef = useRef(0)

  const lookupPincode = async (pincode) => {
    const requestId = pincodeRequestRef.current + 1

    pincodeRequestRef.current = requestId
    setIsPincodeLookupLoading(true)

    try {
      const locationData = await getPostalPincodeDetails(pincode)

      if (pincodeRequestRef.current !== requestId) {
        return
      }

      setFormState((currentState) => ({
        ...currentState,
        city: locationData.city,
        country: locationData.country,
        state: locationData.state,
      }))
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        city: '',
        country: '',
        pincode: '',
        state: '',
      }))
    } catch (lookupError) {
      if (pincodeRequestRef.current !== requestId) {
        return
      }

      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        pincode: lookupError.message || 'No records found for this pincode.',
      }))
    } finally {
      if (pincodeRequestRef.current === requestId) {
        setIsPincodeLookupLoading(false)
      }
    }
  }

  const handleFieldChange = (fieldName) => (event) => {
    const value = getNumericInputValue(fieldName, event.target.value)

    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: '',
    }))

    if (fieldName === 'pincode') {
      if (value.length === 6) {
        lookupPincode(value)
        return
      }

      pincodeRequestRef.current += 1
      setIsPincodeLookupLoading(false)
    }
  }

  const handleFieldBlur = (fieldName) => () => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: validateAddressField(fieldName, formState[fieldName]),
    }))
  }

  const handleSameAsShippingChange = (event) => {
    setSameAsShipping(event.target.checked)
    setFieldErrors({})
  }

  const validateBillingAddress = () => {
    if (sameAsShipping) {
      return true
    }

    const nextFieldErrors = validateAddress(formState)

    setFieldErrors(nextFieldErrors)

    return !Object.values(nextFieldErrors).some(Boolean)
  }

  return {
    fieldErrors,
    formState,
    handleFieldBlur,
    handleFieldChange,
    handleSameAsShippingChange,
    isPincodeLookupLoading,
    sameAsShipping,
    validateBillingAddress,
  }
}

export default useBillingAddress
