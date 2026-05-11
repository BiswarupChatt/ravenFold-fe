import { Button, Container, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import PageIntro from '../components/PageIntro.jsx'
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
        <PageIntro
          description={description}
          eyebrow={eyebrow}
          title={title}
        />

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
