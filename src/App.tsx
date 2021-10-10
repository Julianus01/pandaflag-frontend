import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import { useDispatch } from 'react-redux'
import { authActions, IUser } from 'redux/ducks/authDuck'
import { useAuth0 } from '@auth0/auth0-react'

function useInitStoreUser(): boolean {
  const dispatch = useDispatch()
  const { user: auth0User, isLoading } = useAuth0()
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (auth0User) {
      dispatch(authActions.authStateChanged(auth0User as Required<IUser>))
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
