import {
  Heading,
  Alert,
  AlertIcon,
  Button,
  Icon,
  Box,
  Spinner,
  Th,
  Tbody,
  Skeleton,
  Td,
  Thead,
  Table,
  Tr,
} from '@chakra-ui/react'
import { IEnvironment } from 'api/EnvironmentsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import EnvironmentsContext from 'context/EnvironmentsContext'
import { useContext } from 'react'
import { FiHash } from 'react-icons/fi'
import { applyColorMode } from 'theme/StyledThemeProvider'
import { PricingUtils } from 'utils/PricingUtils'
import EnvironmentsTable from './environments/EnvironmentsTable'
import styled from 'styled-components/macro'

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

const Quota = PricingUtils.getQuota()

function EnvironmentsPage() {
  const { data: environments, isFetching, isLoading } = useContext(EnvironmentsContext)

  const isEnvironmentsQuotaReached = (environments?.length as number) >= Quota.environments

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading mb={10} flex={1} as="h3" size="lg">
          Environments
          {isFetching && <Spinner colorScheme="blue" ml={6} size="sm" />}
        </Heading>

        <Button disabled leftIcon={<Icon as={FiHash} />} onClick={() => null} colorScheme="blue">
          Add Environment
        </Button>
      </Box>

      {isEnvironmentsQuotaReached && (
        <Alert fontSize="sm" borderRadius="md" mb="6" status="info">
          <AlertIcon w="4" h="4" />
          You've reached the limit for number of environments.
        </Alert>
      )}

      {isLoading && <SkeletonTable />}
      {!!environments?.length && (
        <TableContainer>
          <EnvironmentsTable environments={environments as IEnvironment[]} />
        </TableContainer>
      )}
    </BoxedPage>
  )
}

export default EnvironmentsPage

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
