export const REVIEW_STATUS_META = {
  APPROVED: {
    color: 'success',
    helper: '',
    label: '',
  },
  HIDDEN: {
    color: 'default',
    helper: '',
    label: '',
  },
  PENDING: {
    color: 'warning',
    helper: '',
    label: '',
  },
  REJECTED: {
    color: 'error',
    helper: '',
    label: '',
  },
}

export const REVIEW_ELIGIBILITY_REASON_LABELS = {
  ITEM_CANCELLED: 'This item is no longer eligible for review because it was cancelled.',
  ITEM_REFUNDED: 'This item is no longer eligible for review because it was refunded or returned.',
  ORDER_ITEM_NOT_FOUND: 'The selected order item could not be found.',
  ORDER_NOT_DELIVERED: 'You can review this product only after it has been delivered.',
  ORDER_NOT_FOUND: 'The selected order could not be found.',
  ORDER_NOT_OWNED_BY_USER: 'This order does not belong to you.',
  PRODUCT_DELETED: 'This product is no longer available for review.',
  PRODUCT_MISMATCH: 'The selected product does not match the purchased order item.',
  REVIEW_ALREADY_EXISTS: 'You have already reviewed this order item.',
  VARIANT_MISMATCH: 'The selected product variant does not match the purchased order item.',
}

export const getReviewStatusMeta = (status = '') => {
  return REVIEW_STATUS_META[status] || {
    color: 'default',
    helper: '',
    label: '',
  }
}

export const getReviewActionLabel = (status = '') => {
  if (status) {
    return 'Edit Review'
  }

  return 'Write Review'
}

export const getEligibilityReasonLabel = (reason = '', reasonMessage = '') => {
  if (String(reasonMessage || '').trim()) {
    return reasonMessage
  }

  return REVIEW_ELIGIBILITY_REASON_LABELS[reason] || 'Review is not available for this item yet.'
}

export const formatReviewDate = (value) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
