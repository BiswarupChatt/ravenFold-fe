import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import { Box, Button, InputBase } from '@mui/material'
import { useState } from 'react'
import { errorToast } from '../../../services/toast.js'

function CartCoupon({ isDrawer }) {
  const [couponCode, setCouponCode] = useState('')

  const handleApply = () => {
    if (!couponCode.trim()) return
    // Placeholder logic for coupon application
    errorToast('Coupon codes are not supported yet.')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flex: 1,
          px: 1.5,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
            display: 'flex',
            pr: 1,
          }}
        >
          <LocalOfferOutlinedIcon fontSize="small" />
        </Box>
        <InputBase
          fullWidth
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          sx={{
            fontSize: '0.94rem',
            py: 0.5,
          }}
          value={couponCode}
        />
      </Box>
      <Button
        color="primary"
        disabled={!couponCode.trim()}
        onClick={handleApply}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          minWidth: 80,
          px: 2,
        }}
        variant="contained"
      >
        Apply
      </Button>
    </Box>
  )
}

export default CartCoupon
