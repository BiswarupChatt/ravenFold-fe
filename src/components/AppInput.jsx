import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { forwardRef, useId, useState } from 'react'

const AppInput = forwardRef(
  (
    {
      id: idProp,
      label,
      error = false,
      errorText,
      leftAdornment,
      rightAdornment,
      required = false,
      fullWidth = true,
      sx,
      fieldSx,
      labelSx,
      slotProps,
      ...textFieldProps
    },
    ref,
  ) => {
    const generatedId = useId()
    const id = idProp ?? generatedId
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = textFieldProps.type === 'password'
    const type = isPassword && showPassword ? 'text' : textFieldProps.type

    const endAdornmentContent = isPassword ? (
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.25 }}>
        {rightAdornment}
        <IconButton
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          edge="end"
          onClick={() => setShowPassword((current) => !current)}
          onMouseDown={(event) => event.preventDefault()}
          size="small"
          sx={{ color: 'text.secondary', mr: -0.5 }}
        >
          {showPassword ? (
            <VisibilityOffRoundedIcon fontSize="small" />
          ) : (
            <VisibilityRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    ) : (
      rightAdornment
    )

    return (
      <Box sx={sx}>
        {label ? (
          <Typography
            component="label"
            htmlFor={id}
            sx={[
              {
                color: 'text.primary',
                display: 'inline-flex',
                fontSize: '0.85rem',
                fontWeight: 700,
                gap: 0.2,
                lineHeight: 1.2,
                mb: 0.625,
              },
              labelSx,
            ]}
          >
            {label}
            {required ? ' *' : ''}
          </Typography>
        ) : null}

        <TextField
          {...textFieldProps}
          error={error}
          fullWidth={fullWidth}
          helperText={error ? errorText : undefined}
          id={id}
          inputRef={ref}
          required={required}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps?.input,
              startAdornment: leftAdornment ? (
                <InputAdornment position="start">
                  {leftAdornment}
                </InputAdornment>
              ) : (
                slotProps?.input?.startAdornment
              ),
              endAdornment: endAdornmentContent ? (
                <InputAdornment position="end">
                  {endAdornmentContent}
                </InputAdornment>
              ) : (
                slotProps?.input?.endAdornment
              ),
            },
          }}
          sx={[
            {
              '& .MuiFormHelperText-root': {
                mx: 0,
                mt: 0.5,
              },
              '& .MuiInputBase-input': {
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
                fontSize: '0.8rem',
                px: 1.5,
                py: 1.1,
              },
              '& .MuiInputBase-input.MuiInputBase-inputMultiline': {
                px: 1.5,
                py: 0.9,
              },
              '& .MuiOutlinedInput-root': {
                alignItems: textFieldProps.multiline ? 'flex-start' : 'center',
                backgroundColor: 'background.paper',
                borderRadius: 1.5,
                minHeight: textFieldProps.multiline ? 'auto' : 44,
                transition: 'border-color 160ms ease',
                '& .MuiIconButton-root': {
                  p: 0.5,
                },
                '& fieldset': {
                  borderColor: error ? 'error.main' : 'divider',
                },
                '&:hover fieldset': {
                  borderColor: error ? 'error.main' : 'text.secondary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: error ? 'error.main' : 'primary.main',
                  borderWidth: 1,
                },
              },
            },
            fieldSx,
          ]}
          type={type}
        />
      </Box>
    )
  },
)

export default AppInput
