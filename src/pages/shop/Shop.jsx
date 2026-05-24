import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../../components/PageIntro.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../../services/apiClient.js'
import {
  addCartItem,
  mapServerCartItems,
} from '../../services/cartApi.js'
import { getProducts, getProductVariants } from '../../services/productApi.js'
import { errorToast, successToast } from '../../services/toast.js'
import { selectIsAuthenticated } from '../../store/authSlice.js'
import { addItem, replaceCartItems } from '../../store/cartSlice.js'
import {
  selectWishlistItems,
  toggleWishlistItem,
} from '../../store/wishlistSlice.js'

const productLimit = 12

const emptyPagination = {
  hasNextPage: false,
  hasPrevPage: false,
  limit: productLimit,
  page: 1,
  total: 0,
  totalPages: 0,
}

const toNumber = (value) => {
  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : 0
}

const getPrimaryImage = (product) => {
  if (!Array.isArray(product.images) || !product.images.length) {
    return ''
  }

  const [primaryImage] = product.images

  if (typeof primaryImage === 'string') {
    return primaryImage
  }

  return primaryImage?.url || ''
}

const getMaterial = (product) => {
  if (!Array.isArray(product.attributes)) {
    return ''
  }

  const material = product.attributes.find(
    (attribute) => attribute.name?.toLowerCase() === 'material',
  )

  return material?.value || ''
}

const getVariantLabel = (variant) => {
  if (!Array.isArray(variant.optionValues) || !variant.optionValues.length) {
    return ''
  }

  return variant.optionValues
    .map((option) => `${option.optionName}: ${option.value}`)
    .join(', ')
}

const mapBackendProductToCard = (product) => {
  const basePrice = toNumber(product.basePrice)
  const salePrice =
    product.salePrice === null || product.salePrice === undefined
      ? null
      : toNumber(product.salePrice)
  const hasSalePrice = salePrice !== null && salePrice < basePrice
  const categoryLabel =
    product.category?.name ||
    product.categoryName ||
    product.tags?.[0] ||
    'Raven Fold'

  return {
    ...product,
    badge: product.isFeatured ? 'Featured' : '',
    badgeColor: hasSalePrice ? '#b30000' : undefined,
    category: categoryLabel,
    categoryData: product.category,
    collection: categoryLabel,
    compareAtPrice: hasSalePrice ? basePrice : 0,
    description: product.shortDescription || product.description || '',
    id: product.id || product._id || product.slug,
    image: getPrimaryImage(product),
    material: getMaterial(product),
    price: hasSalePrice ? salePrice : basePrice,
    productId: product.id || product._id,
    variantId: '',
  }
}

function Shop() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDesktop } = useScreenSize()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const wishlistItems = useSelector(selectWishlistItems)
  const [catalogProducts, setCatalogProducts] = useState([])
  const [pagination, setPagination] = useState(emptyPagination)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isActive = true

    const loadProducts = async () => {
      setLoading(true)
      setLoadError('')

      try {
        const productData = await getProducts({
          limit: productLimit,
          page,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        })

        if (!isActive) {
          return
        }

        setCatalogProducts(productData.items)
        setPagination(productData.pagination)
      } catch (error) {
        if (!isActive) {
          return
        }

        const message = getApiErrorMessage(error)

        setCatalogProducts([])
        setLoadError(message)
        setPagination({ ...emptyPagination, page })
        errorToast(message)
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [page])

  const products = useMemo(
    () => catalogProducts.map(mapBackendProductToCard),
    [catalogProducts],
  )

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems],
  )

  const resolveCartProduct = async (product) => {
    if (!product.hasVariants || product.variantId) {
      return product
    }

    const variantData = await getProductVariants(product.productId || product.id, {
      limit: 1,
    })
    const [variant] = variantData.items

    if (!variant) {
      throw new Error('This product does not have an active variant to add.')
    }

    const variantBasePrice = Number(variant.price || product.price || 0)
    const variantSalePrice =
      variant.salePrice === null || variant.salePrice === undefined
        ? null
        : Number(variant.salePrice)
    const hasVariantSalePrice =
      variantSalePrice !== null && variantSalePrice < variantBasePrice
    const variantImage = Array.isArray(variant.images) && variant.images[0]
      ? variant.images[0]
      : product.image

    return {
      ...product,
      compareAtPrice: hasVariantSalePrice ? variantBasePrice : product.compareAtPrice,
      id: `${product.productId || product.id}:${variant.id}`,
      image: variantImage,
      price: hasVariantSalePrice ? variantSalePrice : variantBasePrice,
      productId: product.productId || product.id,
      sku: variant.sku || product.sku,
      variantId: variant.id,
      variantLabel: getVariantLabel(variant),
    }
  }

  const persistCartProduct = async (product) => {
    const cartProduct = await resolveCartProduct(product)

    if (!isAuthenticated) {
      dispatch(addItem(cartProduct))
      return cartProduct
    }

    const cart = await addCartItem({
      productId: cartProduct.productId || cartProduct.id,
      quantity: 1,
      variantId: cartProduct.variantId || '',
    })

    dispatch(replaceCartItems(mapServerCartItems(cart.items)))
    return cartProduct
  }

  const handleAddToCart = async (product) => {
    try {
      const cartProduct = await persistCartProduct(product)

      successToast(`${cartProduct.name} added to cart.`)
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }

  const handleBuyNow = async (product) => {
    try {
      const cartProduct = await persistCartProduct(product)

      successToast(`${cartProduct.name} added to cart.`)
      navigate('/cart')
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }

  const handleToggleWishlist = (product) => {
    const isWishlisted = wishlistIds.has(product.id)

    dispatch(toggleWishlistItem(product))
    successToast(
      isWishlisted
        ? `${product.name} removed from wishlist.`
        : `${product.name} added to wishlist.`,
    )
  }

  return (
    <Box sx={{ py: isDesktop ? 8 : 5 }}>
      <Container>
        <Stack spacing={4}>
          <Stack
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2.5}
          >
            <PageIntro
              eyebrow="Shop"
              sx={{ maxWidth: 640 }}
              title="All Products"
            />
          </Stack>

          {loadError ? (
            <Alert severity="error" sx={{ borderRadius: 1 }}>
              {loadError}
            </Alert>
          ) : null}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : products.length ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                  xl: 'repeat(4, minmax(0, 1fr))',
                },
              }}
            >
              {products.map((product) => (
                <ProductCard
                  isWishlisted={wishlistIds.has(product.id)}
                  key={product.id}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onToggleWishlist={handleToggleWishlist}
                  product={product}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                p: { xs: 3, md: 5 },
                textAlign: 'center',
              }}
            >
              <Typography fontWeight={800}>No products found</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                Try a different search term or sorting option.
              </Typography>
            </Box>
          )}

          {!loading && !loadError && pagination.totalPages > 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                color="primary"
                count={pagination.totalPages}
                onChange={(_, nextPage) => setPage(nextPage)}
                page={pagination.page}
                shape="rounded"
              />
            </Box>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}

export default Shop
