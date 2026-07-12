import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useResponsiveView from '../../../../hooks/useResponsiveView'
import { payForOrder } from '../../../../services/paymentFlow.js'
import { fetchCustomerOrder, fetchCustomerOrders } from '../../../../services/orderApi.js'
import { PAYMENT_CHECKOUT_ERROR } from '../../../../services/paymentCheckout.js'
import { fetchMyReviews, fetchReviewEligibility } from '../../../../services/reviewApi.js'
import { errorToast, successToast, warningToast } from '../../../../services/toast.js'
import ProfileIntro from '../../components/ProfileIntro'
import OrderCard from './components/OrderCard.jsx'
import OrderDetailsModal from './components/OrderDetailsModal.jsx'
import { ORDER_PAGE_LIMIT, getProductPath } from './components/orderFormatters.js'

function Order() {
  const { isMobile } = useResponsiveView()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedOrderReviewContext, setSelectedOrderReviewContext] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [retryingOrderId, setRetryingOrderId] = useState('')

  const loadOrders = useCallback(async ({ append = false, page = 1 } = {}) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError('')
    }

    try {
      const orderList = await fetchCustomerOrders({
        limit: ORDER_PAGE_LIMIT,
        page,
      })

      setOrders((currentOrders) => (
        append ? [...currentOrders, ...orderList.items] : orderList.items
      ))
      setPagination(orderList.pagination)
    } catch (err) {
      setError(err.message || 'Failed to load orders.')
      if (!append) {
        setOrders([])
        setPagination(null)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders()
  }, [loadOrders])

  const loadReviewContext = useCallback(async (orderId) => {
    const [eligibility, reviewList] = await Promise.all([
      fetchReviewEligibility({ orderId }),
      fetchMyReviews({ limit: 50, orderId }),
    ])
    const reviewsByOrderItemId = Object.fromEntries(
      (reviewList.items || [])
        .map((review) => [review.orderItem?.id, review])
        .filter(([orderItemId]) => Boolean(orderItemId)),
    )
    const eligibilityByOrderItemId = Object.fromEntries(
      (eligibility.items || []).map((item) => [item.orderItemId, item]),
    )

    return {
      eligibilityByOrderItemId,
      reviewsByOrderItemId,
    }
  }, [])

  const openOrderDetails = async (order) => {
    setSelectedOrder(order)
    setSelectedOrderReviewContext(null)
    setDetailsOpen(true)
    setLoadingDetails(true)

    try {
      const detailedOrder = await fetchCustomerOrder(order.id)
      const reviewContext = await loadReviewContext(order.id)

      setSelectedOrder(detailedOrder)
      setSelectedOrderReviewContext(reviewContext)
    } catch (err) {
      setError(err.message || 'Failed to load order details.')
      setDetailsOpen(false)
      setSelectedOrder(null)
      setSelectedOrderReviewContext(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeOrderDetails = () => {
    setDetailsOpen(false)
    setSelectedOrder(null)
    setSelectedOrderReviewContext(null)
  }

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loadingMore) {
      return
    }

    loadOrders({
      append: true,
      page: Number(pagination.page || 1) + 1,
    })
  }

  const handleViewProduct = (item) => {
    const path = getProductPath(item)

    if (path) {
      closeOrderDetails()
      navigate(path)
    }
  }

  const handleRetryPayment = async (order) => {
    setRetryingOrderId(order.id)

    try {
      await payForOrder(order.id)
      successToast(`Payment successful for order ${order.orderNumber}.`)
      await loadOrders()

      if (selectedOrder?.id === order.id) {
        setSelectedOrder(await fetchCustomerOrder(order.id))
      }
    } catch (error) {
      if (error?.code === PAYMENT_CHECKOUT_ERROR.DISMISSED) {
        warningToast('Payment was not completed. You can retry this order again.')
      } else {
        errorToast(error?.message || 'Payment failed. Please try again.')
      }

      if (selectedOrder?.id === order.id) {
        try {
          setSelectedOrder(await fetchCustomerOrder(order.id))
        } catch {
          // Keep the current details view if the refresh fails.
        }
      }
    } finally {
      setRetryingOrderId('')
    }
  }

  const handleOpenReviewPage = (item) => {
    if (!selectedOrder?.id || !item?.id) {
      return
    }

    closeOrderDetails()
    navigate(`/profile/reviews/write/${selectedOrder.id}/${item.id}`)
  }

  return (
    <Stack spacing={3}>
      <ProfileIntro
        description="Recent purchases and delivery progress."
        title="Orders"
      />

      <Divider />

      {error ? (
        <Alert
          action={(
            <Button color="inherit" onClick={() => loadOrders()} size="small">
              Retry
            </Button>
          )}
          severity="error"
          sx={{ borderRadius: 1.5 }}
        >
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Stack alignItems="center" direction="row" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading orders...</Typography>
        </Stack>
      ) : null}

      {!loading && !error && orders.length === 0 ? (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
          <Typography fontWeight={800}>No orders yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Your checkout orders will appear here after they are created.
          </Typography>
          <Button onClick={() => navigate('/shop')} sx={{ mt: 2 }} variant="outlined">
            Continue Shopping
          </Button>
        </Box>
      ) : null}

      {!loading && orders.length > 0 ? (
        <Stack spacing={2.5}>
          {orders.map((order) => (
            <OrderCard
              isMobile={isMobile}
              key={order.id}
              onRetryPayment={handleRetryPayment}
              onViewDetails={openOrderDetails}
              onViewProduct={handleViewProduct}
              order={order}
              retrying={retryingOrderId === order.id}
            />
          ))}

          {pagination?.hasNextPage ? (
            <Button
              disabled={loadingMore}
              onClick={handleLoadMore}
              startIcon={loadingMore ? <CircularProgress color="inherit" size={16} /> : null}
              sx={{ alignSelf: 'center' }}
              variant="outlined"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          ) : null}
        </Stack>
      ) : null}

      <OrderDetailsModal
        isMobile={isMobile}
        loading={loadingDetails}
        onClose={closeOrderDetails}
        onOpenReview={handleOpenReviewPage}
        onRetryPayment={handleRetryPayment}
        onViewProduct={handleViewProduct}
        open={detailsOpen}
        order={selectedOrder}
        reviewContext={selectedOrderReviewContext}
        retrying={retryingOrderId === selectedOrder?.id}
      />
    </Stack>
  )
}

export default Order
