import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import AppButton from '../../../components/AppButton.jsx'
import {
  formatPrice,
  getCartLineTotal,
  parseVariantDetails,
} from '../../../utils/utils.js'
import { getSummaryTotals } from '../../cart/components/cartSummaryUtils.js'

const previewItemCount = 2

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
          fontSize: '0.86rem',
          fontWeight: 450,
          lineHeight: 1.25,
          minWidth: 0,
          ...labelSx,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: '0.86rem',
          fontWeight: 500,
          lineHeight: 1.25,
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

function ProductImage({ item }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: '#f4efe8',
        border: '1px solid',
        borderColor: 'rgba(31, 41, 55, 0.1)',
        borderRadius: 1,
        display: 'flex',
        flexShrink: 0,
        height: 38,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 38,
      }}
    >
      {item.image ? (
        <Box
          alt={item.name}
          component="img"
          src={item.image}
          sx={{
            height: '100%',
            objectFit: 'cover',
            width: '100%',
          }}
        />
      ) : (
        <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
      )}
    </Box>
  )
}

function OrderItem({ item }) {
  const detailItems = parseVariantDetails(item.variantLabel || '')
  const variantText = detailItems
    .map((detail) => (detail.label ? `${detail.label}: ${detail.value}` : detail.value))
    .join(' / ')

  return (
    <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
      <ProductImage item={item} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            alignItems: 'start',
            columnGap: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
          }}
        >
          <Typography
            sx={{
              color: 'text.primary',
              display: '-webkit-box',
              fontSize: '0.9rem',
              fontWeight: 700,
              lineHeight: 1.25,
              overflow: 'hidden',
              overflowWrap: 'anywhere',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {item.name}
          </Typography>

          <Typography
            sx={{
              color: 'text.primary',
              fontSize: '0.9rem',
              fontWeight: 750,
              lineHeight: 1.25,
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            {formatPrice(getCartLineTotal(item))}
          </Typography>
        </Box>

        {variantText ? (
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.82rem',
              lineHeight: 1.35,
              mt: 0.3,
              overflowWrap: 'anywhere',
            }}
          >
            {variantText}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  )
}

function CheckoutOrderSummary({
  disabled,
  items = [],
  loading,
  onPayment,
  subtotal,
}) {
  const [itemsExpanded, setItemsExpanded] = useState(false)
  const {
    bagDiscount,
    couponDiscount,
    shippingCharge,
    totalMrp,
    totalPayable,
  } = getSummaryTotals(items, subtotal)
  const visibleItems = items.slice(0, previewItemCount)
  const collapsedItems = items.slice(previewItemCount)
  const hasMoreItems = collapsedItems.length > 0
  const remainingCount = collapsedItems.length
  const savings = bagDiscount + couponDiscount

  const handleToggleItems = () => {
    setItemsExpanded((currentValue) => !currentValue)
  }

  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: { xs: 1.75, md: 2 },
      }}
      variant="outlined"
    >
      <Stack spacing={1}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Order Summary
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.84rem', mt: 0.25 }}>
              {items.length} item{items.length === 1 ? '' : 's'} in your order
            </Typography>
          </Box>

        </Stack>

        <Stack
          divider={<Divider flexItem />}
          spacing={0.75}
          sx={{
            bgcolor: 'rgba(248, 245, 240, 0.62)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.25,
            p: 0.8,
          }}
        >
          {visibleItems.map((item) => (
            <OrderItem item={item} key={`${item.id}:${item.variantId || ''}`} />
          ))}

          {hasMoreItems ? (
            <Button
              aria-expanded={itemsExpanded}
              endIcon={(
                <KeyboardArrowDownRoundedIcon
                  sx={{
                    transform: itemsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 220ms ease',
                  }}
                />
              )}
              onClick={handleToggleItems}
              sx={{
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                fontSize: '0.86rem',
                fontWeight: 800,
                minHeight: 32,
                mt: '0 !important',
                px: 0.75,
                textTransform: 'none',
              }}
              type="button"
              variant="text"
            >
              {itemsExpanded ? 'Show Less' : `(${remainingCount}) More Item${remainingCount === 1 ? '' : 's'} `}
            </Button>
          ) : null}

          {hasMoreItems ? (
            <Collapse in={itemsExpanded} timeout={260} unmountOnExit>
              <Stack divider={<Divider flexItem />} spacing={0.75}>
                {collapsedItems.map((item) => (
                  <OrderItem item={item} key={`${item.id}:${item.variantId || ''}`} />
                ))}
              </Stack>
            </Collapse>
          ) : null}
        </Stack>

        <Stack
          spacing={0.65}
          sx={{
            bgcolor: 'rgba(248, 245, 240, 0.62)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.25,
            p: 0.9,
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
                fontSize: '0.82rem',
                fontWeight: 550,
                lineHeight: 1.2,
              }}
            >
              You save {formatPrice(savings)} on this order.
            </Typography>
          ) : null}
        </Stack>

        <AppButton
          disabled={disabled}
          fullWidth
          loading={loading}
          loadingText="Checking..."
          onClick={onPayment}
          sx={{
            borderRadius: 2,
            minHeight: 50,
          }}
          type="button"
          variant="contained"
        >
          Pay {formatPrice(totalPayable)}
        </AppButton>
      </Stack>
    </Paper>
  )
}

export default CheckoutOrderSummary
