import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import AppDrawer from '../../components/AppDrawer.jsx'
import CartDrawer from '../../drawer/CartDrawer.jsx'
import SearchDrawer from '../../drawer/SearchDrawer.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import NavigationActions from './NavigationActions.jsx'
import NavigationLinks from './NavigationLinks.jsx'

function Navbar() {
  const [activeDrawer, setActiveDrawer] = useState(null)
  const { isDesktop } = useScreenSize()
  const { pathname } = useLocation()

  useEffect(() => {
    setActiveDrawer(null)
  }, [pathname])

  const closeDrawer = () => setActiveDrawer(null)
  const toggleDrawer = (drawerId) => {
    setActiveDrawer((previousValue) =>
      previousValue === drawerId ? null : drawerId,
    )
  }
  const brandStyles = {
    color: 'text.primary',
    fontWeight: 800,
    letterSpacing: 0.4,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <>
      {/* Mobile and tablet navbar: hamburger + drawer for links and fixed bottom actions. */}
      {!isDesktop ? (
        <Box>
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
                  onClick={() => toggleDrawer('menu')}
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

          <AppDrawer
            anchor="left"
            description="Browse collections, categories, and supporting pages."
            eyebrow="Navigation"
            onClose={closeDrawer}
            open={activeDrawer === 'menu'}
            title="Explore Raven Fold"
            width={380}
          >
            <Box sx={{ pb: 2 }}>
              <Typography component={NavLink} onClick={closeDrawer} to="/" variant="h6" sx={brandStyles}>
                Raven Fold
              </Typography>
            </Box>
            <NavigationLinks layout="drawer" onItemClick={closeDrawer} />
          </AppDrawer>

          {!activeDrawer || activeDrawer !== 'menu' ? (
            <NavigationActions
              activeDrawer={activeDrawer}
              layout="bottomBar"
              onDrawerAction={toggleDrawer}
            />
          ) : null}
        </Box>
      ) : null}

      {/* Desktop keeps the three-part navbar: brand, links, actions. */}
      {isDesktop ? (
        <Box>
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
                  <NavigationActions
                    activeDrawer={activeDrawer}
                    onDrawerAction={toggleDrawer}
                  />
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </Box>
      ) : null}

      <SearchDrawer onClose={closeDrawer} open={activeDrawer === 'search'} />
      <CartDrawer onClose={closeDrawer} open={activeDrawer === 'cart'} />
    </>
  )
}

export default Navbar
