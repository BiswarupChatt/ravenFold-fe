import PolicyPage from './PolicyPage.jsx'

const sections = [
  {
    heading: 'Information we collect',
    body:
      'Raven Fold may collect contact information, shipping details, purchase history, and basic device or browsing metadata needed to operate the storefront effectively. This information helps support account access, checkout, fulfillment, and product discovery.',
  },
  {
    heading: 'How information is used',
    body:
      'Collected information is used to process orders, respond to support requests, improve the shopping experience, and communicate important updates such as order confirmations or service notices. Marketing communication should only be sent according to the preferences set by the customer.',
  },
  {
    heading: 'Data handling and protection',
    body:
      'Reasonable technical and operational safeguards should be used to protect personal information from unauthorized access, misuse, or disclosure. Customers may request updates or removal of their data where applicable, subject to legal, tax, and fulfillment record requirements.',
  },
]

function PrivacyPolicy() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      intro="This privacy policy describes the kind of customer and browsing data typically processed by a modern ecommerce experience."
      sections={sections}
      title="Privacy Policy"
    />
  )
}

export default PrivacyPolicy
