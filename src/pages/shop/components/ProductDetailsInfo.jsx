import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppButton from '../../../components/AppButton.jsx'
import { getApiErrorMessage } from '../../../services/apiClient.js'
import {
  addCartItem,
  mapServerCartItems,
  removeCartItem as removeServerCartItem,
  updateCartItem,
} from '../../../services/cartApi.js'
import { errorToast, successToast } from '../../../services/toast.js'
import { selectIsAuthenticated } from '../../../store/authSlice.js'
import {
  addItem,
  decreaseItemQuantity,
  removeItem,
  replaceCartItems,
  selectCartItems,
} from '../../../store/cartSlice.js'
import { selectWishlistItems, toggleWishlistItem } from '../../../store/wishlistSlice.js'
import formatPrice from '../../../utils/formatPrice.js'
import ProductDetailsOptions from './ProductDetailsOptions.jsx'

const VARIANT_QUERY_PARAM = 'variant'

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
  const discountAmount = compareAtPrice ? compareAtPrice - price : 0

  return {
    compareAtPrice,
    discountAmount,
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
const getVariantParamValue = (variant = {}) => variant?.id || variant?._id || variant?.sku || ''

const findVariantByParam = (variants = [], variantParam = '') => {
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
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const cartItems = useSelector(selectCartItems)
  const wishlistItems = useSelector(selectWishlistItems)
  const activeVariants = useMemo(
    () => variants.filter((variant) => variant?.isActive !== false),
    [variants],
  )
  const optionGroups = useMemo(() => buildOptionGroups(product, activeVariants), [activeVariants, product])
  const hasVariants = Boolean(product.hasVariants && optionGroups.length)
  const queryVariantId = searchParams.get(VARIANT_QUERY_PARAM) || ''
  const queryVariant = useMemo(
    () => findVariantByParam(activeVariants, queryVariantId),
    [activeVariants, queryVariantId],
  )
  const initialSelectedOptions = useMemo(
    () => buildSelectedOptionsFromVariant(queryVariant || activeVariants[0], optionGroups),
    [activeVariants, optionGroups, queryVariant],
  )
  const selectedOptions = initialSelectedOptions
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
  const { compareAtPrice, discountAmount, price } = getPriceData(displayPriceSource, product)
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
  const canPurchase = !product.hasVariants || Boolean(selectedVariant)
  const cartItemKey = `${product.id}:${displayVariant?.id || ''}`
  const currentCartItem = useMemo(() => (
    cartItems.find((item) => {
      const itemKey = `${item.productId || item.id}:${item.variantId || ''}`

      return itemKey === cartItemKey || item.id === cartItemKey
    }) || null
  ), [cartItemKey, cartItems])
  const cartQuantity = Number(currentCartItem?.quantity || 0)
  const isAddedToCart = cartQuantity > 0
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  useEffect(() => {
    if (!hasVariants || !activeVariants.length) {
      return
    }

    const nextVariant = queryVariant || activeVariants[0]
    const nextVariantParam = getVariantParamValue(nextVariant)

    if (!nextVariantParam || queryVariantId === nextVariantParam) {
      return
    }

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)

      nextParams.set(VARIANT_QUERY_PARAM, nextVariantParam)

      return nextParams
    }, { replace: true })
  }, [activeVariants, hasVariants, queryVariant, queryVariantId, setSearchParams])

  const isValueAvailable = (option, value) => (
    activeVariants.some((variant) => getVariantOptionValueKey(variant, option) === getValueKey(value))
  )

  const setVariantSearchParam = (variant) => {
    const variantParam = getVariantParamValue(variant)

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)

      if (variantParam) {
        nextParams.set(VARIANT_QUERY_PARAM, variantParam)
      } else {
        nextParams.delete(VARIANT_QUERY_PARAM)
      }

      return nextParams
    }, { replace: true })
  }

  const handleSelectOption = (option, value) => {
    const optionKey = getOptionKey(option)
    const valueKey = getValueKey(value)
    const nextOptions = {
      ...selectedOptions,
      [optionKey]: valueKey,
    }
    const exactVariant = findMatchingVariant(activeVariants, optionGroups, nextOptions)
    const nearestVariant = exactVariant || activeVariants.find(
      (variant) => getVariantOptionValueKey(variant, option) === valueKey,
    )

    setVariantSearchParam(nearestVariant)
  }

  const buildCartProduct = (itemQuantity = quantity) => ({
    ...product,
    category,
    compareAtPrice,
    description,
    id: displayVariant ? `${product.id}:${displayVariant.id}` : product.id,
    image: getPrimaryImage(displayVariant, product),
    price,
    productId: product.id,
    quantity: itemQuantity,
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

  const persistCartProduct = async (itemQuantity = quantity) => {
    if (!canPurchase) {
      throw new Error('Please select an available variant.')
    }

    const cartProduct = buildCartProduct(itemQuantity)

    if (!isAuthenticated) {
      dispatch(addItem(cartProduct))
      return cartProduct
    }

    const cart = await addCartItem({
      productId: cartProduct.productId,
      quantity: itemQuantity,
      variantId: cartProduct.variantId,
    })

    dispatch(replaceCartItems(mapServerCartItems(cart.items)))
    return cartProduct
  }

  const handleAddToCart = async () => {
    setCartLoading(true)

    try {
      const cartProduct = await persistCartProduct(1)

      successToast(`${cartProduct.name} added to cart.`)
      setQuantity(1)
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setCartLoading(false)
    }
  }

  const handleCartQuantityChange = async (nextQuantity) => {
    if (!currentCartItem) {
      return
    }

    setCartLoading(true)

    try {
      if (!isAuthenticated) {
        if (nextQuantity <= 0) {
          dispatch(removeItem(cartItemKey))
        } else if (nextQuantity > cartQuantity) {
          dispatch(addItem(buildCartProduct(1)))
        } else {
          dispatch(decreaseItemQuantity(cartItemKey))
        }

        setQuantity(Math.max(nextQuantity, 1))
        return
      }

      if (!currentCartItem.cartItemId) {
        throw new Error('Unable to update this cart item.')
      }

      const cart = nextQuantity <= 0
        ? await removeServerCartItem(currentCartItem.cartItemId)
        : await updateCartItem(currentCartItem.cartItemId, { quantity: nextQuantity })

      dispatch(replaceCartItems(mapServerCartItems(cart.items)))
      setQuantity(Math.max(nextQuantity, 1))
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    setBuyNowLoading(true)

    try {
      const cartProduct = currentCartItem || await persistCartProduct(1)

      if (!currentCartItem) {
        successToast(`${cartProduct.name} added to cart.`)
      }

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

      <Stack spacing={0.85}>
        <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={1.2}>
          <Typography
            sx={{
              color: '#1f2433',
              fontSize: { xs: '2.15rem', md: '2.45rem' },
              fontWeight: 900,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {formatPrice(price)}
          </Typography>

          {discountAmount ? (
            <Typography
              sx={{
                color: '#088a35',
                fontSize: { xs: '1.25rem', md: '1.45rem' },
                fontWeight: 900,
                letterSpacing: 0.4,
                lineHeight: 1,
              }}
            >
              {formatPrice(discountAmount)} OFF
            </Typography>
          ) : null}
        </Stack>

        <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
          {compareAtPrice ? (
            <Stack alignItems="baseline" direction="row" spacing={0.55}>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.98rem', md: '1.04rem' },
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}
              >
                MRP:
              </Typography>

              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.98rem', md: '1.04rem' },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  opacity: 0.78,
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(compareAtPrice)}
              </Typography>
            </Stack>
          ) : null}

          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.98rem', md: '1.04rem' },
              fontWeight: 500,
              lineHeight: 1.25,
              marginLeft: compareAtPrice ? 1 : 0,
            }}
          >
            Inclusive of all Taxes
          </Typography>
        </Stack>

      </Stack>


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

      <Stack
        spacing={1}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr) 52px',
              sm: 'minmax(0, 1fr) minmax(0, 1fr) 52px',
            },
          }}
        >
          {isAddedToCart ? (
            <Stack
              alignItems="center"
              direction="row"
              sx={{
                bgcolor: 'transparent',
                border: '1px solid',
                borderColor: 'text.primary',
                borderRadius: 2,
                color: 'text.primary',
                height: 52,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <IconButton
                aria-label="Decrease cart quantity"
                disabled={cartLoading || buyNowLoading}
                onClick={() => handleCartQuantityChange(cartQuantity - 1)}
                sx={{
                  borderRadius: 0,
                  color: 'inherit',
                  height: '100%',
                  width: 56,
                  '&:hover': {
                    bgcolor: 'rgba(24, 24, 27, 0.06)',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(24, 24, 27, 0.32)',
                  },
                }}
              >
                <RemoveRoundedIcon />
              </IconButton>

              <Box
                sx={{
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  bgcolor: 'transparent',
                  borderColor: 'text.primary',
                  borderLeft: '1px solid',
                  borderRight: '1px solid',
                  display: 'flex',
                  flex: 1,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                  lineHeight: 1.2,
                  minWidth: 0,
                }}
              >
                {cartQuantity}
              </Box>

              <IconButton
                aria-label="Increase cart quantity"
                disabled={cartLoading || buyNowLoading}
                onClick={() => handleCartQuantityChange(cartQuantity + 1)}
                sx={{
                  borderRadius: 0,
                  color: 'inherit',
                  height: '100%',
                  width: 56,
                  '&:hover': {
                    bgcolor: 'rgba(24, 24, 27, 0.06)',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(24, 24, 27, 0.32)',
                  },
                }}
              >
                <AddRoundedIcon />
              </IconButton>
            </Stack>
          ) : (
            <AppButton
              disabled={!canPurchase || buyNowLoading || cartLoading}
              fullWidth
              loading={cartLoading}
              onClick={handleAddToCart}
              startIcon={<AddShoppingCartRoundedIcon />}
              sx={{
                bgcolor: 'text.primary',
                minHeight: 52,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
              variant="contained"
            >
              Add to Cart
            </AppButton>
          )}

          <AppButton
            disabled={!canPurchase || cartLoading || buyNowLoading}
            fullWidth
            loading={buyNowLoading}
            onClick={handleBuyNow}
            startIcon={<BoltRoundedIcon />}
            sx={{
              borderColor: 'text.primary',
              color: 'text.primary',
              gridColumn: { xs: '1 / -1', sm: 'auto' },
              minHeight: 52,
            }}
            variant="outlined"
          >
            Buy Now
          </AppButton>

        <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleToggleWishlist}
            sx={{
	              border: '1px solid',
	              borderColor: isWishlisted ? 'secondary.main' : 'divider',
	              borderRadius: 2,
              color: isWishlisted ? 'secondary.main' : 'text.primary',
              height: 52,
              width: 52,
            }}
          >
            {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          </IconButton>
        </Tooltip>
        </Box>
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
          borderTop: '1px solid',
          borderColor: 'divider',
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
