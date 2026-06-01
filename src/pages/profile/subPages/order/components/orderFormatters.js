import { formatPrice } from '../../../../../utils/utils.js'

export const ORDER_PAGE_LIMIT = 10

export const getOrderStatusMeta = (status = 'pending') => {
  const statusMap = {
    cancelled: { label: 'Cancelled', sx: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' } },
    confirmed: { label: 'Confirmed', sx: { bgcolor: 'rgba(14, 165, 233, 0.12)', color: '#0369a1' } },
    delivered: { label: 'Delivered', sx: { bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#059669' } },
    packed: { label: 'Packed', sx: { bgcolor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' } },
    pending: { label: 'Order placed', sx: { bgcolor: 'rgba(245, 158, 11, 0.14)', color: '#b45309' } },
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

export const getOrderProgressCopy = (order = {}) => {
  const progressMap = {
    cancelled: {
      title: 'Order cancelled',
      body: 'This order is no longer active.',
    },
    confirmed: {
      title: 'Order confirmed',
      body: 'We are preparing your items for dispatch.',
    },
    delivered: {
      title: 'Delivered',
      body: 'Package has been marked as delivered.',
    },
    packed: {
      title: 'Packed',
      body: 'Your package is ready to leave our fulfilment desk.',
    },
    pending: {
      title: 'Order placed',
      body: order.paymentStatus === 'pending'
        ? 'Payment is pending before fulfilment can continue.'
        : 'We have received your order.',
    },
    returned: {
      title: 'Return recorded',
      body: 'This order has a return status.',
    },
    shipped: {
      title: 'In transit',
      body: 'Your package is on the way.',
    },
  }

  return progressMap[order.status] || {
    title: getOrderStatusMeta(order.status).label,
    body: 'Order progress will be updated here.',
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

export const getOrderNoticeLabel = (order = {}) => {
  const orderStatus = getOrderStatusMeta(order.status).label
  const paymentStatus = getPaymentStatusMeta(order.paymentStatus).label

  return `Order: ${orderStatus}. Payment: ${paymentStatus}.`
}

export const getOrderAmountLabel = (order = {}) => formatPrice(order.totalPayable)

export const getPaymentMethodLabel = (order = {}) => {
  if (order.paymentMethod) {
    return order.paymentMethod
  }

  return order.paymentStatus === 'paid' ? 'Online payment' : 'Pending payment'
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
