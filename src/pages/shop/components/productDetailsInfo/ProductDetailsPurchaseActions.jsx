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
  const actionHeight = isDesktop ? 52 : isTablet ? 40 : 38
  const actionFontSize = isDesktop ? '0.95rem' : isTablet ? '0.86rem' : '0.8rem'
  const actionIconSize = isDesktop ? 22 : 18
  const quantityButtonWidth = isDesktop ? 56 : isTablet ? 42 : 36

  return (
    <Stack
      spacing={isDesktop ? 1 : 0.75}
      sx={{
        bgcolor: isCompactView ? 'background.default' : 'transparent',
        border: isCompactView ? '1px solid' : 0,
        borderColor: isCompactView ? 'divider' : 'transparent',
        borderRadius: isCompactView ? 2 : 0,
        bottom: isDesktop
          ? 'auto'
          : `calc(env(safe-area-inset-bottom) + ${isTablet ? 72 : 68}px)`,
        boxShadow: isCompactView ? '0 18px 56px rgba(15, 23, 42, 0.22)' : 'none',
        boxSizing: 'border-box',
        left: isDesktop ? 'auto' : isTablet ? 16 : 12,
        maxWidth: isDesktop ? 'none' : isTablet ? 'calc(100vw - 32px)' : 'calc(100vw - 24px)',
        minWidth: 0,
        p: isDesktop ? 0 : isTablet ? 1.125 : 1,
        position: isCompactView ? 'fixed' : 'static',
        right: isDesktop ? 'auto' : isTablet ? 16 : 12,
        width: isDesktop ? '100%' : 'auto',
        zIndex: isCompactView ? (theme) => theme.zIndex.appBar + 2 : 'auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: isCompactView ? 0.75 : 1,
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          minWidth: 0,
          width: '100%',
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
                flexShrink: 0,
                height: '100%',
                width: quantityButtonWidth,
                '&:hover': {
                  bgcolor: 'rgba(24, 24, 27, 0.06)',
                },
                '&.Mui-disabled': {
                color: 'rgba(24, 24, 27, 0.32)',
                },
                '& svg': {
                  fontSize: actionIconSize,
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
                fontSize: actionFontSize,
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
                flexShrink: 0,
                height: '100%',
                width: quantityButtonWidth,
                '&:hover': {
                  bgcolor: 'rgba(24, 24, 27, 0.06)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(24, 24, 27, 0.32)',
                },
                '& svg': {
                  fontSize: actionIconSize,
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
              fontSize: actionFontSize,
              minWidth: 0,
              minHeight: actionHeight,
              overflow: 'hidden',
              px: isCompactView ? 1 : 2,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '& .MuiButton-startIcon': {
                flexShrink: 0,
                mr: isCompactView ? 0.5 : 1,
              },
              '& svg': {
                fontSize: actionIconSize,
              },
              '@media (max-width: 340px)': {
                fontSize: '0.74rem',
                px: 0.5,
                '& .MuiButton-startIcon': {
                  display: 'none',
                },
              },
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
            fontSize: actionFontSize,
            minWidth: 0,
            minHeight: actionHeight,
            overflow: 'hidden',
            px: isCompactView ? 1 : 2,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            '& .MuiButton-startIcon': {
              flexShrink: 0,
              mr: isCompactView ? 0.5 : 1,
            },
            '& svg': {
              fontSize: actionIconSize,
            },
            '@media (max-width: 340px)': {
              fontSize: '0.74rem',
              px: 0.5,
              '& .MuiButton-startIcon': {
                display: 'none',
              },
            },
          }}
          variant="contained"
        >
          Buy Now
        </AppButton>
      </Box>

      {!canPurchase ? (
        <Typography
          color="error"
          sx={{
            fontSize: '0.9rem',
            fontWeight: 700,
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          This option combination is unavailable.
        </Typography>
      ) : null}
    </Stack>
  )
}

export default ProductDetailsPurchaseActions
