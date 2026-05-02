import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Home() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <Stack spacing={4} sx={{ maxWidth: 720 }}>
          <Typography variant="h1">
            Build a sharper shopping experience.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.15rem' }}>
            A clean MUI and React Router starter for your ecommerce frontend.
            Add categories, product cards, checkout flows, and account pages on
            top of this foundation.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              size="large"
              to="/products"
              variant="contained"
            >
              Browse Products
            </Button>
            <Button
              component={RouterLink}
              size="large"
              to="/cart"
              variant="outlined"
            >
              View Cart
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Home
