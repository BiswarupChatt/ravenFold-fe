import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import AppButton from '../../../../../components/AppButton.jsx'
import {
  formatOrderDate,
  getItemMeta,
  getItemName,
  getOrderAmountLabel,
  getOrderProgressCopy,
  getOrderStatusMeta,
  getPreviewItemCountLabel,
  getPreviewOrderItem,
  getProductPath,
} from './orderFormatters.js'

function SummaryMetric({ align = 'left', label, value }) {
  return (
    <Box sx={{ minWidth: 0, textAlign: align }}>
      <Typography
        color="text.primary"
        sx={{
          fontSize: '0.68rem',
          fontWeight: 700,
          lineHeight: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: { xs: '0.86rem', md: '0.92rem' },
          fontWeight: 600,
          lineHeight: 1.3,
          mt: 0.35,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function ProductPreview({ isMobile, item, onViewDetails, onViewProduct, order }) {
  const imageSize = isMobile ? 58 : 66

  if (!item) {
    return (
      <Stack direction="row" spacing={1.5}>
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: '#f4efe8',
            border: '1px solid',
            borderColor: 'rgba(31, 41, 55, 0.1)',
            borderRadius: 1,
            display: 'flex',
            flexShrink: 0,
            height: imageSize,
            justifyContent: 'center',
            width: imageSize,
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
        </Box>
        <Stack justifyContent="center" spacing={0.55}>
          <Typography fontWeight={650}>Order items</Typography>
          <Typography color="text.secondary" sx={{ fontSize: '0.88rem' }}>
            Open details to review this order.
          </Typography>
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
          borderRadius: 1,
          cursor: productPath ? 'pointer' : 'default',
          display: 'flex',
          flexShrink: 0,
          height: imageSize,
          justifyContent: 'center',
          overflow: 'hidden',
          p: 0,
          width: imageSize,
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
          <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
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
            fontSize: { xs: '0.88rem', md: '0.92rem' },
            fontWeight: 650,
            lineHeight: 1.28,
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
          <Typography color="text.primary" sx={{ fontSize: '0.84rem', lineHeight: 1.35 }}>
            {getItemMeta(item)}
          </Typography>
        ) : null}
        <Button
          onClick={() => onViewDetails(order)}
          sx={{
            alignSelf: 'flex-start',
            color: 'text.secondary',
            fontSize: '0.84rem',
            fontWeight: 600,
            minHeight: 'auto',
            minWidth: 0,
            p: 0,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
              textDecoration: 'underline',
            },
          }}
          variant="text"
        >
          {getPreviewItemCountLabel(order)}
        </Button>
      </Stack>
    </Stack>
  )
}

function OrderCard({ isMobile, order, onViewDetails, onViewProduct }) {
  const orderStatus = getOrderStatusMeta(order.status)
  const progress = getOrderProgressCopy(order)
  const previewItem = getPreviewOrderItem(order)
  const shipTo = order.shippingAddress?.fullName || 'Shipping address'

  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'rgba(31, 41, 55, 0.16)',
        borderRadius: 1.5,
        boxShadow: 'none',
        overflow: 'hidden',
      }}
      variant="outlined"
    >
      <Box
        sx={{
          bgcolor: 'rgba(248, 245, 240, 0.7)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'grid',
          gap: { xs: 1.25, md: 1.75 },
          gridTemplateColumns: isMobile
            ? '1fr 1fr'
            : 'minmax(120px, 0.8fr) minmax(110px, 0.65fr) minmax(150px, 1fr) minmax(210px, 1.25fr)',
          px: { xs: 1.35, md: 1.75 },
          py: 0.95,
        }}
      >
        <SummaryMetric label="Order placed" value={formatOrderDate(order.placedAt || order.createdAt)} />
        <SummaryMetric label="Total" value={getOrderAmountLabel(order)} />
        <SummaryMetric label="Ship to" value={shipTo} />
        <SummaryMetric
          align={isMobile ? 'left' : 'right'}
          label="Order"
          value={`#${order.orderNumber || order.id}`}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(150px, 190px)',
          p: { xs: 1.35, md: 1.75 },
        }}
      >
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Box>
            <Typography
              sx={{
                color: orderStatus.sx.color || 'text.primary',
                fontSize: { xs: '0.94rem', md: '1rem' },
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {progress.title}
            </Typography>
            <Typography color="text.primary" sx={{ fontSize: '0.86rem', mt: 0.25 }}>
              {progress.body}
            </Typography>
          </Box>

          <ProductPreview
            isMobile={isMobile}
            item={previewItem}
            onViewDetails={onViewDetails}
            onViewProduct={onViewProduct}
            order={order}
          />
        </Stack>

        <Stack alignItems={isMobile ? 'stretch' : 'flex-end'} justifyContent="center">
          <AppButton
            onClick={() => onViewDetails(order)}
            size="small"
            sx={{
              alignSelf: isMobile ? 'stretch' : 'flex-end',
              fontSize: '0.84rem',
              fontWeight: 700,
              minHeight: 34,
              px: 2,
              width: isMobile ? '100%' : 150,
            }}
            type="button"
            variant="contained"
          >
            View Details
          </AppButton>
        </Stack>
      </Box>
    </Paper>
  )
}

export default OrderCard
