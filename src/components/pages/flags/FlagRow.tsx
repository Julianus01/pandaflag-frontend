import { Box, Icon, IconButton, Spinner, Td, Tooltip, Tr, Switch, useToast, HStack } from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import { FiEdit2 } from 'react-icons/fi'
import { useQueryClient, useMutation } from 'react-query'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components/macro'
import FlagRemoveButton from './FlagRemoveButton'
import ReactGa from 'react-ga'
import { GaActionFlag, GaCategory } from 'utils/GaUtils'
import { useEffect, useState } from 'react'
import { IEnvironment } from 'api/EnvironmentsApi'
import { Link } from 'react-router-dom'

function isFlagEnabled(flag: IFlag, environmentName: string): boolean {
  const foundEnvironment = flag.environments.find((environment: IEnvironment) => environment.name === environmentName)

  return foundEnvironment?.enabled as boolean
}

interface IFlagSwitchProps {
  flag: IFlag
  environmentName: string
}

function FlagSwitch({ flag, environmentName }: IFlagSwitchProps) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [enabled, setEnabled] = useState<boolean>(isFlagEnabled(flag, environmentName))

  useEffect(() => {
    setEnabled(isFlagEnabled(flag, environmentName))
  }, [flag, environmentName])

  const updateFlagMutation = useMutation(FlagsApi.updateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)

      toast({
        title: `Flag '${flag.name}' is now ${!enabled ? 'Enabled' : 'Disabled'} for '${environmentName}'`,
        position: 'top-right',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function toggleStatus() {
    ReactGa.event({
      category: GaCategory.editing,
      action: GaActionFlag.toggle,
    })

    setEnabled(!enabled)

    const newEnvironments: IEnvironment[] = flag?.environments.map((environment: IEnvironment) => {
      if (environment.name === environmentName) {
        return { ...environment, enabled: !environment.enabled }
      }

      return environment
    }) as IEnvironment[]

    updateFlagMutation.mutate({ id: flag.id, environments: newEnvironments })
  }

  return (
    <Box position="relative" display="flex" alignItems="center" justifyContent="flex-end">
      {updateFlagMutation.isLoading && <AbsoluteSpinner size="sm" />}

      {/* Couldn't use isDisabled from Switch because there is focus bug */}
      {/* After disabled, focus was stuck on Switch component */}
      {/* Potential thread to follow */}
      {/* https://giters.com/chakra-ui/chakra-ui/issues/4596 */}
      <SwitchContainer disabled={updateFlagMutation.isLoading}>
        <Switch ml={4} size="md" isChecked={enabled} onChange={toggleStatus} colorScheme="green" shadow="none" />
      </SwitchContainer>
    </Box>
  )
}

interface IProps {
  flag: IFlag
}

function FlagRow({ flag }: IProps) {
  const history = useHistory()

  function onEdit() {
    history.push(RoutePage.flag(flag.name))
  }

  return (
    <Row>
      <Td>
        <FlagLink to={RoutePage.flag(flag.name)}>{flag.name}</FlagLink>
      </Td>

      {flag.environments.map((flagEnvironment: IEnvironment) => (
        <Td key={flagEnvironment.id}>
          <FlagSwitch flag={flag} environmentName={flagEnvironment.name} />
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
  top: 2px;
  right: 46px;
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

const FlagLink = styled(Link)`
  :hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.blue[400]};
  }
`
