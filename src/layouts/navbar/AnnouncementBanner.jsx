import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { getActiveAnnouncementBanners } from '../../services/announcementBannerApi.js'

const SLIDE_INTERVAL_MS = 5000

const variantStyles = {
  DEFAULT: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
  },
  FESTIVE: {
    bgcolor: '#7f1d1d',
    color: '#fff7ed',
  },
  INFO: {
    bgcolor: '#0f766e',
    color: '#ffffff',
  },
  SALE: {
    bgcolor: 'secondary.main',
    color: 'secondary.contrastText',
  },
  WARNING: {
    bgcolor: '#92400e',
    color: '#fff7ed',
  },
}

const isExternalUrl = (value = '') => /^https?:\/\//i.test(value)

function AnnouncementBanner() {
  const [banners, setBanners] = useState([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    getActiveAnnouncementBanners()
      .then((bannerList) => {
        if (isMounted) {
          setBanners(bannerList)
        }
      })
      .catch(() => {
        if (isMounted) {
          setBanners([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleBanners = useMemo(() => {
    return banners
      .sort((firstBanner, secondBanner) => (
        Number(secondBanner.priority || 0) - Number(firstBanner.priority || 0)
      ))
  }, [banners])

  useEffect(() => {
    if (visibleBanners.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlideIndex((currentIndex) => (
        (currentIndex + 1) % visibleBanners.length
      ))
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [visibleBanners.length])

  const visibleBanner = useMemo(() => {
    if (!visibleBanners.length) {
      return null
    }

    return visibleBanners[currentSlideIndex % visibleBanners.length]
  }, [currentSlideIndex, visibleBanners])

  if (!visibleBanner) {
    return null
  }

  const baseVariantStyle = variantStyles[visibleBanner.variant] || variantStyles.DEFAULT
  const bannerSx = {
    ...baseVariantStyle,
    ...(visibleBanner.backgroundColor
      ? { bgcolor: visibleBanner.backgroundColor }
      : {}),
    ...(visibleBanner.textColor ? { color: visibleBanner.textColor } : {}),
  }
  const ctaUrl = visibleBanner.ctaUrl || ''
  const hasCta = Boolean(visibleBanner.ctaLabel && ctaUrl)
  const ctaProps = isExternalUrl(ctaUrl)
    ? {
        component: 'a',
        href: ctaUrl,
        rel: 'noopener noreferrer',
        target: '_blank',
      }
    : {
        component: NavLink,
        to: ctaUrl || '/',
      }

  return (
    <Box component="section" sx={bannerSx}>
      <Container>
        <Box
          key={visibleBanner.id}
          sx={{
            '@keyframes announcementBannerIn': {
              from: {
                opacity: 0,
                transform: 'translateY(8px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
            alignItems: 'center',
            animation: 'announcementBannerIn 360ms ease both',
            display: 'grid',
            gap: { xs: 1, md: 1.5 },
            gridTemplateColumns: '1fr',
            minHeight: { xs: 52, md: 44 },
            py: { xs: 0.75, md: 0.5 },
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              gap: { xs: 1, md: 1.25 },
              justifyContent: { xs: hasCta ? 'space-between' : 'center', md: 'center' },
              minWidth: 0,
              textAlign: { xs: 'left', md: 'center' },
              width: '100%',
            }}
          >
            <Box
              sx={{
                alignItems: { xs: 'flex-start', md: 'center' },
                display: 'flex',
                flex: { xs: hasCta ? '1 1 auto' : '0 1 auto', md: '0 1 auto' },
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 0.25, md: 1 },
                maxWidth: hasCta ? { xs: 'calc(100% - 112px)', md: '100%' } : '100%',
                minWidth: 0,
              }}
            >
              {visibleBanner.title ? (
                <Typography
                  component="span"
                  sx={{
                    color: 'inherit',
                    fontSize: { xs: '0.78rem', md: '0.86rem' },
                    fontWeight: 800,
                    lineHeight: 1.25,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {visibleBanner.title}
                </Typography>
              ) : null}

              <Typography
                component="span"
                sx={{
                  color: 'inherit',
                  fontSize: { xs: '0.78rem', md: '0.86rem' },
                  fontWeight: 600,
                  lineHeight: 1.25,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'normal', md: 'nowrap' },
                }}
              >
                {visibleBanner.message}
              </Typography>
            </Box>

            {hasCta ? (
              <Button
                {...ctaProps}
                size="small"
                sx={{
                  borderColor: 'currentColor',
                  borderRadius: 999,
                  color: 'inherit',
                  flexShrink: 0,
                  minHeight: 30,
                  px: { xs: 1.4, md: 1.75 },
                  whiteSpace: 'nowrap',
                }}
                variant="outlined"
              >
                {visibleBanner.ctaLabel}
              </Button>
            ) : null}
          </Box>

        </Box>
      </Container>
    </Box>
  )
}

export default AnnouncementBanner
