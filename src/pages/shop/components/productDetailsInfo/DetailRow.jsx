import { Stack, Typography } from '@mui/material'

function DetailRow({ label, value }) {
  if (!value) {
    return null
  }

  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.9rem',
          fontWeight: 800,
          lineHeight: 1.55,
          maxWidth: '58%',
          textAlign: 'right',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

export default DetailRow
