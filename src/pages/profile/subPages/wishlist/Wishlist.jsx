import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'

const wishlistItems = [
  {
    id: 'linen-overshirt',
    name: 'Linen Overshirt',
    price: 'Rs. 2,490',
    color: 'Stone',
  },
  {
    id: 'selvedge-denim',
    name: 'Selvedge Denim',
    price: 'Rs. 3,790',
    color: 'Indigo',
  },
]

function Wishlist() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3">Wishlist</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Pieces saved for later.
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={2}>
        {wishlistItems.map((item) => (
          <Box
            key={item.id}
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
              <Box>
                <Typography fontWeight={800}>{item.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.color} | {item.price}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  variant="contained"
                >
                  Add to Cart
                </Button>
                <IconButton aria-label={`Remove ${item.name}`}>
                  <DeleteOutlineRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

export default Wishlist
