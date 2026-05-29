import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useScreenSize from '../../../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../../../services/apiClient.js'
import {
  mapServerCartItems,
  removeCartItem,
  updateCartItem,
} from '../../../services/cartApi.js'
import { errorToast } from '../../../services/toast.js'
import { selectIsAuthenticated } from '../../../store/authSlice.js'
import {
  addItem,
  decreaseItemQuantity,
  removeItem,
  replaceCartItems,
  selectCartItems,
  selectCartSubtotal,
} from '../../../store/cartSlice'
import { getCartItemActionId } from '../../../utils/utils.js'
import CartEmptyState from './CartEmptyState.jsx'
import CartItemCard from './CartItemCard.jsx'
import CartSummary from './CartSummary.jsx'

function CartContent({ layout = 'page', onNavigate }) {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { isDesktop, isMobile } = useScreenSize()
  const isDrawer = layout === 'drawer'
  const [updatingItemId, setUpdatingItemId] = useState('')
  const isBusy = Boolean(updatingItemId)

  const replaceWithServerCart = (cart) => {
    dispatch(replaceCartItems(mapServerCartItems(cart.items)))
  }

  const runItemAction = async (item, action) => {
    const actionId = getCartItemActionId(item)

    setUpdatingItemId(actionId)

    try {
      await action()
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setUpdatingItemId('')
    }
  }

  const handleDecreaseQuantity = (item) => {
    runItemAction(item, async () => {
      if (!isAuthenticated) {
        dispatch(decreaseItemQuantity(getCartItemActionId(item)))
        return
      }

      if (!item.cartItemId) {
        throw new Error('Unable to update this cart item.')
      }

      const cart = item.quantity <= 1
        ? await removeCartItem(item.cartItemId)
        : await updateCartItem(item.cartItemId, { quantity: item.quantity - 1 })

      replaceWithServerCart(cart)
    })
  }

  const handleIncreaseQuantity = (item) => {
    runItemAction(item, async () => {
      if (!isAuthenticated) {
        dispatch(addItem({ ...item, quantity: 1 }))
        return
      }

      if (!item.cartItemId) {
        throw new Error('Unable to update this cart item.')
      }

      replaceWithServerCart(
        await updateCartItem(item.cartItemId, { quantity: item.quantity + 1 }),
      )
    })
  }

  const handleRemoveItem = (item) => {
    runItemAction(item, async () => {
      if (!isAuthenticated) {
        dispatch(removeItem(getCartItemActionId(item)))
        return
      }

      if (!item.cartItemId) {
        throw new Error('Unable to remove this cart item.')
      }

      replaceWithServerCart(await removeCartItem(item.cartItemId))
    })
  }

  if (items.length === 0) {
    return (
      <CartEmptyState
        isDrawer={isDrawer}
        isMobile={isMobile}
        onNavigate={onNavigate}
      />
    )
  }

  const itemList = (
    <Stack spacing={isDrawer ? 1.5 : 2}>
      {items.map((item) => {
        const actionId = getCartItemActionId(item)

        return (
          <CartItemCard
            disabled={isBusy}
            isDesktop={isDesktop}
            isDrawer={isDrawer}
            item={item}
            key={actionId}
            loading={updatingItemId === actionId}
            onDecrease={handleDecreaseQuantity}
            onIncrease={handleIncreaseQuantity}
            onRemove={handleRemoveItem}
          />
        )
      })}
    </Stack>
  )

  const summary = (
    <CartSummary
      disabled={isBusy}
      isDrawer={isDrawer}
      items={items}
      onNavigate={onNavigate}
      subtotal={subtotal}
    />
  )

  if (isDrawer) {
    return (
      <Stack
        spacing={1.5}
        sx={{
          flex: 1,
          height: '100%',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            mr: -0.75,
            overflowY: 'auto',
            pb: 1.25,
            pr: 0.75,
          }}
        >
          {itemList}
        </Box>

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            mx: -0.5,
            px: 0.5,
            position: 'relative',
            pt: 0.75,
          }}
        >
          {summary}
        </Box>
      </Stack>
    )
  }

  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: isDesktop ? 3 : 2.5,
        gridTemplateColumns: isDesktop ? 'minmax(0, 1fr) minmax(300px, 360px)' : '1fr',
      }}
    >
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {itemList}
      </Stack>

      <Stack sx={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 96 }}>
        {summary}
      </Stack>
    </Box>
  )
}

export default CartContent
