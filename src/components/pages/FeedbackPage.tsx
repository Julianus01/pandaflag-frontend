import { Heading, Text, FormControl, FormLabel, Input, Box, Icon, Button, useToast } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import AutoTextArea from 'components/styles/AutoTextarea'
import Section from 'components/styles/Section'
import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { KeyboardEvent } from 'react'
import FeedbackApi from 'api/FeedbackApi'
import { useMutation } from 'react-query'
import { SplitbeeEvent } from 'utils/SplitbeeUtils'

function FeedbackPage() {
  const toast = useToast()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const sendFeedbackMutation = useMutation(FeedbackApi.sendFeedback, {
    onSuccess: () => {
      toast({
        title: `Feedback sent!`,
        position: 'top-right',
        isClosable: true,
        variant: 'subtle',
      })
    },
  })

  function onKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !sendDisabled && !sendFeedbackMutation.isLoading) {
      sendFeedback()
    }
  }

  async function sendFeedback() {
    sendFeedbackMutation.mutate({ title: title.trim(), message: description.trim() })
  }

  const sendDisabled = title.length < 3 || description.length < 3

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
        <FormControl id="Title">
          <FormLabel fontSize="sm" color="gray.500">
            Title
          </FormLabel>

          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            variant="filled"
            placeholder="Title"
            mb={4}
            onKeyDown={onKeyDown}
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
        <Button
          data-splitbee-event={SplitbeeEvent.SendFeedback}
          onClick={sendFeedback}
          isLoading={sendFeedbackMutation.isLoading}
          disabled={sendFeedbackMutation.isLoading || sendDisabled}
          leftIcon={<Icon as={FiSend} />}
        >
          Send your feedback
        </Button>
      </Box>
    </BoxedPage>
  )
}

export default FeedbackPage
