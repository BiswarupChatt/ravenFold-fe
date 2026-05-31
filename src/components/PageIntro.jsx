import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppButton from './AppButton.jsx'

function PageIntro({
  backButtonLabel = 'Back',
  backButtonSx,
  children,
  eyebrow,
  onBack,
  showBackButton = false,
  title,
  description,
  titleVariant = 'h2',
  descriptionSx,
  spacing = 1.25,
  sx,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    navigate(-1)
  }

  return (
    <Stack spacing={spacing} sx={sx}>
      {showBackButton ? (
        <AppButton
          onClick={handleBack}
          size="small"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            flexShrink: 0,
            fontSize: '0.85rem',
            justifyContent: 'flex-start',
            minHeight: 32,
            minWidth: 0,
            px: 0,
            textAlign: 'left',
            width: 'fit-content',
            ...backButtonSx,
          }}
          type="button"
          variant="text"
        >
          {backButtonLabel}
        </AppButton>
      ) : null}

      {eyebrow ? (
        <Typography
          color="secondary.main"
          fontWeight={700}
          letterSpacing={2}
          textTransform="uppercase"
          variant="overline"
        >
          {eyebrow}
        </Typography>
      ) : null}

      {title ? (
        <Typography variant={titleVariant}>{title}</Typography>
      ) : null}

      {description ? (
        <Typography
          color="text.secondary"
          sx={[{ fontSize: '1.05rem' }, descriptionSx]}
        >
          {description}
        </Typography>
      ) : null}

      {children}
    </Stack>
  )
}

export default PageIntro
