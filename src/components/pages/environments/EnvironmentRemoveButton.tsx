import {
  Button,
  Icon,
  IconButton,
  Spinner,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  useToast,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import EnvironmentsApi, { IEnvironment } from 'api/EnvironmentsApi'
import { FiMinus } from 'react-icons/fi'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { SplitbeeEvent } from 'utils/SplitbeeUtils'

interface IProps {
  environment: IEnvironment
}

function EnvironmentRemoveButton({ environment }: IProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isFetching: environmentsFetching } = useQuery(ApiQueryId.getEnvironments, EnvironmentsApi.getEnvironments)
  const deleteMutation = useMutation(EnvironmentsApi.deleteEnvironment, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getEnvironments)
      queryClient.invalidateQueries(ApiQueryId.getFlags)

      toast({
        title: `Removed environment '${environment.name}'`,
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function deleteEnvironment() {
    onClose()
    deleteMutation.mutate(environment.id)
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <IconButton
          disabled={deleteMutation.isLoading}
          onClick={onOpen}
          size="xs"
          aria-label="delete"
          icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
        />
      </PopoverTrigger>

      <PopoverContent w="auto" _focus={{ boxShadow: 'none', outline: 'none' }}>
        <PopoverBody display="flex" alignItems="center" shadow="lg" p="4">
          <Text fontSize="sm" textAlign="left" mr="2">
            Are you sure you want to delete this environment?
          </Text>

          <Button
            data-splitbee-event={SplitbeeEvent.DeleteEnvironment}
            isDisabled={environmentsFetching}
            onClick={deleteEnvironment}
            colorScheme="red"
            variant="ghost"
          >
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default EnvironmentRemoveButton
