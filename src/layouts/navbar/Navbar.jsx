import {
  AppBar,
  Badge,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectCartQuantity } from '../../store/cartSlice'
import navbarItems from './navbarItems.js'

function Navbar() {
  const cartQuantity = useSelector(selectCartQuantity)

  return (
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
            {navbarItems.map((item) => (
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
                {item.path === '/cart' ? (
                  <Badge
                    badgeContent={cartQuantity}
                    color="secondary"
                    showZero
                    sx={{ '& .MuiBadge-badge': { right: -14 } }}
                  >
                    {item.label}
                  </Badge>
                ) : (
                  item.label
                )}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
