import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import useResponsiveView from '../../../../../hooks/useResponsiveView.js'

function Header({
  category,
  isWishlisted,
  name,
  onToggleWishlist,
}) {
  const { isDesktop, isMobile } = useResponsiveView()

  return (
    <Stack spacing={1.15} sx={{ minWidth: 0, width: '100%' }}>
      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1} sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: 0.8,
            minWidth: 0,
            overflowWrap: 'anywhere',
            textTransform: 'uppercase',
            wordBreak: 'break-word',
          }}
        >
          {category}
        </Typography>
      </Stack>

      <Stack alignItems="flex-start" direction="row" spacing={1.25} sx={{ minWidth: 0, width: '100%' }}>
        <Typography
          component="h1"
          sx={{
            flex: 1,
            fontSize: isDesktop ? '2.65rem' : isMobile ? '1.75rem' : '2rem',
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1.05,
            minWidth: 0,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          }}
        >
          {name}
        </Typography>

        <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={onToggleWishlist}
            sx={{
              color: isWishlisted ? 'secondary.main' : 'text.primary',
              flexShrink: 0,
              height: isDesktop ? 46 : 42,
              mt: isDesktop ? 0.35 : 0.15,
              width: isDesktop ? 46 : 42,
            }}
          >
            {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}

export default Header
