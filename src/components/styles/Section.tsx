import styled from 'styled-components/macro'
import AccessibleBackground from './AccessibleBackground'

const Section = styled(AccessibleBackground).attrs({ shadow: 'xs' })`
  border-radius: ${({ theme }) => theme.radii['lg']};
`

export default Section
