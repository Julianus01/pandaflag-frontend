import { Box, Button, Heading, useDisclosure, Spinner, Icon } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import BoxedPage from 'components/styles/BoxedPage'
import { IStoreState } from 'redux/store'
import CreateFlagDialog from './flags/CreateFlagDialog'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import FlagsTable from './flags/FlagsTable'
import { useQuery } from 'react-query'
import { FiFlag } from 'react-icons/fi'
import TryApi from './flags/TryApi'
import Section from 'components/styles/Section'
import TableContainer from 'components/shared/TableContainer'
import DocumentationSDKs from './flags/DocumentationSDKs'
import SkeletonTable from 'components/styles/SkeletonTable'

function FlagsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const project = useSelector((state: IStoreState) => state.configuration.project)

  const { data: flags, isLoading } = useQuery([ApiQueryId.getFlags, project?.id], FlagsApi.getFlags)

  function doesFlagAlreadyExist(name: string): boolean {
    const found = flags?.find((flag: IFlag) => flag.name.toLowerCase() === name.toLowerCase())
    return Boolean(found)
  }

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Flags
          {isLoading && <Spinner colorScheme="primary" ml={6} size="sm" />}
        </Heading>

        <Button leftIcon={<Icon as={FiFlag} />} onClick={onOpen} colorScheme="primary">
          Add Flag
        </Button>
      </Box>

      {isLoading && <SkeletonTable />}

      {!isLoading && Boolean(flags?.length) && (
        <>
          <TableContainer>
            <FlagsTable flags={flags as IFlag[]} />
          </TableContainer>

          <Box mt={4}>
            <DocumentationSDKs />
          </Box>

          <CodeContainer shadow="xs" mt={4}>
            <TryApi flags={flags as IFlag[]} />
          </CodeContainer>
        </>
      )}

      {!isLoading && !Boolean(flags?.length) && <Section>Go ahead and add your first feature 🚩</Section>}

      <CreateFlagDialog doesFlagAlreadyExist={doesFlagAlreadyExist} isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default FlagsPage

const CodeContainer = styled(Section)`
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space[2]};
`
