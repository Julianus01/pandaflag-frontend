import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box } from '@chakra-ui/react'
import RoutePage from 'components/routes/RoutePage'
import useQueryParam from 'hooks/routing/useQueryParam'
import { QueryParam } from 'hooks/routing/useQueryParams'
import { useHistory } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { useState } from 'react'

function OrganizationPricingUpgradeSuccessAlert() {
  const { width, height } = useWindowSize()
  const history = useHistory()
  const upgradeSuccess = useQueryParam(QueryParam.success) === 'true'
  const productId = useQueryParam(QueryParam.productId)
  const [showConfetti] = useState<boolean>(upgradeSuccess)

  function onClose() {
    history.replace(RoutePage.organization())
  }

  return (
    <>
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} width={width} height={height} />}

      {upgradeSuccess && (
        <Alert borderRadius="md" mb={4} status="success">
          <AlertIcon />

          {/* TODO: Update this */}
          <Box>
            <AlertTitle>Success upgrade for {productId}</AlertTitle>

            <AlertDescription>
              Your application has been received. We will review your application and respond within the next 48 hours.
            </AlertDescription>
          </Box>

          <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={onClose} />
        </Alert>
      )}
    </>
  )
}

export default OrganizationPricingUpgradeSuccessAlert
