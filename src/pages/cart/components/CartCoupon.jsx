import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import { Box, Button, InputBase, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { formatPrice } from '../../../utils/utils.js'

function CartCoupon({
  couponCode = '',
  disabled = false,
  isAuthenticated = false,
  loading = false,
  productDiscountAmount = 0,
  rejectedCoupon = null,
  onApply,
  onRemove,
}) {
  const [draftCode, setDraftCode] = useState(couponCode)
  const isApplied = Boolean(couponCode) && !rejectedCoupon

  useEffect(() => {
    setDraftCode(couponCode)
  }, [couponCode])

  const handleApply = () => {
    if (!draftCode.trim()) return

    onApply?.(draftCode.trim())
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: rejectedCoupon ? 'error.main' : 'divider',
            borderRadius: 2,
            display: 'flex',
            flex: 1,
            px: 1.5,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              color: rejectedCoupon ? 'error.main' : 'text.secondary',
              display: 'flex',
              pr: 1,
            }}
          >
            <LocalOfferOutlinedIcon fontSize="small" />
          </Box>
          <InputBase
            fullWidth
            disabled={disabled || !isAuthenticated}
            onChange={(e) => setDraftCode(e.target.value.toUpperCase())}
            placeholder={isAuthenticated ? 'Enter coupon code' : 'Sign in to apply coupons'}
            sx={{
              fontSize: '0.94rem',
              py: 0.5,
            }}
            value={draftCode}
          />
        </Box>

        {isApplied ? (
          <Button
            color="inherit"
            disabled={disabled || loading}
            onClick={onRemove}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              minWidth: 88,
              px: 2,
            }}
            variant="outlined"
          >
            Remove
          </Button>
        ) : (
          <Button
            color="primary"
            disabled={disabled || loading || !draftCode.trim() || !isAuthenticated}
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
        )}
      </Box>

      {!isAuthenticated ? (
        <Typography color="text.secondary" sx={{ fontSize: '0.78rem', mt: 0.7 }}>
          Sign in to apply coupon codes at checkout.
        </Typography>
      ) : null}

      {isApplied ? (
        <Typography
          sx={{
            color: '#008f35',
            fontSize: '0.78rem',
            fontWeight: 600,
            mt: 0.7,
          }}
        >
          {productDiscountAmount > 0
            ? `${couponCode} applied. You saved ${formatPrice(productDiscountAmount)}.`
            : `${couponCode} applied.`}
        </Typography>
      ) : null}

      {rejectedCoupon?.reason ? (
        <Typography color="error.main" sx={{ fontSize: '0.78rem', mt: 0.7 }}>
          {rejectedCoupon.reason}
        </Typography>
      ) : null}
    </Box>
  )
}

export default CartCoupon
