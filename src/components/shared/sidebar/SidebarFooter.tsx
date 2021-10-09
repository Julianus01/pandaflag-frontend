import { Box } from '@chakra-ui/layout'
import { Text, Icon, Avatar, AvatarBadge, MenuList, MenuItem, Menu, MenuButton } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { useAuth } from 'hooks/authHooks'
import { FiChevronDown } from 'react-icons/fi'
import { useClickAway } from 'react-use'
import { useState, useRef } from 'react'

function SidebarFooter() {
  const auth = useAuth()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useRef(null)

  useClickAway(ref, () => {
    setIsOpen(false)
  })

  function toggleSelector() {
    setIsOpen(!isOpen)
  }

  return (
    <Menu autoSelect={false} matchWidth isOpen={isOpen}>
      <CustomMenuButton ref={ref} $active={isOpen} onClick={toggleSelector}>
        <Container>
          <Avatar shadow="lg" ignoreFallback src={auth.user?.picture}>
            <AvatarBadge boxSize="1em" bg="green.500" />
          </Avatar>

          <Box overflow="hidden" whiteSpace="nowrap" ml={4} flex={1}>
            <Text textTransform="capitalize" isTruncated fontWeight="medium">
              {auth.user?.name}
            </Text>
          </Box>

          <Icon as={FiChevronDown} strokeWidth={2.4} w={5} h={5} />
        </Container>
      </CustomMenuButton>

      <MenuList shadow="lg">
        <MenuItem onClick={() => auth.logout({ returnTo: window.location.origin })}>Logout</MenuItem>
      </MenuList>
    </Menu>
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

  :hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`

const CustomMenuButton = styled(MenuButton)<{ $active: boolean }>`
  background: ${({ theme, $active }) => ($active ? theme.colors.gray[100] : '')};
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;

  :hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`
