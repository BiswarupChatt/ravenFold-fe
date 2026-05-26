import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useResponsiveView from '../../../hooks/useResponsiveView.js'

function ProductDetailsBreadcrumb({ product }) {
  const { isDesktop } = useResponsiveView()

  return (
    <Breadcrumbs
      aria-label="Product path"
      separator="/"
      sx={{
        color: 'text.secondary',
        fontSize: isDesktop ? '1.05rem' : '0.95rem',
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
