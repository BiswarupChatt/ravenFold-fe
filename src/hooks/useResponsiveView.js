import { useEffect, useState } from 'react'

export const ViewportSize = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
}

const BREAKPOINTS = {
  DESKTOP_MIN: 1024,
  MOBILE_MAX: 767,
  TABLET_MAX: 1023,
  TABLET_MIN: 768,
}

function getViewportSize(width) {
  if (width <= BREAKPOINTS.MOBILE_MAX) {
    return ViewportSize.MOBILE
  }

  if (width >= BREAKPOINTS.TABLET_MIN && width <= BREAKPOINTS.TABLET_MAX) {
    return ViewportSize.TABLET
  }

  return ViewportSize.DESKTOP
}

function createViewState(viewportSize) {
  return {
    isDesktop: viewportSize === ViewportSize.DESKTOP,
    isMobile: viewportSize === ViewportSize.MOBILE,
    isTablet: viewportSize === ViewportSize.TABLET,
    view: viewportSize,
  }
}

function getCurrentState() {
  if (typeof window === 'undefined') {
    return createViewState(ViewportSize.DESKTOP)
  }

  return createViewState(getViewportSize(window.innerWidth))
}

function useResponsiveView() {
  const [state, setState] = useState(getCurrentState)

  useEffect(() => {
    const handleResize = () => {
      setState(getCurrentState())
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return state
}

export default useResponsiveView
