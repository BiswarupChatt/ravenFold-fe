import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Dialog, IconButton, Tooltip } from '@mui/material'
import useResponsiveView from '../hooks/useResponsiveView.js'

function toSxArray(value) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

const defaultCloseButtonSx = {
  bgcolor: 'rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  height: 44,
  width: 44,
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.2)',
  },
}

function AppOverlayDialog({
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
  const { isMobile } = useResponsiveView()

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
            p: isMobile ? 2 : 3,
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
              right: isMobile ? 12 : 24,
              top: isMobile ? 12 : 24,
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

export default AppOverlayDialog
