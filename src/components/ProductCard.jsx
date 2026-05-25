import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import formatPrice from '../utils/formatPrice.js'

function ProductVisual({ product }) {
  const productColor = product.color || '#1e2952'

  if (product.image) {
    return (
      <Box
        alt={product.name}
        component="img"
        src={product.image}
        sx={{
          display: 'block',
          height: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          width: '100%',
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        sx={{
          border: '3px solid',
          borderBottom: 0,
          borderColor: productColor,
          borderRadius: '999px 999px 0 0',
          height: '31%',
          position: 'absolute',
          top: '16%',
          width: '31%',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          bgcolor: `${productColor}33`,
          borderRadius: '45% 45% 16px 16px',
          filter: 'blur(18px)',
          height: '45%',
          position: 'absolute',
          top: '30%',
          width: '50%',
        }}
      />
      <Box
        sx={{
          bgcolor: productColor,
          borderRadius: '36% 36% 18px 18px',
          boxShadow: '0 22px 34px rgba(24, 24, 27, 0.18)',
          height: '42%',
          position: 'relative',
          width: '48%',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.24)',
            borderRadius: '0 18px 18px 0',
            height: '78%',
            left: '52%',
            position: 'absolute',
            top: '11%',
            width: '24%',
          }}
        />
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.30)',
            borderRadius: 999,
            height: 12,
            left: '20%',
            position: 'absolute',
            top: '20%',
            width: '45%',
          }}
        />
      </Box>
    </Box>
  )
}

function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onViewProduct,
}) {
  const compareAtPrice = Number(product.compareAtPrice || 0)
  const showComparePrice = compareAtPrice > Number(product.price || 0)
  const discountPercent = showComparePrice
    ? Math.round(((compareAtPrice - Number(product.price || 0)) / compareAtPrice) * 100)
    : 0
  const badgeLabel = product.discountLabel || (discountPercent ? `-${discountPercent}%` : product.badge?.toUpperCase())
  const handleActionClick = (event, action) => {
    event.stopPropagation()
    action?.(product)
  }

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) {
      return
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    onViewProduct?.(product)
  }

  return (
    <Card
      onClick={() => onViewProduct?.(product)}
      onKeyDown={handleCardKeyDown}
      role={onViewProduct ? 'button' : undefined}
      tabIndex={onViewProduct ? 0 : undefined}
      sx={{
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
        cursor: onViewProduct ? 'pointer' : 'default',
        '&:hover': {
          borderColor: 'rgba(24, 24, 27, 0.18)',
          boxShadow: '0 14px 32px rgba(15, 23, 42, 0.12)',
          transform: 'translateY(-3px)',
        },
      }}
      variant="outlined"
    >
      <Box
        sx={{
          alignItems: 'center',
          aspectRatio: '1 / 1',
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 0.75, sm: 1 },
          pt: { xs: 1, sm: 1.25 },
          position: 'relative',
        }}
      >
        {badgeLabel ? (
          <Box
            sx={{
              bgcolor: product.badgeColor || '#a1a600',
              color: '#ffffff',
              fontSize: { xs: '0.68rem', sm: '0.72rem' },
              fontWeight: 900,
              left: { xs: 20, sm: 24 },
              lineHeight: 1,
              minWidth: 48,
              px: 0.8,
              py: 0.6,
              position: 'absolute',
              textAlign: 'center',
              top: { xs: 12, sm: 14 },
              zIndex: 3,
            }}
          >
            {badgeLabel}
          </Box>
        ) : null}

        <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            onClick={(event) => handleActionClick(event, onToggleWishlist)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.86)',
              border: '1px solid rgba(24, 24, 27, 0.08)',
              color: isWishlisted ? 'secondary.main' : 'text.primary',
              height: 36,
              position: 'absolute',
              right: { xs: 16, sm: 20 },
              top: { xs: 12, sm: 14 },
              width: 36,
              zIndex: 4,
              '&:hover': {
                bgcolor: '#ffffff',
                borderColor: isWishlisted ? 'secondary.main' : 'rgba(24, 24, 27, 0.3)',
              },
            }}
          >
            {isWishlisted ? (
              <FavoriteRoundedIcon fontSize="small" />
            ) : (
              <FavoriteBorderRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <ProductVisual product={product} />
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 0.875, sm: 1 },
          pb: { xs: 1.5, sm: 1.75 },
          pt: { xs: 1.25, sm: 1.5 },
          textAlign: 'left',
        }}
      >
        <Stack spacing={0.35} sx={{ width: '100%' }}>
          <Typography
            component="h3"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1rem', sm: '1.05rem' },
              fontWeight: 700,
              lineHeight: 1.3,
              textAlign: 'left',
              width: '100%',
            }}
          >
            {product.name}
          </Typography>

          <Box
            sx={{
              alignItems: 'baseline',
              columnGap: 1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              minHeight: 30,
              rowGap: 0.35,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.35rem' },
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              {formatPrice(product.price)}
            </Typography>

            {showComparePrice ? (
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.88rem', sm: '0.94rem' },
                  fontWeight: 500,
                  lineHeight: 1.15,
                  opacity: 0.55,
                  textDecoration: 'line-through',
                  textDecorationThickness: 1,
                }}
              >
                {formatPrice(compareAtPrice)}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProductCard
