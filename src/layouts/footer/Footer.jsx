import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useScreenSize from '../../hooks/useScreenSize.js'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Products', to: '/products' },
  { label: 'Contacts', to: '/contacts' },
]

const legalLinks = [
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Shipping & Returns', to: '/shipping-and-returns' },
  { label: 'Returns & Refunds', to: '/returns-and-refunds' },
]

const sectionTitleStyles = {
  color: 'primary.contrastText',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 1.8,
  textTransform: 'uppercase',
}

const footerLinkStyles = {
  color: 'rgba(255, 255, 255, 0.72)',
  textDecoration: 'none',
  transition: 'color 160ms ease',
  '&:hover': {
    color: 'secondary.light',
  },
}

function FooterLinkGroup({ title, links }) {
  return (
    <Stack spacing={1.4}>
      <Typography sx={sectionTitleStyles}>{title}</Typography>

      <Stack spacing={1.1}>
        {links.map((link) => (
          <Link
            key={link.to}
            component={RouterLink}
            to={link.to}
            underline="none"
            sx={footerLinkStyles}
          >
            {link.label}
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}

function Footer() {
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const currentYear = new Date().getFullYear()
  const gridTemplateColumns = isDesktop
    ? '1.5fr 1fr 1fr'
    : isTab
      ? 'repeat(2, minmax(0, 1fr))'
      : '1fr'

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        mt: 'auto',
      }}
    >
      <Container sx={{ py: isDesktop ? 7 : 5 }}>
        <Box
          sx={{
            display: 'grid',
            gap: isDesktop ? 4 : 3,
            gridTemplateColumns,
          }}
        >
          <Stack spacing={2.5} sx={{ maxWidth: isDesktop ? 320 : 'none' }}>
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              sx={{
                alignItems: 'center',
                color: 'primary.contrastText',
                display: 'inline-flex',
                gap: 1.5,
                width: 'fit-content',
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: 'secondary.main',
                  borderRadius: 2,
                  color: 'secondary.contrastText',
                  display: 'inline-flex',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  height: 40,
                  justifyContent: 'center',
                  letterSpacing: 0.6,
                  width: 40,
                }}
              >
                RF
              </Box>

              <Typography
                component="span"
                sx={{
                  color: 'inherit',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: 0.4,
                }}
              >
                Raven Fold
              </Typography>
            </Link>

            <Typography sx={{ color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.7 }}>
              Thoughtful carry goods, cleaner shopping flows, and a storefront
              foundation built to feel calm, useful, and easy to trust.
            </Typography>

            <Stack spacing={0.9}>
              <Typography sx={sectionTitleStyles}>Support</Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.72)' }}>
                support@ravenfold.com
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.72)' }}>
                Mon - Sat, 9:00 AM - 6:00 PM
              </Typography>
            </Stack>
          </Stack>

          <FooterLinkGroup links={quickLinks} title="Quick Links" />
          <FooterLinkGroup links={legalLinks} title="Legal" />
        </Box>

        <Divider
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.14)',
            my: isDesktop ? 4 : 3,
          }}
        />

        <Stack
          alignItems={isMobile ? 'flex-start' : 'center'}
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.58)' }}>
            Copyright {currentYear} Raven Fold. All rights reserved.
          </Typography>

          <Typography sx={{ color: 'rgba(255, 255, 255, 0.58)' }}>
            Designed for a cleaner commerce experience.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
