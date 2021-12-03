import { Box, Button, Heading, Icon, useDisclosure, Alert, AlertIcon } from '@chakra-ui/react'
import { IProject } from 'api/ProjectsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import ProjectsContext from 'context/ProjectsContext'
import { useContext } from 'react'
import { FiLayers } from 'react-icons/fi'
import { PricingUtils } from 'utils/PricingUtils'
import CreateProjectDialog from './projects/CreateProjectDialog'
import ProjectsTable from './projects/ProjectsTable'

const Quota = PricingUtils.getQuota()

function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: projects } = useContext(ProjectsContext)

  const isProjectsQuotaReached = (projects?.length as number) >= Quota.projects

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Projects
        </Heading>

        <Button disabled={isProjectsQuotaReached} leftIcon={<Icon as={FiLayers} />} onClick={onOpen} colorScheme="blue">
          Add Project
        </Button>
      </Box>

      {isProjectsQuotaReached && (
        <Alert fontSize="sm" borderRadius="md" mb="6" status="info">
          <AlertIcon w="4" h="4" />
          You've reached the limit for number of projects.
        </Alert>
      )}

      <TableContainer>
        <ProjectsTable projects={projects as IProject[]} />
      </TableContainer>

      <CreateProjectDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default ProjectsPage
