import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'
import { errorToast } from '../../../services/toast.js'
import { formatPrice, getCartPricing, toFiniteNumber } from '../../../utils/utils.js'

const getSummaryTotals = (items = [], subtotal = 0) => {
  const subtotalValue = toFiniteNumber(subtotal)
  const totalMrp = items.reduce((total, item) => {
    const { compareAtPrice, price } = getCartPricing(item)
    const mrp = compareAtPrice || price

    return total + mrp * toFiniteNumber(item.quantity)
  }, 0)
  const mrpValue = Math.max(totalMrp, subtotalValue)
  const bagDiscount = Math.max(mrpValue - subtotalValue, 0)
  const couponDiscount = 0
  const shippingCharge = 0
  const totalPayable = Math.max(subtotalValue - couponDiscount + shippingCharge, 0)

  return {
    bagDiscount,
    couponDiscount,
    shippingCharge,
    subtotal: subtotalValue,
    totalMrp: mrpValue,
    totalPayable,
  }
}

function SummaryRow({
  label,
  labelSx,
  value,
  valueSx,
}) {
  return (
    <Box
      sx={{
        alignItems: 'start',
        columnGap: 2,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
      }}
    >
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '0.94rem',
          fontWeight: 450,
          lineHeight: 1.35,
          minWidth: 0,
          ...labelSx,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '0.94rem',
          fontWeight: 500,
          lineHeight: 1.35,
          textAlign: 'right',
          whiteSpace: 'nowrap',
          ...valueSx,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function CartSummary({ disabled, isDrawer, items = [], onNavigate, subtotal }) {
  const [expanded, setExpanded] = useState(false)
  const {
    bagDiscount,
    couponDiscount,
    shippingCharge,
    totalMrp,
    totalPayable,
  } = getSummaryTotals(items, subtotal)
  const titleSize = isDrawer ? '1rem' : '1.12rem'
  const rowTextSize = isDrawer ? '0.96rem' : '1rem'
  const savings = bagDiscount + couponDiscount
  const iconBoxSize = isDrawer ? 26 : 32
  const summarySpacing = isDrawer ? 0.9 : 2

  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: isDrawer ? 1 : { xs: 2.25, md: 2.75 },
      }}
      variant="outlined"
    >
      <Stack spacing={summarySpacing}>
        <Box
          aria-expanded={expanded}
          component="button"
          onClick={() => setExpanded((value) => !value)}
          sx={{
            alignItems: 'center',
            bgcolor: 'transparent',
            border: 0,
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            font: 'inherit',
            justifyContent: 'space-between',
            p: 0,
            textAlign: 'left',
            width: '100%',
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: 4,
            },
          }}
          type="button"
        >
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Order Summary
          </Typography>

          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              color: 'text.primary',
              display: 'flex',
              flexShrink: 0,
              height: iconBoxSize,
              justifyContent: 'center',
              width: iconBoxSize,
            }}
          >
            <KeyboardArrowDownRoundedIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </Box>
        </Box>

        <Box
          aria-hidden={!expanded}
          sx={{
            contain: 'layout paint',
            display: 'grid',
            gridTemplateRows: expanded ? '1fr' : '0fr',
            overflow: 'hidden',
            pointerEvents: expanded ? 'auto' : 'none',
            mt: expanded ? undefined : '0 !important',
            transition: 'grid-template-rows 340ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'grid-template-rows',
          }}
        >
          <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
            <Stack
              spacing={isDrawer ? 0.8 : 1.45}
              sx={{
                bgcolor: 'rgba(248, 245, 240, 0.62)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                opacity: expanded ? 1 : 0,
                p: isDrawer ? 0.9 : 1.65,
                transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
                transition: expanded
                  ? 'opacity 220ms ease 90ms, transform 340ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'opacity 120ms ease, transform 180ms ease',
                willChange: 'opacity, transform',
              }}
            >
              <SummaryRow
                label="Total MRP"
                value={formatPrice(totalMrp)}
              />

              <SummaryRow
                label="Bag Discount (Incl. Of GST Benefit)"
                value={bagDiscount ? `- ${formatPrice(bagDiscount)}` : formatPrice(0)}
              />

              <SummaryRow
                label="Coupon Discount"
                value={couponDiscount ? `- ${formatPrice(couponDiscount)}` : formatPrice(0)}
                valueSx={couponDiscount ? { color: '#00a53b' } : undefined}
              />

              <SummaryRow
                label="Shipping Charge"
                value={shippingCharge ? formatPrice(shippingCharge) : 'Free'}
                valueSx={{ color: '#00a53b', fontWeight: 600 }}
              />

              {savings ? (
                <Typography
                  sx={{
                    color: '#008f35',
                    fontSize: '0.84rem',
                    fontWeight: 550,
                    lineHeight: 1.35,
                  }}
                >
                  You save {formatPrice(savings)} on this order.
                </Typography>
              ) : null}
            </Stack>
          </Box>
        </Box>

        <Stack
          sx={{
            bgcolor: '#f8f5f0',
            border: '1px solid',
            borderColor: 'rgba(31, 41, 55, 0.1)',
            borderRadius: 2,
            p: isDrawer ? 0.85 : 1.5,
          }}
        >
          <SummaryRow
            label="Total Payable"
            labelSx={{
              color: 'text.primary',
              fontSize: rowTextSize,
              fontWeight: 700,
            }}
            value={formatPrice(totalPayable)}
            valueSx={{
              color: 'text.primary',
              fontSize: rowTextSize,
              fontWeight: 700,
            }}
          />
        </Stack>

        {isDrawer ? (
          <AppButton
            component={RouterLink}
            disabled={disabled}
            fullWidth
            onClick={onNavigate}
            sx={{ minHeight: 38 }}
            to="/shop"
            variant="contained"
          >
            Continue Shopping
          </AppButton>
        ) : (
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
        )}
      </Stack>
    </Paper>
  )
}

export default CartSummary
