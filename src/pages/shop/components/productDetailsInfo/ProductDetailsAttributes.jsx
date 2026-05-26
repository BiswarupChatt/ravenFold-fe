import { Stack, Typography } from '@mui/material'
import DetailRow from './DetailRow.jsx'

function ProductDetailsAttributes({ attributes = [] }) {
  if (!attributes.length) {
    return null
  }

  return (
    <Stack spacing={1.25}>
      <Typography sx={{ fontSize: '0.94rem', fontWeight: 900 }}>
        Product Details
      </Typography>
      <Stack spacing={0.85}>
        {attributes.map((attribute) => (
          <DetailRow
            key={`${attribute.name}-${attribute.value}`}
            label={attribute.name}
            value={attribute.value}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default ProductDetailsAttributes
