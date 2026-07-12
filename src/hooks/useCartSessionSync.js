import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getApiErrorMessage } from '../services/apiClient.js'
import {
  getCart,
  mapServerCartState,
  syncGuestCartItems,
} from '../services/cartApi.js'
import {
  clearStoredGuestCartItems,
  getStoredGuestCartItems,
  saveStoredGuestCartItems,
} from '../services/cartStorage.js'
import { errorToast } from '../services/toast.js'
import { selectIsAuthenticated } from '../store/authSlice.js'
import { clearCartPricing, replaceServerCart } from '../store/cartSlice.js'

function useCartSessionSync() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const hasLoadedServerCartRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      hasLoadedServerCartRef.current = false
      dispatch(clearCartPricing())
      return undefined
    }

    let isActive = true

    const syncCart = async () => {
      try {
        const guestItems = getStoredGuestCartItems()
        const cartResult = guestItems.length
          ? await syncGuestCartItems(guestItems)
          : { cart: await getCart(), failedItems: [] }

        if (!isActive) {
          return
        }

        dispatch(replaceServerCart(mapServerCartState(cartResult.cart)))
        hasLoadedServerCartRef.current = true

        if (cartResult.failedItems.length === 0) {
          clearStoredGuestCartItems()
        } else {
          saveStoredGuestCartItems(
            cartResult.failedItems.map(({ item }) => item),
          )
          errorToast('Some guest cart items could not be synced.')
        }
      } catch (error) {
        if (!isActive) {
          return
        }

        if (!hasLoadedServerCartRef.current) {
          errorToast(getApiErrorMessage(error))
        }
      }
    }

    syncCart()

    return () => {
      isActive = false
    }
  }, [dispatch, isAuthenticated])
}

export default useCartSessionSync
