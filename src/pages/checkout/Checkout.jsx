import { Box, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../../components/PageIntro.jsx'
import useResponsiveView from '../../hooks/useResponsiveView.js'
import { createCheckoutOrder } from '../../services/orderApi.js'
import { payForOrder } from '../../services/paymentFlow.js'
import { PAYMENT_CHECKOUT_ERROR } from '../../services/paymentCheckout.js'
import { errorToast, successToast, warningToast } from '../../services/toast.js'
import { clearCart } from '../../store/cartSlice.js'
import { selectCartItems, selectCartSummary } from '../../store/cartSlice.js'
import CheckoutDetailsPanel from './components/CheckoutDetailsPanel.jsx'
import EmptyCheckout from './components/EmptyCheckout.jsx'
import CheckoutOrderSummary from './components/CheckoutOrderSummary.jsx'
import { trimAddressPayload } from './components/checkoutAddressUtils.js'
import useBillingAddress from './components/useBillingAddress.js'
import useCheckoutAddress from './components/useCheckoutAddress.js'

function Checkout() {
  const { isDesktop, isMobile } = useResponsiveView()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const navigate = useNavigate()
  const cartSummary = useSelector(selectCartSummary)
  const shipping = useCheckoutAddress()
  const billing = useBillingAddress()
  const [checkoutOrder, setCheckoutOrder] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [gstEnabled, setGstEnabled] = useState(false)
  const [gstDetails, setGstDetails] = useState({
    businessName: '',
    city: '',
    contactNumber: '',
    email: '',
    gstin: '',
    pincode: '',
    state: '',
    tradeName: '',
  })
  const checkoutDisabled =
    shipping.addressLoading ||
    shipping.isPincodeLookupLoading ||
    shipping.savingAddress ||
    billing.isPincodeLookupLoading

  const ensureCheckoutOrder = async () => {
    if (checkoutOrder) {
      return checkoutOrder
    }

    if (!billing.validateBillingAddress()) {
      return null
    }

    if (gstEnabled) {
      const gstin = gstDetails.gstin.trim().toUpperCase()

      if (!gstDetails.businessName.trim()) {
        errorToast('Business name is required for GST invoice.')
        return null
      }

      if (!gstDetails.state.trim()) {
        errorToast('State is required for GST invoice.')
        return null
      }

      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin)) {
        errorToast('Enter a valid GSTIN.')
        return null
      }
    }

    const shippingAddress = await shipping.continueWithAddress()

    if (!shippingAddress) {
      return null
    }

    const orderPayload = {
      billingSameAsShipping: billing.sameAsShipping,
      shippingAddressId: shippingAddress.id,
    }

    if (!billing.sameAsShipping) {
      orderPayload.billingAddress = trimAddressPayload(billing.formState)
    }

    if (gstEnabled) {
      orderPayload.gstDetails = {
        ...gstDetails,
        businessName: gstDetails.businessName.trim(),
        gstin: gstDetails.gstin.trim().toUpperCase(),
        state: gstDetails.state.trim(),
        tradeName: gstDetails.tradeName.trim(),
      }
    }

    const createdOrder = await createCheckoutOrder(orderPayload)

    setCheckoutOrder(createdOrder)
    return createdOrder
  }

  const handleProceedToPayment = async () => {
    setPaymentLoading(true)

    try {
      const order = await ensureCheckoutOrder()

      if (!order) {
        return
      }

      await payForOrder(order.id)

      dispatch(clearCart())
      successToast(`Payment successful for order ${order.orderNumber}.`)
      navigate('/profile/order', { replace: true })
    } catch (error) {
      if (error?.code === PAYMENT_CHECKOUT_ERROR.DISMISSED) {
        warningToast('Payment was not completed. You can retry from checkout.')
      } else {
        errorToast(error?.message || 'Payment failed. Please try again.')
      }
    } finally {
      setPaymentLoading(false)
    }
  }

  if (!items.length) {
    return (
      <Box sx={{ py: 5 }}>
        <Container>
          <Stack spacing={4}>
            <PageIntro
              description="Review your bag before starting checkout."
              eyebrow="Checkout"
              title="Checkout"
            />
            <EmptyCheckout />
          </Stack>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container>
        <Stack spacing={3}>
          <PageIntro
            title="Checkout"
            showBackButton
          />

          <Box
            sx={{
              alignItems: 'start',
              display: 'grid',
              gap: isDesktop ? 3 : 2.5,
              gridTemplateColumns: isDesktop ? 'minmax(0, 1fr) minmax(300px, 360px)' : '1fr',
            }}
          >
            <CheckoutDetailsPanel
              billing={billing}
              gstDetails={gstDetails}
              gstEnabled={gstEnabled}
              onGstDetailsChange={(event) => {
                const { name, value } = event.target

                setCheckoutOrder(null)
                setGstDetails((current) => ({
                  ...current,
                  [name]: name === 'gstin' ? value.toUpperCase() : value,
                }))
              }}
              onGstEnabledChange={(event) => {
                setCheckoutOrder(null)
                setGstEnabled(event.target.checked)
              }}
              shipping={shipping}
            />

            <Stack sx={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 20 }}>
              <CheckoutOrderSummary
                disabled={checkoutDisabled}
                items={items}
                loading={paymentLoading}
                onPayment={handleProceedToPayment}
                summary={cartSummary}
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Checkout
