import { configureStore } from '@reduxjs/toolkit'
import { saveStoredGuestCartItems } from '../services/cartStorage'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
})

let previousCartItems = store.getState().cart.items

store.subscribe(() => {
  const state = store.getState()
  const currentCartItems = state.cart.items

  if (currentCartItems === previousCartItems) {
    return
  }

  previousCartItems = currentCartItems

  if (!state.auth.isAuthenticated) {
    saveStoredGuestCartItems(currentCartItems)
  }
})

export default store
