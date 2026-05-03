const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Products', path: '/products' },
  { label: 'Contacts', path: '/contacts' },
  { label: 'Blog', path: '/blog' },
  {
    label: 'More',
    path: '/demo-more',
    children: [
      { label: 'Featured', path: '/demo-more/featured' },
      {
        label: 'Collections',
        path: '/demo-more/collections',
        children: [
          { label: 'Summer Edit', path: '/demo-more/collections/summer-edit' },
          { label: 'Winter Edit', path: '/demo-more/collections/winter-edit' },
          { label: 'Member Picks', path: '/demo-more/collections/member-picks' },
        ],
      },
      { label: 'Offers', path: '/demo-more/offers' },
    ],
  },
]

export default navigationItems
