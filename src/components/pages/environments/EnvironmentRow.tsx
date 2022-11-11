import { Box, Td, Tr, HStack, Tooltip, IconButton, Icon, useDisclosure } from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import { FiArrowDown, FiArrowUp, FiEdit2 } from 'react-icons/fi'
import styled from 'styled-components/macro'
import EditEnvironmentModal from './EditEnvironmentDialog'
import EnvironmentRemoveButton from './EnvironmentRemoveButton'

interface IProps {
  environment: IEnvironment
  isFirst: boolean
  isLast: boolean
  moveUp: () => void
  moveDown: () => void
}

function EnvironmentRow({ environment, isFirst, isLast, moveUp, moveDown }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Row>
      <Td>
        <HStack spacing="2" display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Move Up">
            <Box>
              <IconButton
                disabled={isFirst}
                onClick={moveUp}
                size="xs"
                aria-label="move-up"
                icon={<Icon as={FiArrowUp} />}
              />
            </Box>
          </Tooltip>

          <Tooltip placement="top" label="Move Down">
            <Box>
              <IconButton
                disabled={isLast}
                onClick={moveDown}
                size="xs"
                aria-label="move-down"
                icon={<Icon as={FiArrowDown} />}
              />
            </Box>
          </Tooltip>
        </HStack>
      </Td>

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
