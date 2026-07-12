import { Chip } from '@mui/material'
import { getReviewStatusMeta } from './reviewUtils.js'

function ReviewStatusChip({ status = '' }) {
  const meta = getReviewStatusMeta(status)

  if (!meta.label) {
    return null
  }

  return (
    <Chip
      color={meta.color}
      label={meta.label}
      size="small"
      variant={meta.color === 'default' ? 'outlined' : 'filled'}
    />
  )
}

export default ReviewStatusChip
