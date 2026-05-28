import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import AppButton from '../components/AppButton.jsx'
import AppDrawer from '../components/AppDrawer.jsx'
import CartItemCard from '../components/CartItemCard.jsx'
import useScreenSize from '../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../services/apiClient.js'
import {
  clearCart as clearServerCart,
  mapServerCartItems,
  removeCartItem,
  updateCartItem,
} from '../services/cartApi.js'
import { errorToast } from '../services/toast.js'
import { selectIsAuthenticated } from '../store/authSlice.js'
import {
  addItem,
  clearCart as clearCartItems,
  decreaseItemQuantity,
  removeItem,
  replaceCartItems,
  selectCartItems,
  selectCartQuantity,
  selectCartSubtotal,
} from '../store/cartSlice'
import formatPrice from '../utils/formatPrice.js'

const getItemActionId = (item = {}) => item.id || `${item.productId || ''}:${item.variantId || ''}`

function EmptyCart({ isDrawer, isMobile, onNavigate }) {
  return (
    <Stack
      alignItems={isDrawer || isMobile ? 'stretch' : 'center'}
      spacing={2}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: isDrawer ? 2.25 : 5,
        textAlign: isDrawer || isMobile ? 'left' : 'center',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          alignSelf: isDrawer || isMobile ? 'flex-start' : 'center',
          bgcolor: '#f1ece4',
          borderRadius: '50%',
          display: 'flex',
          height: 58,
          justifyContent: 'center',
          width: 58,
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ color: 'primary.main', fontSize: 30 }} />
      </Box>

      <Stack spacing={0.75}>
        <Typography sx={{ fontSize: '1.08rem', fontWeight: 650 }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary">
          Add a product to start your order.
        </Typography>
      </Stack>

      <AppButton
        component={RouterLink}
        fullWidth={isDrawer || isMobile}
        onClick={onNavigate}
        sx={{ alignSelf: isDrawer || isMobile ? 'stretch' : 'center' }}
        to="/shop"
        variant="contained"
      >
        Continue Shopping
      </AppButton>
    </Stack>
  )
}

function CartSummary({
  disabled,
  isDrawer,
  isMobile,
  onNavigate,
  quantity,
  subtotal,
}) {
  if (!isDrawer) {
    return (
      <Paper
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 20px 56px rgba(15, 23, 42, 0.1)',
          p: { xs: 2.25, md: 2.75 },
        }}
        variant="outlined"
      >
        <Stack spacing={2.4}>
          <Stack spacing={0.5}>
            <Typography sx={{ color: 'text.primary', fontSize: '1.08rem', fontWeight: 650 }}>
              Order Summary
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.92rem', lineHeight: 1.45 }}>
              Review totals before moving to checkout.
            </Typography>
          </Stack>

          <Stack spacing={1.2}>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Items
              </Typography>
              <Typography sx={{ fontWeight: 650 }}>
                {quantity}
              </Typography>
            </Stack>

            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontWeight: 650 }}>
                {formatPrice(subtotal)}
              </Typography>
            </Stack>

            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Shipping
              </Typography>
              <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                Calculated at checkout
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 650 }}>
              Estimated Total
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '1.16rem', fontWeight: 700 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Stack>

          <AppButton
            disabled={disabled}
            fullWidth
            onClick={() => errorToast('Checkout is not available yet.')}
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 2,
              minHeight: 52,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            variant="contained"
          >
            Proceed to Checkout
          </AppButton>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: isDrawer ? 'none' : '0 18px 45px rgba(15, 23, 42, 0.08)',
        p: isDrawer ? 2 : 2.5,
        position: isDrawer || isMobile ? 'static' : 'sticky',
        top: isDrawer || isMobile ? 'auto' : 96,
      }}
      variant="outlined"
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 650 }}>
          Order Summary
        </Typography>

        <Stack spacing={1.1}>
          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              Items
            </Typography>
            <Typography fontWeight={650}>
              {quantity}
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              Subtotal
            </Typography>
            <Typography fontWeight={650}>
              {formatPrice(subtotal)}
            </Typography>
          </Stack>

          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">
              Shipping
            </Typography>
            <Typography color="text.secondary" fontWeight={500}>
              Calculated later
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 650 }}>
            Total
          </Typography>
          <Typography sx={{ color: 'primary.main', fontSize: '1.1rem', fontWeight: 700 }}>
            {formatPrice(subtotal)}
          </Typography>
        </Stack>

        <Typography color="text.secondary" sx={{ fontSize: '0.88rem', lineHeight: 1.45 }}>
          Taxes are included. Shipping is confirmed during checkout.
        </Typography>

        <AppButton
          component={RouterLink}
          disabled={disabled}
          fullWidth
          onClick={onNavigate}
          to="/shop"
          variant="contained"
        >
          Continue Shopping
        </AppButton>
      </Stack>
    </Paper>
  )
}

function CartDrawerContent({ layout = 'page', onNavigate }) {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const quantity = useSelector(selectCartQuantity)
  const subtotal = useSelector(selectCartSubtotal)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { isDesktop, isMobile } = useScreenSize()
  const isDrawer = layout === 'drawer'
  const [clearingCart, setClearingCart] = useState(false)
  const [updatingItemId, setUpdatingItemId] = useState('')
  const isBusy = clearingCart || Boolean(updatingItemId)

  const replaceWithServerCart = (cart) => {
    dispatch(replaceCartItems(mapServerCartItems(cart.items)))
  }

  const runItemAction = async (item, action) => {
    const actionId = getItemActionId(item)

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
        dispatch(decreaseItemQuantity(getItemActionId(item)))
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
        dispatch(removeItem(getItemActionId(item)))
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
      <EmptyCart
        isDrawer={isDrawer}
        isMobile={isMobile}
        onNavigate={onNavigate}
      />
    )
  }

  const itemList = (
    <Stack
      spacing={isDrawer ? 1.5 : 2}
    >
      {items.map((item) => {
        const actionId = getItemActionId(item)

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
      isMobile={isMobile}
      onNavigate={onNavigate}
      quantity={quantity}
      subtotal={subtotal}
    />
  )

  return (
    <>
      {isDrawer ? (
        <Stack spacing={2}>
          <Stack
            alignItems="flex-start"
            direction="column"
            justifyContent="space-between"
            spacing={1.5}
          >
          </Stack>

          {itemList}
          {summary}
        </Stack>
      ) : (
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
      )}
    </>
  )
}

function CartDrawer({ open, onClose }) {
  return (
    <AppDrawer
      onClose={onClose}
      open={open}
      title="Cart"
    >
      <CartDrawerContent layout="drawer" onNavigate={onClose} />
    </AppDrawer>
  )
}

export { CartDrawerContent }
export default CartDrawer
