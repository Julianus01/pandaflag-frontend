import { useAuth } from 'hooks/auth/useAuth'
import { useEffect } from 'react'

function LoginPage() {
  const { loginWithRedirect } = useAuth()

  useEffect(() => {
    loginWithRedirect()
  }, [loginWithRedirect])

  return null
}

export default LoginPage
