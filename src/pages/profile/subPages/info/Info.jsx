import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Alert, Box, Divider, Stack, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from '../../../../components/AppButton'
import AppInput from '../../../../components/AppInput'
import { getApiErrorMessage } from '../../../../services/apiClient'
import { saveAuthSession } from '../../../../services/authStorage'
import { errorToast, successToast } from '../../../../services/toast'
import { updateCurrentUserProfile } from '../../../../services/userApi'
import {
    selectAuthToken,
    selectAuthUser,
    setAuthSession,
} from '../../../../store/authSlice'
import ProfileIntro from '../../components/ProfileIntro'

const profileFieldDefinitions = [
    { label: 'Full name', name: 'name', placeholder: 'Add full name', type: 'text' },
    { label: 'Email', name: 'email', placeholder: 'Add email', type: 'email' },
    { label: 'Phone', name: 'phone', placeholder: 'Add phone number', type: 'tel' },
    { label: 'Date of birth', name: 'dob', type: 'date' },
    {
        label: 'Member since',
        name: 'memberSince',
        placeholder: 'Not available',
        readOnly: true,
        type: 'text',
    },
]

const formatMemberSince = (createdAt) => {
    if (!createdAt) {
        return ''
    }

    const date = new Date(createdAt)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        year: 'numeric',
    }).format(date)
}

const buildProfileFields = (user = {}) => {
    const sourceUser = user || {}

    return profileFieldDefinitions.map((field) => ({
        ...field,
        value:
            field.name === 'memberSince'
                ? formatMemberSince(sourceUser.createdAt)
                : sourceUser[field.name] || '',
    }))
}

const buildProfilePayload = (fields) => {
    return fields.reduce((payload, field) => {
        if (field.readOnly) {
            return payload
        }

        return {
            ...payload,
            [field.name]: field.value,
        }
    }, {})
}

function Info() {
    const authToken = useSelector(selectAuthToken)
    const authUser = useSelector(selectAuthUser)
    const dispatch = useDispatch()
    const [profileFields, setProfileFields] = useState(() => buildProfileFields(authUser))
    const [draftFields, setDraftFields] = useState(() => buildProfileFields(authUser))
    const [formError, setFormError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const syncAuthUser = useCallback(
        (user) => {
            if (!authToken || !user) {
                return
            }

            const nextSession = {
                token: authToken,
                user,
            }

            saveAuthSession(nextSession)
            dispatch(setAuthSession(nextSession))
        },
        [authToken, dispatch],
    )

    const handleEdit = () => {
        setDraftFields(profileFields)
        setIsEditing(true)
        setFormError('')
    }

    const handleCancel = () => {
        setDraftFields(profileFields)
        setIsEditing(false)
        setFormError('')
    }

    const handleUpdate = async () => {
        setIsSaving(true)
        setFormError('')

        try {
            const user = await updateCurrentUserProfile(buildProfilePayload(draftFields))
            const nextFields = buildProfileFields(user)

            setProfileFields(nextFields)
            setDraftFields(nextFields)
            syncAuthUser(user)
            setIsEditing(false)
            successToast('Profile updated successfully.')
        } catch (error) {
            const message = getApiErrorMessage(error)

            setFormError(message)
            errorToast(message)
        } finally {
            setIsSaving(false)
        }
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

            {formError ? (
                <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                    {formError}
                </Alert>
            ) : null}

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
                                !isEditing || field.readOnly
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
                            placeholder={field.placeholder}
                            slotProps={{
                                input: {
                                    readOnly: !isEditing || field.readOnly,
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
                    <AppButton
                        disabled={isSaving}
                        onClick={handleCancel}
                        type="button"
                        variant="outlined"
                    >
                        Cancel
                    </AppButton>
                    <AppButton
                        loading={isSaving}
                        loadingText="Updating..."
                        onClick={handleUpdate}
                        type="button"
                        variant="contained"
                    >
                        Update
                    </AppButton>
                </Stack>
            ) : null}
        </Stack>
    )
}

export default Info
