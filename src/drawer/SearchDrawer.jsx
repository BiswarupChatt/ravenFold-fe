import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import AppDrawer from '../components/AppDrawer.jsx'
import products from '../data/products.js'
import { addItem } from '../store/cartSlice'
import { formatPrice } from '../utils/utils.js'

function SearchDrawerContent({ autoFocus = false, layout = 'page', onNavigate }) {
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const isDrawer = layout === 'drawer'
  const normalizedQuery = query.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
    if (!normalizedQuery) {
      return true
    }

    return [product.name, product.category].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    )
  })

  return (
    <Stack spacing={3}>
      <TextField
        autoFocus={autoFocus}
        fullWidth
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search bags, wallets, and accessories"
        value={query}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Paper
        sx={{
          border: 1,
          borderColor: 'divider',
          boxShadow: 'none',
          p: isDrawer ? 2 : 2.5,
        }}
        variant="outlined"
      >
        <Stack spacing={1.5}>
          <Typography fontWeight={700}>
            {normalizedQuery
              ? `${filteredProducts.length} result${filteredProducts.length === 1 ? '' : 's'}`
              : 'Start with the featured catalog'}
          </Typography>
          <Typography color="text.secondary">
            {normalizedQuery
              ? 'Refine the search term or jump straight into the shop.'
              : 'Use the drawer for quick discovery, or continue through the shop page.'}
          </Typography>
          <Button
            component={RouterLink}
            onClick={onNavigate}
            sx={{ alignSelf: 'flex-start' }}
            to="/shop"
            variant="outlined"
          >
            Visit Shop
          </Button>
        </Stack>
      </Paper>

      {filteredProducts.length > 0 ? (
        <Stack spacing={2}>
          {filteredProducts.map((product) => (
            <Paper
              key={product.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                boxShadow: 'none',
                p: isDrawer ? 2 : 2.5,
              }}
              variant="outlined"
            >
              <Stack
                alignItems={isDrawer ? 'flex-start' : 'center'}
                direction={isDrawer ? 'column' : 'row'}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {product.category}
                  </Typography>
                  <Typography variant={isDrawer ? 'h6' : 'h3'}>
                    {product.name}
                  </Typography>
                  <Typography color="secondary.main" fontWeight={700}>
                    {formatPrice(product.price)}
                  </Typography>
                </Box>

                <Button
                  onClick={() => dispatch(addItem(product))}
                  startIcon={<ShoppingBagOutlinedIcon />}
                  variant="contained"
                >
                  Add to Cart
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Paper
          sx={{
            border: 1,
            borderColor: 'divider',
            boxShadow: 'none',
            p: isDrawer ? 2 : 2.5,
          }}
          variant="outlined"
        >
          <Stack spacing={1.5}>
            <Typography fontWeight={700}>No matches found</Typography>
            <Typography color="text.secondary">
              Try a broader term like bags, accessories, or wallet.
            </Typography>
            <Button
              component={RouterLink}
              onClick={onNavigate}
              sx={{ alignSelf: 'flex-start' }}
              to="/shop"
              variant="contained"
            >
              Visit Shop
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}

function SearchDrawer({ open, onClose }) {
  return (
    <AppDrawer
      description="Search the catalog without leaving the current page."
      onClose={onClose}
      open={open}
      title="Search"
    >
      <SearchDrawerContent autoFocus layout="drawer" onNavigate={onClose} />
    </AppDrawer>
  )
}

export { SearchDrawerContent }
export default SearchDrawer
