import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import AppModal from '../../../../../components/AppModal.jsx'
import AppButton from '../../../../../components/AppButton.jsx'
import { formatPrice } from '../../../../../utils/utils.js'
import {
  canRetryPayment,
  formatAddressLines,
  formatOrderDate,
  getCustomerOrderStatusMeta,
  getItemMeta,
  getItemName,
  getOrderItemsLabel,
  getOrderProgressCopy,
  getPaymentMethodLabel,
  getProductPath,
  getQuantityLabel,
} from './orderFormatters.js'

function DetailStat({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        color="text.secondary"
        sx={{
          fontSize: '0.72rem',
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
          fontSize: '0.95rem',
          fontWeight: 650,
          lineHeight: 1.35,
          mt: 0.35,
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function StatusBadge({ Icon, meta }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: meta.sx?.bgcolor || 'rgba(248, 245, 240, 0.72)',
        borderRadius: 1,
        color: meta.sx?.color || 'text.secondary',
        display: 'inline-flex',
        gap: 0.7,
        minHeight: 28,
        px: 1,
      }}
    >
      <Icon sx={{ fontSize: 16 }} />
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 750, lineHeight: 1 }}>
        {meta.label}
      </Typography>
    </Box>
  )
}

function AddressBlock({ address, title }) {
  const lines = formatAddressLines(address)

  return (
    <Box
      sx={{
        bgcolor: 'rgba(248, 245, 240, 0.48)',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.25,
        p: 1.5,
      }}
    >
      <Typography
        color="text.primary"
        sx={{ fontSize: '0.88rem', fontWeight: 750, mb: 0.8 }}
      >
        {title}
      </Typography>
      {lines.length ? (
        <Stack spacing={0.3}>
          {lines.map((line, index) => (
            <Typography
              color="text.secondary"
              key={`${line}-${index}`}
              sx={{ fontSize: '0.88rem', lineHeight: 1.45 }}
            >
              {line}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary" sx={{ fontSize: '0.88rem' }}>
          No address saved.
        </Typography>
      )}
    </Box>
  )
}

function TotalRow({ label, value, strong = false }) {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
      <Typography
        color={strong ? 'text.primary' : 'text.secondary'}
        sx={{
          fontSize: strong ? '0.94rem' : '0.88rem',
          fontWeight: strong ? 750 : 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: strong ? '0.98rem' : '0.88rem',
          fontWeight: strong ? 800 : 650,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function OrderItemRow({ isMobile, item, onViewProduct }) {
  const productPath = getProductPath(item)

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 1.25,
        '&:last-of-type': {
          borderBottom: 0,
          pb: 0,
        },
      }}
    >
      <Stack
        alignItems={isMobile ? 'flex-start' : 'center'}
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        spacing={1.4}
      >
        <Stack direction="row" spacing={1.2} sx={{ minWidth: 0 }}>
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
              height: 56,
              justifyContent: 'center',
              overflow: 'hidden',
              p: 0,
              width: 56,
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

          <Stack justifyContent="center" spacing={0.35} sx={{ minWidth: 0 }}>
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
                fontSize: '0.92rem',
                fontWeight: 700,
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
              <Typography color="text.secondary" sx={{ fontSize: '0.84rem', lineHeight: 1.35 }}>
                {getItemMeta(item)}
              </Typography>
            ) : null}
            <Typography color="text.secondary" sx={{ fontSize: '0.84rem' }}>
              {Number(item.quantity || 0).toLocaleString('en-IN')} x {formatPrice(item.priceAtTime)}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '0.92rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {formatPrice(item.lineTotal)}
        </Typography>
      </Stack>
    </Box>
  )
}

function OrderDetailsModal({
  isMobile,
  loading,
  onClose,
  onRetryPayment,
  onViewProduct,
  open,
  order,
  retrying = false,
}) {
  const orderItems = Array.isArray(order?.items) ? order.items : []
  const customerStatus = getCustomerOrderStatusMeta(order || {})
  const progress = getOrderProgressCopy(order || {})
  const retryAllowed = canRetryPayment(order || {})
  const StatusIcon = customerStatus.kind === 'payment' ? PaymentsOutlinedIcon : LocalShippingOutlinedIcon

  return (
    <AppModal
      description={order?.orderNumber || ''}
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Order details"
    >
      {loading ? (
        <Stack alignItems="center" direction="row" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading order details...</Typography>
        </Stack>
      ) : null}

      {!loading && order ? (
        <Stack spacing={2.25}>
          <Box
            sx={{
              bgcolor: 'rgba(248, 245, 240, 0.62)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.25,
              p: 1.4,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gap: 1.4,
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))',
              }}
            >
              <DetailStat label="Created" value={formatOrderDate(order.placedAt || order.createdAt)} />
              <DetailStat label="Items" value={`${getOrderItemsLabel(order)} / ${getQuantityLabel(order)}`} />
              <DetailStat label="Payment" value={getPaymentMethodLabel(order)} />
              <DetailStat label="Total" value={formatPrice(order.totalPayable)} />
            </Box>
          </Box>

          <Box
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1.4,
            }}
          >
            <Box
              sx={{
                alignItems: isMobile ? 'flex-start' : 'center',
                display: 'grid',
                gap: 1.2,
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) auto',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: customerStatus.sx?.color || 'text.primary',
                    fontSize: '1rem',
                    fontWeight: 750,
                    lineHeight: 1.2,
                  }}
                >
                  {progress.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', mt: 0.35 }}>
                  {progress.body}
                </Typography>
              </Box>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={0.8}
                justifyContent={isMobile ? 'flex-start' : 'flex-end'}
                sx={{ justifySelf: isMobile ? 'start' : 'end' }}
              >
                {retryAllowed ? (
                  <AppButton
                    loading={retrying}
                    loadingText="Retrying..."
                    onClick={() => onRetryPayment(order)}
                    size="small"
                    sx={{ minWidth: isMobile ? '100%' : 160 }}
                    type="button"
                    variant="outlined"
                  >
                    Retry Payment
                  </AppButton>
                ) : null}
                <StatusBadge Icon={StatusIcon} meta={customerStatus} />
              </Stack>
            </Box>
          </Box>

          {order?.paymentFailureReason ? (
            <Alert severity={order?.paymentStatus === 'failed' ? 'error' : 'warning'}>
              {order.paymentFailureReason}
            </Alert>
          ) : null}

          <Box
            sx={{
              alignItems: 'start',
              display: 'grid',
              gap: 2,
              gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(250px, 300px)',
            }}
          >
            <Stack spacing={1.25} sx={{ minWidth: 0 }}>
              <Stack alignItems="center" direction="row" spacing={0.8}>
                <Inventory2OutlinedIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.96rem', fontWeight: 750 }}>
                  Items
                </Typography>
              </Stack>

              <Stack spacing={1.25}>
                {orderItems.map((item) => (
                  <OrderItemRow
                    isMobile={isMobile}
                    item={item}
                    key={item.id}
                    onViewProduct={onViewProduct}
                  />
                ))}
              </Stack>
            </Stack>

            <Box
              sx={{
                bgcolor: 'rgba(248, 245, 240, 0.48)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.25,
                p: 1.5,
                position: isMobile ? 'static' : 'sticky',
                top: 0,
                width: '100%',
                zIndex: 1,
              }}
            >
              <Typography sx={{ fontSize: '0.96rem', fontWeight: 750, mb: 1.1 }}>
                Payment summary
              </Typography>
              <Stack spacing={0.8}>
                <TotalRow label="MRP" value={formatPrice(order.totalMrp)} />
                <TotalRow label="Subtotal" value={formatPrice(order.subtotal)} />
                <TotalRow label="Bag discount" value={`-${formatPrice(order.bagDiscount)}`} />
                <TotalRow label="Promotion discount" value={`-${formatPrice(order.productDiscountAmount || order.couponDiscount)}`} />
                {(order.shippingDiscountAmount || 0) > 0 ? (
                  <TotalRow label="Shipping discount" value={`-${formatPrice(order.shippingDiscountAmount)}`} />
                ) : null}
                <TotalRow label="Shipping" value={formatPrice(order.shippingCharge)} />
                {Array.isArray(order.appliedPromotions) && order.appliedPromotions.length ? (
                  <>
                    <Divider sx={{ my: 0.3 }} />
                    <Stack spacing={0.45}>
                      {order.appliedPromotions.map((promotion) => (
                        <Typography
                          color="text.secondary"
                          key={`${promotion.promotionId}:${promotion.couponCode || promotion.title}`}
                          sx={{ fontSize: '0.82rem', lineHeight: 1.35 }}
                        >
                          {promotion.title || promotion.couponCode}
                          {promotion.couponCode ? ` (${promotion.couponCode})` : ''}
                        </Typography>
                      ))}
                    </Stack>
                  </>
                ) : null}
                <Divider sx={{ my: 0.3 }} />
                <TotalRow label="Total payable" value={formatPrice(order.totalPayable)} strong />
              </Stack>
            </Box>
          </Box>

          <Stack direction={isMobile ? 'column' : 'row'} spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <AddressBlock address={order.shippingAddress} title="Shipping address" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <AddressBlock address={order.billingAddress} title="Billing address" />
            </Box>
          </Stack>

        </Stack>
      ) : null}
    </AppModal>
  )
}

export default OrderDetailsModal
