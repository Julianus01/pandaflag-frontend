import { Box } from '@chakra-ui/layout'
import { Text, Icon, Avatar, AvatarBadge } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { useAuth } from 'hooks/auth/useAuth'
import { FiChevronDown } from 'react-icons/fi'
import { applyColorMode } from 'theme/StyledThemeProvider'
import { useHistory } from 'react-router'
import RoutePage from 'components/routes/RoutePage'
import { IUser } from 'redux/ducks/authDuck'

function userDisplayName(user: IUser) {
  if (user.displayName) {
    return user.displayName
  }

  const email = user.email as string
  return email.substr(0, email.indexOf('@'))
}

function SidebarFooter() {
  const user = useAuth()
  const history = useHistory()

  function navigateToProfile() {
    history.push(RoutePage.profile())
  }

  return (
    <CustomMenuButton $active={window.location.pathname.includes(RoutePage.profile())} onClick={navigateToProfile}>
      <Container>
        <Avatar name={userDisplayName(user)} size="md" shadow="lg" ignoreFallback src={user?.photoURL as string}>
          <AvatarBadge boxSize="1em" bg="green.500" />
        </Avatar>

        <Box overflow="hidden" whiteSpace="nowrap" ml={4} flex={1}>
          <Text isTruncated fontWeight="medium">
            {userDisplayName(user)}
          </Text>
        </Box>

        <Icon as={FiChevronDown} strokeWidth={2.4} w={5} h={5} />
      </Container>
    </CustomMenuButton>
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

const CustomMenuButton = styled(Box)<{ $active: boolean }>`
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  background: ${({ theme, $active }) =>
    $active ? applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[100])(theme) : ''};
`
