import {
  Box,
  Heading,
  Icon,
  Spinner,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Tag,
  Button,
  useToast,
  IconButton,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import AutoTextArea from 'components/styles/AutoTextarea'
import BoxedPage from 'components/styles/BoxedPage'
import usePropState from 'hooks/common/usePropState'
import useFlagEnvironment from 'hooks/flag/useEnvironmentColor'
import { ChangeEvent, useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, NavLink, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import _ from 'lodash/fp'
import Section from 'components/styles/Section'

interface IParams {
  name: string
}

function FlagPage() {
  const toast = useToast()
  const params = useParams<IParams>()
  const history = useHistory()
  const queryClient = useQueryClient()

  const [flag, setFlag] = usePropState<IFlag | undefined>(undefined)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const environment = useFlagEnvironment(flag?.environmentName)

  const { data, isFetching } = useQuery(
    [ApiQueryId.getFlagByName, params.name],
    () => FlagsApi.getFlagByName(params.name),
    {
      onSuccess: (flag: IFlag) => {
        setFlag(flag)
      },
    }
  )

  const updateFlagMutation = useMutation(FlagsApi.updateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)
      history.push(RoutePage.flags())

      toast({
        title: `Updated successfully`,
        position: 'top-right',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function onDirty() {
    if (!isDirty) {
      setIsDirty(true)
    }
  }

  function toggleStatus() {
    setFlag({ ...flag, enabled: !flag?.enabled } as IFlag)
    onDirty()
  }

  function formatNameSnakeCase() {
    setFlag({ ...flag, name: _.snakeCase(flag?.name as string) } as IFlag)
  }

  function onNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value

    if (value.length > 40) {
      return
    }

    setFlag({ ...flag, name: value } as IFlag)
    onDirty()
  }

  function onDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setFlag({ ...flag, description: event.target.value } as IFlag)
    onDirty()
  }

  function onUpdate() {
    updateFlagMutation.mutate(flag as IFlag)
  }

  if (isFetching) {
    return (
      <BoxedPage>
        <Box display="flex">
          <BackLink to={{ pathname: RoutePage.flags() }}>
            <IconButton
              mt="2px"
              aria-label="Back button"
              icon={<Icon strokeWidth={2.4} w={4} h={4} as={FiChevronLeft} />}
            />
          </BackLink>

          <Heading display="flex" alignItems="center" flex={1} ml={3} as="h3" size="lg">
            <FlagsLink to={RoutePage.flags()}>Flags</FlagsLink>
            <Spinner ml={4} size="sm" />
          </Heading>
        </Box>
      </BoxedPage>
    )
  }

  if (!flag) {
    return (
      <BoxedPage>
        <Box display="flex">
          <BackLink to={{ pathname: RoutePage.flags() }}>
            <IconButton
              mt="2px"
              aria-label="Back button"
              icon={<Icon strokeWidth={2.4} w={4} h={4} as={FiChevronLeft} />}
            />
          </BackLink>

          <Heading display="flex" alignItems="center" flex={1} ml={3} as="h3" size="lg">
            <FlagsLink to={RoutePage.flags()}>Flag not found</FlagsLink>
          </Heading>
        </Box>
      </BoxedPage>
    )
  }

  return (
    <BoxedPage>
      <Box mb={10} display="flex">
        <BackLink to={{ pathname: RoutePage.flags() }}>
          <IconButton
            mt="2px"
            aria-label="Back button"
            icon={<Icon strokeWidth={2.4} w={4} h={4} as={FiChevronLeft} />}
          />
        </BackLink>

        <Heading
          display="flex"
          alignItems="center"
          overflow="hidden"
          whiteSpace="nowrap"
          flex={1}
          ml={3}
          mr={4}
          as="h3"
          size="lg"
        >
          <FlagsLink style={{ marginRight: 8 }} to={RoutePage.flags()}>
            Flags
          </FlagsLink>
          &gt; {flag.name}
        </Heading>

        <Button
          isLoading={updateFlagMutation.isLoading}
          loadingText="Updating"
          onClick={onUpdate}
          ml="auto"
          colorScheme="blue"
          disabled={!isDirty || updateFlagMutation.isLoading || _.isEqual(flag, data) || flag.name.length < 3}
        >
          Update
        </Button>
      </Box>

      <Section mb={4}>
        <Heading mb={1} as="h5" size="sm">
          Status
        </Heading>

        <Text color="gray.500" mb={2}>
          You can toggle the status below but takes effect
          <br />
          after you complete the update.
        </Text>

        <FormControl display="flex" alignItems="center">
          <Switch id="status" mr={2} size="md" isChecked={flag.enabled} onChange={toggleStatus} colorScheme="green" />

          <FormLabel cursor="pointer" fontWeight="normal" htmlFor="status" mb="0">
            {flag.enabled ? 'Enabled' : 'Disabled'}
          </FormLabel>
        </FormControl>
      </Section>

      <Section mb={4}>
        <Heading mb={2} as="h5" size="sm">
          Environment
        </Heading>

        <Tag variant="subtle" colorScheme={environment?.color}>
          {flag.environmentName}
        </Tag>
      </Section>

      <Section>
        <Heading mb={2} as="h5" size="sm">
          Information
        </Heading>

        <FormControl id="name">
          <FormLabel fontSize="sm" color="gray.500">
            Name
          </FormLabel>

          <Input
            onBlur={formatNameSnakeCase}
            value={flag.name}
            onChange={onNameChange}
            variant="filled"
            placeholder="Name"
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
            onChange={onDescriptionChange}
            value={flag.description}
          />
        </FormControl>
      </Section>
    </BoxedPage>
  )
}

export default FlagPage

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const FlagsLink = styled(NavLink)`
  :hover {
    text-decoration: underline;
  }
`
