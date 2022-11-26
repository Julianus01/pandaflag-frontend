import { Alert, AlertIcon, AlertTitle, CloseButton, Box } from '@chakra-ui/react'
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
  const upgradeSuccess = useQueryParam(QueryParam.success) === 'true' || true
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

          <Box>
            <AlertTitle>Successfully upgraded your plan 🚀</AlertTitle>
          </Box>

          <CloseButton
            alignSelf="flex-start"
            marginLeft="auto"
            position="relative"
            right={-1}
            top={-1}
            onClick={onClose}
          />
        </Alert>
      )}
    </>
  )
}

export default OrganizationPricingUpgradeSuccessAlert
