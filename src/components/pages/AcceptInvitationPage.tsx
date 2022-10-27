import { Button, Heading, Input, Text, Box } from '@chakra-ui/react'
import styled from 'styled-components/macro'
import { ChangeEvent, useState } from 'react'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'
import useQueryParam from 'hooks/routing/useQueryParam'
import { QueryParam } from 'hooks/routing/useQueryParams'

function AcceptInvitationPage() {
  // TODO: To be developed
  const temporaryMessage = useTemporaryMessage()
  const [email, setEmail] = useState<string>(useQueryParam(QueryParam.email) as string)

  function onEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  async function sendPasswordReset() {
    // TODO:
  }

  return (
    <Container>
      <Content>
        <CreateBox>
          <Heading mb={2} as="h4" size="md">
            XXX invited you in organization HERE
          </Heading>

          <Text color="gray.500" mb={4}>
            We got you covered. Let us know of your account email below, and we'll help you out.
          </Text>

          <Input value={email} onChange={onEmailChange} mb={4} variant="filled" placeholder="Your account email" />

          <Box display="flex">
            {!!temporaryMessage.message && (
              <Text flex="1" mr={4} color="red.500">
                {temporaryMessage.message}
              </Text>
            )}

            <Button loadingText="Send reset password email" onClick={sendPasswordReset} ml="auto" colorScheme="primary">
              Here
            </Button>
          </Box>
        </CreateBox>
      </Content>
    </Container>
  )
}

export default AcceptInvitationPage

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
