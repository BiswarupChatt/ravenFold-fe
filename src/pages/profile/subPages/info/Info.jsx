import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import AppButton from '../../../../components/AppButton'
import AppInput from '../../../../components/AppInput'
import ProfileIntro from '../../components/ProfileIntro'

const initialProfileFields = [
    { label: 'Full name', name: 'fullName', type: 'text', value: 'Biswarup Chatterjee' },
    { label: 'Email', name: 'email', type: 'email', value: 'biswarup@example.com' },
    { label: 'Phone', name: 'phone', type: 'tel', value: '+91 98765 43210' },
    { label: 'Member since', name: 'memberSince', type: 'text', value: '2026' },
]

function Info() {
    const [profileFields, setProfileFields] = useState(initialProfileFields)
    const [draftFields, setDraftFields] = useState(initialProfileFields)
    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        setDraftFields(profileFields)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setDraftFields(profileFields)
        setIsEditing(false)
    }

    const handleUpdate = () => {
        setProfileFields(draftFields)
        setIsEditing(false)
    }

    const handleFieldChange = (fieldName) => (event) => {
        const nextValue = event.target.value

        setDraftFields((currentFields) =>
            currentFields.map((field) =>
                field.name === fieldName
                    ? { ...field, value: nextValue }
                    : field,
            ),
        )
    }

    return (
        <Stack spacing={3}>
            <ProfileIntro
                action={
                    !isEditing ? (
                    <AppButton
                        onClick={handleEdit}
                        startIcon={<EditOutlinedIcon />}
                        sx={{
                            px: 0,
                        }}
                        type="button"
                        variant="text"
                    >
                        Edit
                    </AppButton>
                    ) : null
                }
                description="Your default profile details for orders and account updates."
                title="Personal Info"
            />


            <Stack spacing={0}>
                <Divider />
                {draftFields.map((field) => (
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
                        <Typography color="text.secondary" fontWeight={700} sx={{ alignContent: "center" }}>
                            {field.label}
                        </Typography>
                        <AppInput
                            fieldSx={
                                !isEditing
                                    ? {
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(17, 24, 39, 0.04)',
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'text.secondary',
                                            WebkitTextFillColor: 'currentColor',
                                        },
                                    }
                                    : undefined
                            }
                            name={field.name}
                            onChange={handleFieldChange(field.name)}
                            slotProps={{
                                input: {
                                    readOnly: !isEditing,
                                },
                            }}
                            type={field.type}
                            value={field.value}
                        />
                    </Box>
                ))}
            </Stack>

            {isEditing ? (
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="flex-end"
                    spacing={1.5}
                >
                    <AppButton onClick={handleCancel} type="button" variant="outlined">
                        Cancel
                    </AppButton>
                    <AppButton onClick={handleUpdate} type="button" variant="contained">
                        Update
                    </AppButton>
                </Stack>
            ) : null}
        </Stack>
    )
}

export default Info
