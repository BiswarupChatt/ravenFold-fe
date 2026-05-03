import { Button, Stack } from '@mui/material'
import { NavLink } from 'react-router-dom'
import navigationItems from './navigationItems.js'

const inlineLinkStyles = {
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
}

const drawerLinkStyles = {
  alignItems: 'flex-start',
  borderBottom: 1,
  borderColor: 'divider',
  borderRadius: 0,
  color: 'text.primary',
  fontSize: '1rem',
  fontWeight: 700,
  justifyContent: 'flex-start',
  px: 0,
  py: 2,
  textAlign: 'left',
  '&:hover': {
    bgcolor: 'transparent',
    color: 'secondary.main',
  },
  '&.active': {
    color: 'secondary.main',
  },
}

function NavigationLinks({ layout = 'inline', onItemClick }) {
  const isDrawerLayout = layout === 'drawer'

  return (
    <Stack
      component="nav"
      direction={isDrawerLayout ? 'column' : 'row'}
      spacing={isDrawerLayout ? 0 : 0.5}
      sx={{ width: isDrawerLayout ? '100%' : 'auto' }}
    >
      {navigationItems.map((item) => (
        <Button
          className={({ isActive }) => (isActive ? 'active' : undefined)}
          color="inherit"
          component={NavLink}
          end={item.path === '/'}
          fullWidth={isDrawerLayout}
          key={item.path}
          onClick={onItemClick}
          to={item.path}
          sx={isDrawerLayout ? drawerLinkStyles : inlineLinkStyles}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  )
}

export default NavigationLinks
