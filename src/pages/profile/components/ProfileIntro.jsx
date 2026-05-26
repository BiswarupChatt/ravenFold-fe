import { Box, Stack, Typography } from '@mui/material'
import useResponsiveView from '../../../hooks/useResponsiveView'

function ProfileIntro({
  title,
  description,
  action,
}) {
  const { isMobile } = useResponsiveView()

  return (
    <Stack
      alignItems={isMobile ? 'stretch' : 'center'}
      direction={isMobile ? 'column' : 'row'}
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
            alignSelf: isMobile ? 'flex-end' : 'center',
            ml: isMobile ? 0 : 'auto',
          }}
        >
          {action}
        </Box>
      ) : null}
    </Stack>
  )
}

export default ProfileIntro
