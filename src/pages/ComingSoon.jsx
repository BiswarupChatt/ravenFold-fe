import { Box, Button, Container, Stack, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import brandLogo from '../assets/Logo_Main-05.png'

function ComingSoon() {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: '#f6f0e8',
        color: '#191714',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          backgroundPosition: { xs: 'center -28px', md: 'center -64px' },
          backgroundRepeat: 'no-repeat',
          backgroundSize: { xs: '760px auto', sm: '980px auto', md: '1160px auto', lg: '1320px auto' },
          height: '100%',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />

      <Container
        sx={{
          minHeight: '100dvh',
          position: 'relative',
          py: { xs: 3, md: 4 },
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            minHeight: { xs: 'calc(100dvh - 56px)', md: 'calc(100dvh - 72px)' },
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src={brandLogo}
            alt="Raven Fold"
            sx={{
              display: 'block',
              height: { xs: 32, md: 36 },
              objectFit: 'contain',
              objectPosition: 'center',
              width: { xs: 170, md: 198 },
            }}
          />

          <Stack
            spacing={{ xs: 2.1, md: 2.5 }}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: 720,
              mt: { xs: 7, sm: 8, md: 9 },
              width: '100%',
            }}
          >
            <Typography
              component="p"
              sx={{
                borderBottom: '1px solid rgba(25, 23, 20, 0.35)',
                borderTop: '1px solid rgba(25, 23, 20, 0.35)',
                color: '#9a3412',
                fontSize: { xs: '0.7rem', md: '0.76rem' },
                fontWeight: 800,
                letterSpacing: 2.2,
                lineHeight: 1.1,
                px: 0.2,
                py: 0.8,
                textTransform: 'uppercase',
              }}
            >
              Opening Soon
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.35rem', sm: '3.35rem', md: '4.75rem' },
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 0.96,
                maxWidth: 700,
              }}
            >
              Carry Better, Very Soon
            </Typography>

            <Typography
              sx={{
                color: 'rgba(25, 23, 20, 0.72)',
                fontSize: { xs: '0.98rem', md: '1.08rem' },
                lineHeight: 1.65,
                maxWidth: 600,
              }}
            >
              Raven Fold is getting ready to open. Our collection and checkout experience are being finalized before launch.
            </Typography>

            <Button
              href="https://wa.me/917439042753"
              rel="noreferrer"
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: '#191714',
                color: '#ffffff',
                px: 3,
                py: 1.1,
                '&:hover': {
                  bgcolor: '#3a332b',
                },
              }}
              target="_blank"
              variant="contained"
            >
              Contact Us
            </Button>
          </Stack>

          <Typography
            sx={{
              color: 'rgba(25, 23, 20, 0.55)',
              fontSize: '0.9rem',
              mt: 'auto',
              pt: { xs: 5, md: 6 },
            }}
          >
            Copyright {new Date().getFullYear()} Raven Fold. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default ComingSoon
