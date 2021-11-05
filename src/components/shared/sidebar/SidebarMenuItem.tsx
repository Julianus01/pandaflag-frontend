import { Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ReactNode } from 'react'
import { useHistory } from 'react-router'
import { applyColorMode } from 'theme/StyledThemeProvider'

export interface ISidebarMenuItem {
  name: string
  href: string
  icon: ReactNode
  endComponent?: () => ReactNode
}

interface IProps {
  children: ReactNode
  active?: boolean
  menuItem: ISidebarMenuItem
}

function SidebarMenuItem({ children, menuItem, active = false }: IProps) {
  const history = useHistory()

  function navigate() {
    history.push(menuItem.href)
  }

  return (
    <Container onClick={navigate} active={active}>
      {menuItem.icon}

      <Text ml={3}>{children}</Text>

      {menuItem.endComponent && <End>{menuItem.endComponent()}</End>}
    </Container>
  )
}

export default SidebarMenuItem

const Container = styled.div<{ active: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme, active }) => (active ? theme.fontWeights.bold : theme.fontWeights.medium)};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => `0 ${theme.space[3]}`};
  height: ${({ theme }) => theme.space[12]};
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${({ theme, active }) =>
    active ? applyColorMode(theme.colors.gray[100], theme.colors.whiteAlpha[100])(theme) : ''};
  color: ${({ theme, active }) =>
    active
      ? applyColorMode(theme.colors.gray[800], theme.colors.whiteAlpha[800])(theme)
      : applyColorMode(theme.colors.gray[500], theme.colors.gray[500])(theme)};
  user-select: none;
`

const End = styled.div`
  margin-left: auto;
`
