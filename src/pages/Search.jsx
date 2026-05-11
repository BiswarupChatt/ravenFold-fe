import { Container, Paper, Stack } from '@mui/material'
import PageIntro from '../components/PageIntro.jsx'
import { SearchDrawerContent } from '../drawer/SearchDrawer.jsx'
import useScreenSize from '../hooks/useScreenSize.js'

function Search() {
  const { isDesktop } = useScreenSize()

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Paper sx={{ p: isDesktop ? 5 : 3 }}>
        <Stack spacing={3}>
          <PageIntro
            description="The drawer and this route share the same search experience."
            title="Search"
          />

          <SearchDrawerContent />
        </Stack>
      </Paper>
    </Container>
  )
}

export default Search
