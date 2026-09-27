import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import heroImage from '../assets/hero-image.webp'
import ProductCard from '../components/ProductCard.jsx'
import useScreenSize from '../hooks/useScreenSize.js'
import { getProducts } from '../services/productApi.js'
import { defaultHomePageContent, getHomePage } from '../services/storefrontPageApi.js'
import { errorToast, successToast } from '../services/toast.js'
import {
  selectWishlistItems,
  toggleWishlistItem,
} from '../store/wishlistSlice.js'
import { getImageUrl, getPriceData, getPrimaryImage } from '../utils/utils.js'

const supportIconMap = {
  invoice: ReceiptLongOutlinedIcon,
  shield: ShieldOutlinedIcon,
  shipping: LocalShippingOutlinedIcon,
  support: SupportAgentOutlinedIcon,
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

const mapProductToCard = (product) => {
  const { compareAtPrice, price } = getPriceData(product)
  const categoryLabel =
    product.category?.name ||
    product.categoryName ||
    product.tags?.[0] ||
    'Raven Fold'

  return {
    ...product,
    badge: product.isFeatured ? 'Featured' : '',
    badgeColor: compareAtPrice ? '#b30000' : undefined,
    category: categoryLabel,
    categoryData: product.category,
    collection: categoryLabel,
    compareAtPrice,
    description: product.shortDescription || product.description || '',
    id: product.id || product._id || product.slug,
    image: getPrimaryImage(product) || getImageUrl(product.image),
    material: getMaterial(product),
    price,
    productId: product.id || product._id,
    variantId: '',
  }
}

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDesktop, isMobile } = useScreenSize()
  const wishlistItems = useSelector(selectWishlistItems)
  const [homeContent, setHomeContent] = useState(defaultHomePageContent)
  const [activeProductTab, setActiveProductTab] = useState(defaultHomePageContent.productSection.tabLabel)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    getHomePage()
      .then((page) => {
        if (!isActive) return
        const nextContent = page.content || defaultHomePageContent

        setHomeContent(nextContent)
        setActiveProductTab(nextContent.productSection?.tabLabel || defaultHomePageContent.productSection.tabLabel)
      })
      .catch(() => {
        if (isActive) {
          setHomeContent(defaultHomePageContent)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadProducts = async () => {
      setProductsLoading(true)

      try {
        const productData = await getProducts({
          limit: homeContent.productSection?.productLimit || 4,
          page: 1,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        })

        if (isActive) {
          setFeaturedProducts(productData.items.map(mapProductToCard))
        }
      } catch (error) {
        if (isActive) {
          setFeaturedProducts([])
          errorToast(error?.message || 'Unable to load new arrivals.')
        }
      } finally {
        if (isActive) {
          setProductsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [homeContent.productSection?.productLimit])

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems],
  )

  const handleViewProduct = (product) => {
    navigate(`/shop/${product.slug || product.productId || product.id}`)
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

  const hero = homeContent.hero || defaultHomePageContent.hero
  const promoStrip = homeContent.promoStrip || defaultHomePageContent.promoStrip
  const productSection = homeContent.productSection || defaultHomePageContent.productSection
  const testimonial = homeContent.testimonial || defaultHomePageContent.testimonial
  const supportCards = homeContent.supportCards || defaultHomePageContent.supportCards
  const finalCta = homeContent.finalCta || defaultHomePageContent.finalCta
  const productTabs = [productSection.tabLabel || defaultHomePageContent.productSection.tabLabel]

  return (
    <Box component="main" sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
      {hero.isActive ? (
      <Box
        component="section"
        sx={{
          alignItems: 'stretch',
          backgroundImage: [
            'linear-gradient(90deg, rgba(247, 244, 239, 0.98) 0%, rgba(247, 244, 239, 0.9) 34%, rgba(247, 244, 239, 0.34) 62%, rgba(247, 244, 239, 0.06) 100%)',
            `url(${hero.backgroundImageUrl || heroImage})`,
          ].join(', '),
          backgroundPosition: { xs: '62% center', md: 'center' },
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          color: 'text.primary',
          display: 'flex',
          minHeight: { xs: 560, md: 'min(700px, calc(100vh - 96px))' },
        }}
      >
        <Container sx={{ display: 'flex' }}>
          <Stack
            justifyContent="center"
            spacing={3}
            sx={{
              maxWidth: 760,
              py: { xs: 8, md: 11 },
            }}
          >
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '0.86rem', md: '0.95rem' },
                fontWeight: 650,
                letterSpacing: 0,
                textTransform: 'uppercase',
              }}
            >
              {hero.eyebrow}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '3.7rem', sm: '5.2rem', md: '7rem' },
                fontWeight: 500,
                letterSpacing: 0,
                lineHeight: 0.92,
                maxWidth: 760,
              }}
            >
              {hero.title}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.08rem' },
                lineHeight: 1.65,
                maxWidth: 520,
              }}
            >
              {hero.subtitle}
            </Typography>
            <Stack direction={isMobile ? 'column' : 'row'} spacing={1.5}>
              <Button
                component={RouterLink}
                endIcon={<ArrowForwardRoundedIcon />}
                size="large"
                sx={{
                  bgcolor: 'text.primary',
                  color: '#ffffff',
                  minHeight: 56,
                  px: 4,
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                }}
                to={hero.primaryCtaUrl || '/shop'}
                variant="contained"
              >
                {hero.primaryCtaLabel}
              </Button>
              <Button
                component={RouterLink}
                endIcon={<ArrowForwardRoundedIcon />}
                size="large"
                sx={{
                  color: 'text.primary',
                  minHeight: 56,
                  px: 0,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  },
                }}
                to={hero.secondaryCtaUrl || '/contacts'}
                variant="text"
              >
                {hero.secondaryCtaLabel}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      ) : null}

      {promoStrip.isActive && promoStrip.items?.length ? (
      <Box
        component="section"
        sx={{
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          '@keyframes ravenFoldPromoMarquee': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: 'ravenFoldPromoMarquee 26s linear infinite',
            '&:hover': {
              animationPlayState: 'paused',
            },
            py: 1.7,
            whiteSpace: 'nowrap',
          }}
        >
          {[...promoStrip.items, ...promoStrip.items].map((item, index) => (
            <Stack
              alignItems="center"
              direction="row"
              key={`${item}-${index}`}
              spacing={{ xs: 2, md: 5 }}
              sx={{
                flex: '0 0 auto',
                px: { xs: 2, md: 3.5 },
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { xs: '0.84rem', md: '0.9rem' },
                  fontWeight: 650,
                }}
              >
                {item}
              </Typography>
              <BoltOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </Stack>
          ))}
        </Box>
      </Box>
      ) : null}

      {productSection.isActive ? (
      <Box component="section" sx={{ bgcolor: 'background.default', py: { xs: 5, md: 8 } }}>
        <Container>
          <Stack spacing={{ xs: 3, md: 5 }}>
            <Box
              sx={{
                minHeight: { xs: 'auto', md: 54 },
                mt: { xs: 0, md: -1.5 },
                position: 'relative',
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                spacing={{ xs: 1, md: 1.5 }}
                sx={{
                  flexWrap: 'wrap',
                  left: { md: '50%' },
                  position: { md: 'absolute' },
                  rowGap: 1,
                  top: { md: 0 },
                  transform: { md: 'translateX(-50%)' },
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                {productTabs.map((tab) => {
                  const isActive = activeProductTab === tab

                  return (
                    <Button
                      key={tab}
                      onClick={() => setActiveProductTab(tab)}
                      sx={{
                        borderBottom: isActive ? '1px solid currentColor' : '1px solid transparent',
                        borderRadius: 0,
                        color: isActive ? 'text.primary' : 'text.secondary',
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        fontWeight: isActive ? 750 : 600,
                        minHeight: 38,
                        minWidth: 0,
                        px: { xs: 0.5, md: 1 },
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'text.primary',
                        },
                      }}
                      type="button"
                      variant="text"
                    >
                      {tab}
                    </Button>
                  )
                })}
              </Stack>
            </Box>

            <Box
              sx={{
                alignItems: { xs: 'flex-start', md: 'flex-end' },
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
                rowGap: 2,
                width: '100%',
              }}
            >
              <Stack spacing={1} sx={{ maxWidth: 880 }}>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {productSection.eyebrow}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: '2.4rem', md: '3.35rem' },
                    fontWeight: 500,
                    letterSpacing: 0,
                    lineHeight: 1,
                  }}
                >
                  {productSection.title}
                </Typography>
              </Stack>

              <Button
                component={RouterLink}
                endIcon={<ArrowForwardRoundedIcon />}
                size="small"
                sx={{
                  alignSelf: { xs: 'flex-start', md: 'end' },
                  bgcolor: 'text.primary',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  justifySelf: { xs: 'start', md: 'end' },
                  lineHeight: 1,
                  minHeight: 34,
                  px: 1.6,
                  py: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                }}
                to={productSection.buttonUrl || '/shop'}
                variant="contained"
              >
                {productSection.buttonLabel}
              </Button>
            </Box>

            {productsLoading ? (
              <Typography color="text.secondary">Loading new arrivals...</Typography>
            ) : featuredProducts.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gap: { xs: 2.5, md: 3.5 },
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
                }}
              >
                {featuredProducts.map((product) => (
                  <ProductCard
                    isWishlisted={wishlistIds.has(product.id)}
                    key={product.id}
                    onToggleWishlist={handleToggleWishlist}
                    onViewProduct={handleViewProduct}
                    product={product}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  py: { xs: 5, md: 7 },
                  textAlign: 'center',
                }}
              >
                <Typography color="text.secondary">
                  New arrivals will appear here once products are published.
                </Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
      ) : null}

      {testimonial.isActive ? (
      <Box
        component="section"
        sx={{
          bgcolor: 'background.paper',
          py: { xs: 6, md: 9 },
        }}
      >
        <Container>
          <Stack
            alignItems="center"
            spacing={2.5}
            sx={{ mx: 'auto', maxWidth: 980, textAlign: 'center', width: '100%' }}
          >
            <FormatQuoteRoundedIcon sx={{ color: 'primary.main', fontSize: 56 }} />
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 450,
                letterSpacing: 0,
                lineHeight: 1.25,
              }}
            >
              "{testimonial.quote}"
            </Typography>
            <Stack alignItems="center" spacing={1} sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.4,
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {Array.from({ length: Math.round(testimonial.rating || 5) }).map((_, index) => (
                  <StarRoundedIcon
                    key={index}
                    sx={{ color: '#e19a00', fontSize: 20 }}
                  />
                ))}
              </Box>
              <Typography sx={{ fontWeight: 650 }}>
                {testimonial.author}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
      ) : null}

      {supportCards.isActive && supportCards.items?.length ? (
      <Box
        component="section"
        sx={{ bgcolor: 'background.default', py: { xs: 5, md: 6 } }}
      >
        <Container>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            {supportCards.items.map(({ description, icon, title }) => {
              const Icon = supportIconMap[icon] || ShieldOutlinedIcon

              return (
              <Box
                key={title}
                sx={{
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'grid',
                  gridTemplateRows: '42px 34px minmax(72px, auto)',
                  justifyItems: 'center',
                  minHeight: { xs: 220, md: 230 },
                  p: { xs: 2.5, md: 3.25 },
                  rowGap: 1.5,
                  textAlign: 'center',
                }}
              >
                <Icon sx={{ color: 'secondary.main', fontSize: 34 }} />
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.55 }}>
                  {description}
                </Typography>
              </Box>
              )
            })}
          </Box>
        </Container>
      </Box>
      ) : null}

      {finalCta.isActive ? (
      <Box component="section" sx={{ pb: { xs: 5, md: 8 } }}>
        <Container>
          <Box
            sx={{
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              columnGap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
              pt: { xs: 3, md: 4 },
              rowGap: 2,
              width: '100%',
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: '2.1rem', md: '3.25rem' },
                fontWeight: 650,
                letterSpacing: 0,
                lineHeight: 1,
              }}
            >
              {finalCta.title}
            </Typography>
            <Button
              component={RouterLink}
              endIcon={<ArrowForwardRoundedIcon />}
              size="small"
              sx={{
                bgcolor: 'text.primary',
                color: '#ffffff',
                fontSize: '0.88rem',
                justifySelf: { xs: 'start', md: 'end' },
                minHeight: 40,
                px: 2.2,
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: 'primary.main',
                },
              }}
              to={finalCta.buttonUrl || '/shop'}
              variant="contained"
            >
              {finalCta.buttonLabel}
            </Button>
          </Box>
        </Container>
      </Box>
      ) : null}
    </Box>
  )
}

export default Home
