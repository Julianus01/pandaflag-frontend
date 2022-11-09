import { Button, Heading, Box, Text, useToast } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { useState } from 'react'
import AuthApi from 'api/AuthApi'
import ThemeButton from 'theme/ThemeButton'
import Section from 'components/styles/Section'
import PandaflagLogo from 'components/shared/PandaflagLogo'

function EmailVerificationPage() {
  const toast = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasBeenSent, setHasBeenSent] = useState<boolean>(false)

  function onRefresh() {
    window.location.reload()
  }

  async function onSendVerificationEmail() {
    try {
      setIsLoading(true)
      await AuthApi.sendVerificationEmail()
      setIsLoading(false)
      setHasBeenSent(true)

      toast({
        title: `Verification email sent 📬`,
        isClosable: true,
        variant: 'subtle',
      })
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Box display="flex" justifyContent="center">
        <a href={process.env.REACT_APP_PANDAFLAG_APP_URL as string}>
          <PandaflagLogo mx="auto" mt={6} />
        </a>
      </Box>

      <Content>
        <ContentBox display="flex" flexDirection="column">
          <Heading mb={1} as="h4" size="md">
            Verify your email address inbox ✉️
          </Heading>

          <Text mb={12} color="gray.500">
            We need to verify you are truthful and you did not steal this account :)
            <br />
            Refresh this page after you have accessed the link.
          </Text>

          <Box display="flex">
            <Text mb={2} color="gray.500">
              Didn't get the email?
            </Text>

            <Button
              isLoading={isLoading}
              loadingText="Sending"
              disabled={hasBeenSent || isLoading}
              onClick={onSendVerificationEmail}
              ml="auto"
              variant="ghost"
            >
              {!hasBeenSent && 'Send again'}
              {hasBeenSent && 'Email sent'}
            </Button>

            <Button disabled={isLoading} onClick={onRefresh} ml="2" colorScheme="primary">
              Refresh
            </Button>
          </Box>
        </ContentBox>
      </Content>

      <Button onClick={AuthApi.logout} mt={24} variant="ghost" mx="auto">
        Logout
      </Button>

      <Box mx="auto" mt={6}>
        <ThemeButton />
      </Box>
    </Container>
  )
}

export default EmailVerificationPage

const Container = styled.div`
  margin-top: 20vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContentBox = styled(Section).attrs({ py: 10, px: 12 })`
  display: flex;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
`
