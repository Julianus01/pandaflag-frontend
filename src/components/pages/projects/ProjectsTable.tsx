import { Tbody, Th, Tr, Box, Icon, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text } from '@chakra-ui/react'
import { IProject } from 'api/ProjectsApi'
import RoutePage from 'components/routes/RoutePage'
import Table from 'components/styles/Table'
import Thead from 'components/styles/Thead'
import { QueryParam, TryApiParam } from 'hooks/routing/useQueryParams'
import { FiInfo } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import ProjectRow from './ProjectRow'

interface IProps {
  projects: IProject[]
}

function ProjectsTable({ projects }: IProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th textTransform="capitalize">
            <Box ml="26px">Name</Box>
          </Th>

          <Th textTransform="capitalize">
            <Box display="flex">
              Api key
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Box display="flex" ml={1}>
                    <Icon cursor="pointer" as={FiInfo} w={4} h={4} />
                  </Box>
                </PopoverTrigger>

                <PopoverContent _focus={{ boxShadow: 'none', outline: 'none' }}>
                  <PopoverBody shadow="lg" p="4">
                    <PopoverText
                      textTransform="none"
                      lineHeight="5"
                      letterSpacing="normal"
                      fontWeight="normal"
                      fontSize="sm"
                    >
                      Every project has an Api Key.
                      <br />
                      <br />
                      This key is being used when calling the REST API in order to get your flags information.
                      <br />
                      <br />
                      <RouteLink to={`${RoutePage.flags()}?${QueryParam.tryApi}=${TryApiParam.open}`}>
                        Try out the api preview
                      </RouteLink>
                    </PopoverText>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </Th>

          <Th textTransform="capitalize" isNumeric>
            Created at
          </Th>

          <Th textTransform="capitalize" />
        </Tr>
      </Thead>

      <Tbody>
        {projects.map((project: IProject) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </Tbody>
    </Table>
  )
}

export default ProjectsTable

const RouteLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue[500]};
  text-decoration: underline;
`

const PopoverText = styled(Text)`
  color: ${({ theme }) => applyColorMode(theme.colors.gray[800], theme.colors.whiteAlpha[900])(theme)};
`
