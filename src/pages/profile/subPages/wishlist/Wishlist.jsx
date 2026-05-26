import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ProfileIntro from '../../components/ProfileIntro'
import useResponsiveView from '../../../../hooks/useResponsiveView'
import { addItem } from '../../../../store/cartSlice'
import {
  removeWishlistItem,
  selectWishlistItems,
} from '../../../../store/wishlistSlice'
import { successToast } from '../../../../services/toast'
import formatPrice from '../../../../utils/formatPrice'

function Wishlist() {
  const dispatch = useDispatch()
  const wishlistItems = useSelector(selectWishlistItems)
  const { isMobile } = useResponsiveView()

  const handleAddToCart = (item) => {
    dispatch(addItem(item))
    successToast(`${item.name} added to cart.`)
  }

  const handleRemove = (item) => {
    dispatch(removeWishlistItem(item.id))
    successToast(`${item.name} removed from wishlist.`)
  }

  return (
    <Stack spacing={3}>
      <ProfileIntro
        description="Pieces saved for later."
        title="Wishlist"
      />

      <Divider />

      {wishlistItems.length ? (
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
                alignItems={isMobile ? 'flex-start' : 'center'}
                direction={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack alignItems="center" direction="row" spacing={1.5}>
                  {item.image ? (
                    <Box
                      alt={item.name}
                      component="img"
                      src={item.image}
                      sx={{
                        bgcolor: '#fbf7f1',
                        border: 1,
                        borderColor: 'divider',
                        height: 64,
                        objectFit: 'contain',
                        width: 64,
                      }}
                    />
                  ) : null}

                  <Box>
                    <Typography fontWeight={800}>{item.name}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.category} | {formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    size="small"
                    startIcon={<ShoppingBagOutlinedIcon />}
                    variant="contained"
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    aria-label={`Remove ${item.name}`}
                    onClick={() => handleRemove(item)}
                  >
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography fontWeight={800}>No wishlist items yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Use the heart icon on products to save pieces here.
          </Typography>
        </Box>
      )}
    </Stack>
  )
}

export default Wishlist
