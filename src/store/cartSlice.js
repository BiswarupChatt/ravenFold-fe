import { createSlice } from '@reduxjs/toolkit'
import { getStoredAuthSession } from '../services/authStorage.js'
import { getStoredGuestCartItems } from '../services/cartStorage.js'
import { getCartItemKey, getCartPricing, toFiniteNumber } from '../utils/utils.js'

const initialState = {
  items: getStoredAuthSession().token ? [] : getStoredGuestCartItems(),
  summary: null,
}

const getItemLineTotal = (item = {}) => {
  if (item.lineTotal !== undefined && item.lineTotal !== null) {
    return toFiniteNumber(item.lineTotal)
  }

  return toFiniteNumber(item.price) * toFiniteNumber(item.quantity, 1)
}

const buildLocalSummary = (items = []) => {
  const totalQuantity = items.reduce((total, item) => total + toFiniteNumber(item.quantity, 1), 0)
  const subtotal = items.reduce((total, item) => total + getItemLineTotal(item), 0)
  const totalMrp = items.reduce((total, item) => {
    const { compareAtPrice, price } = getCartPricing(item)
    const mrp = compareAtPrice || price

    return total + (mrp * toFiniteNumber(item.quantity, 1))
  }, 0)
  const normalizedSubtotal = Number(subtotal.toFixed(2))
  const normalizedTotalMrp = Number(Math.max(totalMrp, normalizedSubtotal).toFixed(2))

  return {
    bagDiscount: Number(Math.max(normalizedTotalMrp - normalizedSubtotal, 0).toFixed(2)),
    itemCount: items.length,
    subtotal: normalizedSubtotal,
    totalMrp: normalizedTotalMrp,
    totalQuantity,
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => getCartItemKey(item) === getCartItemKey(action.payload),
      )

      if (existingItem) {
        existingItem.quantity += Number(action.payload.quantity || 1)
        state.summary = null
        return
      }

      state.items.push({ ...action.payload, quantity: Number(action.payload.quantity || 1) })
      state.summary = null
    },
    decreaseItemQuantity: (state, action) => {
      const item = state.items.find((cartItem) => (
        cartItem.id === action.payload || getCartItemKey(cartItem) === action.payload
      ))

      if (!item) {
        return
      }

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (cartItem) => cartItem.id !== action.payload && getCartItemKey(cartItem) !== action.payload,
        )
        state.summary = null
        return
      }

      item.quantity -= 1
      state.summary = null
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => (
        item.id !== action.payload && getCartItemKey(item) !== action.payload
      ))
      state.summary = null
    },
    replaceCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : []
      state.summary = null
    },
    replaceServerCart: (state, action) => {
      state.items = Array.isArray(action.payload?.items) ? action.payload.items : []
      state.summary = action.payload?.summary || null
    },
    clearCartPricing: (state) => {
      state.summary = null
    },
    clearCart: (state) => {
      state.items = []
      state.summary = null
    },
  },
})

export const {
  addItem,
  clearCart,
  clearCartPricing,
  decreaseItemQuantity,
  removeItem,
  replaceCartItems,
  replaceServerCart,
} =
  cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartServerSummary = (state) => state.cart.summary

export const selectCartQuantity = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state) =>
  buildLocalSummary(state.cart.items).subtotal

export const selectCartSummary = (state) => {
  const localSummary = buildLocalSummary(state.cart.items)
  const serverSummary = state.cart.summary || {}
  const productDiscountAmount = toFiniteNumber(serverSummary.productDiscountAmount)
  const shippingCharge = toFiniteNumber(serverSummary.shippingCharge)
  const shippingDiscountAmount = toFiniteNumber(serverSummary.shippingDiscountAmount)
  const totalDiscountAmount = serverSummary.totalDiscountAmount === undefined || serverSummary.totalDiscountAmount === null
    ? productDiscountAmount + shippingDiscountAmount
    : toFiniteNumber(serverSummary.totalDiscountAmount)
  const totalPayable = serverSummary.total === undefined || serverSummary.total === null
    ? Number(Math.max(localSummary.subtotal - productDiscountAmount + shippingCharge - shippingDiscountAmount, 0).toFixed(2))
    : toFiniteNumber(serverSummary.total)

  return {
    ...localSummary,
    appliedPromotions: Array.isArray(serverSummary.appliedPromotions) ? serverSummary.appliedPromotions : [],
    couponCode: serverSummary.couponCode || '',
    couponDiscount: productDiscountAmount,
    productDiscountAmount,
    rejectedCoupon: serverSummary.rejectedCoupon || null,
    shippingCharge,
    shippingDiscountAmount,
    totalDiscountAmount,
    totalPayable,
  }
}

export default cartSlice.reducer
