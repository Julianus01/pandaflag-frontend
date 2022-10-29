import { Th, Td, Skeleton, Tbody } from '@chakra-ui/react'
import TableContainer from 'components/shared/TableContainer'
import Table from './Table'
import Thead from './Thead'
import Tr from './Tr'

interface IProps {
  numberOfRows?: number
}

function SkeletonTable({ numberOfRows = 1 }: IProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th width="100%" />
          </Tr>
        </Thead>

        <Tbody>
          {Array.from(Array(numberOfRows).keys()).map((index) => (
            <Tr key={index}>
              <Td>
                <Skeleton height="24px" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default SkeletonTable
