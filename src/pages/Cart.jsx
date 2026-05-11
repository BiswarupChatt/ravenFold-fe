import { Container, Paper, Stack } from '@mui/material'
import PageIntro from '../components/PageIntro.jsx'
import { CartDrawerContent } from '../drawer/CartDrawer.jsx'
import useScreenSize from '../hooks/useScreenSize.js'

function Cart() {
  const { isDesktop } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Paper sx={{ p: isDesktop ? 5 : 3 }}>
        <Stack spacing={3}>
          <PageIntro
            description="The drawer and the page now share the same cart experience."
            title="Cart"
          />

          <CartDrawerContent />
        </Stack>
      </Paper>
    </Container>
  )
}

export default Cart
