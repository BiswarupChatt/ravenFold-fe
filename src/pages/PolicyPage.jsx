import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import PageIntro from '../components/PageIntro.jsx'
import useScreenSize from '../hooks/useScreenSize.js'
import { getApiErrorMessage } from '../services/apiClient.js'
import { getPublishedPolicy } from '../services/policyApi.js'
import { extractPlainTextFromHtml, sanitizeHtmlForRender } from '../utils/safeHtml.js'

const DEFAULT_SEO_DESCRIPTION = 'Read Raven Fold policy details and latest published updates.'

const setMetaDescription = (description) => {
  const content = description || DEFAULT_SEO_DESCRIPTION
  let metaDescription = document.querySelector('meta[name="description"]')

  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }

  metaDescription.setAttribute('content', content)
}

const formatDate = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function PolicyPage() {
  const { isDesktop } = useScreenSize()
  const params = useParams()
  const policySlug = params.slug
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    window.queueMicrotask(() => {
      if (ignore) return
      setLoading(true)
      setError('')
    })

    getPublishedPolicy(policySlug)
      .then((nextPolicy) => {
        if (ignore) return
        setPolicy(nextPolicy)
      })
      .catch((err) => {
        if (ignore) return
        setPolicy(null)
        setError(getApiErrorMessage(err))
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [policySlug])

  const safeHtml = useMemo(() => sanitizeHtmlForRender(policy?.contentHtml || ''), [policy?.contentHtml])
  const plainText = useMemo(() => extractPlainTextFromHtml(safeHtml), [safeHtml])

  useEffect(() => {
    const title = policy?.seo?.title || policy?.title || 'Policy'
    const description = policy?.seo?.description || plainText.slice(0, 155) || DEFAULT_SEO_DESCRIPTION

    document.title = `${title} | Raven Fold`
    setMetaDescription(description)
  }, [plainText, policy])

  return (
    <Container sx={{ py: isDesktop ? 8 : 6 }}>
      <Stack spacing={3}>
        {loading ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CircularProgress size={22} />
            <Typography color="text.secondary">Loading policy...</Typography>
          </Stack>
        ) : null}

        {!loading && error ? (
          <Paper sx={{ p: isDesktop ? 5 : 3 }} variant="outlined">
            <Stack spacing={2}>
              <Alert severity="error">
                {error === 'Published policy not found'
                  ? 'This policy is not available yet.'
                  : error || 'Unable to load this policy right now.'}
              </Alert>
              <Button href="/" sx={{ alignSelf: 'flex-start' }} variant="outlined">
                Back to Home
              </Button>
            </Stack>
          </Paper>
        ) : null}

        {!loading && !error && policy ? (
          <>
            <PageIntro
              description={[
                policy.updatedAt ? `Last updated ${formatDate(policy.updatedAt)}` : '',
              ].filter(Boolean).join(' - ')}
              eyebrow="Policy"
              spacing={2}
              sx={{ maxWidth: 780 }}
              title={policy.title}
            />

            <Paper sx={{ p: isDesktop ? 5 : 3 }} variant="outlined">
              {plainText ? (
                <Box
                  className="policy-content"
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                  sx={{
                    '& a': {
                      color: 'secondary.main',
                    },
                    '& blockquote': {
                      borderLeft: '3px solid',
                      borderColor: 'secondary.main',
                      color: 'text.secondary',
                      m: '0 0 1rem',
                      pl: 2,
                    },
                    '& h1': {
                      fontSize: '2rem',
                      lineHeight: 1.15,
                      mb: 2,
                    },
                    '& h2': {
                      fontSize: '1.55rem',
                      lineHeight: 1.2,
                      mb: 1.5,
                      mt: 3,
                    },
                    '& h3': {
                      fontSize: '1.2rem',
                      lineHeight: 1.25,
                      mb: 1.25,
                      mt: 2.5,
                    },
                    '& li': {
                      mb: 0.75,
                    },
                    '& ol, & ul': {
                      color: 'text.secondary',
                      lineHeight: 1.75,
                      pl: 3,
                    },
                    '& p': {
                      color: 'text.secondary',
                      lineHeight: 1.75,
                      mb: 2,
                    },
                    '.align-center': { textAlign: 'center' },
                    '.align-justify': { textAlign: 'justify' },
                    '.align-left': { textAlign: 'left' },
                    '.align-right': { textAlign: 'right' },
                  }}
                />
              ) : (
                <Typography color="text.secondary">
                  This policy has no content yet.
                </Typography>
              )}
            </Paper>
          </>
        ) : null}
      </Stack>
    </Container>
  )
}

export default PolicyPage
