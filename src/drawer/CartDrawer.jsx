import { Box, Button, Divider, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import AppDrawer from '../components/AppDrawer.jsx'
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

function CartDrawerContent({ layout = 'page', onNavigate }) {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const quantity = useSelector(selectCartQuantity)
  const subtotal = useSelector(selectCartSubtotal)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { isDesktop, isMobile } = useScreenSize()
  const isDrawer = layout === 'drawer'

  const replaceWithServerCart = (cart) => {
    dispatch(replaceCartItems(mapServerCartItems(cart.items)))
  }

  const handleClearCart = async () => {
    if (!isAuthenticated) {
      dispatch(clearCartItems())
      return
    }

    try {
      replaceWithServerCart(await clearServerCart())
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }

  const handleDecreaseQuantity = async (item) => {
    if (!isAuthenticated) {
      dispatch(decreaseItemQuantity(item.id))
      return
    }

    try {
      const cart = item.quantity <= 1
        ? await removeCartItem(item.cartItemId)
        : await updateCartItem(item.cartItemId, { quantity: item.quantity - 1 })

      replaceWithServerCart(cart)
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }

  const handleIncreaseQuantity = async (item) => {
    if (!isAuthenticated) {
      dispatch(addItem(item))
      return
    }

    try {
      replaceWithServerCart(
        await updateCartItem(item.cartItemId, { quantity: item.quantity + 1 }),
      )
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }

  const handleRemoveItem = async (item) => {
    if (!isAuthenticated) {
      dispatch(removeItem(item.id))
      return
    }

    try {
      replaceWithServerCart(await removeCartItem(item.cartItemId))
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }

  return (
    <Stack spacing={isDrawer ? 2.5 : 3}>
      <Stack
        alignItems={isDrawer || isMobile ? 'flex-start' : 'center'}
        direction={isDrawer || isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        spacing={2}
      >
        <Typography color="text.secondary">
          {quantity} {quantity === 1 ? 'item' : 'items'} currently in your bag.
        </Typography>

        {items.length > 0 ? (
          <Button color="secondary" onClick={handleClearCart}>
            Clear Cart
          </Button>
        ) : null}
      </Stack>

      {items.length === 0 ? (
        <Stack spacing={2}>
          <Typography color="text.secondary">
            Your cart is empty for now.
          </Typography>
          <Button
            component={RouterLink}
            fullWidth={isDrawer}
            onClick={onNavigate}
            sx={{ alignSelf: isDrawer || isMobile ? 'stretch' : 'flex-start' }}
            to="/shop"
            variant="contained"
          >
            Continue Shopping
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper
              key={item.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                boxShadow: 'none',
                p: isDrawer ? 2 : 2.5,
              }}
              variant="outlined"
            >
              <Stack
                alignItems={isDesktop && !isDrawer ? 'center' : 'flex-start'}
                direction={isDesktop && !isDrawer ? 'row' : 'column'}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {item.category}
                  </Typography>
                  <Typography variant={isDrawer ? 'h6' : 'h3'}>
                    {item.name}
                  </Typography>
                  <Typography color="secondary.main" fontWeight={700}>
                    {formatPrice(item.price)}
                  </Typography>
                </Box>

                <Stack
                  alignItems="center"
                  direction="row"
                  flexWrap="wrap"
                  spacing={1}
                  useFlexGap
                >
                  <IconButton
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => handleDecreaseQuantity(item)}
                    size="small"
                  >
                    -
                  </IconButton>
                  <Typography
                    fontWeight={700}
                    sx={{ minWidth: 28, textAlign: 'center' }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() => handleIncreaseQuantity(item)}
                    size="small"
                  >
                    +
                  </IconButton>
                  <Button
                    color="secondary"
                    onClick={() => handleRemoveItem(item)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}

          <Divider />

          <Stack
            alignItems={isDrawer || isMobile ? 'flex-start' : 'center'}
            direction={isDrawer || isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant={isDrawer ? 'h6' : 'h3'}>
              Subtotal: {formatPrice(subtotal)}
            </Typography>
            <Button
              component={RouterLink}
              fullWidth={isDrawer}
              onClick={onNavigate}
              sx={{ alignSelf: isDrawer || isMobile ? 'stretch' : 'auto' }}
              to="/shop"
              variant="contained"
            >
              Continue Shopping
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

function CartDrawer({ open, onClose }) {
  return (
    <AppDrawer
      description="Review your current items and adjust quantities inline."
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
