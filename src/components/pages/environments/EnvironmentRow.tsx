import { Box, Td, Tr } from '@chakra-ui/react'
import { IEnvironment } from 'api/ProjectsApi'

interface IProps {
  environment: IEnvironment
}

function EnvironmentRow({ environment }: IProps) {

  return (
    <Tr>
      <Td>
        <Box display="flex" alignItems="center">
          {environment.name}
        </Box>
      </Td>

      <Td isNumeric>
        <Box ml="auto" shadow="md" borderRadius="md" w="7" h="7" background={`${environment.color}.400`} />
      </Td>
    </Tr>
  )
}

export default EnvironmentRow
