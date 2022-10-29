import { Button, Heading, Input, Text, useToast, Box } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import AuthApi from 'api/AuthApi'
import * as yup from 'yup'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'
import useQueryParam from 'hooks/routing/useQueryParam'
import { QueryParam } from 'hooks/routing/useQueryParams'
import { NavLink } from 'react-router-dom'
import RoutePage from 'components/routes/RoutePage'
import ThemeButton from 'theme/ThemeButton'
import Section from 'components/styles/Section'

const ValidationSchema = yup.object().shape({
  Email: yup.string().email().required(),
})

function ForgotPasswordPage() {
  const toast = useToast()

  const temporaryMessage = useTemporaryMessage()
  const [email, setEmail] = useState<string>(useQueryParam(QueryParam.email) as string)
  const [hasBeenSent, setHasBeenSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function onEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      sendPasswordReset()
    }
  }

  async function sendPasswordReset() {
    try {
      temporaryMessage.hideMessage()
      const { Email: validEmail } = await ValidationSchema.validate({
        Email: email,
      })

      setIsLoading(true)
      await AuthApi.sendPasswordReset(validEmail)
      setIsLoading(false)
      setHasBeenSent(true)

      toast({
        title: `Reset password email sent 📬`,
        isClosable: true,
        variant: 'subtle',
      })
    } catch (err) {
      const error = err as ErrorEvent
      temporaryMessage.showMessage(error.message)
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Content>
        <ContentBox>
          <Heading mb={2} as="h4" size="md">
            Forgot your password? 🔓
          </Heading>

          <Text color="gray.500" mb={4}>
            We got you covered. Let us know of your account email below, and we'll help you out.
          </Text>

          <Input
            disabled={isLoading}
            onKeyDown={onKeyDown}
            value={email}
            onChange={onEmailChange}
            mb={4}
            variant="filled"
            placeholder="Your account email"
          />

          <Box display="flex">
            {!!temporaryMessage.message && (
              <Text flex="1" mr={4} color="red.500">
                {temporaryMessage.message}
              </Text>
            )}

            <Button
              loadingText="Send reset password email"
              onClick={sendPasswordReset}
              disabled={isLoading || hasBeenSent}
              ml="auto"
              colorScheme="primary"
              isLoading={isLoading}
            >
              {!hasBeenSent && 'Send reset password email'}
              {hasBeenSent && 'Reset password email sent'}
            </Button>
          </Box>
        </ContentBox>
      </Content>

      <Box mt={24} mx="auto">
        <NavLink to={RoutePage.login()}>
          <Button variant="ghost">Go to login</Button>
        </NavLink>
      </Box>

      <Box mx="auto" mt={6}>
        <ThemeButton />
      </Box>
    </Container>
  )
}

export default ForgotPasswordPage

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
