import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material'

const getAddressTypeLabel = (addressType) => {
  return addressType === 'work' ? 'Work' : 'Home'
}

const getAddressTypeIcon = (addressType) => {
  return addressType === 'work' ? <WorkOutlineOutlinedIcon /> : <HomeOutlinedIcon />
}

function AddressCard({
  address,
  onDelete,
  onEdit,
}) {
  const addressLabel = getAddressTypeLabel(address.addressType)
  const locationLine = [address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ')

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: { xs: 1.75, sm: 2 },
      }}
    >
      <Stack
        alignItems="flex-start"
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
            <Chip
              icon={getAddressTypeIcon(address.addressType)}
              label={addressLabel}
              size="small"
              sx={{ borderRadius: 1, fontWeight: 800 }}
              variant="outlined"
            />
            {address.isDefault ? (
              <Chip
                color="primary"
                label="Default"
                size="small"
                sx={{ borderRadius: 1, fontWeight: 800 }}
              />
            ) : null}
          </Stack>

          <Box>
            <Typography fontWeight={800}>{address.fullName}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {address.phone}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary">{address.addressLine1}</Typography>
            {address.addressLine2 ? (
              <Typography color="text.secondary">{address.addressLine2}</Typography>
            ) : null}
            <Typography color="text.secondary">{locationLine}</Typography>
            <Typography color="text.secondary">{address.country}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit address">
            <IconButton aria-label={`Edit ${addressLabel} address`} onClick={() => onEdit(address)}>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete address">
            <IconButton
              aria-label={`Delete ${addressLabel} address`}
              color="error"
              onClick={() => onDelete(address)}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  )
}

export default AddressCard
