import { Box } from '@chakra-ui/layout'
import { Text, Avatar, AvatarBadge } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'
import { useHistory } from 'react-router'
import RoutePage from 'components/routes/RoutePage'
import { IUser } from 'redux/ducks/authDuck'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import { UserUtils } from 'utils/UserUtils'

function SidebarFooter() {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const history = useHistory()

  function navigateToProfile() {
    history.push(RoutePage.profile())
  }

  return (
    <CustomMenuButton $active={window.location.pathname.includes(RoutePage.profile())} onClick={navigateToProfile}>
      <Container>
        <Avatar
          name={UserUtils.userDisplayName(user as IUser)}
          size="md"
          shadow="lg"
          src={user?.photoURL as string}
        >
          <AvatarBadge boxSize="1em" bg="green.500" />
        </Avatar>

        <Box overflow="hidden" whiteSpace="nowrap" ml={4} flex={1}>
          <Text isTruncated fontWeight="medium">
            {UserUtils.userDisplayName(user as IUser)}
          </Text>
        </Box>
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
