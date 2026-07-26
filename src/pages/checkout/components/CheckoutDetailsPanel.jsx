import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Collapse,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import BillingDetails from './BillingDetails.jsx'
import ShippingDetails from './ShippingDetails.jsx'

function SectionTitle({
  description,
  title,
}) {
  return (
    <Stack spacing={0.35} sx={{ minWidth: 0 }}>
      <Typography sx={{ color: 'text.primary', fontSize: '1.12rem', fontWeight: 850 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: '0.94rem', lineHeight: 1.35 }}>
        {description}
      </Typography>
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

const billingSectionSx = {
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  boxShadow: 'none',
  overflow: 'hidden',
}

const GST_STATE_OPTIONS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Other Territory',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

function CheckoutDetailsPanel({
  billing,
  gstDetails,
  gstEnabled,
  onGstDetailsChange,
  onGstEnabledChange,
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

        <Paper sx={billingSectionSx} variant="outlined">
          <Stack
            sx={{
              alignItems: 'center',
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
              minHeight: 66,
              px: { xs: 1.5, md: 2 },
              py: 1.25,
              rowGap: 1.25,
            }}
          >
            <SectionTitle
              description="Used for invoice and payment records."
              title="Billing Details"
            />

            <FormControlLabel
              control={(
                <Checkbox
                  checked={billing.sameAsShipping}
                  onChange={billing.handleSameAsShippingChange}
                  sx={{
                    ml: 1,
                    p: 0,
                    '& .MuiSvgIcon-root': {
                      fontSize: 25,
                    },
                  }}
                />
              )}
              labelPlacement="start"
              label={(
                <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 750 }}>
                  Same as shipping address
                </Typography>
              )}
              sx={{
                justifyContent: 'flex-end',
                justifySelf: 'end',
                m: 0,
                width: { xs: '100%', sm: 'auto' },
                '& .MuiFormControlLabel-label': {
                  flex: { xs: 1, sm: 'initial' },
                  textAlign: 'right',
                },
              }}
            />
          </Stack>

          <Collapse in={!billing.sameAsShipping} timeout={240} unmountOnExit>
            <Stack
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                px: { xs: 1.5, md: 2 },
                py: 2,
              }}
            >
              <BillingDetails
                fieldErrors={billing.fieldErrors}
                formState={billing.formState}
                isPincodeLookupLoading={billing.isPincodeLookupLoading}
                onFieldBlur={billing.handleFieldBlur}
                onFieldChange={billing.handleFieldChange}
              />
            </Stack>
          </Collapse>
        </Paper>

        <Paper sx={billingSectionSx} variant="outlined">
          <Stack
            sx={{
              alignItems: 'center',
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
              minHeight: 66,
              px: { xs: 1.5, md: 2 },
              py: 1.25,
              rowGap: 1.25,
            }}
          >
            <SectionTitle
              description="Add business details when the invoice needs GSTIN."
              title="GST Invoice"
            />

            <FormControlLabel
              control={(
                <Checkbox
                  checked={gstEnabled}
                  onChange={onGstEnabledChange}
                  sx={{
                    ml: 1,
                    p: 0,
                    '& .MuiSvgIcon-root': {
                      fontSize: 25,
                    },
                  }}
                />
              )}
              labelPlacement="start"
              label={(
                <Typography sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 750 }}>
                  Buying for a business
                </Typography>
              )}
              sx={{
                justifyContent: 'flex-end',
                justifySelf: 'end',
                m: 0,
                width: { xs: '100%', sm: 'auto' },
                '& .MuiFormControlLabel-label': {
                  flex: { xs: 1, sm: 'initial' },
                  textAlign: 'right',
                },
              }}
            />
          </Stack>

          <Collapse in={gstEnabled} timeout={240} unmountOnExit>
            <Stack
              spacing={1.5}
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                px: { xs: 1.5, md: 2 },
                py: 2,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <TextField label="GSTIN" name="gstin" value={gstDetails.gstin} onChange={onGstDetailsChange} required fullWidth size="small" />
                <TextField label="Business name" name="businessName" value={gstDetails.businessName} onChange={onGstDetailsChange} required fullWidth size="small" />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <TextField label="Trade name" name="tradeName" value={gstDetails.tradeName} onChange={onGstDetailsChange} fullWidth size="small" />
                <TextField select label="State" name="state" value={gstDetails.state} onChange={onGstDetailsChange} required fullWidth size="small">
                  <MenuItem value="">Select state</MenuItem>
                  {GST_STATE_OPTIONS.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <TextField label="City" name="city" value={gstDetails.city} onChange={onGstDetailsChange} fullWidth size="small" />
                <TextField label="PIN code" name="pincode" value={gstDetails.pincode} onChange={onGstDetailsChange} fullWidth size="small" inputProps={{ inputMode: 'numeric', maxLength: 6 }} />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <TextField label="Contact number" name="contactNumber" value={gstDetails.contactNumber} onChange={onGstDetailsChange} fullWidth size="small" />
                <TextField label="Email" name="email" value={gstDetails.email} onChange={onGstDetailsChange} fullWidth size="small" />
              </Stack>
            </Stack>
          </Collapse>
        </Paper>
      </Stack>
    </Paper>
  )
}

export default CheckoutDetailsPanel
