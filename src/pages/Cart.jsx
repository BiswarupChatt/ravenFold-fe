import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Cart() {
  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={2}>
          <Typography variant="h2">Cart</Typography>
          <Typography color="text.secondary">
            Your cart route is ready. Connect this page to cart state when you
            start building product interactions.
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
      </Paper>
    </Container>
  )
}

export default Cart
