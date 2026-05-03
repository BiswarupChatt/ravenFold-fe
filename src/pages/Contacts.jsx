import PageSection from './PageSection.jsx'

function Contacts() {
  return (
    <PageSection
      description="This contact page is ready for your support details, store hours, and a proper inquiry form when you add one."
      eyebrow="Get In Touch"
      primaryAction={{ label: 'Browse Products', to: '/products' }}
      secondaryAction={{ label: 'Read The Blog', to: '/blog' }}
      title="Contacts"
    />
  )
}

export default Contacts
