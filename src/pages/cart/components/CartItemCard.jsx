import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import formatPrice from '../../../utils/formatPrice.js'

const getLineTotal = (item = {}) => {
  if (item.lineTotal !== undefined && item.lineTotal !== null) {
    return Number(item.lineTotal || 0)
  }

  return Number(item.price || 0) * Number(item.quantity || 0)
}

const getPricing = (item = {}) => {
  const price = Number(item.price || item.priceSnapshot?.price || 0)
  const basePrice = Number(item.basePrice || item.compareAtPrice || item.priceSnapshot?.basePrice || 0)
  const compareAtPrice = basePrice > price ? basePrice : 0
  const discountAmount = compareAtPrice ? compareAtPrice - price : 0
  const discountPercent = Number(item.discountPercent || 0)
  const computedDiscountPercent = compareAtPrice
    ? Math.round((discountAmount / compareAtPrice) * 100)
    : 0

  return {
    compareAtPrice,
    discountAmount,
    discountPercent: discountPercent || computedDiscountPercent,
    price,
  }
}

const getVariantDetails = (variantLabel = '') => (
  variantLabel
    .split(',')
    .map((part) => {
      const [rawLabel, ...rawValue] = part.split(':')
      const label = rawValue.length ? rawLabel.trim() : ''
      const value = rawValue.length ? rawValue.join(':').trim() : rawLabel.trim()

      return { label, value }
    })
    .filter((detail) => detail.value)
)

function CartItemPrice({ isDrawer, item, stacked = false }) {
  const { compareAtPrice, discountAmount, discountPercent, price } = getPricing(item)
  const discountLabel = discountPercent
    ? `${discountPercent}% off`
    : discountAmount
      ? `${formatPrice(discountAmount)} off`
      : ''

  return (
    <Stack
      alignItems={stacked ? 'flex-start' : 'baseline'}
      direction={stacked ? 'column' : 'row'}
      flexWrap="wrap"
      gap={stacked ? 0.3 : 0.75}
    >
      <Stack alignItems="baseline" direction="row" flexWrap="wrap" gap={0.7}>
        <Typography
          sx={{
            color: 'primary.main',
            fontSize: isDrawer ? '0.9rem' : '0.96rem',
            fontWeight: 650,
            lineHeight: 1.2,
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
              opacity: 0.72,
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
            lineHeight: 1.2,
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
  const buttonSize = isDrawer ? 32 : 34

  return (
    <Stack alignItems="center" direction="row" spacing={0.8}>
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
          '& svg': { fontSize: isDrawer ? 17 : 18 },
        }}
      >
        <RemoveRoundedIcon />
      </IconButton>

      <Typography
        sx={{
          color: 'text.primary',
          fontSize: isDrawer ? '0.92rem' : '0.95rem',
          fontWeight: 650,
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
          '& svg': { fontSize: isDrawer ? 17 : 18 },
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
        height: isDrawer ? 34 : 38,
        width: isDrawer ? 34 : 38,
        '&:hover': {
          bgcolor: 'rgba(185, 70, 49, 0.06)',
          borderColor: 'secondary.main',
          color: 'secondary.main',
        },
      }}
    >
      <DeleteOutlineRoundedIcon sx={{ fontSize: isDrawer ? 18 : 20 }} />
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
  const detailItems = getVariantDetails(item.variantLabel || '')
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
        <Box
          sx={{
            alignItems: 'stretch',
            display: 'grid',
            gap: isDesktop ? 2.5 : 1.6,
            gridTemplateColumns: isDesktop ? 'minmax(0, 1fr) 142px 150px 38px' : '1fr',
            p: isDesktop ? 2.25 : 1.6,
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={1.6}
            sx={{ minHeight: isDesktop ? imageSize : 'auto', minWidth: 0 }}
          >
            <ProductImage imageSize={imageSize} isDrawer={false} item={item} />

            <Stack justifyContent="center" spacing={0.65} sx={{ minWidth: 0 }}>
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

              {!isDesktop ? <CartItemPrice item={item} isDrawer={false} /> : null}
            </Stack>
          </Stack>

          {isDesktop ? (
            <>
              <Stack
                justifyContent="center"
                spacing={0.55}
                sx={{ minHeight: imageSize }}
              >
                <FieldLabel>Price</FieldLabel>
                <CartItemPrice item={item} isDrawer={false} stacked />
              </Stack>

              <Stack
                justifyContent="center"
                spacing={0.65}
                sx={{ minHeight: imageSize }}
              >
                <FieldLabel>Quantity</FieldLabel>
                <QuantityControl
                  disabled={disabled}
                  isDrawer={false}
                  item={item}
                  loading={loading}
                  onDecrease={onDecrease}
                  onIncrease={onIncrease}
                />
              </Stack>

              <Stack
                alignItems="flex-end"
                justifyContent="center"
                sx={{ minHeight: imageSize }}
              >
                <RemoveButton
                  disabled={disabled}
                  isDrawer={false}
                  item={item}
                  loading={loading}
                  onRemove={onRemove}
                />
              </Stack>
            </>
          ) : (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={1.2}
              sx={{
                borderColor: 'divider',
                borderTop: '1px solid',
                pt: 1.4,
              }}
            >
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
          )}
        </Box>
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
          justifyContent="space-between"
          spacing={1}
          sx={{
            borderColor: 'divider',
            borderTop: '1px solid',
            pt: 1.15,
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
              {formatPrice(getLineTotal(item))}
            </Typography>
          </Stack>

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
