import {
  Box,
  Heading,
  Icon,
  Spinner,
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
import { ChangeEvent, useMemo, useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, NavLink, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import _ from 'lodash/fp'
import Section from 'components/styles/Section'
import { IEnvironment } from 'api/EnvironmentsApi'

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

  const sortedFlagEnvironments = useMemo(() => {
    return flag?.environments.sort((a, b) => b.name.localeCompare(a.name))
  }, [flag])

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

  function toggleStatus(environmentId: string) {
    const newEnvironments: IEnvironment[] = flag?.environments.map((environment: IEnvironment) => {
      if (environment.id === environmentId) {
        return { ...environment, enabled: !environment.enabled }
      }

      return environment
    }) as IEnvironment[]

    setFlag({ ...flag, environments: newEnvironments } as IFlag)
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
        <Heading mb={4} as="h5" size="sm">
          Status
        </Heading>

        {sortedFlagEnvironments?.map((flagEnvironment: IEnvironment) => (
          <EnvStatusContainer key={flagEnvironment.id}>
            <Tag variant="subtle" colorScheme={flagEnvironment?.color}>
              #{flagEnvironment.name}
            </Tag>

            <FormControl ml="auto" width="auto" display="flex" alignItems="center">
              <FormLabel
                color={flagEnvironment.enabled ? '' : 'gray.500'}
                fontSize="sm"
                cursor="pointer"
                htmlFor={`status-${flagEnvironment.name}`}
                mb="0"
              >
                {flagEnvironment.enabled ? 'Enabled' : 'Disabled'}
              </FormLabel>

              <Switch
                id={`status-${flagEnvironment.name}`}
                mr={2}
                size="md"
                isChecked={flagEnvironment.enabled}
                onChange={() => toggleStatus(flagEnvironment.id)}
                colorScheme="green"
              />
            </FormControl>
          </EnvStatusContainer>
        ))}
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

const EnvStatusContainer = styled(Box)`
  display: flex;
  align-items: center;

  :not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space[4]};
  }
`
