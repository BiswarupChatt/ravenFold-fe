import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppModal from '../../../../components/AppModal.jsx'
import useResponsiveView from '../../../../hooks/useResponsiveView'
import { fetchCustomerOrder, fetchCustomerOrders } from '../../../../services/orderApi.js'
import { formatPrice } from '../../../../utils/utils.js'
import ProfileIntro from '../../components/ProfileIntro'

const ORDER_PAGE_LIMIT = 10

const getOrderStatusMeta = (status = 'pending') => {
  const statusMap = {
    cancelled: { color: 'error', label: 'Cancelled' },
    confirmed: { color: 'info', label: 'Confirmed' },
    delivered: { color: 'success', label: 'Delivered' },
    packed: { color: 'primary', label: 'Packed' },
    pending: { color: 'warning', label: 'Order placed' },
    returned: { color: 'default', label: 'Returned' },
    shipped: { color: 'secondary', label: 'In transit' },
  }

  return statusMap[status] || { color: 'default', label: status || 'Pending' }
}

const getPaymentStatusMeta = (status = 'pending') => {
  const statusMap = {
    failed: { color: 'error', label: 'Payment failed' },
    paid: { color: 'success', label: 'Paid' },
    pending: { color: 'warning', label: 'Payment pending' },
    refunded: { color: 'info', label: 'Refunded' },
  }

  return statusMap[status] || { color: 'default', label: status || 'Payment pending' }
}

const formatOrderDate = (value) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const getItemCountLabel = (order = {}) => {
  const count = Number(order.itemCount || 0)

  return `${count.toLocaleString('en-IN')} ${count === 1 ? 'item' : 'items'}`
}

const getQuantityLabel = (order = {}) => {
  const count = Number(order.totalQuantity || 0)

  return `${count.toLocaleString('en-IN')} ${count === 1 ? 'qty' : 'qty'}`
}

const getItemName = (item = {}) => item.productSnapshot?.name || 'Product'

const getItemMeta = (item = {}) => {
  const snapshot = item.productSnapshot || {}
  const variantLabel = snapshot.variantLabel || snapshot.variantSku
  const sku = snapshot.variantSku || snapshot.sku

  return [variantLabel, sku].filter(Boolean).join(' / ')
}

const getProductPath = (item = {}) => {
  const snapshot = item.productSnapshot || {}
  const productIdentifier = snapshot.slug || item.productId

  return productIdentifier ? `/shop/${encodeURIComponent(productIdentifier)}` : ''
}

const formatAddressLines = (address = {}) => [
  address.fullName,
  address.phone,
  [address.addressLine1, address.addressLine2].filter(Boolean).join(', '),
  [address.city, address.state, address.pincode].filter(Boolean).join(', '),
  address.country,
].filter(Boolean)

function AddressBlock({ title, address }) {
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

function Order() {
  const { isMobile } = useResponsiveView()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const loadOrders = useCallback(async ({ append = false, page = 1 } = {}) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError('')
    }

    try {
      const orderList = await fetchCustomerOrders({
        limit: ORDER_PAGE_LIMIT,
        page,
      })

      setOrders((currentOrders) => (
        append ? [...currentOrders, ...orderList.items] : orderList.items
      ))
      setPagination(orderList.pagination)
    } catch (err) {
      setError(err.message || 'Failed to load orders.')
      if (!append) {
        setOrders([])
        setPagination(null)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const openOrderDetails = async (order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
    setLoadingDetails(true)

    try {
      setSelectedOrder(await fetchCustomerOrder(order.id))
    } catch (err) {
      setError(err.message || 'Failed to load order details.')
      setDetailsOpen(false)
      setSelectedOrder(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeOrderDetails = () => {
    setDetailsOpen(false)
    setSelectedOrder(null)
  }

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loadingMore) {
      return
    }

    loadOrders({
      append: true,
      page: Number(pagination.page || 1) + 1,
    })
  }

  const handleViewProduct = (item) => {
    const path = getProductPath(item)

    if (path) {
      closeOrderDetails()
      navigate(path)
    }
  }

  const orderItems = Array.isArray(selectedOrder?.items) ? selectedOrder.items : []
  const selectedOrderStatus = getOrderStatusMeta(selectedOrder?.status)
  const selectedPaymentStatus = getPaymentStatusMeta(selectedOrder?.paymentStatus)

  return (
    <Stack spacing={3}>
      <ProfileIntro
        description="Recent purchases and delivery progress."
        title="Orders"
      />

      <Divider />

      {error ? (
        <Alert
          action={(
            <Button color="inherit" onClick={() => loadOrders()} size="small">
              Retry
            </Button>
          )}
          severity="error"
          sx={{ borderRadius: 1.5 }}
        >
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Stack alignItems="center" direction="row" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading orders...</Typography>
        </Stack>
      ) : null}

      {!loading && !error && orders.length === 0 ? (
        <Box sx={{ border: 1, borderColor: 'divider', p: 3 }}>
          <Typography fontWeight={800}>No orders yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Your checkout orders will appear here after they are created.
          </Typography>
          <Button onClick={() => navigate('/shop')} sx={{ mt: 2 }} variant="outlined">
            Continue Shopping
          </Button>
        </Box>
      ) : null}

      {!loading && orders.length > 0 ? (
        <Stack spacing={2}>
          {orders.map((order) => {
            const orderStatus = getOrderStatusMeta(order.status)
            const paymentStatus = getPaymentStatusMeta(order.paymentStatus)

            return (
              <Box
                key={order.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  p: 2,
                }}
              >
                <Stack
                  alignItems={isMobile ? 'flex-start' : 'center'}
                  direction={isMobile ? 'column' : 'row'}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
                    <ReceiptLongOutlinedIcon sx={{ color: 'secondary.main', mt: 0.25 }} />
                    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        spacing={1}
                      >
                        <Typography fontWeight={800}>{order.orderNumber || order.id}</Typography>
                        <Chip
                          icon={<LocalShippingOutlinedIcon />}
                          label={orderStatus.label}
                          size="small"
                          color={orderStatus.color}
                          variant="outlined"
                        />
                        <Chip
                          icon={<PaymentsOutlinedIcon />}
                          label={paymentStatus.label}
                          size="small"
                          color={paymentStatus.color}
                          variant="outlined"
                        />
                      </Stack>
                      <Typography color="text.secondary">
                        {formatOrderDate(order.placedAt || order.createdAt)} | {getItemCountLabel(order)} | {getQuantityLabel(order)} | {formatPrice(order.totalPayable)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button onClick={() => openOrderDetails(order)} size="small" variant="outlined">
                    View Details
                  </Button>
                </Stack>
              </Box>
            )
          })}

          {pagination?.hasNextPage ? (
            <Button
              disabled={loadingMore}
              onClick={handleLoadMore}
              startIcon={loadingMore ? <CircularProgress color="inherit" size={16} /> : null}
              sx={{ alignSelf: 'center' }}
              variant="outlined"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          ) : null}
        </Stack>
      ) : null}

      <AppModal
        description={selectedOrder?.orderNumber || ''}
        maxWidth="md"
        onClose={closeOrderDetails}
        open={detailsOpen}
        title="Order details"
      >
        {loadingDetails ? (
          <Stack alignItems="center" direction="row" spacing={1.5} sx={{ py: 4 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">Loading order details...</Typography>
          </Stack>
        ) : null}

        {!loadingDetails && selectedOrder ? (
          <Stack spacing={3}>
            <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
              <Chip
                icon={<LocalShippingOutlinedIcon />}
                label={selectedOrderStatus.label}
                size="small"
                color={selectedOrderStatus.color}
                variant="outlined"
              />
              <Chip
                icon={<PaymentsOutlinedIcon />}
                label={selectedPaymentStatus.label}
                size="small"
                color={selectedPaymentStatus.color}
                variant="outlined"
              />
            </Stack>

            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography color="text.secondary">Placed on</Typography>
                <Typography fontWeight={900}>
                  {formatOrderDate(selectedOrder.placedAt || selectedOrder.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography color="text.secondary">Items</Typography>
                <Typography fontWeight={900}>
                  {getItemCountLabel(selectedOrder)} / {getQuantityLabel(selectedOrder)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography color="text.secondary">Total</Typography>
                <Typography fontWeight={900}>{formatPrice(selectedOrder.totalPayable)}</Typography>
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
                          <Button onClick={() => handleViewProduct(item)} size="small">
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
                <AddressBlock address={selectedOrder.shippingAddress} title="Shipping address" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AddressBlock address={selectedOrder.billingAddress} title="Billing address" />
              </Box>
            </Stack>

            <Box sx={{ alignSelf: isMobile ? 'stretch' : 'flex-end', width: isMobile ? '100%' : 340 }}>
              <Stack spacing={1}>
                <TotalRow label="MRP" value={formatPrice(selectedOrder.totalMrp)} />
                <TotalRow label="Subtotal" value={formatPrice(selectedOrder.subtotal)} />
                <TotalRow label="Bag discount" value={`-${formatPrice(selectedOrder.bagDiscount)}`} />
                <TotalRow label="Coupon discount" value={`-${formatPrice(selectedOrder.couponDiscount)}`} />
                <TotalRow label="Shipping" value={formatPrice(selectedOrder.shippingCharge)} />
                <Divider />
                <TotalRow label="Total payable" value={formatPrice(selectedOrder.totalPayable)} strong />
              </Stack>
            </Box>
          </Stack>
        ) : null}
      </AppModal>
    </Stack>
  )
}

export default Order
