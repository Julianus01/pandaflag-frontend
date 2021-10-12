import {
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Text,
  Box,
  useToast,
} from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import { useRef, useState } from 'react'
import { HiSelector } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { useClickAway } from 'react-use'
import { IStoreState } from 'redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { configurationActions } from 'redux/ducks/configurationDuck'
import { applyColorMode } from 'theme/StyledThemeProvider'

function SidebarProjectSelector() {
  const dispatch = useDispatch()
  const toast = useToast()

  const configuration = useSelector((state: IStoreState) => state.configuration)
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  useClickAway(ref, () => {
    setIsOpen(false)
  })

  function toggleSelector() {
    setIsOpen(!isOpen)
  }

  function changeProject(projectId: string) {
    const project = projects?.find((project: IProject) => project.id === projectId)

    if (project) {
      dispatch(configurationActions.changeProject(project))
      setIsOpen(false)

      toast({
        title: `Changed project to '${project.name}'`,
        position: 'top',
        isClosable: true,
        variant: 'subtle',
      })
    }
  }

  return (
    <div ref={ref}>
      <Menu matchWidth autoSelect={false} isOpen={isOpen}>
        <CustomMenuButton $active={isOpen} onClick={toggleSelector}>
          <Container>
            <Box flex="1">
              <Text fontSize="xs" color="gray.500">
                selected project
              </Text>

              <Heading as="h5" size="lg">
                {configuration.project?.name}
              </Heading>
            </Box>

            <Box display="flex" alignItems="center">
              <Icon w={6} h={6} as={HiSelector} />
            </Box>
          </Container>
        </CustomMenuButton>

        <MenuList maxHeight="400px" overflow="scroll" shadow="lg">
          <MenuOptionGroup
            fontWeight="semibold"
            onChange={(value) => changeProject(value as string)}
            value={configuration.project?.id}
            type="radio"
            title="Projects"
          >
            {projects?.map((project: IProject) => (
              <MenuItemOption value={project.id} key={project.id}>
                {project.name}
              </MenuItemOption>
            ))}
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
  background: ${({ theme, $active }) =>
    $active ? applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[100])(theme) : ''};
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;

  :hover {
    background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[100])(theme)};
  }
`
