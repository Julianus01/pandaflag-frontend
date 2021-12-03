import { Box, Icon, IconButton, Spinner, Td, Tooltip, Tr, Switch, useToast, HStack } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag, IFlagEnvironment } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import usePropState from 'hooks/common/usePropState'
import moment from 'moment'
import { FiEdit2 } from 'react-icons/fi'
import { useQueryClient, useMutation } from 'react-query'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components/macro'
import FlagRemoveButton from './FlagRemoveButton'
import ReactGa from 'react-ga'
import { GaActionFlag, GaCategory } from 'utils/GaUtils'

interface IProps {
  flag: IFlag
}

function FlagRow({ flag }: IProps) {
  const toast = useToast()
  const history = useHistory()
  const queryClient = useQueryClient()

  // const [enabled, setEnabled] = usePropState(flag.enabled)

  const updateFlagMutation = useMutation(FlagsApi.updateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)

      // toast({
      //   title: `Flag '${flag.name}' is now ${!enabled ? 'Enabled' : 'Disabled'} for '${flag.environmentName}'`,
      //   position: 'top-right',
      //   isClosable: true,
      //   variant: 'subtle',
      //   status: 'success',
      // })
    },
  })

  function toggleStatus() {
    ReactGa.event({
      category: GaCategory.editing,
      action: GaActionFlag.toggle,
    })

    // setEnabled(!enabled)
    // updateFlagMutation.mutate({ id: flag.id, enabled: !flag.enabled })
  }

  function onEdit() {
    history.push(RoutePage.flag(flag.name))
  }

  return (
    <Row>
      <Td>{flag.name}</Td>

      {flag.environments.map((flagEnvironment: IFlagEnvironment) => (
        <Td key={flagEnvironment.id} isNumeric>
          {updateFlagMutation.isLoading && <AbsoluteSpinner size="sm" />}

          {/* Couldn't use isDisabled from Switch because there is focus bug */}
          {/* After disabled, focus was stuck on Switch component */}
          {/* Potential thread to follow */}
          {/* https://giters.com/chakra-ui/chakra-ui/issues/4596 */}
          <SwitchContainer disabled={updateFlagMutation.isLoading}>
            <Switch ml={4} size="md" isChecked={false} onChange={toggleStatus} colorScheme="green" shadow="none" />
          </SwitchContainer>
        </Td>
      ))}

      <Td>
        <HStack spacing="2" display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Edit">
            <Box>
              <IconButton onClick={onEdit} size="xs" aria-label="edit" icon={<Icon as={FiEdit2} />} />
            </Box>
          </Tooltip>

          <Tooltip placement="top" label="Remove">
            <Box>
              <FlagRemoveButton flag={flag} />
            </Box>
          </Tooltip>
        </HStack>
      </Td>
    </Row>
  )
}

export default FlagRow

const AbsoluteSpinner = styled(Spinner)`
  position: absolute;
  top: 20px;
  transform: translateY(-50%);
  left: 66px;
`

const Row = styled(Tr)`
  :last-child {
    > td {
      border: 0;
    }
  }
`

const SwitchContainer = styled.div<{ disabled: boolean }>`
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    `};
`
