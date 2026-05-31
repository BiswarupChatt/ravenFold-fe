import { useEffect, useMemo, useRef, useState } from 'react'
import { getApiErrorMessage } from '../../../services/apiClient.js'
import { createUserAddress, getUserAddresses } from '../../../services/addressApi.js'
import { getPostalPincodeDetails } from '../../../services/postalPincodeApi.js'
import { errorToast, successToast } from '../../../services/toast.js'
import {
  getNumericInputValue,
  initialAddressFormState,
  trimAddressPayload,
  validateAddress,
  validateAddressField,
} from './checkoutAddressUtils.js'

function useCheckoutAddress() {
  const [addresses, setAddresses] = useState([])
  const [addressMode, setAddressMode] = useState('saved')
  const [addressLoading, setAddressLoading] = useState(true)
  const [addressError, setAddressError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formState, setFormState] = useState(initialAddressFormState)
  const [isPincodeLookupLoading, setIsPincodeLookupLoading] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const pincodeRequestRef = useRef(0)

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) || null,
    [addresses, selectedAddressId],
  )

  useEffect(() => {
    let isActive = true

    const loadAddresses = async () => {
      setAddressLoading(true)
      setAddressError('')

      try {
        const addressData = await getUserAddresses({ limit: 50 })
        const nextAddresses = addressData.items || []

        if (!isActive) {
          return
        }

        setAddresses(nextAddresses)
        setSelectedAddressId((currentId) => {
          if (currentId && nextAddresses.some((address) => address.id === currentId)) {
            return currentId
          }

          return (
            nextAddresses.find((address) => address.isDefault)?.id ||
            nextAddresses[0]?.id ||
            ''
          )
        })
        setAddressMode(nextAddresses.length ? 'saved' : 'new')
      } catch (error) {
        if (!isActive) {
          return
        }

        const message = getApiErrorMessage(error)

        setAddressError(message)
        errorToast(message)
      } finally {
        if (isActive) {
          setAddressLoading(false)
        }
      }
    }

    loadAddresses()

    return () => {
      isActive = false
    }
  }, [])

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

  const handleDefaultChange = (event) => {
    setFormState((currentState) => ({
      ...currentState,
      isDefault: event.target.checked,
    }))
  }

  const handleAddressModeChange = (nextMode) => {
    if (nextMode === 'saved' && !addresses.length) {
      return
    }

    setAddressError('')
    setAddressMode(nextMode)
  }

  const handleSelectAddress = (addressId) => {
    setAddressError('')
    setSelectedAddressId(addressId)
  }

  const continueWithAddress = async () => {
    setAddressError('')

    if (addressMode === 'saved') {
      if (!selectedAddress) {
        setAddressError('Select a delivery address or add a new one.')
        return false
      }

      return true
    }

    const nextFieldErrors = validateAddress(formState)

    setFieldErrors(nextFieldErrors)

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return false
    }

    setSavingAddress(true)

    try {
      const savedAddress = await createUserAddress({
        ...trimAddressPayload(formState),
        isDefault: !addresses.length || Boolean(formState.isDefault),
      })

      setAddresses((currentAddresses) => {
        const nextAddresses = savedAddress.isDefault
          ? currentAddresses.map((address) => ({ ...address, isDefault: false }))
          : currentAddresses

        return [savedAddress, ...nextAddresses]
      })
      setSelectedAddressId(savedAddress.id)
      setAddressMode('saved')
      successToast('Address saved for checkout.')

      return true
    } catch (error) {
      const message = getApiErrorMessage(error)

      setAddressError(message)
      errorToast(message)
      return false
    } finally {
      setSavingAddress(false)
    }
  }

  return {
    addressError,
    addressLoading,
    addressMode,
    addresses,
    continueWithAddress,
    fieldErrors,
    formState,
    handleAddressModeChange,
    handleDefaultChange,
    handleFieldBlur,
    handleFieldChange,
    handleSelectAddress,
    isPincodeLookupLoading,
    savingAddress,
    selectedAddress,
    selectedAddressId,
  }
}

export default useCheckoutAddress
