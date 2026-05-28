import { Divider, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'
import { errorToast } from '../../../services/toast.js'
import formatPrice from '../../../utils/formatPrice.js'

function CartSummary({
  disabled,
  isDrawer,
  isMobile,
  onNavigate,
  quantity,
  subtotal,
}) {
  if (!isDrawer) {
    return (
      <Paper
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 20px 56px rgba(15, 23, 42, 0.1)',
          p: { xs: 2.25, md: 2.75 },
        }}
        variant="outlined"
      >
        <Stack spacing={2.4}>
          <Stack spacing={0.5}>
            <Typography sx={{ color: 'text.primary', fontSize: '1.08rem', fontWeight: 650 }}>
              Order Summary
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.92rem', lineHeight: 1.45 }}>
              Review totals before moving to checkout.
            </Typography>
          </Stack>

          <Stack spacing={1.2}>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Items
              </Typography>
              <Typography sx={{ fontWeight: 650 }}>
                {quantity}
              </Typography>
            </Stack>

            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontWeight: 650 }}>
                {formatPrice(subtotal)}
              </Typography>
            </Stack>

            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Shipping
              </Typography>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Calculated at checkout
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 650 }}>
              Estimated Total
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.16rem', fontWeight: 700 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Stack>

          <AppButton
            disabled={disabled}
            fullWidth
            onClick={() => errorToast('Checkout is not available yet.')}
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 2,
              minHeight: 52,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            variant="contained"
          >
            Proceed to Checkout
          </AppButton>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none',
        p: 2,
        position: 'static',
      }}
      variant="outlined"
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 650 }}>
          Order Summary
        </Typography>

        <Stack spacing={1.1}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              Items
            </Typography>
            <Typography fontWeight={650}>
              {quantity}
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              Subtotal
            </Typography>
            <Typography fontWeight={650}>
              {formatPrice(subtotal)}
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              Shipping
            </Typography>
            <Typography color="text.secondary" fontWeight={500}>
              Calculated later
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 650 }}>
            Total
          </Typography>
          <Typography sx={{ color: 'primary.main', fontSize: '1.1rem', fontWeight: 700 }}>
            {formatPrice(subtotal)}
          </Typography>
        </Stack>

        <Typography color="text.secondary" sx={{ fontSize: '0.88rem', lineHeight: 1.45 }}>
          Taxes are included. Shipping is confirmed during checkout.
        </Typography>

        <AppButton
          component={RouterLink}
          disabled={disabled}
          fullWidth
          onClick={onNavigate}
          to="/shop"
          variant="contained"
        >
          Continue Shopping
        </AppButton>
      </Stack>
    </Paper>
  )
}

export default CartSummary
