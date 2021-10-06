import { useAuth0 } from '@auth0/auth0-react'
import Routes from './components/routes/Routes'

function App() {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return null
  }

  return <Routes />
}

export default App
