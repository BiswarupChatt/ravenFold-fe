import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import featureFlag from '../config/featureFlag.js'
import withAuthRequired from '../hoc/withAuthRequired.jsx'
const Blog = lazy(() => import('../pages/Blog.jsx'))
const MainLayout = lazy(() => import('../layouts/MainLayout.jsx'))
const Contacts = lazy(() => import('../pages/Contacts.jsx'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'))
const Home = lazy(() => import('../pages/Home.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))
const PolicyPage = lazy(() => import('../pages/PolicyPage.jsx'))
const Profile = lazy(() => import('../pages/profile/Profile.jsx'))
const Address = lazy(() => import('../pages/profile/subPages/address/Address.jsx'))
const Info = lazy(() => import('../pages/profile/subPages/info/Info.jsx'))
const Order = lazy(() => import('../pages/profile/subPages/order/Order.jsx'))
const Cart = lazy(() => import('../pages/cart/Cart.jsx'))
const Checkout = lazy(() => import('../pages/checkout/Checkout.jsx'))
const Reviews = lazy(() => import('../pages/profile/subPages/reviews/Reviews.jsx'))
const ResetPassword = lazy(() => import('../pages/ResetPassword.jsx'))
const WriteReview = lazy(() => import('../pages/profile/subPages/reviews/WriteReview.jsx'))
const Wishlist = lazy(() => import('../pages/profile/subPages/wishlist/Wishlist.jsx'))
const ProductDetails = lazy(() => import('../pages/shop/product/ProductDetails.jsx'))
const Shop = lazy(() => import('../pages/shop/catalog/Shop.jsx'))

const ProtectedProfile = withAuthRequired(Profile)
const ProtectedCheckout = withAuthRequired(Checkout)

const routes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:productIdOrSlug', element: <ProductDetails /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'blog', element: featureFlag.showBlog ? <Blog /> : <NotFound /> },
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
          { path: 'reviews/write/:orderId/:orderItemId', element: <WriteReview /> },
        ],
      },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <ProtectedCheckout /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'wishlist', element: <Navigate replace to="/profile/wishlist" /> },
      { path: 'policies/:slug', element: <PolicyPage /> },
      { path: ':slug', element: <PolicyPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

function AppRoutes() {
  return useRoutes(routes)
}

export default AppRoutes
