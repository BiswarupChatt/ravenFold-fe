import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import AppButton from '../../../../components/AppButton.jsx'

function ProductDetailsPurchaseActions({
  buyNowLoading,
  canPurchase,
  cartLoading,
  cartQuantity,
  isAddedToCart,
  onAddToCart,
  onBuyNow,
  onCartQuantityChange,
}) {
  const mobileSpacerHeight = canPurchase ? 144 : 172

  return (
    <>
      <Stack
        spacing={{ xs: 0.75, md: 1 }}
        sx={{
          bgcolor: { xs: 'background.paper', md: 'transparent' },
          border: { xs: '1px solid', md: 0 },
          borderColor: { xs: 'divider', md: 'transparent' },
          borderRadius: { xs: 2, md: 0 },
          bottom: {
            xs: 'calc(env(safe-area-inset-bottom) + 68px)',
            sm: 'calc(env(safe-area-inset-bottom) + 72px)',
            md: 'auto',
          },
          boxShadow: {
            xs: '0 18px 56px rgba(15, 23, 42, 0.22)',
            md: 'none',
          },
          left: { xs: 12, sm: 16, md: 'auto' },
          p: {
            xs: 1.25,
            sm: 1.5,
            md: 0,
          },
          position: { xs: 'fixed', md: 'static' },
          right: { xs: 12, sm: 16, md: 'auto' },
          zIndex: { xs: (theme) => theme.zIndex.appBar + 2, md: 'auto' },
        }}
      >
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) minmax(0, 1fr)',
            md: 'minmax(0, 1fr) minmax(0, 1fr)',
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
              height: { xs: 48, md: 52 },
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
                width: { xs: 40, sm: 48, md: 56 },
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
                width: { xs: 40, sm: 48, md: 56 },
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
              minHeight: { xs: 48, md: 52 },
            }}
            variant="outlined"
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
            minHeight: { xs: 48, md: 52 },
          }}
          variant="contained"
        >
          Buy Now
        </AppButton>
      </Box>

      {!canPurchase ? (
        <Typography color="error" sx={{ fontSize: '0.9rem', fontWeight: 700 }}>
          This option combination is unavailable.
        </Typography>
      ) : null}
      </Stack>

      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'block', md: 'none' },
          height: mobileSpacerHeight,
        }}
      />
    </>
  )
}

export default ProductDetailsPurchaseActions
