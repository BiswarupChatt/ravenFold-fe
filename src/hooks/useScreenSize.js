import useResponsiveView from './useResponsiveView.js'

function useScreenSize() {
  const { isDesktop, isMobile, isTablet } = useResponsiveView()

  return {
    isMobile,
    isTab: isTablet,
    isDesktop,
  }
}

export default useScreenSize
