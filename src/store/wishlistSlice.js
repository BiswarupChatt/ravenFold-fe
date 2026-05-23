import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addWishlistItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      )

      if (existingItem) {
        return
      }

      state.items.push(action.payload)
    },
    removeWishlistItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    toggleWishlistItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      )

      if (existingItem) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        )
        return
      }

      state.items.push(action.payload)
    },
  },
})

export const { addWishlistItem, removeWishlistItem, toggleWishlistItem } =
  wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items

export default wishlistSlice.reducer
