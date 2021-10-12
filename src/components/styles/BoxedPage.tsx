import styled from 'styled-components/macro'
import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

function BoxedPage({ children }: IProps) {
  return <Container>{children}</Container>
}

export default BoxedPage

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
`
