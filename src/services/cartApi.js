import apiClient from './apiClient.js'
import { toFiniteNumber } from '../utils/utils.js'

const unwrapCartResponse = (response) => {
  const cartData = response.data?.data

  if (!cartData || !Array.isArray(cartData.items)) {
    throw new Error(response.data?.message || 'Invalid cart response.')
  }

  return cartData
}

export const mapServerCartItems = (items = []) => {
  return items.map((item) => {
    const snapshot = item.productSnapshot || {}
    const priceSnapshot = item.priceSnapshot || {}
    const quantity = toFiniteNumber(item.quantity, 1)
    const price = toFiniteNumber(item.priceAtTime ?? priceSnapshot.price)
    const basePrice = toFiniteNumber(priceSnapshot.basePrice ?? price)
    const salePrice = priceSnapshot.salePrice === null || priceSnapshot.salePrice === undefined
      ? null
      : toFiniteNumber(priceSnapshot.salePrice)
    const compareAtPrice = basePrice > price ? basePrice : 0
    const discountAmount = compareAtPrice ? compareAtPrice - price : 0
    const discountPercent = compareAtPrice
      ? Math.round((discountAmount / compareAtPrice) * 100)
      : 0
    const productId = item.productId || ''
    const variantId = item.variantId || ''
    const id = variantId ? `${productId}:${variantId}` : productId

    return {
      basePrice,
      cartId: item.cartId || '',
      cartItemId: item.id,
      createdAt: item.createdAt || '',
      currency: priceSnapshot.currency || 'INR',
      discountAmount,
      discountPercent,
      id,
      image: snapshot.image || '',
      lineTotal: toFiniteNumber(item.lineTotal, price * quantity),
      name: snapshot.name || 'Product',
      compareAtPrice,
      price,
      priceAtTime: price,
      priceSnapshot: {
        basePrice,
        currency: priceSnapshot.currency || 'INR',
        price,
        salePrice,
      },
      productId,
      quantity,
      salePrice,
      sku: snapshot.sku || '',
      slug: snapshot.slug || '',
      updatedAt: item.updatedAt || '',
      variantId,
      variantLabel: snapshot.variantLabel || '',
      variantSku: snapshot.variantSku || '',
    }
  })
}

export const getCart = async () => {
  const response = await apiClient.get('/cart')

  return unwrapCartResponse(response)
}

export const addCartItem = async ({ productId, quantity = 1, variantId = '' }) => {
  const response = await apiClient.post('/cart/items', {
    productId,
    quantity,
    variantId: variantId || undefined,
  })

  return unwrapCartResponse(response)
}

export const updateCartItem = async (cartItemId, { quantity }) => {
  const response = await apiClient.patch(`/cart/items/${cartItemId}`, {
    quantity,
  })

  return unwrapCartResponse(response)
}

export const removeCartItem = async (cartItemId) => {
  const response = await apiClient.delete(`/cart/items/${cartItemId}`)

  return unwrapCartResponse(response)
}

export const clearCart = async () => {
  const response = await apiClient.delete('/cart')

  return unwrapCartResponse(response)
}

export const syncGuestCartItems = async (items = []) => {
  let latestCart = null
  const failedItems = []
  const syncedItems = []

  for (const item of items) {
    try {
      latestCart = await addCartItem({
        productId: item.productId || item.id,
        quantity: item.quantity || 1,
        variantId: item.variantId || '',
      })
      syncedItems.push(item)
    } catch (error) {
      failedItems.push({
        error,
        item,
      })
    }
  }

  const cart = latestCart || await getCart()

  return {
    cart,
    failedItems,
    syncedItems,
  }
}
