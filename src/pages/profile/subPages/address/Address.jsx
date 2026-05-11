import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import ProfileIntro from '../../components/ProfileIntro'

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
      <ProfileIntro
        action={(
          <Button startIcon={<AddLocationAltOutlinedIcon />} variant="text">
            Add Address
          </Button>
        )}
        description="Saved delivery locations for faster checkout."
        title="Addresses"
      />

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
