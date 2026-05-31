import AddressForm from './AddressForm.jsx'

function BillingDetails({
  fieldErrors,
  formState,
  isPincodeLookupLoading,
  onFieldBlur,
  onFieldChange,
}) {
  return (
    <AddressForm
      fieldErrors={fieldErrors}
      formState={formState}
      hasSavedAddresses
      isPincodeLookupLoading={isPincodeLookupLoading}
      onFieldBlur={onFieldBlur}
      onFieldChange={onFieldChange}
      showDefaultCheckbox={false}
    />
  )
}

export default BillingDetails
