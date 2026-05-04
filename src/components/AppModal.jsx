import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material'
import { useId } from 'react'
import useScreenSize from '../hooks/useScreenSize.js'

function toSxArray(value) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function AppModal({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreenOnMobile = true,
  keepMounted = true,
  showCloseButton = true,
  closeButtonLabel,
  paperSx,
  contentSx,
  slotProps,
  ...dialogProps
}) {
  const { isMobile } = useScreenSize()
  const titleId = useId()
  const descriptionId = useId()
  const hasHeaderContent = Boolean(eyebrow || title || description)
  const isFullScreen = fullScreenOnMobile && isMobile
  const resolvedCloseButtonLabel =
    closeButtonLabel ?? (title ? `Close ${title}` : 'Close modal')

  return (
    <Dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={title ? titleId : undefined}
      fullScreen={isFullScreen}
      fullWidth={fullWidth}
      keepMounted={keepMounted}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
      scroll="paper"
      slotProps={{
        ...slotProps,
        backdrop: {
          ...slotProps?.backdrop,
          sx: [
            {
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(17, 24, 39, 0.56)',
            },
            ...toSxArray(slotProps?.backdrop?.sx),
          ],
        },
        paper: {
          ...slotProps?.paper,
          sx: [
            {
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: isFullScreen ? 0 : 3,
              boxSizing: 'border-box',
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: isFullScreen
                ? '100dvh'
                : {
                    xs: 'calc(100dvh - 24px)',
                    sm: 'calc(100dvh - 64px)',
                  },
              overflow: 'hidden',
              p: { xs: 2.5, sm: 3 },
              width: '100%',
            },
            ...toSxArray(slotProps?.paper?.sx),
            ...toSxArray(paperSx),
          ],
        },
      }}
      {...dialogProps}
    >
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        {hasHeaderContent || showCloseButton ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{
              alignItems: 'flex-start',
              borderBottom: 1,
              borderColor: 'divider',
              pb: 2,
            }}
          >
            {hasHeaderContent ? (
              <Box sx={{ minWidth: 0 }}>
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
                  <Typography
                    id={titleId}
                    sx={{ mt: eyebrow ? 0.5 : 0 }}
                    variant="h3"
                  >
                    {title}
                  </Typography>
                ) : null}

                {description ? (
                  <Typography
                    color="text.secondary"
                    id={descriptionId}
                    sx={{ mt: 1 }}
                  >
                    {description}
                  </Typography>
                ) : null}
              </Box>
            ) : (
              <Box />
            )}

            {showCloseButton ? (
              <IconButton
                aria-label={resolvedCloseButtonLabel}
                color="inherit"
                onClick={onClose}
                sx={{
                  alignSelf: 'flex-start',
                  color: 'text.primary',
                  flexShrink: 0,
                  height: 44,
                  width: 44,
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            ) : null}
          </Stack>
        ) : null}

        <Box
          sx={[
            {
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              pt: 2.5,
            },
            contentSx,
          ]}
        >
          {children}
        </Box>

        {footer ? (
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              mt: 2,
              pt: 2,
            }}
          >
            {footer}
          </Box>
        ) : null}
      </Stack>
    </Dialog>
  )
}

export default AppModal
