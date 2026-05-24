import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded'
import { Box, Button, Stack, Typography } from '@mui/material'

const colorMap = {
  black: '#18181b',
  blue: '#1e3a8a',
  brown: '#8b5e3c',
  chestnut: '#9a724d',
  green: '#394333',
  grey: '#7a7a7a',
  gray: '#7a7a7a',
  navy: '#1e2952',
  olive: '#84864b',
  red: '#b91c1c',
  tan: '#c4a484',
  white: '#f7f4ef',
}

const buildOptionGroups = (variants = []) => {
  const groups = new Map()

  variants.forEach((variant) => {
    variant.optionValues?.forEach((option) => {
      const name = option.optionName || 'Option'
      const values = groups.get(name) || []

      if (option.value && !values.includes(option.value)) {
        values.push(option.value)
      }

      groups.set(name, values)
    })
  })

  return Array.from(groups, ([name, values]) => ({ name, values }))
}

function ProductDetailsOptions({ variants }) {
  const optionGroups = buildOptionGroups(variants)

  if (!optionGroups.length) {
    return null
  }

  return (
    <Stack spacing={2.5}>
      {optionGroups.map((group) => {
        const isColor = /colou?r/i.test(group.name)
        const activeValue = group.values[0]

        return (
          <Stack key={group.name} spacing={1.25}>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                {group.name}: <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>{activeValue}</Box>
              </Typography>

              {!isColor ? (
                <Button
                  color="secondary"
                  startIcon={<StraightenRoundedIcon />}
                  sx={{ px: 0 }}
                  variant="text"
                >
                  Size Guide
                </Button>
              ) : null}
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {group.values.map((value) => (
                isColor ? (
                  <Box
                    aria-label={value}
                    key={value}
                    sx={{
                      bgcolor: colorMap[value.toLowerCase()] || '#9ca3af',
                      border: value === activeValue ? 2 : 1,
                      borderColor: value === activeValue ? 'text.primary' : 'divider',
                      borderRadius: '50%',
                      height: 44,
                      width: 44,
                    }}
                  />
                ) : (
                  <Button
                    key={value}
                    sx={{
                      borderColor: value === activeValue ? 'text.primary' : 'divider',
                      borderRadius: 0,
                      color: 'text.primary',
                      minHeight: 48,
                      minWidth: 104,
                    }}
                    variant="outlined"
                  >
                    {value}
                  </Button>
                )
              ))}
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default ProductDetailsOptions
