import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import {
  addItem,
  clearCart,
  decreaseItemQuantity,
  removeItem,
  selectCartItems,
  selectCartQuantity,
  selectCartSubtotal,
} from '../store/cartSlice'
import useScreenSize from '../hooks/useScreenSize.js'

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value / 100)

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const quantity = useSelector(selectCartQuantity)
  const subtotal = useSelector(selectCartSubtotal)
  const { isDesktop, isMobile } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Paper sx={{ p: isDesktop ? 5 : 3 }}>
        <Stack spacing={3}>
          <Stack
            alignItems={isMobile ? 'flex-start' : 'center'}
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h2">Cart</Typography>
              <Typography color="text.secondary">
                {quantity} {quantity === 1 ? 'item' : 'items'} managed from the
                global Redux store.
              </Typography>
            </Box>

            {items.length > 0 && (
              <Button color="secondary" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </Button>
            )}
          </Stack>

          {items.length === 0 ? (
            <Stack spacing={2}>
              <Typography color="text.secondary">
                Your cart is empty for now.
              </Typography>
              <Button
                component={RouterLink}
                sx={{ alignSelf: 'flex-start' }}
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
                    p: 2,
                  }}
                  variant="outlined"
                >
                  <Stack
                    alignItems={isDesktop ? 'center' : 'flex-start'}
                    direction={isDesktop ? 'row' : 'column'}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        {item.category}
                      </Typography>
                      <Typography variant="h3">{item.name}</Typography>
                      <Typography color="secondary.main" fontWeight={700}>
                        {formatPrice(item.price)}
                      </Typography>
                    </Box>

                    <Stack alignItems="center" direction="row" spacing={1}>
                      <IconButton
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          dispatch(decreaseItemQuantity(item.id))
                        }
                        size="small"
                      >
                        -
                      </IconButton>
                      <Typography
                        sx={{ minWidth: 28, textAlign: 'center' }}
                        fontWeight={700}
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
                alignItems={isMobile ? 'flex-start' : 'center'}
                direction={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                spacing={2}
              >
                <Typography variant="h3">
                  Subtotal: {formatPrice(subtotal)}
                </Typography>
                <Button component={RouterLink} to="/products" variant="contained">
                  Continue Shopping
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default Cart
