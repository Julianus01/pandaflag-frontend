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
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import BoxedPage from 'components/styles/BoxedPage'
import { IStoreState } from 'redux/store'
import CreateFlagDialog from './flags/CreateFlagDialog'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import { EmptyEnvironment, IEnvironment } from 'api/ProjectsApi'
import { configurationActions } from 'redux/ducks/configurationDuck'
import FlagsTable from './flags/FlagsTable'
import { useQuery } from 'react-query'

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

function environmentColorScheme(environment: IEnvironment) {
  switch (environment.name) {
    case EmptyEnvironment.production.name:
      return 'orange'

    case EmptyEnvironment.development.name:
      return 'blue'

    default:
      return 'orange'
  }
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
      configurationActions.changeEnvironment(index === 0 ? EmptyEnvironment.production : EmptyEnvironment.development)
    )
  }

  function doesFlagAlreadyExist(name: string): boolean {
    const found = flags?.find((flag: IFlag) => flag.name === name)
    return Boolean(found)
  }

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

      <Box mb={10} display="flex" alignItems="center">
        <Tabs
          onChange={changeEnvironment}
          index={environment?.name === 'production' ? 0 : 1}
          size="sm"
          variant="soft-rounded"
          colorScheme={environmentColorScheme(environment as IEnvironment)}
        >
          <TabList>
            <Tab pb="5px">production</Tab>
            <Tab pb="5px">development</Tab>
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

      <CreateFlagDialog doesFlagAlreadyExist={doesFlagAlreadyExist} isOpen={isOpen} onClose={onClose} />
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
