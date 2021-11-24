import Section from 'components/styles/Section'
import styled from 'styled-components/macro'
import { Heading, Text, Input, InputLeftElement, Icon, InputGroup, Button, Box } from '@chakra-ui/react'
import { FiMail, FiKey } from 'react-icons/fi'
import ThemeButton from 'theme/ThemeButton'
import PandaflagLogo from 'components/shared/PandaflagLogo'
import { NavLink } from 'react-router-dom'
import { ChangeEvent, useState } from 'react'
import * as yup from 'yup'
import { useTemporaryMessage } from 'hooks/common/useTemporaryMessage'
import RoutePage from 'components/routes/RoutePage'

const ValidationSchema = yup.object().shape({
  password: yup.string().min(6).required(),
  email: yup.string().email().required(),
})

const DefaultCredentials: ICredentials = {
  email: '',
  password: '',
}

interface IError {
  message: string
}

interface ICredentials {
  email: string
  password: string
}

function LoginPage() {
  const temporaryMessage = useTemporaryMessage()
  const [form, setForm] = useState<ICredentials>(DefaultCredentials)

  function onInputChange(inputName: string) {
    return function (event: ChangeEvent<HTMLInputElement>) {
      setForm({ ...form, [inputName]: event.target.value })
    }
  }

  async function onLogin() {
    try {
      await ValidationSchema.validate(form)
      console.log(form)
    } catch (err) {
      const error = err as IError
      temporaryMessage.showMessage(error.message)
    }
  }

  return (
    <Container>
      <PandaflagLogo mx="auto" mt={6} />

      <Content>
        <Section py="12" px="16">
          <LoginContainer>
            <Heading mb={4} as="h3" size="lg">
              Log in
            </Heading>

            <Text color="gray.500" mb={6}>
              Sign in to manage your flags
            </Text>

            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} />} />

              <Input onChange={onInputChange('email')} variant="filled" placeholder="Email" />
            </InputGroup>

            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none" children={<Icon as={FiKey} />} />

              <Input onChange={onInputChange('password')} variant="filled" type="password" placeholder="Password" />
            </InputGroup>

            {!!temporaryMessage.message && <Text color="red.500">{temporaryMessage.message}</Text>}

            <Button mt={6} onClick={onLogin} colorScheme="blue" width="100%" size="md">
              Log in
            </Button>
          </LoginContainer>
        </Section>

        <Text mt={10} mx="auto" color="gray.500">
          Don't have an account? <RegisterLink to={RoutePage.register}>Create Account</RegisterLink>
        </Text>
      </Content>

      <Box mx="auto" mb={6}>
        <ThemeButton />
      </Box>
    </Container>
  )
}

export default LoginPage

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const LoginContainer = styled.div`
  width: 300px;
`

const RegisterLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.blue[500]};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }
`
