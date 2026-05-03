import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import { Box, Button, Collapse, Menu, MenuItem, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { NavLink, matchPath, useLocation } from 'react-router-dom'
import navigationItems from './navigationItems.js'
import theme from '../../theme.js'

const inlineLinkStyles = {
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

const inlineActiveStyles = {
  bgcolor: 'rgba(17, 24, 39, 0.08)',
  color: 'primary.main',
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
  py: 1,
  textAlign: 'left',
  '&:hover': {
    bgcolor: 'transparent',
    color: 'secondary.main',
  },
  '&.active': {
    color: 'secondary.main',
  },
}

const drawerNestedLinkStyles = {
  fontSize: '0.95rem',
  fontWeight: 600,
}

const menuPaperStyles = {
  borderRadius: theme.shape.borderRadius,
  minWidth: 220,
  mt: 1,
}

const nestedMenuPaperStyles = {
  borderRadius: theme.shape.borderRadius,
  minWidth: 220,
}

function hasChildren(item) {
  return Array.isArray(item.children) && item.children.length > 0
}

function normalizePath(path) {
  if (!path) {
    return ''
  }

  if (path === '/') {
    return path
  }

  return path.startsWith('/') ? path : `/${path}`
}

function resolvePath(path, fallbackPath = '/') {
  return normalizePath(path) || fallbackPath
}

function isPathActive(pathname, path) {
  const normalizedPath = normalizePath(path)

  if (!normalizedPath) {
    return false
  }

  return Boolean(
    matchPath(
      {
        end: normalizedPath === '/',
        path: normalizedPath,
      },
      pathname,
    ),
  )
}

function isItemActive(item, pathname) {
  if (isPathActive(pathname, item.path)) {
    return true
  }

  return (item.children ?? []).some((child) => isItemActive(child, pathname))
}

function getDropdownItems(item) {
  if (!hasChildren(item)) {
    return []
  }

  if (!item.path) {
    return item.children
  }

  return [{ label: `All ${item.label}`, path: item.path }, ...item.children]
}

function getItemKey(item, depth, index) {
  return `${depth}-${item.path ?? item.label}-${index}`
}

function InlineLeafLink({ item, pathname, onItemClick }) {
  const isActive = isItemActive(item, pathname)

  return (
    <Button
      color="inherit"
      component={NavLink}
      end={resolvePath(item.path) === '/'}
      onClick={onItemClick}
      sx={[inlineLinkStyles, isActive ? inlineActiveStyles : null]}
      to={resolvePath(item.path)}
    >
      {item.label}
    </Button>
  )
}

function InlineMenuLeaf({ item, pathname, onItemClick, onCloseBranch }) {
  const isActive = isItemActive(item, pathname)

  const handleClick = () => {
    onCloseBranch?.()
    onItemClick?.()
  }

  return (
    <MenuItem
      component={NavLink}
      onClick={handleClick}
      selected={isActive}
      to={resolvePath(item.path)}
    >
      {item.label}
    </MenuItem>
  )
}

function InlineDropdownItem({ item, depth = 0, pathname, onItemClick, onCloseBranch }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = Boolean(anchorEl)
  const isActive = isItemActive(item, pathname)
  const dropdownItems = getDropdownItems(item)

  const handleOpen = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseBranch = () => {
    handleClose()
    onCloseBranch?.()
  }

  return (
    <>
      {depth === 0 ? (
        <Button
          color="inherit"
          endIcon={
            <KeyboardArrowDownRoundedIcon
              sx={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 160ms ease',
              }}
            />
          }
          onClick={handleOpen}
          sx={[inlineLinkStyles, isActive || isOpen ? inlineActiveStyles : null]}
        >
          {item.label}
        </Button>
      ) : (
        <MenuItem
          onClick={handleOpen}
          selected={isActive || isOpen}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box component="span">{item.label}</Box>
          <KeyboardArrowRightRoundedIcon fontSize="small" />
        </MenuItem>
      )}

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={
          depth === 0
            ? { horizontal: 'left', vertical: 'bottom' }
            : { horizontal: 'right', vertical: 'top' }
        }
        onClose={handleClose}
        open={isOpen}
        slotProps={{
          list: {
            dense: depth > 0,
          },
          paper: {
            sx: depth === 0 ? menuPaperStyles : nestedMenuPaperStyles,
          },
        }}
        transformOrigin={
          depth === 0
            ? { horizontal: 'left', vertical: 'top' }
            : { horizontal: 'left', vertical: 'top' }
        }
      >
        {dropdownItems.map((child, index) =>
          hasChildren(child) ? (
            <InlineDropdownItem
              item={child}
              key={getItemKey(child, depth + 1, index)}
              depth={depth + 1}
              onCloseBranch={handleCloseBranch}
              onItemClick={onItemClick}
              pathname={pathname}
            />
          ) : (
            <InlineMenuLeaf
              item={child}
              key={getItemKey(child, depth + 1, index)}
              onCloseBranch={handleCloseBranch}
              onItemClick={onItemClick}
              pathname={pathname}
            />
          ),
        )}
      </Menu>
    </>
  )
}

function DrawerLeafLink({ item, depth, pathname, onItemClick }) {
  const isActive = isItemActive(item, pathname)

  return (
    <Button
      color="inherit"
      component={NavLink}
      fullWidth
      onClick={onItemClick}
      sx={[
        drawerLinkStyles,
        depth > 0 ? drawerNestedLinkStyles : null,
        isActive ? { color: 'secondary.main' } : null,
        { pl: depth * 2 },
      ]}
      to={resolvePath(item.path)}
    >
      {item.label}
    </Button>
  )
}

function DrawerDropdownItem({ item, depth = 0, pathname, onItemClick }) {
  const isActive = isItemActive(item, pathname)
  const [isOpen, setIsOpen] = useState(isActive)
  const dropdownItems = getDropdownItems(item)

  useEffect(() => {
    if (isActive) {
      setIsOpen(true)
    }
  }, [isActive])

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        color="inherit"
        endIcon={isOpen ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        fullWidth
        onClick={() => setIsOpen((previousValue) => !previousValue)}
        sx={[
          drawerLinkStyles,
          depth > 0 ? drawerNestedLinkStyles : null,
          isActive ? { color: 'secondary.main' } : null,
          { pl: depth * 2 },
        ]}
      >
        {item.label}
      </Button>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Stack sx={{ pl: 2, width: '100%' }}>
          {dropdownItems.map((child, index) =>
            hasChildren(child) ? (
              <DrawerDropdownItem
                item={child}
                key={getItemKey(child, depth + 1, index)}
                depth={depth + 1}
                onItemClick={onItemClick}
                pathname={pathname}
              />
            ) : (
              <DrawerLeafLink
                item={child}
                key={getItemKey(child, depth + 1, index)}
                depth={depth + 1}
                onItemClick={onItemClick}
                pathname={pathname}
              />
            ),
          )}
        </Stack>
      </Collapse>
    </Box>
  )
}

function NavigationLinks({ items = navigationItems, layout = 'inline', onItemClick }) {
  const isDrawerLayout = layout === 'drawer'
  const { pathname } = useLocation()

  return (
    <Stack
      component="nav"
      direction={isDrawerLayout ? 'column' : 'row'}
      spacing={isDrawerLayout ? 0.5 : 0.5}
      sx={{ width: isDrawerLayout ? '100%' : 'auto' }}
    >
      {items.map((item, index) =>
        hasChildren(item) ? (
          isDrawerLayout ? (
            <DrawerDropdownItem
              item={item}
              key={getItemKey(item, 0, index)}
              onItemClick={onItemClick}
              pathname={pathname}
            />
          ) : (
            <InlineDropdownItem
              item={item}
              key={getItemKey(item, 0, index)}
              onItemClick={onItemClick}
              pathname={pathname}
            />
          )
        ) : isDrawerLayout ? (
          <DrawerLeafLink
            item={item}
            key={getItemKey(item, 0, index)}
            depth={0}
            onItemClick={onItemClick}
            pathname={pathname}
          />
        ) : (
          <InlineLeafLink
            item={item}
            key={getItemKey(item, 0, index)}
            onItemClick={onItemClick}
            pathname={pathname}
          />
        ),
      )}
    </Stack>
  )
}

export default NavigationLinks
