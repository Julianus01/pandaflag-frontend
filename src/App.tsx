import { useAuth } from 'hooks/authHooks'
import { useEffect, useState } from 'react'
import Routes from './components/routes/Routes'
import { useUnmount } from 'react-use'
import LSUtils from 'utils/LSUtils'

function App() {
  const { user, isLoading } = useAuth()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (isInitialized) {
      return
    }

    if (!isLoading && user) {
      LSUtils.saveUser(user)
      setIsInitialized(true)
    }

    if (!isLoading && !user) {
      setIsInitialized(true)
    }
  }, [isLoading, user, isInitialized])

  useUnmount(() => {
    LSUtils.removeUser()
  })

  if (!isInitialized) {
    return null
  }

  return <Routes />
}

export default App
