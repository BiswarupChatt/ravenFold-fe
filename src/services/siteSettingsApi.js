import apiClient, { getApiErrorMessage } from './apiClient.js'

const defaultSiteSettings = {
  brandName: 'Raven Fold',
  contact: {
    businessHours: 'Mon - Sat, 9:00 AM - 6:00 PM',
    supportEmail: 'support@ravenfold.com',
    supportPhone: '',
    whatsappNumber: '917439042753',
  },
  copyrightText: '',
  favicon: null,
  featureFlags: {
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false,
    showBlog: false,
    showNavbarSearch: false,
  },
  logo: null,
  seo: {
    description: 'Thoughtful carry goods from Raven Fold.',
    title: 'Raven Fold',
  },
  socialLinks: [],
}

export const getSiteSettings = async () => {
  try {
    const response = await apiClient.get('/site-settings')
    const payload = response.data

    return {
      ...defaultSiteSettings,
      ...(payload?.data || {}),
      contact: {
        ...defaultSiteSettings.contact,
        ...(payload?.data?.contact || {}),
      },
      featureFlags: {
        ...defaultSiteSettings.featureFlags,
        ...(payload?.data?.featureFlags || {}),
      },
      seo: {
        ...defaultSiteSettings.seo,
        ...(payload?.data?.seo || {}),
      },
      socialLinks: Array.isArray(payload?.data?.socialLinks) ? payload.data.socialLinks : [],
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export { defaultSiteSettings }
