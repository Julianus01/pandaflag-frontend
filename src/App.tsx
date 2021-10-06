import { useAuth0 } from '@auth0/auth0-react'
import Routes from './components/routes/Routes'

function App() {
  const auth0 = useAuth0()

  if (auth0.isLoading) {
    return null
  }

  return <Routes />
}

export default App
