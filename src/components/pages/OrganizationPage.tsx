import { Heading, FormControl, FormLabel, Input, Box, Button } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import Section from 'components/styles/Section'
import { ChangeEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function OrganizationPage() {
  const organization = useSelector((state: IStoreState) => state.configuration.organization)
  const [name, setName] = useState<string>(organization?.name as string)

  function onNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  return (
    <BoxedPage>
      <Box display="flex" mb={10}>
        <Heading flex={1} as="h3" size="lg">
          Organization
        </Heading>

        {/* TODO: Implement this */}
        <Button disabled onClick={() => null} ml="auto" colorScheme="blue">
          Update
        </Button>
      </Box>

      <Section>
        <Heading mb={2} as="h5" size="sm">
          Information
        </Heading>

        <FormControl id="name">
          <FormLabel fontSize="sm" color="gray.500">
            Name
          </FormLabel>

          <Input onChange={onNameChange} value={name} variant="filled" placeholder="Name" />
        </FormControl>
      </Section>
    </BoxedPage>
  )
}

export default OrganizationPage
