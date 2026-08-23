import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
  Alert,
  Box,
  Container,
  Divider,
  Link,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import AppButton from '../components/AppButton.jsx'
import AppInput from '../components/AppInput.jsx'
import PageIntro from '../components/PageIntro.jsx'
import useScreenSize from '../hooks/useScreenSize.js'

const supportEmail = 'support@ravenfold.in'
const whatsappNumber = '917439042753'
const whatsappUrl = `https://wa.me/${whatsappNumber}`

const initialFormState = {
  email: '',
  message: '',
  name: '',
  orderNumber: '',
  topic: 'Order support',
}

const contactChannels = [
  {
    description: 'For order help, product questions, and delivery updates.',
    href: `mailto:${supportEmail}`,
    Icon: EmailOutlinedIcon,
    label: supportEmail,
    title: 'Email',
  },
  {
    description: 'Best for quick launch-period questions.',
    href: whatsappUrl,
    Icon: WhatsAppIcon,
    label: '+91 74390 42753',
    title: 'WhatsApp',
  },
  {
    description: 'Monday to Saturday, 9:00 AM to 6:00 PM IST.',
    Icon: ScheduleOutlinedIcon,
    label: 'Usually replies within one business day',
    title: 'Support hours',
  },
]

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

function buildMailtoUrl(formState) {
  const subject = `[Raven Fold] ${formState.topic}${formState.orderNumber ? ` - ${formState.orderNumber}` : ''}`
  const body = [
    `Name: ${formState.name}`,
    `Email: ${formState.email}`,
    `Topic: ${formState.topic}`,
    formState.orderNumber ? `Order number: ${formState.orderNumber}` : '',
    '',
    formState.message,
  ].filter((line) => line !== '').join('\n')

  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function Contacts() {
  const { isDesktop, isMobile } = useScreenSize()
  const [formState, setFormState] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

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
    setSubmitted(false)
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

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitted(true)
    window.location.href = buildMailtoUrl(formState)
  }

  return (
    <Box component="main" sx={{ overflowX: 'hidden', py: isDesktop ? 6 : 4 }}>
      <Container>
        <Stack spacing={isDesktop ? 5 : 4}>
          <Box
            sx={{
              alignItems: 'end',
              display: 'grid',
              gap: isDesktop ? 4 : 2.5,
              gridTemplateColumns: isDesktop ? 'minmax(0, 0.95fr) minmax(320px, 0.55fr)' : '1fr',
            }}
          >
            <PageIntro
              description="Reach the Raven Fold team for order help, delivery questions, product details, returns, and GST invoice support."
              eyebrow="Contact"
              sx={{ maxWidth: 720 }}
              title="How can we help?"
            />

            <Box
              sx={{
                borderLeft: isDesktop ? '1px solid' : 0,
                borderColor: 'divider',
                pl: isDesktop ? 3 : 0,
              }}
            >
              <Stack spacing={1}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  Existing order?
                </Typography>
                <Typography sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  Include your order number so we can check payment, shipment, invoice, or delivery status faster.
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {contactChannels.map(({ description, href, Icon, label, title }) => (
              <Box
                key={title}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  minHeight: 172,
                  p: 2.5,
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      bgcolor: 'rgba(30, 41, 82, 0.08)',
                      color: 'primary.main',
                      display: 'inline-flex',
                      height: 42,
                      justifyContent: 'center',
                      width: 42,
                    }}
                  >
                    <Icon />
                  </Box>

                  <Stack spacing={0.55}>
                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 800 }}>
                      {title}
                    </Typography>
                    {href ? (
                      <Link
                        href={href}
                        rel={title === 'WhatsApp' ? 'noreferrer' : undefined}
                        sx={{ color: 'primary.main', fontWeight: 800, overflowWrap: 'anywhere' }}
                        target={title === 'WhatsApp' ? '_blank' : undefined}
                        underline="hover"
                      >
                        {label}
                      </Link>
                    ) : (
                      <Typography sx={{ color: 'primary.main', fontWeight: 800 }}>
                        {label}
                      </Typography>
                    )}
                    <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {description}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              bgcolor: 'background.paper',
              display: 'grid',
              gap: isDesktop ? 4 : 3,
              gridTemplateColumns: isDesktop ? 'minmax(0, 0.45fr) minmax(0, 0.55fr)' : '1fr',
              p: isDesktop ? 4 : 2.5,
            }}
          >
            <Stack spacing={2.5}>
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: 'rgba(217, 70, 31, 0.1)',
                  color: 'secondary.main',
                  display: 'inline-flex',
                  height: 46,
                  justifyContent: 'center',
                  width: 46,
                }}
              >
                <LocalShippingOutlinedIcon />
              </Box>

              <Stack spacing={1.2}>
                <Typography component="h2" variant="h3">
                  Send an inquiry
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                  Use this form for order changes, shipment questions, returns, product details, or invoice requests.
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={1.15}>
                <Typography sx={{ fontWeight: 800 }}>Faster support checklist</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Add your order number for order-specific requests and mention the exact product name when asking about fit, material, or availability.
                </Typography>
              </Stack>
            </Stack>

            <Stack component="form" noValidate onSubmit={handleSubmit} spacing={2.25}>
              {submitted ? (
                <Alert severity="success" sx={{ borderRadius: 1 }}>
                  Your email draft is ready. Send it from your email app to reach support.
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
                <AppButton size="large" type="submit" variant="contained">
                  Open email draft
                </AppButton>
                <AppButton
                  component={Link}
                  href={whatsappUrl}
                  rel="noreferrer"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  target="_blank"
                  variant="outlined"
                >
                  Message on WhatsApp
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
