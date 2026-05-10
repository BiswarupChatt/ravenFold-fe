import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import useScreenSize from '../../hooks/useScreenSize.js'

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
  const { isDesktop, isMobile } = useScreenSize()

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
            <Stack
              direction={isMobile ? 'row' : 'column'}
              spacing={1}
              sx={{
                overflowX: isMobile ? 'auto' : 'visible',
                pb: isMobile ? 0.5 : 0,
              }}
            >
              {profileNavItems.map(({ label, to, Icon }) => (
                <Button
                  component={NavLink}
                  end
                  key={to}
                  startIcon={<Icon />}
                  sx={{
                    ...navButtonStyles,
                    flexShrink: 0,
                    minWidth: isMobile ? 132 : 0,
                  }}
                  to={to}
                  variant="outlined"
                >
                  {label}
                </Button>
              ))}
            </Stack>
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
