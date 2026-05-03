import { Badge, IconButton, Stack } from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectCartQuantity } from '../../store/cartSlice'
import navbarActions from './navbarActions.js'

const actionButtonStyles = {
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  color: 'text.primary',
  height: 44,
  width: 44,
  '&:hover': {
    bgcolor: 'rgba(17, 24, 39, 0.04)',
    borderColor: 'primary.main',
  },
  '&.active': {
    bgcolor: 'primary.main',
    borderColor: 'primary.main',
    color: 'primary.contrastText',
  },
}

function NavbarActions() {
  const cartQuantity = useSelector(selectCartQuantity)

  return (
    <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
      {navbarActions.map(({ label, path, Icon, showBadge }) => (
        <IconButton
          aria-label={label}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
          component={NavLink}
          key={path}
          to={path}
          sx={actionButtonStyles}
        >
          {showBadge ? (
            <Badge
              badgeContent={cartQuantity}
              color="secondary"
              overlap="circular"
              showZero
              sx={{ '& .MuiBadge-badge': { fontWeight: 700 } }}
            >
              <Icon fontSize="small" />
            </Badge>
          ) : (
            <Icon fontSize="small" />
          )}
        </IconButton>
      ))}
    </Stack>
  )
}

export default NavbarActions
