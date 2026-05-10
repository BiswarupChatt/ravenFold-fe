import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'

const navigationActions = [
  {
    label: 'Profile',
    path: '/profile',
    isDrawer: false,
    Icon: PersonOutlineRoundedIcon,
  },
  {
    label: 'Cart',
    path: '/cart',
    isDrawer: true,
    Icon: ShoppingBagOutlinedIcon,
    requiresAuth: true,
    showBadge: true,
  },
  {
    label: 'Wishlist',
    path: '/wishlist',
    isDrawer: false,
    Icon: FavoriteBorderRoundedIcon,
    requiresAuth: true,
  },
  {
    label: 'Search',
    path: '/search',
    isDrawer: true,
    Icon: SearchRoundedIcon,
  },
]

export default navigationActions
