import AppDrawer from '../components/AppDrawer.jsx'
import CartContent from '../pages/cart/components/CartContent.jsx'

function CartDrawer({ open, onClose }) {
  return (
    <AppDrawer
      onClose={onClose}
      open={open}
      title="Cart"
    >
      <CartContent layout="drawer" onNavigate={onClose} />
    </AppDrawer>
  )
}

export default CartDrawer
