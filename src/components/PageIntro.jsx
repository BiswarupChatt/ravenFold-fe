import { Stack, Typography } from '@mui/material'

function PageIntro({
  eyebrow,
  title,
  description,
  titleVariant = 'h2',
  descriptionSx,
  spacing = 1.25,
  sx,
}) {
  return (
    <Stack spacing={spacing} sx={sx}>
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

      <Typography variant={titleVariant}>{title}</Typography>

      {description ? (
        <Typography
          color="text.secondary"
          sx={[{ fontSize: '1.05rem' }, descriptionSx]}
        >
          {description}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default PageIntro
