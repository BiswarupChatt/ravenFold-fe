import { Divider, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import useResponsiveView from '../../../hooks/useResponsiveView.js'
import ProductDetailsOptions from './ProductDetailsOptions.jsx'
import ProductDetailsAttributes from './productDetailsInfo/ProductDetailsAttributes.jsx'
import ProductDetailsHeader from './productDetailsInfo/ProductDetailsHeader.jsx'
import ProductDetailsMeta from './productDetailsInfo/ProductDetailsMeta.jsx'
import ProductDetailsPrice from './productDetailsInfo/ProductDetailsPrice.jsx'
import ProductDetailsPurchaseActions from './productDetailsInfo/ProductDetailsPurchaseActions.jsx'
import ProductDetailsTags from './productDetailsInfo/ProductDetailsTags.jsx'
import {
  VARIANT_QUERY_PARAM,
  buildOptionGroups,
  buildSelectedOptionsFromVariant,
  findMatchingVariant,
  findVariantByParam,
  formatDimensions,
  formatWeight,
  getOptionKey,
  getPriceData,
  getPrimaryImage,
  getValueKey,
  getVariantLabel,
  getVariantOptionValueKey,
  getVariantParamValue,
  mergeDisplayShipping,
} from './productDetailsInfo/productDetailsInfoUtils.js'

function ProductDetailsInfo({ product, variants = [] }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { isDesktop } = useResponsiveView()
  const cartItems = useSelector(selectCartItems)
  const wishlistItems = useSelector(selectWishlistItems)
  const [cartLoading, setCartLoading] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

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
  const selectedOptions = useMemo(
    () => buildSelectedOptionsFromVariant(queryVariant || activeVariants[0], optionGroups),
    [activeVariants, optionGroups, queryVariant],
  )
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

  const buildCartProduct = (itemQuantity = 1) => ({
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

  const persistCartProduct = async (itemQuantity = 1) => {
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

        return
      }

      if (!currentCartItem.cartItemId) {
        throw new Error('Unable to update this cart item.')
      }

      const cart = nextQuantity <= 0
        ? await removeServerCartItem(currentCartItem.cartItemId)
        : await updateCartItem(currentCartItem.cartItemId, { quantity: nextQuantity })

      dispatch(replaceCartItems(mapServerCartItems(cart.items)))
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
        minWidth: 0,
        position: isDesktop ? 'sticky' : 'static',
        top: isDesktop ? 96 : 'auto',
        width: '100%',
      }}
    >
      <ProductDetailsHeader
        category={category}
        isWishlisted={isWishlisted}
        name={product.name}
        onToggleWishlist={handleToggleWishlist}
      />
      <ProductDetailsPrice
        compareAtPrice={compareAtPrice}
        discountAmount={discountAmount}
        price={price}
      />

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

      <ProductDetailsPurchaseActions
        buyNowLoading={buyNowLoading}
        canPurchase={canPurchase}
        cartLoading={cartLoading}
        cartQuantity={cartQuantity}
        isAddedToCart={isAddedToCart}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onCartQuantityChange={handleCartQuantityChange}
      />

      <ProductDetailsMeta details={details} />
      <ProductDetailsAttributes attributes={attributes} />
      <ProductDetailsTags tags={tags} />
    </Stack>
  )
}

export default ProductDetailsInfo
