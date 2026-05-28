import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import formatPrice from '../utils/formatPrice.js'

const getLineTotal = (item = {}) => Number(item.price || 0) * Number(item.quantity || 0)

const getPricing = (item = {}) => {
  const price = Number(item.price || item.priceSnapshot?.price || 0)
  const basePrice = Number(item.basePrice || item.compareAtPrice || item.priceSnapshot?.basePrice || 0)
  const compareAtPrice = basePrice > price ? basePrice : 0
  const discountAmount = compareAtPrice ? compareAtPrice - price : 0

  return {
    compareAtPrice,
    discountAmount,
    price,
  }
}

function CartItemPrice({ item }) {
  const { compareAtPrice, discountAmount, price } = getPricing(item)

  return (
    <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={0.75}>
      <Typography sx={{ color: 'primary.main', fontSize: '0.95rem', fontWeight: 650 }}>
        {formatPrice(price)}
      </Typography>

      {compareAtPrice ? (
        <Typography
          color="text.secondary"
          sx={{
            mx: 1 ,
            fontSize: '0.82rem',
            fontWeight: 500,
            opacity: 0.78,
            textDecoration: 'line-through',
          }}
        >
          {formatPrice(compareAtPrice)}
        </Typography>
      ) : null}

      {discountAmount ? (
        <Typography
          sx={{
            color: 'secondary.main',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {formatPrice(discountAmount)} off
        </Typography>
      ) : null}
    </Stack>
  )
}

function QuantityControl({
  disabled,
  isDrawer,
  item,
  loading,
  onDecrease,
  onIncrease,
}) {
  const buttonSize = isDrawer ? 38 : 36

  return (
    <Stack
      alignItems="center"
      direction="row"
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        height: isDrawer ? buttonSize : 38,
        overflow: 'hidden',
        width: isDrawer ? 118 : 124,
      }}
    >
      <IconButton
        aria-label={`Decrease ${item.name} quantity`}
        disabled={disabled || loading}
        onClick={() => onDecrease(item)}
        sx={{
          bgcolor: 'transparent',
          borderRadius: 0,
          color: 'text.primary',
          height: '100%',
          width: buttonSize,
          '&:hover': {
            bgcolor: 'rgba(24, 24, 27, 0.08)',
          },
          '& svg': { fontSize: isDrawer ? 18 : 16 },
        }}
      >
        <RemoveRoundedIcon />
      </IconButton>

      <Box
        sx={{
          alignItems: 'center',
          alignSelf: 'stretch',
          borderColor: 'divider',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          display: 'flex',
          flex: 1,
          fontSize: isDrawer ? '1rem' : '0.9rem',
          fontWeight: 800,
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
        {item.quantity}
      </Box>

      <IconButton
        aria-label={`Increase ${item.name} quantity`}
        disabled={disabled || loading}
        onClick={() => onIncrease(item)}
        sx={{
          bgcolor: 'transparent',
          borderRadius: 0,
          color: 'text.primary',
          height: '100%',
          width: buttonSize,
          '&:hover': {
            bgcolor: 'rgba(24, 24, 27, 0.08)',
          },
          '& svg': { fontSize: isDrawer ? 18 : 16 },
        }}
      >
        <AddRoundedIcon />
      </IconButton>
    </Stack>
  )
}

function CartItemCard({
  disabled,
  isDesktop,
  isDrawer,
  item,
  loading,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const variantLabel = item.variantLabel || ''
  const detailItems = [variantLabel].filter(Boolean)
  const imageSize = isDrawer ? 76 : isDesktop ? 100 : 88

  if (!isDrawer) {
    return (
      <Paper
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 'none',
          p: isDesktop ? 2.25 : 1.75,
        }}
        variant="outlined"
      >
        <Stack
          alignItems={isDesktop ? 'center' : 'stretch'}
          direction={isDesktop ? 'row' : 'column'}
          spacing={2}
        >
          <Stack direction="row" spacing={1.75} sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: '#f1ece4',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                flexShrink: 0,
                height: imageSize,
                justifyContent: 'center',
                overflow: 'hidden',
                width: imageSize,
              }}
            >
              {item.image ? (
                <Box
                  alt={item.name}
                  component="img"
                  src={item.image}
                  sx={{
                    height: '100%',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
              ) : (
                <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: 34 }} />
              )}
            </Box>

            <Stack justifyContent="center" spacing={0.75} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: isDesktop ? '1rem' : '0.96rem',
                  fontWeight: 650,
                  lineHeight: 1.28,
                  overflowWrap: 'anywhere',
                }}
              >
                {item.name}
              </Typography>

              {detailItems.length ? (
                <Typography color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.35 }}>
                  {detailItems.join(' / ')}
                </Typography>
              ) : null}

              <CartItemPrice item={item} />
            </Stack>
          </Stack>

          <Stack
            alignItems={isDesktop ? 'flex-end' : 'stretch'}
            spacing={1.25}
            sx={{ flexShrink: 0, minWidth: isDesktop ? 190 : 0 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              justifyContent={isDesktop ? 'flex-end' : 'space-between'}
              spacing={1.5}
            >
              <Typography color="text.secondary" sx={{ fontSize: '0.82rem', fontWeight: 500 }}>
                Qty
              </Typography>
              <QuantityControl
                disabled={disabled}
                isDrawer={false}
                item={item}
                loading={loading}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
              />
            </Stack>

            <Button
              color="inherit"
              disabled={disabled || loading}
              onClick={() => onRemove(item)}
              sx={{
                alignSelf: isDesktop ? 'flex-end' : 'flex-start',
                color: 'text.secondary',
                fontSize: '0.8rem',
                fontWeight: 500,
                minHeight: 28,
                minWidth: 0,
                px: 0,
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'secondary.main',
                },
              }}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        bgcolor: 'transparent',
        border: isDrawer ? '1px solid' : 0,
        borderColor: 'divider',
        borderRadius: isDrawer ? 2 : 0,
        boxShadow: 'none',
        p: isDrawer ? 1.5 : isDesktop ? 2.5 : 0,
      }}
      variant={isDrawer ? 'outlined' : 'elevation'}
    >
      <Stack
        alignItems={isDesktop && !isDrawer ? 'center' : 'flex-start'}
        direction={isDesktop && !isDrawer ? 'row' : 'column'}
        spacing={isDrawer ? 1.5 : 2}
      >
        <Stack
          direction="row"
          spacing={isDrawer ? 1.25 : 1.75}
          sx={{ flex: 1, minWidth: 0, width: '100%' }}
        >
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: '#f1ece4',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: isDrawer ? 2 : 1,
              display: 'flex',
              flexShrink: 0,
              height: imageSize,
              justifyContent: 'center',
              overflow: 'hidden',
              width: imageSize,
            }}
          >
            {item.image ? (
              <Box
                alt={item.name}
                component="img"
                src={item.image}
                sx={{
                  height: '100%',
                  objectFit: 'cover',
                  width: '100%',
                }}
              />
            ) : (
              <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: isDrawer ? 28 : 34 }} />
            )}
          </Box>

          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: isDrawer ? '0.95rem' : isDesktop ? '1rem' : '0.96rem',
                fontWeight: 650,
                lineHeight: 1.28,
                overflowWrap: 'anywhere',
              }}
            >
              {item.name}
            </Typography>

            {detailItems.length ? (
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: '0.82rem',
                  lineHeight: 1.35,
                  overflowWrap: 'anywhere',
                }}
              >
                {detailItems.join(' / ')}
              </Typography>
            ) : null}

            <CartItemPrice item={item} />
          </Stack>
        </Stack>

        <Stack
          alignItems={isDesktop && !isDrawer ? 'flex-end' : 'stretch'}
          direction={isDesktop && !isDrawer ? 'column' : 'row'}
          justifyContent="space-between"
          spacing={1.25}
          sx={{
            flexShrink: 0,
            minWidth: isDesktop && !isDrawer ? 150 : 0,
            width: isDesktop && !isDrawer ? 'auto' : '100%',
          }}
        >
          {isDrawer ? (
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '0.92rem',
                fontWeight: 650,
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}
            >
              {formatPrice(getLineTotal(item))}
            </Typography>
          ) : null}

          <Stack alignItems="center" direction="row" spacing={1}>
            <QuantityControl
              disabled={disabled}
              isDrawer={isDrawer}
              item={item}
              loading={loading}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />

            {isDrawer ? (
              <IconButton
                aria-label={`Remove ${item.name}`}
                disabled={disabled || loading}
                onClick={() => onRemove(item)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  color: 'text.secondary',
                  height: 38,
                  width: 38,
                  '&:hover': {
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                  },
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                disabled={disabled || loading}
                onClick={() => onRemove(item)}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  minHeight: 28,
                  minWidth: 0,
                  px: 0,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'secondary.main',
                  },
                }}
              >
                x Remove
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default CartItemCard
