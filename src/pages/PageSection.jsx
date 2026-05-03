import { Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function PageSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={3} sx={{ maxWidth: 720 }}>
        {eyebrow && (
          <Typography
            color="secondary.main"
            fontWeight={700}
            letterSpacing={2}
            textTransform="uppercase"
            variant="overline"
          >
            {eyebrow}
          </Typography>
        )}

        <Typography variant="h2">{title}</Typography>

        <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
          {description}
        </Typography>

        {(primaryAction || secondaryAction) && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {primaryAction && (
              <Button
                component={RouterLink}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                to={primaryAction.to}
                variant="contained"
              >
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                component={RouterLink}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                to={secondaryAction.to}
                variant="outlined"
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export default PageSection
