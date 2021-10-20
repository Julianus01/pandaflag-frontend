import { Box, Heading, Icon, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import SidebarMenuItem, { ISidebarMenuItem } from './SidebarMenuItem'
import { FiBarChart2, FiSettings, FiLayers, FiFlag } from 'react-icons/fi'
import RoutePage from 'components/routes/RoutePage'
import SidebarProjectSelector from './SidebarProjectSelector'
import SidebarFooter from './SidebarFooter'
import ThemeButton from 'theme/ThemeButton'
import SidebarProjectsCount from './SidebarProjectsCounts'

const MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Dashboard',
    href: RoutePage.dashboard(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiBarChart2} />,
  },
  {
    name: 'Flags',
    href: RoutePage.flags(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiFlag} />,
  },
]

const CONFIGURATION_MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Projects',
    href: RoutePage.projects(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiLayers} />,
    endComponent: () => <SidebarProjectsCount />
  },
  {
    name: 'Settings',
    href: RoutePage.settings(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiSettings} />,
  },
]

function Sidebar() {
  return (
    <Container>
      <Heading fontWeight="extrabold" textAlign="left" mb={16} ml={4} as="h4" size="md">
        smartlaunch
      </Heading>

      <Box mb={6}>
        <SidebarProjectSelector />
      </Box>

      <Content>
        <Text ml={4} mb={2} fontSize="xs" fontWeight="semibold">
          General
        </Text>

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

      <Box display="flex" justifyContent="flex-start" ml="23px">
        <ThemeButton />
      </Box>

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
