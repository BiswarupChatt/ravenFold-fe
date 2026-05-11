import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import AppButton from '../../../../components/AppButton'

const profileFields = [
    { label: 'Full name', value: 'Biswarup Chatterjee' },
    { label: 'Email', value: 'biswarup@example.com' },
    { label: 'Phone', value: '+91 98765 43210' },
    { label: 'Member since', value: '2026' },
]

function Info() {
    return (
        <Stack spacing={3}>
            <Stack
                alignItems={{ xs: 'stretch', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
            >
                <Box>
                    <Typography variant="h3">Personal Info</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                        Your default profile details for orders and account updates.
                    </Typography>
                </Box>

                <AppButton startIcon={<EditOutlinedIcon />} variant="outlined">
                    Edit
                </AppButton>
            </Stack>

            <Divider />

            <Stack spacing={0}>
                {profileFields.map((field) => (
                    <Box
                        key={field.label}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            display: 'grid',
                            gap: 1,
                            gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                            py: 2,
                        }}
                    >
                        <Typography color="text.secondary" fontWeight={700}>
                            {field.label}
                        </Typography>
                        <Typography>{field.value}</Typography>
                    </Box>
                ))}
            </Stack>
        </Stack>
    )
}

export default Info
