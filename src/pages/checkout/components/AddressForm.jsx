import { Box, Checkbox, CircularProgress, FormControlLabel, MenuItem, Stack, Typography } from '@mui/material'
import AppInput from '../../../components/AppInput.jsx'
import { addressFields } from './checkoutAddressUtils.js'

const formFieldSx = {
  '& .MuiInputBase-input': {
    '&::placeholder': {
      color: 'text.secondary',
      opacity: 1,
    },
    color: 'text.primary',
    fontSize: '0.85rem',
    px: 1.5,
    py: 1.05,
  },
  '& .MuiInputBase-input.MuiSelect-select': {
    alignItems: 'center',
    display: 'flex',
    minHeight: 'unset',
    py: 1.05,
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'background.paper',
    borderRadius: 1,
    minHeight: 42,
    '& fieldset': {
      borderColor: 'divider',
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
  fontSize: '0.82rem',
  fontWeight: 700,
  mb: 0.5,
}

function AddressForm({
  fieldErrors,
  formState,
  hasSavedAddresses,
  isPincodeLookupLoading,
  onDefaultChange,
  onFieldBlur,
  onFieldChange,
  showDefaultCheckbox = true,
}) {
  return (
    <Stack spacing={2.25}>
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.75, md: 2 },
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
          onBlur={onFieldBlur('addressType')}
          onChange={onFieldChange('addressType')}
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
            onBlur={onFieldBlur(field.name)}
            onChange={onFieldChange(field.name)}
            placeholder={field.placeholder}
            required={field.required}
            rightAdornment={
              field.name === 'pincode' && isPincodeLookupLoading
                ? <CircularProgress color="inherit" size={16} thickness={5} />
                : undefined
            }
            slotProps={{
              htmlInput: {
                inputMode: field.inputMode,
                maxLength: field.maxLength,
              },
            }}
            sx={{ gridColumn: field.gridColumn }}
            type={field.type || 'text'}
            value={formState[field.name]}
          />
        ))}
      </Box>

      {showDefaultCheckbox ? (
        <FormControlLabel
          control={(
            <Checkbox
              checked={!hasSavedAddresses || formState.isDefault}
              disabled={!hasSavedAddresses}
              onChange={onDefaultChange}
              size="small"
            />
          )}
          label={(
            <Typography sx={{ color: 'text.primary', fontSize: '0.88rem' }}>
              {hasSavedAddresses
                ? 'Set as default delivery address'
                : 'This will be saved as your default delivery address'}
            </Typography>
          )}
          sx={{ alignItems: 'flex-start', m: 0 }}
        />
      ) : null}
    </Stack>
  )
}

export default AddressForm
