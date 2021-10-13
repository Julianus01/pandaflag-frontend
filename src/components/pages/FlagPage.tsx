import { Box, Heading, IconButton, Icon, Spinner, Text, Switch, FormControl, FormLabel } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import BoxedPage from 'components/styles/BoxedPage'
import usePropState from 'hooks/common/usePropState'
import { FiArrowLeft } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components/macro'

interface IParams {
  id: string
}

function FlagPage() {
  const history = useHistory()
  const params = useParams<IParams>()

  const [flag, setFlag] = usePropState<IFlag | undefined>(undefined)

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

        <Text fontWeight="bold">Status</Text>
        <Text color="gray.500" mb={4}>
          You can toggle the status with the control below.
        </Text>

        <FormControl display="flex" alignItems="center">
          <Switch id="status" mr={4} size="md" isChecked={flag.enabled} onChange={toggleStatus} colorScheme="green" />

          <FormLabel fontWeight="normal" htmlFor="status" mb="0">
            {flag.enabled ? 'Enabled' : 'Disabled'}
          </FormLabel>
        </FormControl>
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
