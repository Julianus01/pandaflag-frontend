import {
  Box,
  Button,
  Icon,
  IconButton,
  Spinner,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import moment from 'moment'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQueryClient } from 'react-query'

interface IRemoveButtonProps {
  flagId: string
}

function RemoveButton({ flagId }: IRemoveButtonProps) {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const deleteMutation = useMutation(FlagsApi.deleteFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)
    },
  })

  function deleteFlag() {
    onClose()
    deleteMutation.mutate(flagId)
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

          <Button textAlign="right" onClick={deleteFlag} size="sm" colorScheme="red" variant="ghost">
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

interface IProps {
  flag: IFlag
}

function FlagRow({ flag }: IProps) {
  return (
    <Tr>
      <Td>{flag.name}</Td>

      <Td>
        <Switch size="md" isChecked={true} colorScheme="green" />
      </Td>

      <Td isNumeric>{moment.unix(flag.createdAt).format('Do MMM YYYY')}</Td>

      <Td>
        <Box display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Remove">
            <Box>
              <RemoveButton flagId={flag.id} />
            </Box>
          </Tooltip>
        </Box>
      </Td>
    </Tr>
  )
}

export default FlagRow
