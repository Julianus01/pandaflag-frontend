import { Heading, Text, FormControl, FormLabel, Input, Box, Icon, Button } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import AutoTextArea from 'components/styles/AutoTextarea'
import Section from 'components/styles/Section'
import { useState } from 'react'
import { FiSend } from 'react-icons/fi'

function FeedbackPage() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  return (
    <BoxedPage>
      <Heading flex={1} mb={10} as="h3" size="lg">
        Feedback
      </Heading>

      <Text mb={4}>
        Leave us your thoughts, feedback, improvement suggestions, desired feature, not likes, constructive ideas in
        order for us to have a better overview of what your needs are
      </Text>

      <Section mb={4}>
        <FormControl id="name">
          <FormLabel fontSize="sm" color="gray.500">
            Name
          </FormLabel>

          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            variant="filled"
            placeholder="Title"
            mb={4}
          />
        </FormControl>

        <FormControl id="description">
          <FormLabel fontSize="sm" color="gray.500">
            Description
          </FormLabel>

          <AutoTextArea
            borderRadius="md"
            variant="filled"
            placeholder="Description"
            size="sm"
            resize="none"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </FormControl>
      </Section>

      <Box display="flex" justifyContent="center">
        <Button leftIcon={<Icon as={FiSend} />}>Send your feedback</Button>
      </Box>
    </BoxedPage>
  )
}

export default FeedbackPage
