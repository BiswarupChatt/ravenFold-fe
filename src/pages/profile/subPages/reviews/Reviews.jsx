import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import { Box, Button, Chip, Divider, Rating, Stack, Typography } from '@mui/material'
import useResponsiveView from '../../../../hooks/useResponsiveView'
import ProfileIntro from '../../components/ProfileIntro'

const reviews = [
  {
    id: 'linen-overshirt-review',
    product: 'Linen Overshirt',
    date: 'May 06, 2026',
    rating: 5,
    status: 'Published',
    title: 'Clean fit and comfortable fabric',
    body: 'The fabric feels light but structured, and the stone color works well with denim.',
  },
  {
    id: 'selvedge-denim-review',
    product: 'Selvedge Denim',
    date: 'April 22, 2026',
    rating: 4,
    status: 'Pending',
    title: 'Good weight, needs a little break-in',
    body: 'The cut is sharp and the stitching is clean. The denim feels firm at first but should settle well.',
  },
]

function Reviews() {
  const { isMobile } = useResponsiveView()

  return (
    <Stack spacing={3}>
      <ProfileIntro
        action={(
          <Button startIcon={<RateReviewOutlinedIcon />} variant="contained">
            Write Review
          </Button>
        )}
        description="Ratings and feedback you have shared on purchased pieces."
        title="Reviews"
      />

      <Divider />

      <Stack spacing={2}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              p: 2,
            }}
          >
            <Stack spacing={2}>
              <Stack
                alignItems={isMobile ? 'flex-start' : 'center'}
                direction={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Stack spacing={0.75}>
                  <Typography fontWeight={800}>{review.product}</Typography>
                  <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    spacing={1}
                  >
                    <Rating
                      emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                      precision={0.5}
                      readOnly
                      size="small"
                      value={review.rating}
                    />
                    <Typography color="text.secondary" variant="body2">
                      {review.date}
                    </Typography>
                  </Stack>
                </Stack>

                <Chip label={review.status} size="small" variant="outlined" />
              </Stack>

              <Box>
                <Typography fontWeight={800}>{review.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {review.body}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

export default Reviews
