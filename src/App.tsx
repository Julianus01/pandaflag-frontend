import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import { useDispatch } from 'react-redux'
import { authActions, IUser } from 'redux/ducks/authDuck'
import { useAuth0, User as Auth0User } from '@auth0/auth0-react'

function mapUserWithId(user: Auth0User | undefined): IUser | undefined {
  if (!user) {
    return undefined
  }

  return { ...user, id: user.sub?.replace('auth0|', '') as string }
}

function useInitStoreUser(): boolean {
  const dispatch = useDispatch()
  const { user: auth0User, isLoading } = useAuth0()
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (auth0User) {
      dispatch(authActions.authStateChanged(mapUserWithId(auth0User)))
      setInitialized(true)
    } else {
      dispatch(authActions.authStateChanged(undefined))
      setInitialized(true)
    }
  }, [auth0User, dispatch, isLoading])

  return initialized
}

function App() {
  const initialized = useInitStoreUser()

  if (!initialized) {
    return null
  }

  return <Routes />
}

export default App
