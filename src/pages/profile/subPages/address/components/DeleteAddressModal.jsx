import { Box, Stack, Typography } from '@mui/material'
import AppButton from '../../../../../components/AppButton'
import AppModal from '../../../../../components/AppModal'
import useResponsiveView from '../../../../../hooks/useResponsiveView'

function DeleteAddressModal({
  address,
  loading,
  onClose,
  onConfirm,
  open,
}) {
  const { isMobile } = useResponsiveView()
  const locationLine = [
    address?.city,
    address?.state,
    address?.pincode,
  ].filter(Boolean).join(', ')

  return (
    <AppModal
      description="This saved delivery address will be removed from your account."
      maxWidth="xs"
      onClose={loading ? undefined : onClose}
      open={open}
      title="Remove Address"
    >
      <Stack spacing={2.5}>
        {address ? (
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography fontWeight={900}>{address.fullName}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {address.addressLine1}
            </Typography>
            {address.addressLine2 ? (
              <Typography color="text.secondary">{address.addressLine2}</Typography>
            ) : null}
            {locationLine ? (
              <Typography color="text.secondary">{locationLine}</Typography>
            ) : null}
            <Typography color="text.secondary">{address.country}</Typography>
          </Box>
        ) : null}

        <Stack
          direction={isMobile ? 'column' : 'row'}
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
            color="error"
            loading={loading}
            loadingText="Removing..."
            onClick={onConfirm}
            type="button"
            variant="contained"
          >
            Remove
          </AppButton>
        </Stack>
      </Stack>
    </AppModal>
  )
}

export default DeleteAddressModal
