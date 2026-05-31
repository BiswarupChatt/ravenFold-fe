export const toFiniteNumber = (value, fallback = 0) => {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : fallback
}

export const getBrowserStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const safeJsonParseArray = (value) => {
  const parsedValue = safeJsonParse(value, [])

  return Array.isArray(parsedValue) ? parsedValue : []
}

export const formatPrice = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(toFiniteNumber(value))
}

export const getImageUrl = (image) => {
  if (typeof image === 'string') {
    return image
  }

  return image?.url || image?.src || image?.secureUrl || ''
}

export const getPrimaryImage = (...sources) => {
  for (const source of sources) {
    const images = Array.isArray(source?.images) ? source.images : []
    const image = images.map(getImageUrl).find(Boolean)

    if (image) {
      return image
    }
  }

  return ''
}

export const getPriceData = (source, fallbackSource = {}) => {
  const basePrice = toFiniteNumber(source?.price ?? source?.basePrice ?? fallbackSource?.basePrice)
  const salePrice = source?.salePrice === null || source?.salePrice === undefined
    ? null
    : toFiniteNumber(source.salePrice)
  const hasSalePrice = salePrice !== null && salePrice < basePrice
  const price = hasSalePrice ? salePrice : basePrice
  const compareAtPrice = hasSalePrice ? basePrice : 0
  const discountAmount = compareAtPrice ? compareAtPrice - price : 0

  return {
    compareAtPrice,
    discountAmount,
    price,
  }
}

export const getVariantLabel = (variant) => {
  if (!Array.isArray(variant?.optionValues) || !variant.optionValues.length) {
    return ''
  }

  return variant.optionValues
    .map((option) => `${option.optionName}: ${option.value}`)
    .join(', ')
}

export const getOptionKey = (option = {}) => option.id || option.name
export const getValueKey = (value = {}) => value.id || value.value
export const getValueLabel = (value = {}) => value.label || value.value
export const getVariantParamValue = (variant = {}) => variant?.id || variant?._id || variant?.sku || ''

export const getCartItemKey = (item = {}) => {
  const productId = item.productId || item.id || ''
  const variantId = item.variantId || ''

  return `${productId}:${variantId}`
}

export const getCartItemActionId = (item = {}) => item.id || getCartItemKey(item)

export const getProductDetailsPath = (item = {}) => {
  const id = String(item.id || '')
  const productIdentifier = item.slug || item.productSlug || item.productId || id.split(':')[0]

  return productIdentifier ? `/shop/${encodeURIComponent(productIdentifier)}` : '/shop'
}

export const getCartLineTotal = (item = {}) => {
  if (item.lineTotal !== undefined && item.lineTotal !== null) {
    return toFiniteNumber(item.lineTotal)
  }

  return toFiniteNumber(item.price) * toFiniteNumber(item.quantity)
}

export const getCartPricing = (item = {}) => {
  const price = toFiniteNumber(item.price || item.priceSnapshot?.price)
  const basePrice = toFiniteNumber(item.basePrice || item.compareAtPrice || item.priceSnapshot?.basePrice)
  const compareAtPrice = basePrice > price ? basePrice : 0
  const discountAmount = compareAtPrice ? compareAtPrice - price : 0
  const discountPercent = toFiniteNumber(item.discountPercent)
  const computedDiscountPercent = compareAtPrice
    ? Math.round((discountAmount / compareAtPrice) * 100)
    : 0

  return {
    compareAtPrice,
    discountAmount,
    discountPercent: discountPercent || computedDiscountPercent,
    price,
  }
}

export const parseVariantDetails = (variantLabel = '') => (
  variantLabel
    .split(',')
    .map((part) => {
      const [rawLabel, ...rawValue] = part.split(':')
      const label = rawValue.length ? rawLabel.trim() : ''
      const value = rawValue.length ? rawValue.join(':').trim() : rawLabel.trim()

      return { label, value }
    })
    .filter((detail) => detail.value)
)

export const formatWeight = (shipping = {}) => {
  const value = shipping.weight?.value

  if (value === null || value === undefined || value === '') {
    return ''
  }

  return `${value} ${shipping.weight?.unit || 'kg'}`
}

export const formatDimensions = (shipping = {}) => {
  const dimensions = shipping.dimensions || {}
  const values = [dimensions.length, dimensions.width, dimensions.height]

  if (values.some((value) => value === null || value === undefined || value === '')) {
    return ''
  }

  return `${values.join(' x ')} ${dimensions.unit || 'cm'}`
}
