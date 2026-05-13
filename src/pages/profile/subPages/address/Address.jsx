import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import { Alert, Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import AppButton from '../../../../components/AppButton'
import { getApiErrorMessage } from '../../../../services/apiClient'
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  updateUserAddress,
} from '../../../../services/addressApi'
import { errorToast, successToast } from '../../../../services/toast'
import ProfileIntro from '../../components/ProfileIntro'
import AddEditAddressModal from './components/AddEditAddressModal'
import AddressCard from './components/AddressCard'

const addressPageSize = 10

function Address() {
  const [addresses, setAddresses] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [settingDefaultId, setSettingDefaultId] = useState('')
  const [pageError, setPageError] = useState('')
  const [modalError, setModalError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalKey, setModalKey] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState(null)

  const loadAddresses = useCallback(async (nextPage = 1, { append = false } = {}) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    setPageError('')

    try {
      const addressData = await getUserAddresses({
        limit: addressPageSize,
        page: nextPage,
      })

      setAddresses((currentAddresses) => (
        append
          ? [...currentAddresses, ...addressData.items]
          : addressData.items
      ))
      setPagination(addressData.pagination)
      setPage(nextPage)
    } catch (error) {
      const message = getApiErrorMessage(error)

      setPageError(message)
      errorToast(message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadAddresses()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadAddresses])

  const handleAddAddress = () => {
    setSelectedAddress(null)
    setModalError('')
    setModalKey((currentKey) => currentKey + 1)
    setIsModalOpen(true)
  }

  const handleEditAddress = (address) => {
    setSelectedAddress(address)
    setModalError('')
    setModalKey((currentKey) => currentKey + 1)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (saving) {
      return
    }

    setIsModalOpen(false)
    setSelectedAddress(null)
    setModalError('')
  }

  const handleSubmitAddress = async (addressPayload) => {
    setSaving(true)
    setModalError('')

    try {
      const savedAddress = selectedAddress?.id
        ? await updateUserAddress(selectedAddress.id, addressPayload)
        : await createUserAddress(addressPayload)

      setAddresses((currentAddresses) => {
        if (!selectedAddress?.id) {
          return [
            savedAddress,
            ...(
              savedAddress.isDefault
                ? currentAddresses.map((address) => ({ ...address, isDefault: false }))
                : currentAddresses
            ),
          ]
        }

        return currentAddresses.map((address) => {
          if (address.id === savedAddress.id) {
            return savedAddress
          }

          if (savedAddress.isDefault) {
            return {
              ...address,
              isDefault: false,
            }
          }

          return address
        })
      })

      setIsModalOpen(false)
      setSelectedAddress(null)
      successToast(selectedAddress?.id ? 'Address updated successfully.' : 'Address added successfully.')
      loadAddresses(1)
    } catch (error) {
      const message = getApiErrorMessage(error)

      setModalError(message)
      errorToast(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAddress = async (address) => {
    const shouldDelete = window.confirm('Delete this address?')

    if (!shouldDelete) {
      return
    }

    setDeletingId(address.id)

    try {
      await deleteUserAddress(address.id)
      successToast('Address deleted successfully.')
      loadAddresses(1)
    } catch (error) {
      const message = getApiErrorMessage(error)

      errorToast(message)
    } finally {
      setDeletingId('')
    }
  }

  const handleSetDefaultAddress = async (address) => {
    if (address.isDefault || settingDefaultId) {
      return
    }

    setSettingDefaultId(address.id)

    try {
      const savedAddress = await updateUserAddress(address.id, {
        isDefault: true,
      })

      setAddresses((currentAddresses) => (
        currentAddresses.map((currentAddress) => ({
          ...currentAddress,
          isDefault: currentAddress.id === savedAddress.id,
        }))
      ))
      successToast('Default address updated successfully.')
      loadAddresses(1)
    } catch (error) {
      const message = getApiErrorMessage(error)

      errorToast(message)
    } finally {
      setSettingDefaultId('')
    }
  }

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loadingMore) {
      return
    }

    loadAddresses(page + 1, { append: true })
  }

  return (
    <Stack spacing={3}>
      <ProfileIntro
        action={(
          <AppButton
            onClick={handleAddAddress}
            startIcon={<AddLocationAltOutlinedIcon />}
            sx={{ px: 1 }}
            type="button"
            variant="text"
          >
            Add Address
          </AppButton>
        )}
        description="Saved delivery locations for faster checkout."
        title="Addresses"
      />

      <Divider />

      {pageError ? (
        <Alert severity="error" sx={{ borderRadius: 1.5 }}>
          {pageError}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {addresses.length ? (
            addresses.map((address) => (
              <Box key={address.id} sx={{ opacity: deletingId === address.id ? 0.56 : 1 }}>
                <AddressCard
                  address={address}
                  isSettingDefault={settingDefaultId === address.id}
                  onDelete={handleDeleteAddress}
                  onEdit={handleEditAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              </Box>
            ))
          ) : (
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              gridColumn: '1 / -1',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography fontWeight={800}>No addresses saved yet</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              Add a delivery address to use it during checkout.
            </Typography>
          </Box>
          )}

          {pagination?.hasNextPage ? (
            <Box sx={{ display: 'flex', gridColumn: '1 / -1', justifyContent: 'center', pt: 1 }}>
              <AppButton
                loading={loadingMore}
                loadingText="Loading..."
                onClick={handleLoadMore}
                type="button"
                variant="outlined"
              >
                Load More
              </AppButton>
            </Box>
          ) : null}
        </Box>
      )}

      <AddEditAddressModal
        address={selectedAddress}
        error={modalError}
        key={modalKey}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAddress}
        open={isModalOpen}
      />
    </Stack>
  )
}

export default Address
