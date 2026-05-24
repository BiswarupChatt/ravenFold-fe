import apiClient from './apiClient.js'

const unwrapCartResponse = (response) => {
  const cartData = response.data?.data

  if (!cartData || !Array.isArray(cartData.items)) {
    throw new Error(response.data?.message || 'Invalid cart response.')
  }

  return cartData
}

const formatVariantLabel = (variantLabel) => {
  return variantLabel ? ` (${variantLabel})` : ''
}

export const mapServerCartItems = (items = []) => {
  return items.map((item) => {
    const snapshot = item.productSnapshot || {}
    const price = Number(item.priceAtTime ?? item.priceSnapshot?.price ?? 0)
    const productId = item.productId || ''
    const variantId = item.variantId || ''

    return {
      cartItemId: item.id,
      category: snapshot.variantLabel || '',
      id: variantId ? `${productId}:${variantId}` : productId,
      image: snapshot.image || '',
      name: `${snapshot.name || 'Product'}${formatVariantLabel(snapshot.variantLabel)}`,
      price,
      productId,
      quantity: Number(item.quantity || 1),
      sku: snapshot.variantSku || snapshot.sku || '',
      variantId,
      variantLabel: snapshot.variantLabel || '',
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
