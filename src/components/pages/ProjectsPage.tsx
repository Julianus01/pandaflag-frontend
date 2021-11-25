import { Box, Button, Heading, Icon, useDisclosure } from '@chakra-ui/react'
import { IProject } from 'api/ProjectsApi'
import TableContainer from 'components/shared/TableContainer'
import BoxedPage from 'components/styles/BoxedPage'
import ProjectsContext from 'context/ProjectsContext'
import { useContext } from 'react'
import { FiLayers } from 'react-icons/fi'
import CreateProjectDialog from './projects/CreateProjectDialog'
import ProjectsTable from './projects/ProjectsTable'

function ProjectsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: projects } = useContext(ProjectsContext)

  return (
    <BoxedPage>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          Projects
        </Heading>

        <Button leftIcon={<Icon as={FiLayers} />} onClick={onOpen} colorScheme="blue">
          Add Project
        </Button>
      </Box>

      <TableContainer>
        <ProjectsTable projects={projects as IProject[]} />
      </TableContainer>

      <CreateProjectDialog isOpen={isOpen} onClose={onClose} />
    </BoxedPage>
  )
}

export default ProjectsPage
