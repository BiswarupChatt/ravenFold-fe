import { Stack, Typography } from '@mui/material'
import formatPrice from '../../../../utils/formatPrice.js'

function ProductDetailsPrice({ compareAtPrice, discountAmount, price }) {
  return (
    <Stack spacing={0.85}>
      <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={1.2}>
        <Typography
          sx={{
            color: '#1f2433',
            fontSize: { xs: '2.15rem', md: '2.45rem' },
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          {formatPrice(price)}
        </Typography>

        {discountAmount ? (
          <Typography
            sx={{
              color: '#088a35',
              fontSize: { xs: '1.25rem', md: '1.45rem' },
              fontWeight: 900,
              letterSpacing: 0.4,
              lineHeight: 1,
            }}
          >
            {formatPrice(discountAmount)} OFF
          </Typography>
        ) : null}
      </Stack>

      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
        {compareAtPrice ? (
          <Stack alignItems="baseline" direction="row" spacing={0.55}>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.98rem', md: '1.04rem' },
                fontWeight: 600,
                lineHeight: 1.25,
              }}
            >
              MRP:
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.98rem', md: '1.04rem' },
                fontWeight: 700,
                lineHeight: 1.25,
                opacity: 0.78,
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(compareAtPrice)}
            </Typography>
          </Stack>
        ) : null}

        <Typography
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.98rem', md: '1.04rem' },
            fontWeight: 500,
            lineHeight: 1.25,
            marginLeft: compareAtPrice ? 1 : 0,
          }}
        >
          Inclusive of all Taxes
        </Typography>
      </Stack>
    </Stack>
  )
}

export default ProductDetailsPrice
