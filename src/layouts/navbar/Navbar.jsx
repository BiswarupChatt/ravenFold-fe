import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavigationActions from './NavigationActions.jsx'
import NavigationLinks from './NavigationLinks.jsx'

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const brandStyles = {
    color: 'text.primary',
    fontWeight: 800,
    letterSpacing: 0.4,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <>
      {/* Mobile navbar: hamburger + drawer for links and fixed bottom actions. */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
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
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                minHeight: 80,
              }}
            >
              <IconButton
                aria-label="Open navigation menu"
                color="inherit"
                edge="start"
                onClick={openDrawer}
                sx={{
                  color: 'text.primary',
                  height: 44,
                  width: 44,
                }}
              >
                <MenuRoundedIcon />
              </IconButton>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
                <Typography component={NavLink} to="/" variant="h6" sx={brandStyles}>
                  Raven Fold
                </Typography>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Drawer
          anchor="left"
          onClose={closeDrawer}
          open={isDrawerOpen}
          PaperProps={{
            sx: {
              p: 3,
              width: { xs: '100%', sm: 420 },
            },
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: 1,
              gridTemplateColumns: '48px 1fr 48px',
              mb: 4,
            }}
          >
            <Box />

            <Typography
              component={NavLink}
              onClick={closeDrawer}
              to="/"
              variant="h6"
              sx={{ ...brandStyles, justifySelf: 'center' }}
            >
              Raven Fold
            </Typography>

            <IconButton
              aria-label="Close navigation menu"
              color="inherit"
              onClick={closeDrawer}
              sx={{
                color: 'text.primary',
                height: 44,
                justifySelf: 'end',
                width: 44,
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <NavigationLinks layout="drawer" onItemClick={closeDrawer} />
        </Drawer>

        <NavigationActions layout="bottomBar" />
      </Box>

      {/* Tablet and desktop keep the three-part navbar: brand, links, actions. */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
                columnGap: 3,
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                minHeight: 80,
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', minWidth: 0 }}>
                <Typography component={NavLink} to="/" variant="h6" sx={brandStyles}>
                  Raven Fold
                </Typography>
              </Box>

              <Box sx={{ justifySelf: 'center' }}>
                <NavigationLinks />
              </Box>

              <Box sx={{ justifySelf: 'end' }}>
                <NavigationActions />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </>
  )
}

export default Navbar
