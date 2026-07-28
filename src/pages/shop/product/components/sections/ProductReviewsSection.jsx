import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import {
  Box,
  Divider,
  MenuItem,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AppButton from '../../../../../components/AppButton.jsx'
import { formatReviewDate } from '../../../../profile/subPages/reviews/reviewUtils.js'
import { getImageUrl } from '../utils.js'

const RATING_FILTER_OPTIONS = [
  { label: 'All ratings', value: '' },
  { label: '5 stars', value: '5' },
  { label: '4 stars', value: '4' },
  { label: '3 stars', value: '3' },
  { label: '2 stars', value: '2' },
  { label: '1 star', value: '1' },
]

function DistributionRow({ count = 0, rating = 5, totalReviews = 0 }) {
  const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0

  return (
    <Stack alignItems="center" direction="row" spacing={1.2}>
      <Typography sx={{ minWidth: 44 }}>{rating} star</Typography>
      <Box
        sx={{
          bgcolor: 'rgba(17, 24, 39, 0.08)',
          borderRadius: 999,
          flex: 1,
          height: 8,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            height: '100%',
            width: `${percent}%`,
          }}
        />
      </Box>
      <Typography color="text.secondary" sx={{ minWidth: 48, textAlign: 'right' }}>
        {count}
      </Typography>
    </Stack>
  )
}

function ProductReviewsSection({
  loading = false,
  onPageChange,
  onRatingFilterChange,
  page = 1,
  ratingFilter = '',
  reviews = [],
  summary,
  totalPages = 1,
}) {
  const totalReviews = Number(summary?.totalReviews || 0)
  const averageRating = Number(summary?.averageRating || 0)
  const ratingDistribution = summary?.ratingDistribution || {}

  if (!loading && totalReviews <= 0 && reviews.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: { xs: 2, md: 3 },
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          alignItems={{ md: 'center', xs: 'flex-start' }}
          direction={{ md: 'row', xs: 'column' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h5">Customer reviews</Typography>
          </Box>

          <TextField
            select
            label="Filter"
            onChange={(event) => onRatingFilterChange?.(event.target.value)}
            size="small"
            value={ratingFilter}
            sx={{ minWidth: { md: 180, xs: '100%' } }}
          >
            {RATING_FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack
          direction={{ lg: 'row', xs: 'column' }}
          spacing={3}
          sx={{ alignItems: 'stretch' }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              minWidth: { lg: 240 },
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: '2rem', fontWeight: 800 }}>
              {averageRating.toFixed(1)}
            </Typography>
            <Rating
              emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
              precision={0.1}
              readOnly
              value={averageRating}
            />
            <Typography color="text.secondary" sx={{ mt: 0.7 }}>
              {totalReviews} approved review{totalReviews === 1 ? '' : 's'}
            </Typography>

            <Stack spacing={1.1} sx={{ mt: 2 }}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <DistributionRow
                  count={Number(ratingDistribution?.[rating] || 0)}
                  key={rating}
                  rating={rating}
                  totalReviews={totalReviews}
                />
              ))}
            </Stack>
          </Box>

          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Typography color="text.secondary">Loading reviews...</Typography>
            ) : null}

            {reviews.map((review) => (
              <Box key={review.id}>
                <Stack spacing={1.1}>
                  <Stack
                    alignItems={{ sm: 'center', xs: 'flex-start' }}
                    direction={{ sm: 'row', xs: 'column' }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box>
                      <Rating
                        emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                        readOnly
                        size="small"
                        value={Number(review.rating || 0)}
                      />
                      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                        {review.title || 'Customer review'}
                      </Typography>
                    </Box>

                    <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {review.customer?.displayName || 'Verified customer'} | {formatReviewDate(review.createdAt)}
                    </Typography>
                  </Stack>

                  <Typography color="text.secondary">{review.comment}</Typography>

                  {Array.isArray(review.images) && review.images.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {review.images.map((image) => {
                        const imageUrl = getImageUrl(image)

                        return imageUrl ? (
                        <Box
                          alt="Customer review"
                          component="img"
                          key={imageUrl}
                          src={imageUrl}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1.5,
                            height: 80,
                            objectFit: 'cover',
                            width: 80,
                          }}
                        />
                        ) : null
                      })}
                    </Stack>
                  ) : null}

                  {review.isVerifiedPurchase ? (
                    <Typography color="success.main" sx={{ fontSize: '0.84rem', fontWeight: 700 }}>
                      Verified purchase
                    </Typography>
                  ) : null}
                </Stack>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            {totalPages > 1 ? (
              <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
                <AppButton
                  disabled={page <= 1 || loading}
                  onClick={() => onPageChange?.(page - 1)}
                  type="button"
                  variant="outlined"
                >
                  Previous
                </AppButton>
                <Typography sx={{ alignSelf: 'center' }}>
                  Page {page} of {totalPages}
                </Typography>
                <AppButton
                  disabled={page >= totalPages || loading}
                  onClick={() => onPageChange?.(page + 1)}
                  type="button"
                  variant="outlined"
                >
                  Next
                </AppButton>
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ProductReviewsSection
