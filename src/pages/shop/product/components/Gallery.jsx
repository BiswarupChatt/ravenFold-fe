import { Box, Typography } from '@mui/material'
import { lazy, Suspense, useMemo, useState } from 'react'
import AppSlider from '../../../../components/AppSlider.jsx'
import useScreenSize from '../../../../hooks/useScreenSize.js'

const Lightbox = lazy(() => import('./Lightbox.jsx'))

const getImageUrl = (image) => {
  if (typeof image === 'string') {
    return image
  }

  return image?.url || image?.src || image?.secureUrl || ''
}

const getGalleryImages = (product, variants = []) => {
  const productImages = Array.isArray(product?.images) ? product.images : []
  const variantImages = variants.flatMap((variant) => (
    Array.isArray(variant.images) ? variant.images : []
  ))

  return [
    ...new Set(
      [...productImages, ...variantImages]
        .map(getImageUrl)
        .filter(Boolean),
    ),
  ]
}

const chunkItems = (items, size) => {
  const chunks = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function ImageTile({
  image,
  isDesktop = false,
  onOpen,
  overlayCount = 0,
  priority = false,
  productName,
}) {
  const isClickable = Boolean(image && onOpen)

  return (
    <Box
      component={isClickable ? 'button' : 'div'}
      onClick={isClickable ? onOpen : undefined}
      sx={{
        appearance: 'none',
        alignItems: 'center',
        aspectRatio: '1 / 1',
        bgcolor: '#f0ece8',
        border: 0,
        cursor: isClickable ? 'zoom-in' : 'default',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',
        p: 0,
        position: 'relative',
        maxWidth: isDesktop ? '100%' : 'min(100%, 420px)',
        mx: isDesktop ? 0 : 'auto',
        width: '100%',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
      type={isClickable ? 'button' : undefined}
    >
      {image ? (
        <Box
          alt={productName || 'Product image'}
          component="img"
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          src={image}
          sx={{
            display: 'block',
            height: '86%',
            maxWidth: '88%',
            objectFit: 'contain',
            pointerEvents: 'none',
            width: '100%',
          }}
        />
      ) : (
        <Typography color="text.secondary" fontWeight={700}>
          Product image
        </Typography>
      )}

      {overlayCount > 0 ? (
        <Box
          sx={{
            alignItems: 'center',
            bgcolor: 'rgba(17, 24, 39, 0.75)',
            display: 'flex',
            inset: 0,
            justifyContent: 'center',
            pointerEvents: 'none',
            position: 'absolute',
          }}
        >
          <Typography
            component="span"
	            sx={{
	              color: 'rgba(255, 255, 255, 0.8)',
	              fontSize: isDesktop ? '3.15rem' : '2.8rem',
              fontWeight: 500,
              letterSpacing: 0,
              lineHeight: 1,
              textShadow: [
                '0 2px 8px rgba(0, 0, 0, 0.34)',
                '0 14px 34px rgba(0, 0, 0, 0.42)',
              ].join(', '),
            }}
          >
            +{overlayCount}
          </Typography>
        </Box>
      ) : null}
    </Box>
  )
}

function Gallery({ product, variants }) {
  const { isDesktop, isMobile, isTab } = useScreenSize()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const images = useMemo(() => getGalleryImages(product, variants), [product, variants])
  const galleryItems = useMemo(() => (
    images.length
      ? images.map((image, index) => ({
          image,
          imageIndex: index,
          key: image,
        }))
      : [{
          image: null,
          imageIndex: -1,
          key: 'placeholder-0',
        }]
  ), [images])
  const desktopImages = galleryItems.slice(0, 4)
  const desktopRemainingCount = Math.max(images.length - desktopImages.length, 0)
  const sliderPages = isTab
    ? chunkItems(galleryItems, 2)
    : galleryItems.map((item) => [item])
  const lightboxActiveIndex = images.length
    ? Math.min(activeImageIndex, images.length - 1)
    : 0

  const handleOpenLightbox = (index) => {
    if (index < 0 || !images.length) {
      return
    }

    setActiveImageIndex(index)
    setIsLightboxOpen(true)
  }

  const lightbox = isLightboxOpen ? (
    <Suspense fallback={null}>
      <Lightbox
        activeIndex={lightboxActiveIndex}
        images={images}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setActiveImageIndex}
        open={isLightboxOpen}
        productName={product?.name}
      />
    </Suspense>
  ) : null

  if (isMobile || isTab) {
    return (
      <>
        <AppSlider
          gap={0}
          getKey={(page, index) => page.map((item) => item.key).join('|') || `page-${index}`}
          items={sliderPages}
          renderItem={(page) => (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: isTab ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                maxWidth: '100%',
                minWidth: 0,
                width: '100%',
              }}
            >
              {page.map((item) => (
	                <ImageTile
	                  image={item.image}
	                  isDesktop={isDesktop}
	                  key={item.key}
                  onOpen={() => handleOpenLightbox(item.imageIndex)}
                  priority={item.imageIndex === 0}
                  productName={product?.name}
                />
              ))}
            </Box>
          )}
          rootSx={{
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
          slideSx={{
            maxWidth: '100%',
          }}
          viewportSx={{
            maxWidth: '100%',
          }}
        />

        {lightbox}
      </>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr',
          maxWidth: '100%',
          minWidth: 0,
          width: '100%',
        }}
      >
        {desktopImages.map((item, index) => (
	          <ImageTile
	            image={item.image}
	            isDesktop={isDesktop}
	            key={item.key}
            onOpen={() => handleOpenLightbox(item.imageIndex)}
            overlayCount={index === desktopImages.length - 1 ? desktopRemainingCount : 0}
            priority={item.imageIndex === 0}
            productName={product?.name}
          />
        ))}
      </Box>

      {lightbox}
    </>
  )
}

export default Gallery
