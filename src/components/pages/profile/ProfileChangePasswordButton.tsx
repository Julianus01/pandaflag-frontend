import { Button, useToast } from '@chakra-ui/react'
import AuthApi from 'api/AuthApi'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { IStoreState } from 'redux/store'

interface IProps {
  hasEmailProvider: boolean
}

function ProfileChangePasswordButton({ hasEmailProvider }: IProps) {
  const toast = useToast()
  const user = useSelector((state: IStoreState) => state.auth.user)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasBeenSent, setHasBeenSent] = useState<boolean>(false)

  const buttonText = hasEmailProvider ? 'Change' : 'Setup password'

  async function onChangePassword() {
    try {
      setIsLoading(true)
      await AuthApi.sendPasswordReset(user?.email as string)
      setIsLoading(false)
      setHasBeenSent(true)

      toast({
        title: `Reset password email sent 📬`,
        isClosable: true,
        variant: 'subtle',
      })
    } catch {
      toast({
        title: `Something went wrong`,
        isClosable: true,
        variant: 'subtle',
        status: 'error',
      })

      setIsLoading(false)
    }
  }

  return (
    <Button
      loadingText={buttonText}
      isLoading={isLoading}
      disabled={isLoading || hasBeenSent}
      onClick={onChangePassword}
    >
      {!hasBeenSent && buttonText}
      {hasBeenSent && 'Request sent'}
    </Button>
  )
}

export default ProfileChangePasswordButton
