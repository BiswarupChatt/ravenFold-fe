import PolicyPage from './PolicyPage.jsx'

const sections = [
  {
    heading: 'Orders and availability',
    body:
      'Orders are subject to stock availability, payment confirmation, and manual review when needed. Product imagery and descriptions are presented as accurately as possible, but small variations in materials, color, and finish can occur.',
  },
  {
    heading: 'Pricing and payments',
    body:
      'All listed prices, promotions, and shipping charges may change without notice until checkout is completed. By placing an order, customers agree to provide valid billing details and authorize the full transaction amount, including any applicable taxes or delivery fees.',
  },
  {
    heading: 'Use of the storefront',
    body:
      'Visitors may browse and shop for personal, lawful use only. Any attempt to misuse the site, interfere with checkout flows, copy branded assets, or abuse account-related features can result in access restrictions or cancelled orders.',
  },
]

function TermsConditions() {
  return (
    <PolicyPage
      eyebrow="Legal"
      intro="These terms outline the baseline rules for browsing, purchasing, and interacting with the Raven Fold storefront."
      sections={sections}
      title="Terms & Conditions"
    />
  )
}

export default TermsConditions
