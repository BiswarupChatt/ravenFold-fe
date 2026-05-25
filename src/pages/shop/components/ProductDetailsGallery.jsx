import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  Box,
  Dialog,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import AppSlider from '../../../components/AppSlider.jsx'
import useScreenSize from '../../../hooks/useScreenSize.js'

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

const lightboxButtonSx = {
  bgcolor: 'rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.2)',
  },
}

const lightboxArrowSx = {
  ...lightboxButtonSx,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 4,
}

const zoomScales = [1, 1.32, 1.68, 2.05]
const maxZoomStep = zoomScales.length - 1

function ProductImageTile({ image, onOpen, productName }) {
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
          alt={productName}
          component="img"
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
    </Box>
  )
}

function GalleryLightbox({
  activeIndex,
  images,
  onClose,
  onIndexChange,
  open,
  productName,
}) {
  const [zoomStep, setZoomStep] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const pointerStartRef = useRef(null)
  const panStartRef = useRef({ x: 0, y: 0 })
  const activeImage = images[activeIndex]
  const hasMultipleImages = images.length > 1
  const isZoomed = zoomStep > 0
  const zoomScale = zoomScales[zoomStep]

  const resetZoom = () => {
    setZoomStep(0)
    setPanOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (!open || !hasMultipleImages) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        resetZoom()
        onIndexChange((activeIndex + 1) % images.length)
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        resetZoom()
        onIndexChange((activeIndex - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, hasMultipleImages, images.length, onIndexChange, open])

  if (!activeImage) {
    return null
  }

  const handlePrevious = () => {
    if (!hasMultipleImages) {
      return
    }

    onIndexChange((activeIndex - 1 + images.length) % images.length)
    resetZoom()
  }

  const handleNext = () => {
    if (!hasMultipleImages) {
      return
    }

    onIndexChange((activeIndex + 1) % images.length)
    resetZoom()
  }

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    if (isZoomed) {
      panStartRef.current = panOffset
      setIsDragging(true)
      return
    }

    setIsDragging(true)
  }

  const handlePointerMove = (event) => {
    if (!pointerStartRef.current) {
      return
    }

    const deltaX = event.clientX - pointerStartRef.current.x
    const deltaY = event.clientY - pointerStartRef.current.y

    if (isZoomed) {
      setPanOffset({
        x: panStartRef.current.x + deltaX,
        y: panStartRef.current.y + deltaY,
      })
      return
    }

    setDragOffset(deltaX * 0.82)
  }

  const advanceZoom = () => {
    const nextZoomStep = zoomStep >= maxZoomStep ? 0 : zoomStep + 1

    setZoomStep(nextZoomStep)

    if (zoomStep === 0 || nextZoomStep === 0) {
      setPanOffset({ x: 0, y: 0 })
    }
  }

  const handlePointerEnd = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (!pointerStartRef.current) {
      setDragOffset(0)
      setIsDragging(false)
      return
    }

    const deltaX = event.clientX - pointerStartRef.current.x
    const deltaY = event.clientY - pointerStartRef.current.y
    const moveDistance = Math.hypot(deltaX, deltaY)
    const isTap = moveDistance <= 8

    pointerStartRef.current = null
    setDragOffset(0)
    setIsDragging(false)

    if (isTap) {
      advanceZoom()
      return
    }

    if (isZoomed) {
      return
    }

    if (Math.abs(deltaX) < 52 || !hasMultipleImages) {
      return
    }

    if (deltaX < 0) {
      handleNext()
    } else {
      handlePrevious()
    }
  }

  const handleNavigationPointerDown = (event) => {
    event.stopPropagation()
  }

  const handleDotClick = (event, index) => {
    event.stopPropagation()
    onIndexChange(index)
    resetZoom()
  }

  return (
    <Dialog
      fullScreen
      maxWidth={false}
      onClose={onClose}
      open={open}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(17, 24, 39, 0.72)',
          },
        },
        paper: {
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            height: '100dvh',
            m: 0,
            maxHeight: 'none',
            maxWidth: 'none',
            overflow: 'hidden',
            width: '100vw',
          },
        },
      }}
    >
      <Box
        sx={{
          height: '100dvh',
          overflow: 'hidden',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          width: '100vw',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 12, sm: 24 },
            top: { xs: 12, sm: 24 },
            zIndex: 4,
          }}
        >
          <Tooltip title="Close">
            <IconButton aria-label="Close image overlay" onClick={onClose} sx={lightboxButtonSx}>
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          onPointerDown={handlePointerDown}
          onPointerCancel={handlePointerEnd}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          sx={{
            alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            touchAction: 'none',
            width: '100%',
            '& *': {
              scrollbarWidth: 'none',
            },
            '& *::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {hasMultipleImages ? (
            <IconButton
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation()
                handlePrevious()
              }}
              onPointerDown={handleNavigationPointerDown}
              sx={{
                ...lightboxArrowSx,
                left: { xs: 12, sm: 24 },
              }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          ) : null}

          <Box
            sx={{
              display: 'flex',
              height: '100%',
              transform: `translate3d(calc(${-activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
              transition: isDragging
                ? 'none'
                : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
              width: '100%',
            }}
          >
            {images.map((image, index) => (
              <Box
                key={image}
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flex: '0 0 100%',
                  height: '100%',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <Box
                  alt={`${productName} ${index + 1}`}
                  component="img"
                  draggable={false}
                  src={image}
                  sx={{
                    cursor: isDragging
                      ? 'grabbing'
                      : zoomStep >= maxZoomStep
                        ? 'zoom-out'
                        : 'zoom-in',
                    display: 'block',
                    maxHeight: { xs: '82dvh', sm: '86dvh' },
                    maxWidth: { xs: '88vw', sm: '82vw' },
                    objectFit: 'contain',
                    pointerEvents: index === activeIndex ? 'auto' : 'none',
                    transform: index === activeIndex
                      ? `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`
                      : 'translate3d(0, 0, 0) scale(1)',
                    transition: isDragging
                      ? 'none'
                      : 'transform 340ms cubic-bezier(0.22, 1, 0.36, 1)',
                    userSelect: 'none',
                  }}
                />
              </Box>
            ))}
          </Box>

          {hasMultipleImages ? (
            <IconButton
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation()
                handleNext()
              }}
              onPointerDown={handleNavigationPointerDown}
              sx={{
                ...lightboxArrowSx,
                right: { xs: 12, sm: 24 },
              }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>
          ) : null}

          {hasMultipleImages ? (
            <Box
              sx={{
                bottom: { xs: 18, sm: 26 },
                display: 'flex',
                gap: 0.8,
                justifyContent: 'center',
                left: '50%',
                position: 'absolute',
                transform: 'translateX(-50%)',
                zIndex: 4,
              }}
            >
              {images.map((image, index) => (
                <Box
                  aria-label={`Show image ${index + 1}`}
                  component="button"
                  key={image}
                  onClick={(event) => handleDotClick(event, index)}
                  onPointerDown={handleNavigationPointerDown}
                  sx={{
                    bgcolor: index === activeIndex
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.42)',
                    border: 0,
                    borderRadius: 999,
                    cursor: 'pointer',
                    height: 7,
                    p: 0,
                    transition: 'background-color 180ms ease, width 180ms ease',
                    width: index === activeIndex ? 22 : 7,
                  }}
                  type="button"
                />
              ))}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Dialog>
  )
}

function ProductDetailsGallery({ product, variants }) {
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
    <GalleryLightbox
      activeIndex={lightboxActiveIndex}
      images={images}
      onClose={() => setIsLightboxOpen(false)}
      onIndexChange={setActiveImageIndex}
      open={isLightboxOpen}
      productName={product?.name}
    />
  ) : null

  if (isMobile || isTab) {
    return (
      <>
        <AppSlider
          getKey={(page, index) => page.map((item) => item.key).join('|') || `page-${index}`}
          items={sliderPages}
          renderItem={(page) => (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: isTab ? 'repeat(2, minmax(0, 1fr))' : '1fr',
              }}
            >
              {page.map((item) => (
                <ProductImageTile
                  image={item.image}
                  key={item.key}
                  onOpen={() => handleOpenLightbox(item.imageIndex)}
                  productName={product?.name}
                />
              ))}
            </Box>
          )}
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
        }}
      >
        {desktopImages.map((item) => (
          <ProductImageTile
            image={item.image}
            key={item.key}
            onOpen={() => handleOpenLightbox(item.imageIndex)}
            productName={product?.name}
          />
        ))}
      </Box>

      {lightbox}
    </>
  )
}

export default ProductDetailsGallery
