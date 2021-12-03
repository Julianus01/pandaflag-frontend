import { Heading, Alert, AlertIcon, Button, Icon, Box } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import { FiHash } from 'react-icons/fi'
import { PricingUtils } from 'utils/PricingUtils'
import EnvironmentsTable from './environments/EnvironmentsTable'

const Quota = PricingUtils.getQuota()

function EnvironmentsPage() {
  // TODO: fix this
  const environments: IEnvironment[] = []
  const isEnvironmentsQuotaReached = (environments?.length as number) >= Quota.environments

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading mb={10} flex={1} as="h3" size="lg">
          Environments
        </Heading>

        <Button disabled leftIcon={<Icon as={FiHash} />} onClick={() => null} colorScheme="blue">
          Add Environment
        </Button>
      </Box>

      {isEnvironmentsQuotaReached && (
        <Alert fontSize="sm" borderRadius="md" mb="6" status="info">
          <AlertIcon w="4" h="4" />
          You've reached the limit for number of environments.
        </Alert>
      )}

      <TableContainer>
        <EnvironmentsTable environments={environments as IEnvironment[]} />
      </TableContainer>
    </BoxedPage>
  )
}

export default EnvironmentsPage
