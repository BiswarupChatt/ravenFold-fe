import { formatPrice } from '../../../../../utils/utils.js'

export const ORDER_PAGE_LIMIT = 10

export const getOrderStatusMeta = (status = 'pending') => {
  const statusMap = {
    cancelled: { label: 'Cancelled', sx: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' } },
    confirmed: { label: 'Confirmed', sx: { bgcolor: 'rgba(14, 165, 233, 0.12)', color: '#0369a1' } },
    delivered: { label: 'Delivered', sx: { bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#059669' } },
    packed: { label: 'Packed', sx: { bgcolor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' } },
    pending: { label: 'Pending', sx: { bgcolor: 'rgba(245, 158, 11, 0.14)', color: '#b45309' } },
    returned: { label: 'Returned', sx: { bgcolor: 'rgba(107, 114, 128, 0.12)', color: '#4b5563' } },
    shipped: { label: 'In transit', sx: { bgcolor: 'rgba(124, 58, 237, 0.12)', color: '#6d28d9' } },
  }

  return statusMap[status] || {
    label: status || 'Pending',
    sx: { bgcolor: 'action.hover', color: 'text.secondary' },
  }
}

export const getPaymentStatusMeta = (status = 'pending') => {
  const statusMap = {
    failed: { label: 'Failed', sx: { color: '#dc2626' } },
    paid: { label: 'Paid', sx: { color: '#059669' } },
    partially_refunded: { label: 'Partially refunded', sx: { color: '#0369a1' } },
    pending: { label: 'Pending', sx: { color: '#b45309' } },
    refunded: { label: 'Refunded', sx: { color: '#0369a1' } },
  }

  return statusMap[status] || {
    label: status || 'Pending',
    sx: { color: 'text.secondary' },
  }
}

const humanizeStatus = (value = '') => String(value || '')
  .split('_')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ')

const getActiveShipment = (order = {}) => {
  const shipments = Array.isArray(order?.shipments) ? order.shipments : []

  if (!shipments.length) {
    return null
  }

  return shipments.find((shipment) => !['cancelled', 'lost', 'rto'].includes(shipment?.status)) || shipments[0]
}

const getCustomerShipmentTrackingStatus = (order = {}) => {
  const shipment = getActiveShipment(order)

  if (!shipment) {
    return ''
  }

  const latestEventStatus = Array.isArray(shipment.events) ? shipment.events[0]?.status : ''

  return String(latestEventStatus || shipment.status || '').toLowerCase()
}

export const getCustomerOrderStatusMeta = (order = {}) => {
  const orderStatus = String(order?.status || '').toLowerCase()
  const paymentStatus = String(order?.paymentStatus || '').toLowerCase()
  const shipmentTrackingStatus = getCustomerShipmentTrackingStatus(order)

  if (orderStatus === 'cancelled') {
    return {
      body: 'This order is no longer active.',
      kind: 'order',
      label: 'Cancelled',
      title: 'Order cancelled',
      sx: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' },
    }
  }

  if (orderStatus === 'returned') {
    return {
      body: 'This order has a return status.',
      kind: 'order',
      label: 'Returned',
      title: 'Return recorded',
      sx: { bgcolor: 'rgba(107, 114, 128, 0.12)', color: '#4b5563' },
    }
  }

  if (paymentStatus === 'failed') {
    return {
      body: 'Payment failed. Retry the payment to continue fulfilment.',
      kind: 'payment',
      label: 'Payment failed',
      title: 'Payment failed',
      sx: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' },
    }
  }

  if (paymentStatus === 'pending') {
    return {
      body: 'Complete payment to confirm this order.',
      kind: 'payment',
      label: 'Awaiting payment',
      title: 'Awaiting payment',
      sx: { bgcolor: 'rgba(245, 158, 11, 0.14)', color: '#b45309' },
    }
  }

  if (paymentStatus === 'refunded') {
    return {
      body: 'The payment for this order was refunded.',
      kind: 'payment',
      label: 'Refunded',
      title: 'Refunded',
      sx: { bgcolor: 'rgba(14, 165, 233, 0.12)', color: '#0369a1' },
    }
  }

  if (paymentStatus === 'partially_refunded') {
    return {
      body: 'This order has a partial refund recorded.',
      kind: 'payment',
      label: 'Partially refunded',
      title: 'Partially refunded',
      sx: { bgcolor: 'rgba(14, 165, 233, 0.12)', color: '#0369a1' },
    }
  }

  if (shipmentTrackingStatus === 'delivered') {
    return {
      body: 'Package has been marked as delivered.',
      kind: 'shipment',
      label: 'Delivered',
      title: 'Delivered',
      sx: { bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#059669' },
    }
  }

  if (shipmentTrackingStatus === 'out_for_delivery') {
    return {
      body: 'Your order is out for delivery.',
      kind: 'shipment',
      label: 'Out for delivery',
      title: 'Out for delivery',
      sx: { bgcolor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' },
    }
  }

  if (['picked_up', 'in_transit', 'shipped'].includes(shipmentTrackingStatus || orderStatus)) {
    return {
      body: 'Your order has been shipped and is on the way.',
      kind: 'shipment',
      label: 'Order shipped',
      title: 'Order shipped',
      sx: { bgcolor: 'rgba(124, 58, 237, 0.12)', color: '#6d28d9' },
    }
  }

  const orderStatusMap = {
    confirmed: {
      body: 'We are preparing your items for dispatch.',
      kind: 'order',
      label: 'Confirmed',
      title: 'Order confirmed',
      sx: { bgcolor: 'rgba(14, 165, 233, 0.12)', color: '#0369a1' },
    },
    packed: {
      body: 'Your order is packed and ready for courier handoff.',
      kind: 'order',
      label: 'Packed',
      title: 'Packed',
      sx: { bgcolor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' },
    },
  }

  return orderStatusMap[orderStatus] || {
    body: 'Order progress will be updated here.',
    kind: 'order',
    label: humanizeStatus(orderStatus) || 'Pending',
    title: humanizeStatus(orderStatus) || 'Pending',
    sx: { bgcolor: 'action.hover', color: 'text.secondary' },
  }
}

export const getOrderProgressCopy = (order = {}) => {
  const statusMeta = getCustomerOrderStatusMeta(order)

  return {
    body: statusMeta.body,
    title: statusMeta.title,
  }
}

export const formatOrderDate = (value) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export const getItemCountLabel = (order = {}) => {
  const count = Number(order.itemCount || 0)

  return `${count.toLocaleString('en-IN')} ${count === 1 ? 'item' : 'items'}`
}

export const getQuantityLabel = (order = {}) => {
  const count = Number(order.totalQuantity || 0)

  return `${count.toLocaleString('en-IN')} ${count === 1 ? 'unit' : 'units'}`
}

export const getOrderItemsLabel = (order = {}) => {
  const totalQuantity = Number(order.totalQuantity || 0)
  const itemCount = Number(order.itemCount || 0)

  if (totalQuantity && itemCount && totalQuantity !== itemCount) {
    return `${totalQuantity.toLocaleString('en-IN')} units`
  }

  return getItemCountLabel(order)
}

export const getPreviewItemCountLabel = (order = {}) => {
  const itemCount = Number(order.itemCount || 0)
  const remainingItems = Math.max(itemCount - 1, 0)

  if (remainingItems > 0) {
    return `${remainingItems.toLocaleString('en-IN')} more ${remainingItems === 1 ? 'item' : 'items'}`
  }

  return getItemCountLabel(order)
}

export const shouldShowOrderNotice = (order = {}) => {
  const stableOrderStatuses = ['confirmed', 'packed', 'shipped', 'delivered']

  return !stableOrderStatuses.includes(order.status) || order.paymentStatus !== 'paid'
}

export const canRetryPayment = (order = {}) => (
  ['failed', 'pending'].includes(order.paymentStatus)
  && order.status === 'pending'
)

export const getOrderNoticeLabel = (order = {}) => {
  return `Status: ${getCustomerOrderStatusMeta(order).label}.`
}

export const getOrderAmountLabel = (order = {}) => formatPrice(order.totalPayable)

export const getPaymentMethodLabel = (order = {}) => {
  const paymentMethod = String(order.paymentMethod || '').toLowerCase()

  if (paymentMethod && paymentMethod !== 'unknown') {
    return humanizeStatus(paymentMethod)
  }

  if (order.paymentProvider) {
    return humanizeStatus(order.paymentProvider)
  }

  return order.paymentStatus === 'pending' ? 'Awaiting payment' : 'Online payment'
}

export const getItemName = (item = {}) => item.productSnapshot?.name || 'Product'

export const getPreviewOrderItem = (order = {}) => {
  const items = Array.isArray(order.items) ? order.items : []

  return items[0] || null
}

export const getItemMeta = (item = {}) => {
  const snapshot = item.productSnapshot || {}

  return snapshot.variantLabel || ''
}

export const getProductPath = (item = {}) => {
  const snapshot = item.productSnapshot || {}
  const productIdentifier = snapshot.slug || item.productId

  return productIdentifier ? `/shop/${encodeURIComponent(productIdentifier)}` : ''
}

export const formatAddressLines = (address = {}) => [
  address.fullName,
  address.phone,
  [address.addressLine1, address.addressLine2].filter(Boolean).join(', '),
  [address.city, address.state, address.pincode].filter(Boolean).join(', '),
  address.country,
].filter(Boolean)

export const formatInlineAddress = (address = {}) => [
  [address.addressLine1, address.addressLine2].filter(Boolean).join(', '),
  address.city,
  address.state,
  address.pincode,
].filter(Boolean).join(', ')
