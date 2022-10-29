import { Box, Button, Icon, IconButton, Td, Tr, Tooltip, HStack, useDisclosure } from '@chakra-ui/react'
import { IProject } from 'api/ProjectsApi'
import { FiKey, FiEdit2 } from 'react-icons/fi'
import { useClipboard } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'
import ProjectRemoveButton from './ProjectRemoveButton'
import EditProjectDialog from './EditProjectDialog'
import { format, fromUnixTime } from 'date-fns'
import GreenPulse from 'components/styles/GreenPulse'

interface IProps {
  project: IProject
}

function ProjectRow({ project }: IProps) {
  const activeProject = useSelector((state: IStoreState) => state.configuration.project)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(project.apiKey)

  const createdAt = fromUnixTime(project.createdAt.seconds)
  const showYear = new Date().getFullYear() > createdAt.getFullYear()

  return (
    <Row>
      <Td>
        <Box display="flex" alignItems="center">
          <GreenPulse $show={project.id === activeProject?.id} />

          {project.name}
        </Box>
      </Td>

      <Td>
        <Button minWidth="78px" onClick={onCopy} leftIcon={<Icon as={FiKey} />} size="xs">
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </Td>

      <Td whiteSpace="nowrap" isNumeric>
        {format(createdAt, `MMM do ${showYear ? 'uu' : ''}`)}
      </Td>

      <Td>
        <HStack spacing="2" display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Edit">
            <Box>
              <IconButton onClick={onOpen} size="xs" aria-label="edit" icon={<Icon as={FiEdit2} />} />

              <EditProjectDialog project={project} isOpen={isOpen} onClose={onClose} />
            </Box>
          </Tooltip>

          <Tooltip placement="top" label="Remove">
            <Box>
              <ProjectRemoveButton project={project} />
            </Box>
          </Tooltip>
        </HStack>
      </Td>
    </Row>
  )
}

export default ProjectRow

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
