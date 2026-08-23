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
import { fetchProductReviewSummary, fetchProductReviews } from '../../../services/reviewApi.js'
import { errorToast } from '../../../services/toast.js'
import Breadcrumb from './components/Breadcrumb.jsx'
import Gallery from './components/Gallery.jsx'
import Info from './components/Info.jsx'
import ProductReviewsSection from './components/sections/ProductReviewsSection.jsx'

function ProductDetails() {
  const { productIdOrSlug } = useParams()
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [reviewSummary, setReviewSummary] = useState(null)
  const [productReviews, setProductReviews] = useState([])
  const [reviewPagination, setReviewPagination] = useState(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewPage, setReviewPage] = useState(1)
  const [reviewRatingFilter, setReviewRatingFilter] = useState('')
  const pagePaddingY = isDesktop ? 4 : isTab ? 3.5 : 3
  const detailsGridColumns = isDesktop
    ? 'minmax(0, 1.08fr) minmax(0, 0.92fr)'
    : 'minmax(0, 1fr)'
  const detailsGridGap = isDesktop ? 4 : isMobile ? 2.5 : 3

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
        setReviewPage(1)
        setReviewRatingFilter('')
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

  useEffect(() => {
    if (!product?.id) {
      return
    }

    let isActive = true

    const loadReviews = async () => {
      setReviewLoading(true)

      try {
        const [summary, reviewList] = await Promise.all([
          fetchProductReviewSummary(product.id),
          fetchProductReviews(product.id, {
            limit: 5,
            page: reviewPage,
            rating: reviewRatingFilter || undefined,
            sortBy: 'newest',
          }),
        ])

        if (!isActive) {
          return
        }

        setReviewSummary(summary)
        setProductReviews(Array.isArray(reviewList.reviews) ? reviewList.reviews : [])
        setReviewPagination(reviewList.pagination || null)
      } catch (error) {
        if (isActive) {
          errorToast(getApiErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setReviewLoading(false)
        }
      }
    }

    loadReviews()

    return () => {
      isActive = false
    }
  }, [product?.id, reviewPage, reviewRatingFilter])

  return (
    <Box sx={{ overflowX: 'hidden', py: pagePaddingY }}>
      <Container>
        <Stack spacing={2.5}>
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
            <Stack spacing={2.5}>
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

              <ProductReviewsSection
                loading={reviewLoading}
                onPageChange={setReviewPage}
                onRatingFilterChange={(value) => {
                  setReviewRatingFilter(value)
                  setReviewPage(1)
                }}
                page={reviewPage}
                ratingFilter={reviewRatingFilter}
                reviews={productReviews}
                summary={reviewSummary}
                totalPages={Number(reviewPagination?.totalPages || 1)}
              />
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}

export default ProductDetails
