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
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import AutoTextArea from 'components/styles/AutoTextarea'
import BoxedPage from 'components/styles/BoxedPage'
import FixedFooter from 'components/styles/FixedFooter'
import usePropState from 'hooks/common/usePropState'
import useFlagEnvironment from 'hooks/flag/useEnvironmentColor'
import { ChangeEvent, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, NavLink, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import _ from 'lodash/fp'

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

  const { data, isFetching } = useQuery([ApiQueryId.getFlagByName, params.name], () => FlagsApi.getFlagByName(params.name), {
    onSuccess: (flag: IFlag) => {
      setFlag(flag)
    },
  })

  const updateFlagMutation = useMutation(FlagsApi.updateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)
      history.push(RoutePage.flags())

      toast({
        title: `Updated successfully`,
        position: 'top',
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

  function onInputChange(key: string) {
    return function (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setFlag({ ...flag, [key]: event.target.value } as IFlag)
      onDirty()
    }
  }

  function onUpdate() {
    updateFlagMutation.mutate(flag as IFlag)
  }

  if (isFetching) {
    return (
      <Container>
        <Box display="flex">
          <Heading flex={1} mb={10} as="h3" size="lg">
            <FlagsLink to={RoutePage.flags()}>Flags</FlagsLink>
            <Spinner ml={4} size="sm" />
          </Heading>
        </Box>

        <FixedFooter>
          <BackLink to={{ pathname: RoutePage.flags() }}>
            <Button size="sm" variant="ghost" leftIcon={<Icon as={FiArrowLeft} />}>
              Back
            </Button>
          </BackLink>
        </FixedFooter>
      </Container>
    )
  }

  if (!flag) {
    return (
      <Container>
        <Box display="flex">
          <Heading flex={1} mb={10} as="h3" size="lg">
            <FlagsLink to={RoutePage.flags()}>Flag not found</FlagsLink>
          </Heading>
        </Box>

        <FixedFooter>
          <BackLink to={{ pathname: RoutePage.flags() }}>
            <Button size="sm" variant="ghost" leftIcon={<Icon as={FiArrowLeft} />}>
              Back
            </Button>
          </BackLink>
        </FixedFooter>
      </Container>
    )
  }

  return (
    <Container>
      <Box display="flex">
        <Heading flex={1} mb={10} as="h3" size="lg">
          <FlagsLink to={RoutePage.flags()}>Flags</FlagsLink> &gt; {flag.name}
        </Heading>
      </Box>

      <Heading as="h5" size="sm">
        Status
      </Heading>

      <Text fontSize="md" color="gray.500" mb={2}>
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

      <Heading mt={10} mb={2} as="h5" size="sm">
        Environment
      </Heading>

      <Tag variant="subtle" colorScheme={environment?.color}>
        {flag.environmentName}
      </Tag>

      <Heading mt={10} mb={2} as="h5" size="sm">
        Information
      </Heading>

      <FormControl id="name">
        <FormLabel fontWeight="normal" mb={2} fontSize="xs" color="gray.500">
          Name
        </FormLabel>

        <Input
          onBlur={formatNameSnakeCase}
          value={flag.name}
          onChange={onInputChange('name')}
          variant="filled"
          placeholder="Name"
          mb={4}
        />
      </FormControl>

      <FormControl id="description">
        <FormLabel fontWeight="normal" mb={2} fontSize="xs" color="gray.500">
          Description
        </FormLabel>

        <AutoTextArea
          borderRadius="md"
          variant="filled"
          placeholder="Description"
          size="sm"
          resize="none"
          onChange={onInputChange('description')}
          value={flag.description}
        />
      </FormControl>

      <FixedFooter>
        <BackLink to={{ pathname: RoutePage.flags() }}>
          <Button size="sm" variant="ghost" leftIcon={<Icon as={FiArrowLeft} />}>
            Back
          </Button>
        </BackLink>

        <Button
          isLoading={updateFlagMutation.isLoading}
          loadingText="Updating"
          onClick={onUpdate}
          size="sm"
          ml="auto"
          colorScheme="blue"
          disabled={!isDirty || updateFlagMutation.isLoading || _.isEqual(flag, data)}
        >
          Update
        </Button>
      </FixedFooter>
    </Container>
  )
}

export default FlagPage

const Container = styled(BoxedPage)`
  padding-bottom: ${({ theme }) => theme.space[40]};
`

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
