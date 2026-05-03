import { useRoutes } from 'react-router-dom'
import Blog from '../pages/Blog.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import Cart from '../pages/Cart.jsx'
import Contacts from '../pages/Contacts.jsx'
import Home from '../pages/Home.jsx'
import Profile from '../pages/Profile.jsx'
import Products from '../pages/Products.jsx'
import Search from '../pages/Search.jsx'
import Shop from '../pages/Shop.jsx'
import Wishlist from '../pages/Wishlist.jsx'

const routes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'products', element: <Products /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'blog', element: <Blog /> },
      { path: 'profile', element: <Profile /> },
      { path: 'cart', element: <Cart /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'search', element: <Search /> },
    ],
  },
]

function AppRoutes() {
  return useRoutes(routes)
}

export default AppRoutes
