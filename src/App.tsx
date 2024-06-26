import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import { useDispatch, useSelector } from 'react-redux'
import { authActions, IUser } from 'redux/ducks/authDuck'
import OrganizationsApi, { IOrganization } from 'api/OrganizationsApi'
import { useQuery, useQueryClient } from 'react-query'
import { ApiQueryId } from 'api/ApiQueryId'
import { configurationActions } from 'redux/ducks/configurationDuck'
import { getAuth } from '@firebase/auth'
import { IStoreState } from 'redux/store'
import UsersApi from 'api/UsersApi'
import ErrorBoundary from 'components/shared/ErrorBoundary'
import { useFlags } from 'pandaflag-react'
import LoadingPage from 'components/pages/LoadingPage'

function useInitUserAndOrganization(): boolean {
  const dispatch = useDispatch()
  const user = useSelector((state: IStoreState) => state.auth.user)
  const [initialized, setInitialized] = useState<boolean>(false)
  const queryClient = useQueryClient()

  useQuery(ApiQueryId.getOrganization, () => OrganizationsApi.getOrganization(), {
    enabled: !!user,
    onSuccess: (organization: IOrganization) => {
      dispatch(configurationActions.setOrganization(organization))
      setInitialized(true)
    },
  })

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = auth.onAuthStateChanged((user: IUser | null) => {
      if (user) {
        dispatch(authActions.authStateChanged(user))
        UsersApi.updateUser(user)
      } else {
        dispatch(configurationActions.setOrganization(undefined))
        dispatch(configurationActions.setProject(undefined))
        dispatch(authActions.authStateChanged(user))
        setInitialized(true)

        // Remove all queries and caches
        queryClient.resetQueries()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch, queryClient])

  return initialized
}

function App() {
  const flagsData = useFlags()
  const initialized = useInitUserAndOrganization()

  if (!initialized || flagsData.isLoading) {
    return <LoadingPage />
  }

  return (
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  )
}

export default App
