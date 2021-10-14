import {
  Box,
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  Spinner,
  Td,
  Tr,
  useDisclosure,
  PopoverContent,
  Text,
  PopoverBody,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import moment from 'moment'
import { FiMinus, FiKey } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useClipboard } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import styled from 'styled-components/macro'

interface IRemoveButtonProps {
  project: IProject
}

function RemoveButton({ project }: IRemoveButtonProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isFetching: projectsFetching } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)
  const deleteMutation = useMutation(ProjectsApi.deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getProjects)

      toast({
        title: `Removed project '${project.name}'`,
        position: 'top',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function deleteProject() {
    onClose()
    deleteMutation.mutate(project.id)
  }

  return (
    <Popover placement="left" isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <IconButton
          disabled={deleteMutation.isLoading}
          onClick={onOpen}
          size="xs"
          aria-label="delete"
          icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
        />
      </PopoverTrigger>

      <PopoverContent _focus={{ boxShadow: 'none', outline: 'none' }}>
        <PopoverBody textAlign="right" shadow="lg" p="4">
          <Text textAlign="left" mb="4">
            Are you sure you want to delete this project?
          </Text>

          <Button isDisabled={projectsFetching} onClick={deleteProject} size="sm" colorScheme="red" variant="ghost">
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

interface IProps {
  project: IProject
}

function ProjectRow({ project }: IProps) {
  const activeProject = useSelector((state: IStoreState) => state.configuration.project)
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
        {moment.unix(project.createdAt).format('Do MMM YYYY')}
      </Td>

      <Td>
        <Box display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Remove">
            <Box>
              <RemoveButton project={project} />
            </Box>
          </Tooltip>
        </Box>
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
