import { Stack } from '@mui/material'
import AppAccordion from '../../../../../components/AppAccordion.jsx'
import DetailRow from './DetailRow.jsx'

function Details({ attributes = [] }) {
  if (!attributes.length) {
    return null
  }

  return (
    <AppAccordion defaultExpanded title="Product Details">
      <Stack spacing={0.85} sx={{ minWidth: 0 }}>
        {attributes.map((attribute) => (
          <DetailRow
            key={`${attribute.name}-${attribute.value}`}
            label={attribute.name}
            value={attribute.value}
          />
        ))}
      </Stack>
    </AppAccordion>
  )
}

export default Details
