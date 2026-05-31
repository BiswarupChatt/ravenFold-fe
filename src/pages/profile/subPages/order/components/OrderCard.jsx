import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import { formatPrice } from '../../../../../utils/utils.js'
import {
  formatOrderDate,
  getItemMeta,
  getItemName,
  getOrderAmountLabel,
  getOrderItemsLabel,
  getOrderProgressCopy,
  getOrderStatusMeta,
  getPaymentMethodLabel,
  getPaymentStatusMeta,
  getPreviewOrderItem,
  getProductPath,
} from './orderFormatters.js'

function SummaryMetric({ label, value, valueSx }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        color="text.secondary"
        sx={{
          fontSize: '0.74rem',
          fontWeight: 800,
          lineHeight: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: '0.96rem',
          fontWeight: 650,
          lineHeight: 1.35,
          mt: 0.35,
          overflowWrap: 'anywhere',
          ...valueSx,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function ProductPreview({ isMobile, item, onViewProduct }) {
  if (!item) {
    return (
      <Stack direction="row" spacing={1.5}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: '#f4efe8',
            border: '1px solid',
            borderColor: 'rgba(31, 41, 55, 0.1)',
            borderRadius: 2,
            display: 'flex',
            flexShrink: 0,
            height: 74,
            justifyContent: 'center',
            width: 74,
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 30 }} />
        </Box>
        <Stack justifyContent="center" spacing={0.5}>
          <Typography fontWeight={800}>Order items</Typography>
          <Typography color="text.secondary">Open details to review the items in this order.</Typography>
        </Stack>
      </Stack>
    )
  }

  const productPath = getProductPath(item)

  return (
    <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
      <Box
        aria-label={`View ${getItemName(item)} details`}
        component={productPath ? 'button' : 'div'}
        onClick={productPath ? () => onViewProduct(item) : undefined}
        type={productPath ? 'button' : undefined}
        sx={{
          alignItems: 'center',
          bgcolor: '#f4efe8',
          border: '1px solid',
          borderColor: 'rgba(31, 41, 55, 0.1)',
          borderRadius: 2,
          cursor: productPath ? 'pointer' : 'default',
          display: 'flex',
          flexShrink: 0,
          height: isMobile ? 72 : 86,
          justifyContent: 'center',
          overflow: 'hidden',
          p: 0,
          width: isMobile ? 72 : 86,
          '&:hover': productPath
            ? {
              borderColor: 'primary.main',
            }
            : undefined,
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      >
        {item.productSnapshot?.image ? (
          <Box
            alt={getItemName(item)}
            component="img"
            src={item.productSnapshot.image}
            sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
          />
        ) : (
          <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 30 }} />
        )}
      </Box>

      <Stack justifyContent="center" spacing={0.45} sx={{ minWidth: 0 }}>
        <Typography
          component={productPath ? 'button' : 'div'}
          onClick={productPath ? () => onViewProduct(item) : undefined}
          type={productPath ? 'button' : undefined}
          sx={{
            appearance: 'none',
            bgcolor: 'transparent',
            border: 0,
            color: productPath ? 'primary.main' : 'text.primary',
            cursor: productPath ? 'pointer' : 'default',
            font: 'inherit',
            fontWeight: 800,
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
            p: 0,
            textAlign: 'left',
            '&:hover': productPath
              ? {
                color: 'primary.dark',
                textDecoration: 'underline',
              }
              : undefined,
            '&:focus-visible': {
              borderRadius: 1,
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: 2,
            },
          }}
        >
          {getItemName(item)}
        </Typography>
        {getItemMeta(item) ? (
          <Typography color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.35 }}>
            {getItemMeta(item)}
          </Typography>
        ) : null}
        <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 650 }}>
          {Number(item.quantity || 0).toLocaleString('en-IN')} x {formatPrice(item.priceAtTime)}
        </Typography>
      </Stack>
    </Stack>
  )
}

function ActionButton({ children, onClick, variant = 'outlined' }) {
  return (
    <Button
      fullWidth
      onClick={onClick}
      sx={{
        borderColor: variant === 'outlined' ? 'rgba(31, 41, 55, 0.34)' : undefined,
        borderRadius: 999,
        color: variant === 'outlined' ? 'text.primary' : undefined,
        fontWeight: 800,
        minHeight: 42,
        px: 2,
        '&:hover': variant === 'outlined'
          ? {
            bgcolor: 'rgba(248, 245, 240, 0.7)',
            borderColor: 'primary.main',
          }
          : undefined,
      }}
      variant={variant}
    >
      {children}
    </Button>
  )
}

function OrderCard({ isMobile, order, onViewDetails, onViewProduct }) {
  const orderStatus = getOrderStatusMeta(order.status)
  const paymentStatus = getPaymentStatusMeta(order.paymentStatus)
  const progress = getOrderProgressCopy(order)
  const previewItem = getPreviewOrderItem(order)
  const shipTo = order.shippingAddress?.fullName || 'Shipping address'

  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'rgba(31, 41, 55, 0.14)',
        borderRadius: 2,
        boxShadow: 'none',
        overflow: 'hidden',
        transition: 'background-color 180ms ease, border-color 180ms ease',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.92)',
          borderColor: 'rgba(31, 41, 55, 0.24)',
        },
      }}
      variant="outlined"
    >
      <Box
        sx={{
          bgcolor: 'rgba(248, 245, 240, 0.86)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'grid',
          gap: { xs: 1.25, md: 2 },
          gridTemplateColumns: isMobile
            ? '1fr'
            : 'minmax(110px, 0.85fr) minmax(100px, 0.8fr) minmax(130px, 1fr) minmax(180px, 1.2fr)',
          px: { xs: 1.75, md: 2.25 },
          py: 1.45,
        }}
      >
        <SummaryMetric label="Order placed" value={formatOrderDate(order.placedAt || order.createdAt)} />
        <SummaryMetric label="Total" value={getOrderAmountLabel(order)} />
        <SummaryMetric label="Ship to" value={shipTo} />
        <Stack alignItems={isMobile ? 'flex-start' : 'flex-end'} spacing={0.35} sx={{ minWidth: 0 }}>
          <SummaryMetric
            label="Order"
            value={`#${order.orderNumber || order.id}`}
            valueSx={{ textAlign: isMobile ? 'left' : 'right' }}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(190px, 240px)',
          p: { xs: 1.75, md: 2.25 },
        }}
      >
        <Stack spacing={1.8} sx={{ minWidth: 0 }}>
          <Box>
            <Typography
              sx={{
                color: orderStatus.sx.color || 'text.primary',
                fontSize: { xs: '1.08rem', md: '1.22rem' },
                fontWeight: 900,
                lineHeight: 1.18,
              }}
            >
              {progress.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.4 }}>
              {progress.body}
            </Typography>
          </Box>

          <ProductPreview
            isMobile={isMobile}
            item={previewItem}
            onViewProduct={onViewProduct}
          />

          <Stack
            divider={<Divider flexItem orientation={isMobile ? 'horizontal' : 'vertical'} />}
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 0.75 : 1.5}
            sx={{ color: 'text.secondary' }}
          >
            <Typography sx={{ fontSize: '0.92rem' }}>{getOrderItemsLabel(order)}</Typography>
            <Typography sx={{ fontSize: '0.92rem' }}>{getPaymentMethodLabel(order)}</Typography>
            <Typography sx={{ color: paymentStatus.sx.color, fontSize: '0.92rem', fontWeight: 750 }}>
              {paymentStatus.label}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1} sx={{ alignSelf: 'center', width: '100%' }}>
          <ActionButton
            onClick={() => onViewDetails(order)}
            variant="contained"
          >
            View Details
          </ActionButton>
        </Stack>
      </Box>
    </Paper>
  )
}

export default OrderCard
