import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { Box, Stack, Typography } from '@mui/material'
import formatPrice from '../../../utils/formatPrice.js'
import ProductDetailsOptions from './ProductDetailsOptions.jsx'

const getProductPrice = (product) => {
  const basePrice = Number(product?.basePrice || 0)
  const salePrice = product?.salePrice === null || product?.salePrice === undefined
    ? null
    : Number(product.salePrice)

  return {
    compareAtPrice: salePrice !== null && salePrice < basePrice ? basePrice : 0,
    price: salePrice !== null && salePrice < basePrice ? salePrice : basePrice,
  }
}

function ProductDetailsInfo({ product, variants }) {
  const category = product.category?.name || product.categoryName || 'Product'
  const description = product.shortDescription || product.description || ''
  const { compareAtPrice, price } = getProductPrice(product)

  return (
    <Stack spacing={3.25} sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
      <Stack spacing={1.4}>
        <Typography color="text.secondary" sx={{ fontSize: '1.15rem' }}>
          {category}
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2.2rem', md: '3rem' },
            fontWeight: 800,
            letterSpacing: 0,
            lineHeight: 1.05,
          }}
        >
          {product.name}
        </Typography>

        <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1.5}>
          <Stack direction="row" spacing={0.1}>
            {Array.from({ length: 5 }).map((_, index) => (
              <StarRoundedIcon key={index} sx={{ fontSize: 22 }} />
            ))}
          </Stack>

          <Typography color="text.secondary">4.75</Typography>
          <Typography color="text.secondary">(1 review)</Typography>

        </Stack>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="baseline">
        <Typography sx={{ fontSize: '1.9rem', fontWeight: 800 }}>
          {formatPrice(price)}
        </Typography>
        {compareAtPrice ? (
          <Typography
            color="text.secondary"
            sx={{ fontSize: '1.05rem', textDecoration: 'line-through' }}
          >
            {formatPrice(compareAtPrice)}
          </Typography>
        ) : null}
      </Stack>

      {description ? (
        <Typography
          color="text.secondary"
          sx={{ fontSize: '1.1rem', lineHeight: 1.65, maxWidth: 620 }}
        >
          {description}{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>
            Read More..
          </Box>
        </Typography>
      ) : null}

      <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.55)',
          borderRadius: 999,
          display: 'inline-flex',
          gap: 1,
          px: 2,
          py: 1,
          width: 'fit-content',
        }}
      >
      
      </Box>

      <ProductDetailsOptions variants={variants} />
    </Stack>
  )
}

export default ProductDetailsInfo
