import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import { useDispatch } from 'react-redux'
import { authActions, IUser } from 'redux/ducks/authDuck'
import { useAuth0 } from '@auth0/auth0-react'
import OrganizationApi, { IOrganization } from 'api/OrganizationApi'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import { configurationActions } from 'redux/ducks/configurationDuck'

function useInitStoreUser(): boolean {
  const dispatch = useDispatch()
  const { user: auth0User, isLoading } = useAuth0()
  const [initialized, setInitialized] = useState<boolean>(false)

  useQuery(ApiQueryId.getOrganization, OrganizationApi.getOrganization, {
    enabled: !!auth0User,
    onSuccess: (organization: IOrganization) => {
      dispatch(configurationActions.setOrganization(organization))
      setInitialized(true)
    },
  })

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (auth0User) {
      dispatch(authActions.authStateChanged(auth0User as Required<IUser>))
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
