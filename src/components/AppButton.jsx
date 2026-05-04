import { Button, CircularProgress } from '@mui/material'
import { forwardRef } from 'react'

const sizeStyles = {
  small: {
    minHeight: 36,
    px: 1.75,
  },
  medium: {
    minHeight: 44,
    px: 2.25,
  },
  large: {
    minHeight: 48,
    px: 2.75,
  },
}

const AppButton = forwardRef(
  (
    {
      children,
      loading = false,
      loadingText,
      loadingIndicator,
      loaderSize = 16,
      disabled = false,
      size = 'medium',
      fullWidth = false,
      sx,
      startIcon,
      endIcon,
      ...buttonProps
    },
    ref,
  ) => {
    const currentSizeStyle = sizeStyles[size] ?? sizeStyles.medium

    return (
      <Button
        {...buttonProps}
        disabled={disabled || loading}
        endIcon={loading ? null : endIcon}
        fullWidth={fullWidth}
        ref={ref}
        size={size}
        startIcon={
          loading
            ? loadingIndicator ?? (
                <CircularProgress color="inherit" size={loaderSize} thickness={5} />
              )
            : startIcon
        }
        sx={[
          {
            borderRadius: 2,
            fontSize: '0.95rem',
            fontWeight: 700,
            lineHeight: 1.2,
            ...currentSizeStyle,
          },
          sx,
        ]}
      >
        {loading ? loadingText ?? children : children}
      </Button>
    )
  },
)

export default AppButton
