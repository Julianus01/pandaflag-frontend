import { Heading, FormControl, FormLabel, Input, Box, Button, useToast } from '@chakra-ui/react'
import BoxedPage from 'components/styles/BoxedPage'
import Section from 'components/styles/Section'
import { ChangeEvent, useState, KeyboardEvent } from 'react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'
import _ from 'lodash/fp'
import { useMutation, useQueryClient } from 'react-query'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { ApiQueryId } from 'api/ApiQueryId'
import usePropState from 'hooks/common/usePropState'

function OrganizationPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const organization = useSelector((state: IStoreState) => state.configuration.organization)

  const [name, setName] = usePropState<string>(organization?.name as string)
  const [isDirty, setIsDirty] = useState<boolean>(false)

  const updateOrganizationMutation = useMutation(OrganizationsApi.updateOrganization)

  function onNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (value.length > 40) {
      return
    }

    setName(value)

    if (!isDirty) {
      setIsDirty(true)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onUpdate()
    }
  }

  function onUpdate() {
    updateOrganizationMutation.mutate({ ...organization, name: name.trim() } as IOrganization, {
      onSuccess: () => {
        queryClient.setQueryData(ApiQueryId.getOrganization, (oldData) => {
          const oldOrganization = oldData as IOrganization
          return { ...oldOrganization, name: name.trim() } as IOrganization
        })

        toast({
          title: `Updated successfully`,
          position: 'top-right',
          isClosable: true,
          variant: 'subtle',
          status: 'success',
        })
      },
    })
  }

  return (
    <BoxedPage>
      <Box display="flex" mb={10}>
        <Heading flex={1} as="h3" size="lg">
          Organization
        </Heading>

        <Button
          isLoading={updateOrganizationMutation.isLoading}
          disabled={
            !isDirty ||
            _.isEqual(name.trim(), organization?.name) ||
            name.length < 3 ||
            updateOrganizationMutation.isLoading
          }
          onClick={onUpdate}
          ml="auto"
          colorScheme="blue"
          loadingText="Updating"
        >
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

          <Input onKeyDown={onKeyDown} onChange={onNameChange} value={name} variant="filled" placeholder="Name" />
        </FormControl>
      </Section>
    </BoxedPage>
  )
}

export default OrganizationPage
