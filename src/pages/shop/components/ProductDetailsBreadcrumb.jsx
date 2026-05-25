import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function ProductDetailsBreadcrumb({ product }) {
  return (
    <Breadcrumbs
      aria-label="Product path"
      separator="/"
      sx={{
        color: 'text.secondary',
        fontSize: { xs: '0.95rem', md: '1.05rem' },
      }}
    >
      <Link color="inherit" component={RouterLink} to="/" underline="hover">
        Home
      </Link>
      <Link color="inherit" component={RouterLink} to="/shop" underline="hover">
        Shop
      </Link>
      <Typography color="text.secondary">
        {product?.name || 'product'}
      </Typography>
    </Breadcrumbs>
  )
}

export default ProductDetailsBreadcrumb
