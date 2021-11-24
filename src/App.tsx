import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import { useDispatch } from 'react-redux'
import { authActions, IUser } from 'redux/ducks/authDuck'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { useQuery } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import { configurationActions } from 'redux/ducks/configurationDuck'
import { getAuth } from '@firebase/auth'
import { useAuth } from 'hooks/auth/useAuth'

function useInitUserAndOrganization(): boolean {
  const dispatch = useDispatch()
  const user = useAuth()
  const [initialized, setInitialized] = useState<boolean>(false)

  useQuery(ApiQueryId.getOrganization, OrganizationsApi.getOrganization, {
    enabled: !!user,
    onSuccess: (organization: IOrganization) => {
      dispatch(configurationActions.setOrganization(organization))
      setInitialized(true)
    },
  })

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = auth.onAuthStateChanged((user: IUser | null) => {
      dispatch(authActions.authStateChanged(user))

      if (!user) {
        setInitialized(true)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch])

  return initialized
}

function App() {
  const initialized = useInitUserAndOrganization()

  if (!initialized) {
    return null
  }

  return <Routes />
}

export default App
