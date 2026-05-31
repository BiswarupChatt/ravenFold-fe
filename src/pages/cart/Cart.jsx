import { Box, Container, Stack } from '@mui/material'
import PageIntro from '../../components/PageIntro.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import CartContent from './components/CartContent.jsx'

function Cart() {
  const { isDesktop } = useScreenSize()

  return (
    <Box sx={{ py: 5 }}>
      <Container>
        <Stack spacing={4}>
          <Stack
            alignItems={isDesktop ? 'flex-end' : 'flex-start'}
            direction={isDesktop ? 'row' : 'column'}
            justifyContent="space-between"
            spacing={2.5}
          >
            <PageIntro
              sx={{ maxWidth: 640 }}
              title="My Cart"
              showBackButton
            />
          </Stack>

          <CartContent />
        </Stack>
      </Container>
    </Box>
  )
}

export default Cart
