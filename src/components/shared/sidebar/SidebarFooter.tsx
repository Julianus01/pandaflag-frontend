import { Box } from '@chakra-ui/layout'
import { Text, Icon, Avatar, AvatarBadge, MenuList, MenuItem, Menu, MenuButton } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { useAuth } from 'hooks/auth/useAuth'
import { FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi'
import { useClickAway } from 'react-use'
import { useState, useRef } from 'react'
import { applyColorMode } from 'theme/StyledThemeProvider'
import { useHistory } from 'react-router'
import RoutePage from 'components/routes/RoutePage'

function userDisplayName(name: string) {
  if(name.includes('@')) {
    return name.substr(0, name.indexOf('@'))
  }

  return name
}

function SidebarFooter() {
  const auth = useAuth()
  const history = useHistory()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  useClickAway(ref, () => {
    setIsOpen(false)
  })

  function toggleSelector() {
    setIsOpen(!isOpen)
  }

  function navigateToProfile() {
    history.push(RoutePage.profile())
    setIsOpen(false)
  }

  return (
    <div ref={ref}>
      <Menu autoSelect={false} matchWidth isOpen={isOpen}>
        <CustomMenuButton $active={isOpen} onClick={toggleSelector}>
          <Container>
            <Avatar size="md" shadow="lg" ignoreFallback src={auth.user?.picture}>
              <AvatarBadge boxSize="1em" bg="green.500" />
            </Avatar>

            <Box overflow="hidden" whiteSpace="nowrap" ml={4} flex={1}>
              <Text isTruncated fontWeight="medium">
                {auth.user?.name && userDisplayName(auth.user?.name)}
              </Text>
            </Box>

            <Icon as={FiChevronDown} strokeWidth={2.4} w={5} h={5} />
          </Container>
        </CustomMenuButton>

        <MenuList shadow="lg">
          <MenuItem icon={<Icon as={FiUser} w={5} h={5} />} onClick={navigateToProfile}>
            Profile
          </MenuItem>

          <MenuItem
            icon={<Icon as={FiLogOut} w={5} h={5} />}
            onClick={() => auth.logout({ returnTo: window.location.origin })}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}

export default SidebarFooter

const Container = styled.div`
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.xl};
  cursor: pointer;
  display: flex;
  user-select: none;
  align-items: center;
`

const CustomMenuButton = styled(MenuButton)<{ $active: boolean }>`
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  background: ${({ theme, $active }) =>
    $active ? applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[100])(theme) : ''};

  :hover {
    background: ${({ theme }) => applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[100])(theme)};
  }
`
