import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { IconButton, Stack, Tooltip, Typography } from '@mui/material'

function ProductDetailsHeader({
  category,
  isWishlisted,
  name,
  onToggleWishlist,
}) {
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
            fontSize: { xs: '2rem', md: '2.65rem' },
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
              height: { xs: 42, md: 46 },
              mt: { xs: 0.15, md: 0.35 },
              width: { xs: 42, md: 46 },
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
