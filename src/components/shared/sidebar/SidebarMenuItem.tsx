import { Text } from '@chakra-ui/react'
import styled from '@emotion/styled/macro'
import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
  icon: ReactNode
  active?: boolean
}

function SidebarMenuItem({ children, icon, active = false }: IProps) {
  return (
    <Container active={active}>
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
