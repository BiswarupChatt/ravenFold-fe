import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useScreenSize from '../../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../../services/apiClient.js'
import { getProduct, getProductVariants } from '../../services/productApi.js'
import { errorToast } from '../../services/toast.js'
import ProductDetailsBreadcrumb from './components/ProductDetailsBreadcrumb.jsx'
import ProductDetailsGallery from './components/ProductDetailsGallery.jsx'
import ProductDetailsInfo from './components/ProductDetailsInfo.jsx'

function ProductDetails() {
  const { productIdOrSlug } = useParams()
  const { isDesktop } = useScreenSize()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadProductDetails = async () => {
      setLoading(true)
      setPageError('')

      try {
        const productData = await getProduct(productIdOrSlug)
        const variantData = productData.hasVariants
          ? await getProductVariants(productData.id, { limit: 100 })
          : { items: [] }

        if (!isActive) {
          return
        }

        setProduct(productData)
        setVariants(variantData.items)
      } catch (error) {
        if (!isActive) {
          return
        }

        const message = getApiErrorMessage(error)

        setPageError(message)
        errorToast(message)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadProductDetails()

    return () => {
      isActive = false
    }
  }, [productIdOrSlug])

  return (
    <Box sx={{ py: isDesktop ? 8 : 5 }}>
      <Container>
        <Stack spacing={3}>
          {pageError ? (
            <Alert severity="error" sx={{ borderRadius: 1 }}>
              {pageError}
            </Alert>
          ) : null}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : product ? (
            <Stack spacing={4}>
              <ProductDetailsBreadcrumb product={product} />

              <Box
                sx={{
                  display: 'grid',
                  gap: { xs: 4, lg: 6 },
                  gridTemplateColumns: { xs: '1fr', lg: '1.08fr 0.92fr' },
                  alignItems: 'start',
                }}
              >
                <ProductDetailsGallery product={product} variants={variants} />
                <ProductDetailsInfo product={product} variants={variants} />
              </Box>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}

export default ProductDetails
