import { Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'

function EmptyCheckout() {
  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none',
        p: { xs: 3, md: 4 },
        textAlign: 'center',
      }}
      variant="outlined"
    >
      <Stack alignItems="center" spacing={1.5}>
        <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', fontWeight: 850 }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          Add items to your cart before choosing a delivery address and payment option.
        </Typography>
        <AppButton component={RouterLink} to="/cart" variant="contained">
          Back to Cart
        </AppButton>
      </Stack>
    </Paper>
  )
}

export default EmptyCheckout
