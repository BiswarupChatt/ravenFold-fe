import { Container, Paper, Stack, Typography } from '@mui/material'
import { CartDrawerContent } from '../drawer/CartDrawer.jsx'
import useScreenSize from '../hooks/useScreenSize.js'

function Cart() {
  const { isDesktop } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Paper sx={{ p: isDesktop ? 5 : 3 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h2">Cart</Typography>
            <Typography color="text.secondary">
              The drawer and the page now share the same cart experience.
            </Typography>
          </Stack>

          <CartDrawerContent />
        </Stack>
      </Paper>
    </Container>
  )
}

export default Cart
