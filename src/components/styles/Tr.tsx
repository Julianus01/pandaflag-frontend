import { Tr } from '@chakra-ui/react'
import styled from 'styled-components/macro'

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`

export default Row
