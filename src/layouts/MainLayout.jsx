import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbar.jsx'

function MainLayout() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pb: { xs: 10, sm: 11, md: 0 },
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
