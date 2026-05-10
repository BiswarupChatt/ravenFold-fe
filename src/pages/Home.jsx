import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useAuthModal from '../hooks/useAuthModal.js'
import useScreenSize from '../hooks/useScreenSize.js'

function Home() {
  const { openLoginModal } = useAuthModal()
  const { isDesktop, isMobile } = useScreenSize()

  return (
    <Box sx={{ py: isDesktop ? 12 : 8 }}>
      <Container>
        <Stack spacing={4} sx={{ maxWidth: 720 }}>
          <Typography variant="h1">
            Build a sharper shopping experience.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.15rem' }}>
            A clean MUI and React Router starter for your ecommerce frontend.
            Add categories, product cards, checkout flows, and account pages on
            top of this foundation.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.15rem' }}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil distinctio accusamus doloremque soluta iusto ex totam delectus suscipit inventore modi. Eius veniam aspernatur, voluptatum eligendi ullam eaque expedita numquam corporis.
            Consequatur itaque numquam consequuntur sed explicabo id tempore odio, ea dignissimos esse ut voluptatum, nulla magnam optio, aliquam praesentium autem veniam repudiandae rem laborum! Ad deserunt consequatur quis ea voluptatem.
            Itaque expedita temporibus magnam nemo possimus nam soluta vero porro blanditiis enim aperiam, incidunt quasi quaerat neque reiciendis, dolore ducimus accusantium id et, asperiores necessitatibus laudantium. Id assumenda nesciunt dolorum.
            Asperiores, incidunt aliquid adipisci aperiam ducimus, error sapiente, eligendi dolorem rerum cupiditate saepe eius voluptate assumenda sit nisi iste dicta fuga doloremque delectus veritatis molestias in voluptatem quo. Possimus, rem.
            Nam porro vitae voluptatibus. Iste rem, unde natus libero blanditiis quos praesentium molestiae enim eaque eius laborum, minima iure placeat consequatur nesciunt, saepe architecto. Ullam ipsa exercitationem necessitatibus eveniet explicabo.
            Tenetur ducimus temporibus, quod quis soluta velit deleniti quaerat accusamus perferendis asperiores quam commodi ipsa distinctio dolore harum eligendi pariatur repellat modi in sequi? Unde, quaerat! Beatae ipsum error enim.
            Omnis suscipit nihil quam ullam dolores excepturi aliquam officia facere? Dolorem blanditiis porro delectus minima ut at id iusto, quos, inventore facere magnam! Iste necessitatibus iure distinctio non officia hic.
            Quasi nisi quo dolore sapiente quaerat, quae tempore illum dolores necessitatibus quam qui! Dolore ea ab, quisquam rem expedita error in qui blanditiis autem eaque sint est nesciunt, soluta saepe?
            Voluptate error dolore minima vel. Voluptas autem asperiores sed animi rerum facere? Nesciunt, impedit! Assumenda nulla qui consequuntur. Suscipit nobis tenetur itaque ducimus cum voluptas sint minus odit sequi officia.
            Commodi amet neque temporibus soluta? Qui unde, enim sunt a voluptatem eum facilis accusamus, id consectetur aliquam sed quis reprehenderit, tenetur excepturi deserunt labore perspiciatis. Reprehenderit eos placeat asperiores aperiam.
            Numquam vitae placeat inventore aperiam ad eveniet blanditiis explicabo, assumenda tempora rerum, officiis asperiores saepe quam aliquid pariatur dolores sit porro nam reiciendis repellat! Laudantium, unde! Cum quasi sed sequi?
            Unde molestiae ab impedit dignissimos enim, explicabo, accusamus modi accusantium voluptatibus ad assumenda natus repellendus qui distinctio voluptatem soluta vel fugiat recusandae a neque! Quod assumenda aliquid obcaecati recusandae. Pariatur.
          </Typography>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
            <Button
              component={RouterLink}
              size="large"
              to="/products"
              variant="contained"
            >
              Browse Products
            </Button>
            <Button
              component={RouterLink}
              size="large"
              to="/cart"
              variant="outlined"
            >
              View Cart
            </Button>
            <Button
              onClick={() => openLoginModal()}
              size="large"
              variant="text"
            >
              Open Login
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Home
