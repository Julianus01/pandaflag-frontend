import { useAuth } from 'hooks/authHooks'
import { useEffect } from 'react'

function LoginPage() {
  const { loginWithRedirect } = useAuth()

  useEffect(() => {
    loginWithRedirect()
  }, [loginWithRedirect])

  return null
}

export default LoginPage
