import { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { applyColorMode } from 'theme/StyledThemeProvider'

interface IProps {
  children: ReactNode
}

function FixedFooter({ children, ...props }: IProps) {
  return (
    <Container {...props}>
      <Content>
        <Footer>{children}</Footer>
      </Content>
    </Container>
  )
}

export default FixedFooter

const Container = styled.div`
  display: flex;
  position: fixed;
  /* Sidebar width !! */
  left: 280px;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => applyColorMode(theme.colors.gray[50], theme.colors.gray[800])(theme)};
`

const Content = styled.div`
  flex: 1;
  display: flex;

  padding: ${({ theme }) => `0 ${theme.space[24]}`};
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => `0 ${theme.space[12]}`};
  }
`

const Footer = styled.footer`
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 72px;
  /* Boxed Page max-width !! */
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.space[10]};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `0 ${theme.space[8]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  background: ${({ theme }) => applyColorMode(theme.colors.white, theme.colors.gray[900])(theme)};
`
