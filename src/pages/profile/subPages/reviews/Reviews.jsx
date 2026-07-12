import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppButton from '../../../../components/AppButton.jsx'
import { getApiErrorMessage } from '../../../../services/apiClient.js'
import {
  createReview,
  deleteReview,
  fetchMyReviews,
  fetchReviewEligibility,
  updateReview,
} from '../../../../services/reviewApi.js'
import { errorToast, successToast } from '../../../../services/toast.js'
import ProfileIntro from '../../components/ProfileIntro'
import ReviewFormDialog from './ReviewFormDialog.jsx'
import {
  formatReviewDate,
  getEligibilityReasonLabel,
} from './reviewUtils.js'

function Reviews() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [dialogState, setDialogState] = useState({
    item: null,
    open: false,
    orderId: '',
    review: null,
  })
  const [savingReview, setSavingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState('')

  const loadReviews = useCallback(async () => {
    setLoading(true)
    setPageError('')

    try {
      const response = await fetchMyReviews({ limit: 50 })

      setReviews(Array.isArray(response.items) ? response.items : [])
    } catch (error) {
      setPageError(getApiErrorMessage(error))
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  useEffect(() => {
    const orderId = searchParams.get('orderId') || ''
    const orderItemId = searchParams.get('orderItemId') || ''

    if (!orderId || !orderItemId) {
      return
    }

    let isActive = true

    const openFromQuery = async () => {
      try {
        const [eligibility, reviewList] = await Promise.all([
          fetchReviewEligibility({ orderId }),
          fetchMyReviews({ limit: 50, orderId }),
        ])
        const existingReview = (reviewList.items || []).find((review) => review.orderItem?.id === orderItemId) || null
        const eligibleItem = (eligibility.items || []).find((item) => item.orderItemId === orderItemId) || null

        if (!isActive) {
          return
        }

        if (existingReview) {
          return
        }

        if (eligibleItem?.eligible) {
          setDialogState({
            item: {
              id: eligibleItem.orderItemId,
              productId: eligibleItem.productId,
              productSnapshot: eligibleItem.productSnapshot,
              variantId: eligibleItem.variantId,
            },
            open: true,
            orderId,
            review: null,
          })
          return
        }

        if (eligibleItem?.reason) {
          errorToast(getEligibilityReasonLabel(eligibleItem.reason, eligibleItem.reasonMessage))
        }
      } catch (error) {
        if (isActive) {
          errorToast(getApiErrorMessage(error))
        }
      } finally {
        if (isActive) {
          setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)

            nextParams.delete('orderId')
            nextParams.delete('orderItemId')

            return nextParams
          }, { replace: true })
        }
      }
    }

    openFromQuery()

    return () => {
      isActive = false
    }
  }, [searchParams, setSearchParams])

  const handleCloseDialog = () => {
    setDialogState({
      item: null,
      open: false,
      orderId: '',
      review: null,
    })
  }

  const handleSubmitReview = async (payload) => {
    setSavingReview(true)

    try {
      await createReview({
        ...payload,
        orderId: dialogState.orderId,
        orderItemId: dialogState.item?.id,
        productId: dialogState.item?.productId,
        variantId: dialogState.item?.variantId || undefined,
      })
      successToast('Review submitted successfully.')

      handleCloseDialog()
      await loadReviews()
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setSavingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    setDeletingReviewId(reviewId)

    try {
      await deleteReview(reviewId)
      successToast('Review deleted.')
      await loadReviews()
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setDeletingReviewId('')
    }
  }

  return (
    <Stack spacing={3}>
      <ProfileIntro
        action={(
          <AppButton
            disabled
            startIcon={<RateReviewOutlinedIcon />}
            type="button"
            variant="contained"
          >
            Open from Orders
          </AppButton>
        )}
        description="Ratings and feedback you have shared on purchased products."
        title="Reviews"
      />

      <Divider />

      {pageError ? <Alert severity="error">{pageError}</Alert> : null}

      {loading ? (
        <Stack alignItems="center" direction="row" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading reviews...</Typography>
        </Stack>
      ) : null}

      {!loading && !reviews.length ? (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
          <Typography fontWeight={800}>No reviews yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Delivered order items will let you write reviews from the order details screen.
          </Typography>
        </Box>
      ) : null}

      {!loading ? (
        <Stack spacing={2}>
          {reviews.map((review) => {
            return (
              <Box
                key={review.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack spacing={1.4}>
                  <Stack
                    alignItems={{ sm: 'center', xs: 'flex-start' }}
                    direction={{ sm: 'row', xs: 'column' }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack spacing={0.8}>
                      <Typography fontWeight={800}>
                        {review.product?.name || review.orderItem?.productSnapshot?.name || 'Product'}
                      </Typography>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Rating
                          emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                          readOnly
                          size="small"
                          value={Number(review.rating || 0)}
                        />
                        <Typography color="text.secondary" variant="body2">
                          {formatReviewDate(review.updatedAt || review.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  {review.variant?.label ? (
                    <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {review.variant.label}
                    </Typography>
                  ) : null}

                  <Box>
                    <Typography fontWeight={700}>{review.title || 'Customer review'}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.7 }}>
                      {review.comment}
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                    <IconButton
                      aria-label="Delete review"
                      disabled={deletingReviewId === review.id}
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      ) : null}

      <ReviewFormDialog
        item={dialogState.item}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitReview}
        open={dialogState.open}
        review={dialogState.review}
        saving={savingReview}
      />
    </Stack>
  )
}

export default Reviews
