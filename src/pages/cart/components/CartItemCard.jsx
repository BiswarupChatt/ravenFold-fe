import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import { formatPrice, getCartLineTotal, getCartPricing, parseVariantDetails } from '../../../utils/utils.js'

function CartItemPrice({ isDrawer, item, stacked = false }) {
  const { compareAtPrice, discountAmount, discountPercent, price } = getCartPricing(item)
  const discountLabel = discountPercent
    ? `${discountPercent}% off`
    : discountAmount
      ? `${formatPrice(discountAmount)} off`
      : ''

  return (
    <Stack
      alignItems={stacked ? 'flex-start' : 'center'}
      direction={stacked ? 'column' : 'row'}
      flexWrap="wrap"
      gap={stacked ? 0.3 : 0.75}
    >
      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={0.7}>
        <Typography
          sx={{
            color: 'primary.main',
            fontSize: isDrawer ? '0.9rem' : '0.96rem',
            fontWeight: 650,
            lineHeight: 1,
          }}
        >
          {formatPrice(price)}
        </Typography>

        {compareAtPrice ? (
          <Typography
            color="text.secondary"
            sx={{
              fontSize: isDrawer ? '0.76rem' : '0.8rem',
              fontWeight: 450,
              lineHeight: 1,
              opacity: 0.72,
              mx: 1,
              textDecoration: 'line-through',
            }}
          >
            {formatPrice(compareAtPrice)}
          </Typography>
        ) : null}
      </Stack>

      {discountLabel ? (
        <Typography
          sx={{
            color: 'secondary.main',
            fontSize: isDrawer ? '0.74rem' : '0.78rem',
            fontWeight: 550,
            lineHeight: 1,
          }}
        >
          {discountLabel}
        </Typography>
      ) : null}
    </Stack>
  )
}

function ProductImage({ imageSize, isDrawer, item }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: '#f4efe8',
        border: '1px solid',
        borderColor: 'rgba(31, 41, 55, 0.1)',
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
        <ShoppingBagOutlinedIcon sx={{ color: 'text.secondary', fontSize: isDrawer ? 28 : 34 }} />
      )}
    </Box>
  )
}

function VariantDetails({ details, isDrawer }) {
  if (!details.length) {
    return null
  }

  return (
    <Typography
      color="text.secondary"
      sx={{
        fontSize: isDrawer ? '0.76rem' : '0.82rem',
        fontWeight: 450,
        lineHeight: 1.45,
        overflowWrap: 'anywhere',
      }}
    >
      {details
        .map((detail) => (detail.label ? `${detail.label}: ${detail.value}` : detail.value))
        .join(' / ')}
    </Typography>
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
  const buttonSize = isDrawer ? 28 : 30

  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={0.7}
      sx={{ height: buttonSize }}
    >
      <IconButton
        aria-label={`Decrease ${item.name || 'item'} quantity`}
        disabled={disabled || loading}
        onClick={() => onDecrease(item)}
        sx={{
          bgcolor: '#f8f5f0',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          color: 'text.primary',
          height: buttonSize,
          width: buttonSize,
          '&:hover': {
            bgcolor: '#f1ece4',
            borderColor: 'rgba(31, 41, 55, 0.2)',
          },
          '& svg': { fontSize: isDrawer ? 15 : 16 },
        }}
      >
        <RemoveRoundedIcon />
      </IconButton>

      <Typography
        component="span"
        sx={{
          alignItems: 'center',
          color: 'text.primary',
          display: 'flex',
          fontSize: isDrawer ? '0.86rem' : '0.9rem',
          fontWeight: 650,
          height: buttonSize,
          justifyContent: 'center',
          lineHeight: 1,
          minWidth: 20,
          textAlign: 'center',
        }}
      >
        {item.quantity}
      </Typography>

      <IconButton
        aria-label={`Increase ${item.name || 'item'} quantity`}
        disabled={disabled || loading}
        onClick={() => onIncrease(item)}
        sx={{
          bgcolor: '#f8f5f0',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          color: 'text.primary',
          height: buttonSize,
          width: buttonSize,
          '&:hover': {
            bgcolor: '#f1ece4',
            borderColor: 'rgba(31, 41, 55, 0.2)',
          },
          '& svg': { fontSize: isDrawer ? 15 : 16 },
        }}
      >
        <AddRoundedIcon />
      </IconButton>
    </Stack>
  )
}

function FieldLabel({ children }) {
  return (
    <Typography
      color="text.secondary"
      sx={{
        fontSize: '0.72rem',
        fontWeight: 550,
        letterSpacing: 0,
        lineHeight: 1.2,
      }}
    >
      {children}
    </Typography>
  )
}

function RemoveButton({ disabled, isDrawer, item, loading, onRemove }) {
  return (
    <IconButton
      aria-label={`Remove ${item.name || 'item'}`}
      disabled={disabled || loading}
      onClick={() => onRemove(item)}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        color: 'text.secondary',
        height: isDrawer ? 28 : 30,
        width: isDrawer ? 28 : 30,
        '&:hover': {
          bgcolor: 'rgba(185, 70, 49, 0.06)',
          borderColor: 'secondary.main',
          color: 'secondary.main',
        },
      }}
    >
      <DeleteOutlineRoundedIcon sx={{ fontSize: isDrawer ? 15 : 16 }} />
    </IconButton>
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
  const detailItems = parseVariantDetails(item.variantLabel || '')
  const imageSize = isDrawer ? 72 : isDesktop ? 92 : 84

  if (!isDrawer) {
    return (
      <Paper
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'rgba(31, 41, 55, 0.12)',
          borderRadius: 2,
          boxShadow: 'none',
          overflow: 'hidden',
          transition: 'background-color 180ms ease, border-color 180ms ease',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            borderColor: 'rgba(31, 41, 55, 0.24)',
          },
        }}
        variant="outlined"
      >
        <Stack spacing={isDesktop ? 1.8 : 1.5} sx={{ p: isDesktop ? 2.25 : 1.6 }}>
          <Stack
            alignItems="flex-start"
            direction="row"
            spacing={1.6}
            sx={{ minWidth: 0, width: '100%' }}
          >
            <ProductImage imageSize={imageSize} isDrawer={false} item={item} />

            <Stack spacing={0.65} sx={{ minWidth: 0, pt: 0.35 }}>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: isDesktop ? '0.98rem' : '0.94rem',
                  fontWeight: 600,
                  lineHeight: 1.32,
                  overflowWrap: 'anywhere',
                }}
              >
                {item.name}
              </Typography>

              <VariantDetails details={detailItems} isDrawer={false} />

              <CartItemPrice item={item} isDrawer={false} />
            </Stack>
          </Stack>

          <Stack
            alignItems="center"
            direction="row"
            spacing={1.2}
            sx={{
              borderColor: 'divider',
              borderTop: '1px solid',
              pt: isDesktop ? 1.55 : 1.4,
              width: '100%',
            }}
          >
            <Stack spacing={0.16}>
              <FieldLabel>Item total</FieldLabel>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: isDesktop ? '0.94rem' : '0.9rem',
                  fontWeight: 650,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatPrice(getCartLineTotal(item))}
              </Typography>
            </Stack>

            <Box sx={{ flex: 1 }} />

            <QuantityControl
              disabled={disabled}
              isDrawer={false}
              item={item}
              loading={loading}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />

            <RemoveButton
              disabled={disabled}
              isDrawer={false}
              item={item}
              loading={loading}
              onRemove={onRemove}
            />
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 'none',
        p: 1.35,
      }}
      variant="outlined"
    >
      <Stack spacing={1.3}>
        <Stack direction="row" spacing={1.15} sx={{ minWidth: 0, width: '100%' }}>
          <ProductImage imageSize={imageSize} isDrawer={isDrawer} item={item} />

          <Stack justifyContent="center" spacing={0.58} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '0.91rem',
                fontWeight: 600,
                lineHeight: 1.3,
                overflowWrap: 'anywhere',
              }}
            >
              {item.name}
            </Typography>

            <VariantDetails details={detailItems} isDrawer={isDrawer} />
            <CartItemPrice item={item} isDrawer={isDrawer} />
          </Stack>
        </Stack>

        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          sx={{
            borderColor: 'divider',
            borderTop: '1px solid',
            pt: 1.15,
            width: '100%',
          }}
        >
          <Stack spacing={0.16}>
            <FieldLabel>Item total</FieldLabel>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: '0.9rem',
                fontWeight: 650,
                whiteSpace: 'nowrap',
              }}
            >
              {formatPrice(getCartLineTotal(item))}
            </Typography>
          </Stack>

          <Box sx={{ flex: 1 }} />

          <Stack alignItems="center" direction="row" spacing={0.85}>
            <QuantityControl
              disabled={disabled}
              isDrawer={isDrawer}
              item={item}
              loading={loading}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />

            <RemoveButton
              disabled={disabled}
              isDrawer={isDrawer}
              item={item}
              loading={loading}
              onRemove={onRemove}
            />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default CartItemCard
