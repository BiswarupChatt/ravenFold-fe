import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'

const products = [
  { name: 'Structured Tote', price: '$89', category: 'Bags' },
  { name: 'Travel Fold Wallet', price: '$42', category: 'Accessories' },
  { name: 'Everyday Crossbody', price: '$76', category: 'Bags' },
]

function Products() {
  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Products
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Starter product cards wired with MUI components.
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {product.category}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {product.name}
                </Typography>
                <Typography color="secondary.main" sx={{ mt: 2 }} variant="h6">
                  {product.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button fullWidth variant="contained">
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Products
