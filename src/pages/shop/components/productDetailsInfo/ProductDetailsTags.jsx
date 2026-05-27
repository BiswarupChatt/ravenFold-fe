import { Chip, Stack } from '@mui/material'

function ProductDetailsTags({ tags = [] }) {
  if (!tags.length) {
    return null
  }

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={0.75}
      sx={{
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
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
            flex: '0 1 auto',
            fontWeight: 700,
            height: 'auto',
            maxWidth: '100%',
            minHeight: 26,
            minWidth: 0,
            '& .MuiChip-label': {
              display: 'block',
              overflow: 'visible',
              overflowWrap: 'anywhere',
              textOverflow: 'clip',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            },
          }}
          variant="outlined"
        />
      ))}
    </Stack>
  )
}

export default ProductDetailsTags
