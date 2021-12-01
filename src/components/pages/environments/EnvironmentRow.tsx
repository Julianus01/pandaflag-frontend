import { Box, Td, Tr } from '@chakra-ui/react'
import { IEnvironment } from 'api/ProjectsApi'
import styled from 'styled-components/macro'

interface IProps {
  environment: IEnvironment
}

function EnvironmentRow({ environment }: IProps) {

  return (
    <Row>
      <Td>
        <Box display="flex" alignItems="center">
          {environment.name}
        </Box>
      </Td>

      <Td isNumeric>
        <Box ml="auto" shadow="md" borderRadius="md" w="7" h="7" background={`${environment.color}.400`} />
      </Td>
    </Row>
  )
}

export default EnvironmentRow

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`
