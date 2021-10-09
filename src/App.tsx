import { useAuth } from 'hooks/authHooks'
import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import ApiUtils from 'utils/ApiUtils'
import { useUnmount } from 'react-use'

function App() {
  const { user } = useAuth()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (user?.id) {
      ApiUtils.saveUserIdInLS(user?.id)
      setIsInitialized(true)
    }
  }, [user?.id])

  useUnmount(() => {
    ApiUtils.removeUserIdFromLS()
  })

  if (!isInitialized) {
    return null
  }

  return <Routes />
}

export default App
