import { Stack, Typography } from '@mui/material'

function ProductDetailsHeader({ category, name }) {
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

      <Typography
        component="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.65rem' },
          fontWeight: 900,
          letterSpacing: 0,
          lineHeight: 1.05,
        }}
      >
        {name}
      </Typography>
    </Stack>
  )
}

export default ProductDetailsHeader
