import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

function LoginPage() {
  const { loginWithRedirect } = useAuth0()

  useEffect(() => {
    loginWithRedirect()
  }, [loginWithRedirect])

  return null
}

export default LoginPage
