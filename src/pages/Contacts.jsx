import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
  Alert,
  Box,
  Container,
  Link,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import PageIntro from '../components/PageIntro.jsx'
import useScreenSize from '../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../services/apiClient.js'
import { sendContactInquiry } from '../services/contactApi.js'
import { errorToast, successToast } from '../services/toast.js'

const whatsappNumber = '917439042753'
const whatsappUrl = `https://wa.me/${whatsappNumber}`

const initialFormState = {
  email: '',
  message: '',
  name: '',
  orderNumber: '',
  topic: 'Order support',
}

const supportTopics = [
  'Order support',
  'Shipping and tracking',
  'Returns or exchange',
  'Product question',
  'GST invoice',
  'Other',
]

const fieldGridSx = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
  },
}

function buildWhatsAppMessage(formState) {
  const lines = [
    'Hi Raven Fold, I need help.',
    '',
    formState.name.trim() ? `Name: ${formState.name.trim()}` : '',
    formState.email.trim() ? `Email: ${formState.email.trim()}` : '',
    formState.topic ? `Topic: ${formState.topic}` : '',
    formState.orderNumber.trim() ? `Order number: ${formState.orderNumber.trim()}` : '',
    formState.message.trim() ? `Message: ${formState.message.trim()}` : '',
  ].filter(Boolean)

  return `${whatsappUrl}?text=${encodeURIComponent(lines.join('\n'))}`
}

function Contacts() {
  const { isMobile } = useScreenSize()
  const [formState, setFormState] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const whatsappLink = useMemo(() => buildWhatsAppMessage(formState), [formState])

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
    setFormMessage('')
  }

  const validateForm = () => {
    const nextErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formState.name.trim()) {
      nextErrors.name = 'Enter your name.'
    }

    if (!emailPattern.test(formState.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formState.message.trim()) {
      nextErrors.message = 'Tell us how we can help.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setFormMessage('')

    try {
      const result = await sendContactInquiry({
        email: formState.email.trim(),
        message: formState.message.trim(),
        name: formState.name.trim(),
        orderNumber: formState.orderNumber.trim(),
        topic: formState.topic,
      })

      const message = result?.message || 'Message sent. We will get back to you soon.'

      setFormMessage(message)
      setFormState(initialFormState)
      successToast(message)
    } catch (error) {
      const message = getApiErrorMessage(error)

      setFormMessage('')
      errorToast(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="main" sx={{ overflowX: 'hidden', py: { xs: 4, md: 6 } }}>
      <Container>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <PageIntro
            description="Send order questions, product requests, delivery updates, returns, or GST invoice requests to the Raven Fold team."
            eyebrow="Contact"
            sx={{ width: '100%' }}
            title="Need help with Raven Fold?"
          />

          <Box
            sx={{
              width: '100%',
            }}
          >
            <Stack component="form" noValidate onSubmit={handleSubmit} spacing={2.25}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.55rem', md: '1.85rem' },
                  fontWeight: 850,
                  letterSpacing: 0,
                  lineHeight: 1.12,
                }}
              >
                Send us a message
              </Typography>
              {formMessage ? (
                <Alert severity="success" sx={{ borderRadius: 1 }}>
                  {formMessage}
                </Alert>
              ) : null}

              <Box sx={fieldGridSx}>
                <AppInput
                  error={Boolean(errors.name)}
                  errorText={errors.name}
                  label="Name"
                  name="name"
                  onChange={handleFieldChange}
                  placeholder="Your full name"
                  required
                  value={formState.name}
                />
                <AppInput
                  error={Boolean(errors.email)}
                  errorText={errors.email}
                  label="Email"
                  name="email"
                  onChange={handleFieldChange}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={formState.email}
                />
              </Box>

              <Box sx={fieldGridSx}>
                <AppInput
                  label="Topic"
                  name="topic"
                  onChange={handleFieldChange}
                  select
                  value={formState.topic}
                >
                  {supportTopics.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </AppInput>
                <AppInput
                  label="Order number"
                  name="orderNumber"
                  onChange={handleFieldChange}
                  placeholder="Optional"
                  value={formState.orderNumber}
                />
              </Box>

              <AppInput
                error={Boolean(errors.message)}
                errorText={errors.message}
                label="Message"
                minRows={6}
                multiline
                name="message"
                onChange={handleFieldChange}
                placeholder="Write your question or request"
                required
                value={formState.message}
              />

              <Stack
                alignItems={isMobile ? 'stretch' : 'center'}
                direction={isMobile ? 'column' : 'row'}
                spacing={1.5}
              >
                <AppButton loading={submitting} loadingText="Sending..." size="large" type="submit" variant="contained">
                  Send message
                </AppButton>
                <AppButton
                  component={Link}
                  href={whatsappLink}
                  rel="noreferrer"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  target="_blank"
                  variant="outlined"
                >
                  Open WhatsApp
                </AppButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default Contacts
