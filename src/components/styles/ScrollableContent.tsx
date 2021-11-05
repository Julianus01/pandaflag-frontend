import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import ScrollableAbsolute from './ScrollableAbsolute'

interface Props {
  children: ReactNode
}

const ScrollableContent = ({ children }: Props) => {
  return (
    <Container>
      <ScrollableAbsolute>{children}</ScrollableAbsolute>
    </Container>
  )
}

export default ScrollableContent

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
`
