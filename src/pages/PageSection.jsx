import { Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useScreenSize from '../hooks/useScreenSize.js'

function PageSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  const { isDesktop, isMobile } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
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
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            {primaryAction && (
              <Button
                component={RouterLink}
                sx={{ alignSelf: isMobile ? 'stretch' : 'flex-start' }}
                to={primaryAction.to}
                variant="contained"
              >
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                component={RouterLink}
                sx={{ alignSelf: isMobile ? 'stretch' : 'flex-start' }}
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
