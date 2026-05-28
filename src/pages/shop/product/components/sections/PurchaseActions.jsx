import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import AppButton from '../../../../../components/AppButton.jsx'
import useResponsiveView from '../../../../../hooks/useResponsiveView.js'

function PurchaseActions({
  canPurchase,
  cartLoading,
  cartQuantity,
  goToCartLoading,
  isAddedToCart,
  onAddToCart,
  onCartQuantityChange,
  onGoToCart,
}) {
  const { isDesktop, isMobile, isTablet } = useResponsiveView()
  const isCompactView = isMobile || isTablet
  const actionHeight = isDesktop ? 52 : isTablet ? 40 : 38
  const actionFontSize = isDesktop ? '0.95rem' : isTablet ? '0.86rem' : '0.8rem'
  const actionIconSize = isDesktop ? 22 : 18
  const quantityButtonWidth = isDesktop ? 56 : isTablet ? 42 : 36
  const actionTransition = '340ms cubic-bezier(0.22, 1, 0.36, 1)'
  const buttonSx = {
    boxSizing: 'border-box',
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
  }

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
          gap: isAddedToCart ? (isCompactView ? 0.75 : 1) : 0,
          gridTemplateColumns: isAddedToCart
            ? 'minmax(0, 1fr) minmax(0, 1fr)'
            : 'minmax(0, 1fr) minmax(0, 0fr)',
          minWidth: 0,
          overflow: isAddedToCart ? 'hidden' : 'visible',
          transition: `grid-template-columns ${actionTransition}, gap ${actionTransition}`,
          width: '100%',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '& *': {
              transition: 'none !important',
            },
          },
        }}
      >
        <Box
          sx={{
            minHeight: actionHeight,
            minWidth: 0,
            overflow: isAddedToCart ? 'hidden' : 'visible',
            position: 'relative',
          }}
        >
          <Box
            aria-hidden={isAddedToCart}
            sx={{
              inset: 0,
              opacity: isAddedToCart ? 0 : 1,
              pointerEvents: isAddedToCart ? 'none' : 'auto',
              position: 'absolute',
              transform: isAddedToCart ? 'translateX(-10px)' : 'translateX(0)',
              transition: isAddedToCart
                ? 'opacity 150ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1)'
                : `opacity 220ms ease 80ms, transform ${actionTransition}`,
              willChange: 'opacity, transform',
            }}
          >
            <AppButton
              disabled={isAddedToCart || !canPurchase || goToCartLoading || cartLoading}
              fullWidth
              loading={cartLoading}
              onClick={onAddToCart}
              startIcon={<AddShoppingCartRoundedIcon />}
              sx={buttonSx}
              tabIndex={isAddedToCart ? -1 : 0}
              variant="outlined"
            >
              Add to Cart
            </AppButton>
          </Box>

          <Box
            aria-hidden={!isAddedToCart}
            sx={{
              inset: 0,
              opacity: isAddedToCart ? 1 : 0,
              pointerEvents: isAddedToCart ? 'auto' : 'none',
              position: 'absolute',
              transform: isAddedToCart ? 'translateX(0)' : 'translateX(10px)',
              transition: isAddedToCart
                ? `opacity 240ms ease 90ms, transform ${actionTransition} 70ms`
                : 'opacity 120ms ease, transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
              willChange: 'opacity, transform',
            }}
          >
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
                left: 0,
                minWidth: 0,
                overflow: 'hidden',
                right: 0,
              }}
            >
              <IconButton
                aria-label="Decrease cart quantity"
                disabled={!isAddedToCart || cartLoading || goToCartLoading}
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
                  transition: 'color 160ms ease',
                }}
              >
                {cartQuantity}
              </Box>

              <IconButton
                aria-label="Increase cart quantity"
                disabled={!isAddedToCart || cartLoading || goToCartLoading}
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
          </Box>
        </Box>

        <Box
          aria-hidden={!isAddedToCart}
          sx={{
            minWidth: 0,
            opacity: isAddedToCart ? 1 : 0,
            overflow: 'hidden',
            pointerEvents: isAddedToCart ? 'auto' : 'none',
            transform: isAddedToCart ? 'translateX(0)' : 'translateX(14px)',
            transition: isAddedToCart
              ? `opacity 240ms ease 120ms, transform ${actionTransition} 90ms`
              : 'opacity 120ms ease, transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'opacity, transform',
          }}
        >
          <AppButton
            disabled={!isAddedToCart || !canPurchase || cartLoading || goToCartLoading}
            fullWidth
            loading={goToCartLoading}
            onClick={onGoToCart}
            startIcon={<ShoppingCartRoundedIcon />}
            sx={{
              ...buttonSx,
              minWidth: 0,
            }}
            tabIndex={isAddedToCart ? 0 : -1}
            variant="contained"
          >
            Go to Cart
          </AppButton>
        </Box>
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

export default PurchaseActions
