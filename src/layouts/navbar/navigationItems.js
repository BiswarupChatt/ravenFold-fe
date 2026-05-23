                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contacts' },
]

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
