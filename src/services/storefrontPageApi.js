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
  sections: [
    { id: 'hero', isActive: true, sortOrder: 0, type: 'hero' },
    { id: 'promoStrip', isActive: true, sortOrder: 1, type: 'promoStrip' },
    { id: 'productSection', isActive: true, sortOrder: 2, type: 'productSection' },
    { id: 'testimonial', isActive: true, sortOrder: 3, type: 'testimonial' },
    { id: 'supportCards', isActive: true, sortOrder: 4, type: 'supportCards' },
    { id: 'finalCta', isActive: true, sortOrder: 5, type: 'finalCta' },
  ],
}

const sectionTypes = defaultHomePageContent.sections.map((section) => section.type)

const mergeSections = (content = {}) => {
  const rawSections = Array.isArray(content.sections) ? content.sections : []
  const sectionByType = new Map(rawSections.map((section, index) => [
    section.type || section.id,
    {
      id: section.id || section.type,
      isActive: section.isActive !== false,
      sortOrder: Number.isFinite(Number(section.sortOrder)) ? Number(section.sortOrder) : index,
      type: section.type || section.id,
    },
  ]))

  return sectionTypes
    .map((type, index) => (
      sectionByType.get(type) || {
        id: type,
        isActive: content[type]?.isActive !== false,
        sortOrder: rawSections.length + index,
        type,
      }
    ))
    .sort((first, second) => Number(first.sortOrder || 0) - Number(second.sortOrder || 0))
    .map((section, index) => ({ ...section, sortOrder: index }))
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
  sections: mergeSections(content),
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
