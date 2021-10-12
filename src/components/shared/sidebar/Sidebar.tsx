import { Box, Heading, Icon, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import SidebarMenuItem, { ISidebarMenuItem } from './SidebarMenuItem'
import { FiHome, FiToggleRight, FiSettings, FiLayers } from 'react-icons/fi'
import RoutePage from 'components/routes/RoutePage'
import { useEffect } from 'react'
import { useHistory } from 'react-router'
import SidebarProjectSelector from './SidebarProjectSelector'
import SidebarFooter from './SidebarFooter'
import ThemeButton from 'theme/ThemeButton'

const MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Dashboard',
    href: RoutePage.dashboard(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiHome} />,
    keyboardLetter: 'D',
  },
  {
    name: 'Flags',
    href: RoutePage.flags(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiToggleRight} />,
    keyboardLetter: 'F',
  },
]

const CONFIGURATION_MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Projects',
    href: RoutePage.projects(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiLayers} />,
    keyboardLetter: 'P',
  },
  {
    name: 'Settings',
    href: RoutePage.settings(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiSettings} />,
    keyboardLetter: 'S',
  },
]

const KeyDownKey = 'keydown'

function useKeyboardListener(callback: (event: KeyboardEvent) => void) {
  useEffect(() => {
    document.addEventListener(KeyDownKey, callback)

    return () => {
      document.removeEventListener(KeyDownKey, callback)
    }
  }, [callback])
}

function Sidebar() {
  const history = useHistory()

  useKeyboardListener((event: KeyboardEvent) => {
    const sidebarMenuItemBasedOnKey = [...MENU_ITEMS, ...CONFIGURATION_MENU_ITEMS].find(
      (menuItem) => menuItem.keyboardLetter.toLowerCase() === event.key.toLowerCase()
    )

    if (!sidebarMenuItemBasedOnKey) {
      return
    }

    history.push(sidebarMenuItemBasedOnKey.href)
  })

  return (
    <Container>
      <Heading fontWeight="extrabold" textAlign="left" mb={20} ml={4} as="h4" size="md">
        Smartlaunch
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
