import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
    Alert,
    Box,
    MenuItem,
    Stack,
} from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from '../../../../components/AppButton'
import AppInput from '../../../../components/AppInput'
import useResponsiveView from '../../../../hooks/useResponsiveView'
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

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Prefer Not To Say', value: 'prefer-not-to-say' },

]

const profileFieldDefinitions = [
    {
        autoComplete: 'name',
        label: 'Full Name',
        name: 'name',
        placeholder: 'Add full name',
        required: true,
        type: 'text',
    },
    {
        autoComplete: 'email',
        label: 'Your Email',
        name: 'email',
        placeholder: 'Add email',
        required: true,
        type: 'email',
    },
    {
        autoComplete: 'tel',
        label: 'Mobile No',
        name: 'phone',
        placeholder: 'Add phone number',
        type: 'tel',
    },
    { label: 'Gender', name: 'gender', placeholder: 'Select Gender', type: 'select' },
    { label: 'Date of Birth', name: 'dob', type: 'date' },
]

const fieldOrder = ['name', 'gender', 'dob', 'email', 'phone']

const fieldLayout = {
    name: { gridColumn: '1 / -1' },
}

const formFieldSx = {
    '& .MuiInputBase-input': {
        '&::placeholder': {
            color: '#596070',
            opacity: 1,
        },
        color: '#596070',
        fontSize: '0.8rem',
        px: 1.5,
        py: 1.1,
    },
    '& .MuiInputBase-input.MuiSelect-select': {
        alignItems: 'center',
        display: 'flex',
        minHeight: 'unset',
        py: 1.1,
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'background.paper',
        borderRadius: 1.5,
        minHeight: 44,
        '& fieldset': {
            borderColor: '#e2e5ea',
        },
        '&:hover fieldset': {
            borderColor: 'text.secondary',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 1,
        },
    },
}

const lockedFormFieldSx = {
    ...formFieldSx,
    '& .MuiOutlinedInput-root': {
        ...formFieldSx['& .MuiOutlinedInput-root'],
        backgroundColor: 'rgba(17, 24, 39, 0.04)',
    },
    '& .MuiInputBase-input': {
        ...formFieldSx['& .MuiInputBase-input'],
        WebkitTextFillColor: '#596070',
    },
}

const fieldLabelSx = {
    color: 'text.primary',
    fontSize: '0.85rem',
    fontWeight: 700,
    mb: 0.625,
}

const getFieldByName = (fields, fieldName) =>
    fields.find((field) => field.name === fieldName)

const normalizeGender = (gender) => {
    const normalizedGender = String(gender || '').trim().toLowerCase()

    return genderOptions.some((option) => option.value === normalizedGender)
        ? normalizedGender
        : ''
}

const getGenderLabel = (gender) =>
    genderOptions.find((option) => option.value === gender)?.label || ''

const renderGenderValue = (selectedValue, placeholder) => {
    const label = getGenderLabel(selectedValue)

    return label || (
        <Box component="span" sx={{ color: '#596070' }}>
            {placeholder}
        </Box>
    )
}

const getFieldValue = (field) => (
    typeof field?.value === 'string' ? field.value : ''
)

const trimValue = (value) => (
    typeof value === 'string' ? value.trim() : value
)

const buildProfileFields = (user = {}) => {
    const sourceUser = user || {}

    return profileFieldDefinitions.map((field) => ({
        ...field,
        value:
            field.name === 'gender'
                ? normalizeGender(sourceUser.gender)
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
            [field.name]: trimValue(field.value),
        }
    }, {})
}

const validateEmail = (value) => {
    const email = value.trim()

    if (!email) {
        return 'Email is required.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Enter a valid email address.'
    }

    return ''
}

const validateProfileFields = (fields) => {
    const name = getFieldValue(getFieldByName(fields, 'name')).trim()
    const email = getFieldValue(getFieldByName(fields, 'email'))

    return {
        name: name ? '' : 'Full name is required.',
        email: validateEmail(email),
    }
}

const hasValidationErrors = (errors) =>
    Object.values(errors).some(Boolean)

function Info() {
    const { isDesktop, isMobile } = useResponsiveView()
    const authToken = useSelector(selectAuthToken)
    const authUser = useSelector(selectAuthUser)
    const dispatch = useDispatch()
    const [profileFields, setProfileFields] = useState(() => buildProfileFields(authUser))
    const [draftFields, setDraftFields] = useState(() => buildProfileFields(authUser))
    const [fieldErrors, setFieldErrors] = useState({})
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
        setFieldErrors({})
    }

    const handleCancel = () => {
        setDraftFields(profileFields)
        setIsEditing(false)
        setFormError('')
        setFieldErrors({})
    }

    const handleUpdate = async () => {
        setFormError('')

        const nextFieldErrors = validateProfileFields(draftFields)

        setFieldErrors(nextFieldErrors)

        if (hasValidationErrors(nextFieldErrors)) {
            return
        }

        setIsSaving(true)

        try {
            const user = await updateCurrentUserProfile(buildProfilePayload(draftFields))
            const nextFields = buildProfileFields(user)

            setProfileFields(nextFields)
            setDraftFields(nextFields)
            setFieldErrors({})
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
        if (!isEditing) {
            return
        }

        const nextValue = event.target.value

        setDraftFields((currentFields) =>
            currentFields.map((field) =>
                field.name === fieldName && !field.readOnly
                    ? { ...field, value: nextValue }
                    : field,
            ),
        )
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: '',
        }))
        setFormError('')
    }

    const renderProfileField = (field) => {
        const isLocked = !isEditing || field.readOnly
        const isGenderField = field.name === 'gender'

        return (
            <Box key={field.name} sx={fieldLayout[field.name]}>
                <AppInput
                    autoComplete={field.autoComplete}
                    error={Boolean(fieldErrors[field.name])}
                    errorText={fieldErrors[field.name]}
                    fieldSx={isLocked ? lockedFormFieldSx : formFieldSx}
                    label={field.label}
                    labelSx={fieldLabelSx}
                    name={field.name}
                    onChange={handleFieldChange(field.name)}
                    placeholder={field.placeholder}
                    required={field.required}
                    select={isGenderField}
                    slotProps={{
                        select: isGenderField
                            ? {
                                displayEmpty: true,
                                renderValue: (selectedValue) =>
                                    renderGenderValue(selectedValue, field.placeholder),
                            }
                            : undefined,
                        input: {
                            readOnly: isLocked,
                        },
                    }}
                    type={isGenderField ? undefined : field.type}
                    value={field.value}
                >
                    {isGenderField ? (
                        <MenuItem value="">
                            <Box component="span" sx={{ color: '#596070' }}>
                                Select Gender
                            </Box>
                        </MenuItem>
                    ) : null}
                    {isGenderField
                        ? genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))
                        : null}
                </AppInput>
            </Box>
        )
    }

    const orderedFields = fieldOrder
        .map((fieldName) => getFieldByName(draftFields, fieldName))
        .filter(Boolean)

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

            <Box
                sx={{
                    display: 'grid',
                    gap: isDesktop ? 2.5 : 2,
                    gridTemplateColumns: isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                }}
            >
                {orderedFields.map(renderProfileField)}
            </Box>

            {isEditing ? (
                <Stack
                    direction={isMobile ? 'column' : 'row'}
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
