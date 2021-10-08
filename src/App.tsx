import { useAuth } from 'hooks/authHooks'
import Routes from './components/routes/Routes'

function App() {
  const auth = useAuth()

  if (auth.isLoading) {
    return null
  }

  return <Routes />
}

export default App
