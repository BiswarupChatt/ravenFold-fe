import { Box, Button, Container, Stack, Typography } from '@mui/material'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import brandLogo from '../assets/Logo_Main-05.png'
import heroImage from '../assets/hero.png'

function ComingSoon() {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: '#111827',
        color: '#fff',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          backgroundImage: `linear-gradient(90deg, rgba(17, 24, 39, 0.94) 0%, rgba(17, 24, 39, 0.72) 44%, rgba(17, 24, 39, 0.3) 100%), url(${heroImage})`,
          backgroundPosition: { xs: '62% center', md: 'center' },
          backgroundSize: 'cover',
          inset: 0,
          position: 'absolute',
        }}
      />

      <Container
        sx={{
          minHeight: '100vh',
          position: 'relative',
          py: { xs: 4, md: 6 },
        }}
      >
        <Stack
          sx={{
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box
            component="img"
            src={brandLogo}
            alt="Raven Fold"
            sx={{
              display: 'block',
              filter: 'brightness(0) invert(1)',
              height: 42,
              objectFit: 'contain',
              objectPosition: 'left center',
              width: 190,
            }}
          />

          <Stack
            spacing={3}
            sx={{
              justifyContent: 'center',
              maxWidth: 620,
              minHeight: { xs: 'calc(100vh - 170px)', md: 'calc(100vh - 190px)' },
              py: { xs: 8, md: 10 },
            }}
          >
            <Typography
              component="p"
              sx={{
                color: '#f97316',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: 2.2,
                textTransform: 'uppercase',
              }}
            >
              Coming Soon
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.7rem', sm: '3.6rem', md: '5rem' },
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 0.96,
              }}
            >
              Raven Fold
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: { xs: '1.02rem', md: '1.18rem' },
                lineHeight: 1.75,
                maxWidth: 520,
              }}
            >
              A sharper storefront is being prepared. We will be live soon with our carry goods collection.
            </Typography>

            <Button
              href="mailto:support@ravenfold.com"
              startIcon={<MailOutlineRoundedIcon />}
              sx={{
                alignSelf: 'flex-start',
                bgcolor: '#ffffff',
                color: '#111827',
                px: 3,
                py: 1.25,
                '&:hover': {
                  bgcolor: '#f3f4f6',
                },
              }}
              variant="contained"
            >
              Contact Us
            </Button>
          </Stack>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.58)',
              fontSize: '0.9rem',
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
