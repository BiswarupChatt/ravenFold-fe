import PageSection from './PageSection.jsx'

function Wishlist() {
  return (
    <PageSection
      description="Keep saved products here and turn this into a proper favorites flow once you connect product state or an API."
      eyebrow="Saved Pieces"
      primaryAction={{ label: 'Browse Products', to: '/products' }}
      secondaryAction={{ label: 'Visit Shop', to: '/shop' }}
      title="Wishlist"
    />
  )
}

export default Wishlist
