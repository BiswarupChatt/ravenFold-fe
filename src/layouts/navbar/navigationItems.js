import featureFlag from '../../config/featureFlag.js'

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  featureFlag.showBlog ? { label: 'Blog', path: '/blog' } : null,
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
