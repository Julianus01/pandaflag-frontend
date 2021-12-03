import { Heading, Alert, AlertIcon, Button, Icon, Box, Spinner } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import EnvironmentsApi, { IEnvironment } from 'api/EnvironmentsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import { FiHash } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { PricingUtils } from 'utils/PricingUtils'
import EnvironmentsTable from './environments/EnvironmentsTable'

const Quota = PricingUtils.getQuota()

function EnvironmentsPage() {
  const project = useSelector((state: IStoreState) => state.configuration.project)

  const { data: environments, isFetching } = useQuery(
    [ApiQueryId.getEnvironments, project?.id],
    EnvironmentsApi.getEnvironments
  )

  const isEnvironmentsQuotaReached = (environments?.length as number) >= Quota.environments

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading mb={10} flex={1} as="h3" size="lg">
          Environments
          {isFetching && <Spinner colorScheme="blue" ml={6} size="sm" />}
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

      {/* TODO: Make loading look good */}
      {!!environments?.length && (
        <TableContainer>
          <EnvironmentsTable environments={environments as IEnvironment[]} />
        </TableContainer>
      )}
    </BoxedPage>
  )
}

export default EnvironmentsPage
