import { Box, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageIntro from '../../components/PageIntro.jsx'
import useResponsiveView from '../../hooks/useResponsiveView.js'
import { getApiErrorMessage } from '../../services/apiClient.js'
import { createCheckoutOrder } from '../../services/orderApi.js'
import { errorToast, successToast } from '../../services/toast.js'
import { selectCartItems, selectCartSubtotal } from '../../store/cartSlice.js'
import CheckoutDetailsPanel from './components/CheckoutDetailsPanel.jsx'
import EmptyCheckout from './components/EmptyCheckout.jsx'
import CheckoutOrderSummary from './components/CheckoutOrderSummary.jsx'
import { trimAddressPayload } from './components/checkoutAddressUtils.js'
import useBillingAddress from './components/useBillingAddress.js'
import useCheckoutAddress from './components/useCheckoutAddress.js'

function Checkout() {
  const { isDesktop, isMobile } = useResponsiveView()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const shipping = useCheckoutAddress()
  const billing = useBillingAddress()
  const [checkoutOrder, setCheckoutOrder] = useState(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const checkoutDisabled = Boolean(checkoutOrder) ||
    shipping.addressLoading ||
    shipping.isPincodeLookupLoading ||
    shipping.savingAddress ||
    billing.isPincodeLookupLoading

  const handleProceedToPayment = async () => {
    if (checkoutOrder) {
      successToast(`Order ${checkoutOrder.orderNumber} is ready for payment.`)
      return
    }

    if (!billing.validateBillingAddress()) {
      return
    }

    setPaymentLoading(true)

    try {
      const shippingAddress = await shipping.continueWithAddress()

      if (!shippingAddress) {
        return
      }

      const orderPayload = {
        billingSameAsShipping: billing.sameAsShipping,
        shippingAddressId: shippingAddress.id,
      }

      if (!billing.sameAsShipping) {
        orderPayload.billingAddress = trimAddressPayload(billing.formState)
      }

      const createdOrder = await createCheckoutOrder(orderPayload)

      setCheckoutOrder(createdOrder)
      successToast(`Order ${createdOrder.orderNumber} created. Payment can be connected next.`)
    } catch (error) {
      errorToast(getApiErrorMessage(error))
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
              shipping={shipping}
            />

            <Stack sx={{ position: isMobile ? 'static' : 'sticky', top: isMobile ? 'auto' : 20 }}>
              <CheckoutOrderSummary
                disabled={checkoutDisabled}
                items={items}
                loading={paymentLoading}
                onPayment={handleProceedToPayment}
                subtotal={subtotal}
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Checkout
