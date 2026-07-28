import {
  getOptionKey,
  getValueKey,
} from '../../../../utils/utils.js'

export {
  formatDimensions,
  formatWeight,
  getImageUrl,
  getOptionKey,
  getPriceData,
  getPrimaryImage,
  getValueKey,
  getValueLabel,
  getVariantLabel,
  getVariantParamValue,
} from '../../../../utils/utils.js'

export const VARIANT_QUERY_PARAM = 'variant'

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
        sizeGuideImageAsset: null,
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
