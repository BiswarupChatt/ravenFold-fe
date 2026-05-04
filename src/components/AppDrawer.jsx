import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Drawer, IconButton, Typography } from '@mui/material'
import useScreenSize from '../hooks/useScreenSize.js'

function AppDrawer({
  anchor = 'right',
  open,
  onClose,
  title,
  description,
  children,
  width = 440,
  paperSx,
  contentSx,
}) {
  const { isMobile } = useScreenSize()
  const hasHeaderContent = Boolean(title || description)

  return (
    <Drawer
      anchor={anchor}
      ModalProps={{ keepMounted: true }}
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: [
            {
              backgroundImage:
                'linear-gradient(180deg, rgba(247, 244, 239, 0.96) 0%, #ffffff 180px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              height: '100dvh',
              maxHeight: '100dvh',
              maxWidth: '100vw',
              p: { xs: 2.5, sm: 3 },
              width: isMobile ? '100vw' : width,
            },
            paperSx,
          ],
        },
      }}
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
              {title ? <Typography variant="h3">{title}</Typography> : null}

              {description ? (
                <Typography color="text.secondary" sx={{ mt: title ? 1 : 0 }}>
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
    </Drawer>
  )
}

export default AppDrawer
