import styled from 'styled-components/macro'
import AccessibleBackground from './AccessibleBackground'

const Section = styled(AccessibleBackground).attrs({ shadow: 'xs' })`
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[6]}`};
  border-radius: ${({ theme }) => theme.radii['lg']};
`

export default Section
