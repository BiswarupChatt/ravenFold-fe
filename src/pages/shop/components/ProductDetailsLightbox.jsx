import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Dialog, IconButton, Tooltip } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const buttonSx = {
  bgcolor: 'rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.2)',
  },
}

const arrowSx = {
  ...buttonSx,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 4,
}

const zoomScales = [1, 1.5, 2.25, 3.5]
const maxZoomStep = zoomScales.length - 1

const wrapIndex = (index, length) => ((index % length) + length) % length

function getVisibleSlides(images, activeIndex) {
  if (images.length <= 1) {
    return images.map((image, index) => ({ image, index, offset: 0 }))
  }

  return [-1, 0, 1].map((offset) => {
    const index = wrapIndex(activeIndex + offset, images.length)

    return {
      image: images[index],
      index,
      offset,
    }
  })
}

function ProductDetailsLightbox({
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
  const visibleSlides = useMemo(
    () => getVisibleSlides(images, activeIndex),
    [activeIndex, images],
  )

  const resetZoom = useCallback(() => {
    setZoomStep(0)
    setPanOffset({ x: 0, y: 0 })
  }, [])

  const goToIndex = useCallback((index) => {
    if (!images.length) {
      return
    }

    setDragOffset(0)
    setIsDragging(false)
    resetZoom()
    onIndexChange(wrapIndex(index, images.length))
  }, [images.length, onIndexChange, resetZoom])

  useEffect(() => {
    if (!open || !hasMultipleImages) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToIndex(activeIndex + 1)
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToIndex(activeIndex - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, goToIndex, hasMultipleImages, open])

  if (!activeImage) {
    return null
  }

  const advanceZoom = () => {
    const nextZoomStep = zoomStep >= maxZoomStep ? 0 : zoomStep + 1

    setZoomStep(nextZoomStep)

    if (zoomStep === 0 || nextZoomStep === 0) {
      setPanOffset({ x: 0, y: 0 })
    }
  }

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    if (isZoomed) {
      panStartRef.current = panOffset
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

    if (hasMultipleImages) {
      setDragOffset(deltaX * 0.82)
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

    pointerStartRef.current = null
    setDragOffset(0)
    setIsDragging(false)

    if (moveDistance <= 8) {
      advanceZoom()
      return
    }

    if (isZoomed || Math.abs(deltaX) < 52 || !hasMultipleImages) {
      return
    }

    goToIndex(activeIndex + (deltaX < 0 ? 1 : -1))
  }

  const handleNavigationPointerDown = (event) => {
    event.stopPropagation()
  }

  const slideTransform = hasMultipleImages
    ? `translate3d(calc(-100% + ${dragOffset}px), 0, 0)`
    : 'translate3d(0, 0, 0)'
  const zoomScale = zoomScales[zoomStep]

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
        <Box sx={{ position: 'absolute', right: { xs: 12, sm: 24 }, top: { xs: 12, sm: 24 }, zIndex: 4 }}>
          <Tooltip title="Close">
            <IconButton aria-label="Close image overlay" onClick={onClose} sx={buttonSx}>
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
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
                goToIndex(activeIndex - 1)
              }}
              onPointerDown={handleNavigationPointerDown}
              sx={{ ...arrowSx, left: { xs: 12, sm: 24 } }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>
          ) : null}

          <Box
            sx={{
              display: 'flex',
              height: '100%',
              transform: slideTransform,
              transition: isDragging ? 'none' : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
              width: '100%',
            }}
          >
            {visibleSlides.map((slide) => {
              const isActive = slide.index === activeIndex

              return (
                <Box
                  key={`${slide.index}-${slide.offset}-${slide.image}`}
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
                    alt={`${productName || 'Product image'} ${slide.index + 1}`}
                    component="img"
                    decoding="async"
                    draggable={false}
                    fetchPriority={isActive ? 'high' : 'auto'}
                    loading={isActive ? 'eager' : 'lazy'}
                    src={slide.image}
                    sx={{
                      cursor: isDragging ? 'grabbing' : zoomStep >= maxZoomStep ? 'zoom-out' : 'zoom-in',
                      display: 'block',
                      maxHeight: { xs: '82dvh', sm: '86dvh' },
                      maxWidth: { xs: '88vw', sm: '82vw' },
                      objectFit: 'contain',
                      pointerEvents: isActive ? 'auto' : 'none',
                      transform: isActive
                        ? `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`
                        : 'translate3d(0, 0, 0) scale(1)',
                      transition: isDragging ? 'none' : 'transform 340ms cubic-bezier(0.22, 1, 0.36, 1)',
                      userSelect: 'none',
                    }}
                  />
                </Box>
              )
            })}
          </Box>

          {hasMultipleImages ? (
            <IconButton
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation()
                goToIndex(activeIndex + 1)
              }}
              onPointerDown={handleNavigationPointerDown}
              sx={{ ...arrowSx, right: { xs: 12, sm: 24 } }}
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
                  onClick={(event) => {
                    event.stopPropagation()
                    goToIndex(index)
                  }}
                  onPointerDown={handleNavigationPointerDown}
                  sx={{
                    bgcolor: index === activeIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.42)',
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

export default ProductDetailsLightbox
