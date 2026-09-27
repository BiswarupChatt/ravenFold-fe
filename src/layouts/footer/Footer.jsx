import { useEffect, useState } from 'react'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import LanguageIcon from '@mui/icons-material/Language'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import brandLogo from '../../assets/Logo_Main-05.png'
import { useSiteSettings } from '../../context/SiteSettingsProvider.jsx'
import useScreenSize from '../../hooks/useScreenSize.js'
import { getPublishedPolicies } from '../../services/policyApi.js'

const getSocialIcon = (label = '') => {
    const normalizedLabel = label.toLowerCase()

    if (normalizedLabel.includes('instagram')) return InstagramIcon
    if (normalizedLabel.includes('facebook')) return FacebookRoundedIcon
    if (normalizedLabel.includes('linkedin')) return LinkedInIcon
    if (normalizedLabel.includes('youtube')) return YouTubeIcon

    return LanguageIcon
}

const sectionTitleStyles = {
    color: 'text.primary',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
}

const footerLinkStyles = {
    color: 'text.secondary',
    textDecoration: 'none',
    transition: 'color 160ms ease',
    '&:hover': {
        color: 'secondary.main',
    },
}

const socialLinkStyles = {
    alignItems: 'center',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 999,
    color: 'text.secondary',
    display: 'inline-flex',
    height: 38,
    justifyContent: 'center',
    transition:
        'color 160ms ease, border-color 160ms ease, background-color 160ms ease',
    width: 38,
    '&:hover': {
        bgcolor: 'background.paper',
        borderColor: 'secondary.main',
        color: 'secondary.main',
    },
}

function FooterLinkGroup({ title, links }) {
    return (
        <Stack spacing={1.4}>
            <Typography sx={sectionTitleStyles}>{title}</Typography>

            <Stack spacing={1.1}>
                {links.map((link) => (
                    <Link
                        key={link.to}
                        component={RouterLink}
                        to={link.to}
                        underline="none"
                        sx={footerLinkStyles}
                    >
                        {link.label}
                    </Link>
                ))}
            </Stack>
        </Stack>
    )
}

function Footer() {
    const { isDesktop, isMobile, isTab } = useScreenSize()
    const { settings } = useSiteSettings()
    const [legalLinks, setLegalLinks] = useState([])
    const currentYear = new Date().getFullYear()
    const brandName = settings.brandName || 'Raven Fold'
    const logoUrl = settings.logo?.url || brandLogo
    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        settings.featureFlags?.showBlog ? { label: 'Blog', to: '/blog' } : null,
        { label: 'Contact', to: '/contacts' },
    ].filter(Boolean)
    const socialLinks = Array.isArray(settings.socialLinks)
        ? settings.socialLinks
            .filter((link) => link?.url)
            .map((link) => ({
                href: link.url,
                Icon: getSocialIcon(link.label),
                label: link.label || 'Social link',
            }))
        : []
    const copyrightText = settings.copyrightText
        || `Copyright ${currentYear} ${brandName}. All rights reserved.`
    const gridTemplateColumns = isDesktop
        ? '1.5fr 1fr 1fr'
        : isTab
            ? 'repeat(2, minmax(0, 1fr))'
            : '1fr'

    useEffect(() => {
        let ignore = false

        getPublishedPolicies()
            .then((policies) => {
                if (ignore) return

                setLegalLinks(
                    policies
                        .filter((policy) => policy?.slug && policy?.title)
                        .map((policy) => ({
                            label: policy.footerLabel || policy.title,
                            to: `/${policy.slug}`,
                        }))
                )
            })
            .catch(() => {
                if (!ignore) {
                    setLegalLinks([])
                }
            })

        return () => {
            ignore = true
        }
    }, [])

    return (
        <>
            <Divider />
            <Box
                component="footer"
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    mt: 'auto',
                }}
            >
                <Container sx={{ py: isDesktop ? 7 : 5 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gap: isDesktop ? 4 : 3,
                            gridTemplateColumns,
                        }}
                    >
                        <Stack spacing={2.5} sx={{ maxWidth: isDesktop ? 320 : 'none' }}>
                            <Link
                                component={RouterLink}
                                to="/"
                                underline="none"
                                sx={{
                                    alignItems: 'center',
                                    color: 'text.primary',
                                    display: 'inline-flex',
                                    gap: 1.5,
                                    width: 'fit-content',
                                }}
                            >
                                <Box
                                    alt={brandName}
                                    component="img"
                                    src={logoUrl}
                                    sx={{
                                        display: 'block',
                                        height: 40,
                                        objectFit: 'contain',
                                        objectPosition: 'left center',
                                        width: 190,
                                    }}
                                />
                            </Link>

                            <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                {settings.seo?.description || 'Thoughtful carry goods, cleaner shopping flows, and a storefront foundation built to feel calm, useful, and easy to trust.'}
                            </Typography>

                            <Stack spacing={0.9}>
                                <Typography sx={sectionTitleStyles}>Support</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    {settings.contact?.supportEmail || 'support@ravenfold.com'}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    {settings.contact?.businessHours || 'Mon - Sat, 9:00 AM - 6:00 PM'}
                                </Typography>
                            </Stack>
                        </Stack>

                        <FooterLinkGroup links={quickLinks} title="Quick Links" />
                        {legalLinks.length > 0 ? (
                            <FooterLinkGroup links={legalLinks} title="Legal" />
                        ) : null}
                    </Box>

                    <Divider
                        sx={{
                            borderColor: 'divider',
                            my: isDesktop ? 4 : 3,
                        }}
                    />

                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: 1.25,
                            width: '100%',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                textAlign: isMobile ? 'center' : 'left',
                            }}
                        >
                            {copyrightText}
                        </Typography>

                        {socialLinks.length ? (
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ justifyContent: 'center', ml: isMobile ? 0 : 'auto' }}
                            >
                                {socialLinks.map(({ label, href, Icon }) => (
                                    <Link
                                        key={`${label}-${href}`}
                                        aria-label={label}
                                        href={href}
                                        rel="noreferrer"
                                        sx={socialLinkStyles}
                                        target="_blank"
                                        underline="none"
                                    >
                                        <Icon sx={{ fontSize: 20 }} />
                                    </Link>
                                ))}
                            </Stack>
                        ) : null}
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default Footer
