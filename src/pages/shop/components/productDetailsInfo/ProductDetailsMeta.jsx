import { Stack } from '@mui/material'
import DetailRow from './DetailRow.jsx'

function ProductDetailsMeta({ details = [] }) {
  const visibleDetails = details.filter((detail) => detail?.label && detail?.value)

  if (!visibleDetails.length) {
    return null
  }

  return (
    <Stack
      spacing={1.15}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderTop: '1px solid',
        minWidth: 0,
        py: 2.15,
        width: '100%',
      }}
    >
      {visibleDetails.map((detail) => (
        <DetailRow key={detail.label} label={detail.label} value={detail.value} />
      ))}
    </Stack>
  )
}

export default ProductDetailsMeta
