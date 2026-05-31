import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { getAddressLocationLine, getAddressTypeLabel } from './checkoutAddressUtils.js'

function AddressOption({
  address,
  onSelect,
  selected,
}) {
  return (
    <Box
      component="button"
      onClick={() => onSelect(address.id)}
      sx={(theme) => ({
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 1.5,
        color: 'inherit',
        cursor: 'pointer',
        display: 'block',
        font: 'inherit',
        p: 1.5,
        textAlign: 'left',
        transition: 'border-color 160ms ease, background-color 160ms ease',
        width: '100%',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderColor: selected ? 'primary.main' : 'text.secondary',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      })}
      type="button"
    >
      <Stack direction="row" spacing={1.25}>
        <Box
          sx={{
            alignItems: 'center',
            color: selected ? 'primary.main' : 'divider',
            display: 'flex',
            flexShrink: 0,
            height: 24,
            justifyContent: 'center',
            mt: 0.1,
            width: 24,
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 21 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Stack alignItems="center" direction="row" flexWrap="wrap" gap={0.75}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '0.96rem',
                fontWeight: 800,
                lineHeight: 1.3,
                overflowWrap: 'anywhere',
              }}
            >
              {address.fullName}
            </Typography>
            <Chip
              label={getAddressTypeLabel(address.addressType)}
              size="small"
              sx={{ borderRadius: 1, fontSize: '0.72rem', fontWeight: 750, height: 22 }}
            />
            {address.isDefault ? (
              <Chip
                color="primary"
                label="Default"
                size="small"
                sx={{ borderRadius: 1, fontSize: '0.72rem', fontWeight: 750, height: 22 }}
              />
            ) : null}
          </Stack>

          <Typography
            sx={{
              color: 'text.primary',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              mt: 0.75,
              overflowWrap: 'anywhere',
            }}
          >
            {[address.addressLine1, address.addressLine2, getAddressLocationLine(address), address.country]
              .filter(Boolean)
              .join(', ')}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '0.84rem', mt: 0.35 }}>
            {address.phone}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default AddressOption
