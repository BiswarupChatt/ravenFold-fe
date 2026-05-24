import { Box, Typography } from '@mui/material'

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
        bgcolor: '#f0ece8',
        display: 'flex',
        justifyContent: 'center',
        minHeight: { xs: 340, md: 520 },
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
            height: '100%',
            maxHeight: { xs: 300, md: 470 },
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
  const images = getGalleryImages(product, variants)
  const galleryImages = images.length ? images.slice(0, 4) : [null]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {galleryImages.map((image, index) => (
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
