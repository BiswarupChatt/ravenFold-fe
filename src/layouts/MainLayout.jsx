import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import useScreenSize from '../hooks/useScreenSize.js'
import Footer from './footer/Footer.jsx'
import Navbar from './navbar/Navbar.jsx'

function MainLayout() {
  const { isMobile, isTab } = useScreenSize()

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pb: isMobile ? 10 : isTab ? 11 : 0,
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default MainLayout
