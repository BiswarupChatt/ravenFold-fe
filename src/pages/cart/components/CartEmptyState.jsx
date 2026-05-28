import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'

function CartEmptyState({ isDrawer, isMobile, onNavigate }) {
  return (
    <Stack
      alignItems={isDrawer || isMobile ? 'stretch' : 'center'}
      spacing={2}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: isDrawer ? 2.25 : 5,
        textAlign: isDrawer || isMobile ? 'left' : 'center',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          alignSelf: isDrawer || isMobile ? 'flex-start' : 'center',
          bgcolor: '#f1ece4',
          borderRadius: '50%',
          display: 'flex',
          height: 58,
          justifyContent: 'center',
          width: 58,
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
      </Box>

      <Stack spacing={0.75}>
        <Typography sx={{ fontSize: '1.08rem', fontWeight: 650 }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary">
          Add a product to start your order.
        </Typography>
      </Stack>

      <AppButton
        component={RouterLink}
        fullWidth={isDrawer || isMobile}
        onClick={onNavigate}
        sx={{ alignSelf: isDrawer || isMobile ? 'stretch' : 'center' }}
        to="/shop"
        variant="contained"
      >
        Continue Shopping
      </AppButton>
    </Stack>
  )
}

export default CartEmptyState
