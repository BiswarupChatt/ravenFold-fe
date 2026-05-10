const toastListeners = new Set()

let toastId = 0

function emitToast(toast) {
  toastListeners.forEach((listener) => listener(toast))
}

function normalizeToast(message, options = {}) {
  const messageValue =
    typeof message === 'string' ? message : message?.message || ''

  return {
    autoHideDuration:
      options.autoHideDuration ?? message?.autoHideDuration ?? 3000,
    id: `${Date.now()}-${toastId += 1}`,
    message: messageValue,
    severity: options.severity ?? message?.severity ?? 'info',
  }
}

export function subscribeToast(listener) {
  toastListeners.add(listener)

  return () => {
    toastListeners.delete(listener)
  }
}

export function showToast(message, options) {
  const toast = normalizeToast(message, options)

  if (!toast.message) {
    return null
  }

  emitToast(toast)
  return toast.id
}

export function successToast(message, options) {
  return showToast(message, {
    ...options,
    severity: 'success',
  })
}

export function errorToast(message, options) {
  return showToast(message, {
    ...options,
    severity: 'error',
  })
}

export function infoToast(message, options) {
  return showToast(message, {
    ...options,
    severity: 'info',
  })
}

export function warningToast(message, options) {
  return showToast(message, {
    ...options,
    severity: 'warning',
  })
}

export const successtoast = successToast
