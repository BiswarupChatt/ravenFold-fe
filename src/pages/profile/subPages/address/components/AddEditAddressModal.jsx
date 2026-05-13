import { useMemo, useState } from 'react'
import { Alert, Box, Checkbox, FormControlLabel, MenuItem, Stack } from '@mui/material'
import AppButton from '../../../../../components/AppButton'
import AppInput from '../../../../../components/AppInput'
import AppModal from '../../../../../components/AppModal'

const initialFormState = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
  addressType: 'home',
}

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
  city: 'Enter your city.',
  country: 'Enter your country.',
  fullName: 'Enter the recipient full name.',
  phone: 'Enter the recipient phone number.',
  pincode: 'Enter your pincode.',
  state: 'Enter your state.',
}

const addressFields = [
  {
    autoComplete: 'name',
    label: 'Full Name',
    name: 'fullName',
    placeholder: 'Name for delivery',
    required: true,
  },
  {
    autoComplete: 'tel',
    label: 'Phone',
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
    autoComplete: 'address-level2',
    label: 'City',
    name: 'city',
    placeholder: 'City',
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
    autoComplete: 'postal-code',
    label: 'Pincode',
    name: 'pincode',
    placeholder: 'Postal code',
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

const formFieldSx = {
  '& .MuiInputBase-input': {
    '&::placeholder': {
      color: '#596070',
      opacity: 1,
    },
    color: '#596070',
    fontSize: '0.8rem',
    px: 1.5,
    py: 1.1,
  },
  '& .MuiInputBase-input.MuiSelect-select': {
    alignItems: 'center',
    display: 'flex',
    minHeight: 'unset',
    py: 1.1,
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'background.paper',
    borderRadius: 1.5,
    minHeight: 44,
    '& fieldset': {
      borderColor: '#e2e5ea',
    },
    '&:hover fieldset': {
      borderColor: 'text.secondary',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: 1,
    },
  },
}

const fieldLabelSx = {
  color: 'text.primary',
  fontSize: '0.85rem',
  fontWeight: 700,
  mb: 0.625,
}

const buildFormState = (address) => {
  if (!address) {
    return initialFormState
  }

  return {
    ...initialFormState,
    ...address,
    addressType: address.addressType || 'home',
    isDefault: Boolean(address.isDefault),
  }
}

const trimAddressPayload = (formState) => {
  return {
    fullName: formState.fullName.trim(),
    phone: formState.phone.trim(),
    addressLine1: formState.addressLine1.trim(),
    addressLine2: formState.addressLine2.trim(),
    city: formState.city.trim(),
    state: formState.state.trim(),
    pincode: formState.pincode.trim(),
    country: formState.country.trim(),
    isDefault: Boolean(formState.isDefault),
    addressType: formState.addressType,
  }
}

const validateAddress = (formState) => {
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

const getDigits = (value) => String(value || '').replace(/\D/g, '')

const validateAddressField = (fieldName, value) => {
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

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return 'Enter a valid phone number with 10 to 15 digits.'
    }
  }

  if (fieldName === 'addressLine1' && trimmedValue.length < 5) {
    return 'Address line 1 must include at least 5 characters.'
  }

  if (fieldName === 'city' && trimmedValue.length < 2) {
    return 'City must be at least 2 characters.'
  }

  if (fieldName === 'state' && trimmedValue.length < 2) {
    return 'State must be at least 2 characters.'
  }

  if (fieldName === 'country' && trimmedValue.length < 2) {
    return 'Country must be at least 2 characters.'
  }

  if (fieldName === 'pincode' && !/^[a-zA-Z0-9][a-zA-Z0-9 -]{2,9}$/.test(trimmedValue)) {
    return 'Enter a valid pincode using 3 to 10 letters, numbers, spaces, or hyphens.'
  }

  return ''
}

function AddEditAddressModal({
  address,
  error,
  loading,
  onClose,
  onSubmit,
  open,
}) {
  const [formState, setFormState] = useState(() => buildFormState(address))
  const [fieldErrors, setFieldErrors] = useState({})
  const isEditing = Boolean(address?.id)
  const title = isEditing ? 'Edit Address' : 'Add Address'

  const description = useMemo(
    () => (
      isEditing
        ? 'Update this saved delivery address.'
        : 'Save a delivery address for future orders.'
    ),
    [isEditing],
  )

  const handleFieldChange = (fieldName) => (event) => {
    const value = event.target.value

    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: '',
    }))
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

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextFieldErrors = validateAddress(formState)

    setFieldErrors(nextFieldErrors)

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return
    }

    onSubmit(trimAddressPayload(formState))
  }

  return (
    <AppModal
      description={description}
      maxWidth="md"
      onClose={loading ? undefined : onClose}
      open={open}
      title={title}
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error ? (
            <Alert severity="error" sx={{ borderRadius: 1.5 }}>
              {error}
            </Alert>
          ) : null}

          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2, md: 2.25 },
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <AppInput
              error={Boolean(fieldErrors.addressType)}
              errorText={fieldErrors.addressType}
              fieldSx={formFieldSx}
              label="Address Type"
              labelSx={fieldLabelSx}
              name="addressType"
              onBlur={handleFieldBlur('addressType')}
              onChange={handleFieldChange('addressType')}
              required
              select
              value={formState.addressType}
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="work">Work</MenuItem>
            </AppInput>

            {addressFields.map((field) => (
              <AppInput
                autoComplete={field.autoComplete}
                error={Boolean(fieldErrors[field.name])}
                errorText={fieldErrors[field.name]}
                fieldSx={formFieldSx}
                key={field.name}
                label={field.label}
                labelSx={fieldLabelSx}
                name={field.name}
                onBlur={handleFieldBlur(field.name)}
                onChange={handleFieldChange(field.name)}
                placeholder={field.placeholder}
                required={field.required}
                sx={{ gridColumn: field.gridColumn }}
                type={field.type || 'text'}
                value={formState[field.name]}
              />
            ))}
          </Box>

          <FormControlLabel
            control={(
              <Checkbox
                checked={formState.isDefault}
                onChange={handleDefaultChange}
              />
            )}
            label="Set as default delivery address"
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="flex-end"
            spacing={1.5}
          >
            <AppButton
              disabled={loading}
              onClick={onClose}
              type="button"
              variant="outlined"
            >
              Cancel
            </AppButton>
            <AppButton
              loading={loading}
              loadingText={isEditing ? 'Updating...' : 'Saving...'}
              type="submit"
              variant="contained"
            >
              {isEditing ? 'Update Address' : 'Save Address'}
            </AppButton>
          </Stack>
        </Stack>
      </Box>
    </AppModal>
  )
}

export default AddEditAddressModal
