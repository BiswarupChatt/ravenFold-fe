import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'
import {
  formatPrice,
  getCartLineTotal,
  getProductDetailsPath,
  parseVariantDetails,
} from '../../../utils/utils.js'
import { getSummaryTotals } from '../../cart/components/cartSummaryUtils.js'

const previewItemCount = 2

const productLinkSx = {
  appearance: 'none',
  bgcolor: 'transparent',
  border: 0,
  color: 'inherit',
  cursor: 'pointer',
  font: 'inherit',
  p: 0,
  textAlign: 'left',
  '&:hover': {
    color: 'primary.main',
    textDecoration: 'underline',
  },
  '&:focus-visible': {
    borderRadius: 1,
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 2,
  },
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

function ProductImage({ item, onViewProduct }) {
  return (
    <Box
      aria-label={`View ${item.name || 'product'} details`}
      component="button"
      onClick={() => onViewProduct(item)}
      type="button"
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
        p: 0,
        width: 38,
        '&:hover': {
          borderColor: 'primary.main',
          cursor: 'pointer',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
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

function OrderItem({ item, onViewProduct }) {
  const detailItems = parseVariantDetails(item.variantLabel || '')
  const variantText = detailItems
    .map((detail) => (detail.label ? `${detail.label}: ${detail.value}` : detail.value))
    .join(' / ')
  const quantity = Number(item.quantity || 1)

  return (
    <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
      <ProductImage item={item} onViewProduct={onViewProduct} />

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
            component="button"
            onClick={() => onViewProduct(item)}
            type="button"
            sx={{
              ...productLinkSx,
              color: 'text.primary',
              display: '-webkit-box',
              fontSize: '0.96rem',
              fontWeight: 700,
              lineHeight: 1.3,
              overflowWrap: 'anywhere',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {item.name}
            {quantity > 1 ? (
              <Typography
                component="span"
                sx={{
                  color: 'text.secondary',
                  display: 'inline',
                  fontSize: '0.88rem',
                  fontWeight: 550,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                {' '}x {quantity}
              </Typography>
            ) : null}
          </Typography>

          <Typography
            sx={{
              color: 'text.primary',
              fontSize: '0.96rem',
              fontWeight: 750,
              lineHeight: 1.3,
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
              fontSize: '0.9rem',
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
  const navigate = useNavigate()
  const [itemsExpanded, setItemsExpanded] = useState(false)
  const [itemsCollapsing, setItemsCollapsing] = useState(false)
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
    setItemsExpanded((currentValue) => {
      setItemsCollapsing(currentValue)
      return !currentValue
    })
  }

  const handleViewProduct = (item) => {
    navigate(getProductDetailsPath(item))
  }

  const renderItemsToggleButton = (expanded) => (
    <Button
      aria-expanded={expanded}
      endIcon={(
        <KeyboardArrowDownRoundedIcon
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 220ms ease',
          }}
        />
      )}
      onClick={handleToggleItems}
      sx={{
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        fontSize: '0.94rem',
        fontWeight: 800,
        minHeight: 32,
        mt: '0 !important',
        px: 0.75,
        textTransform: 'none',
      }}
      type="button"
      variant="text"
    >
      {expanded ? 'Show Less' : `(${remainingCount}) More Item${remainingCount === 1 ? '' : 's'} `}
    </Button>
  )

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
                fontSize: '1.12rem',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Order Summary
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.94rem', mt: 0.25 }}>
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
            <OrderItem
              item={item}
              key={`${item.id}:${item.variantId || ''}`}
              onViewProduct={handleViewProduct}
            />
          ))}

          {hasMoreItems && !itemsExpanded && !itemsCollapsing ? renderItemsToggleButton(false) : null}

          {hasMoreItems ? (
            <Collapse
              in={itemsExpanded}
              onExited={() => setItemsCollapsing(false)}
              timeout={260}
              unmountOnExit
            >
              <Stack divider={<Divider flexItem />} spacing={0.75}>
                {collapsedItems.map((item) => (
                  <OrderItem
                    item={item}
                    key={`${item.id}:${item.variantId || ''}`}
                    onViewProduct={handleViewProduct}
                  />
                ))}

                {renderItemsToggleButton(true)}
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
                fontSize: '0.9rem',
                fontWeight: 550,
                lineHeight: 1.35,
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
