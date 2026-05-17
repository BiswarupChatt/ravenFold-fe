import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useScreenSize from '../hooks/useScreenSize.js'

function NotFound() {
  const { isDesktop, isMobile } = useScreenSize()

  return (
    <Container
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: isDesktop ? 'calc(100vh - 320px)' : 'calc(100vh - 280px)',
        py: isDesktop ? 9 : 6,
      }}
    >
      <Stack
        alignItems="center"
        spacing={2.5}
        sx={{ maxWidth: 640, textAlign: 'center', width: '100%' }}
      >
        <Stack alignItems="center" spacing={2}>

          <Typography color="primary.main" fontWeight={800} variant="h1">
            404
          </Typography>
        </Stack>

        <Typography component="h1" variant="h2">
          This page is not in the fold.
        </Typography>

        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          The address may have changed, the page may have moved, or the link may
          be incomplete.
        </Typography>

        <Stack
          direction={isMobile ? 'column' : 'row'}
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{
            alignSelf: 'center',
            width: isMobile ? '100%' : 'fit-content',
          }}
        >
          <Button
            component={RouterLink}
            sx={{ minWidth: isMobile ? '100%' : 140 }}
            to="/"
            variant="contained"
          >
            Go Home
          </Button>
          <Button
            component={RouterLink}
            sx={{ minWidth: isMobile ? '100%' : 160 }}
            to="/products"
            variant="outlined"
          >
            Browse Products
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default NotFound
