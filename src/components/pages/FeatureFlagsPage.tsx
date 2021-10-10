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
import FeatureFlagsApi, { IFeatureFlag } from 'api/FeatureFlagsApi'
import BoxedPage from 'components/styles/BoxedPage'
import moment from 'moment'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CreateFeatureFlagDialog from './feature-flags/CreateFeatureFlagDialog'

interface IRemoveButtonProps {
  featureFlagId: string
}

function RemoveButton({ featureFlagId }: IRemoveButtonProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation(FeatureFlagsApi.deleteFeatureFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFeatureFlags)
    },
  })

  function deleteFeatureFlag() {
    deleteMutation.mutate(featureFlagId)
  }

  return (
    <IconButton
      disabled={deleteMutation.isLoading}
      onClick={deleteFeatureFlag}
      size="xs"
      aria-label="delete"
      icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
    />
  )
}

function FeatureFlagsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: featureFlags } = useQuery(ApiQueryId.getFeatureFlags, FeatureFlagsApi.getFeatureFlags)

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
            {featureFlags?.map((featureFlag: IFeatureFlag) => (
              <Tr key={featureFlag.id}>
                <Td>{featureFlag.name}</Td>

                <Td>{moment.unix(featureFlag.createdAt).format('Do MMM YYYY')}</Td>

                <Td display="flex" justifyContent="flex-end">
                  <Tooltip placement="top" label="Remove">
                    <Box>
                      <RemoveButton featureFlagId={featureFlag.id} />
                    </Box>
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <CreateFeatureFlagDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FeatureFlagsPage
