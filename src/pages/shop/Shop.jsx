import PageSection from '../PageSection.jsx'

function Shop() {
  return (
    <PageSection
      description="Step into the main shopping floor with curated drops, seasonal edits, and your fastest path into the catalog."
      eyebrow="Collections"
      primaryAction={{ label: 'Explore Shop', to: '/shop' }}
      secondaryAction={{ label: 'Open Wishlist', to: '/profile/wishlist' }}
      title="Shop"
    />
  )
}

export default Shop
