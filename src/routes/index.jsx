import { useRoutes } from 'react-router-dom'
import Blog from '../pages/Blog.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import Cart from '../pages/Cart.jsx'
import Contacts from '../pages/Contacts.jsx'
import withAuthRequired from '../hoc/withAuthRequired.jsx'
import Home from '../pages/Home.jsx'
import PrivacyPolicy from '../pages/PrivacyPolicy.jsx'
import Profile from '../pages/Profile.jsx'
import Products from '../pages/Products.jsx'
import ReturnsRefunds from '../pages/ReturnsRefunds.jsx'
import Search from '../pages/Search.jsx'
import Shop from '../pages/Shop.jsx'
import ShippingReturns from '../pages/ShippingReturns.jsx'
import TermsConditions from '../pages/TermsConditions.jsx'
import Wishlist from '../pages/Wishlist.jsx'

const ProtectedProfile = withAuthRequired(Profile)
const ProtectedWishlist = withAuthRequired(Wishlist)

const routes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'products', element: <Products /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'blog', element: <Blog /> },
      { path: 'profile', element: <ProtectedProfile /> },
      { path: 'cart', element: <Cart /> },
      { path: 'wishlist', element: <ProtectedWishlist /> },
      { path: 'search', element: <Search /> },
      { path: 'terms-and-conditions', element: <TermsConditions /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'shipping-and-returns', element: <ShippingReturns /> },
      { path: 'returns-and-refunds', element: <ReturnsRefunds /> },
      {
        path: '*',
        element: (
          <>not found</>
        ),
      },
    ],
  },
]

function AppRoutes() {
  return useRoutes(routes)
}

export default AppRoutes
