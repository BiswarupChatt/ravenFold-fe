import { getBrowserStorage, safeJsonParseArray } from '../utils/utils.js'

const GUEST_CART_KEY = 'ravenfold.guestCart.items'

export const getStoredGuestCartItems = () => {
  return safeJsonParseArray(getBrowserStorage()?.getItem(GUEST_CART_KEY))
}

export const saveStoredGuestCartItems = (items) => {
  const storage = getBrowserStorage()

  if (!storage) {
    return
  }

  storage.setItem(GUEST_CART_KEY, JSON.stringify(Array.isArray(items) ? items : []))
}

export const clearStoredGuestCartItems = () => {
  getBrowserStorage()?.removeItem(GUEST_CART_KEY)
}
