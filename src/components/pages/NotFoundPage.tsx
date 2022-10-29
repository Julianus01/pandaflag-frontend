import { Heading, Text } from '@chakra-ui/react'
import styled from 'styled-components/macro'

function NotFoundPage() {
  return (
    <Container>
      <Content>
        <ContentBox>
          <Heading mb={2} as="h1" fontSize="160px">
            404
          </Heading>

          <Text color="gray.500" mb={4}>
            Page not found
          </Text>
        </ContentBox>
      </Content>
    </Container>
  )
}

export default NotFoundPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  margin-top: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContentBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 550px;
  width: 100%;
`
