import { Alert, Snackbar } from '@mui/material'
import { useEffect, useReducer } from 'react'
import { subscribeToast } from '../services/toast.js'

const initialToastState = {
  currentToast: null,
  isOpen: false,
  queue: [],
}

const severityAccent = {
  error: '#9f2f14',
  info: '#111827',
  success: '#2f855a',
  warning: '#d9461f',
}

function toastReducer(state, action) {
  switch (action.type) {
    case 'enqueue':
      if (state.currentToast) {
        return {
          ...state,
          queue: [...state.queue, action.toast],
        }
      }

      return {
        ...state,
        currentToast: action.toast,
        isOpen: true,
      }
    case 'close':
      return {
        ...state,
        isOpen: false,
      }
    case 'exited':
      if (state.queue.length === 0) {
        return {
          ...state,
          currentToast: null,
        }
      }

      return {
        currentToast: state.queue[0],
        isOpen: true,
        queue: state.queue.slice(1),
      }
    default:
      return state
  }
}

function ToastProvider({ children }) {
  const [{ currentToast, isOpen }, dispatch] = useReducer(
    toastReducer,
    initialToastState,
  )
  const accentColor = severityAccent[currentToast?.severity] ?? severityAccent.info

  useEffect(() => {
    return subscribeToast((toast) => {
      dispatch({ toast, type: 'enqueue' })
    })
  }, [])

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch({ type: 'close' })
  }

  const handleExited = () => {
    dispatch({ type: 'exited' })
  }

  return (
    <>
      {children}
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        autoHideDuration={currentToast?.autoHideDuration}
        key={currentToast?.id}
        onClose={handleClose}
        open={isOpen}
        slotProps={{
          transition: {
            onExited: handleExited,
          },
        }}
        sx={{
          mt: { xs: 1, sm: 2 },
          mx: { xs: 1.5, sm: 0 },
          width: {
            xs: 'min(320px, calc(100vw - 24px))',
            sm: 'auto',
          },
        }}
      >
        {currentToast ? (
          <Alert
            icon={false}
            onClose={handleClose}
            severity={currentToast.severity}
            sx={{
              alignItems: 'center',
              backdropFilter: 'blur(8px)',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              border: 1,
              borderColor: 'divider',
              borderLeft: 4,
              borderLeftColor: accentColor,
              borderRadius: 2,
              boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)',
              color: 'text.primary',
              fontWeight: 600,
              minHeight: { xs: 44, sm: 50 },
              minWidth: 0,
              px: { xs: 1.25, sm: 1.75 },
              py: { xs: 0.9, sm: 1.25 },
              width: '100%',
              '& .MuiAlert-action': {
                color: 'text.secondary',
                p: 0,
                pl: { xs: 1, sm: 2 },
              },
              '& .MuiAlert-message': {
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                lineHeight: 1.35,
                py: 0,
              },
            }}
            variant="standard"
          >
            {currentToast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}

export default ToastProvider
