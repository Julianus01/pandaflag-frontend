import styled from 'styled-components/macro'

const BoxedPage = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space[14]} 0`};
`

export default BoxedPage
