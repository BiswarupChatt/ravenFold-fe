import { Box, Button, Divider, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import AppDrawer from '../components/AppDrawer.jsx'
import useScreenSize from '../hooks/useScreenSize.js'
import {
  addItem,
  clearCart,
  decreaseItemQuantity,
  removeItem,
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
  const { isDesktop, isMobile } = useScreenSize()
  const isDrawer = layout === 'drawer'

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
          <Button color="secondary" onClick={() => dispatch(clearCart())}>
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
            to="/products"
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
                    onClick={() => dispatch(decreaseItemQuantity(item.id))}
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
                    onClick={() => dispatch(addItem(item))}
                    size="small"
                  >
                    +
                  </IconButton>
                  <Button
                    color="secondary"
                    onClick={() => dispatch(removeItem(item.id))}
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
              to="/products"
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
      eyebrow="Bag"
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
