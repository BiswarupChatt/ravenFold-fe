import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'

const addresses = [
  {
    id: 'home',
    label: 'Home',
    name: 'Biswarup Chatterjee',
    lineOne: '221B Lake Road',
    lineTwo: 'Kolkata, West Bengal 700029',
    phone: '+91 98765 43210',
  },
  {
    id: 'work',
    label: 'Work',
    name: 'Biswarup Chatterjee',
    lineOne: 'Sector V, Salt Lake',
    lineTwo: 'Kolkata, West Bengal 700091',
    phone: '+91 98765 43210',
  },
]

function Address() {
  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'stretch', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h3">Addresses</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Saved delivery locations for faster checkout.
          </Typography>
        </Box>

        <Button startIcon={<AddLocationAltOutlinedIcon />} variant="contained">
          Add Address
        </Button>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        {addresses.map((address) => (
          <Box
            key={address.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              p: 2,
            }}
          >
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={0.75}>
                <Typography fontWeight={800}>{address.label}</Typography>
                <Typography>{address.name}</Typography>
                <Typography color="text.secondary">{address.lineOne}</Typography>
                <Typography color="text.secondary">{address.lineTwo}</Typography>
                <Typography color="text.secondary">{address.phone}</Typography>
              </Stack>

              <IconButton aria-label={`Edit ${address.label} address`}>
                <EditOutlinedIcon />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

export default Address
