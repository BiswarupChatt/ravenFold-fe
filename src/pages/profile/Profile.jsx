import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import {
  Box,
  ButtonGroup,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import useScreenSize from '../../hooks/useScreenSize.js'
import AppButton from '../../components/AppButton.jsx'

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
]

const navButtonStyles = {
  borderColor: 'divider',
  color: 'text.primary',
  justifyContent: 'flex-start',
  minHeight: 44,
  px: 1.5,
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

  return (
    <Container sx={{ py: isDesktop ? 8 : 5 }}>
      <Stack spacing={4}>
        <Stack spacing={1.25}>
          <Typography
            color="secondary.main"
            fontWeight={700}
            letterSpacing={2}
            textTransform="uppercase"
            variant="overline"
          >
            Account
          </Typography>
          <Typography variant="h2">Profile</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            Manage your personal details, saved addresses, orders, and saved
            pieces from one place.
          </Typography>
        </Stack>

        <Stack
          alignItems="stretch"
          direction={isDesktop ? 'row' : 'column'}
          spacing={3}
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
          </Paper>

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
        </Stack>
      </Stack>
    </Container>
  )
}

export default Profile
