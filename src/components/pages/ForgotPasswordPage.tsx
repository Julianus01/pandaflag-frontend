import { Button, Heading, Input, Text, useToast, Box } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import AuthApi from 'api/AuthApi'
import * as yup from 'yup'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'

const ValidationSchema = yup.object().shape({
  Email: yup.string().email().required(),
})

function ForgotPasswordPage() {
  const toast = useToast()

  const temporaryMessage = useTemporaryMessage()
  const [email, setEmail] = useState<string>('')
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
      console.log('here')
      temporaryMessage.hideMessage()
      const { Email: validEmail } = await ValidationSchema.validate({
        Email: email,
      })

      console.log(validEmail)
      setIsLoading(true)
      await AuthApi.sendPasswordReset(validEmail)
      setIsLoading(false)
      setHasBeenSent(true)

      toast({
        title: `Reset password email sent`,
        position: 'top-right',
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
        <CreateBox>
          <Heading mb={2} as="h4" size="md">
            Forgot your password?
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
              loadingText="Reset password"
              onClick={sendPasswordReset}
              disabled={isLoading || hasBeenSent}
              ml="auto"
              colorScheme="blue"
              isLoading={isLoading}
            >
              {!hasBeenSent && 'Reset password'}
              {hasBeenSent && 'Reset password email sent'}
            </Button>
          </Box>
        </CreateBox>
      </Content>
    </Container>
  )
}

export default ForgotPasswordPage

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

const CreateBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
`
