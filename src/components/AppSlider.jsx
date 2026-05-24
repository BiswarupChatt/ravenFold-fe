import { Box, Stack } from '@mui/material'
import { useRef, useState } from 'react'

function AppSlider({ items = [], renderItem, getKey }) {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items.length) {
    return null
  }

  const handleScroll = () => {
    const track = trackRef.current

    if (!track) {
      return
    }

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth)

    setActiveIndex(Math.min(nextIndex, items.length - 1))
  }

  const handleDotClick = (index) => {
    trackRef.current?.scrollTo({
      behavior: 'smooth',
      left: index * trackRef.current.clientWidth,
    })
  }

  return (
    <Stack spacing={1.5}>
      <Box
        onScroll={handleScroll}
        ref={trackRef}
        sx={{
          display: 'flex',
          gap: 1.5,
          msOverflowStyle: 'none',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {items.map((item, index) => (
          <Box
            key={getKey?.(item, index) || index}
            sx={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
            }}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>

      {items.length > 1 ? (
        <Stack direction="row" justifyContent="center" spacing={0.75}>
          {items.map((item, index) => (
            <Box
              component="button"
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              key={getKey?.(item, index) || index}
              sx={{
                bgcolor: index === activeIndex ? 'text.primary' : 'divider',
                borderRadius: 999,
                border: 0,
                cursor: 'pointer',
                height: 6,
                p: 0,
                width: index === activeIndex ? 18 : 6,
              }}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}

export default AppSlider
