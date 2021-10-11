import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  Skeleton,
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
import { IStoreState } from 'redux/store'
import CreateFlagDialog from './flags/CreateFlagDialog'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

function SkeletonTable() {
  return (
    <TableContainer>
      <CustomTable variant="simple">
        <TableHead>
          <Tr>
            <Th>Name</Th>

            <Th isNumeric>Created at</Th>

            <Th />
          </Tr>
        </TableHead>

        <Tbody>
          {Array.from(Array(3).keys()).map((key) => (
            <Tr key={key}>
              <Td>
                <Skeleton height="24px" />
              </Td>

              <Td>
                <Skeleton height="24px" />
              </Td>

              <Td>
                <Skeleton height="24px" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </CustomTable>
    </TableContainer>
  )
}

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
  const project = useSelector((state: IStoreState) => state.configuration.project)
  const environment = useSelector((state: IStoreState) => state.configuration.environment)

  const { data: flags, isLoading } = useQuery([ApiQueryId.getFlags, project?.id, environment], FlagsApi.getFlags)

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Flags
        </Heading>

        <Button onClick={onOpen} colorScheme="blue">
          Add Flag
        </Button>
      </Box>

      {isLoading && <SkeletonTable />}
      {!isLoading && (
        <TableContainer>
          <CustomTable variant="simple">
            <TableHead>
              <Tr>
                <Th>Name</Th>

                <Th isNumeric>Created at</Th>

                <Th />
              </Tr>
            </TableHead>

            <Tbody>
              {flags?.map((flag: IFlag) => (
                <Tr key={flag.id}>
                  <Td>{flag.name}</Td>

                  <Td isNumeric>{moment.unix(flag.createdAt).format('Do MMM YYYY')}</Td>

                  <Td>
                    <Tooltip placement="top" label="Remove">
                      <Box display="flex" justifyContent="flex-end">
                        <RemoveButton flagId={flag.id} />
                      </Box>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </CustomTable>
        </TableContainer>
      )}

      <CreateFlagDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FlagsPage

const TableContainer = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: ${({ theme }) => `1px solid ${applyColorMode(theme.colors.gray[200], theme.colors.whiteAlpha[200])(theme)}`};
`

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
