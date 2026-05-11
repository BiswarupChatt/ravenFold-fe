import { Box, Stack, Typography } from '@mui/material'

function ProfileIntro({
  title,
  description,
  action,
}) {
  return (
    <Stack
      alignItems={{ xs: 'stretch', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h3">{title}</Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {description}
          </Typography>
        ) : null}
      </Box>

      {action ? (
        <Box
          sx={{
            alignSelf: { xs: 'flex-end', sm: 'center' },
            ml: { sm: 'auto' },
          }}
        >
          {action}
        </Box>
      ) : null}
    </Stack>
  )
}

export default ProfileIntro
