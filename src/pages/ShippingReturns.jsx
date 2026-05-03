import PolicyPage from './PolicyPage.jsx'

const sections = [
  {
    heading: 'Order processing',
    body:
      'Orders are usually prepared within the published fulfillment window after payment clears. Processing time can increase during launches, holidays, or periods of elevated demand, and customers should receive updated delivery information whenever material delays occur.',
  },
  {
    heading: 'Shipping expectations',
    body:
      'Shipping speeds vary by location, chosen service level, and carrier performance. Delivery estimates are guidelines rather than guarantees, and final-mile delays caused by carriers, weather, customs, or address issues may fall outside direct store control.',
  },
  {
    heading: 'Returns and exchanges',
    body:
      'Eligible items should be returned in unused condition with original packaging inside the stated return window. Exchanges and approvals may depend on product category, inventory availability, and inspection outcomes after the item arrives back at the warehouse.',
  },
]

function ShippingReturns() {
  return (
    <PolicyPage
      eyebrow="Fulfillment"
      intro="This page covers the typical expectations around order processing, transit timelines, and how returns are usually handled."
      sections={sections}
      title="Shipping & Returns"
    />
  )
}

export default ShippingReturns
