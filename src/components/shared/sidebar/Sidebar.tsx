import { Box, Icon, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import SidebarMenuItem, { ISidebarMenuItem } from './SidebarMenuItem'
import { FiLayers, FiFlag, FiGlobe, FiHash, FiMessageSquare, FiUsers } from 'react-icons/fi'
import RoutePage from 'components/routes/RoutePage'
import SidebarProjectSelector from './SidebarProjectSelector'
import SidebarFooter from './SidebarFooter'
import SidebarProjectsCount from './SidebarProjectsCount'
import SidebarFlagsCount from './SidebarFlagsCount'
import { useFlag } from 'pandaflag-react'
import { FeatureFlag } from 'utils/CommonUtils'
import PandaflagLogoSideText from '../PandaflagLogoSideText'

const MENU_ITEMS: ISidebarMenuItem[] = [
  {
    name: 'Flags',
    href: RoutePage.flags(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiFlag} />,
    endComponent: () => <SidebarFlagsCount />,
  },
  {
    name: 'Environments',
    href: RoutePage.environments(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiHash} />,
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
    name: 'Members',
    href: RoutePage.members(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiUsers} />,
  },
  {
    name: 'Organization',
    href: RoutePage.organization(),
    icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiGlobe} />,
  },
]

const FEEDBACK_MENU_ITEM = {
  name: 'Feedback',
  href: RoutePage.feedback(),
  icon: <Icon strokeWidth={2.4} w={4} h={4} as={FiMessageSquare} />,
}

function Sidebar() {
  const feedbackFlagData = useFlag(FeatureFlag.feedbackPage)

  return (
    <Container>
      <PandaflagLogoSideText textAlign="left" mb={16} mr="auto" ml="4" />

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

      {feedbackFlagData.flag?.enabled && (
        <Box marginTop="auto">
          <SidebarMenuItem
            menuItem={FEEDBACK_MENU_ITEM}
            active={window.location.pathname.includes(FEEDBACK_MENU_ITEM.href)}
          >
            {FEEDBACK_MENU_ITEM.name}
          </SidebarMenuItem>
        </Box>
      )}
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
