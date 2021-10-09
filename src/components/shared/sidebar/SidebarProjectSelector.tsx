import { Badge, Box } from '@chakra-ui/layout'
import { Heading, Icon, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IEnvironment, IProject } from 'api/ProjectsApi'
import ProjectsContext from 'context/ProjectsContext'
import { useContext, useRef, useState } from 'react'
import { HiSelector } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { useClickAway } from 'react-use'

function environmentColorScheme(environment: IEnvironment) {
  switch (environment) {
    case 'production':
      return 'purple'

    case 'staging':
      return 'orange'

    case 'development':
      return 'blue'

    default:
      return 'purple'
  }
}

function SidebarProjectSelector() {
  const projectsContext = useContext(ProjectsContext)
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  useClickAway(ref, () => {
    setIsOpen(false)
  })

  function toggleSelector() {
    setIsOpen(!isOpen)
  }

  function changeEnvironment(environment: IEnvironment) {
    projectsContext.updateEnvironment(environment)
  }

  function changeProject(projectId: string) {
    const project = projects?.find((project: IProject) => project.id === projectId)

    if (project) {
      projectsContext.updateProject(project)
    }
  }

  return (
    <div ref={ref}>
      <Menu matchWidth closeOnSelect={false} autoSelect={false} isOpen={isOpen}>
        <CustomMenuButton $active={isOpen} onClick={toggleSelector}>
          <Container>
            <Box flex="1">
              <Heading as="h5" size="sm">
                {projectsContext.selectedProject?.name}
              </Heading>

              <Badge
                fontWeight="semibold"
                textTransform="lowercase"
                colorScheme={environmentColorScheme(projectsContext.environment)}
                variant="subtle"
              >
                {projectsContext.environment}
              </Badge>
            </Box>

            <Box display="flex" alignItems="center">
              <Icon w={6} h={6} as={HiSelector} />
            </Box>
          </Container>
        </CustomMenuButton>

        <MenuList maxHeight="400px" overflow="scroll" shadow="lg">
          <MenuOptionGroup
            onChange={(value) => changeProject(value as string)}
            value={projectsContext.selectedProject?.id}
            type="radio"
            title="Projects"
          >
            {projects?.map((project: IProject) => (
              <MenuItemOption value={project.id} key={project.id}>
                {project.name}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>

          <MenuOptionGroup
            onChange={(value) => changeEnvironment(value as IEnvironment)}
            value={projectsContext.environment}
            type="radio"
            title="Environments"
          >
            <MenuItemOption value="production">
              <Badge fontWeight="semibold" textTransform="lowercase" colorScheme="purple" variant="subtle">
                production
              </Badge>
            </MenuItemOption>

            <MenuItemOption value="staging">
              <Badge fontWeight="semibold" textTransform="lowercase" colorScheme="orange" variant="subtle">
                staging
              </Badge>
            </MenuItemOption>

            <MenuItemOption value="development">
              <Badge fontWeight="semibold" textTransform="lowercase" colorScheme="blue" variant="subtle">
                development
              </Badge>
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </div>
  )
}

export default SidebarProjectSelector

const Container = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  cursor: pointer;
  display: flex;
  user-select: none;
`

const CustomMenuButton = styled(MenuButton)<{ $active: boolean }>`
  background: ${({ theme, $active }) => ($active ? theme.colors.gray[100] : '')};
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  height: 69px;

  :hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`
