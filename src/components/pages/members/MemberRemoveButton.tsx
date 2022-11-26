import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverTrigger,
  Spinner,
  useDisclosure,
  PopoverContent,
  Text,
  PopoverBody,
  useToast,
} from '@chakra-ui/react'
import { ApiQueryId } from 'api/ApiQueryId'
import UsersApi, { IMember } from 'api/UsersApi'
import { FiMinus } from 'react-icons/fi'
import { useMutation, useQueryClient } from 'react-query'
import { UserUtils } from 'utils/UserUtils'

interface IProps {
  member: IMember
}

function MemberRemoveButton({ member }: IProps) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const removeMutation = useMutation(UsersApi.removeMemberFromOrganization, {
    onSuccess: () => {
      queryClient.setQueryData(ApiQueryId.getMembers, (oldData: unknown) => {
        const oldMembers = oldData as IMember[]
        return oldMembers?.filter((oldMember: IMember) => oldMember.uid !== member.uid)
      })

      toast({
        title: `Removed member '${UserUtils.userDisplayName(member)}' 📦`,
        isClosable: true,
        variant: 'subtle',
        status: 'success',
      })

      queryClient.invalidateQueries(ApiQueryId.getOrganization)
    },
  })

  function removeMemberFromOrganization() {
    onClose()
    removeMutation.mutate(member.uid)
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <IconButton
          disabled={removeMutation.isLoading}
          onClick={onOpen}
          size="xs"
          aria-label="delete"
          icon={removeMutation.isLoading ? <Spinner size="xs" /> : <Icon as={FiMinus} strokeWidth={2.4} />}
        />
      </PopoverTrigger>

      <PopoverContent w="auto" _focus={{ boxShadow: 'none', outline: 'none' }}>
        <PopoverBody display="flex" alignItems="center" shadow="lg" p="4">
          <Text fontSize="sm" mr="2">
            Are you sure you want to remove this member?
          </Text>

          <Button onClick={removeMemberFromOrganization} colorScheme="red" variant="ghost">
            Delete
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default MemberRemoveButton
