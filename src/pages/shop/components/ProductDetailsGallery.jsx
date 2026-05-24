import { Box, Typography } from '@mui/material'
import AppSlider from '../../../components/AppSlider.jsx'
import useScreenSize from '../../../hooks/useScreenSize.js'

const getGalleryImages = (product, variants = []) => {
  const productImages = Array.isArray(product?.images) ? product.images : []
  const variantImages = variants.flatMap((variant) => (
    Array.isArray(variant.images) ? variant.images : []
  ))

  return [...new Set([...productImages, ...variantImages].filter(Boolean))]
}

function ProductImageTile({ image, productName }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        aspectRatio: '1 / 1',
        bgcolor: '#f0ece8',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {image ? (
        <Box
          alt={productName}
          component="img"
          src={image}
          sx={{
            display: 'block',
            height: '86%',
            maxWidth: '88%',
            objectFit: 'contain',
            width: '100%',
          }}
        />
      ) : (
        <Typography color="text.secondary" fontWeight={700}>
          Product image
        </Typography>
      )}
    </Box>
  )
}

function ProductDetailsGallery({ product, variants }) {
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const images = getGalleryImages(product, variants)
  const galleryImages = images.length ? images : [null]
  const galleryColumns = isTab || isDesktop
    ? 'repeat(2, minmax(0, 1fr))'
    : '1fr'
  const visibleImages = isTab
    ? galleryImages.slice(0, 2)
    : galleryImages.slice(0, 4)

  if (isMobile) {
    return (
      <AppSlider
        getKey={(image, index) => image || `placeholder-${index}`}
        items={galleryImages}
        renderItem={(image) => (
          <ProductImageTile image={image} productName={product?.name} />
        )}
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: galleryColumns,
      }}
    >
      {visibleImages.map((image, index) => (
        <ProductImageTile
          image={image}
          key={image || `placeholder-${index}`}
          productName={product?.name}
        />
      ))}
    </Box>
  )
}

export default ProductDetailsGallery
