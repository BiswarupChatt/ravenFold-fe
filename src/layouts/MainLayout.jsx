import { Box } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import useScreenSize from '../hooks/useScreenSize.js'
import Footer from './footer/Footer.jsx'
import Navbar from './navbar/Navbar.jsx'

function MainLayout() {
  const { isDesktop } = useScreenSize()
  const { pathname } = useLocation()

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pb: isDesktop ? 0 : 8,
      }}
    >
      <Navbar key={pathname} />

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default MainLayout
