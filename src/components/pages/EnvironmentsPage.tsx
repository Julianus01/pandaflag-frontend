import { Heading, Alert, AlertIcon } from '@chakra-ui/react'
import { IEnvironment } from 'api/ProjectsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { PricingUtils } from 'utils/PricingUtils'
import EnvironmentsTable from './environments/EnvironmentsTable'

const Quota = PricingUtils.getQuota()

function EnvironmentsPage() {
  const environments = useSelector((state: IStoreState) => state.configuration.project?.environments)

  const isEnvironmentsQuotaReached = environments?.length === Quota.environments

  return (
    <BoxedPage>
      <Heading mb={10} flex={1} as="h3" size="lg">
        Environments
      </Heading>

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
