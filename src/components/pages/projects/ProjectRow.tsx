import { Box, Button, Icon, IconButton, Td, Tr, Tooltip, HStack, useDisclosure } from '@chakra-ui/react'
import { IProject } from 'api/ProjectsApi'
import moment from 'moment'
import { FiKey, FiEdit2 } from 'react-icons/fi'
import { useClipboard } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'
import ProjectRemoveButton from './ProjectRemoveButton'
import EditProjectDialog from './EditProjectDialog'

interface IProps {
  project: IProject
}

function ProjectRow({ project }: IProps) {
  const activeProject = useSelector((state: IStoreState) => state.configuration.project)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasCopied, onCopy } = useClipboard(project.apiKey)

  return (
    <Tr>
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
        {moment.unix(project.createdAt.seconds).format('Do MMM YYYY')}
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
    </Tr>
  )
}

export default ProjectRow

const GreenPulse = styled(Box)<{ $show: boolean }>`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  display: block;
  width: 10px;
  height: 10px;
  margin-right: ${({ theme }) => theme.space[4]};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.green[500]};
  cursor: pointer;
  box-shadow: 0 0 0 rgba(56, 161, 105, 0.4);
  animation: pulse 2s infinite;
  transition: opacity 0.15s ease-in-out;

  @-webkit-keyframes pulse {
    0% {
      -webkit-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4);
    }
    70% {
      -webkit-box-shadow: 0 0 0 10px rgba(56, 161, 105, 0);
    }
    100% {
      -webkit-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
    }
  }

  @keyframes pulse {
    0% {
      -moz-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4);
      box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.4);
    }
    70% {
      -moz-box-shadow: 0 0 0 10px rgba(56, 161, 105, 0);
      box-shadow: 0 0 0 10px rgba(56, 161, 105, 0);
    }
    100% {
      -moz-box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
      box-shadow: 0 0 0 0 rgba(56, 161, 105, 0);
    }
  }
`
