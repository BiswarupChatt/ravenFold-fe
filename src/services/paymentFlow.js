import {
  createPaymentSession,
  fetchPaymentAttemptStatus,
  recordPaymentAttemptFailure,
  verifyPaymentAttempt,
} from './paymentApi.js'
import { openPaymentCheckout, PAYMENT_CHECKOUT_ERROR } from './paymentCheckout.js'

const PAYMENT_FLOW_ERROR = {
  UNCONFIRMED: 'PAYMENT_UNCONFIRMED',
}

const isPaid = (paymentResult = {}) => (
  paymentResult?.paymentStatus === 'paid'
  || paymentResult?.paymentAttempt?.status === 'paid'
)

const createUnconfirmedPaymentError = (paymentResult = null) => {
  const message = paymentResult?.paymentAttempt?.failureReason
    || 'Payment could not be confirmed. Please check the order status and retry.'

  const error = new Error(message)

  error.code = PAYMENT_FLOW_ERROR.UNCONFIRMED

  return error
}

const buildClientFailurePayload = (error, session) => {
  const checkoutOrderId = session?.checkoutPayload?.order_id || ''
  const failureDetails = error?.details?.error || {}
  const failureMetadata = failureDetails.metadata || {}

  return {
    failureReason: failureDetails.description || failureDetails.reason || error?.message || 'Payment failed.',
    metadata: error?.details || null,
    providerOrderId: failureMetadata.order_id || session?.paymentAttempt?.providerOrderId || checkoutOrderId,
    providerPaymentId: failureMetadata.payment_id || '',
    status: error?.code === PAYMENT_CHECKOUT_ERROR.DISMISSED ? 'cancelled' : 'failed',
  }
}

const reconcileAttemptStatus = async (paymentAttemptId, fallbackError) => {
  try {
    return await fetchPaymentAttemptStatus(paymentAttemptId)
  } catch {
    throw fallbackError
  }
}

export const payForOrder = async (orderId) => {
  const session = await createPaymentSession({ orderId })

  try {
    const paymentPayload = await openPaymentCheckout(session)

    try {
      const paymentResult = await verifyPaymentAttempt(session.paymentAttempt.id, paymentPayload)

      if (isPaid(paymentResult)) {
        return paymentResult
      }

      const refreshedResult = await reconcileAttemptStatus(
        session.paymentAttempt.id,
        createUnconfirmedPaymentError(paymentResult),
      )

      if (isPaid(refreshedResult)) {
        return refreshedResult
      }

      throw createUnconfirmedPaymentError(refreshedResult)
    } catch (error) {
      const refreshedResult = await reconcileAttemptStatus(session.paymentAttempt.id, error)

      if (isPaid(refreshedResult)) {
        return refreshedResult
      }

      throw createUnconfirmedPaymentError(refreshedResult)
    }
  } catch (error) {
    if (error?.code === PAYMENT_CHECKOUT_ERROR.DISMISSED || error?.code === PAYMENT_CHECKOUT_ERROR.FAILED) {
      try {
        await recordPaymentAttemptFailure(session.paymentAttempt.id, buildClientFailurePayload(error, session))
      } catch {
        // Keep the original checkout error visible even if the failure sync request also fails.
      }
    }

    throw error
  }
}
