import { ReactNode } from 'react'
import styled from 'styled-components'

import Scrollable from './Scrollable'

interface Props {
  children: ReactNode
}

const ScrollableContent = ({ children }: Props) => {
  return (
    <Container>
      <Scrollable>{children}</Scrollable>
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
