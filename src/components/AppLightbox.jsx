import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Dialog, IconButton, Tooltip } from '@mui/material'

function toSxArray(value) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

const defaultCloseButtonSx = {
  bgcolor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.22)',
  color: 'text.primary',
  height: 44,
  width: 44,
  '&:hover': {
    bgcolor: '#fff',
  },
}

function AppLightbox({
  children,
  closeButtonLabel = 'Close overlay',
  closeButtonSx,
  contentSx,
  onClose,
  open,
  showCloseButton = true,
  slotProps,
  ...dialogProps
}) {
  return (
    <Dialog
      aria-label={dialogProps['aria-label'] || closeButtonLabel}
      fullScreen
      maxWidth={false}
      onClose={onClose}
      open={open}
      slotProps={{
        ...slotProps,
        backdrop: {
          ...slotProps?.backdrop,
          sx: [
            {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(17, 24, 39, 0.72)',
            },
            ...toSxArray(slotProps?.backdrop?.sx),
          ],
        },
        paper: {
          ...slotProps?.paper,
          sx: [
            {
              bgcolor: 'transparent',
              boxShadow: 'none',
              height: '100dvh',
              m: 0,
              maxHeight: 'none',
              maxWidth: 'none',
              overflow: 'hidden',
              width: '100vw',
            },
            ...toSxArray(slotProps?.paper?.sx),
          ],
        },
      }}
      {...dialogProps}
    >
      <Box
        sx={[
          {
            height: '100dvh',
            overflow: 'hidden',
            p: { xs: 2, sm: 3 },
            position: 'relative',
            width: '100vw',
          },
          ...toSxArray(contentSx),
        ]}
      >
        {showCloseButton ? (
          <Box
            sx={{
              position: 'absolute',
              right: { xs: 12, sm: 24 },
              top: { xs: 12, sm: 24 },
              zIndex: 4,
            }}
          >
            <Tooltip title="Close">
              <IconButton aria-label={closeButtonLabel} onClick={onClose} sx={closeButtonSx || defaultCloseButtonSx}>
                <CloseRoundedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null}

        {children}
      </Box>
    </Dialog>
  )
}

export default AppLightbox
