import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import useScreenSize from '../hooks/useScreenSize.js'
import Navbar from './navbar/Navbar.jsx'

function MainLayout() {
  const { isMobile, isTab } = useScreenSize()

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pb: isMobile ? 10 : isTab ? 11 : 0,
      }}
    >
      <Navbar />

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
