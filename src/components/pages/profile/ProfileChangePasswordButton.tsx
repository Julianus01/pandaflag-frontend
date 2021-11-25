import { Button, useToast } from '@chakra-ui/react'
import AuthApi from 'api/AuthApi'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

function ProfileChangePasswordButton() {
  const toast = useToast()
  const user = useSelector((state: IStoreState) => state.auth.user)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasBeenSent, setHasBeenSent] = useState<boolean>(false)

  async function onChangePassword() {
    try {
      setIsLoading(true)
      await AuthApi.sendPasswordReset(user?.email as string)
      setIsLoading(false)
      setHasBeenSent(true)

      toast({
        title: `Reset password email sent`,
        position: 'top-right',
        isClosable: true,
        variant: 'subtle',
      })
    } catch {
      toast({
        title: `Something went wrong`,
        position: 'top-right',
        isClosable: true,
        variant: 'subtle',
        status: 'error',
      })

      setIsLoading(false)
    }
  }

  return (
    <Button
      loadingText="Request change email"
      isLoading={isLoading}
      disabled={isLoading || hasBeenSent}
      onClick={onChangePassword}
    >
      {!hasBeenSent && 'Request change email'}
      {hasBeenSent && 'Request email sent'}
    </Button>
  )
}

export default ProfileChangePasswordButton
