const VISITOR_STORAGE_KEY = 'ravenfold.visitor.seen'

let currentVisitCustomerTarget = ''

export const getCampaignPageTarget = (pathname = '/') => {
  if (pathname === '/') return 'HOME'
  if (pathname.startsWith('/shop/') && pathname !== '/shop') return 'PRODUCT'
  if (pathname.startsWith('/checkout')) return 'CHECKOUT'
  return 'ALL'
}

export const getCampaignDeviceTarget = () => {
  if (typeof window === 'undefined') return 'DESKTOP'
  return window.matchMedia('(max-width: 767px)').matches ? 'MOBILE' : 'DESKTOP'
}

export const getCampaignCustomerTarget = (isAuthenticated = false) => {
  if (isAuthenticated) return 'LOGGED_IN'
  if (currentVisitCustomerTarget) return currentVisitCustomerTarget

  try {
    const hasVisited = window.localStorage.getItem(VISITOR_STORAGE_KEY)
    currentVisitCustomerTarget = hasVisited ? 'RETURNING_VISITOR' : 'NEW_VISITOR'
    window.localStorage.setItem(VISITOR_STORAGE_KEY, String(Date.now()))
  } catch {
    currentVisitCustomerTarget = 'NEW_VISITOR'
  }

  return currentVisitCustomerTarget
}

export const getCampaignContext = ({ isAuthenticated = false, pathname = '/' } = {}) => ({
  customerTarget: getCampaignCustomerTarget(isAuthenticated),
  deviceTarget: getCampaignDeviceTarget(),
  pageTarget: getCampaignPageTarget(pathname),
})
