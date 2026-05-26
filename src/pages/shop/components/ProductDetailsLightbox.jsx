import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Box } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppOverlayDialog from '../../../components/AppOverlayDialog.jsx'
import AppSlider from '../../../components/AppSlider.jsx'

const wrapIndex = (index, length) => ((index % length) + length) % length

function ProductDetailsLightbox({
  activeIndex,
  images,
  onClose,
  onIndexChange,
  open,
  productName,
}) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const pointerStartRef = useRef(null)
  const panStartRef = useRef({ x: 0, y: 0 })
  const activeImage = images[activeIndex]
  const hasMultipleImages = images.length > 1
  const {
    advanceZoom: advanceSliderZoom,
    isMaxZoom,
    isZoomed,
    resetZoom: resetSliderZoom,
    zoomScale,
  } = AppSlider.useZoom()
  const slides = useMemo(() => (
    images.map((image, index) => ({ image, index }))
  ), [images])

  const resetZoom = useCallback(() => {
    resetSliderZoom()
    setPanOffset({ x: 0, y: 0 })
  }, [resetSliderZoom])

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
    const nextZoomStep = advanceSliderZoom()

    if (!isZoomed || nextZoomStep === 0) {
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

  return (
    <AppOverlayDialog
      closeButtonLabel="Close image overlay"
      closeButtonSx={AppSlider.overlayButtonSx}
      onClose={onClose}
      open={open}
    >
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
        <AppSlider
          activeDotIndex={activeIndex}
          activeDotSx={AppSlider.overlayActiveDotSx}
          activeIndex={activeIndex}
          arrowButtonProps={{ onPointerDown: handleNavigationPointerDown }}
          dotButtonProps={{ onPointerDown: handleNavigationPointerDown }}
          dotItems={images}
          dotsSx={AppSlider.overlayDotsSx}
          dotSx={AppSlider.overlayDotSx}
          dragOffset={hasMultipleImages ? dragOffset : 0}
          gap={0}
          getDotKey={(image) => image}
          getKey={(slide) => `${slide.index}-${slide.image}`}
          hideDots={!hasMultipleImages}
          isDragging={isDragging}
          items={slides}
          mode="translate"
          nextIcon={<ChevronRightRoundedIcon />}
          nextLabel="Next image"
          onDotClick={(index) => goToIndex(index)}
          onNext={(event) => {
            event.stopPropagation()
            goToIndex(activeIndex + 1)
          }}
          onPrevious={(event) => {
            event.stopPropagation()
            goToIndex(activeIndex - 1)
          }}
          previousIcon={<ChevronLeftRoundedIcon />}
          previousLabel="Previous image"
          renderItem={(slide) => {
            const isActive = slide.index === activeIndex

            return (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
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
                    cursor: isDragging ? 'grabbing' : isMaxZoom ? 'zoom-out' : 'zoom-in',
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
          }}
          rootSx={{ height: '100%', width: '100%' }}
          showArrows={hasMultipleImages}
          slideSx={{ height: '100%', width: '100%' }}
          spacing={0}
          trackSx={{ height: '100%', width: '100%' }}
        />
      </Box>
    </AppOverlayDialog>
  )
}

export default ProductDetailsLightbox
