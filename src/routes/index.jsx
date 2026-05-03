import { useRoutes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import Cart from '../pages/Cart.jsx'
import Home from '../pages/Home.jsx'
import Products from '../pages/Products.jsx'

const routes = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
]

function AppRoutes() {
  return useRoutes(routes)
}

export default AppRoutes
