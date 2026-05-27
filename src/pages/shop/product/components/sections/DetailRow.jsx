import { Stack, Typography } from '@mui/material'

function DetailRow({ label, value }) {
  if (!value) {
    return null
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        columnGap: 2,
        flexWrap: 'wrap',
        minWidth: 0,
        rowGap: 0.35,
        width: '100%',
      }}
    >
      <Typography
        color="text.secondary"
        sx={{
          flex: '0 1 40%',
          fontSize: '0.9rem',
          lineHeight: 1.55,
          minWidth: 0,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          flex: '1 1 140px',
          fontSize: '0.9rem',
          fontWeight: 800,
          lineHeight: 1.55,
          maxWidth: '58%',
          minWidth: 0,
          overflowWrap: 'anywhere',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

export default DetailRow
