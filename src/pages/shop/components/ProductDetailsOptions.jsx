import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded'
import {
  Box,
  ButtonBase,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import AppOverlayDialog from '../../../components/AppOverlayDialog.jsx'

const getOptionKey = (option = {}) => option.id || option.name
const getValueKey = (value = {}) => value.id || value.value
const getValueLabel = (value = {}) => value.label || value.value

function ProductDetailsOptions({
  groups = [],
  isValueAvailable = () => true,
  onSelectOption,
  selectedOptions = {},
}) {
  const [activeSizeGuide, setActiveSizeGuide] = useState(null)

  if (!groups.length) {
    return null
  }

  return (
    <>
      <Stack spacing={2.35}>
        {groups.map((group) => {
          const optionKey = getOptionKey(group)
          const activeValueKey = selectedOptions[optionKey] || getValueKey(group.values[0])
          const activeValue = group.values.find((value) => getValueKey(value) === activeValueKey)
          const displayStyle = group.displayStyle || (group.optionType === 'color' ? 'swatch' : 'button')
          const shouldRenderSwatches = group.optionType === 'color' || displayStyle === 'swatch'
          const shouldRenderDropdown = displayStyle === 'dropdown'
          const sizeGuideUrl = group.optionType === 'size' ? group.sizeGuideImageUrl : ''

          return (
            <Stack key={optionKey} spacing={1.15}>
              <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    minHeight: 24,
                  }}
                >
                  {group.name}
                  {activeValue ? (
                    <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>
                      {' '}
                      / {getValueLabel(activeValue)}
                    </Box>
                  ) : null}
                </Typography>

                {sizeGuideUrl ? (
                  <ButtonBase
                    aria-label={`Open ${group.name.toLowerCase()} guide`}
                    onClick={() => setActiveSizeGuide({
                      title: `${group.name} Guide`,
                      url: sizeGuideUrl,
                    })}
                    sx={{
                      alignItems: 'center',
                      color: 'secondary.main',
                      display: 'inline-flex',
                      flexShrink: 0,
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      gap: 0.75,
                      lineHeight: 1.1,
                      minHeight: 24,
                      p: 0,
                      verticalAlign: 'middle',
                      '& svg': {
                        display: 'block',
                        flexShrink: 0,
                        fontSize: 20,
                      },
                    }}
                    type="button"
                  >
                    <StraightenRoundedIcon />
                    Size Guide
                  </ButtonBase>
                ) : null}
              </Stack>

              {shouldRenderDropdown ? (
                <TextField
                  select
                  size="small"
                  value={activeValueKey || ''}
                  onChange={(event) => {
                    const nextValue = group.values.find((value) => getValueKey(value) === event.target.value)

                    if (nextValue) {
                      onSelectOption?.(group, nextValue)
                    }
                  }}
                  sx={{ maxWidth: 280 }}
                >
                  {group.values.map((value) => {
                    const valueKey = getValueKey(value)
                    const isAvailable = isValueAvailable(group, value)

                    return (
                      <MenuItem disabled={!isAvailable} key={valueKey} value={valueKey}>
                        {getValueLabel(value)}
                      </MenuItem>
                    )
                  })}
                </TextField>
              ) : (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {group.values.map((value) => {
                    const valueKey = getValueKey(value)
                    const isActive = valueKey === activeValueKey
                    const isAvailable = isValueAvailable(group, value)

                    if (shouldRenderSwatches) {
                      return (
                        <Tooltip key={valueKey} title={getValueLabel(value)}>
                          <Box
                            aria-label={`${group.name}: ${getValueLabel(value)}`}
                            component="button"
                            disabled={!isAvailable}
                            onClick={() => onSelectOption?.(group, value)}
                            sx={{
                              alignItems: 'center',
                              appearance: 'none',
                              bgcolor: 'transparent',
                              border: '1px solid',
                              borderColor: isActive ? 'text.primary' : 'transparent',
                              borderRadius: '50%',
                              cursor: isAvailable ? 'pointer' : 'not-allowed',
                              display: 'inline-flex',
                              height: 34,
                              justifyContent: 'center',
                              opacity: isAvailable ? 1 : 0.36,
                              p: 0,
                              transition: 'border-color 160ms ease, opacity 160ms ease',
                              width: 34,
                              '&:focus-visible': {
                                outline: '2px solid',
                                outlineColor: 'primary.main',
                                outlineOffset: 2,
                              },
                            }}
                            type="button"
                          >
                            <Box
                              sx={{
                                alignItems: 'center',
                                bgcolor: value.colorHex || 'transparent',
                                border: '1px solid rgba(24, 24, 27, 0.18)',
                                borderRadius: '50%',
                                color: 'text.secondary',
                                display: 'flex',
                                fontSize: '0.62rem',
                                fontWeight: 900,
                                height: 24,
                                justifyContent: 'center',
                                width: 24,
                              }}
                            >
                              {value.colorHex ? null : getValueLabel(value).slice(0, 1)}
                            </Box>
                          </Box>
                        </Tooltip>
                      )
                    }

                    return (
                      <ButtonBase
                        disabled={!isAvailable}
                        key={valueKey}
                        onClick={() => onSelectOption?.(group, value)}
                        sx={{
                          bgcolor: isActive ? 'text.primary' : 'transparent',
                          border: '1px solid',
                          borderColor: isActive ? 'text.primary' : 'divider',
                          color: isActive ? 'background.default' : 'text.primary',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          minHeight: 42,
                          minWidth: 58,
                          opacity: isAvailable ? 1 : 0.38,
                          px: 1.45,
                          textDecoration: isAvailable ? 'none' : 'line-through',
                          transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
                          '&:hover': {
                            borderColor: 'text.primary',
                          },
                        }}
                      >
                        {getValueLabel(value)}
                      </ButtonBase>
                    )
                  })}
                </Stack>
              )}
            </Stack>
          )
        })}
      </Stack>

      <AppOverlayDialog
        closeButtonLabel="Close size guide"
        contentSx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
        onClose={() => setActiveSizeGuide(null)}
        open={Boolean(activeSizeGuide)}
      >
        {activeSizeGuide?.url ? (
          <Box
            alt={activeSizeGuide.title || 'Size guide'}
            component="img"
            decoding="async"
            src={activeSizeGuide.url}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 28px 90px rgba(0, 0, 0, 0.36)',
              display: 'block',
              maxHeight: { xs: '86dvh', sm: '88dvh' },
              maxWidth: { xs: '92vw', sm: '78vw', lg: '64vw' },
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        ) : null}
      </AppOverlayDialog>
    </>
  )
}

export default ProductDetailsOptions
