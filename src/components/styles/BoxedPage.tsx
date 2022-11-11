import { Box } from '@chakra-ui/react'
import styled from 'styled-components/macro'

const BoxedPage = styled(Box)<{ maxWidth?: string }>`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth ?? '800px'};
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space[14]} 0`};
  padding-bottom: ${({ theme }) => theme.space[36]};
`

export default BoxedPage
