import apiClient, { getApiErrorMessage } from './apiClient.js'

export const defaultHomePageContent = {
  finalCta: {
    buttonLabel: 'Shop Raven Fold',
    buttonUrl: '/shop',
    isActive: true,
    title: 'Find your next everyday carry.',
  },
  hero: {
    backgroundImageUrl: '',
    eyebrow: 'New Raven Fold arrivals',
    isActive: true,
    primaryCtaLabel: 'Shop collection',
    primaryCtaUrl: '/shop',
    secondaryCtaLabel: 'Need help?',
    secondaryCtaUrl: '/contacts',
    subtitle: 'Bags, wallets, and travel goods designed for cleaner everyday movement.',
    title: 'Fresh carry arrivals',
  },
  productSection: {
    buttonLabel: 'View all products',
    buttonUrl: '/shop',
    eyebrow: 'All Product Shop',
    isActive: true,
    productLimit: 4,
    tabLabel: 'New Arrivals',
    title: 'Favorite carry products',
  },
  promoStrip: {
    isActive: true,
    items: [
      'Launch offers on selected pieces',
      'Secure checkout',
      'Delivery tracking',
      'GST invoice support',
      'WhatsApp support',
    ],
  },
  supportCards: {
    isActive: true,
    items: [
      { description: 'Encrypted payments with order confirmation after checkout.', icon: 'shield', title: 'Secure checkout' },
      { description: 'Shipment updates with tracking details when your order moves.', icon: 'shipping', title: 'Delivery tracking' },
      { description: 'Invoice help for business purchases and eligible requests.', icon: 'invoice', title: 'GST invoice support' },
      { description: 'Reach the Raven Fold team for product and order questions.', icon: 'support', title: 'Support online' },
    ],
  },
  testimonial: {
    author: 'Raven Fold customer',
    isActive: true,
    quote: 'The wallet feels compact, the finish looks premium, and the packaging made it feel ready to gift.',
    rating: 5,
  },
}

const mergeHomeContent = (content = {}) => ({
  finalCta: { ...defaultHomePageContent.finalCta, ...(content.finalCta || {}) },
  hero: { ...defaultHomePageContent.hero, ...(content.hero || {}) },
  productSection: { ...defaultHomePageContent.productSection, ...(content.productSection || {}) },
  promoStrip: {
    ...defaultHomePageContent.promoStrip,
    ...(content.promoStrip || {}),
    items: Array.isArray(content.promoStrip?.items) ? content.promoStrip.items : defaultHomePageContent.promoStrip.items,
  },
  supportCards: {
    ...defaultHomePageContent.supportCards,
    ...(content.supportCards || {}),
    items: Array.isArray(content.supportCards?.items) ? content.supportCards.items : defaultHomePageContent.supportCards.items,
  },
  testimonial: { ...defaultHomePageContent.testimonial, ...(content.testimonial || {}) },
})

export const getHomePage = async () => {
  try {
    const response = await apiClient.get('/storefront-pages/home')

    return {
      ...(response.data?.data || {}),
      content: mergeHomeContent(response.data?.data?.content || {}),
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
