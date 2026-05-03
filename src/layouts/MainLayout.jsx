import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbar.jsx'

function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout
