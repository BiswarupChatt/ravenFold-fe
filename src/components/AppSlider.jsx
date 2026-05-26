import { Box, IconButton, Stack } from '@mui/material'
import { useCallback, useRef, useState } from 'react'

const appSliderOverlayButtonSx = {
  bgcolor: 'rgba(255, 255, 255, 0.12)',
  color: '#ffffff',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.2)',
  },
}

const appSliderOverlayArrowSx = {
  ...appSliderOverlayButtonSx,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 4,
}

const appSliderOverlayDotsSx = {
  bottom: { xs: 18, sm: 26 },
  left: '50%',
  position: 'absolute',
  transform: 'translateX(-50%)',
  width: 'max-content',
  zIndex: 4,
}

const appSliderOverlayDotSx = {
  bgcolor: 'rgba(255, 255, 255, 0.42)',
  height: 7,
  transition: 'background-color 180ms ease, width 180ms ease',
  width: 7,
}

const appSliderOverlayActiveDotSx = {
  bgcolor: '#ffffff',
  width: 22,
}

const appSliderZoomScales = [1, 1.5, 2.25, 3.5]

const toSxArray = (value) => {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function useAppSliderZoom(scales = appSliderZoomScales) {
  const [zoomStep, setZoomStep] = useState(0)
  const maxZoomStep = scales.length - 1
  const zoomScale = scales[zoomStep] || scales[0] || 1
  const isZoomed = zoomStep > 0
  const isMaxZoom = zoomStep >= maxZoomStep

  const resetZoom = useCallback(() => {
    setZoomStep(0)
  }, [])

  const advanceZoom = useCallback(() => {
    const nextZoomStep = isMaxZoom ? 0 : zoomStep + 1

    setZoomStep(nextZoomStep)
    return nextZoomStep
  }, [isMaxZoom, zoomStep])

  return {
    advanceZoom,
    isMaxZoom,
    isZoomed,
    maxZoomStep,
    resetZoom,
    setZoomStep,
    zoomScale,
    zoomScales: scales,
    zoomStep,
  }
}

function AppSlider({
  activeDotIndex,
  activeDotSx,
  activeIndex,
  arrowButtonProps,
  arrowSx,
  dotButtonProps,
  dotItems,
  dotSx,
  dotsSx,
  dragOffset = 0,
  gap = 1.5,
  getDotKey,
  getKey,
  hideDots = false,
  isDragging = false,
  items = [],
  mode = 'scroll',
  nextArrowSx,
  nextIcon,
  nextLabel = 'Next slide',
  onActiveIndexChange,
  onDotClick,
  onNext,
  onPrevious,
  previousArrowSx,
  previousIcon,
  previousLabel = 'Previous slide',
  renderItem,
  rootSx,
  slideSx,
  showArrows = false,
  spacing = 1.5,
  trackProps,
  trackSx,
  transition = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
  viewportSx,
}) {
  const trackRef = useRef(null)
  const [internalActiveIndex, setInternalActiveIndex] = useState(0)
  const currentIndex = activeIndex ?? internalActiveIndex
  const currentDotIndex = activeDotIndex ?? currentIndex
  const dots = dotItems ?? items
  const {
    onScroll: trackPropsOnScroll,
    sx: trackPropsSx,
    ...restTrackProps
  } = trackProps || {}

  if (!items.length) {
    return null
  }

  const setNextIndex = (nextIndex) => {
    if (activeIndex === undefined) {
      setInternalActiveIndex(nextIndex)
    }

    onActiveIndexChange?.(nextIndex)
  }

  const handleScroll = () => {
    const track = trackRef.current

    if (!track || mode !== 'scroll') {
      return
    }

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth)

    setNextIndex(Math.min(nextIndex, items.length - 1))
  }

  const handleDotClick = (event, index, item) => {
    dotButtonProps?.onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (onDotClick) {
      onDotClick(index, item, event)
      return
    }

    if (mode === 'scroll') {
      trackRef.current?.scrollTo({
        behavior: 'smooth',
        left: index * trackRef.current.clientWidth,
      })
      return
    }

    setNextIndex(index)
  }

  const handleTrackScroll = (event) => {
    trackPropsOnScroll?.(event)
    handleScroll()
  }

  const handleArrowClick = (event, action) => {
    arrowButtonProps?.onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    action?.(event)
  }

  const renderArrow = (direction) => {
    if (!showArrows) {
      return null
    }

    const isPrevious = direction === 'previous'
    const icon = isPrevious ? previousIcon : nextIcon

    if (!icon) {
      return null
    }

    return (
      <IconButton
        {...arrowButtonProps}
        aria-label={isPrevious ? previousLabel : nextLabel}
        onClick={(event) => handleArrowClick(event, isPrevious ? onPrevious : onNext)}
        sx={[
          appSliderOverlayArrowSx,
          isPrevious
            ? { left: { xs: 12, sm: 24 } }
            : { right: { xs: 12, sm: 24 } },
          ...toSxArray(arrowSx),
          ...toSxArray(isPrevious ? previousArrowSx : nextArrowSx),
          ...toSxArray(arrowButtonProps?.sx),
        ]}
      >
        {icon}
      </IconButton>
    )
  }

  return (
    <Stack
      spacing={spacing}
      sx={[
        {
          minWidth: 0,
          position: 'relative',
          width: '100%',
        },
        ...toSxArray(rootSx),
      ]}
    >
      {renderArrow('previous')}

      <Box
        onScroll={handleTrackScroll}
        ref={trackRef}
        sx={[
          {
            minWidth: 0,
            width: '100%',
          },
          mode === 'scroll'
            ? {
                msOverflowStyle: 'none',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }
            : {
                height: '100%',
                overflow: 'hidden',
              },
          ...toSxArray(viewportSx),
        ]}
      >
        <Box
          {...restTrackProps}
          sx={[
            {
              display: 'flex',
              gap,
              minWidth: 0,
              width: '100%',
            },
            mode === 'scroll'
              ? null
              : {
                  height: '100%',
                  transform: `translate3d(${-currentIndex * 100}%, 0, 0) translate3d(${dragOffset}px, 0, 0)`,
                  transition: isDragging ? 'none' : transition,
                  willChange: 'transform',
                },
            ...toSxArray(trackSx),
            ...toSxArray(trackPropsSx),
          ]}
        >
          {items.map((item, index) => (
            <Box
              key={getKey?.(item, index) || index}
              sx={[
                {
                  flex: '0 0 100%',
                  minWidth: 0,
                },
                mode === 'scroll'
                  ? {
                      scrollSnapAlign: 'start',
                    }
                  : null,
                ...toSxArray(slideSx),
              ]}
            >
              {renderItem(item, index)}
            </Box>
          ))}
        </Box>
      </Box>

      {renderArrow('next')}

      {!hideDots && dots.length > 1 ? (
        <Stack
          direction="row"
          justifyContent="center"
          spacing={0.75}
          sx={[
            {
              alignSelf: 'center',
              maxWidth: '100%',
              mx: 'auto',
              width: 'fit-content',
            },
            ...toSxArray(dotsSx),
          ]}
        >
          {dots.map((item, index) => (
            <Box
              {...dotButtonProps}
              component="button"
              onClick={(event) => handleDotClick(event, index, item)}
              aria-label={`Go to slide ${index + 1}`}
              key={getDotKey?.(item, index) || getKey?.(item, index) || index}
              sx={[
                {
                  bgcolor: index === currentDotIndex ? 'text.primary' : 'divider',
                  borderRadius: 999,
                  border: 0,
                  cursor: 'pointer',
                  height: 6,
                  p: 0,
                  width: index === currentDotIndex ? 18 : 6,
                },
                ...toSxArray(dotSx),
                ...(index === currentDotIndex ? toSxArray(activeDotSx) : []),
                ...toSxArray(dotButtonProps?.sx),
              ]}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}

AppSlider.overlayButtonSx = appSliderOverlayButtonSx
AppSlider.overlayArrowSx = appSliderOverlayArrowSx
AppSlider.overlayActiveDotSx = appSliderOverlayActiveDotSx
AppSlider.overlayDotSx = appSliderOverlayDotSx
AppSlider.overlayDotsSx = appSliderOverlayDotsSx
AppSlider.zoomScales = appSliderZoomScales
AppSlider.useZoom = useAppSliderZoom

export default AppSlider
