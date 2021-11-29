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
import { useContext, useRef, useState } from 'react'
import { HiSelector } from 'react-icons/hi'
import { useClickAway } from 'react-use'
import { IStoreState } from 'redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { configurationActions } from 'redux/ducks/configurationDuck'
import { applyColorMode } from 'theme/StyledThemeProvider'
import ProjectsContext from 'context/ProjectsContext'
import { IProject } from 'api/ProjectsApi'

function getProjectNameSize(projectNameLength: number | undefined): string {
  if (!projectNameLength || projectNameLength < 11) {
    return 'lg'
  }

  return 'md'
}

function SidebarProjectSelector() {
  const dispatch = useDispatch()
  const toast = useToast()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const configuration = useSelector((state: IStoreState) => state.configuration)
  const { data: projects } = useContext(ProjectsContext)

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
      dispatch(configurationActions.setProject(project))
      setIsOpen(false)

      toast({
        title: `Changed project to '${project.name}'`,
        position: 'top-right',
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
            <Box overflow="hidden" flex="1">
              <Text fontSize="xs" color="gray.500">
                selected project
              </Text>

              <Heading as="h5" size={getProjectNameSize(configuration.project?.name?.length)}>
                {configuration.project?.name}
              </Heading>
            </Box>

            <Box display="flex" alignItems="center">
              <Icon w={6} h={6} as={HiSelector} />
            </Box>
          </Container>
        </CustomMenuButton>

        <StyledMenuList maxHeight="400px" overflowY="overlay" shadow="lg">
          <MenuOptionGroup
            fontWeight="semibold"
            onChange={(value) => changeProject(value as string)}
            value={configuration.project?.id}
            type="radio"
            title={`${organization?.name} projects`}
          >
            {projects?.map((project: IProject) => (
              <MenuItemOption value={project.id} key={project.id}>
                {project.name}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </StyledMenuList>
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

const StyledMenuList = styled(MenuList)`
  ::-webkit-scrollbar {
    background-color: transparent;
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #fff;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
    border-radius: 16px;
    border: 5px solid transparent;
  }

  :hover::-webkit-scrollbar-thumb {
    background-color: #a0a0a5;
  }
`
