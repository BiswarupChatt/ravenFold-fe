import PageSection from './PageSection.jsx'

function Search() {
  return (
    <PageSection
      description="This is a placeholder for your future search experience. You can replace it with live suggestions, filters, and results."
      eyebrow="Discovery"
      primaryAction={{ label: 'Browse Products', to: '/products' }}
      secondaryAction={{ label: 'Visit Shop', to: '/shop' }}
      title="Search"
    />
  )
}

export default Search
