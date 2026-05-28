import { createSlice } from '@reduxjs/toolkit'
import { getStoredAuthSession } from '../services/authStorage.js'
import { getStoredGuestCartItems } from '../services/cartStorage.js'
import { getCartItemKey } from '../utils/utils.js'

const initialState = {
  items: getStoredAuthSession().token ? [] : getStoredGuestCartItems(),
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
        return
      }

      state.items.push({ ...action.payload, quantity: Number(action.payload.quantity || 1) })
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
        return
      }

      item.quantity -= 1
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => (
        item.id !== action.payload && getCartItemKey(item) !== action.payload
      ))
    },
    replaceCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : []
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addItem, clearCart, decreaseItemQuantity, removeItem, replaceCartItems } =
  cartSlice.actions

export const selectCartItems = (state) => state.cart.items

export const selectCartQuantity = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

export default cartSlice.reducer
