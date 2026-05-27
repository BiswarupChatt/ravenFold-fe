import { Typography } from '@mui/material'
import AppAccordion from '../../../../components/AppAccordion.jsx'

function ProductDescription({ description = '' }) {
  const visibleDescription = String(description || '').trim()

  if (!visibleDescription) {
    return null
  }

  return (
    <AppAccordion
      defaultExpanded
      title="Product Description"
    >
      <Typography
        color="text.secondary"
        sx={{
          fontSize: '0.95rem',
          lineHeight: 1.65,
          minWidth: 0,
          overflowWrap: 'anywhere',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
        }}
      >
        {visibleDescription}
      </Typography>
    </AppAccordion>
  )
}

export default ProductDescription
