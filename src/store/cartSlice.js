import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    {
      id: 'structured-tote',
      name: 'Structured Tote',
      price: 8900,
      category: 'Bags',
      quantity: 1,
    },
    {
      id: 'travel-fold-wallet',
      name: 'Travel Fold Wallet',
      price: 4200,
      category: 'Accessories',
      quantity: 2,
    },
  ],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      )

      if (existingItem) {
        existingItem.quantity += 1
        return
      }

      state.items.push({ ...action.payload, quantity: 1 })
    },
    decreaseItemQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)

      if (!item) {
        return
      }

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (cartItem) => cartItem.id !== action.payload,
        )
        return
      }

      item.quantity -= 1
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addItem, clearCart, decreaseItemQuantity, removeItem } =
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
