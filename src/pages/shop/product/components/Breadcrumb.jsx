import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useResponsiveView from '../../../../hooks/useResponsiveView.js'

function Breadcrumb({ product }) {
  const { isDesktop } = useResponsiveView()

  return (
    <Breadcrumbs
      aria-label="Product path"
      separator="/"
      sx={{
        color: 'text.secondary',
        fontSize: isDesktop ? '1.05rem' : '0.95rem',
        maxWidth: '100%',
        minWidth: 0,
        '& .MuiBreadcrumbs-li': {
          maxWidth: '100%',
          minWidth: 0,
        },
        '& .MuiBreadcrumbs-ol': {
          flexWrap: 'wrap',
          minWidth: 0,
        },
      }}
    >
      <Link color="inherit" component={RouterLink} to="/" underline="hover">
        Home
      </Link>
      <Link color="inherit" component={RouterLink} to="/shop" underline="hover">
        Shop
      </Link>
      <Typography
        color="text.secondary"
        sx={{
          minWidth: 0,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {product?.name || 'product'}
      </Typography>
    </Breadcrumbs>
  )
}

export default Breadcrumb
