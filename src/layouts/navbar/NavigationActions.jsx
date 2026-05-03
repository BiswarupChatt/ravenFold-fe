import { Badge, Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { selectCartQuantity } from '../../store/cartSlice'
import useScreenSize from '../../hooks/useScreenSize.js'
import navigationActions from './navigationActions.js'
import theme from '../../theme.js'

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
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  color: 'text.primary',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
  height: 'auto',
  px: 1,
  py: 0.75,
  width: 72,
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
  const { isMobile } = useScreenSize()
  const isBottomBar = layout === 'bottomBar'

  const renderActionButton = ({ label, path, Icon, showBadge }) => {
    const iconMarkup = showBadge ? (
      <Badge
        badgeContent={cartQuantity !== 0 ? cartQuantity : undefined}
        color="secondary"
        overlap="circular"
        showZero
        sx={{
          '& .MuiBadge-badge': {
            fontWeight: 500,
            transform: 'scale(0.85) translate(55%, -45%)',
          },
        }}
      >
        <Icon sx={{ fontSize: isBottomBar ? 25 : 20 }} />
      </Badge>
    ) : (
      <Icon sx={{ fontSize: isBottomBar ? 25 : 20 }} />
    )

    return (
      <IconButton
        aria-label={label}
        className={({ isActive }) => (isActive ? 'active' : undefined)}
        component={NavLink}
        onClick={onActionClick}
        to={path}
        sx={isBottomBar ? bottomBarActionButtonStyles : inlineActionButtonStyles}
      >
        {iconMarkup}
        {isBottomBar ? (
          <Typography
            component="span"
            sx={{ fontSize: '0.7rem', fontWeight: 500, lineHeight: 1.1 }}
          >
            {label}
          </Typography>
        ) : null}
      </IconButton>
    )
  }

  // Reuse the same action items for desktop inline icons and the mobile bottom bar.
  const actionsMarkup = isBottomBar ? (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${navigationActions.length}, minmax(0, 1fr))`,
        width: '100%',
      }}
    >
      {navigationActions.map((action) => (
        <Box
          key={action.path}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          {renderActionButton(action)}
        </Box>
      ))}
    </Box>
  ) : (
    <Stack direction="row" spacing={isMobile ? 0.5 : 1}>
      {navigationActions.map((action) => (
        <Box key={action.path}>{renderActionButton(action)}</Box>
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
        <Box sx={{ px: 1, py: 0.75 }}>
          {actionsMarkup}
        </Box>
      </Paper>
    )
  }

  return (
    actionsMarkup
  )
}

export default NavigationActions
