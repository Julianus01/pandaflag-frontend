import { Heading, Icon } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import SidebarMenuItem from './SidebarMenuItem'
import { FiHome, FiToggleRight, FiSettings } from 'react-icons/fi'
import RoutePage from 'components/routes/RoutePage'

function Sidebar() {
  return (
    <Container>
      <Heading fontWeight="extrabold" textAlign="center" mb={12} as="h4" size="md">
        smartlaunch
      </Heading>

      <Content>
        <SidebarMenuItem
          href={RoutePage.dashboard()}
          active={window.location.pathname.includes(RoutePage.dashboard())}
          icon={<Icon strokeWidth={2.4} w={4} h={4} as={FiHome} />}
        >
          Dashboard
        </SidebarMenuItem>

        <SidebarMenuItem
          href={RoutePage.featureFlags()}
          active={window.location.pathname.includes(RoutePage.featureFlags())}
          icon={<Icon strokeWidth={2.4} w={4} h={4} as={FiToggleRight} />}
        >
          Feature flags
        </SidebarMenuItem>

        <SidebarMenuItem
          href={RoutePage.settings()}
          active={window.location.pathname.includes(RoutePage.settings())}
          icon={<Icon strokeWidth={2.4} w={4} h={4} as={FiSettings} />}
        >
          Settings
        </SidebarMenuItem>
      </Content>
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  height: 30px;
  height: 100%;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[5]}`};
`

const Content = styled.div`
  div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space[2]};
  }
`
