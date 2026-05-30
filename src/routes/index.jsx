import { Navigate, useRoutes } from 'react-router-dom'
import Blog from '../pages/Blog.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import Contacts from '../pages/Contacts.jsx'
import withAuthRequired from '../hoc/withAuthRequired.jsx'
import Home from '../pages/Home.jsx'
import NotFound from '../pages/NotFound.jsx'
import PrivacyPolicy from '../pages/PrivacyPolicy.jsx'
import Profile from '../pages/profile/Profile.jsx'
import Address from '../pages/profile/subPages/address/Address.jsx'
import Info from '../pages/profile/subPages/info/Info.jsx'
import Order from '../pages/profile/subPages/order/Order.jsx'
import Cart from "../pages/cart/Cart.jsx"
import Checkout from '../pages/checkout/Checkout.jsx'
import Reviews from '../pages/profile/subPages/reviews/Reviews.jsx'
import Wishlist from '../pages/profile/subPages/wishlist/Wishlist.jsx'
import ReturnsRefunds from '../pages/ReturnsRefunds.jsx'
import ShippingReturns from '../pages/ShippingReturns.jsx'
import TermsConditions from '../pages/TermsConditions.jsx'
import ProductDetails from '../pages/shop/product/ProductDetails.jsx'
import Shop from '../pages/shop/catalog/Shop.jsx'

const ProtectedProfile = withAuthRequired(Profile)

const routes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:productIdOrSlug', element: <ProductDetails /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'blog', element: <Blog /> },
      {
        path: 'profile',
        element: <ProtectedProfile />,
        children: [
          { index: true, element: <Navigate replace to="info" /> },
          { path: 'info', element: <Info /> },
          { path: 'address', element: <Address /> },
          { path: 'order', element: <Order /> },
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'reviews', element: <Reviews /> },
        ],
      },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'wishlist', element: <Navigate replace to="/profile/wishlist" /> },
      { path: 'terms-and-conditions', element: <TermsConditions /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'shipping-and-returns', element: <ShippingReturns /> },
      { path: 'returns-and-refunds', element: <ReturnsRefunds /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

function AppRoutes() {
  return useRoutes(routes)
}

export default AppRoutes
