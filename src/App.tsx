import { IUser, useAuth } from 'hooks/authHooks'
import { useEffect } from 'react'
import Routes from './components/routes/Routes'
import { useDispatch } from 'react-redux'
import { authActions } from 'redux/ducks/authDuck'

function useListenAndUpdateUserDuck(user: IUser | null) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(authActions.authStateChanged(user))
    }
  }, [user, dispatch])
}

function App() {
  const auth = useAuth()
  useListenAndUpdateUserDuck(auth.user)

  if (auth.isLoading) {
    return null
  }

  return <Routes />
}

export default App
