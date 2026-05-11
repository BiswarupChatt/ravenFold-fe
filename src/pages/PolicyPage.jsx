import { Container, Divider, Paper, Stack, Typography } from '@mui/material'
import PageIntro from '../components/PageIntro.jsx'
import useScreenSize from '../hooks/useScreenSize.js'

function PolicyPage({ eyebrow, title, intro, sections }) {
  const { isDesktop } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Stack spacing={3}>
        <PageIntro
          description={intro}
          eyebrow={eyebrow}
          spacing={2}
          sx={{ maxWidth: 780 }}
          title={title}
        />

        <Paper sx={{ p: isDesktop ? 5 : 3 }} variant="outlined">
          <Stack divider={<Divider flexItem />} spacing={3}>
            {sections.map((section) => (
              <Stack key={section.heading} spacing={1.25}>
                <Typography variant="h3">{section.heading}</Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {section.body}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default PolicyPage
