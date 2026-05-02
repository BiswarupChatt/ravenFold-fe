import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Cart', path: '/cart' },
]

function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="sticky"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Container>
          <Toolbar disableGutters sx={{ gap: 3, minHeight: 72 }}>
            <Typography
              component={NavLink}
              to="/"
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 800,
                letterSpacing: 0,
                mr: 'auto',
                textDecoration: 'none',
              }}
            >
              Raven Fold
            </Typography>

            <Stack
              component="nav"
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {navItems.map((item) => (
                <Button
                  component={NavLink}
                  key={item.path}
                  to={item.path}
                  sx={{
                    color: 'text.secondary',
                    '&.active': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
