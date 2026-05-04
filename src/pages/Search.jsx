import { Container, Paper, Stack, Typography } from '@mui/material'
import { SearchDrawerContent } from '../drawer/SearchDrawer.jsx'
import useScreenSize from '../hooks/useScreenSize.js'

function Search() {
  const { isDesktop } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Paper sx={{ p: isDesktop ? 5 : 3 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h2">Search</Typography>
            <Typography color="text.secondary">
              The drawer and this route share the same search experience.
            </Typography>
          </Stack>

          <SearchDrawerContent />
        </Stack>
      </Paper>
    </Container>
  )
}

export default Search
