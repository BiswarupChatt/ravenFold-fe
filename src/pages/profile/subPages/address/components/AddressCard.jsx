import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { Fragment } from 'react'

const getAddressTypeLabel = (addressType) => {
  return addressType === 'work' ? 'Work' : 'Home'
}

function AddressCard({
  address,
  isSettingDefault = false,
  onDelete,
  onEdit,
  onSetDefault,
}) {
  const locationLine = [
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(', ').toUpperCase()

  const actionSx = {
    fontSize: '0.95rem',
    fontWeight: 500,
    minHeight: 'auto',
    minWidth: 0,
    p: 0,
    textTransform: 'none',
  }

  const actions = [
    {
      label: 'Edit',
      onClick: () => onEdit(address),
    },
    {
      label: 'Remove',
      onClick: () => onDelete(address),
    },
    ...(
      address.isDefault
        ? []
        : [
          {
            disabled: isSettingDefault,
            label: isSettingDefault ? 'Setting...' : 'Set as Default',
            onClick: () => onSetDefault(address),
          },
        ]
    ),
  ]

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.25,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 230,
        overflow: 'hidden',
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          flex: 1,
          justifyContent: 'space-between',
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Box>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{
              mb: 0.75,
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <Typography
              component="h3"
              sx={{
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 900,
                lineHeight: 1.35,
              }}
            >
              {address.fullName}
            </Typography>

            {address.isDefault ? (
              <Chip
                label="Default"
                size="medium"
                sx={{
                  borderRadius: 1,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  height: 24,
                }}
              />
            ) : null}
          </Stack>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.86rem',
              fontWeight: 700,
              mb: 0.75,
            }}
          >
            {getAddressTypeLabel(address.addressType)}
          </Typography>

          <Box sx={{ color: 'text.primary' }}>
            <Typography>{address.addressLine1}</Typography>
            {address.addressLine2 ? (
              <Typography>{address.addressLine2}</Typography>
            ) : null}
            {locationLine ? (
              <Typography>{locationLine}</Typography>
            ) : null}
            <Typography>{address.country}</Typography>
          </Box>

          <Typography sx={{ mt: 0.75 }}>
            Phone number: {address.phone}
          </Typography>
        </Box>

        <Box
          alignItems="center"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            lineHeight: 1,
            minHeight: 28,
            pt: 0.5,
          }}
        >
          {actions.map((action, index) => (
            <Fragment key={action.label}>
              {index > 0 ? (
                <Typography
                  aria-hidden="true"
                  component="span"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    mx: 1.25,
                  }}
                >
                  |
                </Typography>
              ) : null}
              <Button
                disabled={action.disabled}
                onClick={action.onClick}
                sx={actionSx}
                variant="text"
              >
                {action.label}
              </Button>
            </Fragment>
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

export default AddressCard
