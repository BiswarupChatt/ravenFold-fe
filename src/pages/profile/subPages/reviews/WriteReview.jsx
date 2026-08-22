import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppButton from '../../../../components/AppButton.jsx'
import { getApiErrorMessage } from '../../../../services/apiClient.js'
import {
  createReview,
  fetchMyReviews,
  fetchReviewEligibility,
} from '../../../../services/reviewApi.js'
import { errorToast, successToast } from '../../../../services/toast.js'
import ProfileIntro from '../../components/ProfileIntro'
import ReviewFormCard from './ReviewFormCard.jsx'
import { getEligibilityReasonLabel } from './reviewUtils.js'

const getReviewRequestKey = (orderId, orderItemId) => `${orderId}:${orderItemId}`

function WriteReview() {
  const navigate = useNavigate()
  const { orderId = '', orderItemId = '' } = useParams()
  const hasValidReviewParams = Boolean(orderId && orderItemId)
  const requestKey = getReviewRequestKey(orderId, orderItemId)
  const [reviewTarget, setReviewTarget] = useState({
    item: null,
    pageError: '',
    requestKey: '',
  })
  const [savingReview, setSavingReview] = useState(false)
  const isCurrentReviewTarget = reviewTarget.requestKey === requestKey
  const item = isCurrentReviewTarget ? reviewTarget.item : null
  const pageError = hasValidReviewParams
    ? (isCurrentReviewTarget ? reviewTarget.pageError : '')
    : 'Invalid review link.'
  const loading = hasValidReviewParams && !isCurrentReviewTarget

  useEffect(() => {
    if (!hasValidReviewParams) {
      return undefined
    }

    let isActive = true

    const loadReviewTarget = async () => {
      try {
        const [eligibility, reviewList] = await Promise.all([
          fetchReviewEligibility({ orderId }),
          fetchMyReviews({ limit: 50, orderId }),
        ])
        const existingReview = (reviewList.items || []).find((review) => review.orderItem?.id === orderItemId) || null

        if (!isActive) {
          return
        }

        if (existingReview) {
          setReviewTarget({
            item: null,
            pageError: 'A review has already been submitted for this item.',
            requestKey,
          })
          return
        }

        const eligibleItem = (eligibility.items || []).find((entry) => entry.orderItemId === orderItemId) || null

        if (!eligibleItem?.eligible) {
          setReviewTarget({
            item: null,
            pageError: getEligibilityReasonLabel(eligibleItem?.reason, eligibleItem?.reasonMessage),
            requestKey,
          })
          return
        }

        setReviewTarget({
          item: {
            id: eligibleItem.orderItemId,
            productId: eligibleItem.productId,
            productSnapshot: eligibleItem.productSnapshot,
            variantId: eligibleItem.variantId,
          },
          pageError: '',
          requestKey,
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        setReviewTarget({
          item: null,
          pageError: getApiErrorMessage(error),
          requestKey,
        })
      }
    }

    loadReviewTarget()

    return () => {
      isActive = false
    }
  }, [hasValidReviewParams, orderId, orderItemId, requestKey])

  const handleSubmit = async (payload) => {
    if (!item) {
      return
    }

    setSavingReview(true)

    try {
      await createReview({
        ...payload,
        orderId,
        orderItemId: item.id,
        productId: item.productId,
        variantId: item.variantId || undefined,
      })
      successToast('Review submitted successfully.')
      navigate('/profile/reviews', { replace: true })
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    } finally {
      setSavingReview(false)
    }
  }

  return (
    <Stack spacing={3}>
      <ProfileIntro
        action={(
          <AppButton
            onClick={() => navigate('/profile/reviews')}
            startIcon={<ArrowBackRoundedIcon />}
            type="button"
            variant="outlined"
          >
            Back to Reviews
          </AppButton>
        )}
        description="Share your feedback for this delivered purchase."
        title="Write Review"
      />

      {loading ? (
        <Stack alignItems="center" direction="row" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading review form...</Typography>
        </Stack>
      ) : null}

      {!loading && pageError ? (
        <Alert severity="error">
          {pageError}
        </Alert>
      ) : null}

      {!loading && !pageError && item ? (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, md: 3 },
          }}
        >
          <ReviewFormCard
            key={item.id}
            item={item}
            onCancel={() => navigate('/profile/reviews')}
            onSubmit={handleSubmit}
            saving={savingReview}
          />
        </Box>
      ) : null}
    </Stack>
  )
}

export default WriteReview
