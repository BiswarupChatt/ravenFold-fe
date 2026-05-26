import { Chip, Stack } from '@mui/material'

function ProductDetailsTags({ tags = [] }) {
  if (!tags.length) {
    return null
  }

  return (
    <Stack direction="row" flexWrap="wrap" gap={0.75}>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          sx={{
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
            color: 'text.secondary',
            fontWeight: 700,
          }}
          variant="outlined"
        />
      ))}
    </Stack>
  )
}

export default ProductDetailsTags
