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
import { fetchCustomerOrder, fetchCustomerOrders } from '../../../../services/orderApi.js'
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
  const [loadingDetails, setLoadingDetails] = useState(false)

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

  const openOrderDetails = async (order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
    setLoadingDetails(true)

    try {
      setSelectedOrder(await fetchCustomerOrder(order.id))
    } catch (err) {
      setError(err.message || 'Failed to load order details.')
      setDetailsOpen(false)
      setSelectedOrder(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeOrderDetails = () => {
    setDetailsOpen(false)
    setSelectedOrder(null)
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
              onViewDetails={openOrderDetails}
              onViewProduct={handleViewProduct}
              order={order}
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
        onViewProduct={handleViewProduct}
        open={detailsOpen}
        order={selectedOrder}
      />
    </Stack>
  )
}

export default Order
