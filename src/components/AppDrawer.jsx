import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material'
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
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3">
              {title}
            </Typography>

            {description ? (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {description}
              </Typography>
            ) : null}
          </Box>

          <IconButton
            aria-label={`Close ${title}`}
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
        </Stack>

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
      </Stack>
    </Drawer>
  )
}

export default AppDrawer
