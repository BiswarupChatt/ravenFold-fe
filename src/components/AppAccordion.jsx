import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'

const toSxArray = (value) => {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function AppAccordion({
  children,
  defaultExpanded = false,
  detailsProps,
  detailsSx,
  disabled = false,
  expanded,
  expandIcon = <ExpandMoreRoundedIcon />,
  onChange,
  summaryProps,
  summarySx,
  sx,
  title,
  titleSx,
  ...accordionProps
}) {
  const { sx: summaryPropsSx, ...restSummaryProps } = summaryProps || {}
  const { sx: detailsPropsSx, ...restDetailsProps } = detailsProps || {}
  const expansionProps = expanded === undefined ? { defaultExpanded } : { expanded }

  return (
    <Accordion
      {...accordionProps}
      {...expansionProps}
      disabled={disabled}
      disableGutters
      elevation={0}
      onChange={onChange}
      sx={[
        {
          bgcolor: 'transparent',
          borderBottom: '1px solid',
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          m: 0,
          minWidth: 0,
          width: '100%',
          '&:before': {
            display: 'none',
          },
          '&&.Mui-expanded': {
            m: 0,
          },
          '& + .MuiAccordion-root': {
            borderTop: 0,
            mt: 0,
          },
        },
        ...toSxArray(sx),
      ]}
    >
      <AccordionSummary
        expandIcon={expandIcon}
        {...restSummaryProps}
        sx={[
          {
            minHeight: 52,
            px: 0,
            '& .MuiAccordionSummary-content': {
              my: 1.25,
              minWidth: 0,
            },
          },
          ...toSxArray(summarySx),
          ...toSxArray(summaryPropsSx),
        ]}
      >
        {typeof title === 'string' ? (
          <Typography
            component="span"
            sx={[
              {
                fontSize: '0.94rem',
                fontWeight: 900,
                minWidth: 0,
                overflowWrap: 'anywhere',
              },
              ...toSxArray(titleSx),
            ]}
          >
            {title}
          </Typography>
        ) : (
          title
        )}
      </AccordionSummary>

      <AccordionDetails
        {...restDetailsProps}
        sx={[
          {
            pb: 2,
            pt: 0,
            px: 0,
          },
          ...toSxArray(detailsSx),
          ...toSxArray(detailsPropsSx),
        ]}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default AppAccordion
