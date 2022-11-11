import { Box, Td, Tr, HStack, Tooltip } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import styled from 'styled-components/macro'
import EnvironmentRemoveButton from './EnvironmentRemoveButton'

interface IProps {
  environment: IEnvironment
}

function EnvironmentRow({ environment }: IProps) {
  return (
    <Row>
      <Td>
        <Box display="flex" alignItems="center">
          {environment.name}
        </Box>
      </Td>

      <Td isNumeric>
        <Box ml="auto" shadow="md" borderRadius="md" w="7" h="7" background={`${environment.color}.400`} />
      </Td>

      <Td>
        <HStack spacing="2" display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Remove">
            <Box>
              <EnvironmentRemoveButton environment={environment} />
            </Box>
          </Tooltip>
        </HStack>
      </Td>
    </Row>
  )
}

export default EnvironmentRow

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
