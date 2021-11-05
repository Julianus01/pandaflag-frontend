import { Button, Heading, Box, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { useAuth } from 'hooks/auth/useAuth'
import { useEffect } from 'react'

function removeAuthLocalStorage() {
  localStorage.removeItem(
    `@@auth0spajs@@::${process.env.REACT_APP_AUTH0_CLIENT_ID}::default::openid profile email offline_access`
  )
}

function EmailVerificationPage() {
  const { logout } = useAuth()

  useEffect(() => {
    removeAuthLocalStorage()
  }, [])

  return (
    <Container>
      <Content>
        <Box>
          <Heading mb={1} as="h4" size="md">
            Verify your email address inbox
          </Heading>

          <Text mb={4} color="gray.500">
            We need to verify you are truthful and you did not steal this account :)
            <br />
            Refresh this page after you have accessed the link
          </Text>
        </Box>
      </Content>

      <Button onClick={() => logout({ returnTo: window.location.origin })} mb={6} variant="ghost" mx="auto">
        Logout
      </Button>
    </Container>
  )
}

export default EmailVerificationPage

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`
