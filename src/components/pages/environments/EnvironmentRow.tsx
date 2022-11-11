import { Box, Td, Tr, HStack, Tooltip, IconButton, Icon, useDisclosure } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import { FiEdit2 } from 'react-icons/fi'
import styled from 'styled-components/macro'
import EditEnvironmentModal from './EditEnvironmentDialog'
import EnvironmentRemoveButton from './EnvironmentRemoveButton'

interface IProps {
  environment: IEnvironment
}

function EnvironmentRow({ environment }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <Tooltip placement="top" label="Edit">
            <Box>
              <IconButton onClick={onOpen} size="xs" aria-label="edit" icon={<Icon as={FiEdit2} />} />

              <EditEnvironmentModal environment={environment} isOpen={isOpen} onClose={onClose} />
            </Box>
          </Tooltip>

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
