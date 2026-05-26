import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded'
import { Box, Button, ButtonBase, Stack, Tooltip, Typography } from '@mui/material'

const colorMap = {
  ash: '#d6d3cc',
  beige: '#d7c5a9',
  black: '#111111',
  blue: '#245f9f',
  brown: '#8b5e3c',
  chestnut: '#9a724d',
  cream: '#f3ead7',
  forest: '#3f4a32',
  green: '#4f5b3d',
  grey: '#7a7a7a',
  gray: '#7a7a7a',
  ivory: '#f7f2e7',
  navy: '#1e2952',
  olive: '#777c45',
  red: '#b91c1c',
  tan: '#c4a484',
  white: '#f7f4ef',
}

const isColorOption = (name = '') => /colou?r/i.test(name)

const getSwatchColor = (value = '') => {
  const normalizedValue = value.trim().toLowerCase()

  if (/^#([0-9a-f]{3}){1,2}$/i.test(normalizedValue)) {
    return normalizedValue
  }

  const matchedColor = Object.entries(colorMap).find(([name]) => normalizedValue.includes(name))

  return matchedColor?.[1] || '#9ca3af'
}

function ProductDetailsOptions({
  groups = [],
  isValueAvailable = () => true,
  onSelectOption,
  selectedOptions = {},
}) {
  if (!groups.length) {
    return null
  }

  return (
    <Stack spacing={2.35}>
      {groups.map((group) => {
        const activeValue = selectedOptions[group.name] || group.values[0] || ''
        const isColor = isColorOption(group.name)
        const showSizeGuide = !isColor && /size|fit/i.test(group.name)

        return (
          <Stack key={group.name} spacing={1.15}>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {group.name}
                {activeValue ? (
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>
                    {' '}
                    / {activeValue}
                  </Box>
                ) : null}
              </Typography>

              {showSizeGuide ? (
                <Button
                  color="secondary"
                  size="small"
                  startIcon={<StraightenRoundedIcon fontSize="small" />}
                  sx={{
                    fontSize: '0.82rem',
                    minHeight: 30,
                    px: 0,
                  }}
                  variant="text"
                >
                  Size Guide
                </Button>
              ) : null}
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {group.values.map((value) => {
                const isActive = value === activeValue
                const isAvailable = isValueAvailable(group.name, value)

                if (isColor) {
                  return (
                    <Tooltip key={value} title={value}>
                      <Box
                        aria-label={`${group.name}: ${value}`}
                        component="button"
                        disabled={!isAvailable}
                        onClick={() => onSelectOption?.(group.name, value)}
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
                            bgcolor: getSwatchColor(value),
                            border: '1px solid rgba(24, 24, 27, 0.14)',
                            borderRadius: '50%',
                            height: 24,
                            width: 24,
                          }}
                        />
                      </Box>
                    </Tooltip>
                  )
                }

                return (
                  <ButtonBase
                    disabled={!isAvailable}
                    key={value}
                    onClick={() => onSelectOption?.(group.name, value)}
                    sx={{
                      border: '1px solid',
                      borderColor: isActive ? 'text.primary' : 'divider',
                      color: isActive ? 'background.default' : 'text.primary',
                      bgcolor: isActive ? 'text.primary' : 'transparent',
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
                    {value}
                  </ButtonBase>
                )
              })}
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default ProductDetailsOptions
