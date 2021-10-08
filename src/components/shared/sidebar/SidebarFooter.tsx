import { Box } from '@chakra-ui/layout'
import { Text, Icon, Avatar, AvatarBadge } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import { useAuth } from 'hooks/authHooks'
import { FiChevronDown } from 'react-icons/fi'

function SidebarFooter() {
  const auth = useAuth()

  return (
    <Container>
      <Avatar shadow="lg" name={auth.user?.name} src={auth.user?.picture}>
        <AvatarBadge boxSize="1em" bg="green.500" />
      </Avatar>

      <Box overflow="hidden" whiteSpace="nowrap" ml={4} flex={1}>
        <Text textTransform="capitalize" isTruncated fontWeight="medium">
          {auth.user?.name}
        </Text>
      </Box>

      <Icon as={FiChevronDown} strokeWidth={2.4} w={5} h={5} />
    </Container>
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
