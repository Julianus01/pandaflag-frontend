import { useAuth } from 'hooks/authHooks'
import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import ApiUtils from 'utils/ApiUtils'
import { useUnmount } from 'react-use'

function App() {
  const { user, isLoading } = useAuth()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (isInitialized) {
      return
    }

    if (!isLoading && user) {
      ApiUtils.saveUserInLS(user)
      setIsInitialized(true)
    }

    if (!isLoading && !user) {
      setIsInitialized(true)
    }
  }, [isLoading, user, isInitialized])

  useUnmount(() => {
    ApiUtils.removeUserFromLS()
  })

  if (!isInitialized) {
    return null
  }

  return <Routes />
}

export default App
