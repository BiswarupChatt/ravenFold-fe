/*
 * NavigationActions
 *
 * Purpose:
 * - Renders the action icons used by the navbar in two layouts:
 *   `inline` for desktop and `bottomBar` for mobile.
 * - Reuses the same action config from `navigationActions.js` so both layouts
 *   stay in sync.
 *
 * How it works:
 * - Standard navigation actions render as `NavLink` buttons and follow the URL.
 * - Drawer actions (`isDrawer: true`) do not navigate. They call
 *   `onDrawerAction(drawerKey)` instead, where `/cart` becomes `cart`.
 * - The cart badge reads its quantity from Redux through `selectCartQuantity`.
 * - Active styling comes from the current route for links, or from
 *   `activeDrawer` for drawer-based actions like search/cart.
 *
 * Quick edit guide:
 * - Add, remove, or reorder actions in `navigationActions.js`.
 * - Use `isDrawer: true` for actions that should open a drawer instead of a page.
 * - Keep drawer paths aligned with the ids used in `Navbar.jsx`
 *   (`/cart` -> `cart`, `/search` -> `search`).
 * - Update `inlineActionButtonStyles` or `bottomBarActionButtonStyles`
 *   depending on which layout you want to change.
 */
import { Badge, Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { NavLink, matchPath, useLocation } from 'react-router-dom'
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

function getDrawerKey(path) {
  return path?.replace(/^\//, '') ?? ''
}

function isDrawerActionActive(pathname, path, activeDrawer, isDrawer) {
  if (isDrawer && activeDrawer === getDrawerKey(path)) {
    return true
  }

  if (!path) {
    return false
  }

  return Boolean(
    matchPath(
      {
        end: path === '/',
        path,
      },
      pathname,
    ),
  )
}

function NavigationActions({ layout = 'inline', activeDrawer, onDrawerAction }) {
  const cartQuantity = useSelector(selectCartQuantity)
  const { isMobile } = useScreenSize()
  const { pathname } = useLocation()
  const isBottomBar = layout === 'bottomBar'

  const renderActionButton = ({ label, path, isDrawer, Icon, showBadge }) => {
    const drawerKey = getDrawerKey(path)
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
        className={
          isDrawer
            ? isDrawerActionActive(pathname, path, activeDrawer, isDrawer)
              ? 'active'
              : undefined
            : ({ isActive }) => (isActive ? 'active' : undefined)
        }
        component={isDrawer ? 'button' : NavLink}
        onClick={isDrawer ? () => onDrawerAction?.(drawerKey) : undefined}
        sx={isBottomBar ? bottomBarActionButtonStyles : inlineActionButtonStyles}
        to={isDrawer ? undefined : path}
        type={isDrawer ? 'button' : undefined}
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
