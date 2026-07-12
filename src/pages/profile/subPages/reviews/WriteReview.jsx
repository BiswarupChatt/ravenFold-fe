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

function WriteReview() {
  const navigate = useNavigate()
  const { orderId = '', orderItemId = '' } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [savingReview, setSavingReview] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadReviewTarget = async () => {
      setLoading(true)
      setPageError('')

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
          setPageError('A review has already been submitted for this item.')
          return
        }

        const eligibleItem = (eligibility.items || []).find((entry) => entry.orderItemId === orderItemId) || null

        if (!eligibleItem?.eligible) {
          setPageError(getEligibilityReasonLabel(eligibleItem?.reason, eligibleItem?.reasonMessage))
          return
        }

        setItem({
          id: eligibleItem.orderItemId,
          productId: eligibleItem.productId,
          productSnapshot: eligibleItem.productSnapshot,
          variantId: eligibleItem.variantId,
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        setPageError(getApiErrorMessage(error))
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    if (!orderId || !orderItemId) {
      setPageError('Invalid review link.')
      setLoading(false)
      return () => {
        isActive = false
      }
    }

    loadReviewTarget()

    return () => {
      isActive = false
    }
  }, [orderId, orderItemId])

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
