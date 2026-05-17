import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import brandLogo from '../../assets/Logo_TextIcon Black.png'
import CartDrawer from '../../drawer/CartDrawer.jsx'
import SearchDrawer from '../../drawer/SearchDrawer.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import NavigationActions from './NavigationActions.jsx'
import NavigationLinks from './NavigationLinks.jsx'

function BrandLogoLink({ onClick, placement = 'desktop' }) {
  const logoHeight = placement === 'drawer' ? 42 : 38
  const logoWidth = placement === 'mobile' ? 172 : 188

  return (
    <Box
      aria-label="Raven Fold home"
      component={NavLink}
      onClick={onClick}
      sx={{
        alignItems: 'center',
        display: 'inline-flex',
        height: logoHeight,
        maxWidth: '100%',
        textDecoration: 'none',
      }}
      to="/"
    >
      <Box
        alt="Raven Fold"
        component="img"
        src={brandLogo}
        sx={{
          display: 'block',
          height: logoHeight,
          objectFit: 'contain',
          objectPosition: 'left center',
          width: logoWidth,
        }}
      />
    </Box>
  )
}

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState(null)
  const { isDesktop } = useScreenSize()

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)
  const closeActiveDrawer = () => setActiveDrawer(null)
  const toggleDrawer = (drawerId) => {
    setActiveDrawer((previousValue) =>
      previousValue === drawerId ? null : drawerId,
    )
  }
  const drawerPaperStyles = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    inset: 0,
    maxHeight: '100vh',
    maxWidth: '100vw',
    p: 3,
    width: '100vw',
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
                  onClick={openDrawer}
                  sx={{
                    color: 'text.primary',
                    height: 44,
                    width: 44,
                  }}
                >
                  <MenuRoundedIcon />
                </IconButton>

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}
                >
                  <BrandLogoLink placement="mobile" />
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          <Drawer
            anchor="left"
            onClose={closeDrawer}
            open={isDrawerOpen}
            slotProps={{
              paper: {
                sx: drawerPaperStyles,
              },
            }}
            sx={{
              '& .MuiDrawer-paper': drawerPaperStyles,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <BrandLogoLink onClick={closeDrawer} placement="drawer" />

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

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <NavigationLinks layout="drawer" onItemClick={closeDrawer} />
            </Box>
          </Drawer>

          {!isDrawerOpen ? (
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
                <Box
                  sx={{ alignItems: 'center', display: 'flex', minWidth: 0 }}
                >
                  <BrandLogoLink />
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

      <SearchDrawer onClose={closeActiveDrawer} open={activeDrawer === 'search'} />
      <CartDrawer onClose={closeActiveDrawer} open={activeDrawer === 'cart'} />
    </>
  )
}

export default Navbar
