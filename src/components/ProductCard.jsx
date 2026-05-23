import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
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
          maxHeight: 275,
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

function ProductCard({ product, onAddToCart }) {
  const compareAtPrice = Number(product.compareAtPrice || 0)
  const showComparePrice = compareAtPrice > Number(product.price || 0)
  const discountPercent = showComparePrice
    ? Math.round(((compareAtPrice - Number(product.price || 0)) / compareAtPrice) * 100)
    : 0
  const badgeLabel = product.discountLabel || (discountPercent ? `-${discountPercent}%` : product.badge?.toUpperCase())
  const kicker = product.collection || product.category

  return (
    <Card
      sx={{
        bgcolor: '#fbf7f1',
        borderColor: '#e8ddd0',
        borderRadius: 0,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: { xs: 420, sm: 470, lg: 515 },
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 180ms ease, transform 180ms ease',
        '&:hover': {
          borderColor: '#d8c8b8',
          transform: 'translateY(-3px)',
        },
        '&:hover .product-card-action': {
          opacity: 1,
          transform: 'translate(-50%, 0)',
        },
        '@media (hover: none)': {
          '& .product-card-action': {
            opacity: 1,
            transform: 'translate(-50%, 0)',
          },
        },
      }}
      variant="outlined"
    >
      <Box
        sx={{
          height: { xs: 250, sm: 300, lg: 350 },
          px: { xs: 2, sm: 2.5 },
          pt: { xs: 2.25, sm: 2.75 },
          position: 'relative',
        }}
      >
        {badgeLabel ? (
          <Box
            sx={{
              bgcolor: product.badgeColor || '#a1a600',
              color: '#ffffff',
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              fontWeight: 900,
              left: { xs: 20, sm: 24 },
              lineHeight: 1,
              minWidth: 82,
              px: 1.5,
              py: 0.85,
              position: 'absolute',
              textAlign: 'center',
              top: { xs: 20, sm: 24 },
              zIndex: 3,
            }}
          >
            {badgeLabel}
          </Box>
        ) : null}

        <ProductVisual product={product} />

        <Button
          className="product-card-action"
          onClick={() => onAddToCart?.(product)}
          startIcon={<ShoppingBagOutlinedIcon />}
          variant="contained"
          sx={{
            bottom: 18,
            left: '50%',
            opacity: 0,
            position: 'absolute',
            transform: 'translate(-50%, 8px)',
            transition: 'opacity 180ms ease, transform 180ms ease',
            whiteSpace: 'nowrap',
            zIndex: 4,
          }}
        >
          Quick Add
        </Button>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3 },
          pb: { xs: 2.5, sm: 3 },
          pt: { xs: 1.5, sm: 2 },
          textAlign: 'center',
        }}
      >
        <Stack alignItems="center" spacing={1.05}>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
            {kicker}
          </Typography>

          <Typography
            component="h3"
            sx={{
              color: 'text.primary',
              fontSize: { xs: '1.15rem', sm: '1.25rem' },
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" spacing={1.15} alignItems="baseline" justifyContent="center">
            <Typography sx={{ fontSize: { xs: '1.15rem', sm: '1.25rem' }, fontWeight: 800 }}>
              {formatPrice(product.price)}
            </Typography>

            {showComparePrice ? (
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' }, textDecoration: 'line-through' }}
              >
                {formatPrice(compareAtPrice)}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProductCard
