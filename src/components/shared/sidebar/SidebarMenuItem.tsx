import { Text } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import { ReactNode } from 'react'
import { useHistory } from 'react-router'

interface IProps {
  children: ReactNode
  icon: ReactNode
  active?: boolean
  href: string
}

function SidebarMenuItem({ children, icon, active = false, href }: IProps) {
  const history = useHistory()

  function navigate() {
    history.push(href)
  }

  return (
    <Container onClick={navigate} active={active}>
      {icon}

      <Text ml={3}>{children}</Text>
    </Container>
  )
}

export default SidebarMenuItem

const Container = styled.div<{ active: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${({ theme, active }) => (active ? theme.colors.gray[100] : '')};
  color: ${({ theme, active }) => (active ? theme.colors.gray[800] : theme.colors.gray[600])};
`
