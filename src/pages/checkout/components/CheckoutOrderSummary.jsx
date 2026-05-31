import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import {
  formatPrice,
  getCartLineTotal,
  getCartPricing,
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

function ProductImage({ item }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: '#f4efe8',
        border: '1px solid',
        borderColor: 'rgba(31, 41, 55, 0.1)',
        borderRadius: 2,
        display: 'flex',
        flexShrink: 0,
        height: 58,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 58,
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
        <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
      )}
    </Box>
  )
}

function OrderItem({ item }) {
  const detailItems = parseVariantDetails(item.variantLabel || '')
  const { price } = getCartPricing(item)

  return (
    <Stack direction="row" spacing={1.2} sx={{ minWidth: 0 }}>
      <ProductImage item={item} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '0.92rem',
            fontWeight: 650,
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
          }}
        >
          {item.name}
        </Typography>

        {detailItems.length ? (
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.78rem',
              lineHeight: 1.4,
              mt: 0.35,
              overflowWrap: 'anywhere',
            }}
          >
            {detailItems
              .map((detail) => (detail.label ? `${detail.label}: ${detail.value}` : detail.value))
              .join(' / ')}
          </Typography>
        ) : null}

        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={1}
          sx={{ mt: 0.75 }}
        >
          <Typography color="text.secondary" sx={{ fontSize: '0.82rem' }}>
            Qty {item.quantity} x {formatPrice(price)}
          </Typography>
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: '0.9rem',
              fontWeight: 750,
              whiteSpace: 'nowrap',
            }}
          >
            {formatPrice(getCartLineTotal(item))}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  )
}

function CheckoutOrderSummary({ items = [], subtotal }) {
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
        p: { xs: 2.25, md: 2.75 },
      }}
      variant="outlined"
    >
      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '1.12rem',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Order Summary
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.84rem', mt: 0.35 }}>
              {items.length} item{items.length === 1 ? '' : 's'} in your order
            </Typography>
          </Box>

          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              color: 'text.primary',
              display: 'flex',
              flexShrink: 0,
              height: 32,
              justifyContent: 'center',
              width: 32,
            }}
          >
            <KeyboardArrowDownRoundedIcon sx={{ transform: 'rotate(180deg)' }} />
          </Box>
        </Stack>

        <Stack
          divider={<Divider flexItem />}
          spacing={1.35}
          sx={{
            bgcolor: 'rgba(248, 245, 240, 0.62)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.35,
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
                minHeight: 34,
                mt: '0 !important',
                px: 0.75,
                textTransform: 'none',
              }}
              type="button"
              variant="text"
            >
              {itemsExpanded ? 'Show Less' : `Load More (${remainingCount})`}
            </Button>
          ) : null}

          {hasMoreItems ? (
            <Collapse in={itemsExpanded} timeout={260} unmountOnExit>
              <Stack divider={<Divider flexItem />} spacing={1.35}>
                {collapsedItems.map((item) => (
                  <OrderItem item={item} key={`${item.id}:${item.variantId || ''}`} />
                ))}
              </Stack>
            </Collapse>
          ) : null}
        </Stack>

        <Stack
          spacing={1.45}
          sx={{
            bgcolor: 'rgba(248, 245, 240, 0.62)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.65,
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

        <Stack
          sx={{
            bgcolor: '#f8f5f0',
            border: '1px solid',
            borderColor: 'rgba(31, 41, 55, 0.1)',
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <SummaryRow
            label="Total Payable"
            labelSx={{
              color: 'text.primary',
              fontSize: '1rem',
              fontWeight: 700,
            }}
            value={formatPrice(totalPayable)}
            valueSx={{
              color: 'text.primary',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  )
}

export default CheckoutOrderSummary
