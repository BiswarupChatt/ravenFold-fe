import { Box, Container, Stack, Typography } from '@mui/material'
import PageIntro from '../../components/PageIntro.jsx'
import { CartDrawerContent } from '../../drawer/CartDrawer.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'



function Cart() {
  const { isDesktop } = useScreenSize()

  return (
    <Box sx={{ py:  5 }}>
      <Container>
        <Stack spacing={4}>
          <Stack
            alignItems={isDesktop ? 'flex-end' : 'flex-start'}
            direction={isDesktop ? 'row' : 'column'}
            justifyContent="space-between"
            spacing={2.5}
          >
            <PageIntro
              eyebrow="Cart"
              sx={{ maxWidth: 640 }}
              title="My Cart"
            />

          </Stack>

          <CartDrawerContent />
        </Stack>
      </Container>
    </Box>
  )
}

export default Cart
