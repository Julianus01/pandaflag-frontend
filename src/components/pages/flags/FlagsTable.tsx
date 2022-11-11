import { Tbody, Th, Tr, Tag } from '@chakra-ui/react'
import { IDbEnvironment } from 'api/EnvironmentsApi'
import { IFlag } from 'api/FlagsApi'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { useContext } from 'react'
import FlagRow from './FlagRow'

interface IProps {
  flags: IFlag[]
}

function FlagsTable({ flags }: IProps) {
  const { data: environments } = useContext(EnvironmentsContext)

  return (
    <Table size="md" variant="simple">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">Name</Th>

          {environments?.map((environment: IDbEnvironment) => (
            <Th key={environment.id} isNumeric textTransform="lowercase">
              <Tag size="sm" variant="subtle" colorScheme={environment?.color}>
                #{environment.name}
              </Tag>
            </Th>
          ))}

          <Th />
        </Tr>
      </Thead>

      <Tbody>
        {flags.map((flag: IFlag) => (
          <FlagRow key={flag.id} flag={flag} />
        ))}
      </Tbody>
    </Table>
  )
}

export default FlagsTable
