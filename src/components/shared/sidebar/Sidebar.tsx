import { Box, Icon, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import SidebarMenuItem, { ISidebarMenuItem } from './SidebarMenuItem'
import { FiLayers, FiFlag, FiGlobe, FiHash } from 'react-icons/fi'
import RoutePage from 'components/routes/RoutePage'
import SidebarProjectSelector from './SidebarProjectSelector'
import SidebarFooter from './SidebarFooter'
import SidebarProjectsCount from './SidebarProjectsCounts'
import PandaflagLogo from '../PandaflagLogo'

const MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Flags',
    href: RoutePage.flags(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiFlag} />,
  },
  {
    name: 'Environments',
    href: RoutePage.environments(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiHash} />,
    endComponent: () => <SidebarProjectsCount />,
  },
]

const CONFIGURATION_MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Projects',
    href: RoutePage.projects(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiLayers} />,
    endComponent: () => <SidebarProjectsCount />,
  },
  {
    name: 'Organization',
    href: RoutePage.organization(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiGlobe} />,
  },
]

function Sidebar() {
  return (
    <Container>
      <PandaflagLogo textAlign="left" mb={16} ml={4} />

      <Box mb={2}>
        <SidebarProjectSelector />
      </Box>

      <Content>
        {MENU_ITEMS.map((menuItem: ISidebarMenuItem) => (
          <SidebarMenuItem
            menuItem={menuItem}
            key={menuItem.href}
            active={window.location.pathname.includes(menuItem.href)}
          >
            {menuItem.name}
          </SidebarMenuItem>
        ))}

        <Text ml={4} mt={6} mb={2} fontSize="xs" fontWeight="semibold">
          Configuration
        </Text>

        {CONFIGURATION_MENU_ITEMS.map((menuItem: ISidebarMenuItem) => (
          <SidebarMenuItem
            menuItem={menuItem}
            key={menuItem.href}
            active={window.location.pathname.includes(menuItem.href)}
          >
            {menuItem.name}
          </SidebarMenuItem>
        ))}
      </Content>

      <SidebarFooter />
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  height: 100%;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[5]}`};
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;

  div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space[2]};
  }
`
