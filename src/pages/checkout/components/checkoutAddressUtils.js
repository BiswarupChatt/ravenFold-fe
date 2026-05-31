export const initialAddressFormState = {
  addressLine1: '',
  addressLine2: '',
  addressType: 'home',
  city: '',
  country: 'India',
  fullName: '',
  isDefault: false,
  phone: '',
  pincode: '',
  state: '',
}

export const addressFields = [
  {
    autoComplete: 'name',
    label: 'Full Name',
    name: 'fullName',
    placeholder: 'Name for delivery',
    required: true,
  },
  {
    autoComplete: 'tel',
    inputMode: 'numeric',
    label: 'Phone',
    maxLength: 10,
    name: 'phone',
    placeholder: 'Mobile number',
    required: true,
    type: 'tel',
  },
  {
    autoComplete: 'address-line1',
    gridColumn: '1 / -1',
    label: 'Address Line 1',
    name: 'addressLine1',
    placeholder: 'House number, street, area',
    required: true,
  },
  {
    autoComplete: 'address-line2',
    gridColumn: '1 / -1',
    label: 'Address Line 2',
    name: 'addressLine2',
    placeholder: 'Apartment, landmark, floor',
  },
  {
    autoComplete: 'postal-code',
    inputMode: 'numeric',
    label: 'Pincode',
    maxLength: 6,
    name: 'pincode',
    placeholder: 'Postal code',
    required: true,
  },
  {
    autoComplete: 'address-level2',
    label: 'District',
    name: 'city',
    placeholder: 'District',
    required: true,
  },
  {
    autoComplete: 'address-level1',
    label: 'State',
    name: 'state',
    placeholder: 'State',
    required: true,
  },
  {
    autoComplete: 'country-name',
    label: 'Country',
    name: 'country',
    placeholder: 'Country',
    required: true,
  },
]

const requiredFields = [
  'addressType',
  'fullName',
  'phone',
  'addressLine1',
  'city',
  'state',
  'pincode',
  'country',
]

const requiredFieldMessages = {
  addressLine1: 'Enter your house number, street, or area.',
  addressType: 'Choose where this address should be saved.',
  city: 'Enter your district.',
  country: 'Enter your country.',
  fullName: 'Enter the recipient full name.',
  phone: 'Enter the recipient phone number.',
  pincode: 'Enter your pincode.',
  state: 'Enter your state.',
}

const getDigits = (value) => String(value || '').replace(/\D/g, '')

export const getNumericInputValue = (fieldName, value) => {
  const numericValue = getDigits(value)

  if (fieldName === 'phone') {
    return numericValue.slice(0, 10)
  }

  if (fieldName === 'pincode') {
    return numericValue.slice(0, 6)
  }

  return value
}

export const validateAddressField = (fieldName, value) => {
  const trimmedValue = String(value || '').trim()

  if (requiredFields.includes(fieldName) && !trimmedValue) {
    return requiredFieldMessages[fieldName]
  }

  if (fieldName === 'addressType' && !['home', 'work'].includes(trimmedValue)) {
    return 'Select Home or Work as the address type.'
  }

  if (fieldName === 'fullName' && trimmedValue.length < 2) {
    return 'Full name must be at least 2 characters.'
  }

  if (fieldName === 'phone') {
    const phoneDigits = getDigits(trimmedValue)

    if (phoneDigits.length !== 10) {
      return 'Mobile number must be exactly 10 digits.'
    }

    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      return 'Invalid mobile number.'
    }
  }

  if (fieldName === 'addressLine1' && trimmedValue.length < 5) {
    return 'Address line 1 must include at least 5 characters.'
  }

  if (fieldName === 'city' && trimmedValue.length < 2) {
    return 'District must be at least 2 characters.'
  }

  if (fieldName === 'state' && trimmedValue.length < 2) {
    return 'State must be at least 2 characters.'
  }

  if (fieldName === 'country' && trimmedValue.length < 2) {
    return 'Country must be at least 2 characters.'
  }

  if (fieldName === 'pincode' && !/^\d{6}$/.test(trimmedValue)) {
    return 'Pincode must be exactly 6 digits.'
  }

  return ''
}

export const validateAddress = (formState) => {
  return requiredFields.reduce((errors, fieldName) => {
    const message = validateAddressField(fieldName, formState[fieldName])

    if (message) {
      return {
        ...errors,
        [fieldName]: message,
      }
    }

    return errors
  }, {})
}

export const trimAddressPayload = (formState) => ({
  addressLine1: formState.addressLine1.trim(),
  addressLine2: formState.addressLine2.trim(),
  addressType: formState.addressType,
  city: formState.city.trim(),
  country: formState.country.trim(),
  fullName: formState.fullName.trim(),
  isDefault: Boolean(formState.isDefault),
  phone: formState.phone.trim(),
  pincode: formState.pincode.trim(),
  state: formState.state.trim(),
})

export const getAddressTypeLabel = (addressType) => {
  return addressType === 'work' ? 'Work' : 'Home'
}

export const getAddressLocationLine = (address = {}) => {
  return [
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(', ').toUpperCase()
}
