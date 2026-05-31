import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { Alert, Box, CircularProgress, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import AddressForm from './AddressForm.jsx'
import AddressOption from './AddressOption.jsx'

function ModeButton({
  active,
  children,
  disabled,
  icon,
  onClick,
}) {
  return (
    <Box
      component="button"
      disabled={disabled}
      onClick={onClick}
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
        border: '1px solid',
        borderColor: active ? 'primary.main' : 'divider',
        borderRadius: 1.25,
        color: active ? 'primary.main' : 'text.secondary',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        flex: 1,
        font: 'inherit',
        fontSize: '0.95rem',
        fontWeight: 800,
        gap: 0.75,
        justifyContent: 'center',
        minHeight: 44,
        opacity: disabled ? 0.45 : 1,
        px: 1.25,
      })}
      type="button"
    >
      {icon}
      {children}
    </Box>
  )
}

function ShippingDetails({
  addressError,
  addressLoading,
  addressMode,
  addresses,
  fieldErrors,
  formState,
  isPincodeLookupLoading,
  onDefaultChange,
  onFieldBlur,
  onFieldChange,
  onModeChange,
  onSelectAddress,
  selectedAddressId,
}) {
  const isNewAddress = addressMode === 'new'

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <ModeButton
          active={addressMode === 'saved'}
          disabled={!addresses.length}
          icon={<HomeWorkOutlinedIcon fontSize="small" />}
          onClick={() => onModeChange('saved')}
        >
          Saved addresses
        </ModeButton>
        <ModeButton
          active={isNewAddress}
          icon={<AddLocationAltOutlinedIcon fontSize="small" />}
          onClick={() => onModeChange('new')}
        >
          Add new
        </ModeButton>
      </Stack>

      {addressError ? (
        <Alert severity="error" sx={{ borderRadius: 1.25 }}>
          {addressError}
        </Alert>
      ) : null}

      {addressLoading ? (
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: 160 }}>
          <CircularProgress />
        </Box>
      ) : isNewAddress ? (
        <AddressForm
          fieldErrors={fieldErrors}
          formState={formState}
          hasSavedAddresses={Boolean(addresses.length)}
          isPincodeLookupLoading={isPincodeLookupLoading}
          onDefaultChange={onDefaultChange}
          onFieldBlur={onFieldBlur}
          onFieldChange={onFieldChange}
        />
      ) : (
        <Stack spacing={1.25}>
          {addresses.map((address) => (
            <AddressOption
              address={address}
              key={address.id}
              onSelect={onSelectAddress}
              selected={selectedAddressId === address.id}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default ShippingDetails
