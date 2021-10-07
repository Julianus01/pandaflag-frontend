import { Route, RouteProps } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import Sidebar from 'components/shared/sidebar/Sidebar'

function NavigationRoute(props: RouteProps) {
  return (
    <Container>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>

      <Content>
        <Route {...props} />
      </Content>
    </Container>
  )
}

export default NavigationRoute

const Container = styled.div`
  width: 100%;
`

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.space[14]} ${theme.space[16]}`};
  margin-left: 276px;
`
