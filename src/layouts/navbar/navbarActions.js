import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'

const navbarActions = [
  { label: 'Profile', path: '/profile', Icon: PersonOutlineRoundedIcon },
  { label: 'Cart', path: '/cart', Icon: ShoppingBagOutlinedIcon, showBadge: true },
  { label: 'Wishlist', path: '/wishlist', Icon: FavoriteBorderRoundedIcon },
  { label: 'Search', path: '/search', Icon: SearchRoundedIcon },
]

export default navbarActions
