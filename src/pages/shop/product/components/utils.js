export const VARIANT_QUERY_PARAM = 'variant'

const toNumber = (value) => {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : 0
}

const getImageUrl = (image) => {
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
  const basePrice = toNumber(source?.price ?? source?.basePrice ?? fallbackSource?.basePrice)
  const salePrice = source?.salePrice === null || source?.salePrice === undefined
    ? null
    : toNumber(source.salePrice)
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
export const getVariantParamValue = (variant = {}) => variant?.id || variant?._id || variant?.sku || ''

export const findVariantByParam = (variants = [], variantParam = '') => {
  if (!variantParam) {
    return null
  }

  return variants.find((variant) => (
    [variant?.id, variant?._id, variant?.sku]
      .filter(Boolean)
      .some((value) => String(value) === String(variantParam))
  )) || null
}

const getVariantOptionValue = (variant, option) => {
  const optionKey = getOptionKey(option)

  return variant?.optionValues?.find((optionValue) => (
    optionValue.optionId === option.id ||
    optionValue.optionName === option.name ||
    optionValue.optionId === optionKey
  )) || null
}

export const getVariantOptionValueKey = (variant, option) => {
  const variantOptionValue = getVariantOptionValue(variant, option)

  if (!variantOptionValue) {
    return ''
  }

  const matchingValue = option.values?.find((value) => (
    value.id === variantOptionValue.valueId ||
    value.value === variantOptionValue.value
  ))

  return variantOptionValue.valueId || getValueKey(matchingValue) || variantOptionValue.value
}

export const buildOptionGroups = (product = {}, variants = []) => {
  if (Array.isArray(product.options) && product.options.length) {
    return product.options
      .filter((option) => option?.name)
      .map((option) => ({
        ...option,
        values: Array.isArray(option.values) ? option.values.filter((value) => value?.value) : [],
      }))
  }

  const groups = new Map()

  variants.forEach((variant) => {
    variant.optionValues?.forEach((option) => {
      const optionKey = option.optionId || option.optionName || 'Option'
      const group = groups.get(optionKey) || {
        displayStyle: 'button',
        id: option.optionId || option.optionName,
        name: option.optionName || 'Option',
        optionType: 'other',
        sizeGuideImageUrl: '',
        values: [],
      }

      if (option.value && !group.values.some((value) => getValueKey(value) === (option.valueId || option.value))) {
        group.values.push({
          id: option.valueId || option.value,
          label: option.value,
          value: option.value,
        })
      }

      groups.set(optionKey, group)
    })
  })

  return Array.from(groups.values())
}

export const buildSelectedOptionsFromVariant = (variant, groups = []) => {
  return groups.reduce((selectedOptions, group) => {
    const optionKey = getOptionKey(group)
    const value = getVariantOptionValueKey(variant, group) || getValueKey(group.values[0]) || ''

    if (value) {
      selectedOptions[optionKey] = value
    }

    return selectedOptions
  }, {})
}

export const findMatchingVariant = (variants = [], groups = [], selectedOptions = {}) => {
  return variants.find((variant) => (
    groups.every((group) => {
      const selectedValue = selectedOptions[getOptionKey(group)]

      return !selectedValue || getVariantOptionValueKey(variant, group) === selectedValue
    })
  ))
}



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
