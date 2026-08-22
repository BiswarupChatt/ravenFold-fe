import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
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
import { getApiErrorMessage } from '../../../../services/apiClient.js'
import {
  deleteReview,
  fetchMyReviews,
} from '../../../../services/reviewApi.js'
import { errorToast, successToast } from '../../../../services/toast.js'
import ProfileIntro from '../../components/ProfileIntro'
import { formatReviewDate } from './reviewUtils.js'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [deletingReviewId, setDeletingReviewId] = useState('')

  const loadReviews = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true)
      setPageError('')
    }

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
    let isActive = true

    const loadInitialReviews = async () => {
      try {
        const response = await fetchMyReviews({ limit: 50 })

        if (!isActive) {
          return
        }

        setReviews(Array.isArray(response.items) ? response.items : [])
      } catch (error) {
        if (!isActive) {
          return
        }

        setPageError(getApiErrorMessage(error))
        setReviews([])
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadInitialReviews()

    return () => {
      isActive = false
    }
  }, [])

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
            Delivered order items will let you open the dedicated review page from your orders or reminder email.
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
    </Stack>
  )
}

export default Reviews
