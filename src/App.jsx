import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Cart from './pages/Cart.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />
      </Route>
    </Routes>
  )
}

export default App
