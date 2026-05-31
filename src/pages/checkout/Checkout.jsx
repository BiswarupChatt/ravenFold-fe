import { Box, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PageIntro from '../../components/PageIntro.jsx'
import useResponsiveView from '../../hooks/useResponsiveView.js'
import { successToast } from '../../services/toast.js'
import { selectCartItems, selectCartSubtotal } from '../../store/cartSlice.js'
import CheckoutDetailsPanel from './components/CheckoutDetailsPanel.jsx'
import EmptyCheckout from './components/EmptyCheckout.jsx'
import CheckoutOrderSummary from './components/CheckoutOrderSummary.jsx'
import useBillingAddress from './components/useBillingAddress.js'
import useCheckoutAddress from './components/useCheckoutAddress.js'

function Checkout() {
  const { isDesktop, isMobile } = useResponsiveView()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const shipping = useCheckoutAddress()
  const billing = useBillingAddress()
  const [paymentLoading, setPaymentLoading] = useState(false)

  const handleProceedToPayment = async () => {
    if (!billing.validateBillingAddress()) {
      return
    }

    setPaymentLoading(true)

    try {
      const hasShippingAddress = await shipping.continueWithAddress()

      if (!hasShippingAddress) {
        return
      }

      successToast('Payment is not connected yet.')
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
            description="Confirm shipping and billing details before payment."
            eyebrow="Checkout"
            title="Checkout"
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
                disabled={shipping.addressLoading || shipping.isPincodeLookupLoading || billing.isPincodeLookupLoading}
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
