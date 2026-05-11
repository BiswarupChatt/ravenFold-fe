import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import {
  Box,
  ButtonGroup,
  Container,
  Paper,
  Stack,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useScreenSize from '../../hooks/useScreenSize.js'
import AppButton from '../../components/AppButton.jsx'
import PageIntro from '../../components/PageIntro.jsx'
import { clearStoredAuthSession } from '../../services/authStorage.js'
import { successToast } from '../../services/toast.js'
import { clearAuthSession } from '../../store/authSlice.js'

const profileNavItems = [
  {
    label: 'Info',
    to: '/profile/info',
    Icon: PersonOutlineRoundedIcon,
  },
  {
    label: 'Orders',
    to: '/profile/order',
    Icon: Inventory2OutlinedIcon,
  },
  {
    label: 'Addresses',
    to: '/profile/address',
    Icon: ContactMailOutlinedIcon,
  },
  {
    label: 'Wishlist',
    to: '/profile/wishlist',
    Icon: FavoriteBorderRoundedIcon,
  },
  {
    label: 'Reviews',
    to: '/profile/reviews',
    Icon: FavoriteBorderRoundedIcon,
  },
]

const profileButtonHeight = 44

const navButtonStyles = {
  borderColor: 'divider',
  color: 'text.primary',
  height: profileButtonHeight,
  justifyContent: 'flex-start',
  minHeight: profileButtonHeight,
  px: 1.5,
  whiteSpace: 'nowrap',
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

function Profile() {
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const isCompactNav = isMobile || isTab
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearStoredAuthSession()
    dispatch(clearAuthSession())
    successToast('Logged out successfully.')
    navigate('/', { replace: true })
  }

  return (
    <Container sx={{ py: isDesktop ? 8 : 5 }}>
      <Stack spacing={4}>
        <PageIntro
          description="Manage your personal details, saved addresses, orders, and saved pieces from one place."
          eyebrow="Account"
          sx={{ maxWidth: 680 }}
          title="Profile"
        />

        <Stack
          alignItems="stretch"
          direction={isDesktop ? 'row' : 'column'}
          spacing={3}
          sx={{ width: '100%' }}
        >
          <Paper
            component="aside"
            elevation={0}
            sx={{
              alignSelf: isDesktop ? 'flex-start' : 'stretch',
              border: 1,
              borderColor: 'divider',
              p: 2,
              width: isDesktop ? 260 : '100%',
            }}
          >
            <Box
              sx={{
                display: isCompactNav ? 'flex' : 'block',
                justifyContent: 'flex-start',
                maxWidth: '100%',
                overflowX: isCompactNav ? 'auto' : 'visible',
                pb: isCompactNav ? 0.5 : 0,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <ButtonGroup
                aria-label="Profile sections"
                fullWidth
                orientation={isCompactNav ? 'horizontal' : 'vertical'}
                sx={{
                  display: 'flex',
                  minWidth: '100%',
                  width: isCompactNav ? 'max-content' : '100%',
                  '& .MuiButtonGroup-grouped': {
                    borderColor: 'divider',
                    height: profileButtonHeight,
                  },
                }}
                variant="outlined"
              >
                {profileNavItems.map(({ label, to, Icon }) => (
                  <AppButton
                    component={NavLink}
                    end
                    key={to}
                    startIcon={<Icon />}
                    sx={{
                      ...navButtonStyles,
                      flex: isCompactNav ? '1 0 132px' : 'initial',
                      flexShrink: 0,
                      minWidth: isCompactNav ? 120 : 0,
                      my: isCompactNav ? 0 : 1,
                    }}
                    to={to}
                  >
                    {label}
                  </AppButton>
                ))}
              </ButtonGroup>
            </Box>

            {!isCompactNav ? (
              <AppButton
                fullWidth
                onClick={handleLogout}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  height: profileButtonHeight,
                  minHeight: profileButtonHeight,
                  mt: 2,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: 'rgba(217, 70, 31, 0.08)',
                    borderColor: 'secondary.dark',
                  },
                }}
                type="button"
                variant="outlined"
              >
                Logout
              </AppButton>
            ) : null}
          </Paper>

          <Stack
            spacing={2}
            sx={{
              flex: '1 1 auto',
              minWidth: 0,
              width: '100%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'divider',
                flex: 1,
                minWidth: 0,
                p: isDesktop ? 4 : 2.5,
              }}
            >
              <Outlet />
            </Paper>

            {isCompactNav ? (
              <AppButton
                fullWidth
                onClick={handleLogout}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  height: profileButtonHeight,
                  minHeight: profileButtonHeight,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: 'rgba(217, 70, 31, 0.08)',
                    borderColor: 'secondary.dark',
                  },
                }}
                type="button"
                variant="outlined"
              >
                Logout
              </AppButton>
            ) : undefined}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Profile
