import { useAuth } from 'hooks/authHooks'
import { useEffect } from 'react'
import Routes from './components/routes/Routes'
import ApiUtils from 'utils/ApiUtils'
import { useUnmount } from 'react-use'

function useUpdateUserIdInLS(userId: string | undefined) {
  useEffect(() => {
    if (userId) {
      ApiUtils.saveUserIdInLS(userId)
    }
  }, [userId])

  useUnmount(() => {
    ApiUtils.removeUserIdFromLS()
  })
}

function App() {
  const { user, isLoading } = useAuth()
  useUpdateUserIdInLS(user?.id)

  if (isLoading) {
    return null
  }

  return <Routes />
}

export default App
