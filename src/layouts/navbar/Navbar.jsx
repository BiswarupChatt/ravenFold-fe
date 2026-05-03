import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import NavbarActions from './NavbarActions.jsx'
import NavbarLinks from './NavbarLinks.jsx'

function Navbar() {
  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="sticky"
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Container>
        <Toolbar
          disableGutters
          sx={{
            alignItems: 'center',
            columnGap: { xs: 1.5, md: 3 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
            minHeight: 80,
          }}
        >
          <Box sx={{ alignItems: 'center', display: 'flex', minWidth: 0 }}>
            <Typography
              component={NavLink}
              to="/"
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 800,
                letterSpacing: 0.4,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Raven Fold
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifySelf: 'center' }}>
            <NavbarLinks />
          </Box>

          <Box sx={{ justifySelf: 'end' }}>
            <NavbarActions />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
