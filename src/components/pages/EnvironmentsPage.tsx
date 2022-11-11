import { Heading, Alert, AlertIcon, Button, Icon, Box, Spinner, useDisclosure } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { useContext } from 'react'
import { FiHash } from 'react-icons/fi'
import { PricingUtils } from 'utils/PricingUtils'
import EnvironmentsTable from './environments/EnvironmentsTable'
import SkeletonTable from 'components/styles/SkeletonTable'
import CreateEnvironmentModal from './environments/CreateEnvironmentModal'

function EnvironmentsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const Quota = PricingUtils.getQuota()
  const { data: environments, isFetching, isLoading } = useContext(EnvironmentsContext)

  const isEnvironmentsQuotaReached = (environments?.length as number) >= Quota.environments

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading mb={10} flex={1} as="h3" size="lg">
          Environments
          {isFetching && <Spinner colorScheme="primary" ml={6} size="sm" />}
        </Heading>

        <Button
          // TODO: Fix this with Quota
          disabled={false}
          onClick={onOpen}
          leftIcon={<Icon as={FiHash} />}
          colorScheme="primary"
        >
          Add Environment
        </Button>
      </Box>

      {isEnvironmentsQuotaReached && (
        <Alert fontSize="sm" borderRadius="md" mb="6" status="info">
          <AlertIcon w="4" h="4" />
          You've reached the limit for number of environments.
        </Alert>
      )}

      {isLoading && <SkeletonTable />}

      {!!environments?.length && (
        <TableContainer>
          <EnvironmentsTable environments={environments as IEnvironment[]} />
        </TableContainer>
      )}

      <CreateEnvironmentModal isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default EnvironmentsPage
