import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import AppButton from '../../../components/AppButton.jsx'
import BillingDetails from './BillingDetails.jsx'
import ShippingDetails from './ShippingDetails.jsx'

function SectionTitle({
  description,
  icon,
  title,
}) {
  return (
    <Stack alignItems="center" direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.25,
          color: 'primary.main',
          display: 'flex',
          flexShrink: 0,
          height: 36,
          justifyContent: 'center',
          width: 36,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 850 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: '0.84rem', lineHeight: 1.35 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  )
}

const accordionSx = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '8px !important',
  boxShadow: 'none',
  overflow: 'hidden',
  '&:before': {
    display: 'none',
  },
  '& .MuiAccordionSummary-root': {
    minHeight: 66,
    px: { xs: 1.5, md: 2 },
  },
  '& .MuiAccordionSummary-content': {
    my: 1,
  },
  '& .MuiAccordionDetails-root': {
    borderTop: '1px solid',
    borderColor: 'divider',
    px: { xs: 1.5, md: 2 },
    py: 2,
  },
}

function CheckoutDetailsPanel({
  billing,
  onPayment,
  paymentLoading,
  shipping,
}) {
  return (
    <Paper
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <Stack spacing={1.5}>
        <Accordion defaultExpanded disableGutters sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <SectionTitle
              description="Select or add the delivery address."
              icon={<LocalShippingOutlinedIcon fontSize="small" />}
              title="Shipping Details"
            />
          </AccordionSummary>
          <AccordionDetails>
            <ShippingDetails
              addressError={shipping.addressError}
              addressLoading={shipping.addressLoading}
              addressMode={shipping.addressMode}
              addresses={shipping.addresses}
              fieldErrors={shipping.fieldErrors}
              formState={shipping.formState}
              isPincodeLookupLoading={shipping.isPincodeLookupLoading}
              onDefaultChange={shipping.handleDefaultChange}
              onFieldBlur={shipping.handleFieldBlur}
              onFieldChange={shipping.handleFieldChange}
              onModeChange={shipping.handleAddressModeChange}
              onSelectAddress={shipping.handleSelectAddress}
              selectedAddressId={shipping.selectedAddressId}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded disableGutters sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <SectionTitle
              description="Used for invoice and payment records."
              icon={<ReceiptLongOutlinedIcon fontSize="small" />}
              title="Billing Details"
            />
          </AccordionSummary>
          <AccordionDetails>
            <BillingDetails
              fieldErrors={billing.fieldErrors}
              formState={billing.formState}
              isPincodeLookupLoading={billing.isPincodeLookupLoading}
              onFieldBlur={billing.handleFieldBlur}
              onFieldChange={billing.handleFieldChange}
              onSameAsShippingChange={billing.handleSameAsShippingChange}
              sameAsShipping={billing.sameAsShipping}
            />
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' }, pt: 0.5 }}>
          <AppButton
            disabled={shipping.addressLoading || shipping.isPincodeLookupLoading || billing.isPincodeLookupLoading}
            loading={paymentLoading}
            loadingText="Checking..."
            onClick={onPayment}
            sx={{ minHeight: 50, width: { xs: '100%', sm: 'auto' } }}
            type="button"
            variant="contained"
          >
            Proceed to Payment
          </AppButton>
        </Box>
      </Stack>
    </Paper>
  )
}

export default CheckoutDetailsPanel
