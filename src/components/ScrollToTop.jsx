import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SCROLL_DURATION_MS = 700

const easeInOutQuint = (progress) =>
  progress < 0.5 ? 16 * progress ** 5 : 1 - (-2 * progress + 2) ** 5 / 2

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const scrollingElement = document.scrollingElement || document.documentElement
    const startY = scrollingElement.scrollTop

    if (startY === 0) {
      return undefined
    }

    let animationFrameId
    let startTime

    const animateScroll = (currentTime) => {
      if (!startTime) {
        startTime = currentTime
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1)
      const easedProgress = easeInOutQuint(progress)

      scrollingElement.scrollTop = startY * (1 - easedProgress)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animateScroll)
      } else {
        scrollingElement.scrollTop = 0
      }
    }

    animationFrameId = window.requestAnimationFrame(animateScroll)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [pathname])

  return null
}

export default ScrollToTop
