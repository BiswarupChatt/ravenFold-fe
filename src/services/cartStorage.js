const GUEST_CART_KEY = 'ravenfold.guestCart.items'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

const safeJsonParse = (value) => {
  try {
    const parsedValue = value ? JSON.parse(value) : []

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export const getStoredGuestCartItems = () => {
  return safeJsonParse(getStorage()?.getItem(GUEST_CART_KEY))
}

export const saveStoredGuestCartItems = (items) => {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.setItem(GUEST_CART_KEY, JSON.stringify(Array.isArray(items) ? items : []))
}

export const clearStoredGuestCartItems = () => {
  getStorage()?.removeItem(GUEST_CART_KEY)
}
