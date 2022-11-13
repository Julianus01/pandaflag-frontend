import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box } from '@chakra-ui/react'
import RoutePage from 'components/routes/RoutePage'
import useQueryParam from 'hooks/routing/useQueryParam'
import { QueryParam } from 'hooks/routing/useQueryParams'
import { useHistory } from 'react-router-dom'

function OrganizationPricingUpgradeSuccessAlert() {
  const history = useHistory()
  const upgradeSuccess = useQueryParam(QueryParam.success)
  const productId = useQueryParam(QueryParam.productId)

  function onClose() {
    history.replace(RoutePage.organization())
  }

  if (upgradeSuccess !== 'true') {
    return null
  }

  return (
    <Alert borderRadius="md" mb={4} status="success">
      <AlertIcon />

      <Box>
        <AlertTitle>Success upgrade for {productId}</AlertTitle>

        <AlertDescription>
          Your application has been received. We will review your application and respond within the next 48 hours.
        </AlertDescription>
      </Box>

      <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={onClose} />
    </Alert>
  )
}

export default OrganizationPricingUpgradeSuccessAlert
