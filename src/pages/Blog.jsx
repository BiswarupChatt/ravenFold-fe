import PageSection from './PageSection.jsx'

function Blog() {
  return (
    <PageSection
      description="Use this area for product stories, launch notes, buying guides, and editorial content that supports the brand."
      eyebrow="Journal"
      primaryAction={{ label: 'Visit Shop', to: '/shop' }}
      secondaryAction={{ label: 'Browse Products', to: '/products' }}
      title="Blog"
    />
  )
}

export default Blog
