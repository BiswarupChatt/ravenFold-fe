import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import {
  Alert,
  Box,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AppButton from '../../../../components/AppButton.jsx'
import { getApiErrorMessage } from '../../../../services/apiClient.js'
import { uploadReviewImages } from '../../../../services/reviewApi.js'
import { formatPrice } from '../../../../utils/utils.js'

const EMPTY_FORM = {
  comment: '',
  rating: 0,
  title: '',
}

function ReviewFormCard({
  item,
  onCancel,
  onSubmit,
  saving = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [pendingFiles, setPendingFiles] = useState([])
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)

  const previewImages = useMemo(() => {
    return [
      ...pendingFiles.map((file) => ({ kind: 'pending', url: URL.createObjectURL(file), name: file.name })),
    ]
  }, [pendingFiles])

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => {
        if (image.kind === 'pending') {
          URL.revokeObjectURL(image.url)
        }
      })
    }
  }, [previewImages])

  const handleFileChange = (event) => {
    const nextFiles = Array.from(event.target.files || [])

    if (!nextFiles.length) {
      return
    }

    setPendingFiles((current) => [...current, ...nextFiles].slice(0, 5))
    event.target.value = ''
  }

  const handleRemovePendingFile = (targetName) => {
    setPendingFiles((current) => current.filter((file) => file.name !== targetName))
  }

  const validateForm = () => {
    if (!Number(form.rating)) {
      return 'Please select a rating.'
    }

    if (!String(form.comment || '').trim()) {
      return 'Please enter your review comment.'
    }

    if (String(form.comment || '').trim().length < 10) {
      return 'Review comment must be at least 10 characters.'
    }

    return ''
  }

  const handleSubmit = async () => {
    const nextError = validateForm()

    if (nextError) {
      setFormError(nextError)
      return
    }

    setFormError('')
    setUploading(true)

    try {
      const uploadedImages = await uploadReviewImages(pendingFiles)

      await onSubmit?.({
        comment: form.comment.trim(),
        images: uploadedImages,
        rating: Number(form.rating),
        title: form.title.trim(),
      })
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Stack spacing={2.2}>
      {item ? (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            p: 1.5,
          }}
        >
          <Typography fontWeight={700}>{item.productSnapshot?.name || 'Product'}</Typography>
          {item.productSnapshot?.variantLabel ? (
            <Typography color="text.secondary" sx={{ mt: 0.4 }}>
              {item.productSnapshot.variantLabel}
            </Typography>
          ) : null}
          {item.priceAtTime !== undefined && item.quantity !== undefined ? (
            <Typography color="text.secondary" sx={{ mt: 0.4 }}>
              {Number(item.quantity || 0)} x {formatPrice(item.priceAtTime || 0)}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      {formError ? <Alert severity="error">{formError}</Alert> : null}

      <Stack spacing={1}>
        <Typography fontWeight={700}>Rating</Typography>
        <Rating
          onChange={(_, value) => setForm((current) => ({ ...current, rating: Number(value || 0) }))}
          precision={1}
          size="large"
          value={Number(form.rating || 0)}
        />
      </Stack>

      <TextField
        fullWidth
        label="Title"
        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
        value={form.title}
      />

      <TextField
        fullWidth
        label="Comment"
        minRows={4}
        multiline
        onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
        value={form.comment}
      />

      <Stack spacing={1}>
        <Typography fontWeight={700}>Images</Typography>
        <AppButton
          component="label"
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          type="button"
          variant="outlined"
        >
          Add images
          <input
            accept="image/*"
            hidden
            multiple
            onChange={handleFileChange}
            type="file"
          />
        </AppButton>

        {previewImages.length ? (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {previewImages.map((image) => (
              <Box
                key={image.url}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Box
                  alt="Review upload"
                  component="img"
                  src={image.url}
                  sx={{ display: 'block', height: 80, objectFit: 'cover', width: 80 }}
                />
                <IconButton
                  onClick={() => handleRemovePendingFile(image.name)}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(17, 24, 39, 0.7)',
                    color: 'common.white',
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    '&:hover': {
                      bgcolor: 'rgba(17, 24, 39, 0.88)',
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="inherit" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        ) : null}
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
        <AppButton onClick={onCancel} type="button" variant="outlined">
          Cancel
        </AppButton>
        <AppButton
          loading={saving || uploading}
          loadingText={uploading ? 'Uploading...' : 'Saving...'}
          onClick={handleSubmit}
          type="button"
          variant="contained"
        >
          Submit Review
        </AppButton>
      </Stack>
    </Stack>
  )
}

export default ReviewFormCard
