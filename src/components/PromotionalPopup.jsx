import { forwardRef, useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AppButton from './AppButton.jsx'
import { createLead, getActivePopupCampaigns } from '../services/popupCampaignApi.js'

const isExternalUrl = (value = '') => /^https?:\/\//i.test(value)

const getStorageKey = (campaignId) => `ravenfold-popup:${campaignId}`

const PopupTransition = forwardRef(function PopupTransition(props, ref) {
  return <Slide direction="up" ref={ref} timeout={360} {...props} />
})

const shouldShowCampaign = (campaign) => {
  if (!campaign?.id) return false
  const storageKey = getStorageKey(campaign.id)
  const displayMode = campaign.displayMode || 'ONCE_PER_SESSION'

  if (displayMode === 'EVERY_REFRESH') return true
  if (displayMode === 'ONCE_PER_SESSION') return !window.sessionStorage.getItem(storageKey)
  if (displayMode === 'ONCE_PER_VISITOR') return !window.localStorage.getItem(storageKey)
  if (displayMode === 'ONCE_EVERY_X_DAYS') {
    const previousValue = Number(window.localStorage.getItem(storageKey) || 0)
    const repeatMs = Number(campaign.repeatAfterDays || 1) * 24 * 60 * 60 * 1000
    return !previousValue || Date.now() - previousValue >= repeatMs
  }

  return true
}

const rememberCampaign = (campaign) => {
  if (!campaign?.id) return
  const storageKey = getStorageKey(campaign.id)
  const displayMode = campaign.displayMode || 'ONCE_PER_SESSION'

  if (displayMode === 'ONCE_PER_SESSION') {
    window.sessionStorage.setItem(storageKey, String(Date.now()))
  }

  if (displayMode === 'ONCE_PER_VISITOR' || displayMode === 'ONCE_EVERY_X_DAYS') {
    window.localStorage.setItem(storageKey, String(Date.now()))
  }
}

function PromotionalPopup() {
  const location = useLocation()
  const [campaign, setCampaign] = useState(null)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (location.pathname !== '/') {
      setOpen(false)
      return undefined
    }

    let isMounted = true
    let timeoutId

    getActivePopupCampaigns()
      .then((campaigns) => {
        if (!isMounted) return
        const nextCampaign = campaigns.find(shouldShowCampaign)
        if (!nextCampaign) return
        setCampaign(nextCampaign)
        setSuccessOpen(false)
        setSuccessMessage('')
        setErrorMessage('')
        setEmail('')
        timeoutId = window.setTimeout(() => {
          if (isMounted) setOpen(true)
        }, Number(nextCampaign.displayDelaySeconds || 0) * 1000)
      })
      .catch(() => {
        if (isMounted) setCampaign(null)
      })

    return () => {
      isMounted = false
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [location.pathname])

  const ctaProps = useMemo(() => {
    const ctaUrl = campaign?.ctaUrl || ''
    if (!ctaUrl) return {}
    return isExternalUrl(ctaUrl)
      ? { component: 'a', href: ctaUrl, rel: 'noopener noreferrer', target: '_blank' }
      : { component: NavLink, to: ctaUrl }
  }, [campaign?.ctaUrl])

  const closePopup = () => {
    rememberCampaign(campaign)
    setOpen(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setSubmitting(true)
    try {
      await createLead({
        campaignId: campaign.id,
        email,
        pageUrl: window.location.href,
        source: 'popup',
      })
      setSuccessMessage(campaign.successMessage || 'Thank you for subscribing.')
      rememberCampaign(campaign)
      setOpen(false)
      setSuccessOpen(true)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Unable to submit email.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!campaign) return null

  const hasImage = Boolean(campaign.image?.url)
  const hasCta = Boolean(campaign.ctaLabel && campaign.ctaUrl)

  return (
    <>
      <Dialog
        fullWidth={hasImage}
        TransitionComponent={PopupTransition}
        maxWidth={hasImage ? 'md' : 'xs'}
        open={open}
        onClose={campaign.isDismissible ? closePopup : undefined}
        PaperProps={{
          sx: {
            '@keyframes popupPaperIn': {
              from: { opacity: 0, transform: 'scale(0.96)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
            animation: 'popupPaperIn 280ms ease both',
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        {campaign.isDismissible ? (
          <IconButton
            aria-label="Close popup"
            onClick={closePopup}
            sx={{ position: 'absolute', right: 10, top: 10, zIndex: 2, bgcolor: 'background.paper' }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: hasImage ? { xs: '1fr', md: '0.95fr 1.05fr' } : '1fr',
              minHeight: hasImage ? { md: 420 } : 'auto',
            }}
          >
            {hasImage ? (
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: '#111827',
                  color: 'common.white',
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: { xs: 220, md: '100%' },
                  overflow: 'hidden',
                }}
              >
                <Box component="img" src={campaign.image.url} alt={campaign.title} sx={{ height: '100%', objectFit: 'cover', width: '100%' }} />
              </Box>
            ) : null}
            <Stack
              spacing={2.5}
              sx={{
                justifyContent: 'center',
                p: { xs: 3, md: hasImage ? 5 : 4 },
                textAlign: hasImage ? 'left' : 'center',
              }}
            >
              <Box>
                <Typography component="h2" fontWeight={900} variant="h4">{campaign.title}</Typography>
                {campaign.description ? <Typography color="text.secondary" sx={{ mt: 1 }}>{campaign.description}</Typography> : null}
              </Box>
              {campaign.showEmailInput ? (
                <Stack component="form" spacing={1.5} onSubmit={handleSubmit}>
                  <Typography fontWeight={700}>Join our newsletter</Typography>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  {errorMessage ? <Typography color="error" variant="body2">{errorMessage}</Typography> : null}
                  <AppButton fullWidth loading={submitting} loadingText="Submitting..." type="submit" variant="contained">
                    Submit
                  </AppButton>
                </Stack>
              ) : null}
              {hasCta ? (
                <AppButton {...ctaProps} fullWidth onClick={closePopup} size="large" variant={campaign.showEmailInput ? 'outlined' : 'contained'}>
                  {campaign.ctaLabel}
                </AppButton>
              ) : null}
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        TransitionComponent={PopupTransition}
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        PaperProps={{
          sx: {
            '@keyframes popupSuccessIn': {
              from: { opacity: 0, transform: 'scale(0.94)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
            animation: 'popupSuccessIn 280ms ease both',
            borderRadius: 2,
            m: 2,
            width: { xs: 'calc(100vw - 32px)', sm: 430 },
          },
        }}
      >
        <IconButton
          aria-label="Close success popup"
          onClick={() => setSuccessOpen(false)}
          sx={{ position: 'absolute', right: 10, top: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 5 } }}>
          <Stack alignItems="center" spacing={2.25} sx={{ textAlign: 'center', width: '100%' }}>
            <CheckCircleRoundedIcon color="success" sx={{ alignSelf: 'center', display: 'block', fontSize: 78, mx: 'auto' }} />
            <Box>
              <Typography component="h2" fontWeight={800} variant="h5">You are all set</Typography>
              <Typography color="text.secondary" sx={{ mt: 1.25 }}>{successMessage || campaign.successMessage || 'Thank you for subscribing.'}</Typography>
            </Box>
            {hasCta ? (
              <AppButton {...ctaProps} fullWidth onClick={() => setSuccessOpen(false)} variant="contained">
                {campaign.ctaLabel}
              </AppButton>
            ) : (
              <AppButton fullWidth onClick={() => setSuccessOpen(false)} variant="contained">Done</AppButton>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PromotionalPopup
