import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import BoxedPage from 'components/styles/BoxedPage'
import moment from 'moment'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CreateFlagDialog from './flags/CreateFlagDialog'

interface IRemoveButtonProps {
  flagId: string
}

function RemoveButton({ flagId }: IRemoveButtonProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation(FlagsApi.deleteFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)
    },
  })

  function deleteFlag() {
    deleteMutation.mutate(flagId)
  }

  return (
    <IconButton
      disabled={deleteMutation.isLoading}
      onClick={deleteFlag}
      size="xs"
      aria-label="delete"
      icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
    />
  )
}

function FlagsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: flags } = useQuery(ApiQueryId.getFlags, FlagsApi.getFlags)

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Feature Flags
        </Heading>

        <Button onClick={onOpen} colorScheme="blue">
          Add Feature Flag
        </Button>
      </Box>

      <Box border="1px" borderRadius="lg" borderColor="gray.200" background="white">
        <Table variant="simple">
          <Thead background="gray.100">
            <Tr>
              <Th>Name</Th>

              <Th>Created at</Th>

              <Th />
            </Tr>
          </Thead>

          <Tbody>
            {flags?.map((flag: IFlag) => (
              <Tr key={flag.id}>
                <Td>{flag.name}</Td>

                <Td>{moment.unix(flag.createdAt).format('Do MMM YYYY')}</Td>

                <Td display="flex" justifyContent="flex-end">
                  <Tooltip placement="top" label="Remove">
                    <Box>
                      <RemoveButton flagId={flag.id} />
                    </Box>
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <CreateFlagDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FlagsPage
