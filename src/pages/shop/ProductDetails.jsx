import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppButton from '../../components/AppButton.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../../services/apiClient.js'
import { getProduct, getProductVariants } from '../../services/productApi.js'
import { errorToast } from '../../services/toast.js'

function ProductDetails() {
  const navigate = useNavigate()
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
          <AppButton
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ alignSelf: 'flex-start', px: 0 }}
            type="button"
            variant="text"
          >
            Back
          </AppButton>

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
            <Stack spacing={2}>
              <Typography color="text.secondary" fontWeight={700}>
                {product.category?.name || product.categoryName || 'Product'}
              </Typography>
              <Typography component="h1" variant="h2">
                {product.name}
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                {product.shortDescription || product.description || 'Product details will be added here.'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {variants.length
                  ? `${variants.length} variant${variants.length === 1 ? '' : 's'} loaded`
                  : 'No variants loaded'}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}

export default ProductDetails
