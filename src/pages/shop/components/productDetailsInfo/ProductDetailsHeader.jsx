import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import useResponsiveView from '../../../../hooks/useResponsiveView.js'

function ProductDetailsHeader({
  category,
  isWishlisted,
  name,
  onToggleWishlist,
}) {
  const { isDesktop } = useResponsiveView()

  return (
    <Stack spacing={1.15}>
      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          {category}
        </Typography>
      </Stack>

      <Stack alignItems="flex-start" direction="row" spacing={1.25}>
        <Typography
          component="h1"
          sx={{
            flex: 1,
            fontSize: isDesktop ? '2.65rem' : '2rem',
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1.05,
            minWidth: 0,
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

export default ProductDetailsHeader
