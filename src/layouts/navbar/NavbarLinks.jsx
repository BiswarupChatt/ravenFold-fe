import { Button, Stack } from '@mui/material'
import { NavLink } from 'react-router-dom'
import navbarItems from './navbarItems.js'

function NavbarLinks() {
  return (
    <Stack component="nav" direction="row" spacing={0.5}>
      {navbarItems.map((item) => (
        <Button
          className={({ isActive }) => (isActive ? 'active' : undefined)}
          color="inherit"
          component={NavLink}
          end={item.path === '/'}
          key={item.path}
          to={item.path}
          sx={{
            borderRadius: 999,
            color: 'text.secondary',
            fontSize: '0.9rem',
            fontWeight: 600,
            minWidth: 'auto',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: 'rgba(17, 24, 39, 0.06)',
              color: 'text.primary',
            },
            '&.active': {
              bgcolor: 'rgba(17, 24, 39, 0.08)',
              color: 'primary.main',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  )
}

export default NavbarLinks
