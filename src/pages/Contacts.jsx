import PageSection from './PageSection.jsx'

function Contacts() {
  return (
    <PageSection
      description="This contact page is ready for your support details, store hours, and a proper inquiry form when you add one."
      eyebrow="Get In Touch"
      primaryAction={{ label: 'Visit Shop', to: '/shop' }}
      secondaryAction={{ label: 'Read The Blog', to: '/blog' }}
      title="Contact"
    />
  )
}

export default Contacts
