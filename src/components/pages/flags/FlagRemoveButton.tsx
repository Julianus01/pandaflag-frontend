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
import FlagsApi, { IFlag } from 'api/FlagsApi'
import { FiMinus } from 'react-icons/fi'
import { useQueryClient, useMutation, useQuery } from 'react-query'

interface IProps {
  flag: IFlag
}

function FlagRemoveButton({ flag }: IProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isFetching: flagsFetching } = useQuery(ApiQueryId.getFlags, FlagsApi.getFlags)
  const deleteMutation = useMutation(FlagsApi.deleteFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)

      toast({
        title: `Removed flag '${flag.name} for ${flag.environmentName}'`,
        position: 'top-right',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function deleteFlag() {
    onClose()
    deleteMutation.mutate(flag.id)
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

      <PopoverContent _focus={{ boxShadow: 'none', outline: 'none' }}>
        <PopoverBody textAlign="right" shadow="lg" p="4">
          <Text fontSize="sm" textAlign="left" mb="4">
            Are you sure you want to delete this flag?
          </Text>

          <Button
            isDisabled={flagsFetching}
            textAlign="right"
            onClick={deleteFlag}
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

export default FlagRemoveButton
