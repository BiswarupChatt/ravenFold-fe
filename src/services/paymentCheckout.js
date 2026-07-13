const RAZORPAY_CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'
const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-js'

let razorpayScriptPromise = null

export const PAYMENT_CHECKOUT_ERROR = {
  DISMISSED: 'PAYMENT_DISMISSED',
  FAILED: 'PAYMENT_FAILED',
  UNSUPPORTED_PROVIDER: 'UNSUPPORTED_PAYMENT_PROVIDER',
}

const createPaymentError = (message, code, details = null) => {
  const error = new Error(message)

  error.code = code
  error.details = details

  return error
}

const loadScript = ({ id, src }) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(createPaymentError(
      'Payment checkout can only open in the browser.',
      PAYMENT_CHECKOUT_ERROR.FAILED,
    ))
  }

  const existingScript = document.getElementById(id)

  if (existingScript?.dataset.loaded === 'true') {
    return Promise.resolve()
  }

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(createPaymentError('Unable to load payment checkout.', PAYMENT_CHECKOUT_ERROR.FAILED)),
        { once: true },
      )
    })
  }

  const script = document.createElement('script')

  script.id = id
  script.src = src
  script.async = true

  const scriptPromise = new Promise((resolve, reject) => {
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true },
    )
    script.addEventListener(
      'error',
      () => reject(createPaymentError('Unable to load payment checkout.', PAYMENT_CHECKOUT_ERROR.FAILED)),
      { once: true },
    )
  })

  document.body.appendChild(script)
  return scriptPromise
}

const loadRazorpayCheckout = async () => {
  if (window.Razorpay) {
    return
  }

  razorpayScriptPromise ||= loadScript({
    id: RAZORPAY_SCRIPT_ID,
    src: RAZORPAY_CHECKOUT_SCRIPT,
  })

  await razorpayScriptPromise

  if (!window.Razorpay) {
    throw createPaymentError('Razorpay checkout is unavailable.', PAYMENT_CHECKOUT_ERROR.FAILED)
  }
}

const openRazorpayCheckout = async (session) => {
  await loadRazorpayCheckout()

  return new Promise((resolve, reject) => {
    let isSettled = false

    const settle = (callback, value) => {
      if (isSettled) {
        return
      }

      isSettled = true
      callback(value)
    }

    const checkout = new window.Razorpay({
      ...session.checkoutPayload,
      handler: (response) => {
        settle(resolve, {
          providerOrderId: response.razorpay_order_id,
          providerPaymentId: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          signature: response.razorpay_signature,
        })
      },
      modal: {
        ondismiss: () => {
          settle(reject, createPaymentError(
            'Payment was not completed.',
            PAYMENT_CHECKOUT_ERROR.DISMISSED,
          ))
        },
      },
    })

    checkout.on('payment.failed', (response) => {
      const description = response?.error?.description || response?.error?.reason || 'Payment failed.'

      settle(reject, createPaymentError(description, PAYMENT_CHECKOUT_ERROR.FAILED, response))
    })

    checkout.open()
  })
}

export const openPaymentCheckout = async (session) => {
  const provider = String(session?.provider || '').toLowerCase()

  if (provider === 'razorpay') {
    return openRazorpayCheckout(session)
  }

  throw createPaymentError(
    `Unsupported payment provider: ${session?.provider || 'unknown'}.`,
    PAYMENT_CHECKOUT_ERROR.UNSUPPORTED_PROVIDER,
  )
}
