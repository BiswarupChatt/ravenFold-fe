const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Blog', path: '/blog', featureFlag: 'showBlog' },
  { label: 'Contact', path: '/contacts' },
].filter(Boolean)

/*
nested navigation reference:
{
  label: 'Collections',
  path: '/collections',
  children: [
    { label: 'Summer Edit', path: '/collections/summer-edit' },
    {
      label: 'Seasonal',
      path: '/collections/seasonal',
      children: [
        { label: 'Winter Edit', path: '/collections/seasonal/winter-edit' },
      ],
    },
  ],
}
*/

export default navigationItems
