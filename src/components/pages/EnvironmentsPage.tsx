import { Heading } from '@chakra-ui/react'
import { IEnvironment } from 'api/ProjectsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import EnvironmentsTable from './environments/EnvironmentsTable'

function EnvironmentsPage() {
  const environments = useSelector((state: IStoreState) => state.configuration.project?.environments)

  return (
    <BoxedPage>
      <Heading mb={10} flex={1} as="h3" size="lg">
        Environments
      </Heading>

      <TableContainer>
        <EnvironmentsTable environments={environments as IEnvironment[]} />
      </TableContainer>
    </BoxedPage>
  )
}

export default EnvironmentsPage
