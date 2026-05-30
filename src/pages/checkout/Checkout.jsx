import { Box, Container, Stack, Typography } from '@mui/material'
import PageIntro from '../../components/PageIntro.jsx'

function Checkout() {
  return (
    <Box sx={{ py: 5 }}>
      <Container>
        <Stack spacing={4}>
          <PageIntro
            eyebrow="Checkout"
            title="Checkout"
          />
          <Typography variant="body1">
            Checkout page content goes here.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Checkout
