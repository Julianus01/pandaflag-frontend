import {
  Box,
  Heading,
  IconButton,
  Icon,
  Spinner,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Tag,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import AutoTextArea from 'components/styles/AutoTextarea'
import BoxedPage from 'components/styles/BoxedPage'
import usePropState from 'hooks/common/usePropState'
import useFlagEnvironment from 'hooks/flag/useEnvironmentColor'
import { ChangeEvent } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components/macro'
import CommonUtils from 'utils/CommonUtils'

interface IParams {
  id: string
}

function FlagPage() {
  const history = useHistory()
  const params = useParams<IParams>()

  const [flag, setFlag] = usePropState<IFlag | undefined>(undefined)
  const environment = useFlagEnvironment(flag?.environmentName)

  const { isFetching } = useQuery([ApiQueryId.getFlag, params.id], () => FlagsApi.getFlag(params.id), {
    onSuccess: (flag: IFlag) => {
      setFlag(flag)
    },
  })

  function onBack() {
    history.push(RoutePage.flags())
  }

  function toggleStatus() {
    setFlag({ ...flag, enabled: !flag?.enabled } as IFlag)
  }

  function onInputChange(key: string) {
    return function (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setFlag({ ...flag, [key]: event.target.value } as IFlag)
    }
  }

  if (isFetching) {
    return (
      <BoxedPage>
        <Spinner />
      </BoxedPage>
    )
  }

  if (!flag) {
    return <div>No such flag</div>
  }

  return (
    <BoxedPage>
      <Container>
        <BackContainer>
          <IconButton
            onClick={onBack}
            mr="2"
            size="xs"
            aria-label="back"
            icon={<Icon as={FiArrowLeft} strokeWidth={2.4} />}
          />
        </BackContainer>

        <Box display="flex">
          <Heading flex={1} mb={10} as="h3" size="lg">
            {flag.name}
          </Heading>
        </Box>

        <Heading as="h5" size="sm">
          Status
        </Heading>
        <Text color="gray.500" mb={2}>
          You can toggle the status below but update to take effect.
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

        <Input
          onKeyDown={CommonUtils.stopPropagation}
          value={flag.name}
          onChange={onInputChange('name')}
          variant="filled"
          placeholder="Name"
          mb={2}
        />

        <AutoTextArea
          onKeyDown={CommonUtils.stopPropagation}
          borderRadius="md"
          variant="filled"
          placeholder="Description"
          size="sm"
          resize="none"
          onChange={onInputChange('description')}
          value={flag.description}
        />
      </Container>
    </BoxedPage>
  )
}

export default FlagPage

const Container = styled.div`
  position: relative;
`

const BackContainer = styled.div`
  position: absolute;
  left: 0;
  top: -35px;
`
