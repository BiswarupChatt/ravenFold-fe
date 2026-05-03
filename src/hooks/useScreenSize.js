import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

function useScreenSize() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))
  const isTab = useMediaQuery(theme.breakpoints.only('sm'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return {
    isMobile,
    isTab,
    isDesktop,
  }
}

export default useScreenSize
