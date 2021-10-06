import { Auth0Provider } from '@auth0/auth0-react'
import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

function AuthenticationProvider({ children }: IProps) {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      redirectUri={window.location.origin}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}

export default AuthenticationProvider
