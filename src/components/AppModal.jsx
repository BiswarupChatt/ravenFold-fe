import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Dialog, IconButton, Typography } from '@mui/material'
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
  title,
  description,
  children,
  maxWidth = 'sm',
  paperSx,
  contentSx,
  slotProps,
  ...dialogProps
}) {
  const { isMobile } = useScreenSize()
  const titleId = useId()
  const descriptionId = useId()
  const hasHeaderContent = Boolean(title || description)

  return (
    <Dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={title ? titleId : undefined}
      fullScreen={isMobile}
      fullWidth
      keepMounted
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
              borderRadius: isMobile ? 0 : 2,
              boxSizing: 'border-box',
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: isMobile
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
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
        <Box
          sx={{
            alignItems: 'flex-start',
            borderBottom: hasHeaderContent ? 1 : 0,
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
            pb: hasHeaderContent ? 2 : 1.5,
          }}
        >
          {hasHeaderContent ? (
            <Box sx={{ minWidth: 0 }}>
              {title ? (
                <Typography id={titleId} variant="h3">
                  {title}
                </Typography>
              ) : null}

              {description ? (
                <Typography
                  color="text.secondary"
                  id={descriptionId}
                  sx={{ mt: title ? 1 : 0 }}
                >
                  {description}
                </Typography>
              ) : null}
            </Box>
          ) : (
            <Box />
          )}

          <IconButton
            aria-label={title ? `Close ${title}` : 'Close'}
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
        </Box>

        <Box
          sx={[
            {
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              minHeight: 0,
              overflowY: 'auto',
              pt: hasHeaderContent ? 2.5 : 0,
            },
            contentSx,
          ]}
        >
          {children}
        </Box>
      </Box>
    </Dialog>
  )
}

export default AppModal
