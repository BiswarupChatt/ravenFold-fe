import { Alert, Snackbar } from '@mui/material'
import { useEffect, useReducer } from 'react'
import { subscribeToast } from '../services/toast.js'

const initialToastState = {
  currentToast: null,
  isOpen: false,
  queue: [],
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
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        autoHideDuration={currentToast?.autoHideDuration}
        key={currentToast?.id}
        onClose={handleClose}
        open={isOpen}
        slotProps={{
          transition: {
            onExited: handleExited,
          },
        }}
        sx={{ mt: 2 }}
      >
        {currentToast ? (
          <Alert
            onClose={handleClose}
            severity={currentToast.severity}
            sx={{
              alignItems: 'center',
              borderRadius: 1.5,
              boxShadow: '0 16px 48px rgba(15, 23, 42, 0.16)',
              fontWeight: 600,
              minWidth: { xs: 'calc(100vw - 32px)', sm: 320 },
            }}
            variant="filled"
          >
            {currentToast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}

export default ToastProvider
