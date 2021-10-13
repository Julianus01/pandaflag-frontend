import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { IProject } from 'api/ProjectsApi'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import ProjectRow from './ProjectRow'

interface IProps {
  projects: IProject[]
}

function ProjectsTable({ projects }: IProps) {
  return (
    <CustomTable variant="simple">
      <TableHead>
        <Tr>
          <Th textTransform="capitalize">Name</Th>

          <Th textTransform="capitalize">Api key</Th>

          <Th textTransform="capitalize" isNumeric>
            Created at
          </Th>

          <Th textTransform="capitalize" />
        </Tr>
      </TableHead>

      <Tbody>
        {projects.map((project: IProject) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </Tbody>
    </CustomTable>
  )
}

export default ProjectsTable

const TableHead = styled(Thead)`
  background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.gray[900])(theme)};
`

const CustomTable = styled(Table)`
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[800])(theme)};
`
