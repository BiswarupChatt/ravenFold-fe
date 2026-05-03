import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import useScreenSize from '../hooks/useScreenSize.js'
import { addItem } from '../store/cartSlice'

const products = [
  {
    id: 'structured-tote',
    name: 'Structured Tote',
    price: 8900,
    category: 'Bags',
  },
  {
    id: 'travel-fold-wallet',
    name: 'Travel Fold Wallet',
    price: 4200,
    category: 'Accessories',
  },
  {
    id: 'everyday-crossbody',
    name: 'Everyday Crossbody',
    price: 7600,
    category: 'Bags',
  },
]

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value / 100)

function Products() {
  const dispatch = useDispatch()
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const productGridSize = isMobile ? 12 : isTab ? 6 : 4

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Products
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Starter product cards wired with MUI components.
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.name} size={productGridSize}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {product.category}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1 }}>
                  {product.name}
                </Typography>
                <Typography color="secondary.main" sx={{ mt: 2 }} variant="h6">
                  {formatPrice(product.price)}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  onClick={() => dispatch(addItem(product))}
                  variant="contained"
                >
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
