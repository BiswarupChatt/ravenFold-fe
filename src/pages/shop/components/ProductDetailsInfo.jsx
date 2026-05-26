import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'
import { getApiErrorMessage } from '../../../services/apiClient.js'
import { addCartItem, mapServerCartItems } from '../../../services/cartApi.js'
import { errorToast, successToast } from '../../../services/toast.js'
import { selectIsAuthenticated } from '../../../store/authSlice.js'
import { addItem, replaceCartItems } from '../../../store/cartSlice.js'
import { selectWishlistItems, toggleWishlistItem } from '../../../store/wishlistSlice.js'
import formatPrice from '../../../utils/formatPrice.js'
import ProductDetailsOptions from './ProductDetailsOptions.jsx'

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

const getPrimaryImage = (...sources) => {
  for (const source of sources) {
    const images = Array.isArray(source?.images) ? source.images : []
    const image = images.map(getImageUrl).find(Boolean)

    if (image) {
      return image
    }
  }

  return ''
}

const getPriceData = (source, fallbackSource = {}) => {
  const basePrice = toNumber(source?.price ?? source?.basePrice ?? fallbackSource?.basePrice)
  const salePrice = source?.salePrice === null || source?.salePrice === undefined
    ? null
    : toNumber(source.salePrice)
  const hasSalePrice = salePrice !== null && salePrice < basePrice
  const price = hasSalePrice ? salePrice : basePrice
  const compareAtPrice = hasSalePrice ? basePrice : 0
  const discountPercent = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0

  return {
    compareAtPrice,
    discountPercent,
    price,
  }
}

const getVariantLabel = (variant) => {
  if (!Array.isArray(variant?.optionValues) || !variant.optionValues.length) {
    return ''
  }

  return variant.optionValues
    .map((option) => `${option.optionName}: ${option.value}`)
    .join(', ')
}

const getOptionKey = (option = {}) => option.id || option.name
const getValueKey = (value = {}) => value.id || value.value

const getVariantOptionValue = (variant, option) => {
  const optionKey = getOptionKey(option)

  return variant?.optionValues?.find((optionValue) => (
    optionValue.optionId === option.id ||
    optionValue.optionName === option.name ||
    optionValue.optionId === optionKey
  )) || null
}

const getVariantOptionValueKey = (variant, option) => {
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

const buildOptionGroups = (product = {}, variants = []) => {
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

const buildSelectedOptionsFromVariant = (variant, groups = []) => {
  return groups.reduce((selectedOptions, group) => {
    const optionKey = getOptionKey(group)
    const value = getVariantOptionValueKey(variant, group) || getValueKey(group.values[0]) || ''

    if (value) {
      selectedOptions[optionKey] = value
    }

    return selectedOptions
  }, {})
}

const findMatchingVariant = (variants = [], groups = [], selectedOptions = {}) => {
  return variants.find((variant) => (
    groups.every((group) => {
      const selectedValue = selectedOptions[getOptionKey(group)]

      return !selectedValue || getVariantOptionValueKey(variant, group) === selectedValue
    })
  ))
}

const mergeDisplayShipping = (productShipping = {}, variantShipping = null) => {
  const shipping = variantShipping || {}

  return {
    requiresShipping: shipping.requiresShipping ?? productShipping.requiresShipping ?? true,
    weight: {
      value: shipping.weight?.value ?? productShipping.weight?.value ?? null,
      unit: shipping.weight?.unit || productShipping.weight?.unit || 'kg',
    },
    dimensions: {
      length: shipping.dimensions?.length ?? productShipping.dimensions?.length ?? null,
      width: shipping.dimensions?.width ?? productShipping.dimensions?.width ?? null,
      height: shipping.dimensions?.height ?? productShipping.dimensions?.height ?? null,
      unit: shipping.dimensions?.unit || productShipping.dimensions?.unit || 'cm',
    },
    shippingClass: shipping.shippingClass || productShipping.shippingClass || '',
    isFreeShippingEligible: Boolean(
      shipping.isFreeShippingEligible || productShipping.isFreeShippingEligible,
    ),
  }
}

const formatWeight = (shipping = {}) => {
  const value = shipping.weight?.value

  if (value === null || value === undefined || value === '') {
    return ''
  }

  return `${value} ${shipping.weight?.unit || 'kg'}`
}

const formatDimensions = (shipping = {}) => {
  const dimensions = shipping.dimensions || {}
  const values = [dimensions.length, dimensions.width, dimensions.height]

  if (values.some((value) => value === null || value === undefined || value === '')) {
    return ''
  }

  return `${values.join(' x ')} ${dimensions.unit || 'cm'}`
}

function DetailRow({ label, value }) {
  if (!value) {
    return null
  }

  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.9rem',
          fontWeight: 800,
          lineHeight: 1.55,
          maxWidth: '58%',
          textAlign: 'right',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

function ProductDetailsInfo({ product, variants = [] }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const wishlistItems = useSelector(selectWishlistItems)
  const activeVariants = useMemo(
    () => variants.filter((variant) => variant?.isActive !== false),
    [variants],
  )
  const optionGroups = useMemo(() => buildOptionGroups(product, activeVariants), [activeVariants, product])
  const initialSelectedOptions = useMemo(
    () => buildSelectedOptionsFromVariant(activeVariants[0], optionGroups),
    [activeVariants, optionGroups],
  )
  const [selectionState, setSelectionState] = useState({
    options: null,
    productId: '',
  })
  const selectedOptions =
    selectionState.productId === product.id && selectionState.options
      ? selectionState.options
      : initialSelectedOptions
  const [quantity, setQuantity] = useState(1)
  const [cartLoading, setCartLoading] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const category = product.category?.name || product.categoryName || 'Raven Fold'
  const selectedVariant = useMemo(
    () => findMatchingVariant(activeVariants, optionGroups, selectedOptions),
    [activeVariants, optionGroups, selectedOptions],
  )
  const displayVariant = selectedVariant || activeVariants[0] || null
  const displayPriceSource = displayVariant || product
  const { compareAtPrice, discountPercent, price } = getPriceData(displayPriceSource, product)
  const sku = displayVariant?.sku || product.sku || ''
  const description = product.shortDescription || product.description || ''
  const shipping = mergeDisplayShipping(product.shipping, displayVariant?.shipping)
  const details = [
    { label: 'SKU', value: sku },
    { label: 'Category', value: category },
    { label: 'Weight', value: formatWeight(shipping) },
    { label: 'Dimensions', value: formatDimensions(shipping) },
  ]
  const attributes = Array.isArray(product.attributes)
    ? product.attributes.filter((attribute) => attribute?.name && attribute?.value)
    : []
  const tags = Array.isArray(product.tags) ? product.tags.filter(Boolean) : []
  const hasVariants = Boolean(product.hasVariants && optionGroups.length)
  const canPurchase = !product.hasVariants || Boolean(selectedVariant)
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  const isValueAvailable = (option, value) => (
    activeVariants.some((variant) => getVariantOptionValueKey(variant, option) === getValueKey(value))
  )

  const handleSelectOption = (option, value) => {
    setSelectionState((currentState) => {
      const optionKey = getOptionKey(option)
      const valueKey = getValueKey(value)
      const currentOptions =
        currentState.productId === product.id && currentState.options
          ? currentState.options
          : selectedOptions
      const nextOptions = {
        ...currentOptions,
        [optionKey]: valueKey,
      }
      const exactVariant = findMatchingVariant(activeVariants, optionGroups, nextOptions)

      if (exactVariant) {
        return {
          options: buildSelectedOptionsFromVariant(exactVariant, optionGroups),
          productId: product.id,
        }
      }

      const nearestVariant = activeVariants.find(
        (variant) => getVariantOptionValueKey(variant, option) === valueKey,
      )

      return {
        options: nearestVariant
          ? buildSelectedOptionsFromVariant(nearestVariant, optionGroups)
          : nextOptions,
        productId: product.id,
      }
    })
  }

  const buildCartProduct = () => ({
    ...product,
    category,
    compareAtPrice,
    description,
    id: displayVariant ? `${product.id}:${displayVariant.id}` : product.id,
    image: getPrimaryImage(displayVariant, product),
    price,
    productId: product.id,
    quantity,
    sku,
    variantId: displayVariant?.id || '',
    variantLabel: getVariantLabel(displayVariant),
  })

  const buildWishlistProduct = () => {
    const basePrice = getPriceData(product)

    return {
      ...product,
      category,
      compareAtPrice: basePrice.compareAtPrice,
      description,
      id: product.id,
      image: getPrimaryImage(product),
      price: basePrice.price,
      productId: product.id,
      variantId: '',
    }
  }

  const persistCartProduct = async () => {
    if (!canPurchase) {
      throw new Error('Please select an available variant.')
    }

    const cartProduct = buildCartProduct()

    if (!isAuthenticated) {
      dispatch(addItem(cartProduct))
      return cartProduct
    }

    const cart = await addCartItem({
      productId: cartProduct.productId,
      quantity,
      variantId: cartProduct.variantId,
    })

    dispatch(replaceCartItems(mapServerCartItems(cart.items)))
    return cartProduct
  }

  const handleAddToCart = async () => {
    setCartLoading(true)

    try {
      const cartProduct = await persistCartProduct()

      successToast(`${cartProduct.name} added to cart.`)
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    setBuyNowLoading(true)

    try {
      const cartProduct = await persistCartProduct()

      successToast(`${cartProduct.name} added to cart.`)
      navigate('/cart')
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setBuyNowLoading(false)
    }
  }

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(buildWishlistProduct()))
    successToast(
      isWishlisted
        ? `${product.name} removed from wishlist.`
        : `${product.name} added to wishlist.`,
    )
  }

  return (
    <Stack
      spacing={2.7}
      sx={{
        position: { lg: 'sticky' },
        top: { lg: 96 },
      }}
    >
      <Stack spacing={1.15}>
        <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            {category}
          </Typography>

          {product.isFeatured ? (
            <Chip
              label="Featured"
              size="small"
              sx={{
                bgcolor: 'rgba(217, 70, 31, 0.1)',
                color: 'secondary.dark',
                fontSize: '0.72rem',
                fontWeight: 800,
                height: 24,
              }}
            />
          ) : null}
        </Stack>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.65rem' },
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1.05,
          }}
        >
          {product.name}
        </Typography>
      </Stack>

      <Stack spacing={0.7}>
        <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={1.15}>
          <Typography sx={{ fontSize: { xs: '1.85rem', md: '2.05rem' }, fontWeight: 900 }}>
            {formatPrice(price)}
          </Typography>

          {compareAtPrice ? (
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '1.02rem',
                opacity: 0.58,
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(compareAtPrice)}
            </Typography>
          ) : null}

          {discountPercent ? (
            <Chip
              label={`${discountPercent}% off`}
              size="small"
              sx={{
                bgcolor: 'rgba(179, 0, 0, 0.08)',
                color: '#9f1d1d',
                fontWeight: 900,
                height: 24,
              }}
            />
          ) : null}
        </Stack>

      </Stack>

      {description ? (
        <Typography
          color="text.secondary"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.7,
            maxWidth: 620,
          }}
        >
          {description}
        </Typography>
      ) : null}

      {hasVariants ? (
        <>
          <Divider />
          <ProductDetailsOptions
            groups={optionGroups}
            isValueAvailable={isValueAvailable}
            onSelectOption={handleSelectOption}
            selectedOptions={selectedOptions}
          />
        </>
      ) : null}

      <Divider />

      <Stack spacing={1.2}>
        <Typography sx={{ fontSize: '0.92rem', fontWeight: 800 }}>
          Quantity
        </Typography>

        <Stack alignItems="center" direction="row" spacing={1}>
          <IconButton
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              height: 38,
              width: 38,
            }}
          >
            <RemoveRoundedIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              fontWeight: 900,
              height: 38,
              justifyContent: 'center',
              minWidth: 52,
              px: 1.5,
            }}
          >
            {quantity}
          </Box>

          <IconButton
            aria-label="Increase quantity"
            onClick={() => setQuantity((currentQuantity) => currentQuantity + 1)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              height: 38,
              width: 38,
            }}
          >
            <AddRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.15}>
        <AppButton
          disabled={!canPurchase || buyNowLoading || cartLoading}
          fullWidth
          loading={cartLoading}
          onClick={handleAddToCart}
          startIcon={<AddShoppingCartRoundedIcon />}
          sx={{
            borderColor: 'text.primary',
            color: 'text.primary',
            minHeight: 50,
          }}
          variant="outlined"
        >
          Add to Cart
        </AppButton>

        <AppButton
          disabled={!canPurchase || cartLoading || buyNowLoading}
          fullWidth
          loading={buyNowLoading}
          onClick={handleBuyNow}
          startIcon={<BoltRoundedIcon />}
          sx={{
            bgcolor: 'text.primary',
            minHeight: 50,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
          variant="contained"
        >
          Buy Now
        </AppButton>

        <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleToggleWishlist}
            sx={{
              alignSelf: { xs: 'stretch', sm: 'auto' },
              border: '1px solid',
              borderColor: isWishlisted ? 'secondary.main' : 'divider',
              borderRadius: 0,
              color: isWishlisted ? 'secondary.main' : 'text.primary',
              minHeight: 50,
              minWidth: { xs: '100%', sm: 52 },
            }}
          >
            {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {!canPurchase ? (
        <Typography color="error" sx={{ fontSize: '0.9rem', fontWeight: 700 }}>
          This option combination is unavailable.
        </Typography>
      ) : null}

      <Stack
        spacing={1.15}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderTop: '1px solid',
          py: 2.15,
        }}
      >
        {details.map((detail) => (
          <DetailRow key={detail.label} label={detail.label} value={detail.value} />
        ))}
      </Stack>

      {attributes.length ? (
        <Stack spacing={1.25}>
          <Typography sx={{ fontSize: '0.94rem', fontWeight: 900 }}>
            Product Details
          </Typography>
          <Stack spacing={0.85}>
            {attributes.map((attribute) => (
              <DetailRow
                key={`${attribute.name}-${attribute.value}`}
                label={attribute.name}
                value={attribute.value}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}

      {tags.length ? (
        <Stack direction="row" flexWrap="wrap" gap={0.75}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'transparent',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                color: 'text.secondary',
                fontWeight: 700,
              }}
              variant="outlined"
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}

export default ProductDetailsInfo
