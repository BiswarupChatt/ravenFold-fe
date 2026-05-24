import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppButton from '../../components/AppButton.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../../services/apiClient.js'
import { getProduct, getProductVariants } from '../../services/productApi.js'
import { errorToast } from '../../services/toast.js'
import ProductDetailsBreadcrumb from './components/ProductDetailsBreadcrumb.jsx'
import ProductDetailsGallery from './components/ProductDetailsGallery.jsx'
import ProductDetailsInfo from './components/ProductDetailsInfo.jsx'

function ProductDetails() {
  const navigate = useNavigate()
  const { productIdOrSlug } = useParams()
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const pagePaddingY = isDesktop ? 8 : isTab ? 6 : 5
  const detailsGridColumns = isDesktop ? '1.08fr 0.92fr' : '1fr'
  const detailsGridGap = isDesktop ? 6 : isMobile ? 3 : 4

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
    <Box sx={{ py: pagePaddingY }}>
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
              <Stack alignItems="flex-start" spacing={1.25} sx={{ width: '100%' }}>
                <AppButton
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackRoundedIcon />}
                  size="small"
                  sx={{
                    alignSelf: 'flex-start',
                    fontSize: '0.85rem',
                    minHeight: 32,
                    px: 0,
                  }}
                  type="button"
                  variant="text"
                >
                  Back
                </AppButton>
                <ProductDetailsBreadcrumb product={product} />
              </Stack>

              <Box
                sx={{
                  alignItems: 'start',
                  display: 'grid',
                  gap: detailsGridGap,
                  gridTemplateColumns: detailsGridColumns,
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
