import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'

const orders = [
  {
    id: 'RF-1024',
    date: 'May 02, 2026',
    status: 'In transit',
    total: 'Rs. 4,280',
    items: '2 items',
  },
  {
    id: 'RF-1017',
    date: 'April 18, 2026',
    status: 'Delivered',
    total: 'Rs. 2,140',
    items: '1 item',
  },
]

function Order() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3">Orders</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Recent purchases and delivery progress.
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={2}>
        {orders.map((order) => (
          <Box
            key={order.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              p: 2,
            }}
          >
            <Stack
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={1.5}>
                <ReceiptLongOutlinedIcon sx={{ color: 'secondary.main', mt: 0.25 }} />
                <Stack spacing={0.75}>
                  <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    spacing={1}
                  >
                    <Typography fontWeight={800}>{order.id}</Typography>
                    <Chip
                      icon={<LocalShippingOutlinedIcon />}
                      label={order.status}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography color="text.secondary">
                    {order.date} | {order.items} | {order.total}
                  </Typography>
                </Stack>
              </Stack>

              <Button size="small" variant="outlined">
                View Details
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

export default Order
