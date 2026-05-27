import { Stack, Typography } from '@mui/material'
import useResponsiveView from '../../../../hooks/useResponsiveView.js'
import formatPrice from '../../../../utils/formatPrice.js'

function ProductDetailsPrice({ compareAtPrice, discountAmount, price }) {
  const { isDesktop } = useResponsiveView()

  return (
    <Stack spacing={0.85} sx={{ minWidth: 0, width: '100%' }}>
      <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={1.2} sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: '#1f2433',
            fontSize: isDesktop ? '2.45rem' : '2.15rem',
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1,
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          {formatPrice(price)}
        </Typography>

        {discountAmount ? (
          <Typography
            sx={{
              color: '#088a35',
              fontSize: isDesktop ? '1.45rem' : '1.25rem',
              fontWeight: 900,
              letterSpacing: 0.4,
              lineHeight: 1,
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {formatPrice(discountAmount)} OFF
          </Typography>
        ) : null}
      </Stack>

      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1} sx={{ minWidth: 0 }}>
        {compareAtPrice ? (
          <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={0.55} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: isDesktop ? '1.04rem' : '0.98rem',
                fontWeight: 600,
                lineHeight: 1.25,
                minWidth: 0,
              }}
            >
              MRP:
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: isDesktop ? '1.04rem' : '0.98rem',
                fontWeight: 700,
                lineHeight: 1.25,
                minWidth: 0,
                overflowWrap: 'anywhere',
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
            fontSize: isDesktop ? '1.04rem' : '0.98rem',
            fontWeight: 500,
            lineHeight: 1.25,
            marginLeft: compareAtPrice ? 1 : 0,
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          Inclusive of all Taxes
        </Typography>
      </Stack>
    </Stack>
  )
}

export default ProductDetailsPrice
