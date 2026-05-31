import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import AppModal from '../../../../../components/AppModal.jsx'
import { formatPrice } from '../../../../../utils/utils.js'
import {
  formatAddressLines,
  formatOrderDate,
  getItemMeta,
  getItemName,
  getOrderItemsLabel,
  getOrderStatusMeta,
  getPaymentStatusMeta,
  getProductPath,
  getQuantityLabel,
} from './orderFormatters.js'

function AddressBlock({ address, title }) {
  const lines = formatAddressLines(address)

  return (
    <Box sx={{ border: 1, borderColor: 'divider', p: 2 }}>
      <Typography fontWeight={800} sx={{ mb: 1 }}>
        {title}
      </Typography>
      {lines.length ? (
        <Stack spacing={0.35}>
          {lines.map((line, index) => (
            <Typography color="text.secondary" key={`${line}-${index}`}>
              {line}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">No address saved.</Typography>
      )}
    </Box>
  )
}

function TotalRow({ label, value, strong = false }) {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
      <Typography color={strong ? 'text.primary' : 'text.secondary'} fontWeight={strong ? 800 : 500}>
        {label}
      </Typography>
      <Typography fontWeight={strong ? 900 : 800}>{value}</Typography>
    </Stack>
  )
}

function OrderDetailsModal({
  isMobile,
  loading,
  onClose,
  onViewProduct,
  open,
  order,
}) {
  const orderItems = Array.isArray(order?.items) ? order.items : []
  const orderStatus = getOrderStatusMeta(order?.status)
  const paymentStatus = getPaymentStatusMeta(order?.paymentStatus)

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
        <Stack spacing={3}>
          <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
            <Chip
              icon={<LocalShippingOutlinedIcon />}
              label={orderStatus.label}
              size="small"
              sx={{ fontWeight: 900, ...orderStatus.sx }}
              variant="outlined"
            />
            <Chip
              icon={<PaymentsOutlinedIcon />}
              label={paymentStatus.label}
              size="small"
              sx={{ fontWeight: 900, ...paymentStatus.sx }}
              variant="outlined"
            />
          </Stack>

          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography color="text.secondary">Placed on</Typography>
              <Typography fontWeight={900}>
                {formatOrderDate(order.placedAt || order.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography color="text.secondary">Items</Typography>
              <Typography fontWeight={900}>
                {getOrderItemsLabel(order)} / {getQuantityLabel(order)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography color="text.secondary">Total</Typography>
              <Typography fontWeight={900}>{formatPrice(order.totalPayable)}</Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Inventory2OutlinedIcon color="secondary" />
              <Typography fontWeight={900}>Items</Typography>
            </Stack>

            <Stack spacing={1.25}>
              {orderItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    p: 1.5,
                  }}
                >
                  <Stack
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    direction={isMobile ? 'column' : 'row'}
                    justifyContent="space-between"
                    spacing={1.5}
                  >
                    <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                      <Box
                        alt={getItemName(item)}
                        component={item.productSnapshot?.image ? 'img' : 'div'}
                        src={item.productSnapshot?.image || undefined}
                        sx={{
                          bgcolor: 'action.hover',
                          flexShrink: 0,
                          height: 56,
                          objectFit: 'cover',
                          width: 56,
                        }}
                      />
                      <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                        <Typography fontWeight={900}>{getItemName(item)}</Typography>
                        <Typography color="text.secondary">{getItemMeta(item) || '-'}</Typography>
                        <Typography color="text.secondary">
                          {Number(item.quantity || 0).toLocaleString('en-IN')} x {formatPrice(item.priceAtTime)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack alignItems={isMobile ? 'flex-start' : 'flex-end'} spacing={0.75}>
                      <Typography fontWeight={900}>{formatPrice(item.lineTotal)}</Typography>
                      {getProductPath(item) ? (
                        <Button onClick={() => onViewProduct(item)} size="small">
                          View Product
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>

          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <AddressBlock address={order.shippingAddress} title="Shipping address" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <AddressBlock address={order.billingAddress} title="Billing address" />
            </Box>
          </Stack>

          <Box sx={{ alignSelf: isMobile ? 'stretch' : 'flex-end', width: isMobile ? '100%' : 340 }}>
            <Stack spacing={1}>
              <TotalRow label="MRP" value={formatPrice(order.totalMrp)} />
              <TotalRow label="Subtotal" value={formatPrice(order.subtotal)} />
              <TotalRow label="Bag discount" value={`-${formatPrice(order.bagDiscount)}`} />
              <TotalRow label="Coupon discount" value={`-${formatPrice(order.couponDiscount)}`} />
              <TotalRow label="Shipping" value={formatPrice(order.shippingCharge)} />
              <Divider />
              <TotalRow label="Total payable" value={formatPrice(order.totalPayable)} strong />
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </AppModal>
  )
}

export default OrderDetailsModal
