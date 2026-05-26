import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import AppButton from '../../../../components/AppButton.jsx'

function ProductDetailsPurchaseActions({
  buyNowLoading,
  canPurchase,
  cartLoading,
  cartQuantity,
  isAddedToCart,
  isWishlisted,
  onAddToCart,
  onBuyNow,
  onCartQuantityChange,
  onToggleWishlist,
}) {
  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) 52px',
            sm: 'minmax(0, 1fr) minmax(0, 1fr) 52px',
          },
        }}
      >
        {isAddedToCart ? (
          <Stack
            alignItems="center"
            direction="row"
            sx={{
              bgcolor: 'transparent',
              border: '1px solid',
              borderColor: 'text.primary',
              borderRadius: 2,
              color: 'text.primary',
              height: 52,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <IconButton
              aria-label="Decrease cart quantity"
              disabled={cartLoading || buyNowLoading}
              onClick={() => onCartQuantityChange(cartQuantity - 1)}
              sx={{
                borderRadius: 0,
                color: 'inherit',
                height: '100%',
                width: 56,
                '&:hover': {
                  bgcolor: 'rgba(24, 24, 27, 0.06)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(24, 24, 27, 0.32)',
                },
              }}
            >
              <RemoveRoundedIcon />
            </IconButton>

            <Box
              sx={{
                alignItems: 'center',
                alignSelf: 'stretch',
                bgcolor: 'transparent',
                borderColor: 'text.primary',
                borderLeft: '1px solid',
                borderRight: '1px solid',
                display: 'flex',
                flex: 1,
                fontSize: '0.95rem',
                fontWeight: 700,
                justifyContent: 'center',
                lineHeight: 1.2,
                minWidth: 0,
              }}
            >
              {cartQuantity}
            </Box>

            <IconButton
              aria-label="Increase cart quantity"
              disabled={cartLoading || buyNowLoading}
              onClick={() => onCartQuantityChange(cartQuantity + 1)}
              sx={{
                borderRadius: 0,
                color: 'inherit',
                height: '100%',
                width: 56,
                '&:hover': {
                  bgcolor: 'rgba(24, 24, 27, 0.06)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(24, 24, 27, 0.32)',
                },
              }}
            >
              <AddRoundedIcon />
            </IconButton>
          </Stack>
        ) : (
          <AppButton
            disabled={!canPurchase || buyNowLoading || cartLoading}
            fullWidth
            loading={cartLoading}
            onClick={onAddToCart}
            startIcon={<AddShoppingCartRoundedIcon />}
            sx={{
              bgcolor: 'text.primary',
              minHeight: 52,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
            variant="contained"
          >
            Add to Cart
          </AppButton>
        )}

        <AppButton
          disabled={!canPurchase || cartLoading || buyNowLoading}
          fullWidth
          loading={buyNowLoading}
          onClick={onBuyNow}
          startIcon={<BoltRoundedIcon />}
          sx={{
            borderColor: 'text.primary',
            color: 'text.primary',
            gridColumn: { xs: '1 / -1', sm: 'auto' },
            minHeight: 52,
          }}
          variant="outlined"
        >
          Buy Now
        </AppButton>

        <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={onToggleWishlist}
            sx={{
              border: '1px solid',
              borderColor: isWishlisted ? 'secondary.main' : 'divider',
              borderRadius: 2,
              color: isWishlisted ? 'secondary.main' : 'text.primary',
              height: 52,
              width: 52,
            }}
          >
            {isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {!canPurchase ? (
        <Typography color="error" sx={{ fontSize: '0.9rem', fontWeight: 700 }}>
          This option combination is unavailable.
        </Typography>
      ) : null}
    </Stack>
  )
}

export default ProductDetailsPurchaseActions
