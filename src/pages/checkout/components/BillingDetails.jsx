import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import AddressForm from './AddressForm.jsx'

function BillingDetails({
  fieldErrors,
  formState,
  isPincodeLookupLoading,
  onFieldBlur,
  onFieldChange,
  onSameAsShippingChange,
  sameAsShipping,
}) {
  return (
    <Stack spacing={2}>
      <FormControlLabel
        control={(
          <Checkbox
            checked={sameAsShipping}
            onChange={onSameAsShippingChange}
            size="small"
          />
        )}
        label={(
          <Typography sx={{ color: 'text.primary', fontSize: '0.92rem', fontWeight: 650 }}>
            Same as shipping address
          </Typography>
        )}
        sx={{ alignItems: 'flex-start', m: 0 }}
      />

      {!sameAsShipping ? (
        <AddressForm
          fieldErrors={fieldErrors}
          formState={formState}
          hasSavedAddresses
          isPincodeLookupLoading={isPincodeLookupLoading}
          onFieldBlur={onFieldBlur}
          onFieldChange={onFieldChange}
          showDefaultCheckbox={false}
        />
      ) : null}
    </Stack>
  )
}

export default BillingDetails
