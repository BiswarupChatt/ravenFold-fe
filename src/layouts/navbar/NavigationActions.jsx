import { Badge, Container, IconButton, Paper, Stack } from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectCartQuantity } from '../../store/cartSlice'
import navigationActions from './navigationActions.js'

const inlineActionButtonStyles = {
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

const bottomBarActionButtonStyles = {
  borderRadius: 999,
  color: 'text.primary',
  height: 46,
  width: 46,
  '&:hover': {
    bgcolor: 'rgba(17, 24, 39, 0.05)',
    color: 'secondary.main',
  },
  '&.active': {
    bgcolor: 'rgba(217, 70, 31, 0.12)',
    color: 'secondary.main',
  },
}

function NavigationActions({ layout = 'inline', onActionClick }) {
  const cartQuantity = useSelector(selectCartQuantity)
  const isBottomBar = layout === 'bottomBar'

  // Reuse the same action items for desktop inline icons and the mobile bottom bar.
  const actionsMarkup = (
    <Stack
      direction="row"
      justifyContent={isBottomBar ? 'center' : 'flex-start'}
      spacing={isBottomBar ? 1.25 : { xs: 0.5, sm: 1 }}
      sx={{ width: isBottomBar ? 'auto' : '100%' }}
    >
      {navigationActions.map(({ label, path, Icon, showBadge }) => (
        <IconButton
          aria-label={label}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
          component={NavLink}
          key={path}
          onClick={onActionClick}
          to={path}
          sx={isBottomBar ? bottomBarActionButtonStyles : inlineActionButtonStyles}
        >
          {showBadge ? (
            <Badge
              badgeContent={cartQuantity !== 0 ? cartQuantity : undefined }
              color="secondary"
              overlap="circular"
              showZero
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 500,
                  transform:'scale(0.85) translate(55%, -45%)'
                   
                },
              }}
            >
              <Icon sx={{ fontSize: isBottomBar ? 25 : 20 }} />
            </Badge>
          ) : (
            <Icon sx={{ fontSize: isBottomBar ? 25 : 20 }} />
          )}
        </IconButton>
      ))}
    </Stack>
  )

  if (isBottomBar) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          bottom: 0,
          left: 0,
          position: 'fixed',
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 0.75 }}>
          {actionsMarkup}
        </Container>
      </Paper>
    )
  }

  return (
    actionsMarkup
  )
}

export default NavigationActions
