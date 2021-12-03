import {
  Box,
  Button,
  Heading,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Spinner,
  Icon,
  Text,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import BoxedPage from 'components/styles/BoxedPage'
import { IStoreState } from 'redux/store'
import CreateFlagDialog from './flags/CreateFlagDialog'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import FlagsTable from './flags/FlagsTable'
import { useQuery } from 'react-query'
import { FiFlag } from 'react-icons/fi'
import TryApi from './flags/TryApi'
import AccessibleBackground from 'components/styles/AccessibleBackground'
import TableContainer from 'components/shared/TableContainer'

function SkeletonTable() {
  return (
    <TableContainer>
      <CustomTable variant="simple">
        <TableHead>
          <Row>
            <Th width="100%" textTransform="capitalize">
              Name
            </Th>
          </Row>
        </TableHead>

        <Tbody>
          <Row>
            <Td>
              <Skeleton height="24px" />
            </Td>
          </Row>
        </Tbody>
      </CustomTable>
    </TableContainer>
  )
}

function FlagsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const project = useSelector((state: IStoreState) => state.configuration.project)

  const { data: flags, isLoading, isFetching } = useQuery([ApiQueryId.getFlags, project?.id], FlagsApi.getFlags)

  function doesFlagAlreadyExist(name: string): boolean {
    const found = flags?.find((flag: IFlag) => flag.name.toLowerCase() === name.toLowerCase())
    return Boolean(found)
  }

  console.log(flags)

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Flags
          {isFetching && <Spinner colorScheme="blue" ml={6} size="sm" />}
        </Heading>

        <Button leftIcon={<Icon as={FiFlag} />} onClick={onOpen} colorScheme="blue">
          Add Flag
        </Button>
      </Box>

      {isLoading && <SkeletonTable />}
      {!isLoading && Boolean(flags?.length) && (
        <TableContainer>
          <FlagsTable flags={flags as IFlag[]} />
        </TableContainer>
      )}

      {!isLoading && Boolean(flags?.length) && (
        <CodeContainer shadow="xs" mt={4}>
          <TryApi flags={flags as IFlag[]} />
        </CodeContainer>
      )}

      {!isLoading && !Boolean(flags?.length) && <Text>No flags. Go ahead and add your first flag</Text>}

      <CreateFlagDialog doesFlagAlreadyExist={doesFlagAlreadyExist} isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FlagsPage

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`

const CodeContainer = styled(AccessibleBackground)`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[2]};
`

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
