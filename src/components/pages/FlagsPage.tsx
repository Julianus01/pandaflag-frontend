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
  Tabs,
  TabList,
  Tab,
  Spinner,
  Icon,
  Text,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import BoxedPage from 'components/styles/BoxedPage'
import { IStoreState } from 'redux/store'
import CreateFlagDialog from './flags/CreateFlagDialog'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import { EmptyEnvironment } from 'api/ProjectsApi'
import { configurationActions } from 'redux/ducks/configurationDuck'
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
          <Tr>
            <Th textTransform="capitalize">Name</Th>
            <Th textTransform="capitalize">Active</Th>
            <Th textTransform="capitalize" isNumeric>
              Created at
            </Th>

            <Th />
          </Tr>
        </TableHead>

        <Tbody>
          <Tr>
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
        </Tbody>
      </CustomTable>
    </TableContainer>
  )
}

function FlagsPage() {
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const project = useSelector((state: IStoreState) => state.configuration.project)
  const environment = useSelector((state: IStoreState) => state.configuration.environment)

  const {
    data: flags,
    isLoading,
    isFetching,
  } = useQuery([ApiQueryId.getFlags, project?.id, environment], FlagsApi.getFlags)

  function changeEnvironment(index: number) {
    dispatch(
      configurationActions.setEnvironment(index === 0 ? EmptyEnvironment.production : EmptyEnvironment.development)
    )
  }

  function doesFlagAlreadyExist(name: string): boolean {
    const found = flags?.find((flag: IFlag) => flag.name.toLowerCase() === name.toLowerCase())
    return Boolean(found)
  }

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Flags
        </Heading>

        <Button leftIcon={<Icon as={FiFlag} />} onClick={onOpen} colorScheme="blue">
          Add Flag
        </Button>
      </Box>

      <Box mb={10} display="flex" alignItems="center">
        <Tabs
          onChange={changeEnvironment}
          index={environment?.name === 'production' ? 0 : 1}
          size="sm"
          variant="soft-rounded"
          colorScheme={environment?.color}
        >
          <TabList>
            <Tab>production</Tab>
            <Tab>development</Tab>
          </TabList>
        </Tabs>

        {isFetching && <Spinner colorScheme="blue" ml={6} size="sm" />}
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
