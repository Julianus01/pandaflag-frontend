import { Button, Heading, Box, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { useState } from 'react'
import AuthApi from 'api/AuthApi'

function EmailVerificationPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasBeenSent, setHasBeenSent] = useState<boolean>(false)

  async function onSendVerificationEmail() {
    try {
      setIsLoading(true)
      await AuthApi.sendVerificationEmail()
      setIsLoading(false)
      setHasBeenSent(true)
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Content>
        <Box display="flex" flexDirection="column">
          <Heading mb={1} as="h4" size="md">
            Verify your email address inbox
          </Heading>

          <Text mb={8} color="gray.500">
            We need to verify you are truthful and you did not steal this account :)
            <br />
            Refresh this page after you have accessed the link
          </Text>

          <Box display="flex">
            <Text mb={2} color="gray.500">
              Didn't get the email?
            </Text>

            <Button
              isLoading={isLoading}
              loadingText="Sending"
              disabled={hasBeenSent}
              onClick={onSendVerificationEmail}
              ml="auto"
              colorScheme="blue"
            >
              {!hasBeenSent && 'Send again'}
              {hasBeenSent && 'Sent'}
            </Button>
          </Box>
        </Box>
      </Content>

      <Button onClick={AuthApi.logout} mb={6} variant="ghost" mx="auto">
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
