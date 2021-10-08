import { Box } from '@chakra-ui/layout'
import { Text, Heading, Icon, Menu, MenuButton, MenuList, MenuItem, useOutsideClick } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import { ApiQueryId } from 'api/ApiQueryId'
import ProjectsApi, { IProject } from 'api/ProjectsApi'
import ProjectsContext from 'context/ProjectsContext'
import { useContext, useRef, useState } from 'react'
import { HiSelector } from 'react-icons/hi'
import { useQuery } from 'react-query'

function SidebarProjectSelector() {
  const projectsContext = useContext(ProjectsContext)
  const { data: projects } = useQuery(ApiQueryId.getProjects, ProjectsApi.getProjects)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  useOutsideClick({ ref, handler: () => setIsOpen(false) })

  function toggleSelector() {
    setIsOpen(!isOpen)
  }

  return (
    <Menu isOpen={isOpen}>
      <CustomMenuButton active={isOpen} onClick={toggleSelector}>
        <Container>
          <Box flex="1">
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              selected project
            </Text>

            <Heading as="h5" size="sm">
              {projectsContext.selected?.name}
            </Heading>
          </Box>

          <Box display="flex" alignItems="center">
            <Icon w={6} h={6} as={HiSelector} />
          </Box>
        </Container>
      </CustomMenuButton>

      <MenuList shadow="lg">
        {projects?.map((project: IProject) => (
          <MenuItem key={project.id}>{project.name}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default SidebarProjectSelector

const Container = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  cursor: pointer;
  display: flex;
  user-select: none;
`

const CustomMenuButton = styled(MenuButton)<{ active: boolean }>`
  background: ${({ theme, active }) => (active ? theme.colors.gray[100] : '')};
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;

  :hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`
