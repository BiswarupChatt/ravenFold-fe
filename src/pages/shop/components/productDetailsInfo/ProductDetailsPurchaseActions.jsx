import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import AppButton from '../../../../components/AppButton.jsx'
import useResponsiveView from '../../../../hooks/useResponsiveView.js'

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
  const { isDesktop, isMobile, isTablet } = useResponsiveView()
  const isCompactView = isMobile || isTablet
  const mobileSpacerHeight = canPurchase ? 144 : 172
  const actionHeight = isDesktop ? 52 : 48
  const quantityButtonWidth = isDesktop ? 56 : isTablet ? 48 : 40

  return (
    <>
      <Stack
        spacing={isDesktop ? 1 : 0.75}
        sx={{
          bgcolor: isCompactView ? 'background.paper' : 'transparent',
          border: isCompactView ? '1px solid' : 0,
          borderColor: isCompactView ? 'divider' : 'transparent',
          borderRadius: isCompactView ? 2 : 0,
          bottom: isDesktop
            ? 'auto'
            : `calc(env(safe-area-inset-bottom) + ${isTablet ? 72 : 68}px)`,
          boxShadow: isCompactView ? '0 18px 56px rgba(15, 23, 42, 0.22)' : 'none',
          left: isDesktop ? 'auto' : isTablet ? 16 : 12,
          p: isDesktop ? 0 : isTablet ? 1.5 : 1.25,
          position: isCompactView ? 'fixed' : 'static',
          right: isDesktop ? 'auto' : isTablet ? 16 : 12,
          zIndex: isCompactView ? (theme) => theme.zIndex.appBar + 2 : 'auto',
        }}
      >
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
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
              height: actionHeight,
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
                width: quantityButtonWidth,
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
                width: quantityButtonWidth,
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
              minHeight: actionHeight,
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
            minHeight: actionHeight,
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
          display: isCompactView ? 'block' : 'none',
          height: mobileSpacerHeight,
        }}
      />
    </>
  )
}

export default ProductDetailsPurchaseActions
