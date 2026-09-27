import { Box } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import useScreenSize from '../hooks/useScreenSize.js'
import Footer from './footer/Footer.jsx'
import AnnouncementBanner from './navbar/AnnouncementBanner.jsx'
import Navbar from './navbar/Navbar.jsx'
import SiteSettingsProvider from '../context/SiteSettingsProvider.jsx'

function MainLayout() {
  const { isDesktop } = useScreenSize()
  const { pathname } = useLocation()

  return (
    <SiteSettingsProvider>
      <Box
        sx={{
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          pb: isDesktop ? 0 : 8,
        }}
      >
        <AnnouncementBanner />
        <Navbar key={pathname} />

        <Box component="main" sx={{ flex: 1 }}>
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </SiteSettingsProvider>
  )
}

export default MainLayout
