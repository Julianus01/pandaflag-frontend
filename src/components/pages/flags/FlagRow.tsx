import {
  Box,
  Button,
  Icon,
  IconButton,
  Spinner,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  useToast,
  HStack,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import FlagsApi, { IFlag } from 'api/FlagsApi'
import RoutePage from 'components/routes/RoutePage'
import usePropState from 'hooks/common/usePropState'
import moment from 'moment'
import { FiEdit2, FiMinus } from 'react-icons/fi'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components/macro'

interface IRemoveButtonProps {
  flag: IFlag
}

function RemoveButton({ flag }: IRemoveButtonProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { isFetching: flagsFetching } = useQuery(ApiQueryId.getFlags, FlagsApi.getFlags)
  const deleteMutation = useMutation(FlagsApi.deleteFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)

      toast({
        title: `Removed flag '${flag.name} for ${flag.environmentName}'`,
        position: 'top',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function deleteFlag() {
    onClose()
    deleteMutation.mutate(flag.id)
  }

  return (
    <Popover placement="left" isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <IconButton
          disabled={deleteMutation.isLoading}
          onClick={onOpen}
          size="xs"
          aria-label="delete"
          icon={deleteMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
        />
      </PopoverTrigger>

      <PopoverContent _focus={{ boxShadow: 'none', outline: 'none' }}>
        <PopoverBody textAlign="right" shadow="lg" p="4">
          <Text textAlign="left" mb="4">
            Are you sure you want to delete this project?
          </Text>

          <Button
            isDisabled={flagsFetching}
            textAlign="right"
            onClick={deleteFlag}
            size="sm"
            colorScheme="red"
            variant="ghost"
          >
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

interface IProps {
  flag: IFlag
}

function FlagRow({ flag }: IProps) {
  const toast = useToast()
  const history = useHistory()
  const queryClient = useQueryClient()

  const [enabled, setEnabled] = usePropState(flag.enabled)

  const updateFlagMutation = useMutation(FlagsApi.updateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(ApiQueryId.getFlags)

      toast({
        title: `Flag '${flag.name}' is now ${!enabled ? 'Enabled' : 'Disabled'} for '${flag.environmentName}'`,
        position: 'top',
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })
    },
  })

  function toggleStatus() {
    setEnabled(!enabled)
    updateFlagMutation.mutate({ id: flag.id, enabled: !flag.enabled })
  }

  function onEdit() {
    history.push(RoutePage.flag(flag.id))
  }

  return (
    <Tr>
      <Td>{flag.name}</Td>

      <Td position="relative">
        {/* Couldn't use isDisabled from Switch because there is focus bug */}
        {/* After disabled, focus was stuck on Switch component */}
        {/* Potential thread to follow */}
        {/* https://giters.com/chakra-ui/chakra-ui/issues/4596 */}
        <SwitchContainer disabled={updateFlagMutation.isLoading}>
          <Switch mr={4} size="md" isChecked={enabled} onChange={toggleStatus} colorScheme="green" shadow="none" />
        </SwitchContainer>

        {updateFlagMutation.isLoading && <AbsoluteSpinner size="sm" />}
      </Td>

      <Td isNumeric>{moment.unix(flag.createdAt).format('Do MMM YYYY')}</Td>

      <Td>
        <HStack spacing="2" display="flex" justifyContent="flex-end">
          <Tooltip placement="top" label="Edit">
            <Box>
              <IconButton onClick={onEdit} size="xs" aria-label="edit" icon={<Icon as={FiEdit2} />} />
            </Box>
          </Tooltip>

          <Tooltip placement="top" label="Remove">
            <Box>
              <RemoveButton flag={flag} />
            </Box>
          </Tooltip>
        </HStack>
      </Td>
    </Tr>
  )
}

export default FlagRow

const AbsoluteSpinner = styled(Spinner)`
  position: absolute;
  top: 20px;
  transform: translateY(-50%);
  left: 66px;
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
