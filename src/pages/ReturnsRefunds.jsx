import PolicyPage from './PolicyPage.jsx'

const sections = [
  {
    heading: 'Refund eligibility',
    body:
      'Refunds are generally issued only for approved returns, cancelled orders, or verified fulfillment issues. Items that show signs of wear, intentional damage, or missing components may not qualify unless the issue originated from shipping or manufacturing.',
  },
  {
    heading: 'Refund timing',
    body:
      'Once a return is inspected and approved, the refund is typically sent back to the original payment method. Final posting time depends on the payment provider or issuing bank, so customers may see a short processing delay after approval.',
  },
  {
    heading: 'Non-refundable situations',
    body:
      'Certain purchases, such as final-sale merchandise, personalized goods, or items flagged as non-returnable for hygiene or limited-release reasons, may be excluded from refunds. Any exceptions should be made clearly visible during the shopping flow and at checkout.',
  },
]

function ReturnsRefunds() {
  return (
    <PolicyPage
      eyebrow="Refunds"
      intro="This page explains the baseline conditions under which refunds may be approved and how long customers should expect the process to take."
      sections={sections}
      title="Returns & Refunds"
    />
  )
}

export default ReturnsRefunds
