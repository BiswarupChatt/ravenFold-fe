import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageIntro from '../../../components/PageIntro.jsx'
import useScreenSize from '../../../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../../../services/apiClient.js'
import { getProduct, getProductVariants } from '../../../services/productApi.js'
import { errorToast } from '../../../services/toast.js'
import Breadcrumb from './components/Breadcrumb.jsx'
import Gallery from './components/Gallery.jsx'
import Info from './components/Info.jsx'

function ProductDetails() {
  const { productIdOrSlug } = useParams()
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const pagePaddingY = isDesktop ? 8 : isTab ? 6 : 5
  const detailsGridColumns = isDesktop
    ? 'minmax(0, 1.08fr) minmax(0, 0.92fr)'
    : 'minmax(0, 1fr)'
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
    <Box sx={{ overflowX: 'hidden', py: pagePaddingY }}>
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
              <PageIntro
                showBackButton
                sx={{ width: '100%' }}
              >
                <Breadcrumb product={product} />
              </PageIntro>

              <Box
                sx={{
                  alignItems: 'start',
                  display: 'grid',
                  gap: detailsGridGap,
                  gridTemplateColumns: detailsGridColumns,
                  maxWidth: '100%',
                  minWidth: 0,
                  '& > *': {
                    minWidth: 0,
                  },
                }}
              >
                <Gallery product={product} variants={variants} />
                <Info product={product} variants={variants} />
              </Box>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}

export default ProductDetails
