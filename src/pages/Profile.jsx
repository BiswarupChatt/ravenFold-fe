import PageSection from './PageSection.jsx'

function Profile() {
  return (
    <PageSection
      description="This account area can hold sign in, order history, saved addresses, and personal preferences when you wire auth."
      eyebrow="Account"
      primaryAction={{ label: 'Open Wishlist', to: '/wishlist' }}
      secondaryAction={{ label: 'View Cart', to: '/cart' }}
      title="Profile"
    />
  )
}

export default Profile
